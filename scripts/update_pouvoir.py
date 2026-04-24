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
    # figure5c (directricesCabinetMairiesPrefecture) and figure12 (partis_politiques)
    # are excluded — no 2026 tables exist for them yet.
]

# The 'monde' section is excluded — its data comes from external sources, not the DB.

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
    if total == 0:
        raise ValueError("Cannot compute score: table has 0 rows")
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
    known_tables = {t for t, _, _ in FIGURE_MAPPING}
    assert table in known_tables, f"Unknown table: {table}"
    cur.execute(
        f"SELECT COUNT(*), COUNT(*) FILTER (WHERE personne_genre = 'F') FROM sources.{table}"
    )
    total, femmes = cur.fetchone()
    return int(total), int(femmes)


def main() -> None:
    # Top-level scores (executif.score, parlementaire.score, etc.) are not updated here —
    # they are weighted aggregates computed manually.
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
                baseline = baselines.get(nom_figure)
                if baseline is None:
                    raise KeyError(f"No baseline found for '{nom_figure}' in sources.figures_2025")
                evolution = compute_evolution(score, baseline)

                old_score = get_nested(data, path).get("score")
                patch_composante(data, path, score, evolution)
                sync_collectivites(data, path[-1], score)

                delta = f"+{evolution}" if evolution >= 0 else str(evolution)
                changes.append(
                    f"{table:<20} → {'.'.join(path)}.score: {old_score} → {score} (Δ {delta})"
                )

    conn.close()
    # psycopg2's context manager only manages transactions (commit/rollback), not connection lifetime.

    for line in changes:
        print(line)

    with open(POUVOIR_JSON, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\nWrote {len(changes)} updates to {POUVOIR_JSON}")


if __name__ == "__main__":
    main()
