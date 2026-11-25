import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PUBLIC_ROUTE_DEFINITIONS,
  ROUTE_DEFINITIONS,
  getRouteDefinition,
  isValidRoute,
  normalizeRouteSegment,
  parseRouteFromLocation,
  routeToHash,
} from './router';

test('ROUTE_DEFINITIONS covers all 7 required routes and PUBLIC_ROUTE_DEFINITIONS excludes admin', () => {
  assert.deepEqual(
    ROUTE_DEFINITIONS.map((item) => item.route),
    ['home', 'restaurant', 'menu', 'cottages', 'gallery', 'contact', 'admin'],
  );
  assert.deepEqual(
    PUBLIC_ROUTE_DEFINITIONS.map((item) => item.route),
    ['home', 'restaurant', 'menu', 'cottages', 'gallery', 'contact'],
  );
});

test('isValidRoute validates known PageRoute values and rejects unknown ones', () => {
  assert.equal(isValidRoute('home'), true);
  assert.equal(isValidRoute('cottages'), true);
  assert.equal(isValidRoute('admin'), true);
  assert.equal(isValidRoute('unknown'), false);
});

test('parseRouteFromLocation prioritizes hash and falls back cleanly to pathname or home', () => {
  assert.equal(parseRouteFromLocation('#/menu', '/'), 'menu');
  assert.equal(parseRouteFromLocation('#cottages', '/'), 'cottages');
  assert.equal(parseRouteFromLocation('#/', '/menu'), 'home');
  assert.equal(parseRouteFromLocation('', '/gallery'), 'gallery');
  assert.equal(parseRouteFromLocation('', '/'), 'home');
  assert.equal(parseRouteFromLocation('#/nonexistent', '/'), 'home');
});

test('normalizeRouteSegment and routeToHash map routes consistently', () => {
  assert.equal(normalizeRouteSegment('/Restaurant/'), 'restaurant');
  assert.equal(normalizeRouteSegment(''), 'home');
  assert.equal(routeToHash('home'), '#/');
  assert.equal(routeToHash('contact'), '#/contact');
  assert.equal(
    getRouteDefinition('home').pageTitle,
    'Gang Sabarang | Restaurant & Cottage in Rangamati',
  );
});
