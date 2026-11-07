const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generates an AI-powered travel itinerary and budget plan using Gemini API.
 * Suggests iconic tourist spots and incorporates user-selected transport mode (Flight, Train, Bus, Car).
 */
const generateTripPlanWithGemini = async ({
  destination,
  days = 3,
  budget = 5000,
  travelers = 2,
  travelStyle = 'Balanced',
  interests = '',
  transportMode = 'Train'
}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    // Try reliable Google Gemini models in sequence
    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `You are an expert travel planner and budget advisor for TravelBuddy (a peer travel and commute sharing network).
Create a realistic, structured, day-by-day travel itinerary and budget breakdown for:
- Destination: ${destination}
- Duration: ${days} day(s)
- Total Estimated Budget: INR ${budget} for ${travelers} traveler(s)
- Travel Style: ${travelStyle}
- Preferred Mode of Transport: ${transportMode} (e.g. Flight, Train, Bus, Car)
- Special Interests: ${interests || 'local sights, culture, scenic viewpoints, authentic food'}

Key Requirements:
1. Famous Tourist Spots: Identify and list 4 to 6 top famous, must-visit tourist spots / attractions in ${destination} (e.g., if Udaipur/Rajasthan: City Palace, Lake Pichola & Jag Mandir, Saheliyon-ki-Bari, Bagore Ki Haveli, Sajjangarh Monsoon Palace, Fateh Sagar Lake; if Jaipur/Rajasthan: Hawa Mahal, Amer Fort, City Palace, Nahargarh Fort, Jantar Mantar; if Goa: Baga Beach, Dudhsagar Falls, Fort Aguada, Basilica of Bom Jesus, Chapora Fort).
2. Mode of Transport Integration: Plan arrival, departure logistics, and local transit recommendations specifically tailored to traveling by ${transportMode}.
3. Itinerary Flow: Incorporate the famous tourist spots naturally across the morning, afternoon, and evening slots of the daily itinerary.
4. Professional & Realistic: No childish text, no emojis, practical budget figures in INR.

Strictly output ONLY a valid JSON object (no markdown code blocks, no backticks, no explanatory text outside the JSON) with this exact schema:
{
  "tripTitle": "Short catchy trip name",
  "summary": "2-3 sentences overview of the trip experience",
  "transportMode": "${transportMode}",
  "estimatedTotalBudget": ${budget},
  "perPersonBudget": ${Math.round(budget / Math.max(1, travelers))},
  "famousSpots": [
    {
      "name": "Exact Name of Famous Tourist Spot",
      "category": "Heritage / Scenic / Lake / Fort / Temple / Beach",
      "description": "Why it is famous and key things to experience there",
      "estimatedTime": "2-3 hours"
    }
  ],
  "budgetBreakdown": {
    "stay": 40,
    "food": 25,
    "transport": 20,
    "activities": 10,
    "emergency": 5
  },
  "budgetAmounts": {
    "stay": ${Math.round(budget * 0.40)},
    "food": ${Math.round(budget * 0.25)},
    "transport": ${Math.round(budget * 0.20)},
    "activities": ${Math.round(budget * 0.10)},
    "emergency": ${Math.round(budget * 0.05)}
  },
  "days": [
    {
      "dayNumber": 1,
      "theme": "Theme for the day",
      "morning": "Morning activity and spots",
      "afternoon": "Afternoon activity and lunch recommendation",
      "evening": "Evening activity, sunset spot or dinner",
      "estimatedDayCost": 1500,
      "localTips": "Helpful insider advice for this day"
    }
  ],
  "smartCarpoolTip": "Advice tailored to ${transportMode} transit and sharing peer rides to save costs",
  "packingEssentials": ["Item 1", "Item 2", "Item 3", "Item 4"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Clean markdown code fence if wrapped in \`\`\`json ... \`\`\`
        if (text.startsWith('```')) {
          text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        }

        const parsedData = JSON.parse(text);
        return {
          ...parsedData,
          source: 'gemini-live',
          modelUsed: modelName,
          apiKeyConfigured: true,
          destination,
          days: Number(days),
          travelers: Number(travelers),
          transportMode
        };
      } catch (err) {
        console.warn(`Model ${modelName} failed, trying next candidate:`, err.message);
      }
    }
  }

  // Graceful Curated Fallback Generator when API key is missing or models are unavailable
  return generateCuratedFallbackPlan({ destination, days, budget, travelers, travelStyle, interests, transportMode });
};

