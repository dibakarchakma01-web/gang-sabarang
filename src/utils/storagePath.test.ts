import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSafeStoragePath, validateUploadImageFile } from './storagePath';

test('validateUploadImageFile rejects non-images and oversized files', () => {
  assert.equal(
    validateUploadImageFile({
      name: 'script.js',
      type: 'application/javascript',
      size: 1024,
    }).ok,
    false,
  );

  assert.equal(
    validateUploadImageFile({
      name: 'huge.jpg',
      type: 'image/jpeg',
      size: 10 * 1024 * 1024,
    }).ok,
    false,
  );

  assert.equal(
    validateUploadImageFile({
      name: 'dish.jpg',
      type: 'image/jpeg',
      size: 400_000,
    }).ok,
    true,
  );
});

test('buildSafeStoragePath prevents path traversal and builds sanitized storage keys', () => {
  const path = buildSafeStoragePath(
    'gallery',
    '../../Sunset Over Kaptai!!.JPG',
    1700000000000,
    'abc123',
  );
  assert.equal(
    path,
    'gallery/1700000000000-abc123-sunset-over-kaptai.jpg',
  );
});
