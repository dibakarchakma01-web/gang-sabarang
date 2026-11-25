export type PageRoute =
  | 'home'
  | 'restaurant'
  | 'menu'
  | 'cottages'
  | 'gallery'
  | 'contact'
  | 'admin';

export interface FoodCategory {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly displayOrder: number;
}

export interface MenuItem {
  readonly id: string;
  readonly categoryId: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly price1_2?: number | null;
  readonly price1_4?: number | null;
  readonly imageUrl: string;
  readonly isAvailable: boolean;
  readonly isFeatured: boolean;
}

export interface RoomType {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly price: number;
  readonly description: string;
  readonly facilities: readonly string[];
  readonly capacity: number;
  readonly images: readonly string[];
  readonly isAvailable: boolean;
}

export type GalleryCategory =
  | 'Restaurant'
  | 'Food'
  | 'Cottage'
  | 'Nature'
  | 'Events';

export interface GalleryItem {
  readonly id: string;
  readonly title: string;
  readonly category: GalleryCategory;
  readonly imageUrl: string;
}

export interface ContactInfo {
  readonly address: string;
  readonly phone: string;
  readonly whatsapp: string;
  readonly facebookUrl: string;
  readonly mapEmbedUrl: string;
}

export interface SiteContent {
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly restaurantIntro: string;
}

