import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

interface DataSyncNoticeProps {
  readonly resourceLabel?: string;
}

export function DataSyncNotice({
  resourceLabel = 'property details',
}: DataSyncNoticeProps) {
  const { isLoading, dataError, refreshSiteData } = useSiteData();

  if (isLoading) {
    return (
      <div
        role="status"
        className="mb-6 flex items-center gap-2.5 rounded-lg border border-brand-secondary/40 bg-white/85 px-4 py-3 text-sm text-brand-primary"
      >
        <Loader2
          className="h-4 w-4 shrink-0 animate-spin text-brand-secondary"
          aria-hidden="true"
        />
        <span>Loading live {resourceLabel}...</span>
      </div>
    );
  }

  if (dataError) {
    return (
      <div
        role="alert"
        className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand-accent/55 bg-white/90 px-4 py-3 text-sm text-brand-ink"
      >
        <div className="flex items-center gap-2.5">
          <AlertCircle
            className="h-4 w-4 shrink-0 text-brand-accent"
            aria-hidden="true"
          />
          <span>{dataError}</span>
        </div>
        <button
          type="button"
          onClick={() => void refreshSiteData()}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-brand-primary/20 bg-brand-ivory px-3 py-1 text-xs font-semibold text-brand-primary hover:bg-brand-primary/8 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return null;
}
