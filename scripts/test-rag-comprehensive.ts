/**
 * Comprehensive RAG Test Script
 * Tests the full AI assistant with Gemini + RAG
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { answerQuestionWithRAG } from '../src/lib/geminiService';

interface TestCase {
  category: string;
  question: string;
  expectedTopics: string[]; // Keywords that should appear in the answer
}

const testCases: TestCase[] = [
  // Event Date & Location Questions
  {
    category: "Event Date & Time",
    question: "when is the event",
    expectedTopics: ["november", "15", "2025", "8", "6"]
  },
  {
    category: "Event Date & Time",
    question: "what time does it start",
    expectedTopics: ["8", "am", "morning"]
  },
  {
    category: "Event Date & Time",
    question: "how long is the buildathon",
    expectedTopics: ["10", "hour", "8", "6"]
  },

  // Venue & Location Questions
  {
    category: "Venue & Location",
    question: "where is the venue",
    expectedTopics: ["moratuwa", "faculty", "it", "maps"]
  },
  {
    category: "Venue & Location",
    question: "send me the map link",
    expectedTopics: ["maps.app.goo.gl", "WsNriCAdxhJadHaK7"]
  },
  {
    category: "Venue & Location",
    question: "how do i get there",
    expectedTopics: ["maps", "directions", "moratuwa"]
  },

  // Registration Questions
  {
    category: "Registration",
    question: "how to register",
    expectedTopics: ["chat", "team name", "batch", "members"]
  },
  {
    category: "Registration",
    question: "what's the registration process",
    expectedTopics: ["step", "team name", "batch", "members"]
  },
  {
    category: "Registration",
    question: "can i edit after registration",
    expectedTopics: ["yes", "edit", "reset"]
  },
  {
    category: "Registration",
    question: "what happens if i click reset",
    expectedTopics: ["reset", "new", "lose", "access"]
  },

  // Team Questions
  {
    category: "Team Requirements",
    question: "how many members",
    expectedTopics: ["4", "four", "members"]
  },
  {
    category: "Team Requirements",
    question: "what batches can join",
    expectedTopics: ["23", "24", "batch"]
  },
  {
    category: "Team Requirements",
    question: "can we mix batches",
    expectedTopics: ["same", "batch", "cannot"]
  },
  {
    category: "Team Requirements",
    question: "can one person be in multiple teams",
    expectedTopics: ["no", "once", "cannot"]
  },

  // Submission Questions
  {
    category: "Submission",
    question: "what do we need to submit",
    expectedTopics: ["github", "drive", "video", "report"]
  },
  {
    category: "Submission",
    question: "when is the deadline",
    expectedTopics: ["6", "pm", "november", "15"]
  },
  {
    category: "Submission",
    question: "what should be in the github repo",
    expectedTopics: ["code", "readme", "source"]
  },
  {
    category: "Submission",
    question: "file naming format",
    expectedTopics: ["team", "demo", "mp4", "report", "pdf"]
  },

  // Technology Questions
  {
    category: "Technology",
    question: "can we use react",
    expectedTopics: ["yes", "any", "framework"]
  },
  {
    category: "Technology",
    question: "are there tech restrictions",
    expectedTopics: ["no", "any", "technology"]
  },
  {
    category: "Technology",
    question: "can we use ai tools",
    expectedTopics: ["yes", "chatgpt", "copilot", "ai"]
  },
  {
    category: "Technology",
    question: "which programming languages are allowed",
    expectedTopics: ["any", "python", "javascript"]
  },

  // General/Vague Questions
  {
    category: "General",
    question: "tell me about coderush",
    expectedTopics: ["buildathon", "university", "moratuwa", "10", "hour"]
  },
  {
    category: "General",
    question: "explain this event",
    expectedTopics: ["buildathon", "coding", "competition"]
  },
  {
    category: "General",
    question: "what is this about",
    expectedTopics: ["coderush", "event", "buildathon"]
  },

  // New Features - Judging & Equipment
  {
    category: "Judging",
    question: "how will projects be judged",
    expectedTopics: ["innovation", "technical", "criteria"]
  },
  {
    category: "Equipment",
    question: "what should i bring",
    expectedTopics: ["laptop", "charger"]
  },
  {
    category: "Equipment",
    question: "is there wifi",
    expectedTopics: ["yes", "wifi", "internet"]
  },

  // Edge Cases & Conversational
  {
    category: "Conversational",
    question: "hey what's up",
    expectedTopics: ["coderush", "help", "register"]
  },
  {
    category: "Conversational",
    question: "i have a question",
    expectedTopics: ["help", "ask"]
  },

  // Specific Detail Questions
  {
    category: "Specific Details",
    question: "team name rules",
    expectedTopics: ["3", "10", "characters"]
  },
  {
    category: "Specific Details",
    question: "index number format",
    expectedTopics: ["6", "digits", "letter", "23", "24"]
  },
  {
    category: "Specific Details",
    question: "can we start coding before the event",
    expectedTopics: ["no", "8", "am", "fairness"]
  },
  {
    category: "Specific Details",
    question: "is food provided",
    expectedTopics: ["yes", "refreshment"]
  }
];

async function runTests() {
  console.log('🧪 Starting Comprehensive RAG Tests\n');
  console.log('=' .repeat(80));

  let passed = 0;
  let failed = 0;
  const failedTests: { question: string; reason: string }[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    const testNum = i + 1;

    try {
      console.log(`\n[${testNum}/${testCases.length}] Testing: "${test.question}"`);
      console.log(`Category: ${test.category}`);

      const answer = await answerQuestionWithRAG(test.question);

      // Check if answer contains expected topics
      const lowerAnswer = answer.toLowerCase();
      const foundTopics = test.expectedTopics.filter(topic =>
        lowerAnswer.includes(topic.toLowerCase())
      );

      const allTopicsFound = foundTopics.length >= Math.ceil(test.expectedTopics.length * 0.6);

      if (allTopicsFound) {
        console.log(`✅ PASS - Found ${foundTopics.length}/${test.expectedTopics.length} expected topics`);
        console.log(`📝 Answer preview: ${answer.substring(0, 150)}...`);
        passed++;
      } else {
        console.log(`❌ FAIL - Only found ${foundTopics.length}/${test.expectedTopics.length} expected topics`);
        console.log(`   Expected: ${test.expectedTopics.join(', ')}`);
        console.log(`   Found: ${foundTopics.join(', ')}`);
        console.log(`📝 Answer: ${answer}`);
        failed++;
        failedTests.push({
          question: test.question,
          reason: `Missing topics: ${test.expectedTopics.filter(t => !foundTopics.includes(t)).join(', ')}`
        });
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.log(`❌ ERROR - ${error instanceof Error ? error.message : 'Unknown error'}`);
      failed++;
      failedTests.push({
        question: test.question,
        reason: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  console.log('\n' + '=' .repeat(80));
  console.log('\n📊 Test Results Summary');
  console.log('=' .repeat(80));
  console.log(`✅ Passed: ${passed}/${testCases.length} (${Math.round(passed/testCases.length * 100)}%)`);
  console.log(`❌ Failed: ${failed}/${testCases.length} (${Math.round(failed/testCases.length * 100)}%)`);

  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests Details:');
    console.log('=' .repeat(80));
    failedTests.forEach((test, i) => {
      console.log(`${i + 1}. Question: "${test.question}"`);
      console.log(`   Reason: ${test.reason}\n`);
    });
  }

  // Category breakdown
  console.log('\n📋 Results by Category:');
  console.log('=' .repeat(80));
  const categories = [...new Set(testCases.map(t => t.category))];
  categories.forEach(cat => {
    const catTests = testCases.filter(t => t.category === cat);
    const catPassed = catTests.filter((t, i) => {
      const globalIndex = testCases.indexOf(t);
      return globalIndex < passed + failed && !failedTests.some(f => f.question === t.question);
    }).length;
    console.log(`${cat}: ${catPassed}/${catTests.length}`);
  });

  if (passed === testCases.length) {
    console.log('\n🎉 All tests passed! The RAG system is working perfectly! 🎉');
  } else if (passed / testCases.length >= 0.9) {
    console.log('\n✅ Excellent! Over 90% tests passed. Minor improvements needed.');
  } else if (passed / testCases.length >= 0.75) {
    console.log('\n⚠️  Good progress. Some improvements needed for better accuracy.');
  } else {
    console.log('\n❌ Needs improvement. Review failed tests and update knowledge base.');
  }
}

runTests().catch(console.error);
