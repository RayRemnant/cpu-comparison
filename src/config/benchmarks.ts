export interface BenchmarkConfig {
  name: string;
  displayName: string;
  tabs: Array<{
    key: string;
    label: string;
    unit?: string;
  }>;
}

export const BENCHMARK_CONFIGS: Record<string, BenchmarkConfig> = {
  passmark: {
    name: 'passmark',
    displayName: 'Passmark',
    tabs: [
      { key: 'cpuScore', label: 'CPU Score' },
      { key: 'threadScore', label: 'Single Thread' },
    ]
  },
  geekbench: {
    name: 'geekbench',
    displayName: 'Geekbench',
    tabs: [
      { key: 'singleScore', label: 'Single Core' },
      { key: 'multiScore', label: 'Multi Core' },
    ]
  }
};

export type BenchmarkSourceType = keyof typeof BENCHMARK_CONFIGS;