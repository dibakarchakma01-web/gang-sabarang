import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { PageRoute } from '../../types';
import { PUBLIC_ROUTE_DEFINITIONS } from '../../utils/router';
import { Button } from '../ui/Button';

interface NavbarProps {
  readonly currentRoute: PageRoute;
  readonly onNavigate: (route: PageRoute) => void;
}

export function Navbar({ currentRoute, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentRoute]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleRouteClick = (route: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-primary/12 bg-brand-ivory/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 h-[72px] flex items-center justify-between gap-6">
        {/* Left: Refined typographic brand lockup */}
        <a
          href="#/"
          onClick={(event) => {
            event.preventDefault();
            handleRouteClick('home');
          }}
          className="flex flex-col leading-none shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-secondary"
        >
          <span className="text-lg sm:text-xl font-bold tracking-[0.08em] text-brand-primary whitespace-nowrap">
            GANG SABARANG
          </span>
          <span className="mt-1 text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-brand-secondary whitespace-nowrap">
            RESTAURANT &amp; COTTAGE
          </span>
        </a>

        {/* Center/Right: Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7"
        >
          {PUBLIC_ROUTE_DEFINITIONS.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <a
                key={item.route}
                href={item.hash}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  handleRouteClick(item.route);
                }}
                className={`relative py-2 text-base font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-secondary ${
                  isActive
                    ? 'text-brand-primary font-semibold'
                    : 'text-brand-ink/75 hover:text-brand-primary'
                }`}
              >
                <span>{item.label}</span>
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-secondary"
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        {/* Right: Primary CTA (Desktop) + Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:block">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleRouteClick('cottages')}
            >
              Explore Cottages
            </Button>
          </div>

          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/6 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen ? (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-brand-primary/12 bg-brand-ivory px-5 pb-6 pt-4"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {PUBLIC_ROUTE_DEFINITIONS.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <a
                  key={item.route}
                  href={item.hash}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    handleRouteClick(item.route);
                  }}
                  className={`flex min-h-[44px] items-center justify-between rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-brand-primary/8 text-brand-primary font-semibold border border-brand-secondary/50'
                      : 'text-brand-ink/85 hover:bg-brand-primary/5 hover:text-brand-primary'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">
                      Active
                    </span>
                  ) : null}
                </a>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-brand-primary/10 pt-4">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => handleRouteClick('cottages')}
            >
              Explore Cottages
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
