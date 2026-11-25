import { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BRAND_IMAGES, formatBDT } from '../../data/initialData';
import { uploadMediaFile } from '../../lib/storage';
import type { RoomType } from '../../types';
import {
  validateRoomTypeForm,
  type RoomFormDraft,
} from '../../utils/adminValidation';
import { isSafeImageSource } from '../../utils/galleryState';
import { Button } from '../ui/Button';
import { ResilientImage } from '../ui/ResilientImage';

function createEmptyRoomDraft(): RoomFormDraft {
  return {
    name: '',
    type: '',
    priceText: '',
    capacityText: '2',
    description: '',
    facilitiesText: '',
    images: [],
    isAvailable: true,
  };
}

function roomToDraft(room: RoomType): RoomFormDraft {
  return {
    name: room.name,
    type: room.type,
    priceText: String(room.price),
    capacityText: String(room.capacity),
    description: room.description,
    facilitiesText: room.facilities.join(', '),
    images: [...room.images],
    isAvailable: room.isAvailable,
  };
}

export function AdminCottagesManager() {
  const { roomTypes, addRoomType, updateRoomType, deleteRoomType } =
    useSiteData();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RoomFormDraft>(createEmptyRoomDraft);
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  const [photoUrlError, setPhotoUrlError] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [isSavingForm, setIsSavingForm] = useState<boolean>(false);
  const [busyRoomId, setBusyRoomId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Readonly<Record<string, string>>>({});
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');

  const openCreateForm = () => {
    setEditingRoomId(null);
    setDraft(createEmptyRoomDraft());
    setPhotoUrlInput('');
    setPhotoUrlError('');
    setErrors({});
    setActionError('');
    setConfirmDeleteId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (room: RoomType) => {
    setEditingRoomId(room.id);
    setDraft(roomToDraft(room));
    setPhotoUrlInput('');
    setPhotoUrlError('');
    setErrors({});
    setActionError('');
    setConfirmDeleteId(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRoomId(null);
    setPhotoUrlInput('');
    setPhotoUrlError('');
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRoomPhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setPhotoUrlError('');
    setActionError('');
    setIsUploadingPhoto(true);
    try {
      const publicUrl = await uploadMediaFile(file, 'cottages');
      setDraft((prev) => ({
        ...prev,
        images: [...(prev.images ?? []), publicUrl],
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to upload room photo to Supabase Storage.';
      setPhotoUrlError(message);
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = '';
    }
  };

  const handleAddPhotoUrl = () => {
    const trimmed = photoUrlInput.trim();
    if (!trimmed) {
      return;
    }
    if (!isSafeImageSource(trimmed)) {
      setPhotoUrlError(
        'Enter a valid http/https image URL or local asset path (/...).',
      );
      return;
    }
    setPhotoUrlError('');
    setDraft((prev) => ({
      ...prev,
      images: [...(prev.images ?? []), trimmed],
    }));
    setPhotoUrlInput('');
  };

  const handleRemovePhotoAtIndex = (indexToRemove: number) => {
    setDraft((prev) => ({
      ...prev,
      images: (prev.images ?? []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSaveRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUploadingPhoto || isSavingForm) {
      return;
    }

    setActionError('');
    const validation = validateRoomTypeForm(draft);
    if (!validation.ok || !validation.value) {
      setErrors(validation.errors);
      return;
    }

    setIsSavingForm(true);
    try {
      if (editingRoomId) {
        await updateRoomType(editingRoomId, validation.value);
        setStatusMessage(
          `Updated "${validation.value.name}" (${formatBDT(validation.value.price)} / night).`,
        );
      } else {
        const created = await addRoomType(validation.value);
        setStatusMessage(
          `Added "${created.name}" (${formatBDT(created.price)} / night) to Cottages.`,
        );
      }
      closeForm();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to save cottage details right now.';
      setActionError(message);
    } finally {
      setIsSavingForm(false);
    }
  };

  const handleQuickAvailability = async (room: RoomType) => {
    if (busyRoomId) {
      return;
    }
    setActionError('');
    setBusyRoomId(room.id);
    const nextAvailable = !room.isAvailable;
    try {
      await updateRoomType(room.id, { isAvailable: nextAvailable });
      setStatusMessage(
        `Marked "${room.name}" as ${nextAvailable ? 'Available' : 'Unavailable'}.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to update cottage availability right now.';
      setActionError(message);
    } finally {
      setBusyRoomId(null);
    }
  };

  const handleConfirmDeleteRoom = async (room: RoomType) => {
    if (busyRoomId) {
      return;
    }
    setActionError('');
    setBusyRoomId(room.id);
    try {
      await deleteRoomType(room.id);
      setConfirmDeleteId(null);
      if (editingRoomId === room.id) {
        closeForm();
      }
      setStatusMessage(`Removed "${room.name}" from Cottages & Pricing.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to delete cottage right now.';
      setActionError(message);
    } finally {
      setBusyRoomId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">
            Cottages &amp; Pricing
          </h2>
          <p className="mt-1 text-sm text-brand-ink/75">
            Add cottages, edit nightly rates, manage facilities, upload room photos to storage, or toggle availability.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          data-testid="admin-open-add-room"
          onClick={openCreateForm}
          className="self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add New Cottage</span>
        </Button>
      </div>

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
            aria-label="Dismiss error message"
            onClick={() => setActionError('')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Create / Edit Cottage Form */}
      {isFormOpen ? (
        <form
          onSubmit={(event) => void handleSaveRoom(event)}
          noValidate
          data-testid="admin-room-form"
          className="rounded-xl border border-brand-secondary/45 bg-white p-6 sm:p-7 space-y-5"
        >
          <div className="flex items-center justify-between gap-4 border-b border-brand-primary/10 pb-4">
            <h3 className="text-xl font-semibold text-brand-primary">
              {editingRoomId ? `Edit ${draft.name || 'Cottage'}` : 'Add New Cottage / Room'}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              aria-label="Close cottage editor"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-primary/15 text-brand-ink/70 hover:bg-brand-primary/6 hover:text-brand-primary cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="admin-room-name"
                className="block text-sm font-medium text-brand-primary"
              >
                Room Name
              </label>
              <input
                id="admin-room-name"
                type="text"
                value={draft.name}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="e.g., Lakeside AC Suite"
                className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              {errors.name ? (
                <p className="mt-1 text-xs font-medium text-brand-accent">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="admin-room-type"
                className="block text-sm font-medium text-brand-primary"
              >
                Room Type Label
              </label>
              <input
                id="admin-room-type"
                type="text"
                value={draft.type}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, type: event.target.value }))
                }
                placeholder="e.g., AC Double"
                className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              {errors.type ? (
                <p className="mt-1 text-xs font-medium text-brand-accent">
                  {errors.type}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="admin-room-price"
                className="block text-sm font-medium text-brand-primary"
              >
                Nightly Rate (৳ BDT)
              </label>
              <input
                id="admin-room-price"
                type="number"
                min={1}
                step={50}
                value={draft.priceText}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    priceText: event.target.value,
                  }))
                }
                placeholder="e.g., 7000"
                className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm tabular-nums text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              {errors.priceText ? (
                <p className="mt-1 text-xs font-medium text-brand-accent">
                  {errors.priceText}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="admin-room-capacity"
                className="block text-sm font-medium text-brand-primary"
              >
                Guest Capacity
              </label>
              <input
                id="admin-room-capacity"
                type="number"
                min={1}
                step={1}
                value={draft.capacityText}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    capacityText: event.target.value,
                  }))
                }
                className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm tabular-nums text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              {errors.capacityText ? (
                <p className="mt-1 text-xs font-medium text-brand-accent">
                  {errors.capacityText}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="admin-room-facilities"
                className="block text-sm font-medium text-brand-primary"
              >
                Facilities (comma-separated)
              </label>
              <input
                id="admin-room-facilities"
                type="text"
                value={draft.facilitiesText ?? ''}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    facilitiesText: event.target.value,
                  }))
                }
                placeholder="e.g., Air Conditioning, Private Veranda, Nature View"
                className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-room-description"
              className="block text-sm font-medium text-brand-primary"
            >
              Room Description
            </label>
            <textarea
              id="admin-room-description"
              rows={3}
              value={draft.description}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Describe the cottage setting, ambiance, and stay experience..."
              className="mt-1.5 w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2.5 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            {errors.description ? (
              <p className="mt-1 text-xs font-medium text-brand-accent">
                {errors.description}
              </p>
            ) : null}
          </div>

          {/* Room Photos Upload & URL Manager */}
          <div className="space-y-3 rounded-lg border border-brand-primary/12 bg-brand-ivory/45 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-brand-primary">
                Room Photos ({(draft.images ?? []).length})
              </p>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="admin-room-photo-file"
                  className={`min-h-[40px] inline-flex items-center gap-2 rounded-lg border border-brand-primary/25 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-primary hover:bg-brand-primary/6 cursor-pointer ${
                    isUploadingPhoto ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {isUploadingPhoto ? (
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin text-brand-accent"
                      aria-hidden="true"
                    />
                  ) : (
                    <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {isUploadingPhoto
                      ? 'Uploading Room Photo...'
                      : 'Upload Room Photo'}
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  id="admin-room-photo-file"
                  type="file"
                  accept="image/*"
                  disabled={isUploadingPhoto}
                  onChange={(event) => void handleRoomPhotoUpload(event)}
                  className="sr-only"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="admin-room-photo-url" className="sr-only">
                Add room photo URL
              </label>
              <input
                id="admin-room-photo-url"
                type="text"
                value={photoUrlInput}
                onChange={(event) => setPhotoUrlInput(event.target.value)}
                placeholder="Or paste hosted photo URL (https://...) and click Add Photo"
                className="min-h-[40px] flex-1 rounded-lg border border-brand-primary/20 bg-white px-3 py-1.5 text-sm text-brand-ink focus:border-brand-primary focus:outline-none"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPhotoUrl}
              >
                <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add Photo</span>
              </Button>
            </div>

            {photoUrlError ? (
              <p className="text-xs font-medium text-brand-accent">
                {photoUrlError}
              </p>
            ) : null}
            {errors.images ? (
              <p className="text-xs font-medium text-brand-accent">
                {errors.images}
              </p>
            ) : null}

            {(draft.images ?? []).length > 0 ? (
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                {(draft.images ?? []).map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-brand-secondary/35 bg-white"
                  >
                    <ResilientImage
                      src={url}
                      alt={`Room photo ${idx + 1}`}
                      fallbackLabel={`Photo ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Remove room photo ${idx + 1}`}
                      onClick={() => handleRemovePhotoAtIndex(idx)}
                      className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary/85 text-brand-ivory hover:bg-brand-primary cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-brand-ink/60">
                No room photos added yet. Uploaded photos save directly to Supabase Storage under cottages/.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-primary/10 pt-4">
            <label className="inline-flex min-h-[40px] items-center gap-2 text-sm font-medium text-brand-primary cursor-pointer">
              <input
                type="checkbox"
                checked={draft.isAvailable}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    isAvailable: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-brand-primary"
              />
              <span>Available for Inquiries</span>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingPhoto || isSavingForm}
                onClick={closeForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isUploadingPhoto || isSavingForm}
                data-testid="admin-save-room-btn"
              >
                {isSavingForm ? (
                  <>
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Saving...</span>
                  </>
                ) : editingRoomId ? (
                  'Save Cottage Changes'
                ) : (
                  'Add Cottage'
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : null}

      {/* Existing Room Cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {roomTypes.map((room) => {
          const isBusy = busyRoomId === room.id;
          const isConfirmingDelete = confirmDeleteId === room.id;
          const coverPhoto = room.images[0] ?? BRAND_IMAGES.cottage;

          return (
            <article
              key={room.id}
              data-testid={`admin-room-card-${room.id}`}
              className="overflow-hidden rounded-xl border border-brand-secondary/35 bg-white/85 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] overflow-hidden bg-brand-primary/8">
                  <ResilientImage
                    src={coverPhoto}
                    alt={room.name}
                    fallbackLabel={room.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                        {room.type}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-brand-primary">
                        {room.name}
                      </h3>
                    </div>

                    <p className="text-2xl font-bold tabular-nums text-brand-primary whitespace-nowrap">
                      {formatBDT(room.price)}
                      <span className="text-xs font-normal text-brand-ink/60">
                        {' '}
                        / night
                      </span>
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">
                    {room.description}
                  </p>

                  <p className="mt-3 text-xs font-medium text-brand-ink/70">
                    Capacity: {room.capacity}{' '}
                    {room.capacity === 1 ? 'guest' : 'guests'} ·{' '}
                    {room.images.length}{' '}
                    {room.images.length === 1 ? 'photo' : 'photos'}
                  </p>

                  {room.facilities.length > 0 ? (
                    <p className="mt-1.5 text-xs text-brand-ink/65">
                      Facilities: {room.facilities.join(' · ')}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mx-6 mb-6 flex flex-wrap items-center justify-between gap-2.5 border-t border-brand-primary/10 pt-4">
                <button
                  type="button"
                  disabled={isBusy}
                  data-testid={`admin-toggle-room-${room.id}`}
                  onClick={() => void handleQuickAvailability(room)}
                  className={`min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer disabled:opacity-60 ${
                    room.isAvailable
                      ? 'border-brand-secondary/60 bg-brand-ivory text-brand-primary hover:bg-brand-primary/6'
                      : 'border-brand-accent/60 bg-brand-ivory text-brand-ink hover:bg-brand-accent/10'
                  }`}
                >
                  {isBusy ? (
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin text-brand-accent shrink-0"
                      aria-hidden="true"
                    />
                  ) : room.isAvailable ? (
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
                  <span>{room.isAvailable ? 'Available' : 'Unavailable'}</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isBusy}
                    data-testid={`admin-edit-room-${room.id}`}
                    onClick={() => openEditForm(room)}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </Button>

                  {isConfirmingDelete ? (
                    <>
                      <button
                        type="button"
                        disabled={isBusy}
                        data-testid={`admin-confirm-delete-room-${room.id}`}
                        onClick={() => void handleConfirmDeleteRoom(room)}
                        className="min-h-[40px] rounded-lg border border-brand-accent bg-brand-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 whitespace-nowrap cursor-pointer disabled:opacity-60"
                      >
                        {isBusy ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => setConfirmDeleteId(null)}
                        className="min-h-[40px] rounded-lg border border-brand-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink hover:bg-brand-primary/6 whitespace-nowrap cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      data-testid={`admin-delete-room-${room.id}`}
                      onClick={() => setConfirmDeleteId(room.id)}
                      className="min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink/75 hover:border-brand-accent/60 hover:text-brand-ink whitespace-nowrap cursor-pointer disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
