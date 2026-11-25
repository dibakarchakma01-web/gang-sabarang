import { ArrowRight, BedDouble } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { formatBDT } from '../../data/initialData';
import type { PageRoute } from '../../types';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

interface PricingPreviewSectionProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function PricingPreviewSection({
  onNavigate,
}: PricingPreviewSectionProps) {
  const { roomTypes } = useSiteData();
  return (
    <section
      aria-labelledby="pricing-preview-heading"
      className="border-b border-brand-primary/10 bg-white/60"
    >
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-4 sm:px-8 sm:pb-24">
        <div className="border-t border-brand-primary/10 pt-14">
          <SectionHeading
            titleId="pricing-preview-heading"
            eyebrow="Accommodation Rates"
            title="Cottage Pricing Preview"
            subtitle="Nightly rates are displayed for reference and can be updated anytime via the Admin Portal."
            align="center"
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roomTypes.map((room) => (
              <article
                key={room.id}
                className="rounded-xl border border-brand-secondary/35 bg-brand-ivory p-6 flex flex-col justify-between gap-6"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-brand-ink/65">
                    <span>{room.type}</span>
                    <BedDouble
                      className="h-4 w-4 text-brand-accent shrink-0"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-3 text-xl font-semibold text-brand-primary">
                    {room.name}
                  </h3>

                  <p className="mt-4 text-3xl font-bold tabular-nums text-brand-primary">
                    {formatBDT(room.price)}
                    <span className="ml-1.5 text-sm font-normal text-brand-ink/65">
                      / night
                    </span>
                  </p>
                </div>

                <p className="border-t border-brand-primary/10 pt-3 text-xs text-brand-ink/65">
                  Reference rate · Editable in Admin
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              onClick={() => onNavigate('cottages')}
            >
              <span>View Cottage Details</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
