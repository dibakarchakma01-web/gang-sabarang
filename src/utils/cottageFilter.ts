import type { RoomType } from '../types';

export type CottageFilterOption = 'All' | 'Non-AC' | 'AC';

export function filterRoomTypes(
  rooms: readonly RoomType[],
  filter: CottageFilterOption,
): readonly RoomType[] {
  if (filter === 'All') {
    return rooms;
  }

  return rooms.filter((room) => {
    const normalizedType = room.type.toLowerCase();
    if (filter === 'Non-AC') {
      return normalizedType.includes('non-ac');
    }
    return !normalizedType.includes('non-ac') && normalizedType.includes('ac');
  });
}

export function getClimateLabel(roomType: string): 'Non-AC' | 'AC' {
  return roomType.toLowerCase().includes('non-ac') ? 'Non-AC' : 'AC';
}
