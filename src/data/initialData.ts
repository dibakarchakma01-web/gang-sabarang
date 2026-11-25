import type {
  ContactInfo,
  FoodCategory,
  GalleryItem,
  MenuItem,
  RoomType,
  SiteContent,
} from '../types';

export const VERIFIED_LOCATION_ADDRESS =
  'Pagoda Road, Opposite Assambosti Govt. Primary School, Rangamati, Bangladesh';

export const BRAND_IMAGES = {
  hero: '/src/assets/images/hero_gang_sabarang_1795586941968.jpg',
  restaurant: '/src/assets/images/restaurant_dining_interior_1795586942222.jpg',
  food: '/src/assets/images/culinary_signature_dish_1795586942281.jpg',
  cottage: '/src/assets/images/cottage_nature_retreat_1795586943481.jpg',
  nature: '/src/assets/images/rangamati_nature_serenity_1795586942893.jpg',
  menuRice: '/src/assets/images/menu_bamboo_rice_1795589608454.jpg',
  menuChicken: '/src/assets/images/menu_herb_chicken_1795589608765.jpg',
  menuFish: '/src/assets/images/menu_grilled_fish_1795589609676.jpg',
  menuBeef: '/src/assets/images/menu_braised_beef_1795589609512.jpg',
  menuVegetables: '/src/assets/images/menu_garden_greens_1795589609958.jpg',
  menuDrinks: '/src/assets/images/menu_citrus_cooler_1795589610709.jpg',
} as const;

export const INITIAL_CONTACT_INFO: ContactInfo = {
  address: VERIFIED_LOCATION_ADDRESS,
  phone: '+8801550050641',
  whatsapp: '+8801550050641',
  facebookUrl: 'https://www.facebook.com/gangsabarang',
  mapEmbedUrl: '',
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  heroTitle: 'Serene Dining & Nature Cottages in the Heart of Rangamati',
  heroSubtitle:
    'Gang Sabarang brings together unhurried hillside hospitality, fresh regional dining, and tranquil timber cottages surrounded by lush greenery.',
  restaurantIntro:
    'Set away from city bustle along Pagoda Road, Gang Sabarang welcomes guests to dine in calm natural surroundings with attentive table service.',
};

export const INITIAL_ROOM_TYPES: readonly RoomType[] = [] as const;

export const INITIAL_FOOD_CATEGORIES: readonly FoodCategory[] = [
  { id: 'cat-rice', name: 'Rice', slug: 'rice', displayOrder: 1 },
  { id: 'cat-chicken', name: 'Chicken', slug: 'chicken', displayOrder: 2 },
  { id: 'cat-fish', name: 'Fish', slug: 'fish', displayOrder: 3 },
  { id: 'cat-beef', name: 'Beef', slug: 'beef', displayOrder: 4 },
  { id: 'cat-vegetables', name: 'Vegetables', slug: 'vegetables', displayOrder: 5 },
  { id: 'cat-snacks', name: 'Snacks', slug: 'snacks', displayOrder: 6 },
  { id: 'cat-drinks', name: 'Drinks', slug: 'drinks', displayOrder: 7 },
] as const;

export const INITIAL_MENU_ITEMS: readonly MenuItem[] = [] as const;

export const INITIAL_GALLERY_ITEMS: readonly GalleryItem[] = [] as const;

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-US')}`;
}
