import { ArrowRight } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BRAND_IMAGES } from '../../data/initialData';
import type { PageRoute } from '../../types';
import { Button } from '../ui/Button';
import { ResilientImage } from '../ui/ResilientImage';
import { SectionHeading } from '../ui/SectionHeading';

interface RestaurantIntroSectionProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function RestaurantIntroSection({
  onNavigate,
}: RestaurantIntroSectionProps) {
  const { siteContent } = useSiteData();

  return (
    <section
      aria-labelledby="restaurant-intro-heading"
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <div className="h-full overflow-hidden rounded-xl border border-brand-secondary/35 bg-white">
            <ResilientImage
              src={BRAND_IMAGES.restaurant}
              alt="Open-air timber dining pavilion at Gang Sabarang overlooking Rangamati hills"
              className="h-full min-h-[280px] w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-center">
          <SectionHeading
            titleId="restaurant-intro-heading"
            eyebrow="The Restaurant"
            title="Warm Hospitality Framed by Peaceful Hills"
            subtitle={siteContent.restaurantIntro}
          />

          <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink/80">
            <p>
              Every meal is prepared for unhurried conversation—combining fresh ingredients, warm timber interiors, and open views across Rangamati greenery.
            </p>
            <p>
              Whether gathering with family for lunch or settling in for a quiet evening dinner, our dining room balances refined comfort with natural ease.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              onClick={() => onNavigate('restaurant')}
            >
              <span>Discover Restaurant</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="outline" onClick={() => onNavigate('menu')}>
              <span>Explore Menu</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
