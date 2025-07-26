import React, { useState } from 'react';
import { SortOption } from '../../types';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sortOption: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price', label: 'Price' },
  { value: 'cores', label: 'Core Count' },
  { value: 'baseClock', label: 'Base Clock' },
  { value: 'boostClock', label: 'Boost Clock' },
  { value: 'singleCore', label: 'Single-Core Performance' },
  { value: 'multiCore', label: 'Multi-Core Performance' },
  { value: 'tdp', label: 'Power Consumption (TDP)' },
  { value: 'releaseDate', label: 'Release Date' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Sort by';

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          id="sort-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          Sort by: {currentLabel}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="sort-menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`
                  text-left block px-4 py-2 text-sm w-full 
                  ${option.value === currentSort 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;