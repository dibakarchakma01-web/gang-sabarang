import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VERIFIED_GOOGLE_MAPS_SEARCH_URL,
  formatPhoneDisplay,
  toSafeExternalUrl,
  toTelHref,
  toWhatsAppHref,
} from './contactLinks';

test('formatPhoneDisplay formats +8801550050641 cleanly', () => {
  assert.equal(formatPhoneDisplay('+8801550050641'), '+880 1550-050641');
});

test('toTelHref and toWhatsAppHref produce valid clickable URIs', () => {
  assert.equal(toTelHref('+8801550050641'), 'tel:+8801550050641');
  assert.equal(toTelHref('+880 1550-050641'), 'tel:+8801550050641');
  assert.equal(
    toWhatsAppHref('+8801550050641'),
    'https://wa.me/8801550050641',
  );
  assert.equal(toTelHref('not a phone'), null);
  assert.equal(toWhatsAppHref('placeholder'), null);
});

test('toSafeExternalUrl accepts http/https URLs and rejects unsafe schemes', () => {
  assert.equal(
    toSafeExternalUrl('https://www.facebook.com/gangsabarang'),
    'https://www.facebook.com/gangsabarang',
  );
  assert.equal(toSafeExternalUrl('javascript:alert(1)'), null);
  assert.equal(toSafeExternalUrl(''), null);
  assert.equal(
    VERIFIED_GOOGLE_MAPS_SEARCH_URL,
    'https://www.google.com/maps/search/?api=1&query=Pagoda+Road+Assambosti+Rangamati+Bangladesh',
  );
});
