/**
 * Test script to verify that email addresses are rejected when asking for names
 */

console.log('🧪 Testing Name Validation - Email Pattern Detection\n');
console.log('━'.repeat(80));

// Name validation function (simulating the route logic)
function validateName(input: string): { valid: boolean; error?: string } {
  const trimmedMessage = input.trim();

  // Validate that name is not an email address
  if (trimmedMessage.includes('@') || /^[^\s]+@[^\s]+\.[^\s]+$/.test(trimmedMessage)) {
    return {
      valid: false,
      error: "That looks like an email address! Please provide the person's full name first."
    };
  }

  // Validate that name is not an index number (e.g., 234001T)
  if (/^\d{6}[A-Z]$/i.test(trimmedMessage)) {
    return {
      valid: false,
      error: "That looks like an index number! Please provide the person's full name first."
    };
  }

  // Validate that name is not just numbers
  if (/^\d+$/.test(trimmedMessage)) {
    return {
      valid: false,
      error: "Invalid name. Full name cannot be just numbers."
    };
  }

  // Validate name has at least 2 characters
  if (trimmedMessage.length < 2) {
    return {
      valid: false,
      error: "Name must be at least 2 characters."
    };
  }

  // Valid name
  return { valid: true };
}

// Test cases
const testCases = [
  // Email addresses that should be rejected
  {
    input: 'aditha@gmail.com',
    shouldPass: false,
    description: 'Standard email address',
    expectedError: 'email address'
  },
  {
    input: 'john.doe@student.uom.lk',
    shouldPass: false,
    description: 'University email address',
    expectedError: 'email address'
  },
  {
    input: 'test@example.com',
    shouldPass: false,
    description: 'Simple email',
    expectedError: 'email address'
  },
  {
    input: 'user123@domain.org',
    shouldPass: false,
    description: 'Email with numbers',
    expectedError: 'email address'
  },

  // Valid names that should be accepted
  {
    input: 'Aditha Buwaneka',
    shouldPass: true,
    description: 'Valid two-word name'
  },
  {
    input: 'Bihan Silva',
    shouldPass: true,
    description: 'Valid name with uppercase'
  },
  {
    input: 'John Doe',
    shouldPass: true,
    description: 'Common English name'
  },
  {
    input: 'Sarah',
    shouldPass: true,
    description: 'Single name (valid)'
  },
  {
    input: 'Mike Pereara',
    shouldPass: true,
    description: 'Another valid name'
  },

  // Edge cases that should be rejected
  {
    input: '234001T',
    shouldPass: false,
    description: 'Index number format',
    expectedError: 'index number'
  },
  {
    input: 'a',
    shouldPass: false,
    description: 'Single character',
    expectedError: 'at least 2 characters'
  },
  {
    input: '23',
    shouldPass: false,
    description: 'Batch number',
    expectedError: 'just numbers'
  },
];

console.log('\n📝 Running Test Cases:\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = validateName(testCase.input);
  const testPassed = result.valid === testCase.shouldPass;

  if (testPassed) {
    console.log(`✅ Test ${index + 1}: PASS`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Input: "${testCase.input}"`);
    if (testCase.shouldPass) {
      console.log(`   Result: Accepted (as expected)\n`);
    } else {
      console.log(`   Result: Rejected (as expected)`);
      console.log(`   Error: ${result.error}\n`);
    }
    passed++;
  } else {
    console.log(`❌ Test ${index + 1}: FAIL`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: ${testCase.shouldPass ? 'Accept' : 'Reject'}`);
    console.log(`   Got: ${result.valid ? 'Accepted' : 'Rejected'}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log();
    failed++;
  }
});

console.log('━'.repeat(80));
console.log(`\n📊 Results: ${passed}/${testCases.length} passed`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${Math.round((passed / testCases.length) * 100)}%\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Name validation working correctly!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the implementation.\n');
  process.exit(1);
}
