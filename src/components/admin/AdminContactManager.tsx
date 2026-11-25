import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Save,
  X,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { INITIAL_CONTACT_INFO } from '../../data/initialData';
import {
  validateContactInfoForm,
  type ContactFormDraft,
} from '../../utils/adminValidation';
import { Button } from '../ui/Button';

export function AdminContactManager() {
  const { contactInfo, updateContactInfo } = useSiteData();
  const [draft, setDraft] = useState<ContactFormDraft>({
    address: contactInfo.address,
    phone: contactInfo.phone,
    whatsapp: contactInfo.whatsapp,
    facebookUrl: contactInfo.facebookUrl,
    mapEmbedUrl: contactInfo.mapEmbedUrl,
  });
  const [errors, setErrors] = useState<Readonly<Record<string, string>>>({});
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setDraft({
      address: contactInfo.address,
      phone: contactInfo.phone,
      whatsapp: contactInfo.whatsapp,
      facebookUrl: contactInfo.facebookUrl,
      mapEmbedUrl: contactInfo.mapEmbedUrl,
    });
  }, [contactInfo]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) {
      return;
    }

    setActionError('');
    const validation = validateContactInfoForm(draft);
    if (!validation.ok || !validation.value) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      await updateContactInfo(validation.value);
      setStatusMessage(
        'Saved contact details to Supabase across the Contact page, Homepage, Cottages, and Footer.',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to save contact settings right now.';
      setActionError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (isSaving) {
      return;
    }
    setActionError('');
    setErrors({});
    setIsSaving(true);
    try {
      await updateContactInfo(INITIAL_CONTACT_INFO);
      setDraft({
        address: INITIAL_CONTACT_INFO.address,
        phone: INITIAL_CONTACT_INFO.phone,
        whatsapp: INITIAL_CONTACT_INFO.whatsapp,
        facebookUrl: INITIAL_CONTACT_INFO.facebookUrl,
        mapEmbedUrl: INITIAL_CONTACT_INFO.mapEmbedUrl,
      });
      setStatusMessage('Restored verified Gang Sabarang contact defaults.');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to restore contact defaults right now.';
      setActionError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-primary">
          Contact &amp; Settings
        </h2>
        <p className="mt-1 text-sm text-brand-ink/75">
          Update the official Gang Sabarang address, phone line, WhatsApp contact, Facebook URL, or Google Maps embed link.
        </p>
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

      <form
        onSubmit={(event) => void handleSubmit(event)}
        noValidate
        data-testid="admin-contact-form"
        className="rounded-xl border border-brand-secondary/35 bg-white/85 p-6 sm:p-8 space-y-5"
      >
        <div>
          <label
            htmlFor="admin-contact-address"
            className="block text-sm font-medium text-brand-primary"
          >
            Property Address
          </label>
          <input
            id="admin-contact-address"
            type="text"
            value={draft.address}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, address: event.target.value }))
            }
            className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {errors.address ? (
            <p className="mt-1 text-xs font-medium text-brand-accent">
              {errors.address}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="admin-contact-phone"
              className="block text-sm font-medium text-brand-primary"
            >
              Phone Number
            </label>
            <input
              id="admin-contact-phone"
              type="tel"
              value={draft.phone}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, phone: event.target.value }))
              }
              className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm tabular-nums text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            {errors.phone ? (
              <p className="mt-1 text-xs font-medium text-brand-accent">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="admin-contact-whatsapp"
              className="block text-sm font-medium text-brand-primary"
            >
              WhatsApp Number
            </label>
            <input
              id="admin-contact-whatsapp"
              type="tel"
              value={draft.whatsapp}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, whatsapp: event.target.value }))
              }
              className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm tabular-nums text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            {errors.whatsapp ? (
              <p className="mt-1 text-xs font-medium text-brand-accent">
                {errors.whatsapp}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="admin-contact-facebook"
            className="block text-sm font-medium text-brand-primary"
          >
            Facebook Page URL
          </label>
          <input
            id="admin-contact-facebook"
            type="url"
            value={draft.facebookUrl}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, facebookUrl: event.target.value }))
            }
            className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {errors.facebookUrl ? (
            <p className="mt-1 text-xs font-medium text-brand-accent">
              {errors.facebookUrl}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="admin-contact-map-embed"
            className="block text-sm font-medium text-brand-primary"
          >
            Google Maps Embed URL (Optional)
          </label>
          <input
            id="admin-contact-map-embed"
            type="url"
            value={draft.mapEmbedUrl}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, mapEmbedUrl: event.target.value }))
            }
            placeholder="https://www.google.com/maps/embed?..."
            className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {errors.mapEmbedUrl ? (
            <p className="mt-1 text-xs font-medium text-brand-accent">
              {errors.mapEmbedUrl}
            </p>
          ) : (
            <p className="mt-1 text-xs text-brand-ink/60">
              Leave blank to display the scenic Rangamati preview with direct Google Maps search links.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-primary/10 pt-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={() => void handleResetDefaults()}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Restore Verified Defaults</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving}
            data-testid="admin-save-contact-btn"
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
                <Save className="h-4 w-4" aria-hidden="true" />
                <span>Save Contact Settings</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
