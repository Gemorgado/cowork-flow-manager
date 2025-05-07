
import { useCallback } from 'react';
import { Room } from '@/types';
import { 
  handleUpdateRoomStatus, 
  handleUpdateRoomDetails, 
  handleLinkClientToRoom 
} from './roomOperations';

export function useRoomOperations(rooms: Room[], setRooms: (rooms: Room[]) => void, fetchRooms: () => Promise<Room[]>) {
  // Handler for updating room status
  const updateRoomStatus = useCallback(async (roomId: string, status: any, clientId?: string) => {
    // Update local state optimistically
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId ? { ...room, status, clientId } : room
      )
    );
    
    // Make API call
    const success = await handleUpdateRoomStatus(roomId, status, clientId, () => {
      fetchRooms().then(setRooms);
    });
    
    // Revert on failure
    if (!success) {
      fetchRooms().then(setRooms);
    }
  }, [setRooms, fetchRooms]);

  // Handler for updating room details
  const updateRoomDetails = useCallback(async (roomId: string, data: { area?: number, priceClosed?: number }) => {
    // Update local state optimistically
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
          ? { ...room, area: data.area || room.area } 
          : room
      )
    );
    
    // Make API call
    const success = await handleUpdateRoomDetails(roomId, data, () => {
      fetchRooms().then(setRooms);
    });
    
    // Revert on failure
    if (!success) {
      fetchRooms().then(setRooms);
    }
  }, [setRooms, fetchRooms]);

  // Handler for linking a client to a room
  const linkClientToRoom = useCallback(async (roomId: string, clientId: string) => {
    // Update local state optimistically
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
          ? { ...room, clientId, status: 'occupied' } 
          : room
      )
    );
    
    // Make API call
    const success = await handleLinkClientToRoom(
      roomId,
      clientId,
      () => fetchRooms().then(setRooms)
    );
    
    // Revert on failure
    if (!success) {
      fetchRooms().then(setRooms);
    }
  }, [setRooms, fetchRooms]);

  return {
    updateRoomStatus,
    updateRoomDetails,
    linkClientToRoom
  };
}
