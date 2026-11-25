import { CheckCircle2, MapPin, Trees } from 'lucide-react';
import type { BrandIdentity } from '../config/brand';

interface InitializationPlaceholderProps {
  readonly brand: BrandIdentity;
}

export function InitializationPlaceholder({ brand }: InitializationPlaceholderProps) {
  return (
    <main className="min-h-screen bg-brand-ivory text-brand-ink font-sans flex flex-col justify-between px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl flex flex-wrap items-center justify-between gap-4 border-b border-brand-primary/12 pb-5 text-sm text-brand-primary/80">
        <div className="flex items-center gap-2 tracking-wide">
          <Trees className="h-4 w-4 text-brand-primary shrink-0" aria-hidden="true" />
          <span className="font-semibold text-brand-primary">{brand.name}</span>
        </div>
        <div className="flex items-center gap-2 text-brand-ink/75">
          <span>{brand.category}</span>
          <span aria-hidden="true">·</span>
          <span>{brand.shortLocation}</span>
        </div>
      </div>

      <section
        aria-labelledby="brand-heading"
        className="mx-auto my-auto w-full max-w-2xl py-14 text-center"
      >
        <div className="rounded-xl border border-brand-secondary/35 bg-white/75 px-6 py-12 sm:px-12 sm:py-16">
          <p className="text-sm font-medium tracking-wide text-brand-primary/75">
            {brand.category}
          </p>

          <h1
            id="brand-heading"
            className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-primary leading-[1.1] text-balance"
          >
            {brand.name}
          </h1>

          <div
            className="mx-auto my-6 h-px w-20 bg-brand-secondary/75"
            aria-hidden="true"
          />

          <p className="mx-auto max-w-lg text-lg sm:text-xl font-medium leading-relaxed text-brand-ink/90 text-balance">
            {brand.subtitle}
          </p>

          <p className="mx-auto mt-4 flex max-w-md items-start justify-center gap-2 text-sm leading-relaxed text-brand-ink/75">
            <MapPin
              className="mt-0.5 h-4 w-4 text-brand-accent shrink-0"
              aria-hidden="true"
            />
            <span>{brand.locationAddress}</span>
          </p>

          <div className="mt-9 flex justify-center">
            <div
              role="status"
              aria-live="polite"
              data-testid="environment-ready-badge"
              className="inline-flex items-center gap-2 rounded-lg border border-brand-primary/20 bg-brand-primary/6 px-4 py-2 text-sm font-medium text-brand-primary"
            >
              <CheckCircle2
                className="h-4 w-4 text-brand-accent shrink-0"
                aria-hidden="true"
              />
              <span>{brand.statusLabel}</span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-brand-ink/70">
            {brand.statusDescription}
          </p>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-3xl border-t border-brand-primary/12 pt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-brand-ink/65">
        <span>{brand.pageTitle}</span>
        <div className="flex items-center gap-3 tabular-nums" aria-label="Brand color palette">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm border border-brand-ink/15"
              style={{ backgroundColor: brand.palette.primary }}
              aria-hidden="true"
            />
            <span>{brand.palette.primary}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm border border-brand-ink/15"
              style={{ backgroundColor: brand.palette.secondary }}
              aria-hidden="true"
            />
            <span>{brand.palette.secondary}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm border border-brand-ink/15"
              style={{ backgroundColor: brand.palette.accent }}
              aria-hidden="true"
            />
            <span>{brand.palette.accent}</span>
          </span>
        </div>
      </footer>
    </main>
  );
}
