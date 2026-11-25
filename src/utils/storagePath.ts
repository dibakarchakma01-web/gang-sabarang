export type MediaUploadFolder = 'menu' | 'gallery' | 'cottages';

const ALLOWED_MEDIA_FOLDERS: ReadonlySet<MediaUploadFolder> = new Set([
  'menu',
  'gallery',
  'cottages',
]);

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export interface ImageFileValidationResult {
  readonly ok: boolean;
  readonly error?: string;
}

export function validateUploadImageFile(
  file: Pick<File, 'name' | 'type' | 'size'>,
): ImageFileValidationResult {
  if (!file.type || !file.type.startsWith('image/')) {
    return {
      ok: false,
      error: 'Please select a valid image file (JPG, PNG, or WebP).',
    };
  }

  if (file.size <= 0) {
    return {
      ok: false,
      error: 'The selected image file appears to be empty.',
    };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: 'Please select an image smaller than 8 MB.',
    };
  }

  return { ok: true };
}

export function buildSafeStoragePath(
  folder: MediaUploadFolder,
  originalFileName: string,
  timestampMs: number = Date.now(),
  randomSuffix: string = Math.random().toString(36).slice(2, 8),
): string {
  if (!ALLOWED_MEDIA_FOLDERS.has(folder)) {
    throw new Error('Invalid storage folder.');
  }

  const trimmedName = originalFileName.trim();
  const dotIndex = trimmedName.lastIndexOf('.');
  const rawBase = dotIndex > 0 ? trimmedName.slice(0, dotIndex) : trimmedName;
  const rawExt = dotIndex > 0 ? trimmedName.slice(dotIndex + 1) : 'jpg';

  const safeBase =
    rawBase
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image';

  const safeExt =
    rawExt.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6) || 'jpg';

  const safeSuffix =
    randomSuffix.toLowerCase().replace(/[^a-z0-9]/g, '') || 'media';

  return `${folder}/${timestampMs}-${safeSuffix}-${safeBase}.${safeExt}`;
}
