import { useCallback, useEffect, useState } from 'react';
import type { PageRoute } from '../types';
import {
  getRouteDefinition,
  parseRouteFromLocation,
  routeToHash,
} from '../utils/router';

export interface RouteNavigationState {
  readonly currentRoute: PageRoute;
  readonly navigate: (route: PageRoute) => void;
}

function readCurrentRoute(): PageRoute {
  if (typeof window === 'undefined') {
    return 'home';
  }
  return parseRouteFromLocation(window.location.hash, window.location.pathname);
}

export function useRouteNavigation(): RouteNavigationState {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(readCurrentRoute);

  useEffect(() => {
    const syncFromBrowser = () => {
      const nextRoute = readCurrentRoute();
      setCurrentRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', syncFromBrowser);
    window.addEventListener('hashchange', syncFromBrowser);

    return () => {
      window.removeEventListener('popstate', syncFromBrowser);
      window.removeEventListener('hashchange', syncFromBrowser);
    };
  }, []);

  useEffect(() => {
    document.title = getRouteDefinition(currentRoute).pageTitle;
  }, [currentRoute]);

  const navigate = useCallback(
    (route: PageRoute) => {
      const targetHash = routeToHash(route);
      if (window.location.hash !== targetHash) {
        window.history.pushState({ route }, '', targetHash);
      }
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [],
  );

  return { currentRoute, navigate };
}
