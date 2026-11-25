import type { ContactInfo, RoomType } from '../types';
import { toSafeExternalUrl } from './contactLinks';
import { isSafeImageSource } from './galleryState';
import type { NewMenuItemInput } from './menuState';

export interface ValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly errors: Readonly<Record<string, string>>;
}

export interface MenuFormDraft {
  readonly categoryId: string;
  readonly name: string;
  readonly description: string;
  readonly priceText: string;
  readonly price1_2Text?: string;
  readonly price1_4Text?: string;
  readonly imageUrl: string;
  readonly isAvailable: boolean;
  readonly isFeatured: boolean;
}

export interface RoomFormDraft {
  readonly name: string;
  readonly type: string;
  readonly priceText: string;
  readonly capacityText: string;
  readonly description: string;
  readonly facilitiesText?: string;
  readonly images?: readonly string[];
  readonly isAvailable: boolean;
}

export interface ContactFormDraft {
  readonly address: string;
  readonly phone: string;
  readonly whatsapp: string;
  readonly facebookUrl: string;
  readonly mapEmbedUrl: string;
}

export interface CategoryFormDraft {
  readonly name: string;
  readonly displayOrderText: string;
}

export interface SiteContentFormDraft {
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly restaurantIntro: string;
}

export function validateCategoryForm(
  draft: CategoryFormDraft,
): ValidationResult<{ readonly name: string; readonly displayOrder: number }> {
  const errors: Record<string, string> = {};
  const trimmedName = draft.name.trim();
  const parsedOrder = Number(draft.displayOrderText);

  if (!trimmedName) {
    errors.name = 'Category name is required.';
  }
  if (
    draft.displayOrderText.trim() === '' ||
    !Number.isInteger(parsedOrder) ||
    parsedOrder < 1
  ) {
    errors.displayOrderText = 'Enter a display order of 1 or higher.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    value: {
      name: trimmedName,
      displayOrder: parsedOrder,
    },
  };
}

export function parseFacilitiesText(raw?: string): readonly string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(/[,\n]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function parseOptionalPortionInput(
  rawText: string | undefined,
  label: string,
  fieldKey: string,
  errors: Record<string, string>,
): number | null {
  const trimmed = (rawText ?? '').trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    errors[fieldKey] = `Enter a valid ${label} price greater than 0, or leave blank.`;
    return null;
  }
  return Math.round(parsed);
}

export function validateMenuItemForm(
  draft: MenuFormDraft,
): ValidationResult<NewMenuItemInput> {
  const errors: Record<string, string> = {};
  const trimmedName = draft.name.trim();
  const trimmedDescription = draft.description.trim();
  const trimmedCategory = draft.categoryId.trim();
  const trimmedStandardPrice = draft.priceText.trim();

  if (!trimmedName) {
    errors.name = 'Dish name is required.';
  }
  if (!trimmedCategory) {
    errors.categoryId = 'Please select a food category.';
  }

  const parsedPrice1_2 = parseOptionalPortionInput(
    draft.price1_2Text,
    '1:2 portion',
    'price1_2Text',
    errors,
  );
  const parsedPrice1_4 = parseOptionalPortionInput(
    draft.price1_4Text,
    '1:4 portion',
    'price1_4Text',
    errors,
  );

  let resolvedStandardPrice = 0;
  if (trimmedStandardPrice !== '') {
    const parsedStandard = Number(trimmedStandardPrice);
    if (!Number.isFinite(parsedStandard) || parsedStandard <= 0) {
      errors.priceText = 'Enter a valid standard price greater than 0.';
    } else {
      resolvedStandardPrice = Math.round(parsedStandard);
    }
  } else if (parsedPrice1_2 === null && parsedPrice1_4 === null) {
    errors.priceText =
      'Enter a standard price or at least one portion price (1:2 or 1:4).';
  }

  if (!trimmedDescription) {
    errors.description = 'Add a brief dish description.';
  }

  const trimmedImage = draft.imageUrl.trim();
  if (trimmedImage && !isSafeImageSource(trimmedImage)) {
    errors.imageUrl = 'Use a valid image file, local path (/...), or http/https URL.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    value: {
      categoryId: trimmedCategory,
      name: trimmedName,
      description: trimmedDescription,
      price: resolvedStandardPrice,
      price1_2: parsedPrice1_2,
      price1_4: parsedPrice1_4,
      imageUrl: trimmedImage,
      isAvailable: draft.isAvailable,
      isFeatured: draft.isFeatured,
    },
  };
}

