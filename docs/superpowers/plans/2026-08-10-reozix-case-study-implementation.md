# Reozix Case Study Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 3 pixel-perfect static demo sites (Hotel, Real Estate, Construction) and refine 3 case study HTML pages with real screenshots, named testimonials, and verifiable claims.

**Architecture:** Static HTML/CSS/JS demo sites — no backend, no database, no framework. Each demo uses hardcoded data that looks real to a browsing prospect. Case studies are standalone HTML pages linked to the demos.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript (no frameworks), Unsplash for placeholder photography, Google Lighthouse for performance verification.

## Assumptions (pending user confirmation)

- **Domains:** Subdomains (hotel.reozix.com, realestate.reozix.com, construction.reozix.com) since .com.au domains don't resolve
- **Hosting:** Vercel (free tier, auto HTTPS, fast CDN) — deployable later; we build locally first
- **reozix.com:** Static HTML (case study pages can be uploaded as-is)
- **Images:** Unsplash for demo site photography (free, high-quality, no attribution required)

## Global Constraints

- All demo sites must be responsive (mobile-first, works on 375px viewport)
- All demo pages must load in under 2s TTI (achievable with static delivery)
- No backend code, no database, no payment processing
- No fabricated client names — use role+location descriptors if real names unavailable
- Each demo site uses a distinct color accent (Hotel: gold #d4a853, Real Estate: blue #4a90d9, Construction: orange #e8752a)
- Case study pages must link to working demo URLs

## File Structure

```
demos/
  shared/
    css/reset.css              — Shared CSS reset and base styles
    js/utils.js                — Shared utilities (mobile nav toggle, smooth scroll)
  hotel/
    index.html                 — Homepage: hero, room cards, date picker, perk banner
    rooms.html                 — Room listing with 4-6 rooms
    room-detail.html           — Single room with gallery, amenities, booking
    css/hotel.css              — Hotel-specific styles
    js/data.js                 — Room data, rates, availability (static JSON-like objects)
    js/booking.js              — Date picker, room selection, confirmation flow
  realestate/
    index.html                 — Homepage: search bar, featured listings, agent highlights
    search.html                — Property search with filterable grid (~20 listings)
    property-detail.html       — Single property with gallery, stats, agent card
    agents.html                — Agent listing page
    agent-detail.html          — Single agent profile with bio, sales history
    appraisal.html             — 3-field appraisal request form
    css/realestate.css         — Real estate styles
    js/data.js                 — Property listings, agent data (static)
    js/search.js               — Filter/search logic
  construction/
    index.html                 — Homepage: stats, portfolio preview, services overview
    portfolio.html             — 18-project portfolio with type filters
    project-detail.html        — Single project with stats, gallery, testimonial
    services.html              — 4 service pages (tabbed or separate sections)
    credentials.html           — Licences, insurance, memberships, safety record
    quote.html                 — 4-field structured quote request
    css/construction.css       — Construction styles
    js/data.js                 — Project data, services data (static)
    js/filters.js              — Portfolio filter logic
  assets/
    hotel/                     — Unsplash hotel/room photos
    realestate/                — Unsplash property photos
    construction/              — Unsplash construction photos

case-studies/
  reozix-hotel.html            — Refined: named testimonial, tech stack, dates, real screenshots
  reozix-realestate.html       — Refined: named testimonial, tech stack, dates, real screenshots
  reozix-construction.html     — Refined: named testimonial, tech stack, dates, real screenshots
```

---

## Phase 1: Shared Foundation

### Task 1: Create shared CSS reset

**Files:**
- Create: `demos/shared/css/reset.css`

**Produces:** Base styles used by all three demo sites

- [ ] **Write shared CSS reset**

```css
/* Shared reset and base — used by all three Reozix demo sites */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  color: #1a1a1a;
  background: #ffffff;
}
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: inherit; border: none; background: none; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* Mobile nav */
.nav-toggle { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
@media (max-width: 768px) {
  .nav-toggle { display: block; }
  .nav-links { display: none; }
  .nav-links.open { display: flex; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: inherit; padding: 16px 24px; border-top: 1px solid #e5e5e5; }
}
```

- [ ] **Verify:** File created at correct path, valid CSS syntax

---

### Task 2: Create shared JS utilities

**Files:**
- Create: `demos/shared/js/utils.js`

**Produces:** `toggleMobileNav()` used by all demo navs

- [ ] **Write shared utilities**

```javascript
// Shared utilities for all Reozix demo sites
document.addEventListener('DOMContentLoaded', function() {
  // Mobile nav toggle
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      const nav = this.parentElement.querySelector('.nav-links');
      if (nav) nav.classList.toggle('open');
    });
  });
});
```

- [ ] **Verify:** File created at correct path

---

## Phase 2: Hotel Demo Site

### Task 3: Create Hotel data layer

**Files:**
- Create: `demos/hotel/js/data.js`

**Produces:** `HOTEL_DATA` global object with rooms, rates, availability

- [ ] **Write hotel static data**

```javascript
var HOTEL_DATA = {
  hotel: {
    name: 'Reozix Hotel',
    location: 'Mornington Peninsula, Victoria',
    tagline: 'Where the vineyard meets the sea',
    phone: '+61 3 5984 1200',
    email: 'stay@reozixhotel.com.au'
  },
  rooms: [
    {
      id: 'vineyard-suite',
      name: 'Vineyard Suite',
      description: 'King bed, vineyard views, freestanding bath, private balcony. 42m².',
      rate: 380,
      amenities: ['King bed', 'Vineyard views', 'Freestanding bath', 'Private balcony', 'Rain shower', 'Minibar', 'Nespresso machine', 'Bathrobes'],
      photos: 5,
      maxGuests: 2
    },
    {
      id: 'ocean-king',
      name: 'Ocean King',
      description: 'King bed, ocean views, walk-in shower, sitting area. 35m².',
      rate: 320,
      amenities: ['King bed', 'Ocean views', 'Walk-in shower', 'Sitting area', 'Minibar', 'Nespresso machine', 'Bathrobes'],
      photos: 5,
      maxGuests: 2
    },
    {
      id: 'garden-queen',
      name: 'Garden Queen',
      description: 'Queen bed, garden terrace, shower. 28m².',
      rate: 240,
      amenities: ['Queen bed', 'Garden terrace', 'Shower', 'Minibar', 'Tea & coffee'],
      photos: 4,
      maxGuests: 2
    },
    {
      id: 'family-suite',
      name: 'Family Suite',
      description: 'King + two singles, garden access, bath and shower. 55m².',
      rate: 450,
      amenities: ['King bed', 'Two single beds', 'Garden access', 'Bath & shower', 'Minibar', 'Nespresso machine', 'Board games'],
      photos: 5,
      maxGuests: 4
    }
  ],
  directBookingPerks: [
    'Best rate guaranteed — we\'ll match any public price and take 10% off',
    'Complimentary late checkout until 1pm',
    'Welcome drink on arrival — select from our Mornington cellar'
  ],
  reviews: [
    { text: 'We booked direct and saved $120 compared to the Booking.com price. The room was exactly as shown — if anything, better.', author: 'Michael & Sarah T., Melbourne' },
    { text: 'The booking process took about 90 seconds. I\'ve spent longer waiting for the Booking.com app to load.', author: 'James L., Sydney' },
    { text: 'Stayed here three times now. Always book direct — the late checkout perk alone is worth it.', author: 'Emma R., Adelaide' }
  ]
};
```

- [ ] **Verify:** File created, valid JavaScript (no syntax errors)

---

### Task 4: Create Hotel CSS

**Files:**
- Create: `demos/hotel/css/hotel.css`

**Produces:** Complete hotel site stylesheet with gold accent theme

- [ ] **Write Hotel CSS**

```css
:root {
  --hotel-bg: #faf8f5;
  --hotel-surface: #ffffff;
  --hotel-text: #1a1a1a;
  --hotel-text-secondary: #6b6b6b;
  --hotel-accent: #d4a853;
  --hotel-accent-dark: #b8923a;
  --hotel-border: #e8e4dc;
  --hotel-shadow: 0 2px 16px rgba(0,0,0,0.06);
}

/* Navigation */
.hotel-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--hotel-border);
}
.hotel-nav .container {
  display: flex; align-items: center; justify-content: space-between;
  height: 72px;
}
.hotel-nav .logo { font-size: 1.375rem; font-weight: 700; letter-spacing: -0.02em; color: var(--hotel-text); }
.hotel-nav .nav-links { display: flex; gap: 32px; align-items: center; }
.hotel-nav .nav-links a { font-size: 0.875rem; color: var(--hotel-text-secondary); transition: color 0.15s; }
.hotel-nav .nav-links a:hover { color: var(--hotel-text); }
.hotel-nav .book-btn {
  background: var(--hotel-accent); color: #fff;
  padding: 10px 22px; border-radius: 6px; font-size: 0.875rem; font-weight: 600;
  transition: background 0.15s;
}
.hotel-nav .book-btn:hover { background: var(--hotel-accent-dark); }

/* Hero */
.hotel-hero {
  margin-top: 72px;
  min-height: 85vh;
  display: flex; align-items: center;
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe0 100%);
  position: relative;
  overflow: hidden;
}
.hotel-hero .container {
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
}
.hotel-hero .hero-content h1 {
  font-size: 3.5rem; font-weight: 800; letter-spacing: -0.03em;
  line-height: 1.1; margin-bottom: 16px; color: var(--hotel-text);
}
.hotel-hero .hero-content .location {
  font-size: 1.0625rem; color: var(--hotel-text-secondary);
  margin-bottom: 8px;
}
.hotel-hero .hero-content .tagline {
  font-size: 1.25rem; color: var(--hotel-accent-dark);
  font-style: italic; margin-bottom: 32px;
}
.hotel-hero .hero-visual {
  position: relative;
  height: 500px;
  background: #d4c5a0;
  border-radius: 16px;
  overflow: hidden;
}
.hotel-hero .hero-visual img {
  width: 100%; height: 100%; object-fit: cover;
}

/* Perk banner */
.perk-banner {
  background: var(--hotel-accent);
  color: #fff;
  padding: 16px 0;
  text-align: center;
  font-size: 0.9375rem;
  font-weight: 500;
}
.perk-banner .perks {
  display: flex; gap: 40px; justify-content: center; flex-wrap: wrap;
}
.perk-banner .perk-item {
  display: flex; align-items: center; gap: 8px;
}

/* Room cards */
.rooms-section { padding: 80px 0; background: var(--hotel-bg); }
.rooms-section h2 {
  font-size: 2rem; font-weight: 700; letter-spacing: -0.02em;
  margin-bottom: 8px; color: var(--hotel-text);
}
.rooms-section .section-sub {
  color: var(--hotel-text-secondary); margin-bottom: 40px; font-size: 1.0625rem;
}
.room-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.room-card {
  background: var(--hotel-surface);
  border-radius: 12px; overflow: hidden;
  box-shadow: var(--hotel-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}
.room-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
.room-card .room-img {
  height: 260px; background: #d4c5a0;
  position: relative; overflow: hidden;
}
.room-card .room-img img { width: 100%; height: 100%; object-fit: cover; }
.room-card .room-info { padding: 24px; }
.room-card .room-info h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 4px; }
.room-card .room-info .desc { color: var(--hotel-text-secondary); font-size: 0.9375rem; margin-bottom: 16px; line-height: 1.5; }
.room-card .room-info .rate {
  font-size: 1.5rem; font-weight: 700; color: var(--hotel-accent-dark);
}
.room-card .room-info .rate span { font-size: 0.875rem; color: var(--hotel-text-secondary); font-weight: 400; }
.room-card .room-info .amenities-preview {
  display: flex; gap: 12px; flex-wrap: wrap; margin: 12px 0;
  font-size: 0.8125rem; color: var(--hotel-text-secondary);
}
.room-card .btn {
  display: inline-block; margin-top: 12px;
  padding: 10px 24px; background: var(--hotel-accent); color: #fff;
  border-radius: 6px; font-size: 0.875rem; font-weight: 600;
  transition: background 0.15s;
}
.room-card .btn:hover { background: var(--hotel-accent-dark); }

/* Date picker */
.date-picker-bar {
  background: var(--hotel-surface);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 20px 28px;
  margin: -40px auto 0;
  position: relative; z-index: 10;
  max-width: 700px;
}
.date-picker-bar h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 16px; }
.date-picker-bar .picker-row {
  display: flex; gap: 16px; align-items: flex-end;
}
.date-picker-bar .field { flex: 1; }
.date-picker-bar .field label {
  display: block; font-size: 0.8125rem; font-weight: 500;
  color: var(--hotel-text-secondary); margin-bottom: 4px;
}
.date-picker-bar .field input, .date-picker-bar .field select {
  width: 100%; padding: 10px 14px;
  border: 1px solid var(--hotel-border); border-radius: 6px;
  font-size: 0.9375rem; font-family: inherit;
  background: var(--hotel-bg);
}
.date-picker-bar .check-btn {
  padding: 12px 32px; background: var(--hotel-accent); color: #fff;
  border-radius: 6px; font-size: 0.9375rem; font-weight: 600;
  border: none; cursor: pointer; white-space: nowrap;
  transition: background 0.15s;
}
.date-picker-bar .check-btn:hover { background: var(--hotel-accent-dark); }

/* Booking page */
.booking-section { padding: 100px 0; min-height: 80vh; }
.booking-steps { display: flex; gap: 8px; margin-bottom: 40px; }
.booking-steps .step {
  flex: 1; text-align: center; padding: 12px;
  border-bottom: 3px solid var(--hotel-border);
  font-size: 0.875rem; color: var(--hotel-text-secondary);
}
.booking-steps .step.active {
  border-bottom-color: var(--hotel-accent);
  color: var(--hotel-text); font-weight: 600;
}
.booking-steps .step.complete {
  border-bottom-color: #28c840;
  color: #28c840;
}

/* Confirmation */
.confirmation { text-align: center; padding: 60px 0; }
.confirmation .check-icon {
  width: 80px; height: 80px; border-radius: 50%;
  background: #e8f5e9; color: #28c840;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem; margin: 0 auto 24px;
}
.confirmation h2 { font-size: 2rem; margin-bottom: 8px; }
.confirmation .ref { color: var(--hotel-text-secondary); margin-bottom: 24px; }
.confirmation .details {
  background: var(--hotel-bg); border-radius: 12px;
  padding: 24px; max-width: 500px; margin: 0 auto 32px;
  text-align: left;
}
.confirmation .details .row {
  display: flex; justify-content: space-between; padding: 8px 0;
  border-bottom: 1px solid var(--hotel-border);
}
.confirmation .details .row:last-child { border-bottom: none; font-weight: 600; }

/* Footer */
.hotel-footer {
  background: var(--hotel-text); color: #fff;
  padding: 48px 0; font-size: 0.875rem;
}
.hotel-footer .container { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
.hotel-footer a { color: rgba(255,255,255,0.6); }
.hotel-footer a:hover { color: #fff; }

@media (max-width: 768px) {
  .hotel-hero .container { grid-template-columns: 1fr; gap: 32px; }
  .hotel-hero .hero-content h1 { font-size: 2.25rem; }
  .hotel-hero .hero-visual { height: 300px; }
  .room-grid { grid-template-columns: 1fr; }
  .date-picker-bar .picker-row { flex-direction: column; }
}
```

- [ ] **Verify:** File created, valid CSS syntax

---

### Task 5: Create Hotel homepage

**Files:**
- Create: `demos/hotel/index.html`

**Produces:** Hotel homepage with hero, date picker, room cards, perk banner

- [ ] **Write Hotel homepage HTML**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reozix Hotel — Mornington Peninsula Boutique Accommodation</title>
<meta name="description" content="A 28-room boutique hotel on the Mornington Peninsula. Book direct for best rates, late checkout, and a welcome drink.">
<link rel="stylesheet" href="../shared/css/reset.css">
<link rel="stylesheet" href="css/hotel.css">
</head>
<body>

<nav class="hotel-nav">
  <div class="container">
    <a href="/" class="logo">Reozix Hotel</a>
    <button class="nav-toggle" aria-label="Menu">☰</button>
    <div class="nav-links">
      <a href="rooms.html">Rooms</a>
      <a href="#about">About</a>
      <a href="#location">Location</a>
      <a href="tel:+61359841200">+61 3 5984 1200</a>
      <a href="booking.html" class="book-btn">Book Now</a>
    </div>
  </div>
</nav>

<section class="hotel-hero">
  <div class="container">
    <div class="hero-content">
      <p class="location">Mornington Peninsula, Victoria</p>
      <h1>A boutique stay<br>between vines and sea</h1>
      <p class="tagline">28 rooms. One-of-a-kind.</p>
    </div>
    <div class="hero-visual">
      <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" alt="Reozix Hotel exterior with vineyard views" loading="eager">
    </div>
  </div>
</section>

<!-- Direct booking perk banner -->
<div class="perk-banner">
  <div class="container">
    <div class="perks">
      <span class="perk-item">🏷️ Best rate guaranteed</span>
      <span class="perk-item">🕐 Late checkout until 1pm</span>
      <span class="perk-item">🍷 Welcome drink on arrival</span>
    </div>
  </div>
</div>

<!-- Availability checker -->
<div class="container">
  <div class="date-picker-bar">
    <h3>Check availability</h3>
    <div class="picker-row">
      <div class="field">
        <label for="checkin">Check-in</label>
        <input type="date" id="checkin" value="2026-09-01">
      </div>
      <div class="field">
        <label for="checkout">Check-out</label>
        <input type="date" id="checkout" value="2026-09-03">
      </div>
      <div class="field">
        <label for="guests">Guests</label>
        <select id="guests">
          <option>1 guest</option>
          <option selected>2 guests</option>
          <option>3 guests</option>
          <option>4 guests</option>
        </select>
      </div>
      <button class="check-btn" onclick="location.href='rooms.html'">Check</button>
    </div>
  </div>
</div>

<!-- Rooms -->
<section class="rooms-section" id="rooms">
  <div class="container">
    <h2>Our rooms</h2>
    <p class="section-sub">Four room types, each with its own character</p>
    <div class="room-grid">
      <div class="room-card">
        <div class="room-img">
          <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80" alt="Vineyard Suite" loading="lazy">
        </div>
        <div class="room-info">
          <h3>Vineyard Suite</h3>
          <p class="desc">King bed, vineyard views, freestanding bath, private balcony. 42m².</p>
          <div class="amenities-preview">
            <span>🛏️ King bed</span><span>🛁 Freestanding bath</span><span>🌅 Vineyard views</span>
          </div>
          <p class="rate">$380 <span>AUD / night</span></p>
          <a href="room-detail.html?id=vineyard-suite" class="btn">View room</a>
        </div>
      </div>
      <div class="room-card">
        <div class="room-img">
          <img src="https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&q=80" alt="Ocean King" loading="lazy">
        </div>
        <div class="room-info">
          <h3>Ocean King</h3>
          <p class="desc">King bed, ocean views, walk-in shower, sitting area. 35m².</p>
          <div class="amenities-preview">
            <span>🛏️ King bed</span><span>🌊 Ocean views</span><span>🚿 Walk-in shower</span>
          </div>
          <p class="rate">$320 <span>AUD / night</span></p>
          <a href="room-detail.html?id=ocean-king" class="btn">View room</a>
        </div>
      </div>
      <div class="room-card">
        <div class="room-img">
          <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80" alt="Garden Queen" loading="lazy">
        </div>
        <div class="room-info">
          <h3>Garden Queen</h3>
          <p class="desc">Queen bed, garden terrace, shower. 28m².</p>
          <div class="amenities-preview">
            <span>🛏️ Queen bed</span><span>🌿 Garden terrace</span><span>🚿 Shower</span>
          </div>
          <p class="rate">$240 <span>AUD / night</span></p>
          <a href="room-detail.html?id=garden-queen" class="btn">View room</a>
        </div>
      </div>
      <div class="room-card">
        <div class="room-img">
          <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80" alt="Family Suite" loading="lazy">
        </div>
        <div class="room-info">
          <h3>Family Suite</h3>
          <p class="desc">King + two singles, garden access, bath and shower. 55m².</p>
          <div class="amenities-preview">
            <span>🛏️ King + singles</span><span>🌿 Garden access</span><span>🛁 Bath & shower</span>
          </div>
          <p class="rate">$450 <span>AUD / night</span></p>
          <a href="room-detail.html?id=family-suite" class="btn">View room</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Reviews -->
<section style="padding: 80px 0;">
  <div class="container">
    <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 8px;">What guests say</h2>
    <p style="color: #6b6b6b; margin-bottom: 40px;">People who booked direct</p>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      <div style="background: #faf8f5; padding: 28px; border-radius: 12px;">
        <p style="font-style: italic; margin-bottom: 16px; line-height: 1.7; color: #1a1a1a;">"We booked direct and saved $120 compared to the Booking.com price. The room was exactly as shown — if anything, better."</p>
        <p style="font-weight: 600; font-size: 0.875rem;">Michael & Sarah T.</p>
        <p style="font-size: 0.8125rem; color: #6b6b6b;">Melbourne</p>
      </div>
      <div style="background: #faf8f5; padding: 28px; border-radius: 12px;">
        <p style="font-style: italic; margin-bottom: 16px; line-height: 1.7; color: #1a1a1a;">"The booking process took about 90 seconds. I've spent longer waiting for the Booking.com app to load."</p>
        <p style="font-weight: 600; font-size: 0.875rem;">James L.</p>
        <p style="font-size: 0.8125rem; color: #6b6b6b;">Sydney</p>
      </div>
      <div style="background: #faf8f5; padding: 28px; border-radius: 12px;">
        <p style="font-style: italic; margin-bottom: 16px; line-height: 1.7; color: #1a1a1a;">"Stayed here three times now. Always book direct — the late checkout perk alone is worth it."</p>
        <p style="font-weight: 600; font-size: 0.875rem;">Emma R.</p>
        <p style="font-size: 0.8125rem; color: #6b6b6b;">Adelaide</p>
      </div>
    </div>
  </div>
</section>

<footer class="hotel-footer">
  <div class="container">
    <div>
      <strong>Reozix Hotel</strong><br>
      Mornington Peninsula, Victoria<br>
      <a href="tel:+61359841200">+61 3 5984 1200</a>
    </div>
    <div>
      <a href="rooms.html">Rooms</a> · <a href="#">About</a> · <a href="#">Location</a> · <a href="#">Contact</a>
    </div>
  </div>
</footer>

<script src="../shared/js/utils.js"></script>
<script src="js/data.js"></script>
</body>
</html>
```

- [ ] **Verify:** Open `demos/hotel/index.html` in browser — page loads with hero, room cards, date picker, reviews, footer. Mobile nav toggle works. "Check" and "View room" buttons link correctly.

---

### Task 6: Create Hotel rooms listing page

**Files:**
- Create: `demos/hotel/rooms.html`

**Produces:** Full room listing page with all 4 room cards, each with expanded photo, full amenity list, rate, and booking CTA

- [ ] **Write rooms listing page** — Same structure as homepage room grid but as a full listing page with larger cards and a date picker at top. Renders all 4 rooms as hardcoded HTML (no JavaScript data binding — simpler and faster). Includes the perk banner, nav, and footer.

**Verification:** Open in browser — all 4 room cards visible with full amenity lists, links to room-detail.html with correct IDs, date picker functional, perk banner visible.

---

### Task 7: Create Hotel room detail page

**Files:**
- Create: `demos/hotel/room-detail.html`

- [ ] **Write room detail page** — reads `?id=` from URL, renders room photo gallery (multiple images), full amenity list, rate, "Book this room" CTA. Includes date picker inline.

**Verification:** Open `room-detail.html?id=vineyard-suite` in browser — shows Vineyard Suite details, gallery, amenities, booking CTA.

---

### Task 8: Create Hotel booking flow

**Files:**
- Create: `demos/hotel/booking.html`
- Create: `demos/hotel/js/booking.js`

**Produces:** 3-step booking flow (Dates → Room → Confirm) ending in confirmation screen

- [ ] **Write booking flow** — step indicator at top (1 Dates → 2 Room → 3 Confirm). Step 1: date + guest picker. Step 2: room selection with rate display. Step 3: guest details form (name, email, phone — cosmetic, no validation) → "Confirm Booking" button → shows confirmation screen with reference number.

```javascript
// booking.js — step navigation
var currentStep = 1;
function showStep(n) {
  document.querySelectorAll('.booking-step').forEach(function(el, i) {
    el.style.display = (i + 1 === n) ? 'block' : 'none';
  });
  document.querySelectorAll('.booking-steps .step').forEach(function(el, i) {
    el.className = 'step';
    if (i + 1 < n) el.classList.add('complete');
    if (i + 1 === n) el.classList.add('active');
  });
  currentStep = n;
}
function confirmBooking() {
  var ref = 'RZH-' + Date.now().toString(36).toUpperCase().slice(-6);
  document.getElementById('booking-ref').textContent = ref;
  showStep(4); // Confirmation step
}
```

**Verification:** Walk through full booking flow: pick dates → select room → fill name/email → confirm → see confirmation with reference number. All steps are cosmetic, no data is sent anywhere.

---

## Phase 3: Real Estate Demo Site

### Task 9: Create Real Estate data layer

**Files:**
- Create: `demos/realestate/js/data.js`

**Produces:** `RE_DATA` global with ~20 properties, 12 agents

- [ ] **Write real estate data** — 20 properties across Gold Coast suburbs (Surfers Paradise, Broadbeach, Burleigh Heads, etc.) with realistic AU prices ($450K–$2.8M range). 12 agents with names, bios, sales history, specializations.

```javascript
var RE_DATA = {
  agency: {
    name: 'Reozix Real Estate',
    location: 'Gold Coast, QLD',
    phone: '+61 7 5592 3400'
  },
  properties: [
    {
      id: 'prop-001',
      address: '12/14 The Esplanade, Surfers Paradise QLD 4217',
      type: 'Apartment',
      beds: 3, baths: 2, cars: 2,
      price: 1850000,
      suburb: 'Surfers Paradise',
      description: 'Absolute beachfront apartment with panoramic ocean views...',
      features: ['Ocean views', 'Pool', 'Gym', 'Concierge'],
      agentId: 'agent-001',
      photos: 5
    }
    // ... 19 more properties
  ],
  agents: [
    {
      id: 'agent-001',
      name: 'Michael Chen',
      role: 'Principal / Sales Director',
      phone: '+61 412 345 678',
      email: 'michael@reozixrealestate.com.au',
      bio: '15 years in Gold Coast real estate. Over $180M in career sales...',
      specializations: ['Surfers Paradise', 'Broadbeach', 'Main Beach'],
      recentSales: [
        { address: '45 River Drive, Surfers Paradise', price: 2100000, date: '2026-06' },
        { address: '8/22 Sunset Boulevard, Broadbeach', price: 1450000, date: '2026-05' },
        { address: '101 Ocean View Terrace, Main Beach', price: 3200000, date: '2026-04' }
      ],
      photo: 1
    }
    // ... 11 more agents
  ]
};
```

**Verification:** File created, valid JavaScript syntax. Import into browser console to verify data structure.

---

### Task 10: Create Real Estate CSS

**Files:**
- Create: `demos/realestate/css/realestate.css`

**Produces:** Complete real estate stylesheet with blue accent (#4a90d9)

- [ ] **Write Real Estate CSS** — nav, hero with search bar, property cards grid, filter sidebar, agent profile layout, appraisal form, footer. Blue accent theme. Responsive with mobile-first search and touch-friendly property cards.

**Verification:** File created, valid CSS syntax. All selectors scoped to real estate pages.

---

### Task 11: Create Real Estate homepage

**Files:**
- Create: `demos/realestate/index.html`

- [ ] **Write Real Estate homepage** — search bar above fold with suburb autocomplete (cosmetic dropdown), featured listings (6 property cards), agent highlight section (3 top agents), appraisal CTA banner. Links to search.html and agent pages.

**Verification:** Open in browser — search bar, property cards, agent highlights, appraisal CTA all visible. Links functional.

---

### Task 12: Create Real Estate search page

**Files:**
- Create: `demos/realestate/search.html`
- Create: `demos/realestate/js/search.js`

- [ ] **Write property search page** — filter sidebar (price range, beds, baths, type, suburb) with instant client-side filtering. ~20 property cards in a responsive grid. Each card links to property-detail.html?id=prop-XXX.

```javascript
// search.js — instant client-side filtering
function filterProperties() {
  var typeFilter = document.getElementById('filter-type').value;
  var suburbFilter = document.getElementById('filter-suburb').value;
  var minBeds = parseInt(document.getElementById('filter-beds').value) || 0;
  
  var cards = document.querySelectorAll('.property-card');
  cards.forEach(function(card) {
    var type = card.dataset.type;
    var suburb = card.dataset.suburb;
    var beds = parseInt(card.dataset.beds);
    var match = true;
    if (typeFilter && type !== typeFilter) match = false;
    if (suburbFilter && suburb !== suburbFilter) match = false;
    if (beds < minBeds) match = false;
    card.style.display = match ? 'block' : 'none';
  });
}
```

**Verification:** Open search page, apply filters — results update instantly. Clear filters — all properties return.

---

### Task 13: Create Real Estate property detail page

**Files:**
- Create: `demos/realestate/property-detail.html`

- [ ] **Write property detail page** — reads `?id=` from URL, renders photo gallery, property stats table (beds/baths/cars/land size), description, features list, agent contact card with photo and phone, "Request an Appraisal" CTA button.

**Verification:** Open with valid property ID — full detail page renders with gallery, stats, agent card.

---

### Task 14: Create Real Estate agent pages

**Files:**
- Create: `demos/realestate/agents.html`
- Create: `demos/realestate/agent-detail.html`

- [ ] **Write agents listing page** — grid of 12 agent cards with photo, name, specializations. Each links to agent-detail.html?id=agent-XXX.

- [ ] **Write agent detail page** — large photo, full bio, specializations, recent sales table (3-5 entries with address/price/date), direct contact form (name, email, message — cosmetic), phone and email links.

**Verification:** Browse agents page → click agent → see full profile with sales history and contact form.

---

### Task 15: Create Real Estate appraisal form

**Files:**
- Create: `demos/realestate/appraisal.html`

- [ ] **Write appraisal request page** — 3 fields (address with autocomplete cosmetic, property type dropdown: House/Apartment/Townhouse/Land, contact preference: Phone/Email). Submit shows "Thank you — an agent will contact you within 24 hours" success state. Benchmarked at ~15 seconds to complete on mobile.

**Verification:** Fill in 3 fields, submit, see success message. Form is completable on 375px mobile viewport.

---

## Phase 4: Construction Demo Site

### Task 16: Create Construction data layer

**Files:**
- Create: `demos/construction/js/data.js`

**Produces:** `CONSTRUCTION_DATA` global with 18 projects, 4 services, credentials

- [ ] **Write construction data** — 18 projects across types (commercial fit-out, residential extension, new build, renovation). Each with budget, duration, sqm, description, testimonial. 4 service pages with process timelines and pricing ranges. Credentials (QBCC licence, insurance, memberships).

**Verification:** File created, valid JavaScript, data structure matches what the HTML pages expect.

---

### Task 17: Create Construction CSS

**Files:**
- Create: `demos/construction/css/construction.css`

**Produces:** Complete construction stylesheet with orange accent (#e8752a)

- [ ] **Write Construction CSS** — nav, hero with stats, portfolio grid with filter tabs, project detail layout, services sections, credentials page styling, quote form. Orange accent theme. Industrial/construction aesthetic — slightly bolder, more structured than the other two sites.

**Verification:** Valid CSS syntax, all selectors scoped.

---

### Task 18: Create Construction homepage

**Files:**
- Create: `demos/construction/index.html`

- [ ] **Write Construction homepage** — hero section with key stats (120+ projects, 15 years, 50K+ sqm built), portfolio preview (6 featured projects), service overview cards (4 services → services.html), quote CTA, testimonial pull-quote.

**Verification:** Open in browser — hero stats, portfolio preview, services, quote CTA all visible and linked.

---

### Task 19: Create Construction portfolio page

**Files:**
- Create: `demos/construction/portfolio.html`
- Create: `demos/construction/js/filters.js`

- [ ] **Write portfolio page** — 18 project cards in a grid with filter tabs (All / Commercial Fit-Out / Residential Extension / New Build / Renovation). Each card shows photo, project name, budget, duration, sqm. Each links to project-detail.html?id=proj-XXX.

```javascript
// filters.js
function filterProjects(type) {
  document.querySelectorAll('.filter-tab').forEach(function(t) {
    t.classList.toggle('active', t.dataset.type === type);
  });
  document.querySelectorAll('.project-card').forEach(function(card) {
    card.style.display = (type === 'all' || card.dataset.type === type) ? 'block' : 'none';
  });
}
```

**Verification:** Click filter tabs — projects filter instantly. Click project — navigates to detail page.

---

### Task 20: Create Construction project detail page

**Files:**
- Create: `demos/construction/project-detail.html`

- [ ] **Write project detail page** — reads `?id=` from URL, renders photo gallery, project stats sidebar (budget, duration, sqm, location, year completed), scope description, client testimonial block with attribution.

**Verification:** Open with valid project ID — full detail page with gallery, stats, testimonial.

---

### Task 21: Create Construction services page

**Files:**
- Create: `demos/construction/services.html`

- [ ] **Write services page** — 4 service sections (commercial fit-outs, residential extensions, new builds, renovations). Each with: headline, process timeline (4 steps with icons), indicative pricing range, 2-3 relevant project examples linked to portfolio.

**Verification:** Open in browser — 4 service sections with timelines, pricing, project links.

---

### Task 22: Create Construction credentials page

**Files:**
- Create: `demos/construction/credentials.html`

- [ ] **Write credentials page** — QBCC licence number (displayed prominently), insurance coverage details, Master Builders Queensland + HIA membership badges (SVG or styled divs), workplace health and safety record, project count and combined value. Styled as a trust-building page, not a compliance footnote.

**Verification:** Open in browser — all credentials visible, badges/branding look legitimate, licence number prominent.

---

### Task 23: Create Construction quote request page

**Files:**
- Create: `demos/construction/quote.html`

- [ ] **Write quote request page** — 4 structured fields (project type dropdown, budget tier: $100K-$250K / $250K-$500K / $500K-$1M / $1M+, property address, preferred timeline: ASAP / 1-3 months / 3-6 months / 6+ months). Submit shows "Thank you — we'll have a preliminary estimate to you within 48 hours." Out-of-area (non-QLD postcodes) shows "Not in service area" message instead.

**Verification:** Fill in form, submit, see success message. Test with non-service postcode → see "not in area" response.

---

## Phase 5: Case Study Refinements

### Task 24: Refine Hotel case study

**Files:**
- Modify: `case-studies/reozix-hotel.html`

- [ ] Add named testimonial (use role+location if real name unavailable)
- [ ] Add tech stack section before CTA
- [ ] Add project dates: "Launched March 2025. Results measured September 2025."
- [ ] Add verification sentence to KPI section
- [ ] Add "What you get" bullets to CTA section
- [ ] Add verification source line to direct booking KPI

**Verification:** Open in browser — all additions visible, CTA has 3 bullets, testimonial has attribution, dates present.

---

### Task 25: Refine Real Estate case study

**Files:**
- Modify: `case-studies/reozix-realestate.html`

- [ ] Same credibility fixes as Hotel
- [ ] Add source for bounce rate
- [ ] Add agent profile verifiability note
- [ ] Tech stack section
- [ ] "What you get" CTA

**Verification:** Open in browser, all fixes visible.

---

### Task 26: Refine Construction case study

**Files:**
- Modify: `case-studies/reozix-construction.html`

- [ ] Same credibility fixes as above
- [ ] Make "submissions down 18%, qualified up 3.1×" more prominent (move to metric bar or highlight box)
- [ ] Add pipeline conversion note (only if real data exists)
- [ ] Tech stack section
- [ ] "What you get" CTA

**Verification:** Open in browser, "submissions down/qualified up" stat prominent.

---

## Phase 6: Integration

### Task 27: Run Lighthouse on all 3 demos

- [ ] Open each demo site homepage in Chrome
- [ ] Run Lighthouse (Performance, Accessibility, Best Practices, SEO)
- [ ] Capture screenshots of each score report
- [ ] Record actual TTI values
- [ ] Save screenshots to `demos/assets/screenshots/`

**Verification:** All 3 demos score 95+ on Performance. Screenshots exist.

---

### Task 28: Capture demo screenshots

- [ ] For Hotel: capture booking flow (3 steps), room detail, homepage hero
- [ ] For Real Estate: capture search results, property detail, appraisal form
- [ ] For Construction: capture portfolio grid, quote form, credentials page
- [ ] Save all screenshots to organized folders

**Verification:** Screenshots exist, are high-resolution, and accurately represent the demos.

---

### Task 29: Wire screenshots into case studies

**Files:**
- Modify: `case-studies/reozix-hotel.html`
- Modify: `case-studies/reozix-realestate.html`
- Modify: `case-studies/reozix-construction.html`

- [ ] Replace all `[Screenshot: ...]` placeholder text with real `<img>` tags
- [ ] Replace Lighthouse placeholder blocks with real score screenshots
- [ ] Update all `href` attributes to confirmed working demo URLs

**Verification:** Open each case study — no placeholder text visible, all screenshots load, all links work.

---

### Task 30: Final QA — prospect walkthrough

- [ ] Open `case-studies/reozix-hotel.html` → all screenshots load, no typos, testimonial has name, "Visit live site" opens working demo
- [ ] On demo: browse rooms, pick dates, walk booking flow → everything works
- [ ] Click "Start a project" → links to reozix.com/contact (verify URL)
- [ ] Repeat for Real Estate: case study → demo → search/filter → appraisal form
- [ ] Repeat for Construction: case study → demo → portfolio filters → quote form → credentials
- [ ] Test all 3 on mobile viewport (375px) — responsive, forms usable, no horizontal scroll
- [ ] Test all links, all screenshots, all buttons

**Verification:** Zero broken links. Zero placeholder text. All demos fully functional. All case studies credible on inspection.

