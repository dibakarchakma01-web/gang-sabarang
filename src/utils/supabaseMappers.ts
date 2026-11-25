import {
  INITIAL_CONTACT_INFO,
  INITIAL_ROOM_TYPES,
  INITIAL_SITE_CONTENT,
  BRAND_IMAGES,
} from '../data/initialData';
import type {
  ContactInfo,
  FoodCategory,
  GalleryCategory,
  GalleryItem,
  MenuItem,
  RoomType,
  SiteContent,
} from '../types';
import { GALLERY_CATEGORY_OPTIONS, isSafeImageSource } from './galleryState';
import type { MenuItemUpdates, NewMenuItemInput } from './menuState';

export interface DbFoodCategoryRow {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly display_order: number | null;
}

export interface DbMenuItemRow {
  readonly id: string;
  readonly category_id: string;
  readonly name: string;
  readonly description: string | null;
  readonly price: number | string | null;
  readonly price_1_2?: number | string | null;
  readonly price_1_4?: number | string | null;
  readonly image_url: string | null;
  readonly is_available: boolean | null;
  readonly is_featured: boolean | null;
}

export interface DbRoomTypeRow {
  readonly id: string;
  readonly name: string;
  readonly type: string | null;
  readonly price: number | string;
  readonly description: string | null;
  readonly facilities: readonly string[] | null;
  readonly capacity: number | string | null;
  readonly images: readonly string[] | null;
  readonly is_available: boolean | null;
}

export interface DbGalleryImageRow {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly image_url: string;
  readonly created_at?: string | null;
}

export interface DbContactSettingsRow {
  readonly id: number;
  readonly address: string | null;
  readonly phone: string | null;
  readonly whatsapp: string | null;
  readonly facebook_url: string | null;
  readonly map_embed_url: string | null;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value.trim());
}

export function mapFoodCategoryRow(row: DbFoodCategoryRow): FoodCategory {
  return {
    id: String(row.id),
    name: String(row.name ?? '').trim() || 'Category',
    slug: String(row.slug ?? '').trim() || 'category',
    displayOrder: Number.isFinite(Number(row.display_order))
      ? Number(row.display_order)
      : 0,
  };
}

function parseOptionalPositivePrice(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function normalizeOptionalPricePayload(
  value: number | null | undefined,
): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  return null;
}

export function mapMenuItemRow(row: DbMenuItemRow): MenuItem {
  const numericPrice = Number(row.price ?? 0);
  const rawImage = typeof row.image_url === 'string' ? row.image_url.trim() : '';

  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    name: String(row.name ?? '').trim() || 'Untitled Dish',
    description:
      typeof row.description === 'string' ? row.description.trim() : '',
    price: Number.isFinite(numericPrice) ? Math.max(0, numericPrice) : 0,
    price1_2: parseOptionalPositivePrice(row.price_1_2),
    price1_4: parseOptionalPositivePrice(row.price_1_4),
    imageUrl: rawImage && isSafeImageSource(rawImage) ? rawImage : '',
    isAvailable: row.is_available ?? true,
    isFeatured: row.is_featured ?? false,
  };
}

export function toMenuItemInsertPayload(input: NewMenuItemInput) {
  return {
    category_id: input.categoryId,
    name: input.name.trim(),
    description: input.description.trim(),
    price: Number.isFinite(input.price) ? Math.max(0, Math.round(input.price)) : 0,
    price_1_2: normalizeOptionalPricePayload(input.price1_2),
    price_1_4: normalizeOptionalPricePayload(input.price1_4),
    image_url: input.imageUrl.trim(),
    is_available: input.isAvailable,
    is_featured: input.isFeatured,
  };
}

