import React, { act, useEffect, useState } from "react";
import { useAtom } from "jotai";
import Layout from "../components/Layout/Layout";
import FilterPanel from "../components/Filters/FilterPanel";
import { CompareButton } from "../components/ui/CompareButton";
import { CPU, FilterOptions } from "../types";
import { selectedCPUsAtom } from "../store/atoms";
import toast from "react-hot-toast";
import { PinButton } from "../components/ui/PinButton";
import { ButtonDropDown } from "../components/ui/ButtonDropdown";
import { BenchmarkTabs } from "../components/ui/BenchmarkTabs";
import { useBenchmarkData } from "../hooks/useBenchmarkData";

const defaultFilters: FilterOptions = {
  brands: [],
  minCores: 1,
  maxCores: 128,
  minPrice: 0,
  maxPrice: 10000,
  socket: "",
  minBenchmark: 0,
};

const Benchmarks: React.FC = () => {
  const [cpus, setCpus] = useState<CPU[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selectedCPUs, setSelectedCPUs] = useAtom(selectedCPUsAtom);
  const [pinnedCPUs, setPinnedCPUs] = useState<CPU[]>([]);

  // Simplified state management
  const [activeSource, setActiveSource] = useState("passmark");
  const [activeTab, setActiveTab] = useState("cpuScore");

  useEffect(() => {
    const x = async () => {
      let response = await fetch("http://localhost:3000/api/find", {
        method: "POST",
        body: JSON.stringify({
          databaseName: "codex",
          collectionName: "cpus",
        }),
        headers: { "Content-Type": "application/json" },
      });

      setCpus(await response.json() || []);
    }

    x();
  }, []);

  const handleAddToCompare = (cpu: CPU) => {
    if (selectedCPUs.some((selected) => selected._id === cpu._id)) {
      setSelectedCPUs(
        selectedCPUs.filter((selected) => selected._id !== cpu._id),
      );
      toast.success(`Removed ${cpu.name} from comparison`);
    } else {
      setSelectedCPUs([...selectedCPUs, cpu]);
      toast.success(`Added ${cpu.name} to comparison`);
    }
  };

  const handlePinCPU = (cpu: CPU) => {
    if (pinnedCPUs.some((pinned) => pinned._id === cpu._id)) {
      setPinnedCPUs(pinnedCPUs.filter((pinned) => pinned._id !== cpu._id));
      toast.success(`Unpinned ${cpu.name}`);
    } else {
      setPinnedCPUs([...pinnedCPUs, cpu]);
      toast.success(`Pinned ${cpu.name}`);
    }
  };

  const isPinned = (cpu: CPU) =>
    pinnedCPUs.some((pinned) => pinned._id === cpu._id);

  const isSelected = (cpu: CPU) =>
    selectedCPUs.some((selected) => selected._id === cpu._id);

  const filteredCPUs = cpus.filter((cpu) => {
    if (cpu[activeSource as keyof CPU] === undefined) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(cpu.brand))
      return false;
    if (cpu.cores < filters.minCores || cpu.cores > filters.maxCores)
      return false;
    if (cpu.price < filters.minPrice || cpu.price > filters.maxPrice)
      return false;
    if (filters.socket && cpu.socket !== filters.socket) return false;
    return true;
  });

  const { sortedCPUs, maxValue, getValue } = useBenchmarkData(
    filteredCPUs,
    activeSource,
    activeTab,
    pinnedCPUs
  );

  const getBarColor = (brand: CPU["brand"]) => {
    switch (brand) {
      case "Intel":
        return "bg-[#0068B5]";
      case "AMD":
        return "bg-[#9d141c]";
      case "Apple":
        return "bg-[#A2AAAD]";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
            orientation="horizontal"
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              CPU Performance Benchmarks
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Compare performance across different processors
            </p>
          </div>

          <BenchmarkTabs
            activeSource={activeSource}
            activeTab={activeTab}
            onSourceChange={setActiveSource}
            onTabChange={setActiveTab}
          />

          <div className="p-6">
            <div className="space-y-4">
              {sortedCPUs.map((cpu) => {
                const value = getValue(cpu);
                const percentage = (value / maxValue) * 100;

                return (
                  <div className="flex justify-between gap-2" key={cpu._id}>
                    <div className="relative h-10 w-full overflow-hidden rounded-lg bg-gray-100">
                      <div
                        className={`h-full ${getBarColor(cpu.brand)} inline-block transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="flex h-full items-center space-x-2 px-3">
                          <span className="text-shadow-outline text-nowrap font-medium text-white">
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
                      <ButtonDropDown asins={cpu.asins} tld={"it"} />
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
