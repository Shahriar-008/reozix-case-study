# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A pure static site — plain HTML/CSS/JS with **no build step, no framework, no backend, and no tests**. It is the Reozix web agency's vertical-demo portfolio: three hand-built demonstration platforms (Boutique Hotel, Real Estate, Construction), each paired with a written case-study page. The whole repo deploys as-is to any static host.

## Commands

```bash
# Serve locally (required — Lighthouse and relative-path assumptions need HTTP)
python -m http.server 8080
# Then open e.g. http://localhost:8080/case-studies/reozix-hotel.html or /demos/hotel/index.html
```

There is no lint/test/build toolchain. Verification is manual:

- **Lighthouse**: run against a served demo and compare with `demos/assets/screenshots/<vertical>/lighthouse.report.json`. Scores must match the README table — update that table if you change anything performance-relevant. Target: 95+ Performance.
- **Screenshots**: Playwright script(s) in `tools/` (e.g. `node tools/screenshot-realestate.mjs`; requires `npm install` first). Each capture produces a PNG source plus the committed WebP pair in `demos/assets/screenshots/<vertical>/`.

Deploy: Vercel, driven by [`vercel.json`](vercel.json). It permanently redirects the root-relative agency nav links used by case-study headers (`/about`, `/services`, `/portfolio`, `/contact`) to the corresponding pages on reozix.com — those paths do not exist in this repo.

## Architecture

Two layers, deliberately decoupled:

1. **Demos** (`demos/<vertical>/`) — the working product. Each vertical is fully self-contained: its own HTML pages, `css/<vertical>.css`, and vanilla JS. Construction has a Team page (`team.html`) rendered from `CONSTRUCTION_DATA.team`; the real-estate search has an optional Leaflet/OSM map view (no API key). All content is hardcoded in `js/data.js` as a single global object (e.g. `HOTEL_DATA`); page-specific behavior sits beside it (`hotel/js/booking.js`, `realestate/js/search.js`, `construction/js/filters.js`). Cross-vertical sharing is intentionally minimal: only `demos/shared/css/reset.css` and `demos/shared/js/utils.js` (mobile-nav toggle + lightbox with focus trap), referenced relatively as `../shared/…`. Construction injects a per-page SVG icon sprite via `js/icons.js`.

2. **Case studies** (`case-studies/reozix-<vertical>.html`) — standalone marketing pages sharing `case-studies/css/case-studies.css` plus two small vanilla-JS files: `case-studies/js/nav.js` (mobile nav toggle) and `case-studies/js/case.js` (scroll reveals, P→A→R progress rail, sticky mobile CTA, metric count-up; honors `prefers-reduced-motion`). Each page injects its vertical accent inline: `<style>:root{--accent:…}</style>`.

Root `index.html` is the landing page that cards link to the three case studies.

External assets are hotlinked: demo photography from Unsplash, Inter font from Google Fonts (with preconnects) — pages look broken offline.

### Path duality (gotcha)

Repo layout ≠ production URLs. Canonical tags, OG URLs, and `sitemap.xml` point at `https://reozix.com/reozix-<vertical>` because these pages deploy onto the reozix.com server at those paths; locally they resolve as `case-studies/reozix-<vertical>.html`. Keep both sides consistent when adding or moving pages.

### Evidence assets & gitignored files

`demos/assets/screenshots/<vertical>/` holds the PNG/WebP screenshot pairs that case-study pages embed (WebP preferred in markup). The `lighthouse.report.{html,json}` files sitting next to them are provenance dumps and are **gitignored** — as are `.superpowers/`, `.claude/`, `docs/superpowers/`, `tools/`, `package.json`, and `node_modules/`. These are local-only workflow files; never commit them.

## Hard rules

- **No fabricated outcomes.** These pages were deliberately rewritten from fake client case studies into honest "Vertical Demo" pages (history and rationale in `case-studies/RESEARCH-BRIEF.md`). Never invent client names, business KPIs ("+143% bookings", "$180K saved"), or testimonials. The only numbers allowed are real ones measured on the live demos (Lighthouse scores, TTI).
- **Vanilla stack only**: HTML5/CSS3/vanilla JS; no frameworks, backend, database, or payment processing. Mobile-first — everything must work at 375px, with roughly sub-2s TTI.
- **Vertical accents are fixed**: Hotel `#d4a853`, Real Estate `#4a90d9`, Construction `#e8752a`.
