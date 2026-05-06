"""
Compute women's percentages per department from a huge CSV export.

Expected input columns:
    - Code du département
    - Libellé du département
    - Code sexe
    - Libellé de la fonction

The script streams the input file row by row and writes a semicolon-delimited CSV
with one line per department. Each percentage represents the share of women for the
department as a whole or for a specific function within that department.

Usage:
    uv run scripts/count_gender_by_department.py ~/Downloads/elus-conseillers-municipaux-cm.csv --output output.csv
    uv run scripts/count_gender_by_department.py ~/Downloads/elus-conseillers-municipaux-cm.csv --epci ~/Downloads/elus-conseillers-communautaires-epci.csv --output output.csv
    uv run scripts/count_gender_by_department.py ~/Downloads/elus-conseillers-municipaux-cm.csv --epci ~/Downloads/elus-conseillers-communautaires-epci.csv --departement ~/Downloads/elus-conseillers-departementaux-cd.csv --output output.csv
"""

from __future__ import annotations

import argparse
import csv
import importlib.util
from inspect import formatargvalues
import io
import re
import sys
from collections.abc import Iterable
from dataclasses import dataclass, field
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Count men and women per department from a CSV file."
    )
    parser.add_argument("input_csv", type=Path, help="Path to the source CSV file")
    parser.add_argument(
        "--epci",
        type=Path,
        default=None,
        help="Optional path to EPCI councillors CSV file.",
    )
    parser.add_argument(
        "--departement",
        type=Path,
        default=None,
        help="Optional path to departmental councillors CSV file.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Optional output CSV path. Defaults to stdout.",
    )
    return parser.parse_args()


def normalize_value(value: str | None) -> str:
    return (value or "").strip()


def detect_delimiter_from_header(header_line: str) -> str:
    comma_count = header_line.count(",")
    semicolon_count = header_line.count(";")
    if comma_count == 0 and semicolon_count == 0:
        raise ValueError("Unable to detect delimiter from header line")
    return ";" if semicolon_count >= comma_count else ","


def detect_delimiter_from_handle(handle: io.TextIOWrapper) -> str:
    """Read first non-empty line and detect delimiter."""
    header_line = ""
    while True:
        header_line = handle.readline()
        if not header_line:
            break
        if header_line.strip():
            break

    if not header_line:
        raise ValueError("Input file is empty")

    delimiter = detect_delimiter_from_header(header_line)
    handle.seek(0)
    return delimiter


def format_percentage(stats: CountStats) -> str:
    if stats.total_count == 0:
        return ""
    return f"{(stats.women_count / stats.total_count) * 100:.1f}"


def format_binary_woman_flag(stats: CountStats) -> str:
    return "1" if stats.women_count > 0 else "0"


def sort_department_code(code: str) -> tuple[int, str]:
    try:
        return (0, f"{int(code):03d}")
    except ValueError:
        return (1, code)


@dataclass
class CountStats:
    total_count: int = 0
    women_count: int = 0


@dataclass
class MuncipalCouncilStats:
    code: str
    name: str
    totals: CountStats = field(default_factory=CountStats)
    maire: CountStats = field(default_factory=CountStats)
    maire_prefecture: CountStats = field(default_factory=CountStats)
    premier_adjoint: CountStats = field(default_factory=CountStats)
    deuxieme_adjoint: CountStats = field(default_factory=CountStats)
    autres_adjoints: CountStats = field(default_factory=CountStats)
    autres_conseillers: CountStats = field(default_factory=CountStats)


# EPCI and departmental councils
@dataclass
class CouncilStats:
    conseil_total: CountStats = field(default_factory=CountStats)
    conseil_presidence: CountStats = field(default_factory=CountStats)


PREMIER_ADJOINT_PATTERN = re.compile(r"^1er\s+adjoint")
DEUXIEME_ADJOINT_PATTERN = re.compile(r"^2(?:e|eme|ème)\s+adjoint")


