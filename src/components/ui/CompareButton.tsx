import React from 'react';
import { CPU } from '../../types';
import { Plus, Minus } from 'lucide-react';

interface CompareButtonProps {
  cpu: CPU;
  onCompare: (cpu: CPU) => void;
  isSelected: boolean;
}

export const CompareButton: React.FC<CompareButtonProps> = ({ cpu, onCompare, isSelected }) => {
  return (
    <div
      className="cursor-pointer p-2 flex items-center"
      onClick={() => onCompare(cpu)}
    >
      {isSelected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </div>
  );
};