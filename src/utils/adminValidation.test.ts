import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_ROOM_TYPES } from '../data/initialData';
import {
  parseFacilitiesText,
  updateRoomTypeInList,
  validateCategoryForm,
  validateContactInfoForm,
  validateMenuItemForm,
  validateRoomTypeForm,
  validateSiteContentForm,
} from './adminValidation';

test('validateMenuItemForm accepts valid dish input and rejects invalid values', () => {
  const valid = validateMenuItemForm({
    categoryId: 'cat-fish',
    name: '  Kaptai Herb Fish  ',
    description: '  Grilled lake fish with herbs  ',
    priceText: '650',
    price1_2Text: '',
    price1_4Text: '',
    imageUrl: '/src/assets/images/menu_grilled_fish_1795589609676.jpg',
    isAvailable: true,
    isFeatured: true,
  });

  assert.equal(valid.ok, true);
  assert.equal(valid.value?.name, 'Kaptai Herb Fish');
  assert.equal(valid.value?.price, 650);
  assert.equal(valid.value?.price1_2, null);
  assert.equal(valid.value?.price1_4, null);

  const portionOnly = validateMenuItemForm({
    categoryId: 'cat-chicken',
    name: 'Hillside Chicken Curry',
    description: 'Served in 1:2 and 1:4 portions',
    priceText: '',
    price1_2Text: '420',
    price1_4Text: '780',
    imageUrl: '',
    isAvailable: true,
    isFeatured: false,
  });

  assert.equal(portionOnly.ok, true);
  assert.equal(portionOnly.value?.price, 0);
  assert.equal(portionOnly.value?.price1_2, 420);
  assert.equal(portionOnly.value?.price1_4, 780);

  const invalid = validateMenuItemForm({
    categoryId: '',
    name: '   ',
    description: '',
    priceText: '',
    price1_2Text: '-50',
    price1_4Text: '0',
    imageUrl: 'javascript:alert(1)',
    isAvailable: true,
    isFeatured: false,
  });

  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.categoryId);
  assert.ok(invalid.errors.priceText);
  assert.ok(invalid.errors.price1_2Text);
  assert.ok(invalid.errors.price1_4Text);
  assert.ok(invalid.errors.description);
  assert.ok(invalid.errors.imageUrl);
});

test('validateRoomTypeForm and updateRoomTypeInList validate and update cottage pricing', () => {
  const valid = validateRoomTypeForm({
    name: 'Non-AC Single',
    type: 'Non-AC Single',
    priceText: '3200',
    capacityText: '1',
    description: 'Peaceful hillside room.',
    isAvailable: false,
  });

  assert.equal(valid.ok, true);
  assert.equal(valid.value?.price, 3200);
  assert.equal(valid.value?.isAvailable, false);

  const updated = updateRoomTypeInList(
    INITIAL_ROOM_TYPES,
    'room-non-ac-single',
    valid.value!,
  );
  assert.equal(
    updated.find((room) => room.id === 'room-non-ac-single')?.price,
    3200,
  );
  assert.equal(
    updated.find((room) => room.id === 'room-non-ac-single')?.isAvailable,
    false,
  );
});

test('validateContactInfoForm enforces valid phone, WhatsApp, and safe https URLs', () => {
  const valid = validateContactInfoForm({
    address: 'Pagoda Road, Opposite Assambosti Govt. Primary School, Rangamati, Bangladesh',
    phone: '+8801550050641',
    whatsapp: '+8801550050641',
    facebookUrl: 'https://www.facebook.com/gangsabarang',
    mapEmbedUrl: '',
  });

  assert.equal(valid.ok, true);
  assert.equal(valid.value?.facebookUrl, 'https://www.facebook.com/gangsabarang');

  const invalid = validateContactInfoForm({
    address: '',
    phone: '123',
    whatsapp: '',
    facebookUrl: 'ftp://example.com',
    mapEmbedUrl: 'javascript:void(0)',
  });

  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.address);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.whatsapp);
  assert.ok(invalid.errors.facebookUrl);
  assert.ok(invalid.errors.mapEmbedUrl);
});

test('validateCategoryForm and parseFacilitiesText normalize inputs cleanly', () => {
  const validCat = validateCategoryForm({
    name: '  Hillside Tea  ',
    displayOrderText: '8',
  });
  assert.equal(validCat.ok, true);
  assert.deepEqual(validCat.value, { name: 'Hillside Tea', displayOrder: 8 });

  const invalidCat = validateCategoryForm({
    name: '',
    displayOrderText: '0',
  });
  assert.equal(invalidCat.ok, false);
  assert.ok(invalidCat.errors.name);
  assert.ok(invalidCat.errors.displayOrderText);

  assert.deepEqual(
    parseFacilitiesText('River View, Private Balcony\nComplimentary Wi-Fi , '),
    ['River View', 'Private Balcony', 'Complimentary Wi-Fi'],
  );
});

test('validateSiteContentForm requires non-empty hero and intro fields', () => {
  const valid = validateSiteContentForm({
    heroTitle: '  Welcome to Gang Sabarang  ',
    heroSubtitle: '  Tranquil dining and cottages  ',
    restaurantIntro: '  Nestled along Pagoda Road  ',
  });
  assert.equal(valid.ok, true);
  assert.equal(valid.value?.heroTitle, 'Welcome to Gang Sabarang');

  const invalid = validateSiteContentForm({
    heroTitle: '',
    heroSubtitle: '   ',
    restaurantIntro: '',
  });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.heroTitle);
  assert.ok(invalid.errors.heroSubtitle);
  assert.ok(invalid.errors.restaurantIntro);
});

