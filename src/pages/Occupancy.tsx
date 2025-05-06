
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateRooms, generateWorkStations } from '@/mock/locations';
import { LocationStatus, Room, WorkStation } from '@/types';
import { cn } from '@/lib/utils';

const statusColors: Record<LocationStatus, string> = {
  available: 'bg-green-100 border-green-300 hover:bg-green-200',
  occupied: 'bg-red-100 border-red-300 hover:bg-red-200',
  reserved: 'bg-amber-100 border-amber-300 hover:bg-amber-200',
  maintenance: 'bg-gray-100 border-gray-300 hover:bg-gray-200',
};

const statusLabels: Record<LocationStatus, string> = {
  available: 'Disponível',
  occupied: 'Ocupado',
  reserved: 'Reservado',
  maintenance: 'Manutenção',
};

const Occupancy = () => {
  const [currentFloor, setCurrentFloor] = useState<string>('1');
  const [rooms] = useState<Room[]>(generateRooms());
  const [workStations] = useState<WorkStation[]>(generateWorkStations());

  const floorRooms = rooms.filter((room) => room.floor === parseInt(currentFloor) as any);
  const floorStations = workStations.filter(
    (station) => station.floor === parseInt(currentFloor) as any
  );

  const fixedStations = floorStations.filter((station) => station.type === 'fixed');
  const flexStations = floorStations.filter((station) => station.type === 'flex');

  const calculateOccupancyRate = (items: Array<Room | WorkStation>) => {
    const occupied = items.filter((item) => item.status === 'occupied').length;
    return {
      total: items.length,
      occupied,
      rate: items.length > 0 ? Math.round((occupied / items.length) * 100) : 0,
    };
  };

  const roomOccupancy = calculateOccupancyRate(floorRooms);
  const stationOccupancy = calculateOccupancyRate(floorStations);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mapa de Ocupação</h1>
        <Select value={currentFloor} onValueChange={setCurrentFloor}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Selecione o andar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1º Andar</SelectItem>
            <SelectItem value="2">2º Andar</SelectItem>
            <SelectItem value="3">3º Andar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taxa de Ocupação do Andar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Salas</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{roomOccupancy.rate}%</p>
                  <p className="text-sm text-muted-foreground pb-1">
                    ({roomOccupancy.occupied}/{roomOccupancy.total})
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Estações</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{stationOccupancy.rate}%</p>
                  <p className="text-sm text-muted-foreground pb-1">
                    ({stationOccupancy.occupied}/{stationOccupancy.total})
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(statusLabels).map(([status, label]) => (
                <Badge
                  key={status}
                  variant="outline"
                  className={cn("px-3 py-1", statusColors[status as LocationStatus])}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="rooms">Salas</TabsTrigger>
          <TabsTrigger value="stations">Estações</TabsTrigger>
        </TabsList>
        <TabsContent value="rooms" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Salas - {currentFloor}º Andar</CardTitle>
              <CardDescription>
                Total: {floorRooms.length} salas | Ocupadas:{' '}
                {floorRooms.filter((room) => room.status === 'occupied').length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="floor-map grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {floorRooms.map((room) => (
                  <div
                    key={room.id}
                    className={cn(
                      "room border-2 rounded-md p-3 cursor-pointer transition-all text-center relative",
                      statusColors[room.status]
                    )}
                  >
                    <div className="text-lg font-bold">{room.number}</div>
                    <div className="text-xs text-gray-600">
                      {room.area}m² | {room.capacity} pessoas
                    </div>
                    <div className="text-xs mt-1 font-medium">
                      {statusLabels[room.status]}
                    </div>
                    {room.clientId && (
                      <Badge variant="secondary" className="mt-2 w-full">
                        Cliente #{room.clientId.replace('client', '')}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estações - {currentFloor}º Andar</CardTitle>
              <CardDescription>
                Fixas: {fixedStations.length} | Flex: {flexStations.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Estações Fixas</h3>
                <div className="floor-map grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                  {fixedStations.map((station) => (
                    <div
                      key={station.id}
                      className={cn(
                        "workstation w-16 h-16 rounded-full flex items-center justify-center transition-all border-2",
                        statusColors[station.status]
                      )}
                    >
                      <div className="text-center">
                        <div className="font-bold">{station.number.split('-')[1]}</div>
                        <div className="text-[10px] font-medium">
                          {station.status === 'occupied' ? 'Ocupado' : 'Livre'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Estações Flex</h3>
                <div className="floor-map grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                  {flexStations.map((station) => (
                    <div
                      key={station.id}
                      className={cn(
                        "workstation w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 border-dashed",
                        statusColors[station.status]
                      )}
                    >
                      <div className="text-center">
                        <div className="font-bold">{station.number.split('-')[1]}</div>
                        <div className="text-[10px] font-medium">Flex</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Occupancy;
