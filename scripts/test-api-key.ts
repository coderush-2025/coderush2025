/**
 * Simple API Key Test
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { GoogleGenerativeAI } from '@google/generative-ai';

async function testAPIKey() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  console.log('🔑 API Key loaded:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');

  if (!apiKey) {
    console.error('❌ No API key found in .env.local');
    return;
  }

  try {
    console.log('\n📡 Testing API connection...');
    const genAI = new GoogleGenerativeAI(apiKey);

    console.log('📤 Testing gemini-2.0-flash-exp...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Say "Hello World" in one word');
    const response = result.response.text();

    console.log('✅ SUCCESS! Gemini 2.0 Flash is working!');
    console.log('📨 Response:', response);
  } catch (error) {
    const err = error as { message?: string; status?: number };
    console.error('❌ ERROR:', err.message);
    if (err.status) {
      console.error('Status:', err.status);
    }
  }
}

testAPIKey();
