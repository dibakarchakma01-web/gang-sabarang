import type { GalleryCategory, GalleryItem } from '../types';
import type { ValidationResult } from './adminValidation';
import { toSafeExternalUrl } from './contactLinks';

export const GALLERY_CATEGORY_OPTIONS: readonly GalleryCategory[] = [
  'Restaurant',
  'Food',
  'Cottage',
  'Nature',
  'Events',
] as const;

export type NewGalleryItemInput = Omit<GalleryItem, 'id'> & {
  readonly id?: string;
};

export interface GalleryFormDraft {
  readonly title: string;
  readonly category: GalleryCategory;
  readonly imageUrl: string;
}

const SAFE_DATA_IMAGE_REGEX =
  /^data:image\/(png|jpeg|jpg|webp|gif|avif);base64,[a-z0-9+/=]+$/i;

export function isSafeImageSource(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith('/')) {
    return true;
  }

  if (SAFE_DATA_IMAGE_REGEX.test(trimmed)) {
    return true;
  }

  return toSafeExternalUrl(trimmed) !== null;
}

export function createGalleryItemId(
  title: string,
  existingItems: readonly GalleryItem[],
): string {
  const existingIds = new Set(existingItems.map((item) => item.id));
  const slug =
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'photo';

  const baseId = `gallery-${slug}`;
  if (!existingIds.has(baseId)) {
    return baseId;
  }

  let suffix = 2;
  while (existingIds.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }
  return `${baseId}-${suffix}`;
}

export function addGalleryItemToList(
  items: readonly GalleryItem[],
  input: NewGalleryItemInput,
): { readonly items: readonly GalleryItem[]; readonly created: GalleryItem } {
  const candidateId = input.id?.trim();
  const id =
    candidateId && !items.some((item) => item.id === candidateId)
      ? candidateId
      : createGalleryItemId(input.title, items);

  const created: GalleryItem = {
    id,
    title: input.title.trim(),
    category: input.category,
    imageUrl: input.imageUrl.trim(),
  };

  return {
    items: [created, ...items],
    created,
  };
}

export function deleteGalleryItemFromList(
  items: readonly GalleryItem[],
  id: string,
): readonly GalleryItem[] {
  return items.filter((item) => item.id !== id);
}

export function validateGalleryItemForm(
  draft: GalleryFormDraft,
): ValidationResult<NewGalleryItemInput> {
  const errors: Record<string, string> = {};
  const trimmedTitle = draft.title.trim();
  const trimmedImage = draft.imageUrl.trim();

  if (!trimmedTitle) {
    errors.title = 'Photo title is required.';
  }
  if (!GALLERY_CATEGORY_OPTIONS.includes(draft.category)) {
    errors.category = 'Select a valid gallery category.';
  }
  if (!trimmedImage) {
    errors.imageUrl = 'Choose an image file or paste an image URL.';
  } else if (!isSafeImageSource(trimmedImage)) {
    errors.imageUrl =
      'Provide a valid image file, local path (/...), or http/https image URL.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    value: {
      title: trimmedTitle,
      category: draft.category,
      imageUrl: trimmedImage,
    },
  };
}
