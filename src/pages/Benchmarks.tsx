import React, { act, useEffect, useState } from "react";
import { useAtom } from "jotai";
import Layout from "../components/Layout/Layout";
import FilterPanel from "../components/Filters/FilterPanel";
import { CompareButton } from "../components/ui/CompareButton";
import { CPU, FilterOptions, Passmark, Geekbench } from "../types";
import { selectedCPUsAtom } from "../store/atoms";
import toast from "react-hot-toast";
import { PinButton } from "../components/ui/PinButton";
import { ButtonDropDown } from "../components/ui/ButtonDropdown";

type BenchmarkSourceTab = "passmark" | "geekbench";

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
  const [activeSourceTab, setActiveSourceTab] = useState<BenchmarkSourceTab>("passmark");

  const [passmarkTab, setPassmarkTab] = useState<keyof Passmark>("cpuScore");
  const [geekbenchTab, setGeekbenchTab] = useState<keyof Geekbench>("singleScore");

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
    if (selectedCPUs.some((selected) => selected.id === cpu.id)) {
      setSelectedCPUs(
        selectedCPUs.filter((selected) => selected.id !== cpu.id),
      );
      toast.success(`Removed ${cpu.name} from comparison`);
    } else {
      setSelectedCPUs([...selectedCPUs, cpu]);
      toast.success(`Added ${cpu.name} to comparison`);
    }
  };

  const handlePinCPU = (cpu: CPU) => {
    if (pinnedCPUs.some((pinned) => pinned.id === cpu.id)) {
      setPinnedCPUs(pinnedCPUs.filter((pinned) => pinned.id !== cpu.id));
      toast.success(`Unpinned ${cpu.name}`);
    } else {
      setPinnedCPUs([...pinnedCPUs, cpu]);
      toast.success(`Pinned ${cpu.name}`);
    }
  };

  const isPinned = (cpu: CPU) =>
    pinnedCPUs.some((pinned) => pinned.id === cpu.id);

  const isSelected = (cpu: CPU) =>
    selectedCPUs.some((selected) => selected.id === cpu.id);

  const filteredCPUs = cpus.filter((cpu) => {
    if (cpu[activeSourceTab] === undefined) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(cpu.brand))
      return false;
    if (cpu.cores < filters.minCores || cpu.cores > filters.maxCores)
      return false;
    if (cpu.price < filters.minPrice || cpu.price > filters.maxPrice)
      return false;
    if (filters.socket && cpu.socket !== filters.socket) return false;
    return true;
  });

  const displayedCPUs = [
    ...pinnedCPUs,
    ...filteredCPUs.filter((cpu) => !isPinned(cpu)),
  ].sort((a, b) => {
    if (activeSourceTab === "passmark") {
      return b?.[activeSourceTab]?.[passmarkTab] - a?.[activeSourceTab]?.[passmarkTab];
    }
    if (activeSourceTab === "geekbench") {
      return b?.[activeSourceTab]?.[geekbenchTab] - a?.[activeSourceTab]?.[geekbenchTab];
    }
    return 0;
  });

  const getMaxValue = (sourceTab: BenchmarkSourceTab) => {
    const values = displayedCPUs.map((cpu) => {
      if (sourceTab === "passmark") {
        return cpu?.[sourceTab]?.[passmarkTab] || 0;
      }
      if (sourceTab === "geekbench") {
        return cpu?.[sourceTab]?.[geekbenchTab] || 0;
      }
      return 0;
    });
    return Math.max(...values);
  };

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

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {(["passmark", "geekbench"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveSourceTab(tab)
                  }}
                  className={`border-b-2 px-6 py-4 text-sm font-medium transition-colors ${activeSourceTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } `}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {displayedCPUs.map((cpu) => {
                const value = activeSourceTab == "passmark" ? cpu?.[activeSourceTab]?.[passmarkTab] :
                  activeSourceTab == "geekbench" ? cpu?.[activeSourceTab]?.[geekbenchTab] : 0;
                const maxValue = getMaxValue(activeSourceTab);
                const percentage = (value / maxValue) * 100;

                return (
                  <div className="flex justify-between gap-2" key={cpu.id}>
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
                      <ButtonDropDown />
                      {/* <button className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
                        {cpu.shop[activeTab].price}
                      {/* <div className="flex space-x-2">
                        {Object.entries(cpu.shop).map(([shopName, shopInfo]) => (
                          <button key={shopName}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"

                          >
                            {shopInfo.price}
                          </button>
                        ))}
                      </div> */}
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
