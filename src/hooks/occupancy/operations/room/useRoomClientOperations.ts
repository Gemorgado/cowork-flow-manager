
import { useState, useCallback } from 'react';
import { Room, LocationStatus } from '@/types';
import { handleLinkClientToRoom, handleUnlinkClientFromRoom } from '../roomOperations';

/**
 * Hook for handling room client operations (linking/unlinking)
 */
export function useRoomClientOperations(
  rooms: Room[], 
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>,
  fetchRooms: () => Promise<Room[]>
) {
  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  // Handler for linking a client to a room
  const linkClientToRoom = useCallback(async (roomId: string, clientId: string) => {
    try {
      setIsLinking(true);
      console.log(`useRoomClientOperations.linkClientToRoom - roomId: ${roomId}, clientId: ${clientId}`);
      
      // Update local state optimistically while maintaining sort order
      setRooms((prevRooms): Room[] => {
        const updatedRooms = prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, clientId, status: 'occupied' as LocationStatus } 
            : room
        );
        
        // Sort rooms by floor and then by room number
        return [...updatedRooms].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        });
      });
      
      // Make API call
      const success = await handleLinkClientToRoom(
        roomId,
        clientId,
        () => {
          console.log("Successfully linked client, refreshing data");
          fetchRooms().then(rooms => {
            const sortedRooms = [...rooms].sort((a, b) => {
              if (a.floor !== b.floor) return a.floor - b.floor;
              return parseInt(a.number) - parseInt(b.number);
            });
            setRooms(sortedRooms);
          });
        }
      );
      
      // Revert on failure and refetch to ensure UI is in sync
      if (!success) {
        console.log("Failed to link client, reverting UI state");
        fetchRooms().then(rooms => {
          const sortedRooms = [...rooms].sort((a, b) => {
            if (a.floor !== b.floor) return a.floor - b.floor;
            return parseInt(a.number) - parseInt(b.number);
          });
          setRooms(sortedRooms);
        });
      }
    } catch (error) {
      console.error("Error in linkClientToRoom:", error);
      fetchRooms().then(rooms => {
        const sortedRooms = [...rooms].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        });
        setRooms(sortedRooms);
      });
    } finally {
      setIsLinking(false);
    }
  }, [setRooms, fetchRooms]);

  // Handler for unlinking a client from a room
  const unlinkClientFromRoom = useCallback(async (roomId: string) => {
    try {
      setIsUnlinking(true);
      console.log(`useRoomClientOperations.unlinkClientFromRoom - roomId: ${roomId}`);
      
      // Update local state optimistically while maintaining sort order
      setRooms((prevRooms): Room[] => {
        const updatedRooms = prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, clientId: undefined, status: 'available' as LocationStatus } 
            : room
        );
        
        // Sort rooms by floor and then by room number
        return [...updatedRooms].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        });
      });
      
      // Make API call with proper error handling
      const success = await handleUnlinkClientFromRoom(
        roomId,
        () => {
          console.log("Successfully unlinked client, refreshing data");
          fetchRooms().then(rooms => {
            const sortedRooms = [...rooms].sort((a, b) => {
              if (a.floor !== b.floor) return a.floor - b.floor;
              return parseInt(a.number) - parseInt(b.number);
            });
            setRooms(sortedRooms);
          });
        }
      );
      
      // Revert on failure and refetch to ensure UI is in sync
      if (!success) {
        console.log("Failed to unlink client, reverting UI state");
        fetchRooms().then(rooms => {
          const sortedRooms = [...rooms].sort((a, b) => {
            if (a.floor !== b.floor) return a.floor - b.floor;
            return parseInt(a.number) - parseInt(b.number);
          });
          setRooms(sortedRooms);
        });
      } else {
        console.log("Unlink operation completed successfully");
      }
    } catch (error) {
      console.error("Error in unlinkClientFromRoom:", error);
      fetchRooms().then(rooms => {
        const sortedRooms = [...rooms].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        });
        setRooms(sortedRooms);
      });
    } finally {
      setIsUnlinking(false);
    }
  }, [setRooms, fetchRooms]);

  return {
    linkClientToRoom,
    unlinkClientFromRoom,
    isLinking,
    isUnlinking
  };
}
