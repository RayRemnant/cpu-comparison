import React, { useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import Layout from '../components/Layout/Layout';
import ComparisonTable from '../components/ComparisonTable/ComparisonTable';
import { selectedCPUsAtom } from '../store/atoms';
import { CpuIcon, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cpus as cpuData } from '../data/cpus';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Container } from '../components/ui/Container';

const Compare: React.FC = () => {
  const [selectedCPUs, setSelectedCPUs] = useAtom(selectedCPUsAtom);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleRemove = (id: string) => {
    setSelectedCPUs(selectedCPUs.filter(cpu => cpu.id !== id));
  };

  const filteredCPUs = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return cpuData.filter(cpu => 
      !selectedCPUs.some(selected => selected.id === cpu.id) &&
      (cpu.name.toLowerCase().includes(query) ||
       cpu.brand.toLowerCase().includes(query) ||
       cpu.socket.toLowerCase().includes(query))
    );
  }, [searchQuery, selectedCPUs]);

  const handleAddCPU = (cpuId: string) => {
    const cpu = cpuData.find(c => c.id === cpuId);
    if (cpu) {
      setSelectedCPUs([...selectedCPUs, cpu]);
      setSearchQuery('');
      toast.success(`Added ${cpu.name} to comparison`);
    }
  };

  return (
    <Layout>
      <Container className="py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Add CPU</h3>
              </CardHeader>
              <CardContent>
                <Input
                  icon="search"
                  type="text"
                  placeholder="Search CPUs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <div className="mt-2 space-y-1">
                    {filteredCPUs.map(cpu => (
                      <Button
                        key={cpu.id}
                        variant="ghost"
                        fullWidth
                        className="justify-start"
                        onClick={() => handleAddCPU(cpu.id)}
                      >
                        {cpu.name}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {selectedCPUs.length === 0 ? (
              <EmptyState
                icon={CpuIcon}
                title="No CPUs Selected"
                description="Start by selecting CPUs to compare"
                action={{
                  label: "Browse CPUs",
                  onClick: () => navigate('/benchmarks')
                }}
              />
            ) : (
              <ComparisonTable cpus={selectedCPUs} onRemove={handleRemove} />
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default Compare;