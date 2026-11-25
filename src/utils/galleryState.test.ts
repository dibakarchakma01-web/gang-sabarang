import test from 'node:test';
import assert from 'node:assert/strict';
import type { GalleryItem } from '../types';
import {
  addGalleryItemToList,
  deleteGalleryItemFromList,
  isSafeImageSource,
  validateGalleryItemForm,
} from './galleryState';

const SAMPLE_GALLERY_ITEMS: readonly GalleryItem[] = [
  {
    id: 'gallery-sunset',
    title: 'Kaptai Sunset',
    category: 'Nature',
    imageUrl: '/img/sunset.jpg',
  },
];

test('isSafeImageSource accepts asset paths, https URLs, and safe raster data URLs while rejecting unsafe schemes', () => {
  assert.equal(
    isSafeImageSource('/src/assets/images/hero_gang_sabarang_1795586941968.jpg'),
    true,
  );
  assert.equal(isSafeImageSource('https://example.com/photo.jpg'), true);
  assert.equal(
    isSafeImageSource('data:image/png;base64,iVBORw0KGgoAAAANSUhEUg=='),
    true,
  );
  assert.equal(isSafeImageSource('javascript:alert(1)'), false);
  assert.equal(
    isSafeImageSource('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='),
    false,
  );
});

test('validateGalleryItemForm rejects empty fields and accepts valid title, category, and image', () => {
  const invalid = validateGalleryItemForm({
    title: '  ',
    category: 'Nature',
    imageUrl: '',
  });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.title);
  assert.ok(invalid.errors.imageUrl);

  const valid = validateGalleryItemForm({
    title: '  Kaptai Sunset Pier  ',
    category: 'Nature',
    imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
  });
  assert.equal(valid.ok, true);
  assert.equal(valid.value?.title, 'Kaptai Sunset Pier');
  assert.equal(valid.value?.category, 'Nature');
});

test('addGalleryItemToList prepends new photo and deleteGalleryItemFromList removes by id', () => {
  const added = addGalleryItemToList(SAMPLE_GALLERY_ITEMS, {
    title: 'Morning Mist Veranda',
    category: 'Cottage',
    imageUrl: '/src/assets/images/cottage_nature_retreat_1795586943481.jpg',
  });

  assert.equal(added.items.length, SAMPLE_GALLERY_ITEMS.length + 1);
  assert.equal(added.items[0]?.id, 'gallery-morning-mist-veranda');
  assert.equal(added.created.title, 'Morning Mist Veranda');

  const removed = deleteGalleryItemFromList(
    added.items,
    'gallery-morning-mist-veranda',
  );
  assert.equal(removed.length, SAMPLE_GALLERY_ITEMS.length);
  assert.equal(
    removed.some((item) => item.id === 'gallery-morning-mist-veranda'),
    false,
  );
});
