var HOTEL_DATA = {
  hotel: {
    name: 'Reozix Hotel',
    location: 'Mornington Peninsula, Victoria',
    tagline: 'Where the vineyard meets the sea',
    phone: '+61 3 5984 1200',
    email: 'stay@reozixhotel.com.au'
  },
  // Quoted rates are GST-inclusive (Australian practice): the price shown is
  // the price paid. No resort fees, no checkout surprises.
  taxNote: 'All rates are GST-inclusive. No booking fees.',
  // Display currencies — rates are fixed for the demo; a production build
  // would pull daily rates. Selection persists per browser.
  currencies: {
    AUD: { rate: 1, symbol: '$', label: 'AUD' },
    NZD: { rate: 1.09, symbol: 'NZ$', label: 'NZD' },
    USD: { rate: 0.66, symbol: 'US$', label: 'USD' },
    GBP: { rate: 0.52, symbol: '£', label: 'GBP' }
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
      maxGuests: 2
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
      maxGuests: 2
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
      maxGuests: 2
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
      maxGuests: 4
    }
  ],
  // Three rate plans per room — the structure international booking engines use.
  // Saver is deliberately discounted enough (14%) to justify the commitment;
  // research shows an under-discounted non-refundable rate converts worse than none.
  ratePlans: [
    {
      id: 'flexible',
      name: 'Flexible',
      summary: 'Free cancellation until 48 hours before arrival',
      payment: 'Pay on arrival',
      perNight: 0            // priced at the room's base rate
    },
    {
      id: 'saver',
      name: 'Saver — non-refundable',
      summary: 'Our best price. No changes or refunds after booking',
      payment: 'Pay online now',
      discount: 0.14,        // 14% off base rate
      tag: 'Save 14%'
    },
    {
      id: 'breakfast',
      name: 'Breakfast included',
      summary: 'Full peninsula breakfast for two, daily · free cancellation until 48h',
      payment: 'Pay on arrival',
      perNight: 35           // added to the base rate, per night
    }
  ],
  // Stay extras (upsell surface) — priced once per stay unless noted
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
  guestScore: { overall: 9.4, count: 412, categories: [
    { label: 'Staff', score: 9.6 }, { label: 'Location', score: 9.5 },
    { label: 'Rooms', score: 9.3 }, { label: 'Breakfast', score: 9.2 }
  ]},
  reviews: [
    { text: 'We booked direct and saved $120 compared to the Booking.com price. The room was exactly as shown — if anything, better.', author: 'Michael & Sarah T., Melbourne', score: 9.8, stay: 'Vineyard Suite' },
    { text: 'The booking process took about 90 seconds. I\'ve spent longer waiting for the Booking.com app to load.', author: 'James L., Sydney', score: 9.5, stay: 'Ocean King' },
    { text: 'Stayed here three times now. Always book direct — the late checkout perk alone is worth it.', author: 'Emma R., Adelaide', score: 9.2, stay: 'Garden Queen' }
  ],
  experiences: [
    { title: 'Ridge cellar doors', desc: 'Five of the Peninsula\'s flagship wineries sit within ten minutes of the door. Tastings and transfers arranged at the desk.' },
    { title: 'Bay beaches', desc: 'A ten-minute walk to safe, calm swimming water — the bay side stays glassy when the surf beaches blow out.' },
    { title: 'Peninsula Hot Springs', desc: 'Australia\'s largest natural hot springs, twenty minutes up the hill. Evening bathing sessions bookable through reception.' }
  ],
  faq: [
    { q: 'What time is check-in and check-out?', a: 'Check-in from 2pm, check-out by 10am. Book direct and take late checkout until 1pm on us; until 2pm as a paid extra.' },
    { q: 'When am I charged?', a: 'On Flexible and Breakfast rates you pay nothing today — your card guarantees the room and you pay on arrival. The Saver rate is paid online at booking and cannot be refunded.' },
    { q: 'Can I cancel?', a: 'Flexible and Breakfast rates: free cancellation until 48 hours before check-in. Saver rates are non-refundable, which is why they\'re discounted.' },
    { q: 'Is breakfast available?', a: 'Yes — choose the Breakfast-included rate and a full peninsula breakfast for two is served daily in the conservatory. Otherwise it\'s $38 per person.' },
    { q: 'Do you have parking?', a: 'Yes, on-site parking is free for all guests — no hotel fees, ever.' }
  ]
};

// Deterministic availability simulation — same room + date always shows the
// same count, so urgency badges stay stable across page loads.
window.hotelRoomsLeft = function (roomId, checkin) {
  var s = roomId + ':' + checkin;
  var h = 0;
  for (var i = 0; i < s.length; i++) { h = ((h * 31) + s.charCodeAt(i)) >>> 0; }
  if (h % 6 === 0) return 0;          // sold out for these dates
  return 1 + (h % 3);                 // 1–3 rooms left
};

// Currency-aware money formatter — reads the saved selection (default AUD).
window.hotelMoney = function (n) {
  var cur = 'AUD';
  try { cur = localStorage.getItem('hotel-currency') || 'AUD'; } catch (e) {}
  var def = HOTEL_DATA.currencies[cur] || HOTEL_DATA.currencies.AUD;
  var converted = Math.round(n * def.rate);
  return def.symbol + converted.toLocaleString('en-AU');
};
window.hotelCurrency = function () {
  try { return localStorage.getItem('hotel-currency') || 'AUD'; } catch (e) { return 'AUD'; }
};
