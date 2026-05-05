"""
Update mairesEtConseilsMunicipaux.composantes scores and evolutions for all regions,
departements, and outre-mer territories in pouvoir_local.json using:
  - L1_2026.csv : list of all mayors (2026) → composante "maires", score
  - L2_2026.csv : list of prefecture mayors (2026) → composante "maires_prefectures", score
  - L1_2025.csv : list of all mayors (2025) → composante "maires", evolution
  - L2_2025.csv : list of prefecture mayors (2025) → composante "maires_prefectures", evolution

2026 files: IFP 2026 Version Finale CSV Export / L1.csv, L2.csv
2025 files: IFP 2025 CSV Export / Figure 5 a.csv, Figure 5b.csv

Usage:
    uv run scripts/update_maires_scores.py \\
        <L1_2026.csv> <L2_2026.csv> <L1_2025.csv> <L2_2025.csv> [pouvoir_local.json]
"""

import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

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


def _pct(women: int, total: int) -> float:
    return round(100 * women / total, 1)


def _evolution(score_2026: float | None, score_2025: float | None) -> float | None:
    if score_2026 is None or score_2025 is None:
        return None
    return round(score_2026 - score_2025, 1)


def _normalize_dept(raw: str) -> str | None:
    """Normalize a raw department code to zero-padded 2-digit or 3-digit string."""
    raw = raw.strip()
    if not raw:
        return None
    if raw in DOM_CODES or raw in ("2A", "2B"):
        return raw
    try:
        return str(int(raw)).zfill(2)
    except ValueError:
        return None


def _new_counts() -> dict:
    return {"total": 0, "women": 0}


def _scores_from_counts(counts: dict) -> dict[str, float]:
    return {
        code: _pct(c["women"], c["total"])
        for code, c in counts.items()
        if c["total"] > 0
    }


def _accumulate(
    dept: str,
    is_woman: bool,
    region_c: dict,
    dept_c: dict,
    outremer_c: dict,
    national: dict,
) -> None:
    if dept in DOM_CODES:
        outremer_c[dept]["total"] += 1
        if is_woman:
            outremer_c[dept]["women"] += 1
    else:
        dept_c[dept]["total"] += 1
        if is_woman:
            dept_c[dept]["women"] += 1

    region = DEPT_TO_REGION.get(dept)
    if region is None:
        return
    region_c[region]["total"] += 1
    national["total"] += 1
    if is_woman:
        region_c[region]["women"] += 1
        national["women"] += 1


def _read_csv_skip_to(path: Path, header_field: str) -> csv.DictReader:
    """Return a DictReader positioned at the row whose first cell matches header_field."""
    lines = path.read_text(encoding="utf-8").splitlines()
    for i, line in enumerate(lines):
        if line.startswith(header_field):
            return csv.DictReader(lines[i:])
    raise ValueError(f"Header '{header_field}' not found in {path}")


def compute_l1_scores(csv_path: Path) -> tuple[dict, dict, dict]:
    """Compute maires scores from an individual-mayors CSV.

    Handles both 2026 (L1.csv) and 2025 (Figure 5 a.csv) formats:
      - dept column: 'Code du département' (zero-padded in 2026, integer in 2025)
      - sex column: 'Code sexe', values 'F' / 'M'
    2026 has headers on row 1; 2025 has 3 metadata rows then 'Nom de l'élu' header.
    """
    first_line = csv_path.read_text(encoding="utf-8").splitlines()[0]
    # 2026 L1.csv starts directly with column headers; 2025 has metadata rows first
    header_field = (
        "Code du département"
        if first_line.startswith("Code du département")
        else "Nom de l'élu"
    )
    reader = _read_csv_skip_to(csv_path, header_field)
    region_c: dict = defaultdict(_new_counts)
    dept_c: dict = defaultdict(_new_counts)
    outremer_c: dict = defaultdict(_new_counts)
    national = _new_counts()

    for row in reader:
        dept = _normalize_dept(row.get("Code du département", ""))
        if dept is None:
            continue
        is_woman = row.get("Code sexe", "").strip() == "F"
        _accumulate(dept, is_woman, region_c, dept_c, outremer_c, national)

    if national["total"]:
        nat_pct = _pct(national["women"], national["total"])
        print(f"  National: {national['women']}/{national['total']} = {nat_pct}%")

    return (
        _scores_from_counts(region_c),
        _scores_from_counts(dept_c),
        _scores_from_counts(outremer_c),
    )


