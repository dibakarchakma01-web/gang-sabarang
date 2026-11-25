import type { PageRoute } from '../types';

export interface RouteDefinition {
  readonly route: PageRoute;
  readonly label: string;
  readonly path: string;
  readonly hash: string;
  readonly pageTitle: string;
}

export const ROUTE_DEFINITIONS: readonly RouteDefinition[] = [
  {
    route: 'home',
    label: 'Home',
    path: '/',
    hash: '#/',
    pageTitle: 'Gang Sabarang | Restaurant & Cottage in Rangamati',
  },
  {
    route: 'restaurant',
    label: 'Restaurant',
    path: '/restaurant',
    hash: '#/restaurant',
    pageTitle: 'Restaurant & Dining | Gang Sabarang in Rangamati',
  },
  {
    route: 'menu',
    label: 'Menu',
    path: '/menu',
    hash: '#/menu',
    pageTitle: 'Restaurant Menu & Pricing | Gang Sabarang in Rangamati',
  },
  {
    route: 'cottages',
    label: 'Cottages',
    path: '/cottages',
    hash: '#/cottages',
    pageTitle: 'Nature Cottages & Rates | Gang Sabarang in Rangamati',
  },
  {
    route: 'gallery',
    label: 'Gallery',
    path: '/gallery',
    hash: '#/gallery',
    pageTitle: 'Photo Gallery | Gang Sabarang in Rangamati',
  },
  {
    route: 'contact',
    label: 'Contact',
    path: '/contact',
    hash: '#/contact',
    pageTitle: 'Contact Us & Location | Gang Sabarang in Rangamati',
  },
  {
    route: 'admin',
    label: 'Admin',
    path: '/admin/login/gs',
    hash: '#admin/login/gs',
    pageTitle: 'Admin Portal | Gang Sabarang',
  },
] as const;

export const PUBLIC_ROUTE_DEFINITIONS: readonly RouteDefinition[] =
  ROUTE_DEFINITIONS.filter((definition) => definition.route !== 'admin');

const VALID_ROUTES = new Set<PageRoute>(
  ROUTE_DEFINITIONS.map((definition) => definition.route),
);

export function isValidRoute(value: string): value is PageRoute {
  return VALID_ROUTES.has(value as PageRoute);
}

export function normalizeRouteSegment(raw: string): PageRoute {
  const cleaned = raw
    .trim()
    .replace(/^#/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .toLowerCase();

  if (cleaned === '' || cleaned === 'home') {
    return 'home';
  }

  if (cleaned.startsWith('admin') || cleaned.includes('login/gs')) {
    return 'admin';
  }

  return isValidRoute(cleaned) ? cleaned : 'home';
}

export function parseRouteFromLocation(
  hash: string,
  pathname: string,
): PageRoute {
  if (hash && hash !== '#') {
    return normalizeRouteSegment(hash);
  }
  return normalizeRouteSegment(pathname);
}

export function routeToHash(route: PageRoute): string {
  const definition = ROUTE_DEFINITIONS.find((item) => item.route === route);
  return definition ? definition.hash : '#/';
}

export function getRouteDefinition(route: PageRoute): RouteDefinition {
  return (
    ROUTE_DEFINITIONS.find((item) => item.route === route) ??
    ROUTE_DEFINITIONS[0]
  );
}
