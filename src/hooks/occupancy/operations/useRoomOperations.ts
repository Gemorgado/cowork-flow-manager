
import { useCallback } from 'react';
import { Room, LocationStatus } from '@/types';
import { 
  handleUpdateRoomStatus, 
  handleUpdateRoomDetails, 
  handleLinkClientToRoom,
  handleUnlinkClientFromRoom
} from './roomOperations';

export function useRoomOperations(
  rooms: Room[], 
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>, 
  fetchRooms: () => Promise<Room[]>
) {
  // Handler for updating room status
  const updateRoomStatus = useCallback(async (roomId: string, status: LocationStatus, clientId?: string) => {
    try {
      console.log(`useRoomOperations.updateRoomStatus - roomId: ${roomId}, status: ${status}, clientId: ${clientId}`);
      
      // Update local state optimistically
      setRooms((prevRooms): Room[] => 
        prevRooms.map(room => 
          room.id === roomId ? { ...room, status, clientId } : room
        )
      );
      
      // Make API call
      const success = await handleUpdateRoomStatus(roomId, status, clientId, () => {
        console.log("Room status updated successfully, refreshing rooms");
        fetchRooms().then(setRooms);
      });
      
      // Revert on failure and refetch to ensure UI is in sync
      if (!success) {
        console.log("Failed to update room status, refreshing data");
        fetchRooms().then(setRooms);
      }
    } catch (error) {
      console.error("Error in updateRoomStatus:", error);
      fetchRooms().then(setRooms); // Always refetch on error to maintain data integrity
    }
  }, [setRooms, fetchRooms]);

  // Handler for updating room details
  const updateRoomDetails = useCallback(async (roomId: string, data: { area?: number, capacity?: number }) => {
    try {
      console.log(`useRoomOperations.updateRoomDetails - roomId: ${roomId}, data:`, data);
      
      // Update local state optimistically
      setRooms((prevRooms): Room[] => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { 
                ...room, 
                area: data.area !== undefined ? data.area : room.area,
                capacity: data.capacity !== undefined ? data.capacity : room.capacity
              } 
            : room
        )
      );
      
      // Make API call
      const success = await handleUpdateRoomDetails(roomId, data, () => {
        console.log("Room details updated successfully, refreshing rooms");
        fetchRooms().then(setRooms);
      });
      
      // Revert on failure and refetch to ensure UI is in sync
      if (!success) {
        console.log("Failed to update room details, refreshing data");
        fetchRooms().then(setRooms);
      }
    } catch (error) {
      console.error("Error in updateRoomDetails:", error);
      fetchRooms().then(setRooms); // Always refetch on error to maintain data integrity
    }
  }, [setRooms, fetchRooms]);

  // Handler for linking a client to a room
  const linkClientToRoom = useCallback(async (roomId: string, clientId: string) => {
    try {
      console.log(`useRoomOperations.linkClientToRoom - roomId: ${roomId}, clientId: ${clientId}`);
      
      // Update local state optimistically 
      setRooms((prevRooms): Room[] => 
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
        () => {
          console.log("Successfully linked client, refreshing data");
          fetchRooms().then(setRooms);
        }
      );
      
      // Revert on failure and refetch to ensure UI is in sync
      if (!success) {
        console.log("Failed to link client, reverting UI state");
        fetchRooms().then(setRooms);
      }
    } catch (error) {
      console.error("Error in linkClientToRoom:", error);
      fetchRooms().then(setRooms); // Always refetch on error to maintain data integrity
    }
  }, [setRooms, fetchRooms]);

  // Handler for unlinking a client from a room
  const unlinkClientFromRoom = useCallback(async (roomId: string) => {
    try {
      console.log(`useRoomOperations.unlinkClientFromRoom - roomId: ${roomId}`);
      
      // Update local state optimistically 
      setRooms((prevRooms): Room[] => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, clientId: undefined, status: 'available' } 
            : room
        )
      );
      
      // Make API call
      const success = await handleUnlinkClientFromRoom(
        roomId,
        () => {
          console.log("Successfully unlinked client, refreshing data");
          fetchRooms().then(setRooms);
        }
      );
      
      // Revert on failure and refetch to ensure UI is in sync
      if (!success) {
        console.log("Failed to unlink client, reverting UI state");
        fetchRooms().then(setRooms);
      } else {
        console.log("Unlink operation completed successfully");
      }
    } catch (error) {
      console.error("Error in unlinkClientFromRoom:", error);
      fetchRooms().then(setRooms); // Always refetch on error to maintain data integrity
    }
  }, [setRooms, fetchRooms]);

  return {
    updateRoomStatus,
    updateRoomDetails,
    linkClientToRoom,
    unlinkClientFromRoom
  };
}
