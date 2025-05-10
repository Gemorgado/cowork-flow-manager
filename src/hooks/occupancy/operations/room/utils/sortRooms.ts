
import { Room } from '@/types';

/**
 * Sorts rooms by floor and then by room number
 */
export function sortRooms(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => {
    if (a.floor !== b.floor) return a.floor - b.floor;
    return parseInt(a.number) - parseInt(b.number);
  });
}
