import test from 'node:test';
import assert from 'node:assert/strict';
import {
  alignFallbackMenuCategories,
  formatRoomCapacity,
  isUuid,
  mapContactSettingsRow,
  mapFoodCategoryRow,
  mapGalleryImageRow,
  mapMenuItemRow,
  mapRoomTypeRow,
  parseRoomCapacity,
  toContactSettingsUpsertPayload,
  toMenuItemInsertPayload,
  toMenuItemUpdatePayload,
  createCategorySlug,
  mapSiteContentRow,
  toSiteContentUpsertPayload,
  toRoomTypeInsertPayload,
} from './supabaseMappers';
import { INITIAL_MENU_ITEMS } from '../data/initialData';

test('isUuid validates standard v1-v5 UUID strings only', () => {
  assert.equal(isUuid('e745e81d-1eab-46c1-a888-802e0b519494'), true);
  assert.equal(isUuid('menu-rice-1'), false);
  assert.equal(isUuid('gallery-placeholder-food'), false);
});

test('mapMenuItemRow and toMenuItemInsertPayload map snake_case and camelCase cleanly', () => {
  const mapped = mapMenuItemRow({
    id: 'e745e81d-1eab-46c1-a888-802e0b519494',
    category_id: '7e76dfe6-b43e-48c1-9574-2ffadc8674ca',
    name: '  Bamboo Rice  ',
    description: 'Steamed in tender bamboo',
    price: '260',
    price_1_2: '260',
    price_1_4: 480,
    image_url: 'https://example.com/rice.jpg',
    is_available: true,
    is_featured: false,
  });

  assert.equal(mapped.categoryId, '7e76dfe6-b43e-48c1-9574-2ffadc8674ca');
  assert.equal(mapped.name, 'Bamboo Rice');
  assert.equal(mapped.price, 260);
  assert.equal(mapped.price1_2, 260);
  assert.equal(mapped.price1_4, 480);
  assert.equal(mapped.imageUrl, 'https://example.com/rice.jpg');
  assert.equal(mapped.isAvailable, true);
  assert.equal(mapped.isFeatured, false);

  const singleOnly = mapMenuItemRow({
    id: 'e745e81d-1eab-46c1-a888-802e0b519495',
    category_id: '7e76dfe6-b43e-48c1-9574-2ffadc8674ca',
    name: 'Citrus Cooler',
    description: 'Chilled citrus drink',
    price: 180,
    price_1_2: null,
    price_1_4: 0,
    image_url: null,
    is_available: true,
    is_featured: false,
  });
  assert.equal(singleOnly.price1_2, null);
  assert.equal(singleOnly.price1_4, null);

  const payload = toMenuItemInsertPayload({
    categoryId: mapped.categoryId,
    name: mapped.name,
    description: mapped.description,
    price: 260.4,
    price1_2: 260,
    price1_4: null,
    imageUrl: mapped.imageUrl,
    isAvailable: true,
    isFeatured: true,
  });
  assert.deepEqual(payload, {
    category_id: '7e76dfe6-b43e-48c1-9574-2ffadc8674ca',
    name: 'Bamboo Rice',
    description: 'Steamed in tender bamboo',
    price: 260,
    price_1_2: 260,
    price_1_4: null,
    image_url: 'https://example.com/rice.jpg',
    is_available: true,
    is_featured: true,
  });

  const updatePayload = toMenuItemUpdatePayload({
    price1_2: null,
    price1_4: 520.6,
  });
  assert.deepEqual(updatePayload, {
    price_1_2: null,
    price_1_4: 521,
  });
});

