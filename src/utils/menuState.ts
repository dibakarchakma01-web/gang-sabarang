import type { MenuItem } from '../types';

export type NewMenuItemInput = Omit<MenuItem, 'id'> & {
  readonly id?: string;
};

export type MenuItemUpdates = Partial<Omit<MenuItem, 'id'>>;

export function createMenuItemId(
  name: string,
  existingItems: readonly MenuItem[],
): string {
  const existingIds = new Set(existingItems.map((item) => item.id));
  const slug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'dish';

  const baseId = `menu-${slug}`;
  if (!existingIds.has(baseId)) {
    return baseId;
  }

  let suffix = 2;
  while (existingIds.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }
  return `${baseId}-${suffix}`;
}

function normalizeOptionalPortionPrice(
  value: number | null | undefined,
): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  return null;
}

export function addMenuItemToList(
  items: readonly MenuItem[],
  input: NewMenuItemInput,
): { readonly items: readonly MenuItem[]; readonly created: MenuItem } {
  const candidateId = input.id?.trim();
  const id =
    candidateId && !items.some((item) => item.id === candidateId)
      ? candidateId
      : createMenuItemId(input.name, items);

  const created: MenuItem = {
    id,
    categoryId: input.categoryId,
    name: input.name.trim(),
    description: input.description.trim(),
    price: Number.isFinite(input.price) ? Math.max(0, input.price) : 0,
    price1_2: normalizeOptionalPortionPrice(input.price1_2),
    price1_4: normalizeOptionalPortionPrice(input.price1_4),
    imageUrl: input.imageUrl.trim(),
    isAvailable: input.isAvailable,
    isFeatured: input.isFeatured,
  };

  return {
    items: [...items, created],
    created,
  };
}

export function updateMenuItemInList(
  items: readonly MenuItem[],
  id: string,
  updates: MenuItemUpdates,
): readonly MenuItem[] {
  return items.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      ...updates,
      name: updates.name !== undefined ? updates.name.trim() : item.name,
      description:
        updates.description !== undefined
          ? updates.description.trim()
          : item.description,
      imageUrl:
        updates.imageUrl !== undefined ? updates.imageUrl.trim() : item.imageUrl,
      price:
        updates.price !== undefined && Number.isFinite(updates.price)
          ? Math.max(0, updates.price)
          : item.price,
      price1_2:
        updates.price1_2 !== undefined
          ? normalizeOptionalPortionPrice(updates.price1_2)
          : item.price1_2 ?? null,
      price1_4:
        updates.price1_4 !== undefined
          ? normalizeOptionalPortionPrice(updates.price1_4)
          : item.price1_4 ?? null,
    };
  });
}

export function deleteMenuItemFromList(
  items: readonly MenuItem[],
  id: string,
): readonly MenuItem[] {
  return items.filter((item) => item.id !== id);
}

export function toggleMenuItemAvailabilityInList(
  items: readonly MenuItem[],
  id: string,
): readonly MenuItem[] {
  return items.map((item) =>
    item.id === id ? { ...item, isAvailable: !item.isAvailable } : item,
  );
}

export function toggleMenuItemFeaturedInList(
  items: readonly MenuItem[],
  id: string,
): readonly MenuItem[] {
  return items.map((item) =>
    item.id === id ? { ...item, isFeatured: !item.isFeatured } : item,
  );
}