export function toMenuItemUpdatePayload(updates: MenuItemUpdates) {
  const payload: Record<string, unknown> = {};
  if (updates.categoryId !== undefined) {
    payload.category_id = updates.categoryId;
  }
  if (updates.name !== undefined) {
    payload.name = updates.name.trim();
  }
  if (updates.description !== undefined) {
    payload.description = updates.description.trim();
  }
  if (updates.price !== undefined && Number.isFinite(updates.price)) {
    payload.price = Math.max(0, Math.round(updates.price));
  }
  if (updates.price1_2 !== undefined) {
    payload.price_1_2 = normalizeOptionalPricePayload(updates.price1_2);
  }
  if (updates.price1_4 !== undefined) {
    payload.price_1_4 = normalizeOptionalPricePayload(updates.price1_4);
  }
  if (updates.imageUrl !== undefined) {
    payload.image_url = updates.imageUrl.trim();
  }
  if (updates.isAvailable !== undefined) {
    payload.is_available = updates.isAvailable;
  }
  if (updates.isFeatured !== undefined) {
    payload.is_featured = updates.isFeatured;
  }
  return payload;
}

export function alignFallbackMenuCategories(
  fallbackItems: readonly MenuItem[],
  categories: readonly FoodCategory[],
): readonly MenuItem[] {
  const slugToCategoryId = new Map<string, string>();
  for (const category of categories) {
    slugToCategoryId.set(category.slug.toLowerCase(), category.id);
  }

  return fallbackItems.map((item) => {
    const slugFromPlaceholder = item.categoryId.replace(/^cat-/, '').toLowerCase();
    const mappedId = slugToCategoryId.get(slugFromPlaceholder);
    return mappedId ? { ...item, categoryId: mappedId } : item;
  });
}

export function parseRoomCapacity(value: number | string | null | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  if (typeof value === 'string') {
    const match = value.match(/\d+/);
    if (match) {
      const parsed = Number(match[0]);
      if (Number.isFinite(parsed) && parsed > 0) {
        return Math.round(parsed);
      }
    }
  }
  return 1;
}

export function formatRoomCapacity(capacity: number): string {
  const safeCount =
    Number.isFinite(capacity) && capacity > 0 ? Math.round(capacity) : 1;
  return safeCount === 1 ? '1 Guest' : `${safeCount} Guests`;
}

export function mapRoomTypeRow(
  row: DbRoomTypeRow,
  fallbackRooms: readonly RoomType[] = INITIAL_ROOM_TYPES,
): RoomType {
  const numericPrice = Number(row.price);
  const parsedCapacity = parseRoomCapacity(row.capacity);
  const roomTypeLabel =
    typeof row.type === 'string' && row.type.trim()
      ? row.type.trim()
      : String(row.name ?? '').trim() || 'Cottage';

  const matchingFallback = fallbackRooms.find(
    (item) =>
      item.type.toLowerCase() === roomTypeLabel.toLowerCase() ||
      item.name.toLowerCase() === String(row.name ?? '').trim().toLowerCase(),
  );

  const rawFacilities = Array.isArray(row.facilities)
    ? row.facilities.filter((f): f is string => typeof f === 'string' && f.trim().length > 0)
    : [];

  const facilities =
    rawFacilities.length > 0
      ? rawFacilities
      : matchingFallback?.facilities ?? [
          `${formatRoomCapacity(parsedCapacity)} · Details confirmed upon inquiry`,
        ];

  const rawImages = Array.isArray(row.images)
    ? row.images.filter(
        (img): img is string => typeof img === 'string' && isSafeImageSource(img),
      )
    : [];

  const images =
    rawImages.length > 0
      ? rawImages
      : matchingFallback?.images ?? [BRAND_IMAGES.cottage, BRAND_IMAGES.nature];

  return {
    id: String(row.id),
    name: String(row.name ?? '').trim() || roomTypeLabel,
    type: roomTypeLabel,
    price: Number.isFinite(numericPrice) ? Math.max(0, numericPrice) : 0,
    description:
      typeof row.description === 'string' ? row.description.trim() : '',
    facilities,
    capacity: parsedCapacity,
    images,
    isAvailable: row.is_available ?? true,
  };
}

export function toRoomTypeUpdatePayload(
  updates: Partial<Omit<RoomType, 'id'>>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) {
    payload.name = updates.name.trim();
  }
  if (updates.type !== undefined) {
    payload.type = updates.type.trim();
  }
  if (updates.price !== undefined && Number.isFinite(updates.price)) {
    payload.price = Math.max(0, Math.round(updates.price));
  }
  if (updates.description !== undefined) {
    payload.description = updates.description.trim();
  }
  if (updates.capacity !== undefined) {
    payload.capacity = formatRoomCapacity(updates.capacity);
  }
  if (updates.facilities !== undefined) {
    payload.facilities = [...updates.facilities];
  }
  if (updates.images !== undefined) {
    payload.images = [...updates.images];
  }
  if (updates.isAvailable !== undefined) {
    payload.is_available = updates.isAvailable;
  }
  return payload;
}

