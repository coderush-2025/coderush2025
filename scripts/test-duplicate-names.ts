/**
 * Test script to verify case-insensitive duplicate name detection
 * Tests that names like "Bindu", "bindu", "BINDU", "BiNdU" are treated as duplicates
 */

import mongoose from 'mongoose';
import Registration from '../src/models/Registration';

const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_uri';

async function testDuplicateNames() {
  try {
    console.log('🔍 Testing Case-Insensitive Duplicate Name Detection\n');
    console.log('━'.repeat(60));

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Create a test session
    const testSessionId = `test-duplicate-names-${Date.now()}`;

    // Clean up any existing test data
    await Registration.deleteMany({ sessionId: testSessionId });

    // Create a registration with first member
    const registration = new Registration({
      sessionId: testSessionId,
      state: 'MEMBER_DETAILS',
      teamName: 'TestTeam',
      teamBatch: '24',
      currentMember: 1,
      members: []
    });
    await registration.save();

    console.log('📝 Test Registration Created');
    console.log(`Team: ${registration.teamName}`);
    console.log(`Session: ${testSessionId}\n`);

    // Test cases: Different case variations of the same name
    const testCases = [
      { name: 'Bindu Silva', shouldSucceed: true, description: 'First member - should succeed' },
      { name: 'bindu silva', shouldSucceed: false, description: 'Lowercase duplicate - should fail' },
      { name: 'BINDU SILVA', shouldSucceed: false, description: 'Uppercase duplicate - should fail' },
      { name: 'BiNdU SiLvA', shouldSucceed: false, description: 'Mixed case duplicate - should fail' },
      { name: 'Bindu  Silva', shouldSucceed: false, description: 'Extra space duplicate - should fail (after trim)' },
      { name: 'Kamal Perera', shouldSucceed: true, description: 'Different name - should succeed' },
      { name: 'KAMAL PERERA', shouldSucceed: false, description: 'Kamal uppercase duplicate - should fail' },
      { name: 'Nimal Fernando', shouldSucceed: true, description: 'Another different name - should succeed' },
    ];

    let passedTests = 0;
    let failedTests = 0;

    console.log('🧪 Running Test Cases:\n');

    for (const testCase of testCases) {
      const lowerName = testCase.name.trim().toLowerCase();

      // Reload registration to get latest members
      const reg = await Registration.findOne({ sessionId: testSessionId });
      if (!reg) {
        console.log('❌ Registration not found!');
        continue;
      }

      // Check if name exists (case-insensitive)
      const nameExists = reg.members.some(m => m.fullName.toLowerCase() === lowerName);

      const testPassed = (nameExists && !testCase.shouldSucceed) || (!nameExists && testCase.shouldSucceed);

      if (testPassed) {
        console.log(`✅ PASS: ${testCase.description}`);
        console.log(`   Input: "${testCase.name}"`);
        console.log(`   Expected: ${testCase.shouldSucceed ? 'Accept' : 'Reject'} | Result: ${nameExists ? 'Rejected' : 'Accepted'}\n`);
        passedTests++;

        // If test expects success, add the member
        if (testCase.shouldSucceed) {
          reg.members.push({
            fullName: testCase.name.trim(),
            indexNumber: `24${1000 + reg.members.length}T`,
            email: `member${reg.members.length + 1}@test.com`,
            batch: '24'
          });
          await reg.save();
          console.log(`   ➕ Added to team (Total members: ${reg.members.length})\n`);
        }
      } else {
        console.log(`❌ FAIL: ${testCase.description}`);
        console.log(`   Input: "${testCase.name}"`);
        console.log(`   Expected: ${testCase.shouldSucceed ? 'Accept' : 'Reject'} | Result: ${nameExists ? 'Rejected' : 'Accepted'}\n`);
        failedTests++;
      }
    }

    console.log('━'.repeat(60));
    console.log('\n📊 Test Results:');
    console.log(`   ✅ Passed: ${passedTests}/${testCases.length}`);
    console.log(`   ❌ Failed: ${failedTests}/${testCases.length}`);
    console.log(`   Success Rate: ${Math.round((passedTests / testCases.length) * 100)}%\n`);

    // Show final team composition
    const finalReg = await Registration.findOne({ sessionId: testSessionId });
    if (finalReg) {
      console.log('👥 Final Team Composition:');
      finalReg.members.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.fullName} (${member.indexNumber})`);
      });
      console.log();
    }

    // Cleanup
    await Registration.deleteOne({ sessionId: testSessionId });
    console.log('🧹 Test data cleaned up');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB\n');

    if (failedTests === 0) {
      console.log('🎉 All tests passed! Case-insensitive duplicate detection is working correctly.\n');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed. Please review the implementation.\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error during testing:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the test
testDuplicateNames();
