import { ContactCtaSection } from '../components/home/ContactCtaSection';
import { CottageShowcaseSection } from '../components/home/CottageShowcaseSection';
import { ExperienceSection } from '../components/home/ExperienceSection';
import { FeaturedMenuSection } from '../components/home/FeaturedMenuSection';
import { GalleryPreviewSection } from '../components/home/GalleryPreviewSection';
import { HeroSection } from '../components/home/HeroSection';
import { LocationSection } from '../components/home/LocationSection';
import { PricingPreviewSection } from '../components/home/PricingPreviewSection';
import { RestaurantIntroSection } from '../components/home/RestaurantIntroSection';
import type { PageRoute } from '../types';

interface HomePageProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div data-route="home">
      <HeroSection onNavigate={onNavigate} />
      <RestaurantIntroSection onNavigate={onNavigate} />
      <FeaturedMenuSection onNavigate={onNavigate} />
      <ExperienceSection />
      <CottageShowcaseSection onNavigate={onNavigate} />
      <PricingPreviewSection onNavigate={onNavigate} />
      <GalleryPreviewSection onNavigate={onNavigate} />
      <LocationSection onNavigate={onNavigate} />
      <ContactCtaSection onNavigate={onNavigate} />
    </div>
  );
}
