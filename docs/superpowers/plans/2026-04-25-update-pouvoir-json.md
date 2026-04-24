# update_pouvoir.py Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write `scripts/update_pouvoir.py` — a manual script that queries the IFP PostgreSQL database and patches `nextjs/src/data/pouvoir.json` with 2026 composante scores and evolutions.

**Architecture:** A single standalone Python script with pure helper functions (testable) and thin DB wrapper functions (not tested). The script reads credentials from `.env`, queries each `sources.figure*_2026` table, computes % women, calculates evolution vs the 2025 baseline from `sources.figures_2025`, and patches the JSON in-place.

**Tech Stack:** Python 3.13, `psycopg2` (transitive via `dbt-postgres`), `dotenv`, `json` (stdlib). Run with `uv run python scripts/update_pouvoir.py`.

---

### Task 1: Pure helper functions with tests (TDD)

**Files:**
- Create: `scripts/update_pouvoir.py`
- Create: `scripts/test_update_pouvoir.py`

- [ ] **Step 1: Create the test file with failing tests**

Create `scripts/test_update_pouvoir.py`:

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from update_pouvoir import (
    compute_score,
    compute_evolution,
    patch_composante,
    sync_collectivites,
)


def test_compute_score_rounds_to_one_decimal():
    assert compute_score(16, 36) == 44.4


def test_compute_score_zero_women():
    assert compute_score(0, 10) == 0.0


def test_compute_score_all_women():
    assert compute_score(5, 5) == 100.0


def test_compute_evolution_negative():
    assert compute_evolution(44.4, 50.0) == -5.6


def test_compute_evolution_positive():
    assert compute_evolution(55.0, 50.0) == 5.0


def test_patch_composante_updates_score_evolution_annee():
    data = {
        "executif": {
            "composantes": {
                "gouvernement": {"score": 50.0, "evolution": 2.5, "annee": 2025}
            }
        }
    }
    patch_composante(data, ["executif", "composantes", "gouvernement"], 44.4, -5.6)
    node = data["executif"]["composantes"]["gouvernement"]
    assert node["score"] == 44.4
    assert node["evolution"] == -5.6
    assert node["annee"] == 2026


def test_patch_composante_leaves_other_fields_intact():
    data = {
        "executif": {
            "composantes": {
                "gouvernement": {
                    "score": 50.0,
                    "annee": 2025,
                    "description": "keep me",
                }
            }
        }
    }
    patch_composante(data, ["executif", "composantes", "gouvernement"], 44.4, -5.6)
    assert data["executif"]["composantes"]["gouvernement"]["description"] == "keep me"


def test_sync_collectivites_updates_matching_stat():
    data = {
        "local": {
            "collectivites": [
                {
                    "titre": "Régions",
                    "stats": [
                        {"valeur": 29.4, "role": "présidant une région"},
                        {"valeur": 25.0, "role": "directrices de cabinet"},
                    ],
                }
            ]
        }
    }
    sync_collectivites(data, "presidentesRegion", 31.2)
    assert data["local"]["collectivites"][0]["stats"][0]["valeur"] == 31.2


def test_sync_collectivites_does_not_update_other_stats():
    data = {
        "local": {
            "collectivites": [
                {
                    "titre": "Régions",
                    "stats": [
                        {"valeur": 29.4},
                        {"valeur": 25.0},
                    ],
                }
            ]
        }
    }
    sync_collectivites(data, "presidentesRegion", 31.2)
    assert data["local"]["collectivites"][0]["stats"][1]["valeur"] == 25.0


def test_sync_collectivites_ignores_unknown_key():
    data = {"local": {"collectivites": []}}
    sync_collectivites(data, "unknown_composante_key", 50.0)  # must not raise
```

- [ ] **Step 2: Run tests — expect ImportError (module doesn't exist yet)**

```bash
cd /path/to/repo && uv run pytest scripts/test_update_pouvoir.py -v
```

Expected: `ModuleNotFoundError: No module named 'update_pouvoir'`

- [ ] **Step 3: Create `scripts/update_pouvoir.py` with pure helper functions only**

```python
#!/usr/bin/env python3
import json
import os
from pathlib import Path

import psycopg2
from dotenv import load_dotenv

POUVOIR_JSON = Path(__file__).parent.parent / "nextjs/src/data/pouvoir.json"

