export interface CPU {
  id: string;
  name: string;
  brand: 'AMD' | 'Intel' | 'Apple' | 'Other';
  series: string;
  cores: number;
  threads: number;
  baseClock: number;
  boostClock: number;
  tdp: number;
  socket: string;
  price: number;
  releaseDate: string;
  architecture: string;
  cache: {
    l1: string;
    l2: string;
    l3: string;
  };
  benchmarks: {
    singleCore: number;
    multiCore: number;
    gaming: number;
  };
  shop: {
    amazon: { price: number };
    ebay: { price: number };
    newegg: { price: number };
  };
  features: string[];
  imageUrl: string;
}

export type SortOption = 'price' | 'cores' | 'baseClock' | 'boostClock' | 'singleCore' | 'multiCore' | 'tdp' | 'releaseDate';

export interface FilterOptions {
  brands: string[];
  minCores: number;
  maxCores: number;
  minPrice: number;
  maxPrice: number;
  socket: string;
  minBenchmark: number;
}