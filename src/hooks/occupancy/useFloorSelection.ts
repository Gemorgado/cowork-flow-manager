
import { useState } from 'react';

/**
 * Hook for managing floor selection
 */
export function useFloorSelection(initialFloor: string = '1') {
  const [currentFloor, setCurrentFloor] = useState<string>(initialFloor);
  
  return {
    currentFloor,
    setCurrentFloor,
  };
}
