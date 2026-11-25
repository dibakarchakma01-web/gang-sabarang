import { CheckCircle2, MessageSquare } from 'lucide-react';
import { formatBDT } from '../../data/initialData';
import type { PageRoute, RoomType } from '../../types';
import { getClimateLabel } from '../../utils/cottageFilter';
import { Button } from '../ui/Button';

interface CottagePricingTableProps {
  readonly rooms: readonly RoomType[];
  readonly onNavigate: (route: PageRoute) => void;
}

export function CottagePricingTable({
  rooms,
  onNavigate,
}: CottagePricingTableProps) {
  return (
    <div>
      {/* Desktop & Tablet Table */}
      <div className="hidden md:block overflow-x-auto overflow-hidden rounded-xl border border-brand-secondary/35 bg-white/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-primary/12 bg-brand-primary/4 text-xs font-semibold uppercase tracking-[0.14em] text-brand-primary">
              <th scope="col" className="px-6 py-4">
                Room Type
              </th>
              <th scope="col" className="px-6 py-4">
                Category
              </th>
              <th scope="col" className="px-6 py-4">
                Nightly Tariff
              </th>
              <th scope="col" className="px-6 py-4">
                Availability
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Inquiry
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/10 text-sm">
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="hover:bg-brand-ivory/80 transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-base text-brand-primary">
                  {room.name}
                </td>
                <td className="px-6 py-4 text-brand-ink/75">
                  {getClimateLabel(room.type)}
                </td>
                <td className="px-6 py-4 text-lg font-bold tabular-nums text-brand-primary">
                  {formatBDT(room.price)}
                  <span className="ml-1 text-xs font-normal text-brand-ink/60">
                    / night
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-brand-primary">
                    {room.isAvailable ? (
                      <>
                        <CheckCircle2
                          className="h-4 w-4 text-brand-accent shrink-0"
                          aria-hidden="true"
                        />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare
                          className="h-4 w-4 text-brand-ink/60 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-brand-ink/75">Upon Inquiry</span>
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('contact')}
                  >
                    Inquire
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Scannable Overview List */}
      <div className="md:hidden grid gap-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-xl border border-brand-secondary/35 bg-white/80 p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-xs font-medium text-brand-ink/65">
                {getClimateLabel(room.type)} ·{' '}
                {room.isAvailable ? 'Available' : 'Upon Inquiry'}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-brand-primary">
                {room.name}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold tabular-nums text-brand-primary">
                {formatBDT(room.price)}
              </p>
              <p className="text-xs text-brand-ink/60">per night</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
