import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowLeft,
  BedDouble,
  ExternalLink,
  FileText,
  Images,
  Loader2,
  LogOut,
  Phone,
  UtensilsCrossed,
} from 'lucide-react';
import { AdminAccessGate } from '../components/admin/AdminAccessGate';
import { AdminContactManager } from '../components/admin/AdminContactManager';
import { AdminCottagesManager } from '../components/admin/AdminCottagesManager';
import { AdminGalleryManager } from '../components/admin/AdminGalleryManager';
import { AdminMenuManager } from '../components/admin/AdminMenuManager';
import { AdminSiteContentManager } from '../components/admin/AdminSiteContentManager';
import { Button } from '../components/ui/Button';
import { DataSyncNotice } from '../components/ui/DataSyncNotice';
import { supabase } from '../lib/supabase';
import type { PageRoute } from '../types';

interface AdminPageProps {
  readonly onNavigate: (route: PageRoute) => void;
}

type AdminTab = 'menu' | 'cottages' | 'gallery' | 'homepage' | 'contact';

const ADMIN_TABS: readonly {
  readonly id: AdminTab;
  readonly label: string;
  readonly icon: typeof UtensilsCrossed;
}[] = [
  { id: 'menu', label: 'Menu Manager', icon: UtensilsCrossed },
  { id: 'cottages', label: 'Cottages & Pricing', icon: BedDouble },
  { id: 'gallery', label: 'Gallery Manager', icon: Images },
  { id: 'homepage', label: 'Homepage Content', icon: FileText },
  { id: 'contact', label: 'Contact & Settings', icon: Phone },
];

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (isMounted) {
          setAuthSession(data.session ?? null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setAuthSession(nextSession);
        setIsCheckingSession(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div
      data-route="admin"
      className="min-h-screen bg-brand-ivory text-brand-ink font-sans flex flex-col"
    >
      <header className="sticky top-0 z-30 border-b border-brand-primary/12 bg-brand-ivory/95 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8 h-[72px] flex items-center justify-between gap-3">
          <div className="flex flex-col leading-none shrink-0">
            <span className="text-base sm:text-lg font-bold tracking-[0.08em] text-brand-primary whitespace-nowrap">
              GANG SABARANG
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.2em] text-brand-secondary whitespace-nowrap">
              ADMIN WORKSPACE
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {authSession ? (
              <>
                <div className="hidden md:block">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('menu')}
                  >
                    <span>View Public Menu</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-testid="admin-logout-btn"
                  aria-label="Log out of admin workspace"
                  disabled={isSigningOut}
                  onClick={() => void handleLogout()}
                >
                  {isSigningOut ? (
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sm:hidden">Website</span>
              <span className="hidden sm:inline">Back to Website</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {isCheckingSession ? (
          <section
            aria-label="Checking admin session"
            className="mx-auto w-full max-w-xl px-5 py-16 sm:px-8"
          >
            <div className="flex items-center justify-center gap-3 rounded-xl border border-brand-secondary/35 bg-white/85 px-6 py-12 text-sm font-medium text-brand-primary">
              <Loader2
                className="h-5 w-5 animate-spin text-brand-secondary"
                aria-hidden="true"
              />
              <span>Verifying admin session...</span>
            </div>
          </section>
        ) : !authSession ? (
          <AdminAccessGate onNavigate={onNavigate} />
        ) : (
          <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
            {/* Workspace Header + Tabs */}
            <div className="border-b border-brand-primary/12 pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                    Live Content Management
                  </p>
                  <h1 className="mt-1.5 text-3xl sm:text-4xl font-bold tracking-tight text-brand-primary">
                    Gang Sabarang Dashboard
                  </h1>
                </div>

                <p className="text-xs font-medium text-brand-ink/70">
                  Signed in as{' '}
                  <span className="font-semibold text-brand-primary">
                    {authSession.user.email ?? 'Staff'}
                  </span>
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Admin workspace sections"
                className="mt-6 flex flex-wrap items-center gap-2"
              >
                {ADMIN_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      data-testid={`admin-tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`min-h-[44px] inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary ${
                        isActive
                          ? 'bg-brand-primary text-brand-ivory border border-brand-primary'
                          : 'border border-brand-primary/20 bg-white text-brand-ink hover:bg-brand-primary/6'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tab Panel */}
            <div className="pt-8">
              <DataSyncNotice resourceLabel="admin data" />
              {activeTab === 'menu' ? <AdminMenuManager /> : null}
              {activeTab === 'cottages' ? <AdminCottagesManager /> : null}
              {activeTab === 'gallery' ? <AdminGalleryManager /> : null}
              {activeTab === 'homepage' ? <AdminSiteContentManager /> : null}
              {activeTab === 'contact' ? <AdminContactManager /> : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
