import { useState } from 'react';
import { PageShell } from '../components/PageShell';
import { DataSyncNotice } from '../components/ui/DataSyncNotice';
import { ResilientImage } from '../components/ui/ResilientImage';
import { useSiteData } from '../context/SiteDataContext';
import type { GalleryCategory } from '../types';

const GALLERY_CATEGORIES: readonly ('All' | GalleryCategory)[] = [
  'All',
  'Restaurant',
  'Food',
  'Cottage',
  'Nature',
  'Events',
];

export function GalleryPage() {
  const { galleryItems } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<'All' | GalleryCategory>('All');

  const visibleGallery =
    selectedCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <PageShell
      routeId="gallery"
      sectionLabel="Visual Archive · Editable Placeholders"
      title="Gallery"
      description="Skeleton visual showcase organized by Restaurant, Food, Cottage, Nature, and Events categories."
    >
      <div
        role="tablist"
        aria-label="Gallery categories"
        className="flex flex-wrap items-center gap-2 pb-6"
      >
        {GALLERY_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === category
                ? 'bg-brand-primary text-brand-ivory'
                : 'border border-brand-primary/20 bg-white/75 text-brand-ink hover:bg-brand-primary/6'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <DataSyncNotice resourceLabel="gallery photos" />

      {visibleGallery.length === 0 ? (
        <div
          role="status"
          className="rounded-xl border border-brand-secondary/35 bg-white/80 px-6 py-12 text-center"
        >
          <h2 className="text-xl font-semibold text-brand-primary">
            No photos in this category
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-ink/75">
            Select another category or add new photos from the Admin Gallery Manager.
          </p>
        </div>
      ) : (
        <div
          data-testid="public-gallery-grid"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleGallery.map((item) => (
            <article
              key={item.id}
              data-testid={`gallery-card-${item.id}`}
              className="rounded-xl border border-brand-secondary/35 bg-white/75 overflow-hidden"
            >
              <ResilientImage
                src={item.imageUrl}
                alt={item.title}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-medium text-brand-ink/60">
                  {item.category}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-brand-primary">
                  {item.title}
                </h2>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
