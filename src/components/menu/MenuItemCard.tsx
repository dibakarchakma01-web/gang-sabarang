import { CheckCircle2, Clock, Star } from 'lucide-react';
import { formatBDT } from '../../data/initialData';
import type { MenuItem } from '../../types';
import {
  getMenuAvailabilityLabel,
  getMenuPortionPrices,
} from '../../utils/menuFilter';
import { ResilientImage } from '../ui/ResilientImage';

interface MenuItemCardProps {
  readonly item: MenuItem;
  readonly categoryName: string;
  readonly surface?: 'white' | 'ivory';
  readonly showFeaturedIndicator?: boolean;
  readonly compact?: boolean;
}

export function MenuItemCard({
  item,
  categoryName,
  surface = 'white',
  showFeaturedIndicator = false,
  compact = false,
}: MenuItemCardProps) {
  const surfaceClass = surface === 'ivory' ? 'bg-brand-ivory' : 'bg-white/85';
  const portionPillSurfaceClass =
    surface === 'ivory' ? 'bg-white' : 'bg-brand-ivory';
  const paddingClass = compact ? 'p-5' : 'p-6';
  const footerMarginClass = compact ? 'mx-5 mb-5 pt-3' : 'mx-6 mb-6 pt-4';
  const availabilityLabel = getMenuAvailabilityLabel(item.isAvailable);
  const portionPrices = getMenuPortionPrices(item);

  return (
    <article
      data-testid={`menu-card-${item.id}`}
      data-available={item.isAvailable ? 'true' : 'false'}
      data-featured={item.isFeatured ? 'true' : 'false'}
      className={`group overflow-hidden rounded-xl border border-brand-secondary/35 ${surfaceClass} flex flex-col justify-between transition-colors ${
        item.isAvailable ? '' : 'opacity-90'
      }`}
    >
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-primary/8">
          <ResilientImage
            src={item.imageUrl}
            alt={item.name}
            fallbackLabel={item.name}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
              item.isAvailable ? '' : 'grayscale-[25%]'
            }`}
          />

          <span
            data-testid={`menu-card-status-${item.id}`}
            className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm shadow-xs whitespace-nowrap ${
              item.isAvailable
                ? 'border-brand-secondary/60 bg-brand-ivory/95 text-brand-primary'
                : 'border-brand-accent/60 bg-brand-ivory/95 text-brand-ink'
            }`}
          >
            {item.isAvailable ? (
              <CheckCircle2
                className="h-3.5 w-3.5 shrink-0 text-brand-primary"
                aria-hidden="true"
              />
            ) : (
              <Clock
                className="h-3.5 w-3.5 shrink-0 text-brand-accent"
                aria-hidden="true"
              />
            )}
            <span>{availabilityLabel}</span>
          </span>
        </div>

        <div className={paddingClass}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-brand-ink/70">
            <span className="text-brand-primary font-semibold">
              {categoryName}
            </span>

            {showFeaturedIndicator && item.isFeatured ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-brand-accent">
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Featured</span>
                </span>
              </>
            ) : null}
          </div>

          <h3
            className={`mt-2 font-semibold text-brand-primary ${
              compact ? 'text-lg' : 'text-xl'
            }`}
          >
            {item.name}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-brand-ink/75">
            {item.description}
          </p>
        </div>
      </div>

      <div
        data-testid={`menu-card-price-${item.id}`}
        className={`${footerMarginClass} border-t border-brand-primary/10 flex flex-wrap items-center justify-between gap-2.5`}
      >
        <span className="text-xs font-medium text-brand-ink/60">
          {portionPrices.length > 0 ? 'Portions' : 'Dine-In Rate'}
        </span>

        {portionPrices.length > 0 ? (
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {portionPrices.map((portion) => (
              <span
                key={portion.label}
                className={`inline-flex items-center gap-1 rounded-md border border-brand-secondary/55 ${portionPillSurfaceClass} px-2.5 py-1 text-xs font-bold tabular-nums text-brand-primary whitespace-nowrap`}
              >
                <span className="font-semibold text-brand-ink/75">
                  {portion.label}:
                </span>
                <span>{formatBDT(portion.amount)}</span>
              </span>
            ))}
          </div>
        ) : (
          <span
            className={`font-bold tabular-nums text-brand-primary ${
              compact ? 'text-lg' : 'text-xl'
            }`}
          >
            {formatBDT(item.price)}
          </span>
        )}
      </div>
    </article>
  );
}
