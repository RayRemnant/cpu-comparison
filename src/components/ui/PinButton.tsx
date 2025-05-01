import React from 'react';
import { CPU } from '../../types';
import { Pin } from 'lucide-react';

interface CompareButtonProps {
  cpu: CPU;
  onPin: (cpu: CPU) => void;
  isPinned: boolean;
}

export const PinButton: React.FC<CompareButtonProps> = ({ cpu, onPin, isPinned }) => {
  return (
    <div
      onClick={() => onPin(cpu)}
      className="cursor-pointer p-2 flex items-center"
    >
      {isPinned ? (
        <Pin className="w-4 h-4 mr-2" fill="black" />
      ) : (
        <Pin className="w-4 h-4 mr-2" fill="none" />
      )}
    </div>
  );
};