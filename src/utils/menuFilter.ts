import type { FoodCategory, MenuItem } from '../types';

export function sortMenuItemsByAvailability(
  items: readonly MenuItem[],
): readonly MenuItem[] {
  const available: MenuItem[] = [];
  const unavailable: MenuItem[] = [];

  for (const item of items) {
    if (item.isAvailable) {
      available.push(item);
    } else {
      unavailable.push(item);
    }
  }

  return [...available, ...unavailable];
}

export function filterMenuItems(
  items: readonly MenuItem[],
  selectedCategoryId: string,
  searchQuery: string,
): readonly MenuItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const matchesCategory =
      selectedCategoryId === 'all' || item.categoryId === selectedCategoryId;

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery)
    );
  });

  return sortMenuItemsByAvailability(filtered);
}

export function getFeaturedMenuItems(
  items: readonly MenuItem[],
  limit?: number,
): readonly MenuItem[] {
  const featured = sortMenuItemsByAvailability(
    items.filter((item) => item.isFeatured),
  );

  if (typeof limit === 'number' && limit >= 0) {
    return featured.slice(0, limit);
  }

  return featured;
}

export function getCategoryName(
  categories: readonly FoodCategory[],
  categoryId: string,
): string {
  const found = categories.find((category) => category.id === categoryId);
  return found ? found.name : 'Menu';
}

export function getMenuAvailabilityLabel(
  isAvailable: boolean,
): 'Available' | 'Stock Out' {
  return isAvailable ? 'Available' : 'Stock Out';
}

export interface MenuPortionPrice {
  readonly label: '1:2' | '1:4';
  readonly amount: number;
}

export function getMenuPortionPrices(
  item: Pick<MenuItem, 'price1_2' | 'price1_4'>,
): readonly MenuPortionPrice[] {
  const portions: MenuPortionPrice[] = [];
  if (
    typeof item.price1_2 === 'number' &&
    Number.isFinite(item.price1_2) &&
    item.price1_2 > 0
  ) {
    portions.push({ label: '1:2', amount: item.price1_2 });
  }
  if (
    typeof item.price1_4 === 'number' &&
    Number.isFinite(item.price1_4) &&
    item.price1_4 > 0
  ) {
    portions.push({ label: '1:4', amount: item.price1_4 });
  }
  return portions;
}
