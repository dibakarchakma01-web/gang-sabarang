import { ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BRAND_IMAGES } from '../../data/initialData';
import type { PageRoute } from '../../types';
import {
  VERIFIED_GOOGLE_MAPS_SEARCH_URL,
  toSafeExternalUrl,
} from '../../utils/contactLinks';
import { Button } from '../ui/Button';
import { ResilientImage } from '../ui/ResilientImage';
import { SectionHeading } from '../ui/SectionHeading';

interface LocationSectionProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function LocationSection({ onNavigate }: LocationSectionProps) {
  const { contactInfo } = useSiteData();
  const mapEmbedHref = toSafeExternalUrl(contactInfo.mapEmbedUrl);

  return (
    <section
      aria-labelledby="location-heading"
      className="border-y border-brand-primary/10 bg-white/60"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <SectionHeading
              titleId="location-heading"
              eyebrow="Find Us in Rangamati"
              title="Our Location"
              subtitle="Located along Pagoda Road opposite Assambosti Govt. Primary School in Rangamati."
            />

            <div className="mt-6 rounded-xl border border-brand-secondary/35 bg-brand-ivory p-6">
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-1 h-5 w-5 text-brand-accent shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/60">
                    Verified Property Address
                  </p>
                  <p className="mt-1.5 text-lg font-medium leading-relaxed text-brand-primary">
                    {contactInfo.address}
                  </p>
                  <a
                    href={VERIFIED_GOOGLE_MAPS_SEARCH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary underline underline-offset-4 hover:text-brand-accent"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <Button
                variant="primary"
                onClick={() => onNavigate('contact')}
              >
                <span>Location &amp; Contact</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full overflow-hidden rounded-xl border border-brand-secondary/35 bg-brand-ivory flex flex-col">
              {mapEmbedHref ? (
                <iframe
                  title="Gang Sabarang Location Map"
                  src={mapEmbedHref}
                  className="min-h-[240px] w-full flex-1 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="relative flex-1 min-h-[240px] bg-brand-primary/8">
                  <ResilientImage
                    src={BRAND_IMAGES.nature}
                    alt="Rangamati hillside landscape surrounding Gang Sabarang"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="border-t border-brand-primary/10 bg-white/90 px-6 py-4 flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-brand-primary">
                  Pagoda Road, Rangamati
                </span>
                <a
                  href={VERIFIED_GOOGLE_MAPS_SEARCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-brand-primary underline underline-offset-4 hover:text-brand-accent whitespace-nowrap shrink-0"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