export function validateRoomTypeForm(
  draft: RoomFormDraft,
): ValidationResult<Omit<RoomType, 'id'>> {
  const errors: Record<string, string> = {};
  const trimmedName = draft.name.trim();
  const trimmedType = draft.type.trim();
  const trimmedDescription = draft.description.trim();
  const parsedPrice = Number(draft.priceText);
  const parsedCapacity = Number(draft.capacityText);

  if (!trimmedName) {
    errors.name = 'Room name is required.';
  }
  if (!trimmedType) {
    errors.type = 'Room category label is required.';
  }
  if (
    draft.priceText.trim() === '' ||
    !Number.isFinite(parsedPrice) ||
    parsedPrice <= 0
  ) {
    errors.priceText = 'Enter a valid nightly rate greater than 0.';
  }
  if (
    draft.capacityText.trim() === '' ||
    !Number.isInteger(parsedCapacity) ||
    parsedCapacity <= 0
  ) {
    errors.capacityText = 'Enter a valid guest capacity (1 or more).';
  }
  if (!trimmedDescription) {
    errors.description = 'Room description cannot be empty.';
  }

  const sanitizedImages = (draft.images ?? [])
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
  const invalidImage = sanitizedImages.find((url) => !isSafeImageSource(url));
  if (invalidImage) {
    errors.images = 'One or more room photo URLs are invalid.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const facilities = parseFacilitiesText(draft.facilitiesText);

  return {
    ok: true,
    errors: {},
    value: {
      name: trimmedName,
      type: trimmedType,
      price: Math.round(parsedPrice),
      capacity: parsedCapacity,
      description: trimmedDescription,
      facilities,
      images: sanitizedImages,
      isAvailable: draft.isAvailable,
    },
  };
}

export function validateSiteContentForm(
  draft: SiteContentFormDraft,
): ValidationResult<{
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly restaurantIntro: string;
}> {
  const errors: Record<string, string> = {};
  const heroTitle = draft.heroTitle.trim();
  const heroSubtitle = draft.heroSubtitle.trim();
  const restaurantIntro = draft.restaurantIntro.trim();

  if (!heroTitle) {
    errors.heroTitle = 'Hero headline is required.';
  }
  if (!heroSubtitle) {
    errors.heroSubtitle = 'Hero subtitle is required.';
  }
  if (!restaurantIntro) {
    errors.restaurantIntro = 'Restaurant introduction text is required.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    value: {
      heroTitle,
      heroSubtitle,
      restaurantIntro,
    },
  };
}

export function updateRoomTypeInList(
  rooms: readonly RoomType[],
  id: string,
  updates: Partial<Omit<RoomType, 'id'>>,
): readonly RoomType[] {
  return rooms.map((room) =>
    room.id === id
      ? {
          ...room,
          ...updates,
          name: updates.name !== undefined ? updates.name.trim() : room.name,
          type: updates.type !== undefined ? updates.type.trim() : room.type,
          description:
            updates.description !== undefined
              ? updates.description.trim()
              : room.description,
        }
      : room,
  );
}

export function validateContactInfoForm(
  draft: ContactFormDraft,
): ValidationResult<ContactInfo> {
  const errors: Record<string, string> = {};
  const trimmedAddress = draft.address.trim();
  const trimmedPhone = draft.phone.trim();
  const trimmedWhatsapp = draft.whatsapp.trim();
  const trimmedFacebook = draft.facebookUrl.trim();
  const trimmedMapEmbed = draft.mapEmbedUrl.trim();

  if (!trimmedAddress) {
    errors.address = 'Property address is required.';
  }
  if (!trimmedPhone || trimmedPhone.replace(/[^\d]/g, '').length < 6) {
    errors.phone = 'Enter a valid phone number.';
  }
  if (!trimmedWhatsapp || trimmedWhatsapp.replace(/[^\d]/g, '').length < 6) {
    errors.whatsapp = 'Enter a valid WhatsApp number.';
  }

  const safeFacebook = toSafeExternalUrl(trimmedFacebook);
  if (!safeFacebook) {
    errors.facebookUrl = 'Enter a valid Facebook page URL (https://...).';
  }

  let safeMapEmbed = '';
  if (trimmedMapEmbed) {
    const validatedMap = toSafeExternalUrl(trimmedMapEmbed);
    if (!validatedMap) {
      errors.mapEmbedUrl = 'Enter a valid Google Maps embed URL (https://...).';
    } else {
      safeMapEmbed = validatedMap;
    }
  }

  if (Object.keys(errors).length > 0 || !safeFacebook) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    value: {
      address: trimmedAddress,
      phone: trimmedPhone,
      whatsapp: trimmedWhatsapp,
      facebookUrl: safeFacebook,
      mapEmbedUrl: safeMapEmbed,
    },
  };
}
