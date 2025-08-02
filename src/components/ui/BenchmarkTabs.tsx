import React from 'react';
import { BENCHMARK_CONFIGS } from '../../config/benchmarks';

interface BenchmarkTabsProps {
  activeSource: string;
  activeTab: string;
  onSourceChange: (source: string) => void;
  onTabChange: (tab: string) => void;
}

export const BenchmarkTabs: React.FC<BenchmarkTabsProps> = ({
  activeSource,
  activeTab,
  onSourceChange,
  onTabChange
}) => {
  const currentConfig = BENCHMARK_CONFIGS[activeSource];

  return (
    <div className="border-b border-gray-200">
      {/* Source tabs */}
      <nav className="-mb-px flex">
        {Object.values(BENCHMARK_CONFIGS).map((config) => (
          <button
            key={config.name}
            onClick={() => {
              onSourceChange(config.name);
              onTabChange(config.tabs[0].key); // Reset to first tab
            }}
            className={`border-b-2 px-6 py-4 text-sm font-medium transition-colors ${activeSource === config.name
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
          >
            {config.displayName}
          </button>
        ))}
      </nav>

      {/* Sub-tabs for current source */}
      {currentConfig && currentConfig.tabs.length > 1 && (
        <nav className="flex space-x-4 px-6 py-2 bg-gray-50">
          {currentConfig.tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === tab.key
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};