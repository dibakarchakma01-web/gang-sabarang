import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_ROOM_TYPES } from '../data/initialData';
import { filterRoomTypes, getClimateLabel } from './cottageFilter';

test('filterRoomTypes returns all 4 verified cottages for All', () => {
  const all = filterRoomTypes(INITIAL_ROOM_TYPES, 'All');
  assert.equal(all.length, 4);
});

test('filterRoomTypes separates Non-AC and AC room types accurately', () => {
  const nonAc = filterRoomTypes(INITIAL_ROOM_TYPES, 'Non-AC');
  assert.deepEqual(
    nonAc.map((r) => r.name),
    ['Non-AC Single', 'Non-AC Double'],
  );

  const ac = filterRoomTypes(INITIAL_ROOM_TYPES, 'AC');
  assert.deepEqual(
    ac.map((r) => r.name),
    ['AC Single', 'AC Double'],
  );
});

test('getClimateLabel classifies Non-AC vs AC correctly', () => {
  assert.equal(getClimateLabel('Non-AC Single'), 'Non-AC');
  assert.equal(getClimateLabel('AC Double'), 'AC');
});