FIGURE_MAPPING = [
    ("figure1a_2026",  "Figure 1a",  ["executif", "composantes", "gouvernement"]),
    ("figure1b_2026",  "Figure 1b",  ["executif", "composantes", "ministeres_regaliens"]),
    ("figure1c_2026",  "Figure 1c",  ["executif", "composantes", "cabinet_presidence"]),
    ("figure1d_2026",  "Figure 1d",  ["executif", "composantes", "cabiner_premier_ministre"]),
    ("figure1e_2026",  "Figure 1e",  ["executif", "composantes", "directrices_cabinet_gouvernement"]),
    ("figure2a_2026",  "Figure 2a",  ["parlementaire", "composantes", "assemblee_nationale", "composantes", "deputees"]),
    ("figure2b_2026",  "Figure 2b",  ["parlementaire", "composantes", "assemblee_nationale", "composantes", "presidente_commission"]),
    ("figure2c_2026",  "Figure 2c",  ["parlementaire", "composantes", "assemblee_nationale", "composantes", "bureau"]),
    ("figure2d_2026",  "Figure 2d",  ["parlementaire", "composantes", "assemblee_nationale", "composantes", "presidente_groupe"]),
    ("figure3a_2026",  "Figure 3a",  ["parlementaire", "composantes", "senat", "composantes", "senatrices"]),
    ("figure3b_2026",  "Figure 3b",  ["parlementaire", "composantes", "senat", "composantes", "presidente_commission"]),
    ("figure3c_2026",  "Figure 3c",  ["parlementaire", "composantes", "senat", "composantes", "bureau"]),
    ("figure3d_2026",  "Figure 3d",  ["parlementaire", "composantes", "senat", "composantes", "presidente_groupe"]),
    ("figure4_2026",   "Figure 4",   ["parlementaire", "composantes", "europeen"]),
    ("figure5a_2026",  "Figure 5a",  ["local", "composantes", "maires"]),
    ("figure5b_2026",  "Figure 5b",  ["local", "composantes", "mairesPrefecture"]),
    ("figure6a_2026",  "Figure 6a",  ["local", "composantes", "presidentsDepartement"]),
    ("figure6b_2026",  "Figure 6b",  ["local", "composantes", "directricesCabinetDepartement"]),
    ("figure7a_2026",  "Figure 7a",  ["local", "composantes", "presidentesRegion"]),
    ("figure7b_2026",  "Figure 7b",  ["local", "composantes", "directricesCabinetRegion"]),
    ("figure8_2026",   "Figure 8",   ["autre", "composantes", "hautes_juridictions"]),
    ("figure9_2026",   "Figure 9",   ["autre", "composantes", "prefectures"]),
    ("figure10_2026",  "Figure 10",  ["autre", "composantes", "ambassades"]),
    ("figure11_2026",  "Figure 11",  ["autre", "composantes", "haute_autorite"]),
]

# Maps local composante key → (collectivites titre, stats list index)
COLLECTIVITES_SYNC = {
    "maires":                        ("Communes",     0),
    "mairesPrefecture":              ("Communes",     1),
    "presidentsDepartement":         ("Départements", 0),
    "directricesCabinetDepartement": ("Départements", 1),
    "presidentesRegion":             ("Régions",      0),
    "directricesCabinetRegion":      ("Régions",      1),
}


def compute_score(femmes: int, total: int) -> float:
    return round(100 * femmes / total, 1)


def compute_evolution(score: float, baseline: float) -> float:
    return round(score - baseline, 1)


def get_nested(data: dict, path: list[str]) -> dict:
    node = data
    for key in path:
        node = node[key]
    return node


def patch_composante(data: dict, path: list[str], score: float, evolution: float) -> None:
    node = get_nested(data, path)
    node["score"] = score
    node["evolution"] = evolution
    node["annee"] = 2026


def sync_collectivites(data: dict, composante_key: str, score: float) -> None:
    if composante_key not in COLLECTIVITES_SYNC:
        return
    titre, stats_index = COLLECTIVITES_SYNC[composante_key]
    for collectivite in data["local"]["collectivites"]:
        if collectivite["titre"] == titre:
            collectivite["stats"][stats_index]["valeur"] = score
            return


