import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRAND_PALETTE,
  BRAND_TYPOGRAPHY,
  GANG_SABARANG_BRAND,
  isValidHexColor,
} from './brand';

test('brand palette keeps all five required hex tokens unchanged', () => {
  assert.equal(BRAND_PALETTE.primary, '#1C3A27');
  assert.equal(BRAND_PALETTE.secondary, '#C5A059');
  assert.equal(BRAND_PALETTE.accent, '#D97706');
  assert.equal(BRAND_PALETTE.background, '#FAF8F5');
  assert.equal(BRAND_PALETTE.text, '#1A241E');

  for (const hex of Object.values(BRAND_PALETTE)) {
    assert.equal(isValidHexColor(hex), true, `Expected valid hex color: ${hex}`);
  }
});

test('brand identity matches English name, subtitle, location, and page title', () => {
  assert.equal(GANG_SABARANG_BRAND.name, 'Gang Sabarang');
  assert.equal(
    GANG_SABARANG_BRAND.subtitle,
    'Luxury Dining & Nature Cottages in the Heart of Rangamati',
  );
  assert.equal(
    GANG_SABARANG_BRAND.locationAddress,
    'Pagoda Road, Opposite Assambosti Govt. Primary School, Rangamati, Bangladesh',
  );
  assert.equal(
    GANG_SABARANG_BRAND.pageTitle,
    'Gang Sabarang | Restaurant & Cottage — Rangamati',
  );
});

test('brand typography uses Afacad with weights 400, 500, 600, and 700', () => {
  assert.equal(BRAND_TYPOGRAPHY.primary, 'Afacad');
  assert.deepEqual(BRAND_TYPOGRAPHY.weights, [400, 500, 600, 700]);
});
