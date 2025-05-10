
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
      
      // Update local state optimistically - maintain room order by sorting after update
      setRooms((prevRooms): Room[] => 
        [...prevRooms.map(room => 
          room.id === roomId ? { ...room, status, clientId } : room
        )].sort((a, b) => {
          // Sort by floor first, then by room number
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        })
      );
      
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
    } catch (error) {
      console.error("Error in updateRoomStatus:", error);
      fetchRooms().then(rooms => {
        const sortedRooms = [...rooms].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        });
        setRooms(sortedRooms);
      });
    }
  }, [setRooms, fetchRooms]);

  // Handler for updating room details
  const updateRoomDetails = useCallback(async (roomId: string, data: { area?: number, capacity?: number }) => {
    try {
      console.log(`useRoomOperations.updateRoomDetails - roomId: ${roomId}, data:`, data);
      
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
    }
  }, [setRooms, fetchRooms]);

  // Handler for linking a client to a room
  const linkClientToRoom = useCallback(async (roomId: string, clientId: string) => {
    try {
      console.log(`useRoomOperations.linkClientToRoom - roomId: ${roomId}, clientId: ${clientId}`);
      
      // Update local state optimistically while maintaining sort order
      setRooms((prevRooms): Room[] => 
        [...prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, clientId, status: 'occupied' } 
            : room
        )].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        })
      );
      
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
    }
  }, [setRooms, fetchRooms]);

  // Handler for unlinking a client from a room
  const unlinkClientFromRoom = useCallback(async (roomId: string) => {
    try {
      console.log(`useRoomOperations.unlinkClientFromRoom - roomId: ${roomId}`);
      
      // Update local state optimistically while maintaining sort order
      setRooms((prevRooms): Room[] => 
        [...prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, clientId: undefined, status: 'available' } 
            : room
        )].sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return parseInt(a.number) - parseInt(b.number);
        })
      );
      
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
    }
  }, [setRooms, fetchRooms]);

  return {
    updateRoomStatus,
    updateRoomDetails,
    linkClientToRoom,
    unlinkClientFromRoom
  };
}
