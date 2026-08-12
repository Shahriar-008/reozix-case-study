# Reozix — Vertical Demo Portfolio

A static portfolio for the **Reozix** web agency: three hand-built, per-industry demonstration platforms, each with a case-study page. Every demo is a working Reozix build, and every score is real.

## What this repo is

Three verticals were selected from the Reozix portfolio to demonstrate distinct engineering challenges:

| Vertical | Demo | Case study | Accent |
|----------|------|------------|--------|
| Boutique Hotel | [`demos/hotel/`](demos/hotel/) | [`case-studies/reozix-hotel.html`](case-studies/reozix-hotel.html) | `#d4a853` |
| Real Estate | [`demos/realestate/`](demos/realestate/) | [`case-studies/reozix-realestate.html`](case-studies/reozix-realestate.html) | `#4a90d9` |
| Construction | [`demos/construction/`](demos/construction/) | [`case-studies/reozix-construction.html`](case-studies/reozix-construction.html) | `#e8752a` |

## Directory structure

```
.
├── case-studies/
│   ├── reozix-hotel.html          # Boutique Hotel case study
│   ├── reozix-realestate.html     # Real Estate case study
│   ├── reozix-construction.html   # Construction case study
│   ├── RESEARCH-BRIEF.md          # Vertical selection + project notes
│   └── PORTFOLIO-URL-UPDATES.md   # Portfolio link mapping
├── demos/                         # The actual product (plain HTML/CSS/JS)
│   ├── hotel/                     #   Working hotel demo (rooms, booking flow)
│   ├── realestate/                #   Working real-estate demo (search, appraisal)
│   ├── construction/              #   Working construction demo (portfolio, quote)
│   ├── shared/                    #   Shared CSS/JS
│   └── assets/screenshots/        # Lighthouse evidence + demo screenshots
└── favicon.svg · robots.txt · sitemap.xml · site.webmanifest
```

## Framing note

- **`demos/`** contains the working demo sites for each vertical, built with plain HTML/CSS/JS.
- **`case-studies/`** contains the written case-study pages for each vertical.
- **`demos/assets/screenshots/`** contains the supporting screenshots and Lighthouse report artifacts used by the case studies.
- **`case-studies/RESEARCH-BRIEF.md`** explains the vertical selection and the documentation approach used in this repo.

## Running locally

Serve the repo root over HTTP, then open a case study or demo directly:

```bash
python -m http.server 8080
```

Then visit one of these entry points:

- <http://localhost:8080/case-studies/reozix-hotel.html>
- <http://localhost:8080/case-studies/reozix-realestate.html>
- <http://localhost:8080/case-studies/reozix-construction.html>
- <http://localhost:8080/demos/hotel/index.html>
- <http://localhost:8080/demos/realestate/index.html>
- <http://localhost:8080/demos/construction/index.html>

## Lighthouse evidence

`demos/assets/screenshots/<vertical>/lighthouse.report.json` contains the Lighthouse audit output for each vertical.

- The `.html` / `.json` report artifacts are **kept on disk as provenance** but gitignored (they are large, single-purpose dumps — see [`.gitignore`](.gitignore)).
- The **WebP/PNG screenshots** (`homepage-hero`, `lighthouse-score`, etc.) are committed and referenced by the case-study pages.

Current scores measured on the live demos (Lighthouse 13.4.1, mid-range mobile, simulated 4G, August 2026):

| Metric | Hotel | Real Estate | Construction |
|--------|-------|-------------|--------------|
| Performance | 98 | 100 | 93 |
| Accessibility | 87 | 91 | 93 |
| Best Practices | 96 | 96 | 96 |
| SEO | 100 | 100 | 100 |
| Time to Interactive | 2.4s | 1.4s | 3.1s |

## Verifying

- **Scores are real:** re-run Lighthouse against a served demo and compare against its `lighthouse.report.json` (they should match the table above).
- **Case studies are documented:** each page links to the live demo and the related screenshots, reports, and supporting notes.
- **The repo is self-consistent:** every case-study screenshot path resolves under `demos/assets/screenshots/<vertical>/`, and each case-study "View live demo" link resolves to its `demos/<vertical>/index.html`.

Site: <https://reozix.com> · Sitemap: <https://reozix.com/sitemap.xml>

## Deploying

The repo is a pure static site — no build step. It deploys as-is to any static host (Vercel, Netlify, GitHub Pages, etc.); just point the host at the repo root.

This repo ships a [`vercel.json`](vercel.json) for Vercel deployments. It redirects the root-relative agency nav links (`/about`, `/services`, `/portfolio`, `/contact`) used by the case-study pages to the corresponding live pages on reozix.com — these pages are intended for deployment on the agency site, where those paths resolve natively.
