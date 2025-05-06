
import { fiscalAddressService } from './fiscal-address';
import { flexStationService } from './flex-station';
import { fixedStationService } from './fixed-station';
import { privateRoomService } from './private-room';
import { Service } from './types';

// Combined services array
export const services: Service[] = [
  fiscalAddressService,
  flexStationService,
  fixedStationService,
  privateRoomService
];

// Export individual services for direct access
export {
  fiscalAddressService,
  flexStationService,
  fixedStationService,
  privateRoomService
};

// Re-export types
export * from './types';
