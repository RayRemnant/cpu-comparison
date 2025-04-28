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
      className="cursor-pointer rounded-full p-2 bg-[radial-gradient(circle,rgba(255,255,255,0.5),rgba(255,255,255,0))]"
      onClick={() => onCompare(cpu)}
    >
      {isSelected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </div>
  );
};