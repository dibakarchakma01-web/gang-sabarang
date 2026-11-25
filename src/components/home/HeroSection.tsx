import { ArrowRight, MapPin } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BRAND_IMAGES } from '../../data/initialData';
import type { PageRoute } from '../../types';
import { Button } from '../ui/Button';
import { ResilientImage } from '../ui/ResilientImage';

interface HeroSectionProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { siteContent, contactInfo } = useSiteData();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-brand-primary"
    >
      <div className="absolute inset-0 -z-10">
        <ResilientImage
          src={BRAND_IMAGES.hero}
          alt="Gang Sabarang luxury nature restaurant and timber cottages nestled in the green hills of Rangamati"
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0E2015]/92 via-[#0E2015]/55 to-[#0E2015]/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0E2015]/80 via-[#0E2015]/40 to-transparent"
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#E3C483]">
            Rangamati, Bangladesh · Restaurant &amp; Cottage
          </p>

          <h1
            id="hero-heading"
            data-testid="home-hero-title"
            className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-ivory leading-[1.08] text-balance"
          >
            {siteContent.heroTitle}
          </h1>

          <p
            data-testid="home-hero-subtitle"
            className="mt-5 max-w-2xl text-lg sm:text-xl leading-relaxed text-brand-ivory/90"
          >
            {siteContent.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('cottages')}
            >
              <span>Explore Cottages</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>

            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-brand-ivory/70 bg-brand-primary/35 px-6 py-3 text-base font-medium text-brand-ivory hover:bg-brand-ivory hover:text-brand-primary transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
            >
              View Menu
            </button>
          </div>

          <p className="mt-10 inline-flex items-center gap-2 text-sm text-brand-ivory/80">
            <MapPin
              className="h-4 w-4 text-brand-secondary shrink-0"
              aria-hidden="true"
            />
            <span>{contactInfo.address}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
