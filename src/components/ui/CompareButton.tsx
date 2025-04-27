import React from 'react';
import { Plus } from 'lucide-react';
import { CPU } from '../../types';

interface CompareButtonProps {
  cpu: CPU;
  onCompare: (cpu: CPU) => void;
  isSelected: boolean;
}

export const CompareButton: React.FC<CompareButtonProps> = ({ cpu, onCompare, isSelected }) => {
  return (
    <button
      onClick={() => onCompare(cpu)}
      className={`
        flex items-center px-3 py-1.5 text-sm font-medium rounded transition-colors shadow-sm
        ${isSelected 
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
          : 'bg-blue-600 text-white hover:bg-blue-700'}
      `}
    >
      <Plus className="h-4 w-4 mr-1" />
      {isSelected ? 'Selected' : 'Compare'}
    </button>
  );
};