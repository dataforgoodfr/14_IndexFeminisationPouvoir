"""
Update mairesEtConseilsMunicipaux.composantes scores for all regions,
departements, and outre-mer territories in pouvoir_local.json using:
  - L1.csv: list of all mayors → updates composante "maires"
  - L2.csv: list of prefecture mayors → updates composante "maires_prefectures"

Usage:
    uv run scripts/update_maires_scores.py <L1.csv> <L2.csv> [pouvoir_local.json]
"""

import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

DEPT_TO_REGION = {
    "01": "84", "02": "32", "03": "84", "04": "93", "05": "93", "06": "93",
    "07": "84", "08": "44", "09": "76", "10": "44", "11": "76", "12": "76",
    "13": "93", "14": "28", "15": "84", "16": "75", "17": "75", "18": "24",
    "19": "75", "2A": "94", "2B": "94", "21": "27", "22": "53", "23": "75",
    "24": "75", "25": "27", "26": "84", "27": "28", "28": "24", "29": "53",
    "30": "76", "31": "76", "32": "76", "33": "75", "34": "76", "35": "53",
    "36": "24", "37": "24", "38": "84", "39": "27", "40": "75", "41": "24",
    "42": "84", "43": "84", "44": "52", "45": "24", "46": "76", "47": "75",
    "48": "76", "49": "52", "50": "28", "51": "44", "52": "44", "53": "52",
    "54": "44", "55": "44", "56": "53", "57": "44", "58": "27", "59": "32",
    "60": "32", "61": "28", "62": "32", "63": "84", "64": "75", "65": "76",
    "66": "76", "67": "44", "68": "44", "69": "84", "70": "27", "71": "27",
    "72": "52", "73": "84", "74": "84", "75": "11", "76": "28", "77": "11",
    "78": "11", "79": "75", "80": "32", "81": "76", "82": "76", "83": "93",
    "84": "93", "85": "52", "86": "75", "87": "75", "88": "44", "89": "27",
    "90": "27", "91": "11", "92": "11", "93": "11", "94": "11", "95": "11",
    "971": "01", "972": "02", "973": "03", "974": "04", "976": "06",
}

DOM_CODES = {"971", "972", "973", "974", "976"}


def _pct(women: int, total: int) -> float:
    return round(100 * women / total, 1)


def _new_counts() -> dict:
    return {"total": 0, "women": 0}


def _scores_from_counts(counts: dict) -> dict[str, float]:
    return {
        code: _pct(c["women"], c["total"])
        for code, c in counts.items()
        if c["total"] > 0
    }


def compute_l1_scores(csv_path: Path) -> tuple[dict, dict, dict]:
    """Compute maires scores per region, department, outre-mer from L1.csv.

    L1 columns used: 'Code du département', 'Code sexe' (M/F)
    """
    region_c: dict = defaultdict(_new_counts)
    dept_c: dict = defaultdict(_new_counts)
    outremer_c: dict = defaultdict(_new_counts)
    national = _new_counts()

    with open(csv_path, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            raw = row["Code du département"].strip()
            if not raw:
                continue
            dept = raw if raw in DOM_CODES else raw.zfill(2)
            is_woman = row["Code sexe"].strip() == "F"

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
                continue
            region_c[region]["total"] += 1
            national["total"] += 1
            if is_woman:
                region_c[region]["women"] += 1
                national["women"] += 1

    nat_pct = _pct(national["women"], national["total"])
    print(f"  National: {national['women']}/{national['total']} = {nat_pct}%")

    return _scores_from_counts(region_c), _scores_from_counts(dept_c), _scores_from_counts(outremer_c)


def compute_l2_scores(csv_path: Path) -> tuple[dict, dict, dict]:
    """Compute maires_prefectures scores per region, department, outre-mer from L2.csv.

    L2 columns used: 'Dép' (integer or 2A/2B), 'Sexe' (H/F)
    Rows after the data block (empty Dép) are ignored.
    """
    region_c: dict = defaultdict(_new_counts)
    dept_c: dict = defaultdict(_new_counts)
    outremer_c: dict = defaultdict(_new_counts)
    national = _new_counts()

    with open(csv_path, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            raw = row["Dép"].strip()
            if not raw or not row["Sexe"].strip():
                continue
            dept = raw if raw in DOM_CODES or raw in ("2A", "2B") else str(int(raw)).zfill(2)
            is_woman = row["Sexe"].strip() == "F"

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
                continue
            region_c[region]["total"] += 1
            national["total"] += 1
            if is_woman:
                region_c[region]["women"] += 1
                national["women"] += 1

    nat_pct = _pct(national["women"], national["total"])
    print(f"  National: {national['women']}/{national['total']} = {nat_pct}%")

    return _scores_from_counts(region_c), _scores_from_counts(dept_c), _scores_from_counts(outremer_c)


def _update_composante(entries: list, scores: dict, composante: str, label: str) -> None:
    updated = nulled = 0
    for entry in entries:
        code = entry["code"]
        entry["mairesEtConseilsMunicipaux"]["composantes"][composante]["score"] = scores.get(code)
        if code in scores:
            print(f"  {code} {entry['nom']}: {scores[code]}%")
            updated += 1
        else:
            print(f"  {code} {entry['nom']}: no data → null")
            nulled += 1
    print(f"  → {updated} updated, {nulled} set to null in {label}\n")


def update_json(
    json_path: Path,
    l1_scores: tuple[dict, dict, dict] | None,
    l2_scores: tuple[dict, dict, dict] | None,
) -> None:
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)

    for composante, scores_tuple in [("maires", l1_scores), ("maires_prefectures", l2_scores)]:
        if scores_tuple is None:
            continue
        region_scores, dept_scores, outremer_scores = scores_tuple
        print(f"=== {composante} ===")
        print("--- regions ---")
        _update_composante(data["regions"], region_scores, composante, "regions")
        print("--- departements ---")
        _update_composante(data["departements"], dept_scores, composante, "departements")
        print("--- outre-mer ---")
        _update_composante(data["outre-mer"], outremer_scores, composante, "outre-mer")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Saved {json_path}")


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    l1_path = Path(sys.argv[1])
    l2_path = Path(sys.argv[2])
    json_path = Path(sys.argv[3]) if len(sys.argv) > 3 else (
        Path(__file__).parent.parent / "nextjs/src/data/pouvoir_local.json"
    )

    print(f"Reading L1 (maires) from: {l1_path}")
    l1_scores = compute_l1_scores(l1_path)

    print(f"\nReading L2 (maires_prefectures) from: {l2_path}")
    l2_scores = compute_l2_scores(l2_path)

    print(f"\nUpdating: {json_path}\n")
    update_json(json_path, l1_scores, l2_scores)


if __name__ == "__main__":
    main()
