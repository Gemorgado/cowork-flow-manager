
import { useCallback } from 'react';
import { Room } from '@/types';
import { useRoomStatusOperations } from './room/useRoomStatusOperations';
import { useRoomDetailsOperations } from './room/useRoomDetailsOperations';
import { useRoomClientOperations } from './room/useRoomClientOperations';
import { sortRooms } from './room/utils/sortRooms';

/**
 * Main hook for room operations - combines all smaller operation hooks
 */
export function useRoomOperations(
  rooms: Room[], 
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>, 
  fetchRooms: () => Promise<Room[]>
) {
  // Room status operations
  const { 
    updateRoomStatus, 
    isUpdatingStatus 
  } = useRoomStatusOperations(rooms, setRooms, fetchRooms);

  // Room details operations
  const { 
    updateRoomDetails, 
    isUpdatingDetails 
  } = useRoomDetailsOperations(rooms, setRooms, fetchRooms);

  // Room client operations
  const { 
    linkClientToRoom, 
    unlinkClientFromRoom,
    isLinking,
    isUnlinking
  } = useRoomClientOperations(rooms, setRooms, fetchRooms);

  // Utility function for refreshing rooms with proper sorting
  const refreshRooms = useCallback(async () => {
    const fetchedRooms = await fetchRooms();
    setRooms(sortRooms(fetchedRooms));
  }, [fetchRooms, setRooms]);

  return {
    // Operations
    updateRoomStatus,
    updateRoomDetails,
    linkClientToRoom,
    unlinkClientFromRoom,
    refreshRooms,
    
    // Status indicators
    isUpdatingStatus,
    isUpdatingDetails,
    isLinking,
    isUnlinking
  };
}
