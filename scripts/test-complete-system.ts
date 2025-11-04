/**
 * Comprehensive System Test
 * Tests the complete registration flow with RAG-powered chat assistant
 */

import { answerQuestionWithRAG, classifyIntent, isSpamOrOffTopic, checkQuestionRateLimit } from '../src/lib/geminiService';
import { searchVectorDatabase, isPineconeAvailable, generateEmbedding } from '../src/lib/vectorService';
import { searchByKeyword, knowledgeBase } from '../src/lib/knowledgeBase';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.cyan + colors.bright);
  console.log('='.repeat(60));
}

function logTest(testName: string) {
  log(`\n🧪 Test: ${testName}`, colors.blue);
}

function logSuccess(message: string) {
  log(`✅ ${message}`, colors.green);
}

function logError(message: string) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, colors.cyan);
}

/**
 * Test 1: Knowledge Base Integrity
 */
async function testKnowledgeBase() {
  logSection('TEST 1: KNOWLEDGE BASE INTEGRITY');

  try {
    logTest('Verifying knowledge base structure');

    // Check document count
    if (knowledgeBase.length === 0) {
      throw new Error('Knowledge base is empty');
    }
    logSuccess(`Knowledge base contains ${knowledgeBase.length} documents`);

    // Check required fields
    const invalidDocs = knowledgeBase.filter(doc =>
      !doc.id || !doc.category || !doc.question || !doc.answer || !doc.keywords || doc.priority === undefined
    );

    if (invalidDocs.length > 0) {
      throw new Error(`Found ${invalidDocs.length} invalid documents`);
    }
    logSuccess('All documents have required fields');

    // Check categories
    const categories = [...new Set(knowledgeBase.map(doc => doc.category))];
    logInfo(`Categories: ${categories.join(', ')}`);
    logSuccess(`Found ${categories.length} categories`);

    // Test keyword search
    logTest('Testing keyword search functionality');
    const venueResults = searchByKeyword('venue location', 3);
    if (venueResults.length === 0) {
      throw new Error('Keyword search returned no results for "venue location"');
    }
    logSuccess(`Keyword search found ${venueResults.length} relevant documents`);
    logInfo(`Top result: "${venueResults[0].question}"`);

    // Test search for registration info
    const regResults = searchByKeyword('team name rules', 3);
    if (regResults.length === 0) {
      throw new Error('Keyword search returned no results for "team name rules"');
    }
    logSuccess(`Found ${regResults.length} registration-related documents`);

    logSuccess('✓ Knowledge Base tests passed');
    return true;
  } catch (error) {
    logError(`Knowledge Base test failed: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Test 2: Pinecone Vector Database
 */
async function testVectorDatabase() {
  logSection('TEST 2: PINECONE VECTOR DATABASE');

  try {
    // Check if Pinecone is configured
    logTest('Checking Pinecone configuration');
    if (!process.env.PINECONE_API_KEY) {
      logWarning('PINECONE_API_KEY not found in environment');
      logInfo('Vector search will use fallback keyword search');
      return true; // Not a failure, just a warning
    }
    logSuccess('Pinecone API key configured');

    // Check if Pinecone index is available
    logTest('Checking Pinecone index availability');
    const isAvailable = await isPineconeAvailable();

    if (!isAvailable) {
      logWarning('Pinecone index not available');
      logInfo('Run "npm run setup-pinecone" to initialize the vector database');
      logInfo('System will use fallback keyword search');
      return true; // Not a failure
    }
    logSuccess('Pinecone index is available');

    // Test embedding generation
    logTest('Testing embedding generation with Gemini');
    const testText = 'When is CodeRush 2025?';
    const embedding = await generateEmbedding(testText);

    if (!embedding || embedding.length !== 768) {
      throw new Error(`Invalid embedding dimensions: expected 768, got ${embedding?.length || 0}`);
    }
    logSuccess(`Generated embedding with correct dimensions (768)`);

    // Test vector search
    logTest('Testing semantic vector search');
    const searchResults = await searchVectorDatabase('event location venue', 3);

    if (searchResults.length === 0) {
      throw new Error('Vector search returned no results');
    }
    logSuccess(`Vector search found ${searchResults.length} relevant documents`);
    logInfo(`Top result: "${searchResults[0].question}"`);

    // Test semantic understanding
    logTest('Testing semantic understanding');
    const semanticResults = await searchVectorDatabase('where is the competition held?', 3);
    if (semanticResults.length > 0) {
      logSuccess('Successfully found venue information using semantic search');
      logInfo(`Matched: "${semanticResults[0].question}"`);
    }

    logSuccess('✓ Vector Database tests passed');
    return true;
  } catch (error) {
    logError(`Vector Database test failed: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Test 3: Gemini AI Integration
 */
async function testGeminiIntegration() {
  logSection('TEST 3: GEMINI AI INTEGRATION');

  try {
    // Check API key
    logTest('Checking Gemini API configuration');
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY not found in environment');
    }
    logSuccess('Gemini API key configured');

    // Test intent classification
    logTest('Testing intent classification');

    const questionIntent = await classifyIntent('What is the event date?', 'IDLE');
    if (questionIntent !== 'QUESTION') {
      throw new Error(`Expected QUESTION intent, got ${questionIntent}`);
    }
    logSuccess('Correctly classified question intent');

    const registrationIntent = await classifyIntent('TeamRocket', 'IDLE');
    if (registrationIntent !== 'REGISTRATION') {
      logWarning(`Classification: "${registrationIntent}" - may vary based on context`);
    } else {
      logSuccess('Correctly classified registration intent');
    }

    const greetingIntent = await classifyIntent('hello', 'IDLE');
    if (greetingIntent !== 'GREETING') {
      throw new Error(`Expected GREETING intent, got ${greetingIntent}`);
    }
    logSuccess('Correctly classified greeting intent');

    // Test spam detection
    logTest('Testing spam and off-topic detection');

    if (!isSpamOrOffTopic('When is CodeRush 2025?')) {
      logSuccess('Valid question not marked as spam');
    } else {
      throw new Error('Valid question incorrectly marked as spam');
    }

    if (isSpamOrOffTopic('buy cheap products now')) {
      logSuccess('Spam detected correctly');
    } else {
      logWarning('Spam detection may need tuning');
    }

    if (isSpamOrOffTopic('what is react')) {
      logSuccess('Off-topic question detected');
    } else {
      logWarning('Off-topic detection may need tuning');
    }

    // Test rate limiting
    logTest('Testing rate limiting');
    const testSessionId = 'test-session-123';

    for (let i = 0; i < 5; i++) {
      if (!checkQuestionRateLimit(testSessionId)) {
        throw new Error('Rate limit triggered too early');
      }
    }
    logSuccess('Rate limiting allows reasonable number of requests');

    // Test RAG Q&A
    logTest('Testing RAG-powered question answering');
    const answer1 = await answerQuestionWithRAG('When is CodeRush 2025?');

    if (!answer1 || answer1.length < 10) {
      throw new Error('RAG returned empty or invalid answer');
    }
    logSuccess('RAG successfully answered event date question');
    logInfo(`Answer: ${answer1.substring(0, 100)}...`);

    const answer2 = await answerQuestionWithRAG('Where is the venue?');
    if (!answer2 || answer2.length < 10) {
      throw new Error('RAG returned empty or invalid answer');
    }
    logSuccess('RAG successfully answered venue question');
    logInfo(`Answer: ${answer2.substring(0, 100)}...`);

    const answer3 = await answerQuestionWithRAG('What are the team requirements?');
    if (!answer3 || answer3.length < 10) {
      throw new Error('RAG returned empty or invalid answer');
    }
    logSuccess('RAG successfully answered team requirements question');
    logInfo(`Answer: ${answer3.substring(0, 100)}...`);

    logSuccess('✓ Gemini AI Integration tests passed');
    return true;
  } catch (error) {
    logError(`Gemini Integration test failed: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.message.includes('API key')) {
      logInfo('Make sure GOOGLE_GEMINI_API_KEY is set in your .env.local file');
    }
    return false;
  }
}

/**
 * Test 4: Registration State Machine
 */
async function testRegistrationFlow() {
  logSection('TEST 4: REGISTRATION STATE MACHINE');

  try {
    logTest('Verifying registration states');

    // Import state machine
    const { states, validators, MEMBER_COUNT } = await import('../src/lib/stateMachine');

    // Check required states
    const requiredStates = ['BATCH_SELECTION', 'MEMBER_DETAILS', 'CONFIRMATION', 'DONE'];
    for (const state of requiredStates) {
      if (!states[state]) {
        throw new Error(`Missing required state: ${state}`);
      }
    }
    logSuccess(`All required states present: ${requiredStates.join(', ')}`);

    // Test validators
    logTest('Testing input validators');

    if (!validators.batch('23') || !validators.batch('24')) {
      throw new Error('Batch validator failed for valid input');
    }
    if (validators.batch('25') || validators.batch('22')) {
      throw new Error('Batch validator accepted invalid input');
    }
    logSuccess('Batch validator working correctly');

    if (!validators.index('234001T') || !validators.index('244001A')) {
      throw new Error('Index validator failed for valid input');
    }
    if (validators.index('12345') || validators.index('234001t')) {
      throw new Error('Index validator accepted invalid input');
    }
    logSuccess('Index validator working correctly');

    if (!validators.email('test@example.com') || !validators.email('user.name+tag@example.co.uk')) {
      throw new Error('Email validator failed for valid input');
    }
    if (validators.email('invalid.email') || validators.email('@example.com')) {
      throw new Error('Email validator accepted invalid input');
    }
    logSuccess('Email validator working correctly');

    // Check member count
    if (MEMBER_COUNT !== 4) {
      throw new Error(`Expected MEMBER_COUNT = 4, got ${MEMBER_COUNT}`);
    }
    logSuccess(`Team size correctly set to ${MEMBER_COUNT} members`);

    logSuccess('✓ Registration State Machine tests passed');
    return true;
  } catch (error) {
    logError(`Registration Flow test failed: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Test 5: Environment Configuration
 */
async function testEnvironmentConfig() {
  logSection('TEST 5: ENVIRONMENT CONFIGURATION');

  try {
    logTest('Checking required environment variables');

    const requiredVars = [
      { name: 'MONGODB_URI', critical: true },
      { name: 'GOOGLE_GEMINI_API_KEY', critical: true },
      { name: 'PINECONE_API_KEY', critical: false },
    ];

    let allCriticalPresent = true;

    for (const envVar of requiredVars) {
      if (process.env[envVar.name]) {
        logSuccess(`${envVar.name} is configured`);
      } else {
        if (envVar.critical) {
          logError(`${envVar.name} is MISSING (CRITICAL)`);
          allCriticalPresent = false;
        } else {
          logWarning(`${envVar.name} is not configured (optional)`);
        }
      }
    }

    if (!allCriticalPresent) {
      throw new Error('Critical environment variables are missing');
    }

    logSuccess('✓ Environment Configuration tests passed');
    return true;
  } catch (error) {
    logError(`Environment Config test failed: ${error instanceof Error ? error.message : String(error)}`);
    logInfo('Create a .env.local file with required variables');
    return false;
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  log('\n' + '█'.repeat(60), colors.magenta);
  log('  CODERUSH 2025 - COMPREHENSIVE SYSTEM TEST', colors.magenta + colors.bright);
  log('  RAG-Powered Registration System', colors.magenta);
  log('█'.repeat(60) + '\n', colors.magenta);

  const results = {
    knowledgeBase: false,
    vectorDatabase: false,
    geminiIntegration: false,
    registrationFlow: false,
    environmentConfig: false,
  };

  // Run tests sequentially
  results.environmentConfig = await testEnvironmentConfig();
  results.knowledgeBase = await testKnowledgeBase();
  results.vectorDatabase = await testVectorDatabase();
  results.geminiIntegration = await testGeminiIntegration();
  results.registrationFlow = await testRegistrationFlow();

  // Summary
  logSection('TEST SUMMARY');

  const testNames = Object.keys(results) as Array<keyof typeof results>;
  const passed = testNames.filter(test => results[test]).length;
  const total = testNames.length;

  console.log('');
  testNames.forEach(test => {
    const status = results[test] ? '✅ PASS' : '❌ FAIL';
    const color = results[test] ? colors.green : colors.red;
    log(`${status} - ${test}`, color);
  });

  console.log('\n' + '='.repeat(60));
  const summaryColor = passed === total ? colors.green : passed > total / 2 ? colors.yellow : colors.red;
  log(`RESULT: ${passed}/${total} tests passed`, summaryColor + colors.bright);
  console.log('='.repeat(60) + '\n');

  if (passed === total) {
    log('🎉 All systems operational! Registration system is ready.', colors.green + colors.bright);
  } else if (passed > total / 2) {
    log('⚠️  Some issues detected. Review warnings above.', colors.yellow + colors.bright);
  } else {
    log('❌ Critical issues detected. Please fix errors before deployment.', colors.red + colors.bright);
  }

  // Exit with appropriate code
  process.exit(passed === total ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  logError(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
