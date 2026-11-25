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

test('INITIAL_ROOM_TYPES contains the 4 verified cottage tiers with exact prices', () => {
  assert.equal(INITIAL_ROOM_TYPES.length, 4);
  assert.deepEqual(
    INITIAL_ROOM_TYPES.map((room) => ({ name: room.name, price: room.price })),
    [
      { name: 'Non-AC Single', price: 3000 },
      { name: 'Non-AC Double', price: 5000 },
      { name: 'AC Single', price: 5000 },
      { name: 'AC Double', price: 7000 },
    ],
  );
});

test('INITIAL_FOOD_CATEGORIES includes all 7 required menu categories', () => {
  assert.deepEqual(
    INITIAL_FOOD_CATEGORIES.map((category) => category.name),
    ['Rice', 'Chicken', 'Fish', 'Beef', 'Vegetables', 'Snacks', 'Drinks'],
  );
  for (const category of INITIAL_FOOD_CATEGORIES) {
    const itemsInCategory = INITIAL_MENU_ITEMS.filter(
      (item) => item.categoryId === category.id,
    );
    assert.ok(
      itemsInCategory.length > 0,
      `Expected at least one initial menu item in ${category.name}`,
    );
  }
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

test('initial menu and gallery placeholders are populated cleanly', () => {
  assert.ok(INITIAL_MENU_ITEMS.some((item) => item.isFeatured));
  assert.ok(INITIAL_MENU_ITEMS.some((item) => !item.isAvailable));
  assert.ok(
    INITIAL_MENU_ITEMS.every((item) => item.imageUrl.trim().length > 0),
    'Every initial menu item must define a food imageUrl',
  );
  assert.ok(INITIAL_GALLERY_ITEMS.length > 0);
  assert.equal(formatBDT(3000), '৳3,000');
  assert.equal(formatBDT(7000), '৳7,000');
});
