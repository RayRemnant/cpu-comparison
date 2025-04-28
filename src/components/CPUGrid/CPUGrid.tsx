import React from 'react';
import CPUCard from '../CPUCard/CPUCard';
import { CPU } from '../../types';

interface CPUGridProps {
  cpus: CPU[];
  selectedCPUs: CPU[];
  onCompare: (cpu: CPU) => void;
  onFavorite: (cpu: CPU) => void;
  favorites?: CPU[];
}

const CPUGrid: React.FC<CPUGridProps> = ({
  cpus,
  selectedCPUs,
  onCompare,
  onFavorite,
  favorites = [],
}) => {
  const isSelected = (cpu: CPU) => {
    return selectedCPUs.some(selected => selected.id === cpu.id);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cpus.map((cpu) => (
        <CPUCard
          key={cpu.id}
          cpu={cpu}
          onCompare={onCompare}
          onFavorite={onFavorite}
          isSelected={isSelected(cpu)}
          favorite={favorites.some(fav => fav.id === cpu.id)}
        />
      ))}
    </div>
  );
};

export default CPUGrid;