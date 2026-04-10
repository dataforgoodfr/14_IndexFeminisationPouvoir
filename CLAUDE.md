# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo for the **Index de Féminisation du Pouvoir** — a data journalism project tracking women's representation in French power structures. It has two main parts:
- **`nextjs/`** — Static Next.js 16 frontend (App Router, TypeScript, Tailwind v4)
- **`scrapers/` + `dbt_ifp/`** — Python data pipeline (Scrapy spiders → DBT transformations)

## Frontend Commands (run from `nextjs/`)

```bash
npm run dev        # Start dev server on localhost:3000
npm run build      # Build static export to ./out/
npm run lint       # Run Biome linter
npm run format     # Auto-format with Biome
npm run serve      # Serve ./out/ after build
```

No test suite exists for the frontend yet.

## Python Commands (run from repo root)

```bash
uv run pytest                          # Run all Python tests
uv run pytest scrapers/tests/test_X.py # Run a single test file
```

## Architecture

### Frontend (`nextjs/src/`)

- **App Router pages** under `app/` — one folder per route segment, each with a `page.tsx`
- **Pouvoirs section** (`app/pouvoirs/`) has its own `layout.tsx` that renders a power-selector nav. The five sub-pages are: `executif/`, `parlementaire/`, `local/`, `autres/`, `monde/`
- **Data** lives in `data/pouvoir.json` — a single JSON file with scores and `composantes` for each pouvoir type. This feeds the pouvoir detail pages.
- **Translations** are all in French, in `messages/fr.json`, loaded via `next-intl`.
- **`components/charts/`** — D3-based chart components (GenderDistributionChart, DoughnutChart)
- **`components/icons/`** — One SVG React component per pouvoir type/context
- **`lib/utils.ts`** — Only exports `cn()` (clsx-based class merger)

### Styling

Tailwind v4 with custom design tokens. Custom fonts (`OxfamHeadline`, `OxfamTstarPro`, `Lato`) loaded from `public/fonts/`. Custom CSS split into `globals.css`, `utilities.css`, `typography.css`. Color tokens follow the pattern `bg-purple-oxfam-*` and `foundations-violet-*`.

### Deployment

`next.config.ts` is set to `output: "export"` (static site). The base path is controlled by `NEXT_PUBLIC_BASE_PATH` env var for GitHub Pages deployment. Image optimization is disabled.

### Linting & Formatting

Biome (not ESLint/Prettier). Config at `nextjs/biome.json`. The root `biome.json` also exists. Imports are auto-organized by Biome.

### Data Pipeline

- **Scrapers** use Scrapy + Playwright to pull data from French government APIs
- **DBT** (`dbt_ifp/`) transforms raw scraped data into the aggregated figures used by the frontend
- Python version: ≥3.13, managed with `uv`

### i18n

`next-intl` v4. All strings go in `messages/fr.json`. The `i18n/request.ts` file configures the locale loader. Use `useTranslations()` hook in client components and server equivalents in server components.
