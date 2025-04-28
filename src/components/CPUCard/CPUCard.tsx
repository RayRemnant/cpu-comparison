import React from 'react';
import { Heart } from 'lucide-react';
import { CPU } from '../../types';
import { CompareButton } from '../ui/CompareButton';

interface CPUCardProps {
  cpu: CPU;
  onCompare: (cpu: CPU) => void;
  onFavorite: (cpu: CPU) => void;
  isSelected: boolean;
  favorite?: boolean;
}

const CPUCard: React.FC<CPUCardProps> = ({ cpu, onCompare, onFavorite, isSelected, favorite }) => {
  return (
    <div className={`
      relative overflow-hidden rounded-lg shadow-sm border transition-all duration-300 
      ${isSelected ? 'border-blue-500 shadow-md ring-2 ring-blue-200' : 'border-gray-200 hover:shadow-md'}
    `}>
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={cpu.imageUrl}
          alt={cpu.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${cpu.brand === 'AMD' ? 'bg-red-100 text-red-800' :
                cpu.brand === 'Intel' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'}
            `}>
              {cpu.brand}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">{cpu.name}</h3>
          </div>
          <button
            onClick={() => onFavorite(cpu)}
            className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
          >
            <Heart className={`h-5 w-5 ${favorite ? "fill-red-500 text-red-500" : "fill-none"}`} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Cores / Threads</p>
            <p className="font-medium">{cpu.cores} / {cpu.threads}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Base / Boost</p>
            <p className="font-medium">{cpu.baseClock} / {cpu.boostClock} GHz</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Socket</p>
            <p className="font-medium">{cpu.socket}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">TDP</p>
            <p className="font-medium">{cpu.tdp}W</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-baseline">
            <p className="text-sm text-gray-500">Single-Core Score</p>
            <p className="text-sm font-medium">{cpu.benchmarks.singleCore.toLocaleString()}</p>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${(cpu.benchmarks.singleCore / 3500) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-baseline mt-2">
            <p className="text-sm text-gray-500">Multi-Core Score</p>
            <p className="text-sm font-medium">{cpu.benchmarks.multiCore.toLocaleString()}</p>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-purple-600 h-1.5 rounded-full"
              style={{ width: `${(cpu.benchmarks.multiCore / 35000) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-5 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">${cpu.price}</span>
          <CompareButton cpu={cpu} onCompare={onCompare} isSelected={isSelected} />
        </div>
      </div>
    </div>
  );
};

export default CPUCard;