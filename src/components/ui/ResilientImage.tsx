import { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface ResilientImageProps {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);
  const trimmedSrc = src.trim();

  useEffect(() => {
    setHasError(false);
  }, [trimmedSrc]);

  if (!trimmedSrc || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex h-full w-full flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-brand-ivory via-brand-primary/5 to-brand-secondary/12 px-5 text-center ${className}`.trim()}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-secondary/45 bg-white/80 text-brand-primary">
          <UtensilsCrossed className="h-5 w-5 text-brand-secondary" aria-hidden="true" />
        </div>
        <span className="max-w-[22ch] text-xs font-semibold leading-snug text-brand-primary/80">
          {fallbackLabel ?? alt}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-ink/50">
          Gang Sabarang Kitchen
        </span>
      </div>
    );
  }

  return (
    <img
      src={trimmedSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
