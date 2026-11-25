import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BRAND_IMAGES, formatBDT } from '../../data/initialData';
import { uploadMediaFile } from '../../lib/storage';
import type { MenuItem } from '../../types';
import {
  validateMenuItemForm,
  type MenuFormDraft,
} from '../../utils/adminValidation';
import {
  filterMenuItems,
  getCategoryName,
  getMenuAvailabilityLabel,
  getMenuPortionPrices,
} from '../../utils/menuFilter';
import { Button } from '../ui/Button';
import { ResilientImage } from '../ui/ResilientImage';
import { AdminCategoriesPanel } from './AdminCategoriesPanel';

const SAMPLE_FOOD_IMAGES = [
  { label: 'Bamboo Rice', url: BRAND_IMAGES.menuRice },
  { label: 'Herb Chicken', url: BRAND_IMAGES.menuChicken },
  { label: 'Lake Fish', url: BRAND_IMAGES.menuFish },
  { label: 'Spiced Beef', url: BRAND_IMAGES.menuBeef },
  { label: 'Garden Greens', url: BRAND_IMAGES.menuVegetables },
  { label: 'Citrus Cooler', url: BRAND_IMAGES.menuDrinks },
  { label: 'Signature Platter', url: BRAND_IMAGES.food },
] as const;

function createEmptyDraft(defaultCategoryId: string): MenuFormDraft {
  return {
    categoryId: defaultCategoryId,
    name: '',
    description: '',
    priceText: '',
    price1_2Text: '',
    price1_4Text: '',
    imageUrl: BRAND_IMAGES.food,
    isAvailable: true,
    isFeatured: false,
  };
}

function itemToDraft(item: MenuItem): MenuFormDraft {
  return {
    categoryId: item.categoryId,
    name: item.name,
    description: item.description,
    priceText: item.price > 0 ? String(item.price) : '',
    price1_2Text:
      typeof item.price1_2 === 'number' && item.price1_2 > 0
        ? String(item.price1_2)
        : '',
    price1_4Text:
      typeof item.price1_4 === 'number' && item.price1_4 > 0
        ? String(item.price1_4)
        : '',
    imageUrl: item.imageUrl,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured,
  };
}

