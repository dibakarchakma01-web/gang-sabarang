import { ArrowRight } from 'lucide-react';
import { BRAND_IMAGES } from '../../data/initialData';
import type { PageRoute } from '../../types';
import { Button } from '../ui/Button';
import { ResilientImage } from '../ui/ResilientImage';
import { SectionHeading } from '../ui/SectionHeading';

interface CottageShowcaseSectionProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function CottageShowcaseSection({
  onNavigate,
}: CottageShowcaseSectionProps) {
  return (
    <section
      aria-labelledby="cottage-showcase-heading"
      className="border-t border-brand-primary/10 bg-white/60"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
            <SectionHeading
              titleId="cottage-showcase-heading"
              eyebrow="Nature Cottages"
              title="Private Cottages Nestled Among Greenery"
              subtitle="Extend a tranquil meal into an overnight stay in our hillside cottages designed for restful mornings in Rangamati."
            />

            <p className="mt-5 text-base leading-relaxed text-brand-ink/80">
              Choose between Non-AC and AC accommodations tailored for solo retreats or double stays, with direct proximity to the Gang Sabarang dining pavilion.
            </p>

            <div className="mt-8">
              <Button
                variant="primary"
                onClick={() => onNavigate('cottages')}
              >
                <span>Explore Cottages</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="h-full overflow-hidden rounded-xl border border-brand-secondary/35 bg-white">
              <ResilientImage
                src={BRAND_IMAGES.cottage}
                alt="Boutique timber and stone cottage with shaded veranda surrounded by Rangamati trees"
                className="h-full min-h-[280px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
