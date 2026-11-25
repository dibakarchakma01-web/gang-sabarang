import { CheckCircle2, Clock, Plus, Star } from 'lucide-react';
import { formatBDT } from '../../data/initialData';
import { useSiteData } from '../../context/SiteDataContext';
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
  const { addToCart } = useSiteData();
  const surfaceClass = surface === 'ivory' ? 'bg-brand-ivory' : 'bg-white/85';
  const portionPillSurfaceClass =
    surface === 'ivory' ? 'bg-white' : 'bg-brand-ivory';
  const paddingClass = compact ? 'p-3.5 sm:p-5' : 'p-3.5 sm:p-6';
  const footerMarginClass = compact
    ? 'mx-3.5 mb-3.5 pt-2.5 sm:mx-5 sm:mb-5 sm:pt-3'
    : 'mx-3.5 mb-3.5 pt-3 sm:mx-6 sm:mb-6 sm:pt-4';
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
            className={`absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-semibold backdrop-blur-sm shadow-xs whitespace-nowrap ${
              item.isAvailable
                ? 'border-brand-secondary/60 bg-brand-ivory/95 text-brand-primary'
                : 'border-brand-accent/60 bg-brand-ivory/95 text-brand-ink'
            }`}
          >
            {item.isAvailable ? (
              <CheckCircle2
                className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-brand-primary"
                aria-hidden="true"
              />
            ) : (
              <Clock
                className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-brand-accent"
                aria-hidden="true"
              />
            )}
            <span>{availabilityLabel}</span>
          </span>
        </div>

        <div className={paddingClass}>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs font-medium text-brand-ink/70">
            <span className="text-brand-primary font-semibold">
              {categoryName}
            </span>

            {showFeaturedIndicator && item.isFeatured ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-brand-accent">
                  <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                  <span>Featured</span>
                </span>
              </>
            ) : null}
          </div>

          <h3
            className={`mt-1.5 sm:mt-2 font-semibold text-brand-primary ${
              compact ? 'text-base sm:text-lg' : 'text-sm sm:text-xl'
            }`}
          >
            {item.name}
          </h3>

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-brand-ink/75 line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      <div
        data-testid={`menu-card-price-${item.id}`}
        className={`${footerMarginClass} border-t border-brand-primary/10 flex flex-col gap-2.5`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] sm:text-xs font-medium text-brand-ink/60">
            {portionPrices.length > 0 ? 'Portions & Rates' : 'Dine-In / Order Rate'}
          </span>

          {portionPrices.length === 0 ? (
            <span
              className={`font-bold tabular-nums text-brand-primary ${
                compact ? 'text-base sm:text-lg' : 'text-base sm:text-xl'
              }`}
            >
              {formatBDT(item.price)}
            </span>
          ) : null}
        </div>

        {/* Add to Cart Actions */}
        {item.isAvailable ? (
          portionPrices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {portionPrices.map((portion) => (
                <button
                  key={portion.label}
                  type="button"
                  onClick={() => addToCart(item, portion.label, portion.amount)}
                  className={`inline-flex items-center justify-between gap-1 rounded-lg border border-brand-secondary/60 ${portionPillSurfaceClass} px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-bold text-brand-primary hover:bg-brand-primary hover:text-brand-ivory transition-colors cursor-pointer group/btn`}
                  title={`Add ${portion.label} portion (${formatBDT(portion.amount)}) to cart`}
                >
                  <span className="font-semibold">{portion.label}</span>
                  <span className="flex items-center gap-1">
                    <span className="tabular-nums">{formatBDT(portion.amount)}</span>
                    <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-secondary group-hover/btn:text-brand-ivory" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(item, null, item.price)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-primary px-3 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold text-brand-ivory shadow-xs hover:bg-brand-primary/90 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-secondary" aria-hidden="true" />
              <span>Add to Cart ({formatBDT(item.price)})</span>
            </button>
          )
        ) : (
          <div className="text-center py-1.5 text-[11px] sm:text-xs font-medium text-brand-ink/50 bg-brand-primary/4 rounded-lg">
            Currently Stock Out
          </div>
        )}
      </div>
    </article>
  );
}
