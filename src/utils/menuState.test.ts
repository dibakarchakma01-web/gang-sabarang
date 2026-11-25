import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_MENU_ITEMS } from '../data/initialData';
import {
  addMenuItemToList,
  deleteMenuItemFromList,
  toggleMenuItemAvailabilityInList,
  toggleMenuItemFeaturedInList,
  updateMenuItemInList,
} from './menuState';

test('addMenuItemToList appends a normalized new dish with unique id', () => {
  const result = addMenuItemToList(INITIAL_MENU_ITEMS, {
    categoryId: 'cat-rice',
    name: '  Saffron Hill Rice  ',
    description: '  Aromatic rice dish  ',
    price: 220,
    price1_2: 220,
    price1_4: 410,
    imageUrl: ' /src/assets/images/menu_bamboo_rice_1795589608454.jpg ',
    isAvailable: true,
    isFeatured: true,
  });

  assert.equal(result.items.length, INITIAL_MENU_ITEMS.length + 1);
  assert.equal(result.created.id, 'menu-saffron-hill-rice');
  assert.equal(result.created.name, 'Saffron Hill Rice');
  assert.equal(result.created.description, 'Aromatic rice dish');
  assert.equal(result.created.price1_2, 220);
  assert.equal(result.created.price1_4, 410);
  assert.equal(
    result.created.imageUrl,
    '/src/assets/images/menu_bamboo_rice_1795589608454.jpg',
  );
});

test('updateMenuItemInList updates matching item without mutating other items', () => {
  const updated = updateMenuItemInList(INITIAL_MENU_ITEMS, 'menu-rice-2', {
    price: 280,
    price1_2: 280,
    price1_4: null,
    name: 'Bamboo Rice Updated',
  });

  const target = updated.find((item) => item.id === 'menu-rice-2');
  assert.equal(target?.price, 280);
  assert.equal(target?.price1_2, 280);
  assert.equal(target?.price1_4, null);
  assert.equal(target?.name, 'Bamboo Rice Updated');
  assert.equal(updated.length, INITIAL_MENU_ITEMS.length);
});

test('deleteMenuItemFromList removes the target item cleanly', () => {
  const next = deleteMenuItemFromList(INITIAL_MENU_ITEMS, 'menu-rice-1');
  assert.equal(next.length, INITIAL_MENU_ITEMS.length - 1);
  assert.equal(
    next.some((item) => item.id === 'menu-rice-1'),
    false,
  );
});

test('toggleMenuItemAvailabilityInList and toggleMenuItemFeaturedInList invert target flags', () => {
  const afterAvailability = toggleMenuItemAvailabilityInList(
    INITIAL_MENU_ITEMS,
    'menu-fish-2',
  );
  assert.equal(
    afterAvailability.find((item) => item.id === 'menu-fish-2')?.isAvailable,
    true,
  );

  const afterFeatured = toggleMenuItemFeaturedInList(
    afterAvailability,
    'menu-fish-2',
  );
  assert.equal(
    afterFeatured.find((item) => item.id === 'menu-fish-2')?.isFeatured,
    true,
  );
});
