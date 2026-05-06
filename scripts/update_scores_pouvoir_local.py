"""
Update selected mairesEtConseilsMunicipaux and conseilsCommunautaires composantes 
score and evolution in pouvoir_local.json from aggregated departmental CSV exports, 
generated from count_gender_by_department.py.

For each composante:
    - current year CSV provides score
    - previous year CSV provides baseline for evolution

CSV format expected (semicolon-separated):
departement_code;departement_libelle;municipal_total;municipal_maire;municipal_1er_adjoint;...;epci_total;epci_presidence

Usage:
    uv run scripts/update_scores_pouvoir_local.py \
    <output-current.csv> <output-previous.csv> [pouvoir_local.json]
"""

import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

COMPOSANTE_TO_COLUMN = {
    "total": "municipal_total",
    "maires": "municipal_maire",
    "maires_prefectures": "municipal_maire_prefecture",
    "1ere_adjointe": "municipal_1er_adjoint",
    "2e_adjointe": "municipal_2e_adjoint",
    "autres_adjointes": "municipal_autres_adjoints",
    "autres_conseilleres": "municipal_autres_conseillers",
    "epci_total": "epci_total",
    "presidente_conseils_communautaires": "epci_presidence",
    "departemental_total": "departemental_total",
    "presidente_departement": "departemental_presidence",
}

BINARY_PERCENT_COLUMNS = {"municipal_maire_prefecture","departemental_presidence"}

DEPT_TO_REGION = {
    "01": "84",
    "02": "32",
    "03": "84",
    "04": "93",
    "05": "93",
    "06": "93",
    "07": "84",
    "08": "44",
    "09": "76",
    "10": "44",
    "11": "76",
    "12": "76",
    "13": "93",
    "14": "28",
    "15": "84",
    "16": "75",
    "17": "75",
    "18": "24",
    "19": "75",
    "2A": "94",
    "2B": "94",
    "21": "27",
    "22": "53",
    "23": "75",
    "24": "75",
    "25": "27",
    "26": "84",
    "27": "28",
    "28": "24",
    "29": "53",
    "30": "76",
    "31": "76",
    "32": "76",
    "33": "75",
    "34": "76",
    "35": "53",
    "36": "24",
    "37": "24",
    "38": "84",
    "39": "27",
    "40": "75",
    "41": "24",
    "42": "84",
    "43": "84",
    "44": "52",
    "45": "24",
    "46": "76",
    "47": "75",
    "48": "76",
    "49": "52",
    "50": "28",
    "51": "44",
    "52": "44",
    "53": "52",
    "54": "44",
    "55": "44",
    "56": "53",
    "57": "44",
    "58": "27",
    "59": "32",
    "60": "32",
    "61": "28",
    "62": "32",
    "63": "84",
    "64": "75",
    "65": "76",
    "66": "76",
    "67": "44",
    "68": "44",
    "69": "84",
    "70": "27",
    "71": "27",
    "72": "52",
    "73": "84",
    "74": "84",
    "75": "11",
    "76": "28",
    "77": "11",
    "78": "11",
    "79": "75",
    "80": "32",
    "81": "76",
    "82": "76",
    "83": "93",
    "84": "93",
    "85": "52",
    "86": "75",
    "87": "75",
    "88": "44",
    "89": "27",
    "90": "27",
    "91": "11",
    "92": "11",
    "93": "11",
    "94": "11",
    "95": "11",
    "971": "01",
    "972": "02",
    "973": "03",
    "974": "04",
    "976": "06",
}

DOM_CODES = {"971", "972", "973", "974", "976"}


def _evolution(score_current: float | None, score_previous: float | None) -> float | None:
    if score_current is None or score_previous is None:
        return None
    return round(score_current - score_previous, 1)