def select_bucket(function_name: str) -> str:
    label = function_name.strip().lower()
    if not label:
        return "autres_conseillers"
    if label == "maire":
        return "maire"
    if "1er adjoint" in label:
        return "premier_adjoint"
    if "2ème adjoint" in label:
        return "deuxieme_adjoint"
    if "adjoint" in label:
        return "autres_adjoints"
    raise ValueError(f"Unknown function label format: {function_name}")


def increment_stats(stats: CountStats, gender_code: str) -> None:
    stats.total_count += 1
    if gender_code == "F":
        stats.women_count += 1


def normalize_commune_code(raw_code: str) -> str:
    raw_code = raw_code.strip()
    if not raw_code:
        return ""
    if raw_code.startswith(("2A", "2B")):
        suffix = raw_code[2:]
        return raw_code[:2] + suffix.zfill(3)
    return raw_code.zfill(5)


def normalize_department_code(raw_code: str) -> str:
    raw_code = raw_code.strip().upper()
    if not raw_code:
        return ""
    if raw_code in {"2A", "2B"}:
        return raw_code
    try:
        return str(int(raw_code))
    except ValueError:
        return raw_code


def load_prefecture_commune_codes() -> set[str]:
    static_data_path = (
        Path(__file__).resolve().parents[1]
        / "scrapers"
        / "scrapers_ifp"
        / "static_data.py"
    )
    if not static_data_path.exists():
        raise FileNotFoundError(f"Missing static data file: {static_data_path}")

    spec = importlib.util.spec_from_file_location("ifp_static_data", static_data_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Unable to load module from: {static_data_path}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    prefectures = getattr(module, "prefectures", None)
    if not isinstance(prefectures, dict):
        raise ValueError("static_data.py must define a 'prefectures' dictionary")

    return {normalize_commune_code(str(code)) for code in prefectures.keys()}



def count_gender_by_department(
    input_csv: Path,
    epci_csv: Path | None = None,
    departemental_csv: Path | None = None,
) -> tuple[list[dict[str, str]], list[str]]:
    departments: dict[str, MuncipalCouncilStats] = {}
    prefectures = load_prefecture_commune_codes()
    epci_stats: dict[str, CouncilStats] = {}
    departemental_stats: dict[str, CouncilStats] = {}
    if epci_csv is not None and epci_csv.exists():
        epci_stats = _load_council_stats(epci_csv, "EPCI")
    if departemental_csv is not None and departemental_csv.exists():
        departemental_stats = _load_council_stats(departemental_csv, "departmental")

    with input_csv.open("r", encoding="utf-8-sig", newline="") as handle:
        delimiter = detect_delimiter_from_handle(handle)
        reader = csv.DictReader(handle, delimiter=delimiter, quotechar='"')

        required_fields = {
            "Code du département",
            "Libellé du département",
            "Code de la commune",
            "Code sexe",
            "Libellé de la fonction",
        }
        missing_fields = required_fields.difference(reader.fieldnames or [])
        if missing_fields:
            missing = ", ".join(sorted(missing_fields))
            raise ValueError(f"Missing required columns: {missing}")

        for row_number, row in enumerate(reader, start=2):
            department_code = normalize_department_code(
                normalize_value(row.get("Code du département"))
            )
            department_name = normalize_value(row.get("Libellé du département"))
            commune_code = normalize_commune_code(
                normalize_value(row.get("Code de la commune"))
            )
            gender_code = normalize_value(row.get("Code sexe"))
            function_name = normalize_value(row.get("Libellé de la fonction"))

            if not department_code or not department_name:
                continue

            department = departments.setdefault(
                department_code,
                MuncipalCouncilStats(code=department_code, name=department_name),
            )

            if gender_code not in {"M", "F"}:
                continue

            # Hack : do not consider "Maire délégué" for now
            if(function_name == "Maire délégué"):
                continue

            increment_stats(department.totals, gender_code)
            try:
                bucket = select_bucket(function_name)
            except ValueError as error:
                raise ValueError(f"Line {row_number}: {error}") from error
            increment_stats(getattr(department, bucket), gender_code)
            if bucket == "maire" and commune_code in prefectures:
                increment_stats(department.maire_prefecture, gender_code)

    rows: list[dict[str, str]] = []
    for department_code in sorted(departments, key=sort_department_code):
        department = departments[department_code]
        row = {
            "departement_code": department.code,
            "departement_libelle": department.name,
            "municipal_total": format_percentage(department.totals),
            "municipal_maire": format_percentage(department.maire),
            "municipal_maire_prefecture": format_binary_woman_flag(
                department.maire_prefecture
            ),
            "municipal_1er_adjoint": format_percentage(department.premier_adjoint),
            "municipal_2e_adjoint": format_percentage(department.deuxieme_adjoint),
            "municipal_autres_adjoints": format_percentage(department.autres_adjoints),
            "municipal_autres_conseillers": format_percentage(department.autres_conseillers),
            "epci_total": format_percentage(
                epci_stats.get(department_code, CouncilStats()).conseil_total
            ),
            "epci_presidence": format_percentage(
                epci_stats.get(department_code, CouncilStats()).conseil_presidence
            ),
            "departemental_total": format_percentage(
                departemental_stats.get(department_code, CouncilStats()).conseil_total
            ),
            "departemental_presidence": format_binary_woman_flag(
                departemental_stats.get(
                    department_code, CouncilStats()
                ).conseil_presidence
            ),
        }

        rows.append(row)

    fieldnames = [
        "departement_code",
        "departement_libelle",
        "municipal_total",
        "municipal_maire",
        "municipal_maire_prefecture",
        "municipal_1er_adjoint",
        "municipal_2e_adjoint",
        "municipal_autres_adjoints",
        "municipal_autres_conseillers",
        "epci_total",
        "epci_presidence",
        "departemental_total",
        "departemental_presidence",
    ]
    return rows, fieldnames


def _load_council_stats(csv_path: Path, source_label: str) -> dict[str, CouncilStats]:
    """Load council stats by department from an input CSV file."""
    council_stats: dict[str, CouncilStats] = {}

    with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
        delimiter = detect_delimiter_from_handle(handle)
        reader = csv.DictReader(handle, delimiter=delimiter, quotechar='"')

        required_fields = {
            "Code du département",
            "Code sexe",
            "Libellé de la fonction",
        }
        missing_fields = required_fields.difference(reader.fieldnames or [])
        if missing_fields:
            missing = ", ".join(sorted(missing_fields))
            raise ValueError(f"Missing required {source_label} columns: {missing}")

        for row_number, row in enumerate(reader, start=2):
            department_code = normalize_department_code(
                normalize_value(row.get("Code du département"))
            )
            gender_code = normalize_value(row.get("Code sexe"))
            function_name = normalize_value(row.get("Libellé de la fonction"))

            if not department_code or gender_code not in {"M", "F"}:
                continue

            if department_code not in council_stats:
                council_stats[department_code] = CouncilStats()

            stats = council_stats[department_code]
            increment_stats(stats.conseil_total, gender_code)

            if function_name.lower().startswith("président du conseil"):
                increment_stats(stats.conseil_presidence, gender_code)

    return council_stats


def write_results(
    rows: Iterable[dict[str, str]],
    fieldnames: list[str],
    output_csv: Path | None,
) -> None:

    if output_csv is None:
        writer = csv.DictWriter(
            sys.stdout,
            fieldnames=fieldnames,
            delimiter=";",
            quotechar='"',
            quoting=csv.QUOTE_MINIMAL,
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(rows)
        return

    with output_csv.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=fieldnames,
            delimiter=";",
            quotechar='"',
            quoting=csv.QUOTE_MINIMAL,
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    args = parse_args()
    rows, fieldnames = count_gender_by_department(
        args.input_csv, args.epci, args.departement
    )
    write_results(rows, fieldnames, args.output)


if __name__ == "__main__":
    main()