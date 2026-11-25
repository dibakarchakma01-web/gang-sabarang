import { ArrowRight } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import type { PageRoute } from '../../types';
import { Button } from '../ui/Button';
import { ResilientImage } from '../ui/ResilientImage';
import { SectionHeading } from '../ui/SectionHeading';

interface GalleryPreviewSectionProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function GalleryPreviewSection({
  onNavigate,
}: GalleryPreviewSectionProps) {
  const { galleryItems } = useSiteData();

  return (
    <section
      aria-labelledby="gallery-preview-heading"
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          titleId="gallery-preview-heading"
          eyebrow="Photo Gallery"
          title="Scenes Across Gang Sabarang"
          subtitle="A curated glimpse across Restaurant, Food, Cottage, Nature, and Events spaces."
        />

        <Button
          variant="outline"
          onClick={() => onNavigate('gallery')}
          className="self-start sm:self-end"
        >
          <span>View Full Gallery</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {galleryItems.slice(0, 5).map((item, index) => {
          const spanClass =
            index < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
          return (
            <figure
              key={item.id}
              className={`group overflow-hidden rounded-xl border border-brand-secondary/35 bg-white/75 ${spanClass}`}
            >
              <div className="overflow-hidden aspect-[4/3] bg-brand-primary/8">
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="p-4 flex items-center justify-between gap-3">
                <span className="text-base font-semibold text-brand-primary">
                  {item.title}
                </span>
                <span className="text-xs font-medium text-brand-ink/65 whitespace-nowrap shrink-0">
                  {item.category}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
