import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  INITIAL_CONTACT_INFO,
  INITIAL_FOOD_CATEGORIES,
  INITIAL_GALLERY_ITEMS,
  INITIAL_MENU_ITEMS,
  INITIAL_ROOM_TYPES,
  INITIAL_SITE_CONTENT,
} from '../data/initialData';
import { supabase } from '../lib/supabase';
import type {
  ContactInfo,
  FoodCategory,
  GalleryItem,
  MenuItem,
  RoomType,
  SiteContent,
} from '../types';
import type { NewGalleryItemInput } from '../utils/galleryState';
import { sortMenuItemsByAvailability } from '../utils/menuFilter';
import type { MenuItemUpdates, NewMenuItemInput } from '../utils/menuState';
import {
  alignFallbackMenuCategories,
  createCategorySlug,
  isUuid,
  mapContactSettingsRow,
  mapFoodCategoryRow,
  mapGalleryImageRow,
  mapMenuItemRow,
  mapRoomTypeRow,
  mapSiteContentRow,
  toContactSettingsUpsertPayload,
  toMenuItemInsertPayload,
  toMenuItemUpdatePayload,
  toRoomTypeInsertPayload,
  toRoomTypeUpdatePayload,
  toSiteContentUpsertPayload,
  type DbContactSettingsRow,
  type DbFoodCategoryRow,
  type DbGalleryImageRow,
  type DbMenuItemRow,
  type DbRoomTypeRow,
  type DbSiteContentRow,
} from '../utils/supabaseMappers';

