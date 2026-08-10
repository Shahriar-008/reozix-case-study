# Portfolio Page — Required URL Updates

The current portfolio page at reozix.com/portfolio needs link updates to support the 3 new vertical demo pages.

## Framing note

These are **vertical demo pages**, not traditional client case studies. Each page is clearly labeled "Vertical Demo" in the hero section and describes a Reozix-built demonstration platform — not a client engagement. The narrative focuses on industry pain points (with cited research), Reozix's technical architecture, and real Lighthouse scores measured on the live demos.

## Current state (from live site scrape)

| # | Vertical | Current Case Study Link | Status |
|---|----------|------------------------|--------|
| 01 | Café | `/reozix-cafe` | OK — existing page |
| 02 | Fine Dining | `/reozix-cafe` | **DUPLICATE** — same URL as Café, needs separate page |
| 03 | Construction | *(none)* | Needs link → `/reozix-construction` |
| 04 | Landscaping | *(none)* | Not in scope for this batch |
| 05 | eCommerce | *(none)* | Not in scope for this batch |
| 06 | Real Estate | *(none)* | Needs link → `/reozix-realestate` |
| 07 | Boutique Hotel | *(none)* | Needs link → `/reozix-hotel` |
| 08 | NDIS | *(none)* | Not in scope for this batch |

## Required changes

1. **Add 3 new vertical demo URLs** to the portfolio page:
   - `/reozix-hotel` — Boutique Hotel vertical demo (replaces missing link on tile 07)
   - `/reozix-realestate` — Real Estate vertical demo (replaces missing link on tile 06)
   - `/reozix-construction` — Construction vertical demo (replaces missing link on tile 03)

2. **Fix the Fine Dining / Café duplicate**: `/reozix-cafe` is linked from both tile 01 (Café) and tile 02 (Fine Dining). The Fine Dining tile should either:
   - Get its own case study page at `/reozix-restaurant`, OR
   - Be linked to `/reozix-hotel` if the Restaurant demo content overlaps

3. **Deploy the 3 new HTML pages** to the reozix.com server at:
   - `/reozix-hotel` (from `case-studies/reozix-hotel.html`)
   - `/reozix-realestate` (from `case-studies/reozix-realestate.html`)
   - `/reozix-construction` (from `case-studies/reozix-construction.html`)

4. **Consider relabeling the portfolio section** from "Case Studies" to "Vertical Demos" or "Industry Platforms" — this aligns with the honest framing and avoids implying client relationships that don't exist.

## Screenshot notes

Each vertical demo page has placeholder screenshot blocks. Before deployment:
- Capture screenshots from the actual live demo sites (reozixhotel.com.au, reozixrealestate.com.au, reozixconstruction.com.au)
- Run Lighthouse on each demo site and capture the score breakdown
- Replace the placeholder `[Screenshot: ...]` text with actual `<img>` tags
