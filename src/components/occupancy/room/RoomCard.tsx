
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Room } from '@/types';
import { statusColors, statusLabels } from '../StatusLegend';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RoomDetailsDialogContent } from './dialogs';
import { useRoomClientLink } from '@/hooks/occupancy/useRoomClientLink';
import { ClientLinkDialog } from './dialogs/ClientLinkDialog';
import { clients } from '@/mock/clients';

interface RoomCardProps {
  room: Room;
  hoveredRoomId?: string | null;
  setHoveredRoomId?: (id: string | null) => void;
  getClientInfo?: (clientId?: string) => string;
  onUpdateStatus?: (roomId: string, status: Room['status']) => Promise<boolean>;
  onLinkClient?: (roomId: string, clientId: string) => void;
  onUnlinkClient?: (roomId: string) => void;
  onUpdateRoomDetails?: (roomId: string, data: { area?: number, capacity?: number }) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  hoveredRoomId,
  setHoveredRoomId,
  getClientInfo = (clientId?: string) => {
    if (!clientId) return "Nenhum cliente";
    const client = clients.find(c => c.id === clientId);
    return client ? client.companyName : `Cliente #${clientId.substring(0, 8)}`;
  },
  onUpdateStatus,
  onLinkClient,
  onUnlinkClient,
  onUpdateRoomDetails
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  
  const { 
    selectedRoom,
    isClientLinkDialogOpen,
    selectedClientId,
    isLinking,
    isLoadingClients,
    availableClients,
    setSelectedClientId,
    openClientLinkDialog,
    closeClientLinkDialog,
    handleLinkClient
  } = useRoomClientLink(() => {
    if (onLinkClient && selectedClientId && selectedRoom) {
      onLinkClient(selectedRoom.id, selectedClientId);
      // Close the dialog when the operation completes
      setShowDialog(false);
    }
  });

  const handleCloseDialog = () => {
    console.log("RoomCard: Closing dialog");
    setShowDialog(false);
  };

  const handleUpdateStatus = async (roomId: string, status: Room['status']) => {
    console.log(`RoomCard.handleUpdateStatus - roomId: ${roomId}, status: ${status}`);
    if (onUpdateStatus) {
      try {
        const success = await onUpdateStatus(roomId, status);
        console.log("Status update result:", success);
        if (success) {
          console.log("Status updated successfully");
          // Close dialog on success (optional)
          // setShowDialog(false);
        }
        return success;
      } catch (error) {
        console.error("Error in handleUpdateStatus:", error);
        return false;
      }
    } else {
      console.warn("onUpdateStatus callback is not defined");
      return false;
    }
  };

  const handleUnlinkClient = async (roomId: string) => {
    console.log(`RoomCard.handleUnlinkClient - roomId: ${roomId}`);
    if (onUnlinkClient) {
      try {
        console.log("Calling onUnlinkClient from RoomCard");
        onUnlinkClient(roomId);
        console.log("onUnlinkClient completed, closing dialog");
        // Close the dialog when the operation completes
        setShowDialog(false);
      } catch (error) {
        console.error("Error in handleUnlinkClient:", error);
      }
    } else {
      console.warn("onUnlinkClient callback is not defined");
    }
  };

  // Using the room's ID as key keeps component in the same position after updates
  const dialogKey = `room-dialog-${room.id}`;

  // Get client name to display
  const clientName = getClientInfo(room.clientId);

  return (
    <>
      <Dialog key={dialogKey} open={showDialog} onOpenChange={setShowDialog}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <div
                className={cn(
                  "rounded-xl backdrop-blur-sm bg-white/5 p-3 flex flex-col",
                  "shadow-md shadow-black/10 cursor-pointer",
                  "hover:-translate-y-0.5 hover:shadow-lg/20 transition-all duration-150",
                  statusColors[room.status].replace('bg-', 'bg-opacity-20 bg-')
                )}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setHoveredRoomId && setHoveredRoomId(room.id);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredRoomId && setHoveredRoomId(null);
                }}
                onClick={() => setShowDialog(true)}
              >
                <span className="text-sm font-medium mb-1 text-muted-foreground">{room.number}</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "w-fit px-2 py-0.5 rounded-full text-xs",
                    statusColors[room.status].replace('bg-', 'bg-opacity-90 bg-')
                  )}
                >
                  {statusLabels[room.status]}
                </Badge>
                {room.clientId && (
                  <div className="mt-1 text-[9px] text-muted-foreground truncate">
                    {clientName}
                  </div>
                )}
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="backdrop-blur-md bg-black/40 border-white/10">
            <div className="p-1 text-sm">
              <div className="font-medium">Sala {room.number}</div>
              <div>Status: {statusLabels[room.status]}</div>
              <div>Área: {room.area}m²</div>
              <div>Capacidade: {room.capacity} pessoas</div>
              {room.clientId && <div>Cliente: {clientName}</div>}
            </div>
          </TooltipContent>
        </Tooltip>
        <DialogContent>
          <RoomDetailsDialogContent 
            room={room} 
            getClientInfo={getClientInfo} 
            onClose={handleCloseDialog}
            onUpdateStatus={handleUpdateStatus}
            onLinkClient={onLinkClient}
            onUnlinkClient={handleUnlinkClient}
            onUpdateRoomDetails={onUpdateRoomDetails}
            availableClients={availableClients}
            openLinkDialog={openClientLinkDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Client Link Dialog */}
      {selectedRoom && (
        <ClientLinkDialog
          isOpen={isClientLinkDialogOpen}
          onOpenChange={closeClientLinkDialog}
          selectedRoom={selectedRoom}
          selectedClientId={selectedClientId}
          setSelectedClientId={setSelectedClientId}
          availableClients={availableClients}
          isLoadingClients={isLoadingClients}
          handleClientLink={handleLinkClient}
          isLinking={isLinking}
        />
      )}
    </>
  );
};
