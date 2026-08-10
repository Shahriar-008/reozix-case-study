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
      description: 'Absolute beachfront apartment with panoramic ocean views over Surfers Paradise. Floor-to-ceiling glass frames the surf from the open-plan living and dining areas, with a generous entertainer\'s balcony and designer kitchen.',
      features: ['Ocean views', 'Pool', 'Gym', 'Concierge'],
      agentId: 'agent-001',
      photos: 5
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
      photos: 7
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
      photos: 5
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
      agentId: 'agent-010',
      photos: 4
    },
    {
      id: 'prop-005',
      address: '28 West Burleigh Road, Burleigh Heads QLD 4220',
      type: 'House',
      beds: 4, baths: 3, cars: 2,
      price: 2150000,
      suburb: 'Burleigh Heads',
      description: 'Contemporary family home on a generous 607sqm block, minutes to Burleigh\'s famous national park and patrolled beach. Light-filled living spaces open to a resort-style pool and alfresco entertaining deck.',
      features: ['Swimming pool', 'Outdoor entertaining', 'Double garage', 'Walk to beach'],
      agentId: 'agent-002',
      photos: 6
    },
    {
      id: 'prop-006',
      address: '6/45 James Street, Burleigh Heads QLD 4220',
      type: 'Apartment',
      beds: 2, baths: 2, cars: 1,
      price: 765000,
      suburb: 'Burleigh Heads',
      description: 'Sleek two-bedroom apartment two blocks from the sand, in the vibrant Burleigh Heads café precinct. Modern kitchen with stone island bench, secure parking and leafy district views.',
      features: ['Café precinct', 'Stone benchtops', 'Secure parking', 'Air conditioning'],
      agentId: 'agent-002',
      photos: 4
    },
    {
      id: 'prop-007',
      address: '22 Tedder Avenue, Main Beach QLD 4217',
      type: 'House',
      beds: 5, baths: 4, cars: 2,
      price: 2600000,
      suburb: 'Main Beach',
      description: 'Rare deep-water frontage on the highly sought-after Tedder Avenue. Five bedrooms across two levels, private pontoon access and a north-facing pool, all moments from the cafés of Main Beach.',
      features: ['Deep-water frontage', 'Pontoon', 'Swimming pool', 'Multiple living zones'],
      agentId: 'agent-001',
      photos: 8
    },
    {
      id: 'prop-008',
      address: '5/12 Main Beach Parade, Main Beach QLD 4217',
      type: 'Apartment',
      beds: 3, baths: 2, cars: 2,
      price: 1950000,
      suburb: 'Main Beach',
      description: 'Elegant apartment directly opposite the beach with sweeping views from Burleigh to the Surfers skyline. Three generous bedrooms, resort pool and gym, and a walk-to-everything Main Beach address.',
      features: ['Beachfront', 'Resort pool', 'Gym', 'Ocean views'],
      agentId: 'agent-008',
      photos: 6
    },
    {
      id: 'prop-009',
      address: '9 Hedges Avenue, Mermaid Beach QLD 4218',
      type: 'House',
      beds: 4, baths: 3, cars: 2,
      price: 2750000,
      suburb: 'Mermaid Beach',
      description: 'Stunning beachside residence on Mermaid Beach\'s golden mile. Walls of glass frame the ocean, with a stunning kitchen, guest wing and rooftop viewing deck capturing sunrise over the water.',
      features: ['Beachfront', 'Rooftop deck', 'Guest wing', 'Smart home'],
      agentId: 'agent-003',
      photos: 8
    },
    {
      id: 'prop-010',
      address: '14 Markeri Street, Mermaid Beach QLD 4218',
      type: 'Villa',
      beds: 3, baths: 2, cars: 2,
      price: 1650000,
      suburb: 'Mermaid Beach',
      description: 'Tropical-style villa a gentle stroll to Mermaid Beach\'s patrolled surf. Timber and stone finishes, an internal courtyard pool and lush established gardens create a private resort feel.',
      features: ['Courtyard pool', 'Timber finishes', 'Established gardens', 'Double garage'],
      agentId: 'agent-003',
      photos: 5
    },
    {
      id: 'prop-011',
      address: '12/3 Jefferson Lane, Palm Beach QLD 4221',
      type: 'Apartment',
      beds: 2, baths: 2, cars: 1,
      price: 885000,
      suburb: 'Palm Beach',
      description: 'Beach-chic apartment in the much-loved Jefferson Lane precinct, 150m from the sand. Breezy open-plan living, a north-facing balcony and bold coastal styling throughout.',
      features: ['Beachside', 'North-facing balcony', 'Air conditioning', 'Secure parking'],
      agentId: 'agent-002',
      photos: 5
    },
    {
      id: 'prop-012',
      address: '7/22 Eleventh Avenue, Palm Beach QLD 4221',
      type: 'Townhouse',
      beds: 3, baths: 2, cars: 1,
      price: 735000,
      suburb: 'Palm Beach',
      description: 'Practical and bright townhouse close to Palm Beach\'s patrolled surf club. Open-plan living, a sunny courtyard and a master suite with walk-in robe — perfect as a holiday or permanent home.',
      features: ['Courtyard', 'Walk-in robe', 'Air conditioning', 'Near surf club'],
      agentId: 'agent-009',
      photos: 4
    },
    {
      id: 'prop-013',
      address: '21 Marine Parade, Coolangatta QLD 4225',
      type: 'Apartment',
      beds: 3, baths: 2, cars: 2,
      price: 1150000,
      suburb: 'Coolangatta',
      description: 'Corner apartment overlooking the point at Coolangatta, where the waves roll in from the south. Panoramic ocean views, generous balconies and direct beach access from your doorstep.',
      features: ['Panoramic ocean views', 'Corner aspect', 'Beach access', 'Two car spaces'],
      agentId: 'agent-007',
      photos: 6
    },
    {
      id: 'prop-014',
      address: '9 Dutton Street, Coolangatta QLD 4225',
      type: 'House',
      beds: 4, baths: 2, cars: 2,
      price: 1480000,
      suburb: 'Coolangatta',
      description: 'Comfortable coastal family home minutes from Coolangatta Beach, the airport and the Tweed\'s golden sand strip. Level block with room to renovate or extend, rear access and a sunny north aspect.',
      features: ['Level block', 'Potential to extend', 'Near airport', 'North aspect'],
      agentId: 'agent-007',
      photos: 5
    },
    {
      id: 'prop-015',
      address: '15/4 Scarborough Street, Southport QLD 4215',
      type: 'Apartment',
      beds: 2, baths: 2, cars: 1,
      price: 465000,
      suburb: 'Southport',
      description: 'Modern ground-floor apartment in a quiet Southport complex, close to the Broadwater parklands, Gold Coast University Hospital and tram links. An ideal first home or investment with strong rental demand.',
      features: ['Ground floor', 'Near tram', 'Investment potential', 'Secure parking'],
      agentId: 'agent-004',
      photos: 4
    },
    {
      id: 'prop-016',
      address: '9/31 Bauer Street, Southport QLD 4215',
      type: 'Townhouse',
      beds: 3, baths: 1, cars: 1,
      price: 585000,
      suburb: 'Southport',
      description: 'Solid brick townhouse in a leafy cul-de-sac, a short walk to Southport\'s cafés and the Broadwater. Three bedrooms, a renovated kitchen and a low-maintenance courtyard.',
      features: ['Renovated kitchen', 'Cul-de-sac', 'Low maintenance', 'Single garage'],
      agentId: 'agent-011',
      photos: 4
    },
    {
      id: 'prop-017',
      address: '12 Marina Quay, Hope Island QLD 4212',
      type: 'House',
      beds: 4, baths: 3, cars: 2,
      price: 1280000,
      suburb: 'Hope Island',
      description: 'Waterfront home on the Hope Island canal system with a private berth for boats up to 12m. Open-plan living on one level, a resort pool and sweeping water views from every room.',
      features: ['Canal frontage', 'Private berth', 'Resort pool', 'Single level'],
      agentId: 'agent-005',
      photos: 6
    },
    {
      id: 'prop-018',
      address: '8 Waterside Close, Hope Island QLD 4212',
      type: 'Villa',
      beds: 3, baths: 2, cars: 2,
      price: 820000,
      suburb: 'Hope Island',
      description: 'Lock-up-and-leave villa in a gated community minutes from Sanctuary Cove and the Links Hope Island golf course. Stylish interiors, a courtyard garden and secure double garage.',
      features: ['Gated community', 'Near golf course', 'Courtyard garden', 'Double garage'],
      agentId: 'agent-012',
      photos: 5
    },
    {
      id: 'prop-019',
      address: '21 San Maria Court, Robina QLD 4226',
      type: 'Townhouse',
      beds: 3, baths: 2, cars: 2,
      price: 575000,
      suburb: 'Robina',
      description: 'Bright three-bedroom townhouse in a family-friendly Robina court, close to Robina Town Centre, parks and excellent schools. Neutral finishes, a leafy courtyard and a double remote garage.',
      features: ['Family friendly', 'Near Robina Town Centre', 'Courtyard', 'Double garage'],
      agentId: 'agent-006',
      photos: 4
    },
    {
      id: 'prop-020',
      address: '7 Ron Penhaligon Way, Robina QLD 4226',
      type: 'House',
      beds: 4, baths: 2, cars: 2,
      price: 965000,
      suburb: 'Robina',
      description: 'Spacious family home backing onto leafy parkland in central Robina. Four bedrooms, a chef\'s kitchen with butler\'s pantry, and an outdoor entertaining area perfect for weekend BBQs.',
      features: ['Park frontage', 'Butler\'s pantry', 'Outdoor entertaining', 'Double garage'],
      agentId: 'agent-006',
      photos: 6
    }
  ],
  agents: [
    {
      id: 'agent-001',
      name: 'Michael Chen',
      role: 'Principal / Sales Director',
      phone: '+61 412 345 678',
      email: 'michael@reozixrealestate.com.au',
      bio: '15 years in Gold Coast real estate. Over $180M in career sales across Surfers Paradise, Broadbeach and Main Beach.',
      specializations: ['Surfers Paradise', 'Broadbeach', 'Main Beach'],
      recentSales: [
        { address: '45 River Drive, Surfers Paradise', price: 2100000, date: '2026-06' },
        { address: '8/22 Sunset Boulevard, Broadbeach', price: 1450000, date: '2026-05' },
        { address: '101 Ocean View Terrace, Main Beach', price: 3200000, date: '2026-04' }
      ],
      photo: 1
    },
    {
      id: 'agent-002',
      name: 'Sarah Thompson',
      role: 'Senior Sales Agent',
      phone: '+61 418 227 331',
      email: 'sarah@reozixrealestate.com.au',
      bio: 'A Burleigh local with 11 years selling coastal property between Burleigh Heads and Palm Beach. Known for a meticulous, no-nonsense approach to every campaign.',
      specializations: ['Burleigh Heads', 'Miami', 'Palm Beach'],
      recentSales: [
        { address: '15 Tallebudgera Creek Road, Burleigh Heads', price: 1975000, date: '2026-06' },
        { address: '3/8 Gold Coast Highway, Palm Beach', price: 640000, date: '2026-04' },
        { address: '11 Pacific Parade, Miami', price: 1420000, date: '2026-02' }
      ],
      photo: 2
    },
    {
      id: 'agent-003',
      name: 'David Wilson',
      role: 'Sales Agent',
      phone: '+61 429 883 117',
      email: 'david@reozixrealestate.com.au',
      bio: 'Former builder turned agent, David brings an eagle eye for quality construction to Mermaid Beach and Broadbeach listings. Specialises in high-end and beachfront homes.',
      specializations: ['Mermaid Beach', 'Nobby Beach', 'Broadbeach'],
      recentSales: [
        { address: '4 Hedges Avenue, Mermaid Beach', price: 2650000, date: '2026-05' },
        { address: '19 Markeri Street, Mermaid Beach', price: 1780000, date: '2026-03' },
        { address: '2/45 Gold Coast Highway, Nobby Beach', price: 980000, date: '2025-12' }
      ],
      photo: 3
    },
    {
      id: 'agent-004',
      name: 'Jessica Nguyen',
      role: 'Sales Agent',
      phone: '+61 405 662 908',
      email: 'jessica@reozixrealestate.com.au',
      bio: 'Focused on the northern suburbs, Jessica is a Southport specialist helping first-home buyers and investors secure quality properties with strong long-term growth.',
      specializations: ['Southport', 'Labrador', 'Runaway Bay'],
      recentSales: [
        { address: '33 Scarborough Street, Southport', price: 520000, date: '2026-06' },
        { address: '7 Bayview Street, Runaway Bay', price: 810000, date: '2026-04' },
        { address: '5/12 Frank Street, Labrador', price: 455000, date: '2025-11' }
      ],
      photo: 4
    },
    {
      id: 'agent-005',
      name: 'Liam O\'Connor',
      role: 'Sales Agent',
      phone: '+61 417 554 203',
      email: 'liam@reozixrealestate.com.au',
      bio: 'Northern Gold Coast specialist covering Hope Island and Sanctuary Cove. Liam lives on the water and knows canal frontage like the back of his hand.',
      specializations: ['Hope Island', 'Sanctuary Cove', 'Coomera'],
      recentSales: [
        { address: '22 Marina Quay, Hope Island', price: 1195000, date: '2026-05' },
        { address: '9 Sanctuary Drive, Sanctuary Cove', price: 2350000, date: '2026-02' },
        { address: '3/14 Riverwalk, Coomera', price: 610000, date: '2025-10' }
      ],
      photo: 5
    },
    {
      id: 'agent-006',
      name: 'Emma Richardson',
      role: 'Senior Sales Agent',
      phone: '+61 411 220 784',
      email: 'emma@reozixrealestate.com.au',
      bio: 'Emma heads up our Robina and Varsity Lakes desk, with 9 years helping families find their forever home in the central Gold Coast corridor.',
      specializations: ['Robina', 'Varsity Lakes', 'Clear Island Waters'],
      recentSales: [
        { address: '5 Rudd Street, Varsity Lakes', price: 1190000, date: '2026-06' },
        { address: '12 Longboat Drive, Clear Island Waters', price: 1410000, date: '2026-03' },
        { address: '9 San Maria Court, Robina', price: 590000, date: '2025-09' }
      ],
      photo: 6
    },
    {
      id: 'agent-007',
      name: 'Marcus Webb',
      role: 'Sales Agent',
      phone: '+61 402 319 658',
      email: 'marcus@reozixrealestate.com.au',
      bio: 'A southern Gold Coast local, Marcus sells across Coolangatta and Kirra with a passion for beachside living and strong knowledge of the Tweed property market.',
      specializations: ['Coolangatta', 'Kirra', 'Tweed Heads'],
      recentSales: [
        { address: '6/40 Marine Parade, Coolangatta', price: 995000, date: '2026-06' },
        { address: '18 Miles Street, Kirra', price: 1480000, date: '2026-04' },
        { address: '2/9 Griffith Street, Coolangatta', price: 545000, date: '2025-12' }
      ],
      photo: 7
    },
    {
      id: 'agent-008',
      name: 'Olivia Bennett',
      role: 'Sales Agent',
      phone: '+61 416 778 940',
      email: 'olivia@reozixrealestate.com.au',
      bio: 'Olivia specialises in the prestige enclaves of Main Beach, Paradise Waters and Isle of Capri, delivering discreet and considered marketing for high-end listings.',
      specializations: ['Main Beach', 'Paradise Waters', 'Isle of Capri'],
      recentSales: [
        { address: '18 Ocean View Terrace, Main Beach', price: 2890000, date: '2026-05' },
        { address: '7/33 The Broadwater, Paradise Waters', price: 1250000, date: '2026-03' },
        { address: '2 Moresby Street, Isle of Capri', price: 2100000, date: '2025-11' }
      ],
      photo: 8
    },
    {
      id: 'agent-009',
      name: 'James Park',
      role: 'Sales Agent',
      phone: '+61 423 501 176',
      email: 'james@reozixrealestate.com.au',
      bio: 'James covers the southern beaches from Palm Beach to Currumbin, helping buyers find their perfect coastal lifestyle at every price point.',
      specializations: ['Palm Beach', 'Currumbin', 'Tugun'],
      recentSales: [
        { address: '4/55 Jefferson Lane, Palm Beach', price: 720000, date: '2026-06' },
        { address: '18 Duringan Street, Currumbin', price: 1340000, date: '2026-02' },
        { address: '9/22 Toolona Street, Tugun', price: 615000, date: '2025-10' }
      ],
      photo: 9
    },
    {
      id: 'agent-010',
      name: 'Chloe Martin',
      role: 'Sales Agent',
      phone: '+61 407 664 291',
      email: 'chloe@reozixrealestate.com.au',
      bio: 'Chloe is a Broadbeach-based agent with a keen eye for investment properties, working across the apartment and townhouse market from Broadbeach to Bundall.',
      specializations: ['Broadbeach', 'Mermaid Waters', 'Bundall'],
      recentSales: [
        { address: '11/78 Surf Parade, Broadbeach', price: 1150000, date: '2026-05' },
        { address: '14/21 Gooding Drive, Mermaid Waters', price: 795000, date: '2026-03' },
        { address: '3/56 Bundall Road, Bundall', price: 685000, date: '2025-11' }
      ],
      photo: 10
    },
    {
      id: 'agent-011',
      name: 'Nathan Kim',
      role: 'Sales Agent',
      phone: '+61 404 899 532',
      email: 'nathan@reozixrealestate.com.au',
      bio: 'Nathan joined Reozix from Brisbane with a sharp focus on value-for-money property in Southport, Ashmore and the surrounding suburbs.',
      specializations: ['Southport', 'Ashmore', 'Molendinar'],
      recentSales: [
        { address: '27 Short Street, Southport', price: 640000, date: '2026-04' },
        { address: '11 Cotlew Street, Ashmore', price: 820000, date: '2026-01' },
        { address: '5/16 Diamond Street, Molendinar', price: 540000, date: '2025-09' }
      ],
      photo: 11
    },
    {
      id: 'agent-012',
      name: 'Isabella Rossi',
      role: 'Sales Agent',
      phone: '+61 428 114 367',
      email: 'isabella@reozixrealestate.com.au',
      bio: 'Isabella covers Hope Island, Paradise Point and the northern canals, pairing her interior-design background with a sharp instinct for waterfront value.',
      specializations: ['Hope Island', 'Paradise Point', 'Coombabah'],
      recentSales: [
        { address: '14 Broadwater Avenue, Hope Island', price: 965000, date: '2026-05' },
        { address: '9 The Boulevarde, Paradise Point', price: 1180000, date: '2026-02' },
        { address: '3/28 Hansford Road, Coombabah', price: 575000, date: '2025-11' }
      ],
      photo: 12
    }
  ]
};
