import test from 'node:test';
import assert from 'node:assert/strict';
import { filterRoomTypes, getClimateLabel } from './cottageFilter';
import type { RoomType } from '../types';

const SAMPLE_ROOMS: readonly RoomType[] = [
  {
    id: 'room-1',
    name: 'Non-AC Single',
    type: 'Non-AC Single',
    price: 3000,
    capacity: 1,
    facilities: ['Fan', 'Balcony'],
    images: ['/img/room1.jpg'],
    isAvailable: true,
    description: 'Cozy single room',
  },
  {
    id: 'room-2',
    name: 'Non-AC Double',
    type: 'Non-AC Double',
    price: 5000,
    capacity: 2,
    facilities: ['Fan', 'Lake View'],
    images: ['/img/room2.jpg'],
    isAvailable: true,
    description: 'Spacious double room',
  },
  {
    id: 'room-3',
    name: 'AC Single',
    type: 'AC Single',
    price: 5000,
    capacity: 1,
    facilities: ['AC', 'WiFi'],
    images: ['/img/room3.jpg'],
    isAvailable: true,
    description: 'Air conditioned single',
  },
  {
    id: 'room-4',
    name: 'AC Double',
    type: 'AC Double',
    price: 7000,
    capacity: 2,
    facilities: ['AC', 'Balcony'],
    images: ['/img/room4.jpg'],
    isAvailable: false,
    description: 'Luxury AC double',
  },
];

test('filterRoomTypes returns all cottages for All', () => {
  const all = filterRoomTypes(SAMPLE_ROOMS, 'All');
  assert.equal(all.length, 4);
});

test('filterRoomTypes separates Non-AC and AC room types accurately', () => {
  const nonAc = filterRoomTypes(SAMPLE_ROOMS, 'Non-AC');
  assert.deepEqual(
    nonAc.map((r) => r.name),
    ['Non-AC Single', 'Non-AC Double'],
  );

  const ac = filterRoomTypes(SAMPLE_ROOMS, 'AC');
  assert.deepEqual(
    ac.map((r) => r.name),
    ['AC Single', 'AC Double'],
  );
});

test('getClimateLabel classifies Non-AC vs AC correctly', () => {
  assert.equal(getClimateLabel('Non-AC Single'), 'Non-AC');
  assert.equal(getClimateLabel('AC Double'), 'AC');
});