export function AdminMenuManager() {
  const {
    categories,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    toggleMenuItemFeatured,
  } = useSiteData();

  const sortedCategories = [...categories].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const defaultCategoryId = sortedCategories[0]?.id ?? 'cat-rice';

  const [filterCategoryId, setFilterCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MenuFormDraft>(() =>
    createEmptyDraft(defaultCategoryId),
  );
  const [selectedDishFileName, setSelectedDishFileName] = useState<string>('');
  const [isUploadingDishImage, setIsUploadingDishImage] = useState<boolean>(false);
  const [isSavingForm, setIsSavingForm] = useState<boolean>(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Readonly<Record<string, string>>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');

  const visibleItems = filterMenuItems(
    menuItems,
    filterCategoryId,
    searchQuery,
  );

  const openCreateForm = () => {
    setEditingItemId(null);
    setDraft(createEmptyDraft(defaultCategoryId));
    setSelectedDishFileName('');
    setFormErrors({});
    setActionError('');
    setIsFormOpen(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItemId(item.id);
    setDraft(itemToDraft(item));
    setSelectedDishFileName('');
    setFormErrors({});
    setActionError('');
    setIsFormOpen(true);
    setConfirmDeleteId(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItemId(null);
    setSelectedDishFileName('');
    setFormErrors({});
  };

  const handleDishFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setActionError('');
    setIsUploadingDishImage(true);
    setSelectedDishFileName(file.name);

    try {
      const publicUrl = await uploadMediaFile(file, 'menu');
      setDraft((prev) => ({ ...prev, imageUrl: publicUrl }));
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.imageUrl;
        return next;
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to upload dish image to Supabase Storage.';
      setFormErrors((prev) => ({ ...prev, imageUrl: message }));
      setSelectedDishFileName('');
      event.target.value = '';
    } finally {
      setIsUploadingDishImage(false);
    }
  };

  const handleSaveForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUploadingDishImage || isSavingForm) {
      return;
    }

    setActionError('');
    const validation = validateMenuItemForm(draft);
    if (!validation.ok || !validation.value) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSavingForm(true);
    try {
      if (editingItemId) {
        await updateMenuItem(editingItemId, validation.value);
        setStatusMessage(`Updated "${validation.value.name}" across the public menu.`);
      } else {
        const created = await addMenuItem(validation.value);
        setStatusMessage(`Added "${created.name}" to the menu.`);
      }
      closeForm();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to save dish changes to Supabase.';
      setActionError(message);
    } finally {
      setIsSavingForm(false);
    }
  };

  const handleConfirmDelete = async (item: MenuItem) => {
    if (busyItemId) {
      return;
    }
    setActionError('');
    setBusyItemId(item.id);
    try {
      await deleteMenuItem(item.id);
      setConfirmDeleteId(null);
      if (editingItemId === item.id) {
        closeForm();
      }
      setStatusMessage(`Removed "${item.name}" from the menu.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to delete dish right now.';
      setActionError(message);
    } finally {
      setBusyItemId(null);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    if (busyItemId) {
      return;
    }
    setActionError('');
    setBusyItemId(item.id);
    try {
      await toggleMenuItemAvailability(item.id);
      setStatusMessage(
        `Marked "${item.name}" as ${item.isAvailable ? 'Stock Out' : 'Available'}.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to update dish availability right now.';
      setActionError(message);
    } finally {
      setBusyItemId(null);
    }
  };

  const handleToggleFeatured = async (item: MenuItem) => {
    if (busyItemId) {
      return;
    }
    setActionError('');
    setBusyItemId(item.id);
    try {
      await toggleMenuItemFeatured(item.id);
      setStatusMessage(
        `${item.isFeatured ? 'Removed' : 'Marked'} "${item.name}" ${
          item.isFeatured ? 'from featured' : 'as Featured'
        }.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to update featured status right now.';
      setActionError(message);
    } finally {
      setBusyItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">Menu Manager</h2>
          <p className="mt-1 text-sm text-brand-ink/75">
            Add, edit, feature, or mark dishes Available / Stock Out. Updates sync immediately across the public Menu, Home, and Restaurant views.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          data-testid="admin-open-add-dish"
          onClick={openCreateForm}
          className="self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add New Dish</span>
        </Button>
      </div>

      {/* Live Status Banner */}
      {statusMessage ? (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-lg border border-brand-secondary/50 bg-white/90 px-4 py-3 text-sm text-brand-primary"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-brand-accent"
              aria-hidden="true"
            />
            <span className="font-medium">{statusMessage}</span>
          </div>
          <button
            type="button"
            aria-label="Dismiss status message"
            onClick={() => setStatusMessage('')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 hover:text-brand-primary cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {actionError ? (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-lg border border-brand-accent/60 bg-white/90 px-4 py-3 text-sm text-brand-ink"
        >
          <div className="flex items-center gap-2">
            <AlertCircle
              className="h-4 w-4 shrink-0 text-brand-accent"
              aria-hidden="true"
            />
            <span className="font-medium">{actionError}</span>
          </div>
          <button
            type="button"
            aria-label="Dismiss error message"
            onClick={() => setActionError('')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Create / Edit Dish Form */}
      {isFormOpen ? (
        <form
          onSubmit={(event) => void handleSaveForm(event)}
          noValidate
          data-testid="admin-menu-form"
          className="rounded-xl border border-brand-secondary/45 bg-white p-6 sm:p-7 space-y-5"
        >
          <div className="flex items-center justify-between gap-4 border-b border-brand-primary/10 pb-4">
            <h3 className="text-xl font-semibold text-brand-primary">
              {editingItemId ? 'Edit Dish Details' : 'Add New Menu Item'}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              aria-label="Close dish editor"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-primary/15 text-brand-ink/70 hover:bg-brand-primary/6 hover:text-brand-primary cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="admin-dish-name"
                  className="block text-sm font-medium text-brand-primary"
                >
                  Dish Name
                </label>
                <input
                  id="admin-dish-name"
                  type="text"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="e.g., Bamboo-Infused Rice Platter"
                  className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                {formErrors.name ? (
                  <p className="mt-1 text-xs font-medium text-brand-accent">
                    {formErrors.name}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="admin-dish-category"
                  className="block text-sm font-medium text-brand-primary"
                >
                  Category
                </label>
                <select
                  id="admin-dish-category"
                  value={draft.categoryId}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      categoryId: event.target.value,
                    }))
                  }
                  className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  {sortedCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId ? (
                  <p className="mt-1 text-xs font-medium text-brand-accent">
                    {formErrors.categoryId}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="admin-dish-price"
                    className="block text-sm font-medium text-brand-primary"
                  >
                    Standard Price (৳)
                  </label>
                  <p className="text-[11px] text-brand-ink/60">
                    Optional if 1:2 or 1:4 set
                  </p>
                  <input
                    id="admin-dish-price"
                    type="number"
                    min={1}
                    step={1}
                    value={draft.priceText}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        priceText: event.target.value,
                      }))
                    }
                    placeholder="e.g., 450"
                    className="mt-1 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm tabular-nums text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                  {formErrors.priceText ? (
                    <p className="mt-1 text-xs font-medium text-brand-accent">
                      {formErrors.priceText}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="admin-dish-price-1-2"
                    className="block text-sm font-medium text-brand-primary"
                  >
                    1:2 Portion Price (৳) — Optional
                  </label>
                  <p className="text-[11px] text-brand-ink/60">
                    Leave blank if unused
                  </p>
                  <input
                    id="admin-dish-price-1-2"
                    type="number"
                    min={1}
                    step={1}
                    value={draft.price1_2Text ?? ''}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        price1_2Text: event.target.value,
                      }))
                    }
                    placeholder="e.g., 260"
                    className="mt-1 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm tabular-nums text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                  {formErrors.price1_2Text ? (
                    <p className="mt-1 text-xs font-medium text-brand-accent">
                      {formErrors.price1_2Text}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="admin-dish-price-1-4"
                    className="block text-sm font-medium text-brand-primary"
                  >
                    1:4 Portion Price (৳) — Optional
                  </label>
                  <p className="text-[11px] text-brand-ink/60">
                    Leave blank if unused
                  </p>
                  <input
                    id="admin-dish-price-1-4"
                    type="number"
                    min={1}
                    step={1}
                    value={draft.price1_4Text ?? ''}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        price1_4Text: event.target.value,
                      }))
                    }
                    placeholder="e.g., 480"
                    className="mt-1 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm tabular-nums text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                  {formErrors.price1_4Text ? (
                    <p className="mt-1 text-xs font-medium text-brand-accent">
                      {formErrors.price1_4Text}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="admin-dish-description"
                  className="block text-sm font-medium text-brand-primary"
                >
                  Description
                </label>
                <textarea
                  id="admin-dish-description"
                  rows={3}
                  value={draft.description}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Brief description of ingredients or preparation..."
                  className="mt-1.5 w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2.5 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                {formErrors.description ? (
                  <p className="mt-1 text-xs font-medium text-brand-accent">
                    {formErrors.description}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="admin-dish-image"
                  className="block text-sm font-medium text-brand-primary"
                >
                  Food Image URL, Asset Path, or Device Upload
                </label>
                <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <input
                    id="admin-dish-image"
                    type="text"
                    value={draft.imageUrl}
                    onChange={(event) => {
                      setSelectedDishFileName('');
                      setDraft((prev) => ({
                        ...prev,
                        imageUrl: event.target.value,
                      }));
                    }}
                    placeholder="/src/assets/images/... or https://..."
                    className="min-h-[44px] flex-1 rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />

                  <label
                    htmlFor="admin-dish-file"
                    className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border border-brand-primary/25 bg-brand-ivory px-4 py-2 text-xs font-semibold text-brand-primary hover:bg-brand-primary/8 whitespace-nowrap shrink-0 cursor-pointer ${
                      isUploadingDishImage ? 'opacity-60 pointer-events-none' : ''
                    }`}
                  >
                    {isUploadingDishImage ? (
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin text-brand-accent"
                        aria-hidden="true"
                      />
                    ) : (
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>
                      {isUploadingDishImage ? 'Uploading...' : 'Upload File'}
                    </span>
                  </label>
                  <input
                    id="admin-dish-file"
                    type="file"
                    accept="image/*"
                    disabled={isUploadingDishImage}
                    onChange={(event) => void handleDishFileChange(event)}
                    className="sr-only"
                  />
                </div>
                {isUploadingDishImage ? (
                  <p className="mt-1 text-xs font-medium text-brand-primary">
                    Uploading {selectedDishFileName} to Supabase Storage...
                  </p>
                ) : selectedDishFileName ? (
                  <p className="mt-1 text-xs text-brand-ink/70">
                    Uploaded file: {selectedDishFileName}
                  </p>
                ) : null}
                {formErrors.imageUrl ? (
                  <p className="mt-1 text-xs font-medium text-brand-accent">
                    {formErrors.imageUrl}
                  </p>
                ) : null}

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-brand-ink/65 mr-1">
                    Sample photos:
                  </span>
                  {SAMPLE_FOOD_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setSelectedDishFileName('');
                        setDraft((prev) => ({ ...prev, imageUrl: preset.url }));
                      }}
                      className="rounded-md border border-brand-primary/15 bg-brand-ivory px-2.5 py-1 text-xs font-medium text-brand-primary hover:bg-brand-primary/8 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex min-h-[44px] items-center gap-2.5 text-sm font-medium text-brand-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.isAvailable}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        isAvailable: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-brand-primary/30 accent-brand-primary"
                  />
                  <span>Available on Menu</span>
                </label>

                <label className="inline-flex min-h-[44px] items-center gap-2.5 text-sm font-medium text-brand-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.isFeatured}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        isFeatured: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-brand-primary/30 accent-brand-accent"
                  />
                  <span>Feature on Home &amp; Restaurant</span>
                </label>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                  Photo Preview
                </p>
                <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-lg border border-brand-secondary/35 bg-brand-primary/8">
                  <ResilientImage
                    src={draft.imageUrl}
                    alt={draft.name || 'Dish photo preview'}
                    fallbackLabel={draft.name || 'Dish Photo'}
                    className="h-full w-full object-cover"
                  />
                  {isUploadingDishImage ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-ivory/80">
                      <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary">
                        <Loader2
                          className="h-4 w-4 animate-spin text-brand-accent"
                          aria-hidden="true"
                        />
                        <span>Uploading image...</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingDishImage || isSavingForm}
                  onClick={closeForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isUploadingDishImage || isSavingForm}
                  data-testid="admin-save-dish-btn"
                >
                  {isSavingForm ? (
                    <>
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Saving...</span>
                    </>
                  ) : editingItemId ? (
                    'Save Dish Changes'
                  ) : (
                    'Add Dish to Menu'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : null}

      {/* Food Categories Management */}
      <AdminCategoriesPanel />

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-brand-primary/12 bg-white/80 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
          <button
            type="button"
            onClick={() => setFilterCategoryId('all')}
            className={`min-h-[40px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              filterCategoryId === 'all'
                ? 'bg-brand-primary text-brand-ivory border border-brand-primary'
                : 'border border-brand-primary/20 bg-white text-brand-ink hover:bg-brand-primary/6'
            }`}
          >
            All ({menuItems.length})
          </button>
          {sortedCategories.map((category) => {
            const isSelected = filterCategoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilterCategoryId(category.id)}
                className={`min-h-[40px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-brand-primary text-brand-ivory border border-brand-primary'
                    : 'border border-brand-primary/20 bg-white text-brand-ink hover:bg-brand-primary/6'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72 shrink-0">
          <label htmlFor="admin-menu-search" className="sr-only">
            Filter dishes in Admin
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/55"
            aria-hidden="true"
          />
          <input
            id="admin-menu-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Filter menu items..."
            className="min-h-[40px] w-full rounded-lg border border-brand-primary/20 bg-white pl-9 pr-9 py-1.5 text-sm text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {searchQuery ? (
            <button
              type="button"
              aria-label="Clear dish filter"
              onClick={() => setSearchQuery('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Menu Items List */}
      {visibleItems.length === 0 ? (
        <div
          role="status"
          className="rounded-xl border border-brand-secondary/35 bg-white/80 px-6 py-12 text-center"
        >
          <h3 className="text-xl font-semibold text-brand-primary">
            No dishes match your filter
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-ink/75">
            Reset the category or search filter, or add a new dish to the Gang Sabarang menu.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterCategoryId('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openCreateForm}
            >
              Add New Dish
            </Button>
          </div>
        </div>
      ) : (
        <div data-testid="admin-menu-list" className="space-y-3">
          {visibleItems.map((item) => {
            const categoryName = getCategoryName(categories, item.categoryId);
            const availabilityLabel = getMenuAvailabilityLabel(item.isAvailable);
            const portionPrices = getMenuPortionPrices(item);
            const isDeleting = confirmDeleteId === item.id;

            return (
              <article
                key={item.id}
                data-testid={`admin-menu-row-${item.id}`}
                className="rounded-xl border border-brand-secondary/35 bg-white/85 p-4 sm:p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-brand-primary/12 bg-brand-primary/8">
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.name}
                      fallbackLabel={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-brand-ink/70">
                      <span className="font-semibold text-brand-primary">
                        {categoryName}
                      </span>
                      {item.price > 0 ? (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-bold tabular-nums text-brand-primary">
                            {portionPrices.length > 0
                              ? `Standard: ${formatBDT(item.price)}`
                              : formatBDT(item.price)}
                          </span>
                        </>
                      ) : null}
                      {portionPrices.map((portion) => (
                        <span
                          key={portion.label}
                          className="inline-flex items-center gap-1 rounded-md border border-brand-secondary/50 bg-brand-ivory px-2 py-0.5 text-[11px] font-bold tabular-nums text-brand-primary"
                        >
                          <span className="font-semibold text-brand-ink/75">
                            {portion.label}:
                          </span>
                          <span>{formatBDT(portion.amount)}</span>
                        </span>
                      ))}
                    </div>

                    <h3 className="mt-1 text-lg font-semibold text-brand-primary">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-brand-ink/75 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Quick Toggles & CRUD Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={busyItemId === item.id}
                    data-testid={`admin-toggle-availability-${item.id}`}
                    onClick={() => void handleToggleAvailability(item)}
                    className={`min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors disabled:opacity-60 ${
                      item.isAvailable
                        ? 'border-brand-secondary/60 bg-brand-ivory text-brand-primary hover:bg-brand-primary/6'
                        : 'border-brand-accent/60 bg-brand-ivory text-brand-ink hover:bg-brand-accent/10'
                    }`}
                  >
                    {item.isAvailable ? (
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-brand-primary shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <Clock
                        className="h-3.5 w-3.5 text-brand-accent shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span>{availabilityLabel}</span>
                  </button>

                  <button
                    type="button"
                    disabled={busyItemId === item.id}
                    data-testid={`admin-toggle-featured-${item.id}`}
                    onClick={() => void handleToggleFeatured(item)}
                    className={`min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors disabled:opacity-60 ${
                      item.isFeatured
                        ? 'border-brand-accent/55 bg-brand-accent/10 text-brand-ink'
                        : 'border-brand-primary/20 bg-white text-brand-ink/70 hover:text-brand-primary'
                    }`}
                  >
                    <Star
                      className={`h-3.5 w-3.5 shrink-0 ${
                        item.isFeatured ? 'text-brand-accent' : 'text-brand-ink/50'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{item.isFeatured ? 'Featured' : 'Standard'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={busyItemId === item.id}
                    data-testid={`admin-edit-dish-${item.id}`}
                    onClick={() => openEditForm(item)}
                    className="min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/25 bg-white px-3 py-1.5 text-xs font-semibold text-brand-primary hover:bg-brand-primary/6 whitespace-nowrap cursor-pointer disabled:opacity-60"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </button>

                  {isDeleting ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={busyItemId === item.id}
                        data-testid={`admin-confirm-delete-${item.id}`}
                        onClick={() => void handleConfirmDelete(item)}
                        className="min-h-[40px] rounded-lg border border-brand-accent bg-brand-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 whitespace-nowrap cursor-pointer disabled:opacity-60"
                      >
                        {busyItemId === item.id ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        type="button"
                        disabled={busyItemId === item.id}
                        onClick={() => setConfirmDeleteId(null)}
                        className="min-h-[40px] rounded-lg border border-brand-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink hover:bg-brand-primary/6 whitespace-nowrap cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={busyItemId === item.id}
                      data-testid={`admin-delete-dish-${item.id}`}
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink/75 hover:border-brand-accent/60 hover:text-brand-ink whitespace-nowrap cursor-pointer disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