export interface SiteDataContextValue {
  readonly categories: readonly FoodCategory[];
  readonly menuItems: readonly MenuItem[];
  readonly roomTypes: readonly RoomType[];
  readonly galleryItems: readonly GalleryItem[];
  readonly contactInfo: ContactInfo;
  readonly siteContent: SiteContent;
  readonly isLoading: boolean;
  readonly dataError: string | null;
  readonly clearDataError: () => void;
  readonly refreshSiteData: () => Promise<void>;
  readonly addFoodCategory: (input: {
    readonly name: string;
    readonly displayOrder: number;
  }) => Promise<FoodCategory>;
  readonly updateFoodCategory: (
    id: string,
    updates: { readonly name?: string; readonly displayOrder?: number },
  ) => Promise<void>;
  readonly deleteFoodCategory: (id: string) => Promise<void>;
  readonly addMenuItem: (input: NewMenuItemInput) => Promise<MenuItem>;
  readonly updateMenuItem: (id: string, updates: MenuItemUpdates) => Promise<void>;
  readonly deleteMenuItem: (id: string) => Promise<void>;
  readonly toggleMenuItemAvailability: (id: string) => Promise<void>;
  readonly toggleMenuItemFeatured: (id: string) => Promise<void>;
  readonly addRoomType: (input: Omit<RoomType, 'id'>) => Promise<RoomType>;
  readonly updateRoomType: (
    id: string,
    updates: Partial<Omit<RoomType, 'id'>>,
  ) => Promise<void>;
  readonly deleteRoomType: (id: string) => Promise<void>;
  readonly addGalleryItem: (input: NewGalleryItemInput) => Promise<GalleryItem>;
  readonly deleteGalleryItem: (id: string) => Promise<void>;
  readonly updateContactInfo: (info: ContactInfo) => Promise<void>;
  readonly updateSiteContent: (content: SiteContent) => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

interface SiteDataProviderProps {
  readonly children: ReactNode;
}

export function SiteDataProvider({ children }: SiteDataProviderProps) {
  const [categories, setCategories] = useState<readonly FoodCategory[]>(
    INITIAL_FOOD_CATEGORIES,
  );
  const [menuItems, setMenuItems] = useState<readonly MenuItem[]>(
    sortMenuItemsByAvailability(INITIAL_MENU_ITEMS),
  );
  const [roomTypes, setRoomTypes] = useState<readonly RoomType[]>(
    INITIAL_ROOM_TYPES,
  );
  const [galleryItems, setGalleryItems] = useState<readonly GalleryItem[]>(
    INITIAL_GALLERY_ITEMS,
  );
  const [contactInfo, setContactInfo] = useState<ContactInfo>(
    INITIAL_CONTACT_INFO,
  );
  const [siteContent, setSiteContent] = useState<SiteContent>(
    INITIAL_SITE_CONTENT,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);

  const clearDataError = useCallback(() => {
    setDataError(null);
  }, []);

  const fetchCategoriesList = useCallback(async () => {
    const { data, error } = await supabase
      .from('food_categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    const rows = (data ?? []) as readonly DbFoodCategoryRow[];
    const resolved =
      rows.length > 0 ? rows.map(mapFoodCategoryRow) : INITIAL_FOOD_CATEGORIES;
    setCategories(resolved);
    return resolved;
  }, []);

  const fetchMenuItemsList = useCallback(
    async (activeCategories: readonly FoodCategory[]) => {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) {
        throw new Error(error.message);
      }
      const rows = (data ?? []) as readonly DbMenuItemRow[];
      if (rows.length === 0) {
        const fallback = sortMenuItemsByAvailability(
          alignFallbackMenuCategories(INITIAL_MENU_ITEMS, activeCategories),
        );
        setMenuItems(fallback);
        return fallback;
      }
      const mapped = sortMenuItemsByAvailability(rows.map(mapMenuItemRow));
      setMenuItems(mapped);
      return mapped;
    },
    [],
  );

  const fetchRoomTypesList = useCallback(async () => {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .order('price', { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    const rows = (data ?? []) as readonly DbRoomTypeRow[];
    if (rows.length === 0) {
      setRoomTypes(INITIAL_ROOM_TYPES);
      return INITIAL_ROOM_TYPES;
    }
    const mapped = rows.map((row) => mapRoomTypeRow(row, INITIAL_ROOM_TYPES));
    setRoomTypes(mapped);
    return mapped;
  }, []);

  const fetchGalleryItemsList = useCallback(async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    const rows = (data ?? []) as readonly DbGalleryImageRow[];
    if (rows.length === 0) {
      setGalleryItems(INITIAL_GALLERY_ITEMS);
      return INITIAL_GALLERY_ITEMS;
    }
    const mapped = rows.map(mapGalleryImageRow);
    setGalleryItems(mapped);
    return mapped;
  }, []);

  const fetchContactSettingsRow = useCallback(async () => {
    const { data, error } = await supabase
      .from('contact_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    const mapped = mapContactSettingsRow(data as DbContactSettingsRow | null);
    setContactInfo(mapped);
    return mapped;
  }, []);

  const fetchSiteContentRow = useCallback(async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    const mapped = mapSiteContentRow(data as DbSiteContentRow | null);
    setSiteContent(mapped);
    return mapped;
  }, []);

  const refreshSiteData = useCallback(async () => {
    setIsLoading(true);
    setDataError(null);

    try {
      const [
        categoriesRes,
        menuRes,
        roomsRes,
        galleryRes,
        contactRes,
        siteContentRes,
      ] = await Promise.all([
        supabase
          .from('food_categories')
          .select('*')
          .order('display_order', { ascending: true }),
        supabase.from('menu_items').select('*'),
        supabase
          .from('room_types')
          .select('*')
          .order('price', { ascending: true }),
        supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('contact_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle(),
        supabase.from('site_content').select('*').eq('id', 1).maybeSingle(),
      ]);

      const queryErrors = [
        categoriesRes.error,
        menuRes.error,
        roomsRes.error,
        galleryRes.error,
        contactRes.error,
        siteContentRes.error,
      ].filter(Boolean);

      const categoryRows = (categoriesRes.data ?? []) as readonly DbFoodCategoryRow[];
      const resolvedCategories =
        !categoriesRes.error && categoryRows.length > 0
          ? categoryRows.map(mapFoodCategoryRow)
          : INITIAL_FOOD_CATEGORIES;
      setCategories(resolvedCategories);

      const menuRows = (menuRes.data ?? []) as readonly DbMenuItemRow[];
      if (!menuRes.error && menuRows.length > 0) {
        setMenuItems(sortMenuItemsByAvailability(menuRows.map(mapMenuItemRow)));
      } else {
        setMenuItems(
          sortMenuItemsByAvailability(
            alignFallbackMenuCategories(INITIAL_MENU_ITEMS, resolvedCategories),
          ),
        );
      }

      const roomRows = (roomsRes.data ?? []) as readonly DbRoomTypeRow[];
      if (!roomsRes.error && roomRows.length > 0) {
        setRoomTypes(
          roomRows.map((row) => mapRoomTypeRow(row, INITIAL_ROOM_TYPES)),
        );
      } else {
        setRoomTypes(INITIAL_ROOM_TYPES);
      }

      const galleryRows = (galleryRes.data ?? []) as readonly DbGalleryImageRow[];
      if (!galleryRes.error && galleryRows.length > 0) {
        setGalleryItems(galleryRows.map(mapGalleryImageRow));
      } else {
        setGalleryItems(INITIAL_GALLERY_ITEMS);
      }

      if (!contactRes.error && contactRes.data) {
        setContactInfo(
          mapContactSettingsRow(contactRes.data as DbContactSettingsRow),
        );
      } else {
        setContactInfo(INITIAL_CONTACT_INFO);
      }

      if (!siteContentRes.error && siteContentRes.data) {
        setSiteContent(
          mapSiteContentRow(siteContentRes.data as DbSiteContentRow),
        );
      } else {
        setSiteContent(INITIAL_SITE_CONTENT);
      }

      if (queryErrors.length > 0) {
        setDataError(
          'Some live property details could not be loaded from Supabase. Showing fallback information.',
        );
      }
    } catch {
      setDataError(
        'Unable to reach the live database right now. Showing default Gang Sabarang information.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSiteData();
  }, [refreshSiteData]);

  const addFoodCategory = useCallback(
    async (input: {
      readonly name: string;
      readonly displayOrder: number;
    }): Promise<FoodCategory> => {
      const slug = createCategorySlug(input.name, categories);
      const { data, error } = await supabase
        .from('food_categories')
        .insert({
          name: input.name.trim(),
          slug,
          display_order: Math.max(1, Math.round(input.displayOrder)),
        })
        .select('*')
        .single();

      if (error || !data) {
        throw new Error(
          error?.message || 'Failed to add food category to Supabase.',
        );
      }

      const created = mapFoodCategoryRow(data as DbFoodCategoryRow);
      const updatedCategories = await fetchCategoriesList();
      await fetchMenuItemsList(updatedCategories);
      return created;
    },
    [categories, fetchCategoriesList, fetchMenuItemsList],
  );

  const updateFoodCategory = useCallback(
    async (
      id: string,
      updates: { readonly name?: string; readonly displayOrder?: number },
    ): Promise<void> => {
      const payload: Record<string, unknown> = {};
      if (updates.name !== undefined) {
        payload.name = updates.name.trim();
        payload.slug = createCategorySlug(updates.name, categories, id);
      }
      if (updates.displayOrder !== undefined) {
        payload.display_order = Math.max(1, Math.round(updates.displayOrder));
      }

      const { error } = await supabase
        .from('food_categories')
        .update(payload)
        .eq('id', id);

      if (error) {
        throw new Error(
          error.message || 'Failed to update food category in Supabase.',
        );
      }

      const updatedCategories = await fetchCategoriesList();
      await fetchMenuItemsList(updatedCategories);
    },
    [categories, fetchCategoriesList, fetchMenuItemsList],
  );

  const deleteFoodCategory = useCallback(
    async (id: string): Promise<void> => {
      if (!isUuid(id)) {
        setCategories((current) => current.filter((cat) => cat.id !== id));
        return;
      }

      const { error } = await supabase
        .from('food_categories')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(
          error.message ||
            'Cannot delete this category while dishes are still assigned to it.',
        );
      }

      const updatedCategories = await fetchCategoriesList();
      await fetchMenuItemsList(updatedCategories);
    },
    [fetchCategoriesList, fetchMenuItemsList],
  );

  const addMenuItem = useCallback(
    async (input: NewMenuItemInput): Promise<MenuItem> => {
      const payload = toMenuItemInsertPayload(input);
      const { data, error } = await supabase
        .from('menu_items')
        .insert(payload)
        .select('*')
        .single();

      if (error || !data) {
        throw new Error(
          error?.message || 'Failed to save new dish to Supabase.',
        );
      }

      const created = mapMenuItemRow(data as DbMenuItemRow);
      await fetchMenuItemsList(categories);
      return created;
    },
    [categories, fetchMenuItemsList],
  );

  const updateMenuItem = useCallback(
    async (id: string, updates: MenuItemUpdates): Promise<void> => {
      if (!isUuid(id)) {
        const existing = menuItems.find((item) => item.id === id);
        if (!existing) {
          return;
        }
        const merged: NewMenuItemInput = {
          categoryId: updates.categoryId ?? existing.categoryId,
          name: updates.name ?? existing.name,
          description: updates.description ?? existing.description,
          price: updates.price ?? existing.price,
          price1_2:
            updates.price1_2 !== undefined
              ? updates.price1_2
              : existing.price1_2 ?? null,
          price1_4:
            updates.price1_4 !== undefined
              ? updates.price1_4
              : existing.price1_4 ?? null,
          imageUrl: updates.imageUrl ?? existing.imageUrl,
          isAvailable: updates.isAvailable ?? existing.isAvailable,
          isFeatured: updates.isFeatured ?? existing.isFeatured,
        };
        await addMenuItem(merged);
        return;
      }

      const payload = toMenuItemUpdatePayload(updates);
      const { error } = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to update dish in Supabase.');
      }

      await fetchMenuItemsList(categories);
    },
    [addMenuItem, categories, fetchMenuItemsList, menuItems],
  );

  const deleteMenuItem = useCallback(
    async (id: string): Promise<void> => {
      if (!isUuid(id)) {
        setMenuItems((current) => current.filter((item) => item.id !== id));
        return;
      }

      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) {
        throw new Error(error.message || 'Failed to delete dish from Supabase.');
      }

      await fetchMenuItemsList(categories);
    },
    [categories, fetchMenuItemsList],
  );

  const toggleMenuItemAvailability = useCallback(
    async (id: string): Promise<void> => {
      const target = menuItems.find((item) => item.id === id);
      if (!target) {
        return;
      }
      await updateMenuItem(id, { isAvailable: !target.isAvailable });
    },
    [menuItems, updateMenuItem],
  );

  const toggleMenuItemFeatured = useCallback(
    async (id: string): Promise<void> => {
      const target = menuItems.find((item) => item.id === id);
      if (!target) {
        return;
      }
      await updateMenuItem(id, { isFeatured: !target.isFeatured });
    },
    [menuItems, updateMenuItem],
  );

  const addRoomType = useCallback(
    async (input: Omit<RoomType, 'id'>): Promise<RoomType> => {
      const payload = toRoomTypeInsertPayload(input);
      const { data, error } = await supabase
        .from('room_types')
        .insert(payload)
        .select('*')
        .single();

      if (error || !data) {
        throw new Error(
          error?.message || 'Failed to add new cottage to Supabase.',
        );
      }

      const created = mapRoomTypeRow(
        data as DbRoomTypeRow,
        INITIAL_ROOM_TYPES,
      );
      await fetchRoomTypesList();
      return created;
    },
    [fetchRoomTypesList],
  );

  const updateRoomType = useCallback(
    async (
      id: string,
      updates: Partial<Omit<RoomType, 'id'>>,
    ): Promise<void> => {
      if (!isUuid(id)) {
        const existing = roomTypes.find((room) => room.id === id);
        if (!existing) {
          return;
        }
        await addRoomType({
          name: updates.name ?? existing.name,
          type: updates.type ?? existing.type,
          price: updates.price ?? existing.price,
          description: updates.description ?? existing.description,
          facilities: updates.facilities ?? existing.facilities,
          capacity: updates.capacity ?? existing.capacity,
          images: updates.images ?? existing.images,
          isAvailable: updates.isAvailable ?? existing.isAvailable,
        });
        return;
      }

      const payload = toRoomTypeUpdatePayload(updates);
      const { error } = await supabase
        .from('room_types')
        .update(payload)
        .eq('id', id);

      if (error) {
        throw new Error(
          error.message || 'Failed to update room details in Supabase.',
        );
      }

      await fetchRoomTypesList();
    },
    [addRoomType, fetchRoomTypesList, roomTypes],
  );

  const deleteRoomType = useCallback(
    async (id: string): Promise<void> => {
      if (!isUuid(id)) {
        setRoomTypes((current) => current.filter((room) => room.id !== id));
        return;
      }

      const { error } = await supabase.from('room_types').delete().eq('id', id);
      if (error) {
        throw new Error(
          error.message || 'Failed to delete cottage from Supabase.',
        );
      }

      await fetchRoomTypesList();
    },
    [fetchRoomTypesList],
  );

  const addGalleryItem = useCallback(
    async (input: NewGalleryItemInput): Promise<GalleryItem> => {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert({
          title: input.title.trim(),
          category: input.category,
          image_url: input.imageUrl.trim(),
        })
        .select('*')
        .single();

      if (error || !data) {
        throw new Error(
          error?.message || 'Failed to add photo to Supabase Gallery.',
        );
      }

      const created = mapGalleryImageRow(data as DbGalleryImageRow);
      await fetchGalleryItemsList();
      return created;
    },
    [fetchGalleryItemsList],
  );

  const deleteGalleryItem = useCallback(
    async (id: string): Promise<void> => {
      if (!isUuid(id)) {
        setGalleryItems((current) => current.filter((item) => item.id !== id));
        return;
      }

      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(
          error.message || 'Failed to delete gallery photo from Supabase.',
        );
      }

      await fetchGalleryItemsList();
    },
    [fetchGalleryItemsList],
  );

  const updateContactInfo = useCallback(
    async (info: ContactInfo): Promise<void> => {
      const payload = toContactSettingsUpsertPayload(info);
      const { error } = await supabase
        .from('contact_settings')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        throw new Error(
          error.message || 'Failed to save contact settings to Supabase.',
        );
      }

      await fetchContactSettingsRow();
    },
    [fetchContactSettingsRow],
  );

