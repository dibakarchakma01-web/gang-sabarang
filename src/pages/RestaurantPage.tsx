import { ArrowRight, Clock, Trees, Utensils } from 'lucide-react';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { Button } from '../components/ui/Button';
import { ResilientImage } from '../components/ui/ResilientImage';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useSiteData } from '../context/SiteDataContext';
import { BRAND_IMAGES } from '../data/initialData';
import type { PageRoute } from '../types';
import { getCategoryName, getFeaturedMenuItems } from '../utils/menuFilter';

interface RestaurantPageProps {
  readonly onNavigate: (route: PageRoute) => void;
}

const DINING_VALUES = [
  {
    index: '01.',
    title: 'Warm Hospitality',
    description:
      'Attentive, unhurried table service tailored for solo diners, couples, and visiting families.',
    icon: Utensils,
  },
  {
    index: '02.',
    title: 'Peaceful Nature Surroundings',
    description:
      'Open-air timber seating framed by hillside greenery along Pagoda Road in Rangamati.',
    icon: Trees,
  },
  {
    index: '03.',
    title: 'Comfortable, Relaxed Pace',
    description:
      'Thoughtfully spaced tables and natural daylight designed for uncrowded meals.',
    icon: Clock,
  },
] as const;

export function RestaurantPage({ onNavigate }: RestaurantPageProps) {
  const { categories, menuItems } = useSiteData();
  const featuredItems = getFeaturedMenuItems(menuItems);

  return (
    <div data-route="restaurant">
      {/* Page Hero / Header */}
      <section
        aria-labelledby="restaurant-page-heading"
        className="border-b border-brand-primary/12 bg-white/60"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <SectionHeading
                as="h1"
                titleId="restaurant-page-heading"
                eyebrow="Dining at Gang Sabarang · Rangamati"
                title="The Restaurant"
                subtitle="Unhurried dining amid serene hillside greenery, combining thoughtful hospitality with a warm timber pavilion atmosphere."
              />

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="primary" onClick={() => onNavigate('menu')}>
                  <span>Explore Full Menu</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" onClick={() => onNavigate('gallery')}>
                  <span>View Gallery</span>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full overflow-hidden rounded-xl border border-brand-secondary/35 bg-brand-ivory">
                <ResilientImage
                  src={BRAND_IMAGES.restaurant}
                  alt="Gang Sabarang timber restaurant dining pavilion overlooking Rangamati hills"
                  className="h-full min-h-[280px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Introduction & Dining Environment */}
      <section
        aria-labelledby="dining-environment-heading"
        className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
      >
        <SectionHeading
          titleId="dining-environment-heading"
          eyebrow="Dining Environment"
          title="Crafted for Calm Gatherings"
          subtitle="A welcoming dining room where natural light, wooden textures, and attentive service set a relaxed rhythm."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {DINING_VALUES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.index}
                className="rounded-xl border border-brand-secondary/35 bg-white/75 p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tabular-nums text-brand-secondary">
                    {item.index}
                  </span>
                  <Icon
                    className="h-5 w-5 text-brand-accent"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-brand-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-brand-ink/75">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Restaurant Specialties & Signature Dishes */}
      <section
        aria-labelledby="specialties-heading"
        className="border-y border-brand-primary/10 bg-white/60"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              titleId="specialties-heading"
              eyebrow="Signature Selection"
              title="Featured Dishes & Specialties"
              subtitle="Signature menu highlights prioritizing available selections—visit our Menu page to browse all categories."
            />

            <Button
              variant="outline"
              onClick={() => onNavigate('menu')}
              className="self-start sm:self-end"
            >
              <span>Browse Full Menu</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {featuredItems.length === 0 ? (
            <div className="mt-10 rounded-xl border border-brand-secondary/35 bg-brand-ivory px-6 py-12 text-center">
              <p className="text-base text-brand-ink/75">
                Signature selections are currently being refreshed. Explore the full menu for available dishes.
              </p>
            </div>
          ) : (
            <div
              data-testid="restaurant-featured-menu-grid"
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {featuredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  categoryName={getCategoryName(categories, item.categoryId)}
                  surface="ivory"
                  compact
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Restaurant Experience & Photo Preview */}
      <section
        aria-labelledby="restaurant-visual-story-heading"
        className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 grid gap-5 sm:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-brand-secondary/35 bg-white">
              <ResilientImage
                src={BRAND_IMAGES.food}
                alt="Signature culinary spread served on ceramic and brassware at Gang Sabarang"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-brand-secondary/35 bg-white">
              <ResilientImage
                src={BRAND_IMAGES.nature}
                alt="Serene Rangamati hillside scenery surrounding Gang Sabarang"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <SectionHeading
              titleId="restaurant-visual-story-heading"
              eyebrow="Visual Preview"
              title="From Table to Landscape"
              subtitle="Browse the complete dish catalogue or view moments across the dining pavilion and hillside gardens."
            />

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={() => onNavigate('menu')}>
                <span>Open Menu</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" onClick={() => onNavigate('gallery')}>
                <span>Open Gallery</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
