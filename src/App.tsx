/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Layout } from './components/layout/Layout';
import { SiteDataProvider } from './context/SiteDataContext';
import { useRouteNavigation } from './hooks/useRouteNavigation';
import { AdminPage } from './pages/AdminPage';
import { ContactPage } from './pages/ContactPage';
import { CottagesPage } from './pages/CottagesPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { RestaurantPage } from './pages/RestaurantPage';
import type { PageRoute } from './types';

function renderPublicPage(
  route: Exclude<PageRoute, 'admin'>,
  onNavigate: (nextRoute: PageRoute) => void,
) {
  switch (route) {
    case 'home':
      return <HomePage onNavigate={onNavigate} />;
    case 'restaurant':
      return <RestaurantPage onNavigate={onNavigate} />;
    case 'menu':
      return <MenuPage onNavigate={onNavigate} />;
    case 'cottages':
      return <CottagesPage onNavigate={onNavigate} />;
    case 'gallery':
      return <GalleryPage />;
    case 'contact':
      return <ContactPage />;
  }
}

function AppRouter() {
  const { currentRoute, navigate } = useRouteNavigation();

  if (currentRoute === 'admin') {
    return <AdminPage onNavigate={navigate} />;
  }

  return (
    <Layout currentRoute={currentRoute} onNavigate={navigate}>
      {renderPublicPage(currentRoute, navigate)}
    </Layout>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <AppRouter />
    </SiteDataProvider>
  );
}
