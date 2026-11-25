import { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { uploadMediaFile } from '../../lib/storage';
import type { GalleryCategory, GalleryItem } from '../../types';
import {
  GALLERY_CATEGORY_OPTIONS,
  validateGalleryItemForm,
  type GalleryFormDraft,
} from '../../utils/galleryState';
import { Button } from '../ui/Button';
import { ResilientImage } from '../ui/ResilientImage';

const INITIAL_GALLERY_DRAFT: GalleryFormDraft = {
  title: '',
  category: 'Restaurant',
  imageUrl: '',
};

export function AdminGalleryManager() {
  const { galleryItems, addGalleryItem, deleteGalleryItem } = useSiteData();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState<GalleryFormDraft>(INITIAL_GALLERY_DRAFT);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Readonly<Record<string, string>>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setActionError('');
    setIsUploadingImage(true);
    setSelectedFileName(file.name);

    try {
      const publicUrl = await uploadMediaFile(file, 'gallery');
      setDraft((prev) => ({ ...prev, imageUrl: publicUrl }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.imageUrl;
        return next;
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to upload image to Supabase Storage.';
      setErrors((prev) => ({ ...prev, imageUrl: message }));
      setSelectedFileName('');
      event.target.value = '';
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleResetForm = () => {
    setDraft(INITIAL_GALLERY_DRAFT);
    setSelectedFileName('');
    setErrors({});
    setActionError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUploadingImage || isSaving) {
      return;
    }

    setActionError('');
    const validation = validateGalleryItemForm(draft);
    if (!validation.ok || !validation.value) {
      setErrors(validation.errors);
      return;
    }

    setIsSaving(true);
    try {
      const created = await addGalleryItem(validation.value);
      setStatusMessage(
        `Added "${created.title}" (${created.category}) to the public Gallery and Homepage preview.`,
      );
      handleResetForm();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to save gallery photo right now.';
      setActionError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async (item: GalleryItem) => {
    setActionError('');
    setDeletingId(item.id);
    try {
      await deleteGalleryItem(item.id);
      setConfirmDeleteId(null);
      setStatusMessage(`Removed "${item.title}" from the Gallery.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to delete gallery photo right now.';
      setActionError(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-primary">
          Gallery Manager
        </h2>
        <p className="mt-1 text-sm text-brand-ink/75">
          Upload photos to Gang Sabarang media storage or paste an image URL to publish entries to the Gallery and Homepage preview.
        </p>
      </div>

      {/* Live Status Feedback */}
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
            aria-label="Dismiss gallery status message"
            onClick={() => setStatusMessage('')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 cursor-pointer"
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
            aria-label="Dismiss gallery error message"
            onClick={() => setActionError('')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Add / Upload Photo Form */}
      <form
        onSubmit={(event) => void handleSubmit(event)}
        noValidate
        data-testid="admin-gallery-form"
        className="rounded-xl border border-brand-secondary/40 bg-white/90 p-6 sm:p-7 space-y-5"
      >
        <div className="flex items-center gap-2.5 border-b border-brand-primary/10 pb-4">
          <ImagePlus className="h-5 w-5 text-brand-accent" aria-hidden="true" />
          <h3 className="text-xl font-semibold text-brand-primary">
            Add Gallery Photo
          </h3>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="admin-gallery-title"
                  className="block text-sm font-medium text-brand-primary"
                >
                  Photo Title
                </label>
                <input
                  id="admin-gallery-title"
                  type="text"
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="e.g., Sunset over Kaptai Hills"
                  className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                {errors.title ? (
                  <p className="mt-1 text-xs font-medium text-brand-accent">
                    {errors.title}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="admin-gallery-category"
                  className="block text-sm font-medium text-brand-primary"
                >
                  Category
                </label>
                <select
                  id="admin-gallery-category"
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      category: event.target.value as GalleryCategory,
                    }))
                  }
                  className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  {GALLERY_CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category ? (
                  <p className="mt-1 text-xs font-medium text-brand-accent">
                    {errors.category}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-gallery-file"
                className="block text-sm font-medium text-brand-primary"
              >
                Upload Photo from Device
              </label>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <label
                  htmlFor="admin-gallery-file"
                  className={`min-h-[44px] inline-flex items-center gap-2 rounded-lg border border-brand-primary/25 bg-brand-ivory px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/8 cursor-pointer ${
                    isUploadingImage ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {isUploadingImage ? (
                    <Loader2
                      className="h-4 w-4 animate-spin text-brand-accent"
                      aria-hidden="true"
                    />
                  ) : (
                    <Upload className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>
                    {isUploadingImage ? 'Uploading Photo...' : 'Choose Image File'}
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  id="admin-gallery-file"
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  onChange={(event) => void handleFileChange(event)}
                  className="sr-only"
                />
                <span className="text-xs text-brand-ink/70">
                  {isUploadingImage
                    ? `Uploading ${selectedFileName} to Supabase Storage...`
                    : selectedFileName
                      ? `Uploaded: ${selectedFileName}`
                      : 'Uploads directly to Supabase Storage (ANG-SABARANG-MEDIA)'}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-gallery-url"
                className="block text-sm font-medium text-brand-primary"
              >
                Or Paste Hosted Image URL (Optional)
              </label>
              <input
                id="admin-gallery-url"
                type="text"
                value={draft.imageUrl}
                onChange={(event) => {
                  setSelectedFileName('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  setDraft((prev) => ({ ...prev, imageUrl: event.target.value }));
                }}
                placeholder="https://... or /src/assets/images/..."
                className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              {errors.imageUrl ? (
                <p className="mt-1 text-xs font-medium text-brand-accent">
                  {errors.imageUrl}
                </p>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                Live Photo Preview
              </p>
              <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-lg border border-brand-secondary/35 bg-brand-primary/8">
                <ResilientImage
                  src={draft.imageUrl}
                  alt={draft.title || 'New gallery photo preview'}
                  fallbackLabel={draft.title || 'Select or paste a photo'}
                  className="h-full w-full object-cover"
                />
                {isUploadingImage ? (
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

            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingImage || isSaving}
                onClick={handleResetForm}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isUploadingImage || isSaving}
                data-testid="admin-gallery-submit-btn"
              >
                {isSaving ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />
                    <span>Add to Gallery</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Existing Gallery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-brand-primary">
            Current Gallery Photos ({galleryItems.length})
          </h3>
        </div>

        {galleryItems.length === 0 ? (
          <div
            role="status"
            className="rounded-xl border border-brand-secondary/35 bg-white/80 px-6 py-12 text-center"
          >
            <h4 className="text-lg font-semibold text-brand-primary">
              No gallery photos yet
            </h4>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-brand-ink/75">
              Upload a photo from your device or paste an image URL above to showcase Gang Sabarang spaces.
            </p>
          </div>
        ) : (
          <div
            data-testid="admin-gallery-grid"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {galleryItems.map((item) => {
              const isConfirming = confirmDeleteId === item.id;
              const isBusyDeleting = deletingId === item.id;

              return (
                <article
                  key={item.id}
                  data-testid={`admin-gallery-card-${item.id}`}
                  className="overflow-hidden rounded-xl border border-brand-secondary/35 bg-white/85 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] overflow-hidden bg-brand-primary/8">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.title}
                        fallbackLabel={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                        {item.category}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-brand-primary">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="mx-5 mb-5 border-t border-brand-primary/10 pt-3.5 flex items-center justify-end gap-2">
                    {isConfirming ? (
                      <>
                        <button
                          type="button"
                          disabled={isBusyDeleting}
                          data-testid={`admin-confirm-delete-gallery-${item.id}`}
                          onClick={() => void handleConfirmDelete(item)}
                          className="min-h-[40px] rounded-lg border border-brand-accent bg-brand-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 whitespace-nowrap cursor-pointer disabled:opacity-60"
                        >
                          {isBusyDeleting ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                        <button
                          type="button"
                          disabled={isBusyDeleting}
                          onClick={() => setConfirmDeleteId(null)}
                          className="min-h-[40px] rounded-lg border border-brand-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink hover:bg-brand-primary/6 whitespace-nowrap cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        data-testid={`admin-delete-gallery-${item.id}`}
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink/80 hover:border-brand-accent/60 hover:text-brand-ink whitespace-nowrap cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Delete Photo</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
