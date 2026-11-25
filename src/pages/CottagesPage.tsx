import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CottageInquirySection } from '../components/cottages/CottageInquirySection';
import { CottagePricingTable } from '../components/cottages/CottagePricingTable';
import { CottageRoomCard } from '../components/cottages/CottageRoomCard';
import { Button } from '../components/ui/Button';
import { DataSyncNotice } from '../components/ui/DataSyncNotice';
import { ResilientImage } from '../components/ui/ResilientImage';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useSiteData } from '../context/SiteDataContext';
import { BRAND_IMAGES } from '../data/initialData';
import type { PageRoute } from '../types';
import {
  type CottageFilterOption,
  filterRoomTypes,
} from '../utils/cottageFilter';

interface CottagesPageProps {
  readonly onNavigate: (route: PageRoute) => void;
}

const FILTER_OPTIONS: readonly CottageFilterOption[] = ['All', 'Non-AC', 'AC'];

export function CottagesPage({ onNavigate }: CottagesPageProps) {
  const { roomTypes } = useSiteData();
  const [selectedFilter, setSelectedFilter] =
    useState<CottageFilterOption>('All');

  const filteredRooms = filterRoomTypes(roomTypes, selectedFilter);

  return (
    <div data-route="cottages">
      {/* Page Hero / Header */}
      <section
        aria-labelledby="cottages-page-heading"
        className="border-b border-brand-primary/12 bg-white/60"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <SectionHeading
                as="h1"
                titleId="cottages-page-heading"
                eyebrow="Nature Cottages · Rangamati"
                title="Cottages & Accommodation"
                subtitle="Peaceful hillside stays surrounded by trees and morning mist, offering direct proximity to the Gang Sabarang dining pavilion."
              />

              <p className="mt-4 text-sm leading-relaxed text-brand-ink/75">
                Nightly room tariffs below are verified reference rates. Detailed room amenities, check-in timings, and stay policies are shared directly upon inquiry.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="primary" onClick={() => onNavigate('contact')}>
                  <span>Inquire / Contact Us</span>
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
                  src={BRAND_IMAGES.cottage}
                  alt="Timber and stone nature cottage at Gang Sabarang surrounded by Rangamati greenery"
                  className="h-full min-h-[280px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types & Pricing Overview Table */}
      <section
        aria-labelledby="pricing-overview-heading"
        className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16"
      >
        <SectionHeading
          titleId="pricing-overview-heading"
          eyebrow="Tariff Overview"
          title="Verified Room Types & Nightly Rates"
          subtitle="Clear nightly pricing across Non-AC and AC accommodations, editable centrally via the Admin Portal."
        />

        <div className="mt-8">
          <DataSyncNotice resourceLabel="cottage rates" />
          <CottagePricingTable rooms={roomTypes} onNavigate={onNavigate} />
        </div>
      </section>

      {/* Detailed Room Cards with Filter Tabs */}
      <section
        aria-labelledby="room-details-heading"
        className="border-y border-brand-primary/10 bg-white/60"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              titleId="room-details-heading"
              eyebrow="Room Showcase"
              title="Explore Individual Cottages"
              subtitle="Filter by Non-AC or AC options and preview available imagery before reaching out."
            />

            <div
              role="tablist"
              aria-label="Filter cottage types"
              className="flex items-center gap-2 self-start sm:self-end"
            >
              {FILTER_OPTIONS.map((option) => {
                const isSelected = selectedFilter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedFilter(option)}
                    className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary ${
                      isSelected
                        ? 'bg-brand-primary text-brand-ivory border border-brand-primary'
                        : 'border border-brand-primary/20 bg-white text-brand-ink hover:bg-brand-primary/6'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {filteredRooms.map((room) => (
              <CottageRoomCard
                key={room.id}
                room={room}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry / Direct Contact Section */}
      <CottageInquirySection onNavigate={onNavigate} />
    </div>
  );
}
