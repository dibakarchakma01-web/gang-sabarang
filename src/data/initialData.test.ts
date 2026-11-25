import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_CONTACT_INFO,
  INITIAL_FOOD_CATEGORIES,
  INITIAL_GALLERY_ITEMS,
  INITIAL_MENU_ITEMS,
  INITIAL_ROOM_TYPES,
  VERIFIED_LOCATION_ADDRESS,
  formatBDT,
} from './initialData';

test('INITIAL_ROOM_TYPES and initial menu/gallery items are empty by default as requested', () => {
  assert.equal(INITIAL_ROOM_TYPES.length, 0);
  assert.equal(INITIAL_MENU_ITEMS.length, 0);
  assert.equal(INITIAL_GALLERY_ITEMS.length, 0);
});

test('INITIAL_FOOD_CATEGORIES includes all 7 required menu categories', () => {
  assert.deepEqual(
    INITIAL_FOOD_CATEGORIES.map((category) => category.name),
    ['Rice', 'Chicken', 'Fish', 'Beef', 'Vegetables', 'Snacks', 'Drinks'],
  );
});

test('INITIAL_CONTACT_INFO uses the verified Rangamati address and contact channels', () => {
  assert.equal(
    INITIAL_CONTACT_INFO.address,
    'Pagoda Road, Opposite Assambosti Govt. Primary School, Rangamati, Bangladesh',
  );
  assert.equal(INITIAL_CONTACT_INFO.address, VERIFIED_LOCATION_ADDRESS);
  assert.equal(INITIAL_CONTACT_INFO.phone, '+8801550050641');
  assert.equal(INITIAL_CONTACT_INFO.whatsapp, '+8801550050641');
  assert.equal(
    INITIAL_CONTACT_INFO.facebookUrl,
    'https://www.facebook.com/gangsabarang',
  );
});

test('formatting BDT currency works accurately', () => {
  assert.equal(formatBDT(3000), '৳3,000');
  assert.equal(formatBDT(7000), '৳7,000');
});
