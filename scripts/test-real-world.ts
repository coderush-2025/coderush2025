/**
 * Real-World User Questions Test
 * Tests all possible situations users might encounter
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { answerQuestionWithRAG, classifyIntent, isSpamOrOffTopic } from '../src/lib/geminiService';

const realWorldQuestions = [
  // === VALID EVENT QUESTIONS ===
  { category: "Event Info", question: "when is the event" },
  { category: "Event Info", question: "what time does it start" },
  { category: "Event Info", question: "where is the venue" },
  { category: "Event Info", question: "how long is the event" },
  { category: "Event Info", question: "what should i bring" },

  // === TEAM QUESTIONS ===
  { category: "Team", question: "how many members in a team" },
  { category: "Team", question: "can i have 3 members" },
  { category: "Team", question: "can batch 23 and 24 mix" },
  { category: "Team", question: "what if my teammate drops out" },
  { category: "Team", question: "can i change team name later" },

  // === REGISTRATION QUESTIONS ===
  { category: "Registration", question: "how do i register" },
  { category: "Registration", question: "can i edit my registration" },
  { category: "Registration", question: "what is index number format" },
  { category: "Registration", question: "i made a mistake in email" },
  { category: "Registration", question: "can i register multiple teams" },

  // === SUBMISSION QUESTIONS ===
  { category: "Submission", question: "how do i submit my project" },
  { category: "Submission", question: "what is the deadline" },
  { category: "Submission", question: "can i submit late" },
  { category: "Submission", question: "do i need a video demo" },
  { category: "Submission", question: "github must be public?" },

  // === TECHNICAL QUESTIONS ===
  { category: "Technical", question: "what technologies can we use" },
  { category: "Technical", question: "can we use AI tools" },
  { category: "Technical", question: "do you provide hosting" },
  { category: "Technical", question: "can we use external APIs" },

  // === PRIZES/RULES ===
  { category: "Prizes", question: "what are the prizes" },
  { category: "Prizes", question: "how many winners" },
  { category: "Rules", question: "can we start coding before event" },
  { category: "Rules", question: "are there any restrictions" },

  // === SUPPORT/HELP ===
  { category: "Support", question: "i have a problem" },
  { category: "Support", question: "who do i contact for help" },
  { category: "Support", question: "what if i get stuck" },

  // === CASUAL/TYPOS (Should still work) ===
  { category: "Casual", question: "hey when is this thing" },
  { category: "Casual", question: "how many ppl per team" },
  { category: "Casual", question: "whats the format" },
  { category: "Casual", question: "can i edit stufff" }, // typo

  // === INAPPROPRIATE (Should be BLOCKED) ===
  { category: "BLOCK", question: "what is sex" },
  { category: "BLOCK", question: "how to hack" },
  { category: "BLOCK", question: "fuck you" },
  { category: "BLOCK", question: "show me porn" },

  // === OFF-TOPIC (Should be BLOCKED) ===
  { category: "BLOCK", question: "what is react" },
  { category: "BLOCK", question: "teach me python" },
  { category: "BLOCK", question: "what's the weather" },
  { category: "BLOCK", question: "tell me a joke" },
  { category: "BLOCK", question: "who are you" },
];

async function testRealWorld() {
  console.log('🌍 Testing Real-World User Questions...\n');
  console.log('='.repeat(100));

  let validAnswered = 0;
  let blockedCorrectly = 0;
  let total = 0;

  for (const test of realWorldQuestions) {
    total++;
    console.log(`\n[${test.category}] "${test.question}"`);
    console.log('-'.repeat(100));

    // Check if should be blocked
    const isBlocked = isSpamOrOffTopic(test.question);

    if (test.category === 'BLOCK') {
      if (isBlocked) {
        console.log('✅ CORRECTLY BLOCKED - Friendly redirect message shown');
        blockedCorrectly++;
      } else {
        console.log('❌ SHOULD BE BLOCKED but was allowed!');
      }
      continue;
    }

    // If it's a valid question
    if (isBlocked) {
      console.log('❌ WRONGLY BLOCKED - Valid question was blocked!');
      continue;
    }

    // Classify intent
    const intent = await classifyIntent(test.question, 'IDLE');
    console.log(`🧠 Intent: ${intent}`);

    if (intent === 'QUESTION') {
      try {
        // Get answer
        const answer = await answerQuestionWithRAG(test.question, { state: 'IDLE' });
        console.log(`✅ Answer:\n${answer}`);

        // Check if answer is helpful
        if (answer.length > 20 && !answer.includes('having trouble')) {
          validAnswered++;
        }
      } catch (error) {
        const err = error as { message?: string };
        console.log(`❌ Error: ${err.message}`);
      }
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(100));
  console.log(`\n📊 RESULTS:`);
  console.log(`   Valid Questions Answered: ${validAnswered}`);
  console.log(`   Inappropriate Blocked: ${blockedCorrectly}`);
  console.log(`   Total Tests: ${total}`);

  const successRate = (validAnswered + blockedCorrectly) / total * 100;
  console.log(`\n   🎯 Success Rate: ${successRate.toFixed(1)}%`);

  if (successRate >= 90) {
    console.log('\n✅ EXCELLENT! Chatbot is handling real-world questions very well!');
  } else if (successRate >= 75) {
    console.log('\n⚠️  GOOD but needs improvement');
  } else {
    console.log('\n❌ NEEDS WORK - Many questions not handled properly');
  }
}

testRealWorld().catch(console.error);
