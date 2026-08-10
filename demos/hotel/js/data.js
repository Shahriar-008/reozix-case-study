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
