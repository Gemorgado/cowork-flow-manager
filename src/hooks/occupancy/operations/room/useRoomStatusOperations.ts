
import { useState, useCallback } from 'react';
import { Room, LocationStatus } from '@/types';
import { handleUpdateRoomStatus } from '../roomOperations';

/**
 * Hook for handling room status operations
 */
export function useRoomStatusOperations(
  rooms: Room[], 
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>,
  fetchRooms: () => Promise<Room[]>
) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Handler for updating room status
  const updateRoomStatus = useCallback(async (roomId: string, status: LocationStatus, clientId?: string) => {
    try {
      setIsUpdatingStatus(true);
      console.log(`useRoomStatusOperations.updateRoomStatus - roomId: ${roomId}, status: ${status}, clientId: ${clientId}`);
      
      // Update local state optimistically - maintain room order by sorting after update
      setRooms((prevRooms): Room[] => {
        const updatedRooms = prevRooms.map(room => 
          room.id === roomId ? { ...room, status, clientId: clientId !== undefined ? clientId : room.clientId } : room
        );
        
        // Sort rooms by floor and then by room number
        return [...updatedRooms].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        });
      });
      
      // Make API call
      const success = await handleUpdateRoomStatus(roomId, status, clientId, () => {
        console.log("Room status updated successfully, refreshing rooms");
        fetchRooms().then(rooms => {
          // Sort rooms before setting state
          const sortedRooms = [...rooms].sort((a, b) => {
            if (a.floor !== b.floor) return a.floor - b.floor;
            return parseInt(a.number) - parseInt(b.number);
          });
          setRooms(sortedRooms);
        });
      });
      
      // Revert on failure and refetch to ensure UI is in sync
      if (!success) {
        console.log("Failed to update room status, refreshing data");
        fetchRooms().then(rooms => {
          const sortedRooms = [...rooms].sort((a, b) => {
            if (a.floor !== b.floor) return a.floor - b.floor;
            return parseInt(a.number) - parseInt(b.number);
          });
          setRooms(sortedRooms);
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error in updateRoomStatus:", error);
      fetchRooms().then(rooms => {
        const sortedRooms = [...rooms].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        });
        setRooms(sortedRooms);
      });
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [setRooms, fetchRooms]);

  return {
    updateRoomStatus,
    isUpdatingStatus
  };
}
