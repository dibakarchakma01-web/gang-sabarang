import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FolderKanban,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import type { FoodCategory } from '../../types';
import {
  validateCategoryForm,
  type CategoryFormDraft,
} from '../../utils/adminValidation';
import { Button } from '../ui/Button';

export function AdminCategoriesPanel() {
  const {
    categories,
    menuItems,
    addFoodCategory,
    updateFoodCategory,
    deleteFoodCategory,
  } = useSiteData();

  const sortedCategories = [...categories].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const nextDefaultOrder =
    (sortedCategories[sortedCategories.length - 1]?.displayOrder ?? 0) + 1;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [addDraft, setAddDraft] = useState<CategoryFormDraft>({
    name: '',
    displayOrderText: String(nextDefaultOrder),
  });
  const [addErrors, setAddErrors] = useState<Readonly<Record<string, string>>>({});
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<CategoryFormDraft>({
    name: '',
    displayOrderText: '1',
  });
  const [editErrors, setEditErrors] = useState<Readonly<Record<string, string>>>({});
  const [busyCategoryId, setBusyCategoryId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');

  const handleAddCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAdding) {
      return;
    }

    setActionError('');
    const validation = validateCategoryForm(addDraft);
    if (!validation.ok || !validation.value) {
      setAddErrors(validation.errors);
      return;
    }

    setAddErrors({});
    setIsAdding(true);
    try {
      const created = await addFoodCategory(validation.value);
      setStatusMessage(
        `Added category "${created.name}" (Order #${created.displayOrder}).`,
      );
      setAddDraft({
        name: '',
        displayOrderText: String(validation.value.displayOrder + 1),
      });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to add food category right now.',
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleStartEdit = (category: FoodCategory) => {
    setEditingId(category.id);
    setEditDraft({
      name: category.name,
      displayOrderText: String(category.displayOrder),
    });
    setEditErrors({});
    setConfirmDeleteId(null);
    setActionError('');
  };

  const handleSaveEdit = async (
    event: React.FormEvent<HTMLFormElement>,
    categoryId: string,
  ) => {
    event.preventDefault();
    if (busyCategoryId) {
      return;
    }

    setActionError('');
    const validation = validateCategoryForm(editDraft);
    if (!validation.ok || !validation.value) {
      setEditErrors(validation.errors);
      return;
    }

    setEditErrors({});
    setBusyCategoryId(categoryId);
    try {
      await updateFoodCategory(categoryId, validation.value);
      setStatusMessage(`Updated category "${validation.value.name}".`);
      setEditingId(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to update food category right now.',
      );
    } finally {
      setBusyCategoryId(null);
    }
  };

  const handleConfirmDelete = async (category: FoodCategory) => {
    if (busyCategoryId) {
      return;
    }

    const assignedCount = menuItems.filter(
      (item) => item.categoryId === category.id,
    ).length;
    if (assignedCount > 0) {
      setActionError(
        `Cannot delete "${category.name}" while ${assignedCount} ${
          assignedCount === 1 ? 'dish uses' : 'dishes use'
        } it. Reassign or remove those dishes first.`,
      );
      setConfirmDeleteId(null);
      return;
    }

    setActionError('');
    setBusyCategoryId(category.id);
    try {
      await deleteFoodCategory(category.id);
      setConfirmDeleteId(null);
      setStatusMessage(`Deleted category "${category.name}".`);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to delete food category right now.',
      );
    } finally {
      setBusyCategoryId(null);
    }
  };

  return (
    <section
      aria-label="Food categories manager"
      className="rounded-xl border border-brand-secondary/40 bg-white/85 p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FolderKanban
            className="h-5 w-5 text-brand-accent shrink-0"
            aria-hidden="true"
          />
          <div>
            <h3 className="text-lg font-bold text-brand-primary">
              Food Categories ({sortedCategories.length})
            </h3>
            <p className="text-xs text-brand-ink/70">
              Add, reorder, rename, or delete categories shown on the Menu page.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="admin-toggle-categories-panel"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <span>{isExpanded ? 'Hide Categories' : 'Manage Categories'}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {isExpanded ? (
        <div className="mt-5 space-y-5 border-t border-brand-primary/10 pt-5">
          {statusMessage ? (
            <div
              role="status"
              className="flex items-center justify-between gap-3 rounded-lg border border-brand-secondary/50 bg-brand-ivory/70 px-4 py-2.5 text-sm text-brand-primary"
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
                aria-label="Dismiss category status message"
                onClick={() => setStatusMessage('')}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {actionError ? (
            <div
              role="alert"
              className="flex items-center justify-between gap-3 rounded-lg border border-brand-accent/60 bg-brand-ivory px-4 py-2.5 text-sm text-brand-ink"
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
                aria-label="Dismiss category error message"
                onClick={() => setActionError('')}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {/* Add New Category Form */}
          <form
            onSubmit={(event) => void handleAddCategory(event)}
            noValidate
            data-testid="admin-add-category-form"
            className="grid gap-3 sm:grid-cols-12 items-end rounded-lg border border-brand-primary/12 bg-brand-ivory/50 p-4"
          >
            <div className="sm:col-span-6">
              <label
                htmlFor="admin-category-name"
                className="block text-xs font-semibold text-brand-primary"
              >
                New Category Name
              </label>
              <input
                id="admin-category-name"
                type="text"
                value={addDraft.name}
                onChange={(event) =>
                  setAddDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="e.g., Traditional Platter"
                className="mt-1 min-h-[42px] w-full rounded-lg border border-brand-primary/20 bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              {addErrors.name ? (
                <p className="mt-1 text-xs font-medium text-brand-accent">
                  {addErrors.name}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="admin-category-order"
                className="block text-xs font-semibold text-brand-primary"
              >
                Display Order
              </label>
              <input
                id="admin-category-order"
                type="number"
                min={1}
                step={1}
                value={addDraft.displayOrderText}
                onChange={(event) =>
                  setAddDraft((prev) => ({
                    ...prev,
                    displayOrderText: event.target.value,
                  }))
                }
                className="mt-1 min-h-[42px] w-full rounded-lg border border-brand-primary/20 bg-white px-3 py-2 text-sm tabular-nums text-brand-ink focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              {addErrors.displayOrderText ? (
                <p className="mt-1 text-xs font-medium text-brand-accent">
                  {addErrors.displayOrderText}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                fullWidth
                disabled={isAdding}
                data-testid="admin-add-category-btn"
              >
                {isAdding ? (
                  <>
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Add Category</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Existing Categories List */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            {sortedCategories.map((category) => {
              const isEditing = editingId === category.id;
              const isConfirmingDelete = confirmDeleteId === category.id;
              const isBusy = busyCategoryId === category.id;
              const dishCount = menuItems.filter(
                (item) => item.categoryId === category.id,
              ).length;

              return (
                <div
                  key={category.id}
                  data-testid={`admin-category-row-${category.id}`}
                  className="rounded-lg border border-brand-primary/15 bg-white p-3.5"
                >
                  {isEditing ? (
                    <form
                      onSubmit={(event) => void handleSaveEdit(event, category.id)}
                      noValidate
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label
                            htmlFor={`edit-cat-name-${category.id}`}
                            className="block text-[11px] font-semibold text-brand-primary"
                          >
                            Name
                          </label>
                          <input
                            id={`edit-cat-name-${category.id}`}
                            type="text"
                            value={editDraft.name}
                            onChange={(event) =>
                              setEditDraft((prev) => ({
                                ...prev,
                                name: event.target.value,
                              }))
                            }
                            className="mt-1 min-h-[38px] w-full rounded-md border border-brand-primary/20 bg-brand-ivory/40 px-2.5 py-1.5 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none"
                          />
                          {editErrors.name ? (
                            <p className="mt-1 text-xs text-brand-accent">
                              {editErrors.name}
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <label
                            htmlFor={`edit-cat-order-${category.id}`}
                            className="block text-[11px] font-semibold text-brand-primary"
                          >
                            Order
                          </label>
                          <input
                            id={`edit-cat-order-${category.id}`}
                            type="number"
                            min={1}
                            step={1}
                            value={editDraft.displayOrderText}
                            onChange={(event) =>
                              setEditDraft((prev) => ({
                                ...prev,
                                displayOrderText: event.target.value,
                              }))
                            }
                            className="mt-1 min-h-[38px] w-full rounded-md border border-brand-primary/20 bg-brand-ivory/40 px-2.5 py-1.5 text-sm tabular-nums text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none"
                          />
                          {editErrors.displayOrderText ? (
                            <p className="mt-1 text-xs text-brand-accent">
                              {editErrors.displayOrderText}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setEditingId(null)}
                          className="min-h-[36px] rounded-md border border-brand-primary/20 bg-white px-3 py-1 text-xs font-semibold text-brand-ink hover:bg-brand-primary/6 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isBusy}
                          className="min-h-[36px] inline-flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1 text-xs font-semibold text-brand-ivory hover:opacity-90 cursor-pointer disabled:opacity-60"
                        >
                          {isBusy ? (
                            <Loader2
                              className="h-3.5 w-3.5 animate-spin"
                              aria-hidden="true"
                            />
                          ) : null}
                          <span>Save</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold tabular-nums text-brand-secondary">
                            #{category.displayOrder}
                          </span>
                          <span className="font-semibold text-brand-primary truncate">
                            {category.name}
                          </span>
                        </div>
                        <p className="text-xs text-brand-ink/60">
                          {dishCount} {dishCount === 1 ? 'dish' : 'dishes'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isConfirmingDelete ? (
                          <>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void handleConfirmDelete(category)}
                              className="min-h-[36px] rounded-md bg-brand-accent px-2.5 py-1 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
                            >
                              {isBusy ? '...' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => setConfirmDeleteId(null)}
                              className="min-h-[36px] rounded-md border border-brand-primary/20 px-2.5 py-1 text-xs font-semibold text-brand-ink cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              aria-label={`Edit ${category.name} category`}
                              disabled={isBusy}
                              onClick={() => handleStartEdit(category)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/6 cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${category.name} category`}
                              disabled={isBusy}
                              onClick={() => setConfirmDeleteId(category.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-primary/20 text-brand-ink/75 hover:border-brand-accent/60 hover:text-brand-ink cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
