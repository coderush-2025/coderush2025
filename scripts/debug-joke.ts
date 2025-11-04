import { isSpamOrOffTopic } from '../src/lib/geminiService';

const message = 'tell me a joke';
const result = isSpamOrOffTopic(message);

console.log(`Message: "${message}"`);
console.log(`Is spam/off-topic: ${result}`);
console.log(`Expected: true`);

// Check if 'joke' is in the message
console.log(`\nContains 'joke': ${message.toLowerCase().includes('joke')}`);