function normalizeGalleryCategory(raw: string): GalleryCategory {
  const match = GALLERY_CATEGORY_OPTIONS.find(
    (category) => category.toLowerCase() === raw.trim().toLowerCase(),
  );
  return match ?? 'Restaurant';
}

export function mapGalleryImageRow(row: DbGalleryImageRow): GalleryItem {
  const rawImage = typeof row.image_url === 'string' ? row.image_url.trim() : '';
  return {
    id: String(row.id),
    title: String(row.title ?? '').trim() || 'Gang Sabarang Photo',
    category: normalizeGalleryCategory(String(row.category ?? 'Restaurant')),
    imageUrl: rawImage && isSafeImageSource(rawImage) ? rawImage : '',
  };
}

export function mapContactSettingsRow(
  row: DbContactSettingsRow | null | undefined,
): ContactInfo {
  if (!row) {
    return INITIAL_CONTACT_INFO;
  }
  return {
    address: row.address?.trim() || INITIAL_CONTACT_INFO.address,
    phone: row.phone?.trim() || INITIAL_CONTACT_INFO.phone,
    whatsapp: row.whatsapp?.trim() || INITIAL_CONTACT_INFO.whatsapp,
    facebookUrl: row.facebook_url?.trim() || INITIAL_CONTACT_INFO.facebookUrl,
    mapEmbedUrl: row.map_embed_url?.trim() || '',
  };
}

export function toContactSettingsUpsertPayload(info: ContactInfo) {
  return {
    id: 1,
    address: info.address.trim(),
    phone: info.phone.trim(),
    whatsapp: info.whatsapp.trim(),
    facebook_url: info.facebookUrl.trim(),
    map_embed_url: info.mapEmbedUrl.trim() || null,
    updated_at: new Date().toISOString(),
  };
}

export interface DbSiteContentRow {
  readonly id: number;
  readonly hero_title: string | null;
  readonly hero_subtitle: string | null;
  readonly restaurant_intro: string | null;
}

export function mapSiteContentRow(
  row: DbSiteContentRow | null | undefined,
): SiteContent {
  if (!row) {
    return INITIAL_SITE_CONTENT;
  }
  return {
    heroTitle: row.hero_title?.trim() || INITIAL_SITE_CONTENT.heroTitle,
    heroSubtitle:
      row.hero_subtitle?.trim() || INITIAL_SITE_CONTENT.heroSubtitle,
    restaurantIntro:
      row.restaurant_intro?.trim() || INITIAL_SITE_CONTENT.restaurantIntro,
  };
}

export function toSiteContentUpsertPayload(content: SiteContent) {
  return {
    id: 1,
    hero_title: content.heroTitle.trim(),
    hero_subtitle: content.heroSubtitle.trim(),
    restaurant_intro: content.restaurantIntro.trim(),
    updated_at: new Date().toISOString(),
  };
}

export function createCategorySlug(
  name: string,
  existingCategories: readonly FoodCategory[],
  ignoreCategoryId?: string,
): string {
  const existingSlugs = new Set(
    existingCategories
      .filter((category) => category.id !== ignoreCategoryId)
      .map((category) => category.slug.toLowerCase()),
  );

  const baseSlug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'category';

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (existingSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }
  return `${baseSlug}-${suffix}`;
}

export function toRoomTypeInsertPayload(room: Omit<RoomType, 'id'>) {
  return {
    name: room.name.trim(),
    type: room.type.trim(),
    price: Number.isFinite(room.price) ? Math.max(0, Math.round(room.price)) : 0,
    description: room.description.trim(),
    facilities: [...room.facilities],
    capacity: formatRoomCapacity(room.capacity),
    images: [...room.images],
    is_available: room.isAvailable,
  };
}