def _normalize_dept(raw: str) -> str | None:
    raw = raw.strip()
    if not raw:
        return None

    # Corse and special aggregated code are already non-numeric identifiers.
    if raw in {"2A", "2B"}:
        return raw

    try:
        num = int(raw)
    except ValueError:
        return None

    if num >= 100:
        return str(num)
    return str(num).zfill(2)


def _parse_score(raw: str) -> float | None:
    raw = raw.strip().replace(",", ".")
    if not raw:
        return None
    try:
        return round(float(raw), 1)
    except ValueError:
        return None


def compute_scores_for_column(
    csv_path: Path, csv_column: str
) -> tuple[dict[str, float], dict[str, float], dict[str, float]]:
    """Read departmental percentages for one CSV column and derive region/dept/outre-mer maps.

    Region scores are computed as a simple average of available department scores,
    because this aggregated CSV does not include denominator counts.
    """
    region_values: dict[str, list[float]] = defaultdict(list)
    dept_scores: dict[str, float] = {}
    outremer_scores: dict[str, float] = {}

    with open(csv_path, encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            code = _normalize_dept(row.get("departement_code", ""))
            if code is None:
                continue

            score = _parse_score(row.get(csv_column, ""))
            if score is None:
                continue
            if csv_column in BINARY_PERCENT_COLUMNS:
                score = round(score * 100, 1)

            if code in DOM_CODES:
                outremer_scores[code] = score
                continue

            if code in DEPT_TO_REGION:
                dept_scores[code] = score
                region_values[DEPT_TO_REGION[code]].append(score)

    region_scores = {
        region: round(sum(values) / len(values), 1)
        for region, values in region_values.items()
        if values
    }

    return region_scores, dept_scores, outremer_scores


def _update_composante(
    entries: list,
    scores_current: dict[str, float],
    scores_previous: dict[str, float],
    composante: str,
    label: str,
    parent_section: str = "mairesEtConseilsMunicipaux",
) -> None:
    updated = nulled = 0
    for entry in entries:
        code = entry["code"]
        score = scores_current.get(code)
        score_previous = scores_previous.get(code)
        evo = _evolution(score, score_previous)
        
        if composante == 'total' and parent_section == "mairesEtConseilsMunicipaux":
            entry["mairesEtConseilsMunicipaux"]["score"] = score
            entry["mairesEtConseilsMunicipaux"]["evolution"] = evo
        elif composante == 'epci_total':
            entry["conseilsCommunautaires"]["score"] = score
            entry["conseilsCommunautaires"]["evolution"] = evo
        elif composante == 'departemental_total':
            entry["conseilDepartemental"]["score"] = score
            entry["conseilDepartemental"]["evolution"] = evo
        elif parent_section == "conseilsCommunautaires":
            entry["conseilsCommunautaires"]["composantes"][composante]["score"] = score
            entry["conseilsCommunautaires"]["composantes"][composante]["evolution"] = evo
        elif parent_section == "conseilDepartemental":
            entry["conseilDepartemental"]["composantes"][composante]["score"] = score
            entry["conseilDepartemental"]["composantes"][composante]["evolution"] = evo
        else:
            entry["mairesEtConseilsMunicipaux"]["composantes"][composante]["score"] = score
            entry["mairesEtConseilsMunicipaux"]["composantes"][composante]["evolution"] = evo

        if score is not None:
            print(
                f"  {code} {entry['nom']}: {score}%"
                + (f" (evo: {evo:+.1f})" if evo is not None else " (evo: null)")
            )
            updated += 1
        else:
            print(f"  {code} {entry['nom']}: no data -> null")
            nulled += 1

    print(f"  -> {updated} updated, {nulled} set to null in {label}\\n")


def update_json(
    json_path: Path,
    scores_current_by_composante: dict[
        str, tuple[dict[str, float], dict[str, float], dict[str, float]]
    ],
    scores_previous_by_composante: dict[
        str, tuple[dict[str, float], dict[str, float], dict[str, float]]
    ],
) -> None:
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)

    # Composantes for mairesEtConseilsMunicipaux
    maires_composantes = {k: v for k, v in COMPOSANTE_TO_COLUMN.items() 
                          if k not in {"epci_total", "presidente_conseils_communautaires", "departemental_total", "presidente_departement"}}
    
    # Composantes for conseilsCommunautaires
    epci_composantes = {k: v for k, v in COMPOSANTE_TO_COLUMN.items()
                        if k in {"epci_total", "presidente_conseils_communautaires"}}

    # Composantes for conseilDepartemental
    departemental_composantes = {k: v for k, v in COMPOSANTE_TO_COLUMN.items()
                                 if k in {"departemental_total", "presidente_departement"}}

    # Update mairesEtConseilsMunicipaux
    for composante in maires_composantes:
        scores_current = scores_current_by_composante[composante]
        scores_previous = scores_previous_by_composante[composante]

        print(f"=== {composante} ===")
        for section_key, s_current, s_previous in [
            ("regions", scores_current[0], scores_previous[0]),
            ("departements", scores_current[1], scores_previous[1]),
            ("outre-mer", scores_current[2], scores_previous[2]),
        ]:
            print(f"--- {section_key} ---")
            _update_composante(
                data[section_key], s_current, s_previous, composante, section_key,
                parent_section="mairesEtConseilsMunicipaux"
            )

    # Update conseilsCommunautaires
    for composante in epci_composantes:
        scores_current = scores_current_by_composante[composante]
        scores_previous = scores_previous_by_composante[composante]

        print(f"=== {composante} ===")
        for section_key, s_current, s_previous in [
            ("regions", scores_current[0], scores_previous[0]),
            ("departements", scores_current[1], scores_previous[1]),
            ("outre-mer", scores_current[2], scores_previous[2]),
        ]:
            print(f"--- {section_key} ---")
            _update_composante(
                data[section_key], s_current, s_previous, composante, section_key,
                parent_section="conseilsCommunautaires"
            )

    # Update conseilDepartemental
    for composante in departemental_composantes:
        scores_current = scores_current_by_composante[composante]
        scores_previous = scores_previous_by_composante[composante]

        print(f"=== {composante} ===")
        for section_key, s_current, s_previous in [
            ("regions", scores_current[0], scores_previous[0]),
            ("departements", scores_current[1], scores_previous[1]),
            ("outre-mer", scores_current[2], scores_previous[2]),
        ]:
            print(f"--- {section_key} ---")
            _update_composante(
                data[section_key], s_current, s_previous, composante, section_key,
                parent_section="conseilDepartemental"
            )

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Saved {json_path}")


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    scores_current_path = Path(sys.argv[1])
    scores_previous_path = Path(sys.argv[2])
    json_path = (
        Path(sys.argv[3])
        if len(sys.argv) > 3
        else Path(__file__).parent.parent / "nextjs/src/data/pouvoir_local.json"
    )

    scores_current_by_composante: dict[
        str, tuple[dict[str, float], dict[str, float], dict[str, float]]
    ] = {}
    print(f"Reading current-year scores from: {scores_current_path}")
    for composante, column in COMPOSANTE_TO_COLUMN.items():
        print(f"  - {composante} <- {column}")
        scores_current_by_composante[composante] = compute_scores_for_column(
            scores_current_path, column
        )

    print(f"\nReading previous-year scores from: {scores_previous_path}")
    scores_previous_by_composante: dict[
        str, tuple[dict[str, float], dict[str, float], dict[str, float]]
    ] = {}
    for composante, column in COMPOSANTE_TO_COLUMN.items():
        print(f"  - {composante} <- {column}")
        scores_previous_by_composante[composante] = compute_scores_for_column(
            scores_previous_path, column
        )

    print(f"\nUpdating: {json_path}\n")
    update_json(json_path, scores_current_by_composante, scores_previous_by_composante)


if __name__ == "__main__":
    main()
