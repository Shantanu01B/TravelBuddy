const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generates an AI-powered travel itinerary and budget plan using Gemini API.
 * Uses gemini-3.5-flash / gemini-3.1-flash-lite with graceful fallback.
 */
const generateTripPlanWithGemini = async ({ destination, days = 3, budget = 5000, travelers = 2, travelStyle = 'Balanced', interests = '' }) => {
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
- Special Interests: ${interests || 'local sights, culture, scenic viewpoints, authentic food'}

Strictly output ONLY a valid JSON object (no markdown code blocks, no backticks, no explanatory text outside the JSON) with this exact schema:
{
  "tripTitle": "Short catchy trip name",
  "summary": "2-3 sentences overview of the trip experience",
  "estimatedTotalBudget": ${budget},
  "perPersonBudget": ${Math.round(budget / Math.max(1, travelers))},
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
  "smartCarpoolTip": "Advice on route stops or vehicle sharing from major transit hubs to save travel costs",
  "packingEssentials": ["Item 1", "Item 2", "Item 3", "Item 4"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Clean markdown code fence if wrapped in ```json ... ```
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
          travelers: Number(travelers)
        };
      } catch (err) {
        console.warn(`Model ${modelName} failed, trying next candidate:`, err.message);
      }
    }
  }

  // Graceful Curated Fallback Generator when API key is missing or models are unavailable
  return generateCuratedFallbackPlan({ destination, days, budget, travelers, travelStyle, interests });
};

/**
 * Curated smart template engine
 */
const generateCuratedFallbackPlan = ({ destination, days = 3, budget = 5000, travelers = 2, travelStyle = 'Balanced', interests = '' }) => {
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

  const curatedActivities = [
    {
      theme: 'Arrival, Heritage Walk & Sunset Point',
      morning: `Check-in, settle down, and explore the central town square or local heritage district.`,
      afternoon: `Enjoy authentic regional lunch at a top-rated local thali eatery, followed by visiting the main viewpoint.`,
      evening: `Capture stunning panoramic sunset views from the highest cliff or beach point, followed by quiet cafe dinner.`,
      localTips: `Rent two-wheelers early in the morning to beat the afternoon rush.`
    },
    {
      theme: 'Nature Trails, Waterfalls & Local Markets',
      morning: `Early morning scenic trek or nature walk through lush trails before crowds arrive.`,
      afternoon: `Relax by the lakeside or waterfall viewpoints and savor street snacks and fresh fruit coolers.`,
      evening: `Explore the vibrant night bazaar, browse artisanal souvenirs, and have dinner with the group.`,
      localTips: `Carry refillable water bottles and light rain protection for trail exploration.`
    },
    {
      theme: 'Adventure Activities & Hidden Gems',
      morning: `Head out for adventure sports (kayaking, zip-lining, or fort trek) based on local offerings.`,
      afternoon: `Visit off-the-beaten-path viewpoints and peaceful village shrines tucked away from tourist crowds.`,
      evening: `Celebrate the final evening with a rooftop dinner and group expense reconciliation on TravelBuddy.`,
      localTips: `Book shared return carpool rides 4 hours in advance to secure the best departure timing.`
    },
    {
      theme: 'Cultural Immersion & Departure',
      morning: `Visit local historical monuments or peaceful gardens for morning photography.`,
      afternoon: `Pack up, pick up famous regional confectioneries, and grab a farewell meal.`,
      evening: `Board your shared return ride or carpool back home smoothly without surge fares.`,
      localTips: `Verify road toll splits with co-passengers in the TravelBuddy trip log.`
    }
  ];

  const generatedDays = [];
  const costPerDay = Math.round(totalBudget / numDays);

  for (let i = 1; i <= numDays; i++) {
    const actIdx = (i - 1) % curatedActivities.length;
    const template = curatedActivities[actIdx];
    generatedDays.push({
      dayNumber: i,
      theme: `Day ${i}: ${template.theme}`,
      morning: template.morning,
      afternoon: template.afternoon,
      evening: template.evening,
      estimatedDayCost: costPerDay,
      localTips: template.localTips
    });
  }

  return {
    tripTitle: `${destination} ${travelStyle} Expedition`,
    summary: `A carefully balanced ${numDays}-day ${travelStyle.toLowerCase()} itinerary in ${destination} tailored for ${numTravelers} traveler(s), optimizing scenic sights, food culture, and carpool savings.`,
    estimatedTotalBudget: totalBudget,
    perPersonBudget: perPerson,
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
    smartCarpoolTip: `Use TravelBuddy to post auto or cab split requests from the primary bus/rail station in ${destination} to slice transit costs by up to 50%.`,
    packingEssentials: [
      'Comfortable walking shoes',
      'Power bank & universal adapter',
      'Reusable water bottle',
      'Govt-issued photo ID for check-ins',
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
