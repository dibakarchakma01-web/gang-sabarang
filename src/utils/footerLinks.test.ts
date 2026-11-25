import test from 'node:test';
import assert from 'node:assert/strict';

test('Footer developer and WhatsApp external link targets are valid and safe', () => {
  const developerLink = 'https://www.facebook.com/dibakorchofficial';
  const whatsAppLink = 'https://wa.me/8801714410596';
  const whatsAppDisplay = '+8801714410596';

  assert.equal(new URL(developerLink).hostname, 'www.facebook.com');
  assert.equal(new URL(whatsAppLink).hostname, 'wa.me');
  assert.equal(new URL(whatsAppLink).pathname, '/8801714410596');
  assert.equal(whatsAppDisplay, '+8801714410596');
});
