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

export const INITIAL_ROOM_TYPES: readonly RoomType[] = [
  {
    id: 'room-non-ac-single',
    name: 'Non-AC Single',
    type: 'Non-AC Single',
    price: 3000,
    description:
      'Editable cottage overview — peaceful single room surrounded by Rangamati greenery. Stay details and arrangements are confirmed upon direct inquiry.',
    facilities: ['Details & amenities confirmed upon inquiry (Editable)'],
    capacity: 1,
    images: [BRAND_IMAGES.cottage, BRAND_IMAGES.nature],
    isAvailable: true,
  },
  {
    id: 'room-non-ac-double',
    name: 'Non-AC Double',
    type: 'Non-AC Double',
    price: 5000,
    description:
      'Editable cottage overview — spacious double cottage option amid natural hillside surroundings. Stay details are confirmed upon direct inquiry.',
    facilities: ['Details & amenities confirmed upon inquiry (Editable)'],
    capacity: 2,
    images: [BRAND_IMAGES.cottage, BRAND_IMAGES.hero],
    isAvailable: true,
  },
  {
    id: 'room-ac-single',
    name: 'AC Single',
    type: 'AC Single',
    price: 5000,
    description:
      'Editable cottage overview — air-conditioned single cottage room with quiet garden views. Stay details are confirmed upon direct inquiry.',
    facilities: ['Details & amenities confirmed upon inquiry (Editable)'],
    capacity: 1,
    images: [BRAND_IMAGES.cottage, BRAND_IMAGES.nature],
    isAvailable: true,
  },
  {
    id: 'room-ac-double',
    name: 'AC Double',
    type: 'AC Double',
    price: 7000,
    description:
      'Editable cottage overview — air-conditioned double cottage suite for restful stays in Rangamati. Stay details are confirmed upon direct inquiry.',
    facilities: ['Details & amenities confirmed upon inquiry (Editable)'],
    capacity: 2,
    images: [BRAND_IMAGES.cottage, BRAND_IMAGES.hero],
    isAvailable: false,
  },
] as const;

export const INITIAL_FOOD_CATEGORIES: readonly FoodCategory[] = [
  { id: 'cat-rice', name: 'Rice', slug: 'rice', displayOrder: 1 },
  { id: 'cat-chicken', name: 'Chicken', slug: 'chicken', displayOrder: 2 },
  { id: 'cat-fish', name: 'Fish', slug: 'fish', displayOrder: 3 },
  { id: 'cat-beef', name: 'Beef', slug: 'beef', displayOrder: 4 },
  { id: 'cat-vegetables', name: 'Vegetables', slug: 'vegetables', displayOrder: 5 },
  { id: 'cat-snacks', name: 'Snacks', slug: 'snacks', displayOrder: 6 },
  { id: 'cat-drinks', name: 'Drinks', slug: 'drinks', displayOrder: 7 },
] as const;

export const INITIAL_MENU_ITEMS: readonly MenuItem[] = [
  {
    id: 'menu-rice-1',
    categoryId: 'cat-rice',
    name: 'Steamed Fragrant Rice (Editable)',
    description:
      'Editable rice dish placeholder — customize portion size, grain variety, and restaurant pricing.',
    price: 120,
    imageUrl: BRAND_IMAGES.menuRice,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 'menu-rice-2',
    categoryId: 'cat-rice',
    name: 'Bamboo-Infused Rice Platter (Editable)',
    description:
      'Editable rice specialty placeholder — aromatic rice served warm alongside house accompaniments.',
    price: 260,
    price1_2: 260,
    price1_4: 480,
    imageUrl: BRAND_IMAGES.menuRice,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'menu-chicken-1',
    categoryId: 'cat-chicken',
    name: 'Herb-Roasted Hillside Chicken (Editable)',
    description:
      'Editable chicken entry — slow-cooked chicken preparation seasoned with fresh herbs and warm spices.',
    price: 420,
    price1_2: 420,
    price1_4: 780,
    imageUrl: BRAND_IMAGES.menuChicken,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'menu-chicken-2',
    categoryId: 'cat-chicken',
    name: 'Home-Style Chicken Curry (Editable)',
    description:
      'Editable chicken entry — traditional simmered curry customizable via Admin Portal.',
    price: 380,
    imageUrl: BRAND_IMAGES.food,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 'menu-fish-1',
    categoryId: 'cat-fish',
    name: 'Char-Grilled Lake Fish (Editable)',
    description:
      'Editable fish specialty — fresh seasonal fish grilled with citrus, coriander, and gentle spices.',
    price: 550,
    price1_2: 550,
    price1_4: 980,
    imageUrl: BRAND_IMAGES.menuFish,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'menu-fish-2',
    categoryId: 'cat-fish',
    name: 'Seasonal Fish Preparation (Editable)',
    description:
      'Editable fish entry — seasonal preparation subject to daily kitchen catch.',
    price: 490,
    imageUrl: BRAND_IMAGES.menuFish,
    isAvailable: false,
    isFeatured: false,
  },
  {
    id: 'menu-beef-1',
    categoryId: 'cat-beef',
    name: 'Slow-Braised Spiced Beef (Editable)',
    description:
      'Editable beef dish — tender braised cuts finished with roasted spices and caramelized aromatics.',
    price: 520,
    price1_2: 520,
    price1_4: 960,
    imageUrl: BRAND_IMAGES.menuBeef,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 'menu-vegetables-1',
    categoryId: 'cat-vegetables',
    name: 'Garden Greens & Seasonal Stir-Fry (Editable)',
    description:
      'Editable vegetable dish — crisp seasonal produce lightly sauteed with garlic and herbs.',
    price: 240,
    imageUrl: BRAND_IMAGES.menuVegetables,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 'menu-snacks-1',
    categoryId: 'cat-snacks',
    name: 'Evening Veranda Platter (Editable)',
    description:
      'Editable snack entry — crisp afternoon bites suited for relaxed conversation with tea or drinks.',
    price: 280,
    imageUrl: BRAND_IMAGES.food,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 'menu-drinks-1',
    categoryId: 'cat-drinks',
    name: 'Botanical Citrus Cooler (Editable)',
    description:
      'Editable drink entry — chilled citrus and herb infusion crafted for warm Rangamati afternoons.',
    price: 180,
    imageUrl: BRAND_IMAGES.menuDrinks,
    isAvailable: true,
    isFeatured: true,
  },
] as const;

export const INITIAL_GALLERY_ITEMS: readonly GalleryItem[] = [
  {
    id: 'gallery-placeholder-restaurant',
    title: 'Timber Dining Pavilion',
    category: 'Restaurant',
    imageUrl: BRAND_IMAGES.restaurant,
  },
  {
    id: 'gallery-placeholder-food',
    title: 'Curated Culinary Presentation',
    category: 'Food',
    imageUrl: BRAND_IMAGES.food,
  },
  {
    id: 'gallery-placeholder-cottage',
    title: 'Hillside Nature Cottage',
    category: 'Cottage',
    imageUrl: BRAND_IMAGES.cottage,
  },
  {
    id: 'gallery-placeholder-nature',
    title: 'Rangamati Morning Mist & Greenery',
    category: 'Nature',
    imageUrl: BRAND_IMAGES.nature,
  },
  {
    id: 'gallery-placeholder-events',
    title: 'Open-Air Courtyard Gatherings',
    category: 'Events',
    imageUrl: BRAND_IMAGES.hero,
  },
] as const;

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-US')}`;
}
