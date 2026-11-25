import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  RotateCcw,
  Save,
  X,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { INITIAL_SITE_CONTENT } from '../../data/initialData';
import {
  validateSiteContentForm,
  type SiteContentFormDraft,
} from '../../utils/adminValidation';
import { Button } from '../ui/Button';

export function AdminSiteContentManager() {
  const { siteContent, updateSiteContent } = useSiteData();
  const [draft, setDraft] = useState<SiteContentFormDraft>({
    heroTitle: siteContent.heroTitle,
    heroSubtitle: siteContent.heroSubtitle,
    restaurantIntro: siteContent.restaurantIntro,
  });
  const [errors, setErrors] = useState<Readonly<Record<string, string>>>({});
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setDraft({
      heroTitle: siteContent.heroTitle,
      heroSubtitle: siteContent.heroSubtitle,
      restaurantIntro: siteContent.restaurantIntro,
    });
  }, [siteContent]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) {
      return;
    }

    setActionError('');
    const validation = validateSiteContentForm(draft);
    if (!validation.ok || !validation.value) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      await updateSiteContent(validation.value);
      setStatusMessage(
        'Saved homepage headlines and restaurant introduction to Supabase.',
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to save homepage content right now.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (isSaving) {
      return;
    }
    setActionError('');
    setErrors({});
    setIsSaving(true);
    try {
      await updateSiteContent(INITIAL_SITE_CONTENT);
      setDraft({
        heroTitle: INITIAL_SITE_CONTENT.heroTitle,
        heroSubtitle: INITIAL_SITE_CONTENT.heroSubtitle,
        restaurantIntro: INITIAL_SITE_CONTENT.restaurantIntro,
      });
      setStatusMessage('Restored default Gang Sabarang homepage copy.');
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to restore homepage copy right now.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-primary">
          Homepage Content
        </h2>
        <p className="mt-1 text-sm text-brand-ink/75">
          Edit the primary Hero headline, Hero subtitle, and Restaurant Introduction displayed on the Gang Sabarang homepage.
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
            aria-label="Dismiss homepage status message"
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
            aria-label="Dismiss homepage error message"
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
        data-testid="admin-site-content-form"
        className="rounded-xl border border-brand-secondary/35 bg-white/85 p-6 sm:p-8 space-y-5"
      >
        <div className="flex items-center gap-2.5 border-b border-brand-primary/10 pb-4">
          <FileText className="h-5 w-5 text-brand-accent" aria-hidden="true" />
          <h3 className="text-xl font-semibold text-brand-primary">
            Homepage Copy
          </h3>
        </div>

        <div>
          <label
            htmlFor="admin-hero-title"
            className="block text-sm font-medium text-brand-primary"
          >
            Hero Title
          </label>
          <input
            id="admin-hero-title"
            type="text"
            value={draft.heroTitle}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, heroTitle: event.target.value }))
            }
            placeholder="Where Tranquil Waters Meet Warm Hospitality"
            className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {errors.heroTitle ? (
            <p className="mt-1 text-xs font-medium text-brand-accent">
              {errors.heroTitle}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="admin-hero-subtitle"
            className="block text-sm font-medium text-brand-primary"
          >
            Hero Subtitle
          </label>
          <textarea
            id="admin-hero-subtitle"
            rows={3}
            value={draft.heroSubtitle}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                heroSubtitle: event.target.value,
              }))
            }
            placeholder="Experience refined dining and peaceful nature cottages in the heart of Rangamati, Bangladesh."
            className="mt-1.5 w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2.5 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {errors.heroSubtitle ? (
            <p className="mt-1 text-xs font-medium text-brand-accent">
              {errors.heroSubtitle}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="admin-restaurant-intro"
            className="block text-sm font-medium text-brand-primary"
          >
            Restaurant Introduction
          </label>
          <textarea
            id="admin-restaurant-intro"
            rows={4}
            value={draft.restaurantIntro}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                restaurantIntro: event.target.value,
              }))
            }
            placeholder="Nestled along Pagoda Road in Assambosti, Gang Sabarang brings together fresh local flavors..."
            className="mt-1.5 w-full rounded-lg border border-brand-primary/20 bg-brand-ivory/40 px-3.5 py-2.5 text-sm text-brand-ink focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {errors.restaurantIntro ? (
            <p className="mt-1 text-xs font-medium text-brand-accent">
              {errors.restaurantIntro}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-primary/10 pt-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={() => void handleRestoreDefaults()}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Restore Default Copy</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving}
            data-testid="admin-save-site-content-btn"
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
                <span>Save Homepage Content</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
