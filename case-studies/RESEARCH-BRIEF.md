# Vertical Demo Research Brief — Reozix Portfolio

## Framing Change (August 2026)

These pages were originally drafted as traditional client case studies with fabricated business outcomes. After review, they were rewritten as honest **Vertical Demo** pages — transparently Reozix-built demonstration platforms that showcase engineering capability per industry. No fake clients. No fabricated KPIs. Real Lighthouse scores measured on the live demos. The goal is to demonstrate what Reozix can build, not to claim results that didn't happen.

---

## Vertical Selection Rationale

Three verticals were selected from the 8 on the Reozix portfolio page based on:

1. **Commercial pull for AU/CA markets** (Reozix's stated footprint)
2. **Industry data availability** to anchor narratives in real research
3. **Variety** — no two from the same buyer psychology category
4. **Distinct technical demands** — each vertical demonstrates a different engineering capability

### 1. Boutique Hotel (reozixhotel.com.au)
**Why:** Hotel/hospitality is a high-revenue-impact vertical. The OTA dependency problem is documented, measurable, and universally understood. Demonstrates booking engine integration, no-code CMS for non-technical operators, and mobile-first booking UX. Hoteliers are recurring-revenue clients — they need ongoing rate management, seasonal campaigns, and booking engine maintenance.

**Technical capabilities demonstrated:** Direct booking engine, Stripe integration, Payload CMS for room/rate management, mobile-first booking flow, real-time availability calendars.

### 2. Real Estate (reozixrealestate.com.au)
**Why:** Real estate agencies are high-deal-size clients (typical agency revenue $2M–$10M/year in AU). Demonstrates custom property search (Meilisearch), structured appraisal request flow, agent profile CMS, and structured data SEO. Strong AU market fit (Gold Coast, Sydney, Melbourne are agent-dense).

**Technical capabilities demonstrated:** Meilisearch instant search, Payload CMS for listings/agents, structured data (RealEstateListing schema), three-field conversion-optimized appraisal form, responsive property galleries.

### 3. Construction (reozixconstruction.com.au)
**Why:** Construction has the longest, highest-stakes sales cycle of any vertical — and the website is the first credibility check. Demonstrates project portfolio CMS, structured quote engine with built-in qualification, trust signal architecture (licencing, insurance, memberships), and mobile performance for site-based browsing. Distinct from hospitality/real estate — different buyer, different pain points, different proof structure.

**Technical capabilities demonstrated:** Portfolio CMS with structured project metadata (budget, scope, duration), qualified quote request flow with service-area validation, trust signal architecture as conversion content, Sharp image pipeline for heavy photo portfolios.

---

## Research by Vertical

### Boutique Hotel

**Industry pain points (anchor the demo narrative):**
- OTA dependency: Boutique/independent hotels in Australia typically send 60–80% of bookings through Booking.com, Expedia, Wotif, paying 15–22% commission per booking. On an average $280 ADR with 3,600 room-nights/year, that's ~$150K–$200K in commission leakage.
- Booking abandonment: Without an integrated booking engine, guests browse the hotel site for photos then switch to an OTA to book — where the hotel competes on price against every other property.
- Brand invisibility: OTAs render every property in the same template. A boutique hotel's architecture, story, and experience are invisible at the point of purchase.
- Mobile drop-off: 60%+ of hotel traffic is mobile, but most independent hotel sites aren't responsive. Mobile conversion rates on non-optimized hotel sites are below 0.5%.

**Benchmark sources:**
- SiteMinder Global Hotel Booking Trends (2024) — direct vs OTA channel split benchmarks
- IBISWorld Hotels & Resorts Australia — net profit margin range 18–22%
- Google Travel Insights (2023) — 1s load improvement = up to 27% conversion lift for travel
- Whiteboard Strategy Group hotel digital benchmark — direct booking share improvement ranges

**Buyer priorities (hotel owner/GM):**
- Reduce commission costs without reducing occupancy
- Platform they can operate without a developer
- Booking flow that matches OTA UX quality
- Mobile performance (guests book on phones)

**Competitor case study format references:**
- Hotelchamp (Netherlands) — data-heavy, metric-first, "commission saved" framing
- Journey (UK) — visual storytelling, before/after booking funnel diagrams
- Screen Pilot (US) — technical deep-dive + revenue impact side-by-side

---

### Real Estate

**Industry pain points (anchor the demo narrative):**
- Broken listing search: Most agency sites use third-party iframe/IDX embeds that are slow, ugly, and don't support filtering. 68%+ search abandonment is common.
- Appraisal friction: The highest-value conversion (appraisal request → listing agreement → $15K–$35K commission) is buried behind generic contact forms with 10+ fields.
- Invisible agents: Agencies sell the brand but buyers/sellers choose an agent. No agent profiles = no trust = no conversion.
- Mobile bounce: 58% of real estate traffic is mobile (REA Group, 2024). Non-responsive sites lose the majority of mobile prospects.

**Benchmark sources:**
- REA Group Annual Report (2024) — AU real estate digital behavior
- ActivePipe CRM benchmarks — agency lead conversion rates
- Baymard Institute — form field reduction impact on mobile conversion
- Google Chrome UX Report — real estate site performance quartiles
- NAR Profile of Home Buyers and Sellers — online agent discovery stats

**Buyer priorities (agency principal):**
- Appraisal requests — the metric that pays for everything
- Agent adoption (do agents actually use the platform?)
- SEO visibility against REA Group / Domain portals
- Lead quality over lead volume

**Competitor case study format references:**
- Agentpoint (AU) — search-performance-led, suburb ranking proof
- Real Estate Webmasters (CA/US) — agent story + tech + ROI structure
- Placester (US) — conversion-rate-focused, A/B test methodology shown

---

### Construction

**Industry pain points (anchor the demo narrative):**
- No proof of capability: Construction buyers need evidence — project photos, stats, testimonials. A 5-page brochure site with no portfolio fails the first credibility check.
- Blind quoting process: Generic contact forms produce incomplete submissions that take 4+ days to chase down. Speed-to-quote is the #1 predictor of close rate in construction.
- Zero trust signals: No licencing, insurance, memberships, or safety records visible. High-trust purchase with no trust infrastructure.
- Desktop-only design: 55%+ of construction traffic is mobile (site managers, architects, homeowners browsing on-site).

**Benchmark sources:**
- Home Builder Digital Marketing Benchmark (2024) — website conversion rate 2.5–5.8%
- Construction Marketing Association — speed-to-quote impact on close rate (64% first credible quote wins)
- Google Core Web Vitals — construction/home-services load time vs conversion correlation

**Buyer priorities (construction director/owner):**
- Qualified leads over lead volume (tire-kickers cost estimating time)
- Trust signals that close the credibility gap before the first meeting
- Speed to quote — the construction sales cycle rewards the first responder
- Portfolio that sells capability without needing a site visit

**Competitor case study format references:**
- Builder Funnel (US) — before/after lead volume + project value
- Home Builder Growth Zone (CA) — structured problem → system → proof format
- Construction Marketing (AU) — trust-architecture-led case studies with credential emphasis

---

## Performance Metrics (Measured on Live Demos)

These are real Lighthouse scores from the deployed demo platforms, not fabricated business outcomes.

| Metric | Hotel | Real Estate | Construction |
|--------|-------|-------------|--------------|
| Lighthouse Performance | 99 | 100 | 93 |
| Accessibility | 100 | 91 | 93 |
| Best Practices | 100 | 96 | 96 |
| Time to Interactive | 1.7s LCP* | 1.4s | 3.1s |
| SEO | 100 | 100 | 100 |

\* Hotel re-measured August 2026 after the booking-platform rebuild (Lighthouse
13.4.1, mobile emulation, simulated 4G): FCP 1.4s, LCP 1.7s, TBT 82ms.

CI enforces a 95+ Performance gate on pull requests; current demo scores are recorded in the table above.

---

## Deleted: Fabricated KPI Table

The original research brief contained a "KPI Plausibility Cross-Reference" table with fabricated business outcomes:
- +143% direct bookings (Hotel) — fabricated
- −27% OTA dependency (Hotel) — fabricated
- $180K saved fees/yr (Hotel) — fabricated
- +2.4× appraisal requests (Real Estate) — fabricated
- −61% bounce rate (Real Estate) — fabricated
- $2.4M pipeline Q1 (Construction) — fabricated
- −38% time-to-quote (Construction) — fabricated

These were removed. The case study pages now display only real, measurable Lighthouse scores from the live demo sites.
