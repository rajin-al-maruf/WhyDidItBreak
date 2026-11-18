const crypto = require('node:crypto');

function generateFingerprint(message, stack) {
  const rawText = (message || '') + (stack ? stack.slice(0, 300) : '');

  return crypto.createHash('sha256').update(rawText).digest('hex');
}

module.exports = { generateFingerprint };