def compute_l2_scores(csv_path: Path) -> tuple[dict, dict, dict]:
    """Compute maires_prefectures scores from a prefecture-mayors CSV.

    Handles both 2026 (L2.csv) and 2025 (Figure 5b.csv) formats:
      - 2026: dept in 'Dép' (integer), sex in 'Sexe' as 'H'/'F'
      - 2025: dept in 'N°' (integer or 2A/2B), sex in 'Sexe ' as 'Madame'/'Monsieur'
    """
    # Detect format by trying both header fields
    text = csv_path.read_text(encoding="utf-8")
    if "N°" in text:
        dept_col, sex_col, is_woman_val = "N°", "Sexe ", "Madame"
        reader = _read_csv_skip_to(csv_path, "N°")
    else:
        dept_col, sex_col, is_woman_val = "Dép", "Sexe", "F"
        reader = _read_csv_skip_to(csv_path, "Région")

    region_c: dict = defaultdict(_new_counts)
    dept_c: dict = defaultdict(_new_counts)
    outremer_c: dict = defaultdict(_new_counts)
    national = _new_counts()

    for row in reader:
        dept = _normalize_dept(row.get(dept_col, ""))
        if dept is None:
            continue
        sex = row.get(sex_col, "").strip()
        if not sex:
            continue
        is_woman = sex == is_woman_val
        _accumulate(dept, is_woman, region_c, dept_c, outremer_c, national)

    if national["total"]:
        nat_pct = _pct(national["women"], national["total"])
        print(f"  National: {national['women']}/{national['total']} = {nat_pct}%")

    return (
        _scores_from_counts(region_c),
        _scores_from_counts(dept_c),
        _scores_from_counts(outremer_c),
    )


def _update_composante(
    entries: list,
    scores_2026: dict,
    scores_2025: dict,
    composante: str,
    label: str,
) -> None:
    updated = nulled = 0
    for entry in entries:
        code = entry["code"]
        score = scores_2026.get(code)
        evo = _evolution(score, scores_2025.get(code))
        entry["mairesEtConseilsMunicipaux"]["composantes"][composante]["score"] = score
        entry["mairesEtConseilsMunicipaux"]["composantes"][composante]["evolution"] = (
            evo
        )
        if score is not None:
            print(
                f"  {code} {entry['nom']}: {score}%"
                + (f" (evo: {evo:+.1f})" if evo is not None else " (evo: null)")
            )
            updated += 1
        else:
            print(f"  {code} {entry['nom']}: no data → null")
            nulled += 1
    print(f"  → {updated} updated, {nulled} set to null in {label}\n")


def update_json(
    json_path: Path,
    l1_2026: tuple[dict, dict, dict],
    l2_2026: tuple[dict, dict, dict],
    l1_2025: tuple[dict, dict, dict],
    l2_2025: tuple[dict, dict, dict],
) -> None:
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)

    for composante, scores_2026, scores_2025 in [
        ("maires", l1_2026, l1_2025),
        ("maires_prefectures", l2_2026, l2_2025),
    ]:
        print(f"=== {composante} ===")
        for section_key, s2026, s2025 in [
            ("regions", scores_2026[0], scores_2025[0]),
            ("departements", scores_2026[1], scores_2025[1]),
            ("outre-mer", scores_2026[2], scores_2025[2]),
        ]:
            print(f"--- {section_key} ---")
            _update_composante(data[section_key], s2026, s2025, composante, section_key)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Saved {json_path}")


def main() -> None:
    if len(sys.argv) < 5:
        print(__doc__)
        sys.exit(1)

    l1_2026_path = Path(sys.argv[1])
    l2_2026_path = Path(sys.argv[2])
    l1_2025_path = Path(sys.argv[3])
    l2_2025_path = Path(sys.argv[4])
    json_path = (
        Path(sys.argv[5])
        if len(sys.argv) > 5
        else Path(__file__).parent.parent / "nextjs/src/data/pouvoir_local.json"
    )

    print(f"Reading L1 2026 (maires) from: {l1_2026_path}")
    l1_2026 = compute_l1_scores(l1_2026_path)

    print(f"\nReading L2 2026 (maires_prefectures) from: {l2_2026_path}")
    l2_2026 = compute_l2_scores(l2_2026_path)

    print(f"\nReading L1 2025 (maires) from: {l1_2025_path}")
    l1_2025 = compute_l1_scores(l1_2025_path)

    print(f"\nReading L2 2025 (maires_prefectures) from: {l2_2025_path}")
    l2_2025 = compute_l2_scores(l2_2025_path)

    print(f"\nUpdating: {json_path}\n")
    update_json(json_path, l1_2026, l2_2026, l1_2025, l2_2025)


if __name__ == "__main__":
    main()
