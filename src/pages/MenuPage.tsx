import { useEffect, useState } from 'react';
import { Info, Search, X } from 'lucide-react';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { Button } from '../components/ui/Button';
import { DataSyncNotice } from '../components/ui/DataSyncNotice';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useSiteData } from '../context/SiteDataContext';
import type { PageRoute } from '../types';
import { filterMenuItems, getCategoryName } from '../utils/menuFilter';

interface MenuPageProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function MenuPage({ onNavigate }: MenuPageProps) {
  const { categories, menuItems } = useSiteData();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Reset visible count whenever category or search query changes
  useEffect(() => {
    setVisibleCount(10);
  }, [selectedCategoryId, searchQuery]);

  const sortedCategories = [...categories].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const filteredItems = filterMenuItems(
    menuItems,
    selectedCategoryId,
    searchQuery,
  );

  const displayedItems = filteredItems.slice(0, visibleCount);

  const handleResetFilters = () => {
    setSelectedCategoryId('all');
    setSearchQuery('');
    setVisibleCount(10);
  };

  return (
    <div data-route="menu">
      {/* Menu Page Header */}
      <section
        aria-labelledby="menu-page-heading"
        className="border-b border-brand-primary/12 bg-white/60"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <SectionHeading
            as="h1"
            titleId="menu-page-heading"
            eyebrow="Culinary Catalogue · Gang Sabarang"
            title="Restaurant Menu"
            subtitle="Explore dishes by category or search by name. Available dishes appear first, followed by items currently marked Stock Out."
          />

          {/* Filter Bar: Category Tabs + Instant Search */}
          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="tablist"
              aria-label="Menu categories"
              className="flex items-center gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategoryId === 'all'}
                onClick={() => setSelectedCategoryId('all')}
                className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary ${
                  selectedCategoryId === 'all'
                    ? 'bg-brand-primary text-brand-ivory border border-brand-primary'
                    : 'border border-brand-primary/20 bg-white text-brand-ink hover:bg-brand-primary/6'
                }`}
              >
                All
              </button>
              {sortedCategories.map((category) => {
                const isSelected = selectedCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary ${
                      isSelected
                        ? 'bg-brand-primary text-brand-ivory border border-brand-primary'
                        : 'border border-brand-primary/20 bg-white text-brand-ink hover:bg-brand-primary/6'
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-80 shrink-0">
              <label htmlFor="menu-search-input" className="sr-only">
                Search menu items
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/55"
                aria-hidden="true"
              />
              <input
                id="menu-search-input"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search dishes or ingredients..."
                className="min-h-[44px] w-full rounded-lg border border-brand-primary/20 bg-white pl-10 pr-10 py-2 text-sm text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Clear search query"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 hover:text-brand-primary cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid or Empty State */}
      <section
        aria-label="Menu items"
        className="mx-auto w-full max-w-6xl px-3 sm:px-8 py-10 sm:py-16"
      >
        <DataSyncNotice resourceLabel="menu dishes" />
        <div className="mb-6 flex items-center justify-between text-sm text-brand-ink/70">
          <p className="tabular-nums">
            Showing {displayedItems.length} of {filteredItems.length}{' '}
            {filteredItems.length === 1 ? 'dish' : 'dishes'}
          </p>
          {(selectedCategoryId !== 'all' || searchQuery.trim() !== '') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sm font-medium text-brand-primary underline underline-offset-4 hover:text-brand-accent cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div
            role="status"
            className="rounded-xl border border-brand-secondary/35 bg-white/80 px-6 py-14 text-center"
          >
            <h2 className="text-2xl font-semibold text-brand-primary">
              No matching menu items found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-base text-brand-ink/75">
              Try clearing your search keyword or selecting a different food category to view available dishes.
            </p>
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={handleResetFilters}>
                Show All Menu Items
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              data-testid="menu-items-grid"
              className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3"
            >
              {displayedItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  categoryName={getCategoryName(categories, item.categoryId)}
                  surface="white"
                  showFeaturedIndicator
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredItems.length ? (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                >
                  Load More Dishes ({filteredItems.length - visibleCount} remaining)
                </Button>
              </div>
            ) : null}
          </>
        )}

        {/* Dining Notice */}
        <aside
          aria-label="Dining notice"
          className="mt-12 rounded-xl border border-brand-secondary/40 bg-white/80 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
        >
          <div className="flex items-start gap-3.5">
            <Info
              className="mt-0.5 h-5 w-5 text-brand-accent shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-lg font-semibold text-brand-primary">
                Dine-In &amp; Direct Inquiries
              </h2>
              <p className="mt-1 max-w-2xl text-sm sm:text-base leading-relaxed text-brand-ink/75">
                Guests are warmly invited to dine in at Gang Sabarang along Pagoda Road, Rangamati, or contact our team directly for table inquiries and group arrangements.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('contact')}
            >
              Contact Us
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('restaurant')}
            >
              About Restaurant
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
}
