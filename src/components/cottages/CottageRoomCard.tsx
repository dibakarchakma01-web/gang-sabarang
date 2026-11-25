import { useState } from 'react';
import {
  BedDouble,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { formatBDT } from '../../data/initialData';
import type { PageRoute, RoomType } from '../../types';
import { Button } from '../ui/Button';
import { ResilientImage } from '../ui/ResilientImage';

interface CottageRoomCardProps {
  readonly room: RoomType;
  readonly onNavigate: (route: PageRoute) => void;
}

export function CottageRoomCard({ room, onNavigate }: CottageRoomCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = room.images;
  const hasMultipleImages = images.length > 1;
  const currentSrc = images[activeImageIndex] ?? '';

  const handlePreviousImage = () => {
    if (images.length === 0) {
      return;
    }
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    if (images.length === 0) {
      return;
    }
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-brand-secondary/35 bg-white/80 flex flex-col justify-between">
      <div>
        {/* Image Frame with Switcher */}
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-primary/8">
          <ResilientImage
            src={currentSrc}
            alt={`${room.name} cottage view ${activeImageIndex + 1}`}
            fallbackLabel={room.name}
            className="h-full w-full object-cover"
          />

          {hasMultipleImages ? (
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`Previous photo for ${room.name}`}
                  onClick={handlePreviousImage}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-ivory/40 bg-brand-primary/80 text-brand-ivory hover:bg-brand-primary transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`Next photo for ${room.name}`}
                  onClick={handleNextImage}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-ivory/40 bg-brand-primary/80 text-brand-ivory hover:bg-brand-primary transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <span className="rounded-md bg-brand-primary/85 px-2.5 py-1 text-xs font-medium tabular-nums text-brand-ivory">
                {activeImageIndex + 1} / {images.length}
              </span>
            </div>
          ) : null}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-brand-ink/65">
                {room.type}
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-brand-primary">
                {room.name}
              </h3>
            </div>

            <div className="text-right shrink-0">
              <p className="text-2xl font-bold tabular-nums text-brand-primary">
                {formatBDT(room.price)}
              </p>
              <p className="text-xs text-brand-ink/60">per night</p>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">
            {room.description}
          </p>

          <div className="mt-5 space-y-2.5 border-t border-brand-primary/10 pt-4 text-xs text-brand-ink/75">
            <div className="flex items-start gap-2">
              <BedDouble
                className="mt-0.5 h-3.5 w-3.5 text-brand-accent shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-brand-primary">
                  Capacity: {room.capacity}{' '}
                  {room.capacity === 1 ? 'Guest' : 'Guests'}
                </p>
                {room.facilities.length > 0 ? (
                  <p className="mt-1 leading-relaxed text-brand-ink/75">
                    Facilities: {room.facilities.join(' · ')}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {room.isAvailable ? (
                <>
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-brand-accent shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-brand-primary">
                    Status: Available
                  </span>
                </>
              ) : (
                <>
                  <MessageSquare
                    className="h-3.5 w-3.5 text-brand-ink/60 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-brand-ink/75">
                    Status: Upon Inquiry
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <Button
          variant="primary"
          fullWidth
          onClick={() => onNavigate('contact')}
        >
          Inquire / Contact Us
        </Button>
      </div>
    </article>
  );
}
