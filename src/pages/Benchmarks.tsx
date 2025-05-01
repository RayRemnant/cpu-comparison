import React, { useState } from 'react';
import { useAtom } from 'jotai';
import Layout from '../components/Layout/Layout';
import FilterPanel from '../components/Filters/FilterPanel';
import { CompareButton } from '../components/ui/CompareButton';
import { CPU, FilterOptions } from '../types';
import { cpus } from '../data/cpus';
import { selectedCPUsAtom } from '../store/atoms';
import toast from 'react-hot-toast';
import { PinButton } from '../components/ui/PinButton';

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
  const [pinnedCPUs, setPinnedCPUs] = useState<CPU[]>([]);
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

  const handlePinCPU = (cpu: CPU) => {
    if (pinnedCPUs.some(pinned => pinned.id === cpu.id)) {
      setPinnedCPUs(pinnedCPUs.filter(pinned => pinned.id !== cpu.id));
      toast.success(`Unpinned ${cpu.name}`);
    } else {
      setPinnedCPUs([...pinnedCPUs, cpu]);
      toast.success(`Pinned ${cpu.name}`);
    }
  };

  const isPinned = (cpu: CPU) => pinnedCPUs.some(pinned => pinned.id === cpu.id);

  const isSelected = (cpu: CPU) => selectedCPUs.some(selected => selected.id === cpu.id);

  const filteredCPUs = cpus.filter(cpu => {
    if (filters.brands.length > 0 && !filters.brands.includes(cpu.brand)) return false;
    if (cpu.cores < filters.minCores || cpu.cores > filters.maxCores) return false;
    if (cpu.price < filters.minPrice || cpu.price > filters.maxPrice) return false;
    if (filters.socket && cpu.socket !== filters.socket) return false;
    return true;
  })

  const displayedCPUs = [...pinnedCPUs, ...filteredCPUs.filter(cpu => !isPinned(cpu))].sort((a, b) => b.benchmarks[activeTab] - a.benchmarks[activeTab]);

  const getMaxValue = (tab: BenchmarkTab) => {
    const values = displayedCPUs.map(cpu => cpu.benchmarks[tab]);
    return Math.max(...values);
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
              {displayedCPUs.map((cpu) => {
                const value = activeTab === 'singleCore' ? cpu.benchmarks.singleCore :
                  activeTab === 'multiCore' ? cpu.benchmarks.multiCore :
                    cpu.benchmarks.gaming;
                const maxValue = getMaxValue(activeTab);
                const percentage = (value / maxValue) * 100;

                return (
                  <div className='flex justify-between gap-2' key={cpu.id}>
                    <div className="h-10 w-full bg-gray-100 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full ${getBarColor(cpu.brand)} transition-all duration-500 inline-block`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="h-full flex items-center px-3 space-x-2">
                          <span className="text-shadow-outline font-medium text-white text-nowrap">
                            {cpu.brand} {cpu.name} - {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CompareButton
                        cpu={cpu}
                        onCompare={handleAddToCompare}
                        isSelected={isSelected(cpu)}
                      />
                      <PinButton
                        cpu={cpu}
                        onPin={handlePinCPU}
                        isPinned={isPinned(cpu)}
                      />
                      <div className="flex space-x-2">
                        {Object.entries(cpu.shop).map(([shopName, shopInfo]) => (
                          <a
                            key={shopName}
                            href={`#`} // Replace with actual shop link if available
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded"
                          >
                            (${shopInfo.price})
                          </a>
                        ))}
                      </div>
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