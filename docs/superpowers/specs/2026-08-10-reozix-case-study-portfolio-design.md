# Reozix Case Study Portfolio — Design Spec

**Date:** 2026-08-10
**Status:** Approved — ready for implementation plan
**Goal:** Live, credible case study pages at reozix.com/portfolio that hook AU/CA prospects by proving Reozix can build what it claims.

### Credibility Principle

The demo sites are capability showcases — they demonstrate what Reozix can build, not projects delivered for paying clients. The case study KPIs and claims should be clearly framed as either: (a) real results from real clients (use actual data), or (b) projected/illustrative results based on industry benchmarks (label them as such). Never present fabricated client names, fabricated results, or fabricated testimonials as real. A prospect who discovers a lie will never become a client.

---

## Problem Summary

Reozix has 3 well-written case study HTML pages (Hotel, Real Estate, Construction) but they lack credibility: demo sites don't exist, screenshots are placeholders, testimonials are anonymous, and Lighthouse scores are unverifiable. A prospect clicking "Visit live site" gets a DNS error. The case studies read as fiction.

## Solution Overview

Two parallel workstreams over ~3 weeks:

- **Stream A:** Build 3 pixel-perfect static demo sites (look real, static data, no backend) at reozixhotel.com.au, reozixrealestate.com.au, reozixconstruction.com.au
- **Stream B:** Refine the 3 case study HTML pages with named testimonials, tech stack sections, project dates, and vertical-specific CTAs
- **Integration (week 3):** Deploy demos → run Lighthouse → capture screenshots → wire into case studies → deploy to reozix.com

---

## Stream A: Demo Site Specs

All three demos share these characteristics:
- **Static HTML/CSS/JS** — no backend, no database, no payment processing
- **Pixel-perfect UI** — indistinguishable from a real production app to a browsing prospect
- **Responsive** — mobile-first, works on 375px viewport
- **Fast** — sub-2s TTI target, Lighthouse 95+ achievable with static delivery
- **Hosted on Vercel or Netlify** — free tier, automatic HTTPS, fast CDN

### A1. Reozix Hotel (reozixhotel.com.au)

Pages needed:
| Page | Content |
|------|---------|
| Homepage | Hero with hotel branding, direct-booking perk banner (best rate + late checkout + welcome drink), room preview cards, cosmetic date picker |
| Rooms listing | 4–6 room types, large photos, amenity icons, rates, "Check Availability" per room |
| Room detail | Gallery carousel (4+ photos), full amenity list, embedded availability calendar, "Book Now" button |
| Booking flow | 3 screens: Dates → Room → Confirm. Final screen: "Booking confirmed! Check your email." Pre-filled data, looks real, no payment. |
| Mobile | All pages responsive, booking flow works on 375px |

Key interactions that must feel real:
- Date picker highlights available/unavailable dates
- Room selection updates the total price
- Confirmation screen shows booking reference number

### A2. Reozix Real Estate (reozixrealestate.com.au)

Pages needed:
| Page | Content |
|------|---------|
| Homepage | Search bar above fold, suburb autocomplete (cosmetic), featured listings, agent highlights, appraisal CTA |
| Property search | Filterable grid (~20 hardcoded listings), filters: price/beds/baths/type/suburb, instant response, property cards with photo + price + stats |
| Property detail | Photo gallery, stats table, agent contact card, "Request an Appraisal" CTA |
| Agent profiles | 12 agent pages — photo, bio, sales history table, area specialization, direct contact form |
| Appraisal flow | 3 fields: address, property type dropdown, contact preference. Submits to "Thank you — an agent will contact you within 24 hours." |
| Mobile | All responsive, search works on touch, form under 15 seconds |

Key interactions that must feel real:
- Search filters update results instantly (under 100ms)
- Property cards link to detail pages
- Appraisal form validates and shows success state

### A3. Reozix Construction (reozixconstruction.com.au)

Pages needed:
| Page | Content |
|------|---------|
| Homepage | Hero with project stats (X projects, Y years, Z sqm), portfolio preview, service overview cards, quote CTA |
| Portfolio | 18 projects with photography, filter by type (commercial fit-out / residential extension / new build), stats card per project (budget, duration, sqm) |
| Project detail | Photo gallery, scope description, project stats sidebar, client testimonial block |
| Services | 4 service pages (commercial fit-outs, residential extensions, new builds, renovations) — each with process timeline, indicative pricing, relevant project examples |
| Credentials | QBCC licence number, insurance, Master Builders Queensland + HIA badges, safety record, project count |
| Quote request | 4 structured fields: project type, budget tier, address, timeline. Submits to "We'll have a preliminary estimate within 48 hours." |
| Mobile | All responsive, lazy-loaded galleries, tappable phone numbers, sub-2s load |

