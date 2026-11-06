const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log('\n=================================================');
  console.log('🔍 Testing Google Gemini API Key in TravelBuddy');
  console.log('=================================================');

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.error('❌ No GEMINI_API_KEY found in backend/.env');
    console.log('👉 Please add your key to backend/.env: GEMINI_API_KEY=AIzaSy...');
    process.exit(1);
  }

  const maskedKey = apiKey.substring(0, 6) + '...' + apiKey.substring(apiKey.length - 4);
  console.log(`🔑 Key found: ${maskedKey}`);
  console.log('📡 Sending test ping to Google Gemini AI servers...');

  const models = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let success = false;

  for (const m of models) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ model: m });

      const startTime = Date.now();
      const result = await model.generateContent('In 5 words or less, say welcome to TravelBuddy!');
      const duration = Date.now() - startTime;
      const text = result.response.text().trim();

      console.log(`\n✅ Gemini API is WORKING PERFECTLY!`);
      console.log(`   Model: ${m}`);
      console.log(`   Response Time: ${duration}ms`);
      console.log(`   AI Message: "${text}"`);
      console.log('=================================================\n');
      success = true;
      break;
    } catch (err) {
      console.warn(`⚠️ Model ${m} test attempt:`, err.message);
    }
  }

  if (!success) {
    console.error('\n❌ Gemini API test failed. Check your network or API key permissions.\n');
  }
}

testApiKey();
