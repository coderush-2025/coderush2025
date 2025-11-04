/**
 * Final Comprehensive Test - Check Everything
 * Tests all possible user questions to find any gaps
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { answerQuestionWithRAG, isSpamOrOffTopic } from '../src/lib/geminiService';

const comprehensiveQuestions = [
  // === EVENT BASICS ===
  { category: "Event Basics", q: "when is coderush" },
  { category: "Event Basics", q: "what time does it start" },
  { category: "Event Basics", q: "where is it" },
  { category: "Event Basics", q: "how long is the event" },
  { category: "Event Basics", q: "what is coderush" },
  { category: "Event Basics", q: "when is awards ceremony" },

  // === LOCATION & VENUE ===
  { category: "Location", q: "send me location" },
  { category: "Location", q: "how do i get there" },
  { category: "Location", q: "map link please" },
  { category: "Location", q: "what is the address" },

  // === TEAM ===
  { category: "Team", q: "how many members" },
  { category: "Team", q: "can we have 3 people" },
  { category: "Team", q: "can batch 23 and 24 mix" },
  { category: "Team", q: "can i be in two teams" },
  { category: "Team", q: "what if someone drops out" },

  // === REGISTRATION ===
  { category: "Registration", q: "how to register" },
  { category: "Registration", q: "can i edit registration" },
  { category: "Registration", q: "index number format" },
  { category: "Registration", q: "i made a mistake" },
  { category: "Registration", q: "registration deadline" },

  // === TECHNOLOGIES ===
  { category: "Tech", q: "can we use react" },
  { category: "Tech", q: "can we use nextjs" },
  { category: "Tech", q: "can we use python" },
  { category: "Tech", q: "what languages are allowed" },
  { category: "Tech", q: "can we use tailwind css" },
  { category: "Tech", q: "can we use bootstrap" },

  // === AI TOOLS ===
  { category: "AI Tools", q: "can we use chatgpt" },
  { category: "AI Tools", q: "can we use copilot" },
  { category: "AI Tools", q: "are ai tools allowed" },
  { category: "AI Tools", q: "can we use claude" },

  // === SUBMISSION ===
  { category: "Submission", q: "how to submit" },
  { category: "Submission", q: "submission deadline" },
  { category: "Submission", q: "what to submit" },
  { category: "Submission", q: "do we need video" },
  { category: "Submission", q: "github public or private" },
  { category: "Submission", q: "can we submit late" },

  // === PROJECT/SCENARIO ===
  { category: "Scenario", q: "what should we build" },
  { category: "Scenario", q: "is there a theme" },
  { category: "Scenario", q: "what are scenario questions" },
  { category: "Scenario", q: "give me example scenario" },
  { category: "Scenario", q: "what problems will we solve" },

  // === RULES & REQUIREMENTS ===
  { category: "Rules", q: "what are the rules" },
  { category: "Rules", q: "any restrictions" },
  { category: "Rules", q: "can we start coding before" },
  { category: "Rules", q: "what to bring" },
  { category: "Rules", q: "is food provided" },
  { category: "Rules", q: "can we leave early" },

  // === PRIZES & WINNERS ===
  { category: "Prizes", q: "what are the prizes" },
  { category: "Prizes", q: "how many winners" },
  { category: "Prizes", q: "prize money" },

  // === CONTACT & SUPPORT ===
  { category: "Contact", q: "who are the organizers" },
  { category: "Contact", q: "contact number" },
  { category: "Contact", q: "organizer email" },
  { category: "Contact", q: "i need help" },
  { category: "Contact", q: "i have a problem" },

  // === TECHNICAL DETAILS ===
  { category: "Technical", q: "can we use apis" },
  { category: "Technical", q: "can we use databases" },
  { category: "Technical", q: "hosting provided" },
  { category: "Technical", q: "internet available" },
  { category: "Technical", q: "power outlets available" },

  // === ELIGIBILITY ===
  { category: "Eligibility", q: "who can participate" },
  { category: "Eligibility", q: "only IT students" },
  { category: "Eligibility", q: "need experience" },
  { category: "Eligibility", q: "first year can join" },

  // === SHOULD BE BLOCKED ===
  { category: "BLOCK", q: "what is react", shouldBlock: true },
  { category: "BLOCK", q: "teach me python", shouldBlock: true },
  { category: "BLOCK", q: "what is sex", shouldBlock: true },
  { category: "BLOCK", q: "fuck you", shouldBlock: true },
  { category: "BLOCK", q: "weather today", shouldBlock: true },
];

async function runFinalTest() {
  console.log('🎯 FINAL COMPREHENSIVE TEST - Checking Everything!\n');
  console.log('='.repeat(100));

  let answered = 0;
  let blocked = 0;
  let noAnswer = 0;
  let errors = 0;
  const missingTopics: string[] = [];

  for (const test of comprehensiveQuestions) {
    console.log(`\n[${test.category}] "${test.q}"`);
    console.log('-'.repeat(100));

    try {
      // Check if should be blocked
      const isBlocked = isSpamOrOffTopic(test.q);

      if (test.shouldBlock) {
        if (isBlocked) {
          console.log('✅ CORRECTLY BLOCKED');
          blocked++;
        } else {
          console.log('❌ SHOULD BE BLOCKED BUT WASN\'T!');
          errors++;
        }
        continue;
      }

      if (isBlocked) {
        console.log('❌ WRONGLY BLOCKED - Valid question!');
        errors++;
        missingTopics.push(`${test.category}: ${test.q}`);
        continue;
      }

      // Get answer
      const answer = await answerQuestionWithRAG(test.q, { state: 'IDLE' });

      // Check quality
      if (answer.includes('having trouble') || answer.includes('only help with CodeRush') || answer.length < 30) {
        console.log('⚠️  NO CLEAR ANSWER');
        console.log(`Response: ${answer.substring(0, 100)}...`);
        noAnswer++;
        missingTopics.push(`${test.category}: ${test.q}`);
      } else {
        console.log('✅ ANSWERED');
        console.log(`Response: ${answer.substring(0, 150)}...`);
        answered++;
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error: any) {
      console.log('❌ ERROR:', error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log('\n📊 FINAL RESULTS:');
  console.log(`   ✅ Questions Answered: ${answered}`);
  console.log(`   🚫 Correctly Blocked: ${blocked}`);
  console.log(`   ⚠️  No Clear Answer: ${noAnswer}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📝 Total Tests: ${comprehensiveQuestions.length}`);

  const successRate = (answered + blocked) / comprehensiveQuestions.length * 100;
  console.log(`\n   🎯 Success Rate: ${successRate.toFixed(1)}%`);

  if (missingTopics.length > 0) {
    console.log('\n⚠️  MISSING OR UNCLEAR TOPICS:');
    missingTopics.forEach(topic => console.log(`   - ${topic}`));
  }

  if (successRate >= 95) {
    console.log('\n✅ EXCELLENT! Bot is production ready! 🚀');
  } else if (successRate >= 85) {
    console.log('\n👍 GOOD! Some topics need clarification.');
  } else {
    console.log('\n⚠️  NEEDS IMPROVEMENT - Several topics missing.');
  }
}

runFinalTest().catch(console.error);
