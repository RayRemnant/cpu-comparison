import { useMemo } from 'react';
import { CPU } from '../types';

export const useBenchmarkData = (
  cpus: CPU[],
  activeSource: string,
  activeTab: string,
  pinnedCPUs: CPU[]
) => {
  const getValue = (cpu: CPU): number => {
    const sourceData = cpu[activeSource as keyof CPU];
    if (typeof sourceData === 'object' && sourceData !== null && !Array.isArray(sourceData)) {
      return (sourceData as any)[activeTab] || 0;
    }
    return 0;
  };

  const sortedCPUs = useMemo(() => {
    const filtered = cpus.filter(cpu => cpu[activeSource as keyof CPU] !== undefined);
    const unpinned = filtered.filter(cpu => !pinnedCPUs.some(p => p._id === cpu._id));
    
    return [
      ...pinnedCPUs,
      ...unpinned
    ].sort((a, b) => getValue(b) - getValue(a));
  }, [cpus, activeSource, activeTab, pinnedCPUs]);

  const maxValue = useMemo(() => {
    const values = sortedCPUs.map(getValue);
    return Math.max(...values, 1); // Avoid division by zero
  }, [sortedCPUs, getValue]);

  return {
    sortedCPUs,
    maxValue,
    getValue
  };
};