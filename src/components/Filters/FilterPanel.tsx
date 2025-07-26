import React, { useState } from 'react';
import { FilterOptions } from '../../types';
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterSection } from '../ui/FilterSection';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
  orientation?: 'vertical' | 'horizontal';
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  orientation = 'vertical'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBrandToggle = (brand: string) => {
    let newBrands;
    if (filters.brands.includes(brand)) {
      newBrands = filters.brands.filter(b => b !== brand);
    } else {
      newBrands = [...filters.brands, brand];
    }
    onFilterChange({ ...filters, brands: newBrands });
  };

  const containerClasses = orientation === 'horizontal' 
    ? 'flex flex-wrap gap-6 items-start'
    : 'space-y-6';

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <SlidersHorizontal className="mr-1 h-4 w-4" />
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden md:block'} bg-white rounded-lg shadow-sm border border-gray-200 p-4`}>
        <div className={containerClasses}>
          <FilterSection title="Brand">
            {['AMD', 'Intel', 'Apple', 'Other'].map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Cores">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="minCores" className="block text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  id="minCores"
                  value={filters.minCores}
                  min={1}
                  max={128}
                  onChange={(e) => onFilterChange({ ...filters, minCores: parseInt(e.target.value) || 1 })}
                  className="mt-1 block w-20 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="maxCores" className="block text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  id="maxCores"
                  value={filters.maxCores}
                  min={1}
                  max={128}
                  onChange={(e) => onFilterChange({ ...filters, maxCores: parseInt(e.target.value) || 128 })}
                  className="mt-1 block w-20 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Price Range">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="minPrice" className="block text-xs text-gray-500">Min ($)</label>
                <input
                  type="number"
                  id="minPrice"
                  value={filters.minPrice}
                  min={0}
                  onChange={(e) => onFilterChange({ ...filters, minPrice: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-xs text-gray-500">Max ($)</label>
                <input
                  type="number"
                  id="maxPrice"
                  value={filters.maxPrice}
                  min={0}
                  onChange={(e) => onFilterChange({ ...filters, maxPrice: parseInt(e.target.value) || 10000 })}
                  className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Socket">
            <select
              value={filters.socket}
              onChange={(e) => onFilterChange({ ...filters, socket: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Any Socket</option>
              <option value="AM5">AM5</option>
              <option value="LGA 1700">LGA 1700</option>
              <option value="AM4">AM4</option>
              <option value="LGA 1200">LGA 1200</option>
              <option value="SoC">SoC</option>
            </select>
          </FilterSection>

          <div className="flex justify-end pt-2">
            <button
              onClick={onReset}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <X className="h-4 w-4 mr-1" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;