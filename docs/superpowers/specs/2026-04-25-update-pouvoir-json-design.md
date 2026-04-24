# Design: update_pouvoir.py — Sync pouvoir.json from PostgreSQL

## Overview

A standalone Python script (`scripts/update_pouvoir.py`) that queries the `sources` schema of the IFP PostgreSQL database, computes the percentage of women for each figure, and patches `nextjs/src/data/pouvoir.json` in-place with updated `score`, `evolution`, and `annee` values.

Run manually from the repo root:
```bash
uv run python scripts/update_pouvoir.py
```

## File location

```
scripts/
  update_pouvoir.py
```

## Configuration

DB credentials are read from environment variables, loaded automatically from a `.env` file at the repo root via the `dotenv` dependency already in `pyproject.toml`:

```
POSTGRES_HOST
POSTGRES_PORT
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB_NAME
```

## Computation

For each figure table in `sources.figure{X}_2026`:

```sql
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE personne_genre = 'F') AS femmes
FROM sources.figure{X}_2026
```

- `score = round(100 * femmes / total, 1)`
- `evolution = round(score - reference_rapport_2025, 1)` (from `sources.figures_2025`, fetched once at startup)
- `annee = 2026`

## Figure → JSON path mapping

### Pouvoir exécutif

| Figure | JSON path |
|---|---|
| figure1a | `executif.composantes.gouvernement` |
| figure1b | `executif.composantes.ministeres_regaliens` |
| figure1c | `executif.composantes.cabinet_presidence` |
| figure1d | `executif.composantes.cabiner_premier_ministre` |
| figure1e | `executif.composantes.directrices_cabinet_gouvernement` |

### Pouvoir parlementaire

| Figure | JSON path |
|---|---|
| figure2a | `parlementaire.composantes.assemblee_nationale.composantes.deputees` |
| figure2b | `parlementaire.composantes.assemblee_nationale.composantes.presidente_commission` |
| figure2c | `parlementaire.composantes.assemblee_nationale.composantes.bureau` |
| figure2d | `parlementaire.composantes.assemblee_nationale.composantes.presidente_groupe` |
| figure3a | `parlementaire.composantes.senat.composantes.senatrices` |
| figure3b | `parlementaire.composantes.senat.composantes.presidente_commission` |
| figure3c | `parlementaire.composantes.senat.composantes.bureau` |
| figure3d | `parlementaire.composantes.senat.composantes.presidente_groupe` |
| figure4  | `parlementaire.composantes.europeen` |

### Pouvoir local

| Figure | JSON path | Also synced to |
|---|---|---|
| figure5a | `local.composantes.maires` | `local.collectivites[Communes].stats[0].valeur` |
| figure5b | `local.composantes.mairesPrefecture` | `local.collectivites[Communes].stats[1].valeur` |
| figure6a | `local.composantes.presidentsDepartement` | `local.collectivites[Départements].stats[0].valeur` |
| figure6b | `local.composantes.directricesCabinetDepartement` | `local.collectivites[Départements].stats[1].valeur` |
| figure7a | `local.composantes.presidentesRegion` | `local.collectivites[Régions].stats[0].valeur` |
| figure7b | `local.composantes.directricesCabinetRegion` | `local.collectivites[Régions].stats[1].valeur` |

`local.composantes.directricesCabinetMairiesPrefecture` is skipped — no `figure5c_2026` table exists.

### Autre pouvoir

| Figure | JSON path |
|---|---|
| figure8  | `autre.composantes.hautes_juridictions` |
| figure9  | `autre.composantes.prefectures` |
| figure10 | `autre.composantes.ambassades` |
| figure11 | `autre.composantes.haute_autorite` |

`partis_politiques` (figure12) is skipped — no `figure12_2026` table exists.

## Fields written per composante

Only these three fields are written. All other fields (text, arrays, nested objects) are left unchanged:

```json
{
  "score": 44.4,
  "evolution": -5.6,
  "annee": 2026
}
```

For `local.collectivites[].stats[].valeur`, only the `valeur` number is updated.

## Not updated

- Top-level `score` and `evolution` for each pouvoir type
- `dateMiseAJour` fields
- All text fields (`analyse`, `description`, `infobox`, `context`, `mais_aussi`, etc.)
- `parite_groupes` data
- All `monde` fields
- Detailed breakdown data within composantes (`regions`, `outre_mer`, `g7`, `g20`, `institutions`, `magistrature`, etc.)

## Output

The script prints a change summary before writing:

```
figure1a → executif.composantes.gouvernement.score: 50.0 → 44.4 (Δ -5.6)
figure1b → executif.composantes.ministeres_regaliens.score: 0.0 → 11.1 (Δ +11.1)
...
Wrote 46 updates to nextjs/src/data/pouvoir.json
```

The JSON file is written with 2-space indentation to match the existing format.

## Dependencies

No new dependencies required. Uses:
- `psycopg2` (transitive via `dbt-postgres`)
- `dotenv` (already in `pyproject.toml`)
- `json`, `os` (stdlib)
