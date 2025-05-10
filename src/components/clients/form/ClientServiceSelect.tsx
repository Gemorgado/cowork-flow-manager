
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Service } from '@/types';

// Define a location type since it's not part of the Service type
interface Location {
  id: string;
  name: string;
}

// Mock locations mapping to services
// In a production app, this would come from an API or be part of the service object
const serviceLocationsMap: Record<string, Location[]> = {
  // Define some mock locations for each service - this would typically come from your backend
  'fiscal-address': [
    { id: 'loc1', name: 'Downtown' },
    { id: 'loc2', name: 'Business District' },
  ],
  'flex-station': [
    { id: 'loc3', name: 'Floor 1' },
    { id: 'loc4', name: 'Floor 2' },
  ],
  'fixed-station': [
    { id: 'loc5', name: 'Zone A' },
    { id: 'loc6', name: 'Zone B' },
  ],
  'private-room': [
    { id: 'loc7', name: 'Office Suite 101' },
    { id: 'loc8', name: 'Executive Room 203' },
  ],
};

interface ClientServiceSelectProps {
  services: Service[];
  selectedServiceId: string;
  selectedLocationIds: string[];
  onServiceChange: (serviceId: string, locationIds: string[]) => void;
  errors?: Record<string, string[]>;
  disabled?: boolean;
}

export const ClientServiceSelect: React.FC<ClientServiceSelectProps> = ({
  services,
  selectedServiceId,
  selectedLocationIds,
  onServiceChange,
  errors = {},
  disabled = false,
}) => {
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);

  // Update available locations when selected service changes
  useEffect(() => {
    if (selectedServiceId) {
      const selectedService = services.find(service => service.id === selectedServiceId);
      if (selectedService) {
        // Use the type or id from the service to get the locations
        const serviceType = selectedService.type;
        const locationKey = selectedService.id;
        
        // Try to get locations by exact ID first, then by type as fallback
        const locations = serviceLocationsMap[locationKey] || 
                          serviceLocationsMap[serviceType] || 
                          [];
        
        setAvailableLocations(locations);
      } else {
        setAvailableLocations([]);
      }
    } else {
      setAvailableLocations([]);
    }
  }, [selectedServiceId, services]);

  const handleServiceChange = (serviceId: string) => {
    // Reset location selection when service changes
    onServiceChange(serviceId, []);
  };

  const handleLocationChange = (locationId: string, checked: boolean) => {
    let updatedLocations: string[];
    
    if (checked) {
      updatedLocations = [...selectedLocationIds, locationId];
    } else {
      updatedLocations = selectedLocationIds.filter(id => id !== locationId);
    }
    
    onServiceChange(selectedServiceId, updatedLocations);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="service-select">
          Serviço Contratado <span className="text-destructive">*</span>
        </Label>
        <Select
          value={selectedServiceId || ""}
          onValueChange={handleServiceChange}
          disabled={disabled}
        >
          <SelectTrigger id="service-select" className={errors.selectedServiceId ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecione um serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Serviços Disponíveis</SelectLabel>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.selectedServiceId && (
          <p className="text-xs text-destructive">{errors.selectedServiceId[0]}</p>
        )}
      </div>

      {selectedServiceId && availableLocations.length > 0 && (
        <div className="space-y-3">
          <Label>Localidades</Label>
          <div className="border rounded-md p-4 space-y-2">
            {availableLocations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location.id}`}
                  checked={selectedLocationIds.includes(location.id)}
                  onCheckedChange={(checked) => 
                    handleLocationChange(location.id, checked === true)
                  }
                  disabled={disabled}
                />
                <Label
                  htmlFor={`location-${location.id}`}
                  className="cursor-pointer"
                >
                  {location.name}
                </Label>
              </div>
            ))}
          </div>
          {errors.locationIds && (
            <p className="text-xs text-destructive">{errors.locationIds[0]}</p>
          )}
        </div>
      )}
    </div>
  );
};
