/**
 * Check Gemini API Rate Limit Status
 * This script tests your API key and shows current limits
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { GoogleGenerativeAI } from '@google/generative-ai';

async function checkRateLimit() {
  console.log('🔍 Checking Gemini API Rate Limit Status...\n');
  console.log('=' .repeat(70));

  // Check if API key exists
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    console.log('❌ ERROR: GOOGLE_GEMINI_API_KEY not found in .env.local');
    console.log('   Please add your API key to .env.local');
    return;
  }

  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
  console.log('');

  // Test different models
  const models = [
    'gemini-2.0-flash-exp',      // Current model (10 RPM)
    'gemini-1.5-flash',          // Alternative (15 RPM)
    'gemini-1.5-pro'             // Pro version (2 RPM)
  ];

  const genAI = new GoogleGenerativeAI(apiKey);

  console.log('📊 Testing API access with different models:\n');

  for (const modelName of models) {
    try {
      console.log(`Testing: ${modelName}...`);

      const model = genAI.getGenerativeModel({ model: modelName });
      const startTime = Date.now();

      const result = await model.generateContent('Say "Hello" in one word');
      const response = result.response.text();

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`  ✅ SUCCESS`);
      console.log(`  Response: "${response.trim()}"`);
      console.log(`  Latency: ${duration}ms`);
      console.log('');

    } catch (error) {
      const err = error as { status?: number; statusText?: string; message?: string; errorDetails?: Array<{ '@type': string; violations?: Array<{ quotaMetric: string; quotaValue: string }>; retryDelay?: string }> };

      if (err.status === 429) {
        console.log(`  ❌ RATE LIMIT EXCEEDED`);
        console.log(`  Status: ${err.status} ${err.statusText}`);

        // Extract rate limit info from error
        if (err.errorDetails) {
          const quotaFailure = err.errorDetails.find((d) =>
            d['@type'] === 'type.googleapis.com/google.rpc.QuotaFailure'
          );

          if (quotaFailure?.violations) {
            quotaFailure.violations.forEach((v) => {
              console.log(`  Quota Metric: ${v.quotaMetric}`);
              console.log(`  Quota Value: ${v.quotaValue} requests per minute`);
            });
          }

          const retryInfo = err.errorDetails.find((d) =>
            d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
          );

          if (retryInfo?.retryDelay) {
            console.log(`  Retry After: ${retryInfo.retryDelay}`);
          }
        }
        console.log('');
      } else if (err.status === 404) {
        console.log(`  ⚠️  MODEL NOT AVAILABLE (may require different tier)`);
        console.log('');
      } else {
        console.log(`  ❌ ERROR: ${err.message}`);
        console.log('');
      }
    }

    // Wait between tests to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('=' .repeat(70));
  console.log('\n📋 Rate Limit Information:\n');

  console.log('Free Tier Limits (per minute):');
  console.log('  • gemini-2.0-flash-exp:  10 RPM (current model)');
  console.log('  • gemini-1.5-flash:      15 RPM (recommended alternative)');
  console.log('  • gemini-1.5-pro:         2 RPM (more powerful but slower)');
  console.log('');

  console.log('💡 Tips:');
  console.log('  1. For testing: Add 6-second delays between requests');
  console.log('  2. For production: Current limits are fine (users space out questions)');
  console.log('  3. If you hit limits: System falls back to keyword search automatically');
  console.log('');

  // Test rapid requests to see limit
  console.log('🧪 Testing rapid requests to find your actual limit...\n');
  console.log('Sending 5 quick requests in succession...');

  const testModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  let successCount = 0;
  let failCount = 0;

  for (let i = 1; i <= 5; i++) {
    try {
      const result = await testModel.generateContent(`Count: ${i}`);
      console.log(`  ${i}. ✅ Success - ${result.response.text().trim()}`);
      successCount++;
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      const err = error as { status?: number };
      if (err.status === 429) {
        console.log(`  ${i}. ❌ Rate Limited - Hit quota at request #${i}`);
        failCount++;
        break;
      }
    }
  }

  console.log('');
  console.log('📊 Rapid Test Results:');
  console.log(`  Successful: ${successCount}/5`);
  console.log(`  Rate Limited: ${failCount > 0 ? 'Yes' : 'No'}`);

  if (failCount > 0) {
    console.log(`  \n  ⚠️  You're currently at or near your rate limit.`);
    console.log(`     Wait ~60 seconds before running more tests.`);
  } else {
    console.log(`  \n  ✅ You have quota available for more requests.`);
  }

  console.log('\n' + '=' .repeat(70));
  console.log('\n✅ Rate limit check complete!');
}

checkRateLimit().catch(console.error);