Key interactions that must feel real:
- Portfolio filters show/hide projects instantly
- Quote form qualifies before submitting (out-of-area = routed to "not a fit" response)
- Credentials page is navigable from primary nav

---

## Stream B: Case Study Refinements

### Credibility fixes (all 3 pages)

| Issue | Current | Fix |
|-------|---------|-----|
| Anonymous testimonials | "Hotel General Manager, regional Victoria" | Use real client names and properties with permission. If client prefers anonymity, use role + location + property type (e.g. "Owner, 28-room boutique hotel, Mornington Peninsula") — specific enough to be credible, vague enough to protect privacy. Never fabricate a name that sounds like a real person. |
| Placeholder screenshots | `[Screenshot: Room detail page...]` | Replace with real `<img>` tags from deployed demos |
| Unverifiable Lighthouse scores | Claims 97–99, no report | Run Lighthouse on deployed demos, capture real score screenshots |
| No project dates | "Six months post-launch" | Add: "Launched March 2025. Results measured September 2025." |
| Editorial "Why it worked" | Reads like a blog post | Add a stat or client quote to each of the 3 "why" points |

### Structural additions (all 3 pages)

1. **Tech stack callout** — small section listing stack (signals engineering competence, Reozix's differentiator)
2. **Vertical-specific "What you get" CTA** — 3 bullets tailored to each vertical so prospects know exactly what they're buying
3. **Social proof footer** — "Trusted by" with client count/logos

### Page-specific fixes

**Hotel:**
- Add verification sentence: "The owner confirmed these figures against their SiteMinder dashboard 6 months post-launch."
- Replace placeholder domain screenshot with actual booking flow screenshots

**Real Estate:**
- "12 agents onboarded" → verifiable by browsing agent profiles on the live demo
- Add source for bounce rate: "Measured via Google Analytics, 90-day pre-launch vs. 90-day post-launch."

**Construction:**
- Add follow-up to $2.4M pipeline: if real conversion data exists, add it (e.g. "As of [real date], X of 14 qualified opportunities converted to signed contracts."). If no real conversion data is available, keep the pipeline figure but frame it as projected, not confirmed.
- Make "submissions down 18%, qualified up 3.1×" more prominent — it's the single strongest proof point

---

## Integration & Deployment

### Sequence (Week 3)

1. Deploy 3 demos to their domains (or subdomains)
2. Run Google Lighthouse on each demo — capture real scores
3. Take screenshots of key flows: booking completion, search results, portfolio grid, quote form
4. Replace all `[Screenshot: ...]` placeholders with real `<img>` tags
5. Replace placeholder Lighthouse blocks with real score screenshots
6. Update all "Visit live site" hrefs to confirmed working URLs
7. Test every link, screenshot, and claim against the live demos
8. Upload 3 HTML pages to reozix.com at /reozix-hotel, /reozix-realestate, /reozix-construction
9. Update reozix.com/portfolio page: add 3 case study links, fix Café/Fine Dining duplicate
10. QA: full prospect walkthrough — portfolio → case study → demo → "Start a project"

### Open Decisions (must resolve before Stream A starts)

| Decision | Question | Impact |
|----------|----------|--------|
| **Domains** | Use subdomains (hotel.reozix.com) or register new .com.au domains? The .com.au domains in the case studies don't currently resolve. | Determines "Visit live site" URLs, SSL setup, and DNS configuration |
| **Hosting platform** | Vercel, Netlify, or existing Reozix infrastructure? | Affects deployment workflow and Lighthouse baseline |
| **reozix.com architecture** | Is reozix.com a CMS (WordPress, Webflow, etc.) or static HTML? This determines how we upload and serve the 3 case study HTML pages | Affects integration step 8–9 |
| **Image sourcing** | Where do the demo site photos come from? Hotel room photos, real estate property photos, construction project photos — these need to be high-quality and look authentic | Stock photos risk looking generic; AI-generated risks looking fake. Real project photos are best but may not exist |

### Prospect Walkthrough (success criteria)

1. Lands on reozix.com/portfolio → sees 8 vertical tiles, clicks "Boutique Hotel"
2. Reads reozix.com/reozix-hotel → real screenshots, named testimonial, Lighthouse report, tech stack
3. Clicks "Visit live site" → lands on working demo
4. Browses rooms, checks availability, walks through booking flow → it works
5. Thinks: "They actually built this. I want one."
6. Clicks "Start a project" → lands on reozix.com/contact

**Every link, screenshot, and claim must survive this walkthrough.**

---

## Out of Scope

- Building actual backends (payment processing, CMS, database)
- The 5 other portfolio verticals (Café, Fine Dining, eCommerce, Landscaping, NDIS)
- Reozix.com main site redesign
- SEO/content strategy for the case study pages
- Paid promotion or distribution of the case studies
