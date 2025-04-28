import React, { useState } from 'react';
import { useAtom } from 'jotai';
import Layout from '../components/Layout/Layout';
import FilterPanel from '../components/Filters/FilterPanel';
import { CompareButton } from '../components/ui/CompareButton';
import { CPU, FilterOptions } from '../types';
import { cpus } from '../data/cpus';
import { selectedCPUsAtom } from '../store/atoms';
import toast from 'react-hot-toast';

type BenchmarkTab = 'singleCore' | 'multiCore' | 'gaming';

const defaultFilters: FilterOptions = {
  brands: [],
  minCores: 1,
  maxCores: 128,
  minPrice: 0,
  maxPrice: 10000,
  socket: '',
  minBenchmark: 0,
};

const Benchmarks: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selectedCPUs, setSelectedCPUs] = useAtom(selectedCPUsAtom);
  const [activeTab, setActiveTab] = useState<BenchmarkTab>('singleCore');

  const handleAddToCompare = (cpu: CPU) => {
    if (selectedCPUs.some(selected => selected.id === cpu.id)) {
      setSelectedCPUs(selectedCPUs.filter(selected => selected.id !== cpu.id));
      toast.success(`Removed ${cpu.name} from comparison`);
    } else {
      setSelectedCPUs([...selectedCPUs, cpu]);
      toast.success(`Added ${cpu.name} to comparison`);
    }
  };

  const isSelected = (cpu: CPU) => selectedCPUs.some(selected => selected.id === cpu.id);

  const filteredCPUs = cpus.filter(cpu => {
    if (filters.brands.length > 0 && !filters.brands.includes(cpu.brand)) return false;
    if (cpu.cores < filters.minCores || cpu.cores > filters.maxCores) return false;
    if (cpu.price < filters.minPrice || cpu.price > filters.maxPrice) return false;
    if (filters.socket && cpu.socket !== filters.socket) return false;
    return true;
  }).sort((a, b) => {
    switch (activeTab) {
      case 'singleCore':
        return b.benchmarks.singleCore - a.benchmarks.singleCore;
      case 'multiCore':
        return b.benchmarks.multiCore - a.benchmarks.multiCore;
      case 'gaming':
        return b.benchmarks.gaming - a.benchmarks.gaming;
      default:
        return 0;
    }
  });

  const getMaxValue = (tab: BenchmarkTab) => {
    switch (tab) {
      case 'singleCore':
        return 3500;
      case 'multiCore':
        return 35000;
      case 'gaming':
        return 100;
      default:
        return 100;
    }
  };

  const formatValue = (value: number, tab: BenchmarkTab) => {
    if (tab === 'gaming') {
      return `${value}/100`;
    }
    return value.toLocaleString();
  };

  const getBarColor = (brand: CPU["brand"]) => {
    switch (brand) {
      case 'Intel':
        return 'bg-[#0068B5]';
      case 'AMD':
        return 'bg-[#9d141c]';
      case 'Apple':
        return 'bg-[#A2AAAD]';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
            orientation="horizontal"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">CPU Performance Benchmarks</h2>
            <p className="mt-1 text-sm text-gray-600">Compare performance across different processors</p>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {(['singleCore', 'multiCore', 'gaming'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    py-4 px-6 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab === 'singleCore' ? 'Single-Core Performance' :
                    tab === 'multiCore' ? 'Multi-Core Performance' :
                      'Gaming Performance'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {filteredCPUs.map((cpu) => {
                const value = activeTab === 'singleCore' ? cpu.benchmarks.singleCore :
                  activeTab === 'multiCore' ? cpu.benchmarks.multiCore :
                    cpu.benchmarks.gaming;
                const maxValue = getMaxValue(activeTab);
                const percentage = (value / maxValue) * 100;

                return (
                  <div className="h-10 w-full bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full ${getBarColor(cpu.brand)} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="h-full flex items-center px-3 space-x-2">
                        <span className={`
                              inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium
                              text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]
                              ${cpu.brand === 'AMD' ? 'bg-red-700' :
                            cpu.brand === 'Intel' ? 'bg-blue-700' :
                              'bg-gray-700'}
                            `}>
                          {cpu.brand}
                        </span>
                        <span className="font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] truncate">
                          {cpu.name}
                        </span>
                        <span className="font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                          {formatValue(value, activeTab)}
                        </span>
                      </div>
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                      <CompareButton
                        cpu={cpu}
                        onCompare={handleAddToCompare}
                        isSelected={isSelected(cpu)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Benchmarks;