test('alignFallbackMenuCategories maps placeholder categoryIds to live Supabase UUIDs by slug', () => {
  const liveCategories = [
    mapFoodCategoryRow({
      id: 'uuid-rice',
      name: 'Rice',
      slug: 'rice',
      display_order: 1,
    }),
    mapFoodCategoryRow({
      id: 'uuid-fish',
      name: 'Fish',
      slug: 'fish',
      display_order: 3,
    }),
  ];

  const aligned = alignFallbackMenuCategories(INITIAL_MENU_ITEMS, liveCategories);
  const riceDish = aligned.find((item) => item.id === 'menu-rice-1');
  const fishDish = aligned.find((item) => item.id === 'menu-fish-1');

  assert.equal(riceDish?.categoryId, 'uuid-rice');
  assert.equal(fishDish?.categoryId, 'uuid-fish');
});

test('parseRoomCapacity and mapRoomTypeRow handle text capacities and empty DB media arrays', () => {
  assert.equal(parseRoomCapacity('1 Guest'), 1);
  assert.equal(parseRoomCapacity('2 Guests'), 2);
  assert.equal(parseRoomCapacity(4), 4);
  assert.equal(formatRoomCapacity(1), '1 Guest');
  assert.equal(formatRoomCapacity(2), '2 Guests');

  const mapped = mapRoomTypeRow({
    id: '218f4a2d-c571-4eee-bb70-120a426154dd',
    name: 'Non-AC Single Cottage',
    type: 'Non-AC Single',
    price: 3000,
    description: 'Peaceful single accommodation surrounded by nature.',
    facilities: [],
    capacity: '1 Guest',
    images: [],
    is_available: true,
  });

  assert.equal(mapped.capacity, 1);
  assert.equal(mapped.price, 3000);
  assert.ok(mapped.images.length > 0);
  assert.ok(mapped.facilities.length > 0);
});

test('mapGalleryImageRow and mapContactSettingsRow handle safe URLs and nullable map_embed_url', () => {
  const gallery = mapGalleryImageRow({
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Hillside View',
    category: 'Nature',
    image_url: 'https://cdn.example.com/hill.jpg',
  });
  assert.equal(gallery.category, 'Nature');
  assert.equal(gallery.imageUrl, 'https://cdn.example.com/hill.jpg');

  const contact = mapContactSettingsRow({
    id: 1,
    address: 'Pagoda Road, Rangamati',
    phone: '+8801550050641',
    whatsapp: '+8801550050641',
    facebook_url: 'https://www.facebook.com/gangsabarang',
    map_embed_url: null,
  });
  assert.equal(contact.mapEmbedUrl, '');

  const upsert = toContactSettingsUpsertPayload(contact);
  assert.equal(upsert.id, 1);
  assert.equal(upsert.map_embed_url, null);
});

test('mapSiteContentRow, toSiteContentUpsertPayload, createCategorySlug, and toRoomTypeInsertPayload work accurately', () => {
  const mappedSite = mapSiteContentRow({
    id: 1,
    hero_title: '  Where Tranquil Waters Meet  ',
    hero_subtitle: '  Peaceful nature cottages  ',
    restaurant_intro: '  Fresh local flavors  ',
  });
  assert.equal(mappedSite.heroTitle, 'Where Tranquil Waters Meet');
  assert.equal(mappedSite.restaurantIntro, 'Fresh local flavors');

  const upsertSite = toSiteContentUpsertPayload(mappedSite);
  assert.equal(upsertSite.id, 1);
  assert.equal(upsertSite.hero_title, 'Where Tranquil Waters Meet');

  const slug = createCategorySlug('Hillside Tea', [
    { id: '1', name: 'Hillside Tea', slug: 'hillside-tea', displayOrder: 1 },
  ]);
  assert.equal(slug, 'hillside-tea-2');

  const roomPayload = toRoomTypeInsertPayload({
    name: 'Lakeview Cottage',
    type: 'AC Double',
    price: 7500,
    description: 'Calm view over Kaptai.',
    facilities: ['Balcony', 'AC'],
    capacity: 2,
    images: ['https://cdn.example.com/room.jpg'],
    isAvailable: true,
  });
  assert.equal(roomPayload.capacity, '2 Guests');
  assert.deepEqual(roomPayload.facilities, ['Balcony', 'AC']);
  assert.deepEqual(roomPayload.images, ['https://cdn.example.com/room.jpg']);
});

