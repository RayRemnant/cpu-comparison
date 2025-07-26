import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import Layout from '../components/Layout/Layout';
import CPUGrid from '../components/CPUGrid/CPUGrid';
import FilterPanel from '../components/Filters/FilterPanel';
import SortDropdown from '../components/SortOptions/SortDropdown';
import { CPU, FilterOptions, SortOption } from '../types';
import { cpus as cpuData } from '../data/cpus';
import { Cpu, Search } from 'lucide-react';
import { selectedCPUsAtom } from '../store/atoms';
import toast from 'react-hot-toast';

const defaultFilters: FilterOptions = {
  brands: [],
  minCores: 1,
  maxCores: 128,
  minPrice: 0,
  maxPrice: 10000,
  socket: '',
  minBenchmark: 0,
};

const Home: React.FC = () => {
  const [filteredCpus, setFilteredCpus] = useState<CPU[]>(cpuData);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCPUs, setSelectedCPUs] = useAtom(selectedCPUsAtom);
  const [favorites, setFavorites] = useState<CPU[]>(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const handleFavorite = (cpu: CPU) => {
    const isFavorite = favorites.some((favorite) => favorite.id === cpu.id);
    if (isFavorite) {
      const updatedFavorites = favorites.filter((favorite) => favorite.id !== cpu.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      toast.success(`Removed ${cpu.name} from favorites`);
    } else {
      console.log("SEEET FAVS", favorites, cpu);
      const updatedFavorites = [...favorites, cpu];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      toast.success(`Added ${cpu.name} to favorites`);
    }
  };

  const handleCompare = (cpu: CPU) => {
    if (selectedCPUs.some((selected) => selected.id === cpu.id)) {
      setSelectedCPUs(selectedCPUs.filter((selected) => selected.id !== cpu.id));
      toast.success(`Removed ${cpu.name} from comparison`);
    } else {
      setSelectedCPUs([...selectedCPUs, cpu]);
      toast.success(`Added ${cpu.name} to comparison`);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery('');
  };

  const handleSortChange = (sortOption: SortOption) => {
    setSortBy(sortOption);
  };

  useEffect(() => {
    let result = cpuData;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (cpu) =>
          cpu.name.toLowerCase().includes(query) ||
          cpu.brand.toLowerCase().includes(query) ||
          cpu.socket.toLowerCase().includes(query)
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter((cpu) => filters.brands.includes(cpu.brand));
    }

    result = result.filter(
      (cpu) =>
        cpu.cores >= filters.minCores &&
        cpu.cores <= filters.maxCores &&
        cpu.price >= filters.minPrice &&
        cpu.price <= filters.maxPrice &&
        (filters.socket === '' || cpu.socket === filters.socket)
    );

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'cores':
          return b.cores - a.cores;
        case 'baseClock':
          return b.baseClock - a.baseClock;
        case 'boostClock':
          return b.boostClock - a.boostClock;
        case 'singleCore':
          return b.benchmarks.singleCore - a.benchmarks.singleCore;
        case 'multiCore':
          return b.benchmarks.multiCore - a.benchmarks.multiCore;
        case 'tdp':
          return a.tdp - b.tdp;
        case 'releaseDate':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        default:
          return 0;
      }
    });

    setFilteredCpus(result);
  }, [filters, searchQuery, sortBy]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="px-8 py-12 md:py-20 md:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Find the Perfect CPU<br />for Your Next Build
            </h1>
            <p className="mt-4 text-blue-100 text-lg md:text-xl max-w-2xl">
              Compare specifications, performance benchmarks, and prices to make the best choice.
            </p>
            <div className="mt-8 relative max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-blue-500 bg-opacity-25 text-white placeholder-blue-200 focus:outline-none focus:bg-white focus:placeholder-gray-400 focus:text-gray-900 focus:ring-0 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search by CPU name, brand, or socket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          <div className="md:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredCpus.length} {filteredCpus.length === 1 ? 'CPU' : 'CPUs'} Available
                </h2>
              </div>
              <SortDropdown currentSort={sortBy} onSortChange={handleSortChange} />
            </div>

            {filteredCpus.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Cpu className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No CPUs Found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search query.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              <CPUGrid
                cpus={filteredCpus}
                selectedCPUs={selectedCPUs}
                onCompare={handleCompare}
                onFavorite={handleFavorite}
                favorites={favorites} // Pass favorites to CPUGrid
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;