def fetch_baselines(cur) -> dict[str, float]:
    cur.execute("SELECT nom_figure, reference_rapport_2025 FROM sources.figures_2025")
    return {row[0]: row[1] for row in cur.fetchall()}


def fetch_figure_counts(cur, table: str) -> tuple[int, int]:
    cur.execute(
        f"SELECT COUNT(*), COUNT(*) FILTER (WHERE personne_genre = 'F') FROM sources.{table}"
    )
    total, femmes = cur.fetchone()
    return int(total), int(femmes)


def main() -> None:
    load_dotenv()
    conn = psycopg2.connect(
        host=os.environ["POSTGRES_HOST"],
        port=int(os.environ["POSTGRES_PORT"]),
        user=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"],
        dbname=os.environ["POSTGRES_DB_NAME"],
    )

    with open(POUVOIR_JSON) as f:
        data = json.load(f)

    changes: list[str] = []

    with conn:
        with conn.cursor() as cur:
            baselines = fetch_baselines(cur)
            for table, nom_figure, path in FIGURE_MAPPING:
                total, femmes = fetch_figure_counts(cur, table)
                score = compute_score(femmes, total)
                evolution = compute_evolution(score, baselines[nom_figure])

                old_score = get_nested(data, path).get("score")
                patch_composante(data, path, score, evolution)
                sync_collectivites(data, path[-1], score)

                delta = f"+{evolution}" if evolution >= 0 else str(evolution)
                changes.append(
                    f"{table:<20} → {'.'.join(path)}.score: {old_score} → {score} (Δ {delta})"
                )

    conn.close()

    for line in changes:
        print(line)

    with open(POUVOIR_JSON, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\nWrote {len(changes)} updates to {POUVOIR_JSON}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run tests — expect all to pass**

```bash
uv run pytest scripts/test_update_pouvoir.py -v
```

Expected output:
```
PASSED scripts/test_update_pouvoir.py::test_compute_score_rounds_to_one_decimal
PASSED scripts/test_update_pouvoir.py::test_compute_score_zero_women
PASSED scripts/test_update_pouvoir.py::test_compute_score_all_women
PASSED scripts/test_update_pouvoir.py::test_compute_evolution_negative
PASSED scripts/test_update_pouvoir.py::test_compute_evolution_positive
PASSED scripts/test_update_pouvoir.py::test_patch_composante_updates_score_evolution_annee
PASSED scripts/test_update_pouvoir.py::test_patch_composante_leaves_other_fields_intact
PASSED scripts/test_update_pouvoir.py::test_sync_collectivites_updates_matching_stat
PASSED scripts/test_update_pouvoir.py::test_sync_collectivites_does_not_update_other_stats
PASSED scripts/test_update_pouvoir.py::test_sync_collectivites_ignores_unknown_key
10 passed
```

- [ ] **Step 5: Commit**

```bash
git add scripts/update_pouvoir.py scripts/test_update_pouvoir.py
git commit -m "feat: add update_pouvoir.py script with tests"
```

---

### Task 2: End-to-end run against the database

**Files:**
- Run: `scripts/update_pouvoir.py` (no changes)
- Verify: `nextjs/src/data/pouvoir.json`

- [ ] **Step 1: Ensure `.env` exists at repo root with DB credentials**

Confirm `/path/to/repo/.env` contains:
```
POSTGRES_HOST=51.159.204.209
POSTGRES_PORT=18871
POSTGRES_USER=ifp
POSTGRES_PASSWORD=7*vfG4rt^!v!F*r9
POSTGRES_DB_NAME=ifp
```

- [ ] **Step 2: Run the script**

```bash
uv run python scripts/update_pouvoir.py
```

Expected: 24 lines of change output followed by:
```
Wrote 24 updates to .../nextjs/src/data/pouvoir.json
```

- [ ] **Step 3: Spot-check the JSON**

Open `nextjs/src/data/pouvoir.json` and verify:
- `executif.composantes.gouvernement.annee` is `2026`
- `local.composantes.presidentesRegion.score` matches `local.collectivites[0].stats[0].valeur`
- Text fields and nested objects (`regions`, `g7`, `institutions`, etc.) are unchanged

- [ ] **Step 4: Commit the updated JSON**

```bash
git add nextjs/src/data/pouvoir.json
git commit -m "data: update pouvoir.json composantes to 2026 figures"
```
