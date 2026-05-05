"""
Update mairesEtConseilsMunicipaux.composantes.maires.score for all regions,
departements, and outre-mer territories in pouvoir_local.json using L1.csv
(list of all mayors in France) from the IFP CSV export.

Usage:
    uv run scripts/update_maires_scores.py <path_to_L1.csv> [path_to_pouvoir_local.json]
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

# 3-digit DOM codes that appear as-is in L1.csv
DOM_CODES = {"971", "972", "973", "974", "976"}


def _pct(women: int, total: int) -> float:
    return round(100 * women / total, 1)


def compute_all_scores(csv_path: Path) -> tuple[dict, dict, dict]:
    """Return (region_scores, dept_scores, outremer_scores) keyed by code."""
    region_counts: dict[str, dict] = defaultdict(lambda: {"total": 0, "women": 0})
    dept_counts: dict[str, dict] = defaultdict(lambda: {"total": 0, "women": 0})
    outremer_counts: dict[str, dict] = defaultdict(lambda: {"total": 0, "women": 0})
    national = {"total": 0, "women": 0}

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw = row["Code du département"].strip()
            if not raw:
                continue

            # Normalise: 3-digit DOM codes stay as-is, others zero-pad to 2 digits
            dept = raw if raw in DOM_CODES else raw.zfill(2)

            sex = row["Code sexe"].strip()
            is_woman = sex == "F"

            # Department / outre-mer level
            if dept in DOM_CODES:
                outremer_counts[dept]["total"] += 1
                if is_woman:
                    outremer_counts[dept]["women"] += 1
            else:
                dept_counts[dept]["total"] += 1
                if is_woman:
                    dept_counts[dept]["women"] += 1

            # Region level
            region = DEPT_TO_REGION.get(dept)
            if region is None:
                continue
            region_counts[region]["total"] += 1
            national["total"] += 1
            if is_woman:
                region_counts[region]["women"] += 1
                national["women"] += 1

    nat_pct = _pct(national["women"], national["total"])
    print(f"National: {national['women']}/{national['total']} = {nat_pct}%")

    region_scores = {
        code: _pct(c["women"], c["total"])
        for code, c in region_counts.items()
        if c["total"] > 0
    }
    dept_scores = {
        code: _pct(c["women"], c["total"])
        for code, c in dept_counts.items()
        if c["total"] > 0
    }
    outremer_scores = {
        code: _pct(c["women"], c["total"])
        for code, c in outremer_counts.items()
        if c["total"] > 0
    }
    return region_scores, dept_scores, outremer_scores


def _update_section(entries: list, scores: dict, label: str) -> None:
    updated = skipped = 0
    for entry in entries:
        code = entry["code"]
        if code in scores:
            entry["mairesEtConseilsMunicipaux"]["composantes"]["maires"]["score"] = scores[code]
            print(f"  {code} {entry['nom']}: {scores[code]}%")
            updated += 1
        else:
            print(f"  {code} {entry['nom']}: no data, skipped")
            skipped += 1
    print(f"  → {updated} updated, {skipped} skipped in {label}\n")


def update_json(json_path: Path, region_scores: dict, dept_scores: dict, outremer_scores: dict) -> None:
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)

    print("--- regions ---")
    _update_section(data["regions"], region_scores, "regions")

    print("--- departements ---")
    _update_section(data["departements"], dept_scores, "departements")

    print("--- outre-mer ---")
    _update_section(data["outre-mer"], outremer_scores, "outre-mer")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Saved {json_path}")


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    csv_path = Path(sys.argv[1])
    json_path = Path(sys.argv[2]) if len(sys.argv) > 2 else (
        Path(__file__).parent.parent / "nextjs/src/data/pouvoir_local.json"
    )

    print(f"Reading mayors from: {csv_path}\n")
    region_scores, dept_scores, outremer_scores = compute_all_scores(csv_path)

    print(f"\nUpdating: {json_path}\n")
    update_json(json_path, region_scores, dept_scores, outremer_scores)


if __name__ == "__main__":
    main()
