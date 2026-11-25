import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_FOOD_CATEGORIES } from '../data/initialData';
import type { MenuItem } from '../types';
import {
  filterMenuItems,
  getCategoryName,
  getFeaturedMenuItems,
  getMenuAvailabilityLabel,
  getMenuPortionPrices,
  sortMenuItemsByAvailability,
} from './menuFilter';

const SAMPLE_MENU_ITEMS: readonly MenuItem[] = [
  {
    id: 'menu-rice-1',
    categoryId: 'cat-rice',
    name: 'Bamboo Biryani',
    description: 'Traditional bamboo cooked rice',
    price: 350,
    imageUrl: '/img/rice.jpg',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'menu-fish-1',
    categoryId: 'cat-fish',
    name: 'Grilled Lake Fish',
    description: 'Fresh Kaptai lake fish grilled',
    price: 450,
    imageUrl: '/img/fish.jpg',
    isAvailable: false,
    isFeatured: true,
  },
  {
    id: 'menu-fish-2',
    categoryId: 'cat-fish',
    name: 'Kaptai Fish Curry',
    description: 'Spicy fish curry',
    price: 400,
    imageUrl: '/img/curry.jpg',
    isAvailable: true,
    isFeatured: false,
  },
];

test('filterMenuItems returns all items with available items first when category is all and query is empty', () => {
  const result = filterMenuItems(SAMPLE_MENU_ITEMS, 'all', '');
  assert.equal(result.length, SAMPLE_MENU_ITEMS.length);

  const firstUnavailableIndex = result.findIndex((item) => !item.isAvailable);
  if (firstUnavailableIndex !== -1) {
    assert.ok(
      result
        .slice(firstUnavailableIndex)
        .every((item) => item.isAvailable === false),
      'All items after the first unavailable item must also be unavailable',
    );
  }
});

test('sortMenuItemsByAvailability places available items ahead of unavailable items while preserving relative order', () => {
  const sample: readonly MenuItem[] = [
    {
      id: 'a',
      categoryId: 'cat-rice',
      name: 'Unavailable First',
      description: '',
      price: 100,
      imageUrl: '',
      isAvailable: false,
      isFeatured: true,
    },
    {
      id: 'b',
      categoryId: 'cat-rice',
      name: 'Available One',
      description: '',
      price: 120,
      imageUrl: '',
      isAvailable: true,
      isFeatured: false,
    },
    {
      id: 'c',
      categoryId: 'cat-rice',
      name: 'Available Two',
      description: '',
      price: 140,
      imageUrl: '',
      isAvailable: true,
      isFeatured: true,
    },
  ];

  const sorted = sortMenuItemsByAvailability(sample);
  assert.deepEqual(
    sorted.map((item) => item.id),
    ['b', 'c', 'a'],
  );
});

test('getFeaturedMenuItems returns only featured items sorted with available items first', () => {
  const sample: readonly MenuItem[] = [
    {
      id: 'f-unavail',
      categoryId: 'cat-fish',
      name: 'Featured Unavailable',
      description: '',
      price: 500,
      imageUrl: '',
      isAvailable: false,
      isFeatured: true,
    },
    {
      id: 'regular',
      categoryId: 'cat-rice',
      name: 'Not Featured',
      description: '',
      price: 120,
      imageUrl: '',
      isAvailable: true,
      isFeatured: false,
    },
    {
      id: 'f-avail',
      categoryId: 'cat-chicken',
      name: 'Featured Available',
      description: '',
      price: 420,
      imageUrl: '',
      isAvailable: true,
      isFeatured: true,
    },
  ];

  assert.deepEqual(
    getFeaturedMenuItems(sample).map((item) => item.id),
    ['f-avail', 'f-unavail'],
  );
  assert.deepEqual(
    getFeaturedMenuItems(sample, 1).map((item) => item.id),
    ['f-avail'],
  );
});

test('filterMenuItems filters accurately by category id', () => {
  const riceItems = filterMenuItems(SAMPLE_MENU_ITEMS, 'cat-rice', '');
  assert.ok(riceItems.length >= 1);
  assert.ok(riceItems.every((item) => item.categoryId === 'cat-rice'));
});

test('filterMenuItems filters case-insensitively by name or description', () => {
  const fishMatches = filterMenuItems(SAMPLE_MENU_ITEMS, 'all', 'grilled lake');
  assert.equal(fishMatches.length, 1);
  assert.equal(fishMatches[0]?.id, 'menu-fish-1');

  const noMatches = filterMenuItems(SAMPLE_MENU_ITEMS, 'cat-drinks', 'steak');
  assert.equal(noMatches.length, 0);
});

test('getCategoryName resolves category name or safe fallback', () => {
  assert.equal(getCategoryName(INITIAL_FOOD_CATEGORIES, 'cat-fish'), 'Fish');
  assert.equal(getCategoryName(INITIAL_FOOD_CATEGORIES, 'missing'), 'Menu');
});

test('getMenuAvailabilityLabel returns Available or Stock Out', () => {
  assert.equal(getMenuAvailabilityLabel(true), 'Available');
  assert.equal(getMenuAvailabilityLabel(false), 'Stock Out');
});

test('getMenuPortionPrices returns only positive 1:2 and 1:4 portion entries', () => {
  assert.deepEqual(
    getMenuPortionPrices({ price1_2: 260, price1_4: 480 }),
    [
      { label: '1:2', amount: 260 },
      { label: '1:4', amount: 480 },
    ],
  );
  assert.deepEqual(
    getMenuPortionPrices({ price1_2: 320, price1_4: null }),
    [{ label: '1:2', amount: 320 }],
  );
  assert.deepEqual(
    getMenuPortionPrices({ price1_2: 0, price1_4: undefined }),
    [],
  );
});