/**
 * Curated tourist spots encyclopedia for premier destinations
 */
const DESTINATION_SPOTS_DB = {
  udaipur: [
    {
      name: 'City Palace Complex',
      category: 'Heritage & Royal Architecture',
      description: 'Magnificent 400-year-old royal palace complex overlooking Lake Pichola, featuring ornate courtyards, mirror artwork, and royal museums.',
      estimatedTime: '3-4 hours'
    },
    {
      name: 'Lake Pichola & Jag Mandir',
      category: 'Scenic Lake & Boat Cruise',
      description: 'Iconic freshwater lake surrounded by palaces, bathing ghats, and hills. Take a scenic evening boat ride to the island marble palace of Jag Mandir.',
      estimatedTime: '2 hours'
    },
    {
      name: 'Saheliyon-ki-Bari',
      category: 'Historic Gardens & Fountains',
      description: 'Courtyard of the Maidens built for royal women, featuring lush lawns, marble elephant fountains, lotus pools, and shaded pavilions.',
      estimatedTime: '1.5 hours'
    },
    {
      name: 'Bagore Ki Haveli',
      category: 'Cultural Mansion & Folk Dance',
      description: 'Historic 18th-century waterfront mansion at Gangaur Ghat, celebrated for its evening Dharohar Rajasthani traditional dance and puppet shows.',
      estimatedTime: '2 hours'
    },
    {
      name: 'Sajjangarh Monsoon Palace',
      category: 'Hilltop Fortress & Sunset Vista',
      description: 'Perched high in the Bansdara hills of the Aravalli range, offering panoramic views over Udaipur lakes, royal hunting grounds, and sunset vistas.',
      estimatedTime: '2.5 hours'
    },
    {
      name: 'Fateh Sagar Lake',
      category: 'Lakeside Promenade',
      description: 'Picturesque artificial lake boasting scenic walking paths, Nehru Park island in the center, and bustling lakeside evening food street stalls.',
      estimatedTime: '2 hours'
    }
  ],
  rajasthan: [
    {
      name: 'Hawa Mahal (Palace of Winds)',
      category: 'Iconic Pink City Architecture',
      description: 'Five-story pink sandstone palace built with 953 honeycomb windows (jharokhas) designed to allow cool breeze and royal festival viewing.',
      estimatedTime: '1.5 hours'
    },
    {
      name: 'Amer Fort & Sheesh Mahal',
      category: 'Hilltop Fortress & UNESCO Site',
      description: 'Majestic 16th-century fortress overlooking Maota Lake, famous for its opulent Hall of Mirrors (Sheesh Mahal), ramparts, and courtyard gates.',
      estimatedTime: '3-4 hours'
    },
    {
      name: 'City Palace & Jantar Mantar',
      category: 'Royal Heritage & Astronomical Park',
      description: 'Grand royal residence blending Rajput and Mughal designs beside the UNESCO-listed 18th-century stone astronomical instruments.',
      estimatedTime: '3 hours'
    },
    {
      name: 'Nahargarh Fort',
      category: 'Panoramic Ridge & Sunset Point',
      description: 'Perched on the rugged edge of the Aravalli hills, offering the most spectacular aerial views of Jaipur city lights and sunset valleys.',
      estimatedTime: '2.5 hours'
    },
    {
      name: 'Jal Mahal (Water Palace)',
      category: 'Scenic Architecture',
      description: 'Mesmerizing palace standing serenely in the middle of Man Sagar Lake, showcasing exquisite Rajput masonry against mountain backdrops.',
      estimatedTime: '1 hour'
    }
  ],
  goa: [
    {
      name: 'Fort Aguada & Lighthouse',
      category: 'Coastal Fortress & Ocean Views',
      description: '17th-century Portuguese fortress standing proudly over Sinquerim Beach with sweeping 180-degree panoramas of the Arabian Sea.',
      estimatedTime: '2 hours'
    },
    {
      name: 'Basilica of Bom Jesus',
      category: 'UNESCO World Heritage Church',
      description: 'Exquisite baroque architectural masterpiece in Old Goa enshrining the mortal sacred relics of St. Francis Xavier.',
      estimatedTime: '1.5 hours'
    },
    {
      name: 'Baga & Calangute Beaches',
      category: 'Vibrant Coastline & Water Sports',
      description: 'The energetic epicenter of North Goa featuring parasailing, jet-skiing, beach shacks, seafood dining, and vibrant sunset strolls.',
      estimatedTime: '3-4 hours'
    },
    {
      name: 'Dudhsagar Waterfalls',
      category: 'Natural Cascade & Wildlife Safari',
      description: 'Spectacular four-tiered 310m white torrent located deep inside Bhagwan Mahavir Sanctuary, accessible via an exhilarating jungle jeep ride.',
      estimatedTime: '5-6 hours'
    },
    {
      name: 'Chapora Fort & Vagator Beach',
      category: 'Clifftop Bastion & Sunset Vista',
      description: 'Dramatic red-laterite clifftop ruins made iconic by Bollywood, overlooking Vagator Beach and coastal palm groves.',
      estimatedTime: '2 hours'
    }
  ],
  manali: [
    {
      name: 'Solang Valley',
      category: 'Adventure Sports & Alpine Meadows',
      description: 'Premier mountain sports hub offering paragliding, zorbing, ATV quad biking, and winter snow trails against glacier peaks.',
      estimatedTime: '4 hours'
    },
    {
      name: 'Rohtang Pass & Atal Tunnel',
      category: 'High Altitude Pass & Snowy Vistas',
      description: 'Breathtaking 13,050ft mountain pass offering views of Pir Panjal peaks, glaciers, and high-altitude Himalayan terrain.',
      estimatedTime: '5-6 hours'
    },
    {
      name: 'Hadimba Wooden Pagoda Temple',
      category: 'Ancient Shrine & Cedar Forest',
      description: 'Unique 16th-century four-tier wooden pagoda temple dedicated to goddess Hadimba, nestled peacefully within giant deodar forests.',
      estimatedTime: '1.5 hours'
    },
    {
      name: 'Jogini Waterfall & Old Manali',
      category: 'Scenic Pine Trek & Bohemian Cafes',
      description: 'Refreshing forest trek leading to cascading mountain waters, followed by riverside cafes serving trout and apple crumbles.',
      estimatedTime: '3 hours'
    }
  ],
  lonavala: [
    {
      name: 'Tiger\'s Leap & Lion\'s Point',
      category: 'Valley Cliff & Sunset Point',
      description: 'Precipitous cliff with a sheer drop of over 650m providing sweeping views of Sahyadri mountains, waterfalls, and mist-covered valleys.',
      estimatedTime: '2 hours'
    },
    {
      name: 'Karla & Bhaja Caves',
      category: 'Ancient Rock-Cut Buddhist Monasteries',
      description: '2nd-century BC rock-cut shrines featuring vaulted chaitya prayer halls, massive stone pillars, and historic viharas.',
      estimatedTime: '3 hours'
    },
    {
      name: 'Bhushi Dam & Water Cascades',
      category: 'Monsoon Reservoir & Cascading Steps',
      description: 'Iconic water reservoir where seasonal overflow rushes over terraced stone steps, creating refreshing natural pools.',
      estimatedTime: '2 hours'
    },
    {
      name: 'Rajmachi Fort & Khandala Ghats',
      category: 'Historical Trekking Fortress',
      description: 'Dual strategic bastions (Shrivardhan & Manaranjan) offering rewarding hiking trails and panoramic views of the Western Ghats.',
      estimatedTime: '4 hours'
    }
  ],
  mahabaleshwar: [
    {
      name: 'Arthur\'s Seat Point',
      category: 'Valley Viewpoint',
      description: 'Known as the Queen of all viewpoints, perched at 1,340m overlooking deep dramatic gorges and the winding Savitri River.',
      estimatedTime: '2 hours'
    },
    {
      name: 'Venna Lake & Boating',
      category: 'Scenic Lakeside Leisure',
      description: 'Peaceful tree-lined lake surrounded by woods, offering rowboats, pedal boats, horse riding, and hot corn stalls.',
      estimatedTime: '2 hours'
    },
    {
      name: 'Mapro Garden & Strawberry Farms',
      category: 'Agro-Tourism & Berry Cafes',
      description: 'Iconic orchard complex featuring strawberry greenhouses, confectionery workshops, and signature fresh strawberry cream desserts.',
      estimatedTime: '2 hours'
    },
    {
      name: 'Elephant\'s Head & Kate\'s Point',
      category: 'Natural Rock Formation',
      description: 'Striking geographical rock ridge resembling an elephant\'s head and trunk with expansive views of Dhom Dam reservoir.',
      estimatedTime: '2 hours'
    }
  ],
  pondicherry: [
    {
      name: 'Promenade Beach (Rock Beach)',
      category: 'Seaside Walking Boulevard',
      description: 'Scenic 1.5km pedestrian oceanfront promenade along the Bay of Bengal, lined with heritage statues, war memorials, and cafes.',
      estimatedTime: '2 hours'
    },
    {
      name: 'French Quarter (White Town)',
      category: 'Colonial Heritage & Boutique Cafes',
      description: 'Charming grid of streets lined with mustard-yellow colonial mansions, arched gates, bougainvillea blossoms, and artisanal cafes.',
      estimatedTime: '3 hours'
    },
    {
      name: 'Auroville & Matrimandir',
      category: 'Universal Township & Golden Dome',
      description: 'Experimental international community dedicated to human unity, centered around the iconic golden sphere meditation pavilion.',
      estimatedTime: '3-4 hours'
    },
    {
      name: 'Paradise Beach',
      category: 'Secluded Sandbank Beach',
      description: 'Pristine isolated golden sand beach reachable via a scenic 15-minute backwater ferry cruise from Chunnambar boat house.',
      estimatedTime: '3 hours'
    }
  ]
};

