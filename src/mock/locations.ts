
import { Room, WorkStation, LocationStatus } from '../types';

// Generate mock rooms
export const generateRooms = (): Room[] => {
  const rooms: Room[] = [];
  
  // Pavimento 1: Salas 101-107
  for (let i = 1; i <= 7; i++) {
    rooms.push({
      id: `r1${i.toString().padStart(2, '0')}`,
      number: `10${i}`,
      floor: 1,
      status: Math.random() > 0.3 ? 'occupied' : 'available',
      clientId: Math.random() > 0.3 ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
      area: Math.floor(Math.random() * 20) + 15, // 15-35m²
      capacity: Math.floor(Math.random() * 6) + 2, // 2-8 pessoas
    });
  }
  
  // Pavimento 2: Salas 201-219
  for (let i = 1; i <= 19; i++) {
    const roomNumber = i < 10 ? `20${i}` : `2${i}`;
    rooms.push({
      id: `r2${i.toString().padStart(2, '0')}`,
      number: roomNumber,
      floor: 2,
      status: Math.random() > 0.5 ? 'occupied' : 'available',
      clientId: Math.random() > 0.5 ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
      area: Math.floor(Math.random() * 25) + 20, // 20-45m²
      capacity: Math.floor(Math.random() * 8) + 3, // 3-11 pessoas
    });
  }
  
  // Pavimento 3: Salas 301-310
  for (let i = 1; i <= 10; i++) {
    rooms.push({
      id: `r3${i.toString().padStart(2, '0')}`,
      number: `30${i}`,
      floor: 3,
      status: Math.random() > 0.7 ? 'occupied' : 'available',
      clientId: Math.random() > 0.7 ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
      area: Math.floor(Math.random() * 30) + 25, // 25-55m²
      capacity: Math.floor(Math.random() * 10) + 4, // 4-14 pessoas
    });
  }
  
  // Define 2 salas como em manutenção
  const maintenanceIndices = [
    Math.floor(Math.random() * 7),
    Math.floor(Math.random() * 19) + 7,
  ];
  
  maintenanceIndices.forEach((index) => {
    if (rooms[index]) {
      rooms[index].status = 'maintenance';
      rooms[index].clientId = undefined;
    }
  });
  
  // Define 3 salas como reservadas
  const reservedIndices = [
    Math.floor(Math.random() * 7),
    Math.floor(Math.random() * 19) + 7,
    Math.floor(Math.random() * 10) + 26,
  ];
  
  reservedIndices.forEach((index) => {
    if (rooms[index] && rooms[index].status !== 'maintenance') {
      rooms[index].status = 'reserved';
    }
  });
  
  return rooms;
};

// Generate mock workstations
export const generateWorkStations = (): WorkStation[] => {
  const stations: WorkStation[] = [];
  
  // Pavimento 1: 26 estações (mix de flex e fixas)
  for (let i = 1; i <= 26; i++) {
    // First 13 are fixed, rest are flex type
    const type = i <= 13 ? 'fixed' : 'flex';
    
    // For fixed stations, status can be occupied or available
    // For flex type stations, status can be 'flex' (showing it's part of a flex plan)
    let status: LocationStatus;
    if (type === 'fixed') {
      status = Math.random() > 0.4 ? 'occupied' : 'available';
    } else {
      // For flex type stations, randomly mark some as 'flex' (allocated as part of flex plan)
      status = Math.random() > 0.7 ? 'flex' : 'available';
    }
    
    stations.push({
      id: `s1${i.toString().padStart(2, '0')}`,
      number: `F1-${i}`,
      floor: 1,
      type,
      status,
      clientId: status === 'occupied' ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
    });
  }
  
  // Pavimento 2: 38 estações (mix de flex e fixas)
  for (let i = 1; i <= 38; i++) {
    // First 19 are fixed, rest are flex type
    const type = i <= 19 ? 'fixed' : 'flex';
    
    // Determine status based on type
    let status: LocationStatus;
    if (type === 'fixed') {
      status = Math.random() > 0.6 ? 'occupied' : 'available';
    } else {
      // For flex type stations, randomly mark some as 'flex' (allocated as part of flex plan)
      status = Math.random() > 0.6 ? 'flex' : 'available';
    }
    
    stations.push({
      id: `s2${i.toString().padStart(2, '0')}`,
      number: `F2-${i}`,
      floor: 2,
      type,
      status,
      clientId: status === 'occupied' ? `client${Math.floor(Math.random() * 5) + 1}` : undefined,
    });
  }
  
  // Add a few maintenance and reserved stations
  const maintenanceIndices = [
    Math.floor(Math.random() * 26),
    Math.floor(Math.random() * 38) + 26,
  ];
  
  maintenanceIndices.forEach((index) => {
    if (stations[index] && stations[index].status === 'available') {
      stations[index].status = 'maintenance';
      stations[index].clientId = undefined;
    }
  });
  
  const reservedIndices = [
    Math.floor(Math.random() * 26),
    Math.floor(Math.random() * 38) + 26,
  ];
  
  reservedIndices.forEach((index) => {
    if (stations[index] && stations[index].status === 'available') {
      stations[index].status = 'reserved';
    }
  });
  
  return stations;
};

// Helper function to get random status for map visualization
export const getRandomStatus = (): LocationStatus => {
  const statuses: LocationStatus[] = ['available', 'occupied', 'flex', 'reserved', 'maintenance'];
  const weights = [0.3, 0.4, 0.1, 0.1, 0.1]; // 30% available, 40% occupied, 10% flex, 10% reserved, 10% maintenance
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return statuses[i];
    }
  }
  
  return 'available';
};
