
import React from 'react';
import { Button } from '@/components/ui/button';

interface TestControlsProps {
  onAllocateTest: () => void;
  onReleaseTest: () => void;
}

export const TestControls: React.FC<TestControlsProps> = ({
  onAllocateTest,
  onReleaseTest
}) => {
  return (
    <div className="flex gap-4">
      <Button 
        variant="outline" 
        onClick={onAllocateTest}
        className="bg-yellow-50 border-yellow-300 hover:bg-yellow-100"
      >
        Alocar 5 Estações Flex (Teste)
      </Button>
      <Button 
        variant="outline" 
        onClick={onReleaseTest}
        className="bg-gray-50 border-gray-300 hover:bg-gray-100"
      >
        Liberar 3 Estações Flex (Teste)
      </Button>
    </div>
  );
};