/**
 * Curated smart template engine
 */
const generateCuratedFallbackPlan = ({
  destination,
  days = 3,
  budget = 5000,
  travelers = 2,
  travelStyle = 'Balanced',
  interests = '',
  transportMode = 'Train'
}) => {
  const numDays = Math.min(7, Math.max(1, Number(days)));
  const totalBudget = Number(budget) || 5000;
  const numTravelers = Math.max(1, Number(travelers));
  const perPerson = Math.round(totalBudget / numTravelers);

  const stayPct = travelStyle === 'Budget / Backpacker' ? 30 : 40;
  const foodPct = 25;
  const transportPct = 20;
  const actPct = travelStyle === 'Budget / Backpacker' ? 15 : 10;
  const emergPct = 100 - (stayPct + foodPct + transportPct + actPct);

  const stayAmt = Math.round((totalBudget * stayPct) / 100);
  const foodAmt = Math.round((totalBudget * foodPct) / 100);
  const transAmt = Math.round((totalBudget * transportPct) / 100);
  const actAmt = Math.round((totalBudget * actPct) / 100);
  const emergAmt = totalBudget - (stayAmt + foodAmt + transAmt + actAmt);

  // Match destination against famous spots dictionary
  const destLower = destination.toLowerCase().trim();
  let famousSpots = [];

  for (const [key, spots] of Object.entries(DESTINATION_SPOTS_DB)) {
    if (destLower.includes(key) || key.includes(destLower)) {
      famousSpots = spots;
      break;
    }
  }

  // If destination is not in the curated dictionary, build contextual spots
  if (!famousSpots.length) {
    famousSpots = [
      {
        name: `${destination} Central Heritage Quarter & Fort`,
        category: 'Historical & Cultural Landmark',
        description: `The foundational historical heart of ${destination}, showcasing traditional regional architecture, town bastions, and heritage gates.`,
        estimatedTime: '2-3 hours'
      },
      {
        name: `${destination} Panoramic Sunset Ridge & Viewpoint`,
        category: 'Scenic Viewpoint',
        description: `The most celebrated hilltop vantage point in ${destination}, offering breathtaking sunset vistas across valleys and city lights.`,
        estimatedTime: '2 hours'
      },
      {
        name: `${destination} Lakeside Promenade & Nature Trails`,
        category: 'Nature & Waterfront Leisure',
        description: `Serene waterfront walking tracks surrounded by native greenery, ideal for relaxing evening strolls and photography.`,
        estimatedTime: '2 hours'
      },
      {
        name: `${destination} Artisanal Night Bazaar & Food Street`,
        category: 'Local Market & Gastronomy',
        description: `Vibrant marketplace celebrated for regional handcrafted souvenirs, street food specialties, and bustling evening atmosphere.`,
        estimatedTime: '2 hours'
      }
    ];
  }

  // Tailor carpool & route transit advice to selected transportMode
  let transitAdvice = '';
  switch (transportMode) {
    case 'Flight':
      transitAdvice = `Arriving by Flight: Use TravelBuddy to connect with travelers landing at similar arrival windows to share airport cab transfers directly to your hotel, cutting taxi costs by up to 50%.`;
      break;
    case 'Train':
      transitAdvice = `Traveling by Train: Post auto-rickshaw or taxi splits from the central railway station on TravelBuddy to reach the main market or resort district without paying steep surge fares.`;
      break;
    case 'Bus':
      transitAdvice = `Arriving by Bus: Deboard at the primary inter-city bus terminal and sync up with fellow passengers on TravelBuddy to split local transport or auto rides to your destination stay.`;
      break;
    case 'Car':
      transitAdvice = `Road Trip by Car: Post empty passenger seats on TravelBuddy along the highway corridor to offset fuel costs, highway tolls, and parking fees with verified co-travelers.`;
      break;
    default:
      transitAdvice = `Transit Logistics: Use TravelBuddy to find verified co-travelers heading in the same direction, splitting fuel and cab fares to optimize your ${destination} trip budget.`;
  }

  // Curated day-by-day plan incorporating famous spots
  const generatedDays = [];
  const costPerDay = Math.round(totalBudget / numDays);

  for (let i = 1; i <= numDays; i++) {
    const spotForDay = famousSpots[(i - 1) % famousSpots.length];
    const secondSpot = famousSpots[i % famousSpots.length];

    generatedDays.push({
      dayNumber: i,
      theme: i === 1 
        ? `Arrival via ${transportMode} & Visiting ${spotForDay.name}`
        : i === numDays
        ? `Final Exploration at ${spotForDay.name} & Departure`
        : `Iconic Highlights: ${spotForDay.name} & ${secondSpot?.name || 'Local Sightseeing'}`,
      morning: i === 1
        ? `Arrival in ${destination} via ${transportMode}. Check-in, freshen up, and head to ${spotForDay.name} for your first exploration.`
        : `Early morning start to visit ${spotForDay.name} before the peak tourist rush, enjoying great photography and pleasant weather.`,
      afternoon: `Enjoy authentic local cuisine at a recommended regional restaurant, followed by visiting ${secondSpot ? secondSpot.name : 'nearby cultural markets'}.`,
      evening: i === numDays
        ? `Pack souvenirs, complete group expense reconciliation on TravelBuddy, and proceed with your return ${transportMode} journey.`
        : `Catch the golden hour sunset at a prime viewpoint, followed by dining at a top-rated local eatery with fellow travelers.`,
      estimatedDayCost: costPerDay,
      localTips: `Reserve tickets for ${spotForDay.name} online in advance if available to bypass ticket queues.`
    });
  }

  return {
    tripTitle: `${destination} ${travelStyle} Expedition (${transportMode})`,
    summary: `A carefully curated ${numDays}-day ${travelStyle.toLowerCase()} itinerary in ${destination} traveling via ${transportMode} for ${numTravelers} traveler(s), featuring top tourist landmarks, local cuisine, and smart transit savings.`,
    transportMode,
    estimatedTotalBudget: totalBudget,
    perPersonBudget: perPerson,
    famousSpots,
    budgetBreakdown: {
      stay: stayPct,
      food: foodPct,
      transport: transportPct,
      activities: actPct,
      emergency: emergPct
    },
    budgetAmounts: {
      stay: stayAmt,
      food: foodAmt,
      transport: transAmt,
      activities: actAmt,
      emergency: emergAmt
    },
    days: generatedDays,
    smartCarpoolTip: transitAdvice,
    packingEssentials: [
      'Comfortable walking & trekking shoes',
      'Power bank and charging adapters',
      'Reusable water bottle',
      'Government photo ID for check-ins',
      'Light weather-appropriate jacket'
    ],
    source: 'curated-template',
    modelUsed: 'template-engine',
    apiKeyConfigured: false,
    destination,
    days: numDays,
    travelers: numTravelers
  };
};

module.exports = {
  generateTripPlanWithGemini
};
