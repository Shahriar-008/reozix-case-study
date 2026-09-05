// =====================================================================
// Reozix Standalone Demos — Universal State & Persistence Engine (SiteStore)
// Manages reactive localStorage state for Hotel, Real Estate & Construction,
// providing complete CRUD for website details, catalog items, and CRM leads.
// =====================================================================

(function(window) {
  'use strict';

  var STORAGE_KEYS = {
    hotel: 'reozix_hotel_data',
    realestate: 'reozix_realestate_data',
    construction: 'reozix_construction_data',
    leads: 'reozix_leads_data',
    settings: 'reozix_admin_settings'
  };

  // Factory Default Data Seeds
  var DEFAULTS = {
    hotel: {
      details: {
        name: 'Reozix Hotel',
        tagline: 'Where the vineyard meets the sea',
        location: 'Mornington Peninsula, Victoria',
        address: '142 Shoreline Ridge, Red Hill VIC 3937',
        phone: '+61 3 5984 1200',
        email: 'stay@reozixhotel.com.au',
        hours: 'Front Desk 24 Hours / 7 Days',
        accentColor: '#d4a853',
        taxNote: 'All rates are GST-inclusive. No booking fees.',
        heroKicker: 'Mornington Peninsula · Victoria',
        heroTitle: 'A boutique stay between vines and sea',
        heroSubtitle: 'Twenty-eight individually designed rooms on the ridge where the vineyard belt meets the bay.',
        heroScore: '9.4',
        heroReviewsCount: '412',
        announcement: {
          enabled: false,
          badge: 'Exclusive Offer',
          text: 'Enjoy complimentary cellar tasting and late checkout on all direct bookings this month.',
          link: 'booking.html'
        }
      },
      rooms: [
        {
          id: 'vineyard-suite',
          name: 'Vineyard Suite',
          imgId: '1590490360182-c33d57733427',
          description: 'King bed, vineyard views, freestanding bath, private balcony. 42m².',
          rate: 380,
          view: 'vineyard',
          amenities: ['King bed', 'Vineyard views', 'Freestanding bath', 'Private balcony', 'Rain shower', 'Minibar', 'Nespresso machine', 'Bathrobes'],
          photos: 5,
          maxGuests: 2,
          featured: true
        },
        {
          id: 'ocean-king',
          name: 'Ocean King',
          imgId: '1595576508898-0ad5c879a061',
          description: 'King bed, ocean views, walk-in shower, sitting area. 35m².',
          rate: 320,
          view: 'ocean',
          amenities: ['King bed', 'Ocean views', 'Walk-in shower', 'Sitting area', 'Minibar', 'Nespresso machine', 'Bathrobes'],
          photos: 5,
          maxGuests: 2,
          featured: true
        },
        {
          id: 'garden-queen',
          name: 'Garden Queen',
          imgId: '1582719478250-c89cae4dc85b',
          description: 'Queen bed, garden terrace, shower. 28m².',
          rate: 240,
          view: 'garden',
          amenities: ['Queen bed', 'Garden terrace', 'Shower', 'Minibar', 'Tea & coffee'],
          photos: 4,
          maxGuests: 2,
          featured: false
        },
        {
          id: 'family-suite',
          name: 'Family Suite',
          imgId: '1566665797739-1674de7a421a',
          description: 'King + two singles, garden access, bath and shower. 55m².',
          rate: 450,
          view: 'garden',
          amenities: ['King bed', 'Two single beds', 'Garden access', 'Bath & shower', 'Minibar', 'Nespresso machine', 'Board games'],
          photos: 5,
          maxGuests: 4,
          featured: true
        }
      ],
      ratePlans: [
        {
          id: 'flexible',
          name: 'Flexible',
          summary: 'Free cancellation until 48 hours before arrival',
          payment: 'Pay on arrival',
          perNight: 0
        },
        {
          id: 'saver',
          name: 'Saver — non-refundable',
          summary: 'Our best price. No changes or refunds after booking',
          payment: 'Pay online now',
          discount: 0.14,
          tag: 'Save 14%'
        },
        {
          id: 'breakfast',
          name: 'Breakfast included',
          summary: 'Full peninsula breakfast for two, daily · free cancellation until 48h',
          payment: 'Pay on arrival',
          perNight: 35
        }
      ],
      extras: [
        { id: 'wine-tasting', name: 'Private cellar-door tasting', detail: 'Two seats at a partner ridge winery, transfers included', price: 85 },
        { id: 'late-checkout', name: 'Late checkout until 2pm', detail: 'Keep the room on your final day', price: 40 },
        { id: 'early-checkin', name: 'Early check-in from 11am', detail: 'Drop the bags and start the weekend early', price: 30 },
        { id: 'sparkling', name: 'Chilled sparkling on arrival', detail: 'A local méthode traditionnelle, waiting in the room', price: 55 }
      ],
      directBookingPerks: [
        'Best rate guaranteed — we\'ll match any public price and take 10% off',
        'Complimentary late checkout until 1pm',
        'Welcome drink on arrival — select from our Mornington cellar'
      ],
      reviews: [
        { text: 'We booked direct and saved $120 compared to the Booking.com price. The room was exactly as shown — if anything, better.', author: 'Michael & Sarah T., Melbourne', score: 9.8, stay: 'Vineyard Suite', date: '3 days ago' },
        { text: 'The booking process took about 90 seconds. Sunset by the mineral pool was magical.', author: 'James L., Sydney', score: 9.5, stay: 'Ocean King', date: '1 week ago' },
        { text: 'Stayed here three times now. Always book direct — the late checkout perk alone is worth it.', author: 'Emma R., Adelaide', score: 9.2, stay: 'Garden Queen', date: '2 weeks ago' },
        { text: 'The private cellar tasting arranged by the concierge was the highlight of our Mornington trip.', author: 'David & Chloe K., Brisbane', score: 9.7, stay: 'Family Suite', date: '3 weeks ago' }
      ],
      experiences: [
        { title: 'Ridge cellar doors', desc: 'Five of the Peninsula\'s flagship wineries sit within ten minutes of the door. Tastings and transfers arranged at the desk.' },
        { title: 'Bay beaches', desc: 'A ten-minute walk to safe, calm swimming water — the bay side stays glassy when the surf beaches blow out.' },
        { title: 'Peninsula Hot Springs', desc: 'Australia\'s largest natural hot springs, twenty minutes up the hill. Evening bathing sessions bookable through reception.' }
      ],
      faq: [
        { q: 'What time is check-in and check-out?', a: 'Check-in from 2pm, check-out by 10am. Book direct and take late checkout until 1pm on us; until 2pm as a paid extra.' },
        { q: 'When am I charged?', a: 'On Flexible and Breakfast rates you pay nothing today — your card guarantees the room and you pay on arrival. The Saver rate is paid online at booking.' },
        { q: 'Can I cancel?', a: 'Flexible and Breakfast rates: free cancellation until 48 hours before check-in. Saver rates are non-refundable.' },
        { q: 'Do you have parking?', a: 'Yes, on-site parking is free for all guests — no hotel fees, ever.' }
      ]
    },

    realestate: {
      details: {
        name: 'Reozix Real Estate',
        tagline: 'Prestige Gold Coast & Coastal Property',
        location: 'Gold Coast, QLD',
        address: 'Level 2, 38 Cavill Avenue, Surfers Paradise QLD 4217',
        phone: '+61 7 5592 3400',
        email: 'enquiries@reozixrealestate.com.au',
        hours: 'Mon–Sat 8:30am–5:30pm · Sun by appointment',
        accentColor: '#4a90d9',
        heroKicker: 'Gold Coast Prestige Property Specialist',
        heroTitle: 'Prestige coastal residences & premier addresses',
        heroSubtitle: 'Direct access to market-leading apartments, waterfront villas, and architect-designed penthouses across the Gold Coast.',
        heroScore: '4.95',
        heroReviewsCount: '240',
        announcement: {
          enabled: false,
          badge: 'New Release',
          text: 'Exclusive off-market Burleigh beachfront residences just listed. Contact our agent team.',
          link: 'search.html'
        }
      },
      properties: [
        {
          id: 'prop-001',
          address: '12/14 The Esplanade, Surfers Paradise QLD 4217',
          type: 'Apartment',
          beds: 3, baths: 2, cars: 2,
          price: 1850000,
          suburb: 'Surfers Paradise',
          description: 'Absolute beachfront apartment with panoramic ocean views over Surfers Paradise. Floor-to-ceiling glass frames the surf from the open-plan living and dining areas, with a generous entertainer\'s balcony and designer kitchen.',
          features: ['Ocean views', 'Pool', 'Gym', 'Concierge'],
          agentId: 'agent-001',
          photos: 5,
          inspection: 'Sat 10:00–10:30am',
          imgUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
          featured: true
        },
        {
          id: 'prop-002',
          address: 'Level 47, 6 Hollywood Way, Surfers Paradise QLD 4217',
          type: 'Penthouse',
          beds: 4, baths: 3, cars: 3,
          price: 2800000,
          suburb: 'Surfers Paradise',
          description: 'Sky-home penthouse with uninterrupted ocean and hinterland views from every room. Four bedrooms, three designer bathrooms and a 50sqm rooftop terrace — the definitive Surfers Paradise address.',
          features: ['Rooftop terrace', 'Ocean views', 'Infinity pool', 'Concierge', 'Three car spaces'],
          agentId: 'agent-001',
          photos: 7,
          inspection: 'Sat 11:00–11:30am',
          imgUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
          featured: true
        },
        {
          id: 'prop-003',
          address: '14/88 Surf Parade, Broadbeach QLD 4218',
          type: 'Apartment',
          beds: 2, baths: 2, cars: 1,
          price: 1350000,
          suburb: 'Broadbeach',
          description: 'North-east facing apartment in the heart of Broadbeach, moments from the beach, Pacific Fair and The Star. Floor-to-ceiling windows, stone benchtops and a superb balcony capture coastal breezes year-round.',
          features: ['Beachfront', 'Pool', 'Air conditioning', 'Secure parking'],
          agentId: 'agent-001',
          photos: 5,
          inspection: 'Sat 9:30–10:00am',
          imgUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
          featured: true
        },
        {
          id: 'prop-004',
          address: '3/19 Albert Avenue, Broadbeach QLD 4218',
          type: 'Townhouse',
          beds: 3, baths: 2, cars: 1,
          price: 920000,
          suburb: 'Broadbeach',
          description: 'Low-maintenance townhouse in a boutique complex, a short stroll to Kurrawa Beach and the Broadbeach dining strip. Open-plan living flows to a private courtyard with established gardens.',
          features: ['Courtyard', 'Air conditioning', 'Open-plan living', 'Single garage'],
          agentId: 'agent-002',
          photos: 4,
          inspection: 'Sat 12:00–12:30pm',
          imgUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
          featured: false
        },
        {
          id: 'prop-005',
          address: '8 Burleigh Street, Burleigh Heads QLD 4220',
          type: 'House',
          beds: 4, baths: 3, cars: 2,
          price: 2450000,
          suburb: 'Burleigh Heads',
          description: 'Architecturally designed beach house just 200m from Burleigh Beach and James Street. Soaring ceilings, timber flooring, heated magnesium plunge pool and an expansive alfresco entertaining pavilion.',
          features: ['Swimming pool', 'Alfresco entertaining', 'Walk to beach', 'Solar panels'],
          agentId: 'agent-002',
          photos: 6,
          inspection: 'Sat 1:00–1:30pm',
          imgUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
          featured: true
        },
        {
          id: 'prop-006',
          address: '22 Oceanview Terrace, Main Beach QLD 4217',
          type: 'Villa',
          beds: 3, baths: 3, cars: 2,
          price: 2150000,
          suburb: 'Main Beach',
          description: 'Modern freestanding villa directly opposite Tedder Avenue dining with direct private access to Main Beach reserve.',
          features: ['Private courtyard', 'Double garage', 'Wine cellar', 'Security system'],
          agentId: 'agent-001',
          photos: 5,
          inspection: 'Sat 2:00–2:30pm',
          imgUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
          featured: false
        }
      ],
      agents: [
        {
          id: 'agent-001',
          name: 'Marcus Vance',
          role: 'Principal & Prestige Sales Specialist',
          phone: '+61 412 884 102',
          email: 'm.vance@reozixrealestate.com.au',
          suburbs: ['Surfers Paradise', 'Broadbeach', 'Main Beach'],
          bio: 'With over 16 years specializing in Gold Coast luxury beachfront and penthouse properties, Marcus has settled more than $420M in prestige real estate.',
          salesCount: 148,
          avgDaysOnMarket: 24,
          imgUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
        },
        {
          id: 'agent-002',
          name: 'Sarah Thompson',
          role: 'Senior Sales Consultant',
          phone: '+61 418 339 510',
          email: 's.thompson@reozixrealestate.com.au',
          suburbs: ['Burleigh Heads', 'Palm Beach', 'Mermaid Beach'],
          bio: 'Sarah is Burleigh and Palm Beach’s foremost lifestyle property advisor, combining authentic coastal roots with tenacious negotiation skill.',
          salesCount: 96,
          avgDaysOnMarket: 21,
          imgUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
        }
      ],
      reviews: [
        { text: 'Marcus secured $180,000 above our reserve for our Surfers Paradise penthouse. Outstanding communication throughout.', author: 'Robert & Diane C.', suburb: 'Surfers Paradise', date: '2 weeks ago' },
        { text: 'Sarah handled our Burleigh Heads sale seamlessly. Found a qualified buyer within 12 days off-market.', author: 'Katherine M.', suburb: 'Burleigh Heads', date: '1 month ago' }
      ],
      faq: [
        { q: 'How do you determine property appraisal value?', a: 'We analyze recent comparable settlements, active local buyer inquiry levels, and unique property attributes to provide an accurate market estimate.' },
        { q: 'Can I sell my property off-market?', a: 'Yes. Over 30% of our luxury transactions occur privately through our verified high-net-worth buyer register without public advertising.' }
      ]
    },

    construction: {
      details: {
        name: 'Reozix Construction',
        tagline: 'Brisbane Commercial & Residential Builder',
        location: 'Brisbane, QLD',
        address: '48 Commercial Road, Newstead QLD 4006',
        phone: '+61 7 3186 2400',
        email: 'projects@reozixconstruction.com.au',
        hours: 'Mon–Fri 7:00am–5:00pm',
        accentColor: '#e8752a',
        licence: 'QBCC #15298834',
        heroKicker: 'QBCC Licensed Master Builder · Brisbane',
        heroTitle: 'Built with conviction. Delivered on time and on budget.',
        heroSubtitle: 'Commercial fit-outs, residential extensions, new builds and architectural renovations delivered across Brisbane and South East Queensland.',
        heroScore: '4.95',
        heroReviewsCount: '112',
        announcement: {
          enabled: false,
          badge: 'Capacity Update',
          text: 'Preliminary estimating calendar open for commercial fit-out projects starting Q3/Q4.',
          link: 'quote.html'
        }
      },
      projects: [
        {
          id: 'proj-001',
          title: 'Meridian Tower Executive Office Fit-Out',
          type: 'Commercial Fit-Out',
          suburb: 'Brisbane CBD',
          budget: 1450000,
          duration: '14 weeks',
          sqm: 1350,
          description: 'Full-floor fit-out of an executive suite across Level 12 of the Meridian Tower, including an open-plan workspace for 120 staff, meeting rooms and a client boardroom. Delivered an ICT suite, commercial kitchen and end-of-trip facilities ahead of schedule.',
          testimonial: { quote: 'Reozix took a bare floor and delivered a workspace our whole team is proud of. They ran the fit-out around our trading hours and handed over a week early.', client: 'David Ashworth', role: 'Managing Director' },
          photos: 8,
          features: ['Open-plan workspace', 'Executive boardroom', 'End-of-trip facilities', 'Commercial kitchen', 'Data-centre ICT suite'],
          completed: '2026-03',
          imgUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
          featured: true
        },
        {
          id: 'proj-002',
          title: 'The Foundry Retail Flagship Store',
          type: 'Commercial Fit-Out',
          suburb: 'Fortitude Valley',
          budget: 620000,
          duration: '10 weeks',
          sqm: 420,
          description: 'Boutique flagship fit-out for an Australian menswear label in the heart of the Valley\'s retail precinct. Exposed-brick feature walls, brushed-steel fixtures and a sculptural central display island.',
          testimonial: { quote: 'Our new flagship opened on time and on budget for the Christmas rush. The fit-out has lifted our brand significantly.', client: 'Marcus Hendry', role: 'Brand Director' },
          photos: 6,
          features: ['Exposed-brick feature walls', 'Custom steel fixtures', 'Display joinery', 'Designer lighting', 'Café kiosk'],
          completed: '2025-11',
          imgUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
          featured: true
        },
        {
          id: 'proj-003',
          title: 'Paddington Heritage Queenslander Extension',
          type: 'Residential Extension',
          suburb: 'Paddington',
          budget: 890000,
          duration: '22 weeks',
          sqm: 340,
          description: 'Two-storey rear extension and pool pavilion to a character-listed 1920s Queenslander. Seamlessly blends heritage VJ paneling with modern blackbutt timber and polished concrete.',
          testimonial: { quote: 'The attention to character detail while creating modern light-filled living spaces was extraordinary.', client: 'Sarah & Liam Croft', role: 'Homeowners' },
          photos: 7,
          features: ['Heritage VJ paneling', 'Polished concrete floors', 'Pool pavilion', 'Double-height ceiling', 'Custom cabinetry'],
          completed: '2025-09',
          imgUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
          featured: true
        },
        {
          id: 'proj-004',
          title: 'Newstead Riverfront Architectural Villa',
          type: 'New Build',
          suburb: 'Newstead',
          budget: 2100000,
          duration: '36 weeks',
          sqm: 520,
          description: 'Luxury concrete-and-glass residence with cantilevered river balconies, integrated automation, and bespoke interior finishes.',
          testimonial: { quote: 'On budget and finished to the millimeter. Reozix handled complex river engineering effortlessly.', client: 'Anthony Bell', role: 'Client' },
          photos: 9,
          features: ['Cantilevered balconies', 'River frontage', 'Integrated automation', 'Basement 4-car garage'],
          completed: '2025-06',
          imgUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
          featured: true
        }
      ],
      services: [
        { id: 'commercial', title: 'Commercial Fit-Outs', desc: 'Full office refurbishments, hospitality fit-outs, healthcare practices, and retail spaces delivered with minimal disruption.', badge: 'Commercial' },
        { id: 'residential', title: 'Architectural Residential', desc: 'Custom luxury new builds, ground-up architectural residences, and whole-home renovations.', badge: 'Residential' },
        { id: 'extensions', title: 'Extensions & Restorations', desc: 'Heritage Queenslander renovations, second-storey additions, and pavilion extensions.', badge: 'Renovations' },
        { id: 'project-mgmt', title: 'Design & Project Management', desc: 'Comprehensive council approvals, engineering sign-offs, and turnkey builder management.', badge: 'End-to-End' }
      ],
      team: [
        { name: 'Nathan Ross', role: 'Managing Director & Builder', exp: '24 years in QLD construction', bio: 'Licensed Master Builder overseeing site quality, estimating accuracy, and direct client consultation.' },
        { name: 'Claire Bennett', role: 'Senior Project Manager', exp: '14 years commercial fit-out', bio: 'Specializes in complex multi-tenant commercial suites and tight handover schedules.' },
        { name: 'Tom Higgins', role: 'Head Estimator & Site Supervisor', exp: '18 years residential carpentry', bio: 'Ensures zero budget surprises through rigorous trade qualifying and daily progress inspections.' }
      ],
      credentials: {
        licence: 'QBCC #15298834 (Open Builder)',
        masterBuilders: 'Member #44921',
        insurance: '$20M Public Liability & Full Contract Works',
        guarantee: '7-Year Structural Warranty & 12-Month Defect Guarantee'
      },
      faq: [
        { q: 'How long does a commercial fit-out take?', a: 'Standard commercial fit-outs range between 8 and 16 weeks depending on floorplate size, joinery complexity, and council approvals.' },
        { q: 'Do you offer fixed-price contracts?', a: 'Yes. Every project is tendered with detailed bill of quantities to guarantee a fixed contract sum with no hidden variations.' }
      ]
    },

    leads: [
      {
        id: 'lead-001',
        vertical: 'hotel',
        type: 'booking',
        title: 'Vineyard Suite · 3 Nights',
        name: 'Alexander Wright',
        email: 'alex.wright@gmail.com',
        phone: '+61 422 109 432',
        amount: 1140,
        status: 'new',
        date: new Date(Date.now() - 3600000 * 4).toISOString(),
        details: {
          room: 'Vineyard Suite',
          checkin: '2026-09-18',
          checkout: '2026-09-21',
          guests: 2,
          plan: 'Flexible',
          extras: ['Private cellar-door tasting'],
          payment: 'Due on arrival'
        },
        notes: 'Requested late checkout and anniversary bottle.'
      },
      {
        id: 'lead-002',
        vertical: 'realestate',
        type: 'appraisal',
        title: 'Appraisal: 4-Bed House in Burleigh Heads',
        name: 'Melissa Jenkins',
        email: 'm.jenkins@outlook.com',
        phone: '+61 411 590 288',
        amount: null,
        status: 'contacted',
        date: new Date(Date.now() - 3600000 * 22).toISOString(),
        details: {
          address: '42 Hill Street, Burleigh Heads QLD 4220',
          beds: 4,
          timeline: 'Next 1–3 months',
          intent: 'Selling to downsize to coastal apartment'
        },
        notes: 'Followed up by Sarah Thompson. Inspection booked for Thursday 2pm.'
      },
      {
        id: 'lead-003',
        vertical: 'construction',
        type: 'quote',
        title: 'Quote: Commercial Fit-Out 650m²',
        name: 'Darren Cooper',
        email: 'dcooper@apexlogistics.com.au',
        phone: '+61 433 876 211',
        amount: 580000,
        status: 'in-progress',
        date: new Date(Date.now() - 3600000 * 48).toISOString(),
        details: {
          projectType: 'Commercial Fit-Out',
          address: 'Eagle Street, Brisbane CBD',
          budgetRange: '$500k – $750k',
          targetStart: 'November 2026',
          sqm: 650
        },
        notes: 'Draft bill of quantities shared. Awaiting architectural drawings review.'
      }
    ]
  };

  // Helper: Deep clone
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // SiteStore Implementation
  var SiteStore = {
    _initialized: false,

    // Initialize or read from localStorage
    init: function() {
      if (this._initialized) return;
      this._initialized = true;

      ['hotel', 'realestate', 'construction'].forEach(function(v) {
        if (!localStorage.getItem(STORAGE_KEYS[v])) {
          localStorage.setItem(STORAGE_KEYS[v], JSON.stringify(DEFAULTS[v]));
        }
      });
      if (!localStorage.getItem(STORAGE_KEYS.leads)) {
        localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(DEFAULTS.leads));
      }
      if (!localStorage.getItem(STORAGE_KEYS.settings)) {
        localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ theme: 'dark', activeVertical: 'hotel' }));
      }
      this.syncGlobals();
    },

    // Read directly from storage without triggering init
    _getDirect: function(vertical) {
      var key = STORAGE_KEYS[vertical];
      if (!key) return null;
      try {
        var val = localStorage.getItem(key);
        return val ? JSON.parse(val) : clone(DEFAULTS[vertical]);
      } catch (e) {
        console.error('Error reading ' + key, e);
        return clone(DEFAULTS[vertical]);
      }
    },

    // Get full data for a vertical
    get: function(vertical) {
      if (!this._initialized) this.init();
      return this._getDirect(vertical);
    },

    // Save full data for a vertical
    save: function(vertical, data) {
      var key = STORAGE_KEYS[vertical];
      if (!key) return;
      try {
        localStorage.setItem(key, JSON.stringify(data));
        this.syncGlobals();
        this.broadcastChange(vertical);
      } catch (e) {
        console.error('Error saving ' + key, e);
      }
    },

    // Update website details for a vertical
    updateDetails: function(vertical, detailsUpdate) {
      var data = this.get(vertical);
      if (!data) return;
      data.details = Object.assign({}, data.details || {}, detailsUpdate);
      this.save(vertical, data);
      return data.details;
    },

    // Get website details
    getDetails: function(vertical) {
      var data = this.get(vertical);
      return data ? (data.details || {}) : {};
    },

    // Get an array collection (e.g. 'rooms', 'properties', 'projects')
    getItems: function(vertical, collection) {
      var data = this.get(vertical);
      return (data && Array.isArray(data[collection])) ? data[collection] : [];
    },

    // Add or update an item in a collection
    saveItem: function(vertical, collection, item) {
      var data = this.get(vertical);
      if (!data) return;
      if (!data[collection]) data[collection] = [];

      var items = data[collection];
      var index = -1;
      if (item.id) {
        index = items.findIndex(function(x) { return x.id === item.id; });
      } else {
        item.id = vertical.substring(0, 3) + '-' + Date.now().toString(36);
      }

      if (index >= 0) {
        items[index] = Object.assign({}, items[index], item);
      } else {
        items.unshift(item);
      }

      this.save(vertical, data);
      return item;
    },

    // Delete an item from a collection
    deleteItem: function(vertical, collection, itemId) {
      var data = this.get(vertical);
      if (!data || !data[collection]) return false;
      var before = data[collection].length;
      data[collection] = data[collection].filter(function(x) { return x.id !== itemId; });
      var changed = data[collection].length !== before;
      if (changed) this.save(vertical, data);
      return changed;
    },

    // CRM Leads management
    getLeads: function(verticalFilter) {
      this.init();
      try {
        var list = JSON.parse(localStorage.getItem(STORAGE_KEYS.leads) || '[]');
        if (verticalFilter && verticalFilter !== 'all') {
          return list.filter(function(l) { return l.vertical === verticalFilter; });
        }
        return list;
      } catch (e) {
        return [];
      }
    },

    addLead: function(lead) {
      this.init();
      var leads = this.getLeads();
      var newLead = Object.assign({
        id: 'lead-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000),
        status: 'new',
        date: new Date().toISOString()
      }, lead);

      leads.unshift(newLead);
      localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(leads));
      this.broadcastChange('leads');
      return newLead;
    },

    updateLead: function(id, updates) {
      this.init();
      var leads = this.getLeads();
      var idx = leads.findIndex(function(l) { return l.id === id; });
      if (idx >= 0) {
        leads[idx] = Object.assign({}, leads[idx], updates);
        localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(leads));
        this.broadcastChange('leads');
        return leads[idx];
      }
      return null;
    },

    deleteLead: function(id) {
      this.init();
      var leads = this.getLeads();
      var filtered = leads.filter(function(l) { return l.id !== id; });
      localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(filtered));
      this.broadcastChange('leads');
      return true;
    },

    // Admin UI settings
    getSettings: function() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{"theme":"dark","activeVertical":"hotel"}');
      } catch (e) {
        return { theme: 'dark', activeVertical: 'hotel' };
      }
    },

    saveSettings: function(settings) {
      var current = this.getSettings();
      var merged = Object.assign({}, current, settings);
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(merged));
      return merged;
    },

    // Restore a vertical (or everything) to defaults
    reset: function(vertical) {
      if (!vertical || vertical === 'all') {
        localStorage.setItem(STORAGE_KEYS.hotel, JSON.stringify(DEFAULTS.hotel));
        localStorage.setItem(STORAGE_KEYS.realestate, JSON.stringify(DEFAULTS.realestate));
        localStorage.setItem(STORAGE_KEYS.construction, JSON.stringify(DEFAULTS.construction));
        localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(DEFAULTS.leads));
      } else if (DEFAULTS[vertical]) {
        localStorage.setItem(STORAGE_KEYS[vertical], JSON.stringify(DEFAULTS[vertical]));
      }
      this.syncGlobals();
      this.broadcastChange(vertical || 'all');
    },

    // Backup & Restore
    exportBackup: function() {
      this.init();
      return JSON.stringify({
        exportedAt: new Date().toISOString(),
        version: '1.0',
        hotel: this.get('hotel'),
        realestate: this.get('realestate'),
        construction: this.get('construction'),
        leads: this.getLeads(),
        settings: this.getSettings()
      }, null, 2);
    },

    importBackup: function(jsonString) {
      try {
        var parsed = JSON.parse(jsonString);
        if (parsed.hotel) localStorage.setItem(STORAGE_KEYS.hotel, JSON.stringify(parsed.hotel));
        if (parsed.realestate) localStorage.setItem(STORAGE_KEYS.realestate, JSON.stringify(parsed.realestate));
        if (parsed.construction) localStorage.setItem(STORAGE_KEYS.construction, JSON.stringify(parsed.construction));
        if (parsed.leads) localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(parsed.leads));
        if (parsed.settings) localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(parsed.settings));
        this.syncGlobals();
        this.broadcastChange('all');
        return true;
      } catch (e) {
        console.error('Failed to import backup:', e);
        return false;
      }
    },

    // Sync in-memory globals (HOTEL_DATA, RE_DATA, CONSTRUCTION_DATA) with current stored data
    syncGlobals: function() {
      var h = this._getDirect('hotel');
      if (h) {
        window.HOTEL_DATA = window.HOTEL_DATA || {};
        window.HOTEL_DATA.hotel = {
          name: h.details.name,
          location: h.details.location,
          tagline: h.details.tagline,
          phone: h.details.phone,
          email: h.details.email,
          address: h.details.address
        };
        window.HOTEL_DATA.taxNote = h.details.taxNote || 'All rates are GST-inclusive. No booking fees.';
        window.HOTEL_DATA.rooms = h.rooms || [];
        window.HOTEL_DATA.ratePlans = h.ratePlans || [];
        window.HOTEL_DATA.extras = h.extras || [];
        window.HOTEL_DATA.directBookingPerks = h.directBookingPerks || [];
        window.HOTEL_DATA.reviews = h.reviews || [];
        window.HOTEL_DATA.experiences = h.experiences || [];
        window.HOTEL_DATA.faq = h.faq || [];
      }

      var re = this._getDirect('realestate');
      if (re) {
        window.RE_DATA = window.RE_DATA || {};
        window.RE_DATA.agency = {
          name: re.details.name,
          location: re.details.location,
          phone: re.details.phone,
          email: re.details.email,
          address: re.details.address
        };
        window.RE_DATA.properties = re.properties || [];
        window.RE_DATA.agents = re.agents || [];
        window.RE_DATA.reviews = re.reviews || [];
        window.RE_DATA.faq = re.faq || [];
      }

      var ct = this._getDirect('construction');
      if (ct) {
        window.CONSTRUCTION_DATA = window.CONSTRUCTION_DATA || {};
        window.CONSTRUCTION_DATA.agency = {
          name: ct.details.name,
          location: ct.details.location,
          phone: ct.details.phone,
          email: ct.details.email,
          address: ct.details.address,
          licence: ct.details.licence
        };
        window.CONSTRUCTION_DATA.projects = ct.projects || [];
        window.CONSTRUCTION_DATA.services = ct.services || [];
        window.CONSTRUCTION_DATA.team = ct.team || [];
        window.CONSTRUCTION_DATA.credentials = ct.credentials || {};
        window.CONSTRUCTION_DATA.faq = ct.faq || [];
      }
    },

    // Broadcast change event locally and across tabs
    broadcastChange: function(source) {
      try {
        window.dispatchEvent(new CustomEvent('reozix:data-change', { detail: { source: source } }));
      } catch (e) {}
    }
  };

  // Auto initialize
  SiteStore.init();

  // Listen to storage events from other open tabs
  window.addEventListener('storage', function(e) {
    if (e.key && e.key.indexOf('reozix_') === 0) {
      SiteStore.syncGlobals();
      SiteStore.broadcastChange('storage-event');
    }
  });

  window.SiteStore = SiteStore;

})(typeof window !== 'undefined' ? window : this);
