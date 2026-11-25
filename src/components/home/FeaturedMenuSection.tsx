import { ArrowRight } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import type { PageRoute } from '../../types';
import { getCategoryName, getFeaturedMenuItems } from '../../utils/menuFilter';
import { MenuItemCard } from '../menu/MenuItemCard';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

interface FeaturedMenuSectionProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function FeaturedMenuSection({ onNavigate }: FeaturedMenuSectionProps) {
  const { categories, menuItems } = useSiteData();
  const featuredItems = getFeaturedMenuItems(menuItems, 3);

  return (
    <section
      aria-labelledby="featured-menu-heading"
      className="border-y border-brand-primary/10 bg-white/60"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            titleId="featured-menu-heading"
            eyebrow="Culinary Preview"
            title="Featured Menu Highlights"
            subtitle="Chef-selected dishes from the Gang Sabarang kitchen—explore the full menu to view all categories and availability."
          />

          <Button
            variant="outline"
            onClick={() => onNavigate('menu')}
            className="self-start sm:self-end"
          >
            <span>View Full Menu</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {featuredItems.length === 0 ? (
          <div className="mt-10 rounded-xl border border-brand-secondary/35 bg-brand-ivory px-6 py-12 text-center">
            <p className="text-base text-brand-ink/75">
              Featured dishes are currently being updated. Browse the complete menu for today&apos;s dishes.
            </p>
          </div>
        ) : (
          <div
            data-testid="home-featured-menu-grid"
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            {featuredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                categoryName={getCategoryName(categories, item.categoryId)}
                surface="ivory"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
