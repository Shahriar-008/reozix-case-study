# Reozix — Vertical Demo Portfolio

A static portfolio for the **Reozix** web agency: three hand-built, per-industry demonstration platforms, each with a case-study page. This repository is the honest counterpart to a traditional "client results" portfolio — every demo is a working Reozix build, and every score is real.

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
├── index.html                     # Landing page — one card per vertical
├── case-studies/
│   ├── reozix-hotel.html          # Boutique Hotel case study
│   ├── reozix-realestate.html     # Real Estate case study
│   ├── reozix-construction.html   # Construction case study
│   ├── RESEARCH-BRIEF.md          # Vertical selection + honest framing
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

- **`demos/`** is the actual product — plain HTML/CSS/JS demonstration platforms you can click through. They are honest demonstrations, not client engagements.
- **`case-studies/`** pages describe the **aspirational future stack** for each vertical (Next.js / React Server Components / Payload CMS / Stripe / Meilisearch / Postgres / Vercel). That language is intentional and describes the engineering target, not a live production deployment in this repo.
- No fake clients and no fabricated KPIs. The only measured numbers are the Lighthouse scores from the live demos (see [RESEARCH-BRIEF.md](case-studies/RESEARCH-BRIEF.md)).

## Running locally

Serve the repo root over HTTP, then open the landing page:

```bash
python -m http.server 8080
```

Then visit <http://localhost:8080/> (or open `index.html` directly from disk).

## Lighthouse evidence

The truth lives in `demos/assets/screenshots/<vertical>/lighthouse.report.json` — one per vertical, with the full audit breakdown.

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
- **Case studies are honest:** each page is labeled *Vertical Demo* and references the live demo — no fabricated client outcomes.
- **The repo is self-consistent:** every case-study screenshot path resolves under `demos/assets/screenshots/<vertical>/`, and each case-study "View live demo" link resolves to its `demos/<vertical>/index.html`.

Site: <https://reozix.com> · Sitemap: <https://reozix.com/sitemap.xml>