  const updateSiteContent = useCallback(
    async (content: SiteContent): Promise<void> => {
      const payload = toSiteContentUpsertPayload(content);
      const { error } = await supabase
        .from('site_content')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        throw new Error(
          error.message || 'Failed to save homepage content to Supabase.',
        );
      }

      await fetchSiteContentRow();
    },
    [fetchSiteContentRow],
  );

  const value = useMemo<SiteDataContextValue>(
    () => ({
      categories,
      menuItems,
      roomTypes,
      galleryItems,
      contactInfo,
      siteContent,
      isLoading,
      dataError,
      clearDataError,
      refreshSiteData,
      addFoodCategory,
      updateFoodCategory,
      deleteFoodCategory,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleMenuItemAvailability,
      toggleMenuItemFeatured,
      addRoomType,
      updateRoomType,
      deleteRoomType,
      addGalleryItem,
      deleteGalleryItem,
      updateContactInfo,
      updateSiteContent,
    }),
    [
      categories,
      menuItems,
      roomTypes,
      galleryItems,
      contactInfo,
      siteContent,
      isLoading,
      dataError,
      clearDataError,
      refreshSiteData,
      addFoodCategory,
      updateFoodCategory,
      deleteFoodCategory,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleMenuItemAvailability,
      toggleMenuItemFeatured,
      addRoomType,
      updateRoomType,
      deleteRoomType,
      addGalleryItem,
      deleteGalleryItem,
      updateContactInfo,
      updateSiteContent,
    ],
  );

  return (
    <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
  );
}

export function useSiteData(): SiteDataContextValue {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
}
