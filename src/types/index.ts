export interface Passmark {
  cpuScore: number;
  threadScore: number;
}

export interface Geekbench {
  singleScore: number;
  multiScore: number;
}

export type Tld = "it" | "com" | "co.uk" | "de" | "fr" | "es" | "au" | "jp";

export type Asins = {
    [key in Tld]: string[];
  }

export interface CPU {
  _id: string;
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
  passmark: Passmark;
  geekbench: Geekbench;
  shop: {
    amazon: { price: number };
    ebay: { price: number };
    newegg: { price: number };
  };
  features: string[];
  imageUrl: string;
  asins?: Asins
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