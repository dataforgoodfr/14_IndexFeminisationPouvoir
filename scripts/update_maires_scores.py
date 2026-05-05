"""
Update mairesEtConseilsMunicipaux.composantes.maires.score per region in pouvoir_local.json
using the L1.csv file (list of all mayors in France) from the IFP CSV export.

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


def compute_scores(csv_path: Path) -> dict[str, float]:
    counts: dict[str, dict[str, int]] = defaultdict(lambda: {"total": 0, "women": 0})
    national = {"total": 0, "women": 0}

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw = row["Code du département"].strip()
            dept = raw.zfill(2) if len(raw) <= 2 else raw
            region = DEPT_TO_REGION.get(dept)
            if region is None:
                continue
            sex = row["Code sexe"].strip()
            counts[region]["total"] += 1
            national["total"] += 1
            if sex == "F":
                counts[region]["women"] += 1
                national["women"] += 1

    nat_pct = round(100 * national["women"] / national["total"], 1)
    print(f"National: {national['women']}/{national['total']} = {nat_pct}%")

    return {
        region: round(100 * c["women"] / c["total"], 1)
        for region, c in counts.items()
        if c["total"] > 0
    }


def update_json(json_path: Path, scores: dict[str, float]) -> None:
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)

    updated = 0
    for region in data["regions"]:
        code = region["code"]
        if code in scores:
            region["mairesEtConseilsMunicipaux"]["composantes"]["maires"]["score"] = scores[code]
            print(f"  {code} {region['nom']}: {scores[code]}%")
            updated += 1
        else:
            print(f"  {code} {region['nom']}: no data in CSV, skipped")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"\nUpdated {updated}/{len(data['regions'])} regions in {json_path}")


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    csv_path = Path(sys.argv[1])
    json_path = Path(sys.argv[2]) if len(sys.argv) > 2 else (
        Path(__file__).parent.parent / "nextjs/src/data/pouvoir_local.json"
    )

    print(f"Reading mayors from: {csv_path}")
    scores = compute_scores(csv_path)

    print(f"\nUpdating: {json_path}")
    update_json(json_path, scores)


if __name__ == "__main__":
    main()
