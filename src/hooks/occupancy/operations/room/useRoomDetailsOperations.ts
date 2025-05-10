
import { useState, useCallback } from 'react';
import { Room } from '@/types';
import { handleUpdateRoomDetails } from '../roomOperations';

/**
 * Hook for handling room details operations
 */
export function useRoomDetailsOperations(
  rooms: Room[], 
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>,
  fetchRooms: () => Promise<Room[]>
) {
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);

  // Handler for updating room details
  const updateRoomDetails = useCallback(async (roomId: string, data: { area?: number, capacity?: number }) => {
    try {
      setIsUpdatingDetails(true);
      console.log(`useRoomDetailsOperations.updateRoomDetails - roomId: ${roomId}, data:`, data);
      
      // Update local state optimistically while maintaining sort order
      setRooms((prevRooms): Room[] => 
        [...prevRooms.map(room => 
          room.id === roomId 
            ? { 
                ...room, 
                area: data.area !== undefined ? data.area : room.area,
                capacity: data.capacity !== undefined ? data.capacity : room.capacity
              } 
            : room
        )].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        })
      );
      
      // Make API call
      const success = await handleUpdateRoomDetails(roomId, data, () => {
        console.log("Room details updated successfully, refreshing rooms");
        fetchRooms().then(rooms => {
          const sortedRooms = [...rooms].sort((a, b) => {
            if (a.floor !== b.floor) return a.floor - b.floor;
            return parseInt(a.number) - parseInt(b.number);
          });
          setRooms(sortedRooms);
        });
      });
      
      // Revert on failure and refetch to ensure UI is in sync
      if (!success) {
        console.log("Failed to update room details, refreshing data");
        fetchRooms().then(rooms => {
          const sortedRooms = [...rooms].sort((a, b) => {
            if (a.floor !== b.floor) return a.floor - b.floor;
            return parseInt(a.number) - parseInt(b.number);
          });
          setRooms(sortedRooms);
        });
      }
    } catch (error) {
      console.error("Error in updateRoomDetails:", error);
      fetchRooms().then(rooms => {
        const sortedRooms = [...rooms].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        });
        setRooms(sortedRooms);
      });
    } finally {
      setIsUpdatingDetails(false);
    }
  }, [setRooms, fetchRooms]);

  return {
    updateRoomDetails,
    isUpdatingDetails
  };
}
