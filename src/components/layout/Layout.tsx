import type { ReactNode } from 'react';
import type { PageRoute } from '../../types';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

interface LayoutProps {
  readonly currentRoute: PageRoute;
  readonly onNavigate: (route: PageRoute) => void;
  readonly children: ReactNode;
}

export function Layout({ currentRoute, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-brand-ivory text-brand-ink font-sans flex flex-col">
      <Navbar currentRoute={currentRoute} onNavigate={onNavigate} />
      <main className="flex-1">{children}</main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
