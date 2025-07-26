import React from 'react';
import { CPU } from '../../types';
import { X } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ComparisonTableProps {
  cpus: CPU[];
  onRemove: (id: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ cpus, onRemove }) => {
  if (cpus.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Compare CPUs</h2>
        <p className="mt-1 text-sm text-gray-600">Side-by-side comparison of selected processors</p>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Specification
              </th>
              {cpus.map((cpu) => (
                <th key={cpu.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    <span>{cpu.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(cpu.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Brand</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Badge
                    variant={cpu.brand === 'AMD' ? 'error' : 
                            cpu.brand === 'Intel' ? 'info' : 
                            'default'}
                    size="sm"
                  >
                    {cpu.brand}
                  </Badge>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Architecture</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cpu.architecture}</td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cores</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="font-medium">{cpu.cores}</span>
                    <div className="ml-2 w-20 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${(cpu.cores / 24) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Threads</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="font-medium">{cpu.threads}</span>
                    <div className="ml-2 w-20 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${(cpu.threads / 32) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Base Clock</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cpu.baseClock} GHz</td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Boost Clock</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cpu.boostClock} GHz</td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TDP</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cpu.tdp} W</td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Socket</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cpu.socket}</td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Single-Core Score</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span className="font-medium">{cpu.benchmarks.singleCore.toLocaleString()}</span>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${(cpu.benchmarks.singleCore / 3500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Multi-Core Score</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span className="font-medium">{cpu.benchmarks.multiCore.toLocaleString()}</span>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full" 
                        style={{ width: `${(cpu.benchmarks.multiCore / 35000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gaming Score</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span className="font-medium">{cpu.benchmarks.gaming}/100</span>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-teal-500 h-1.5 rounded-full" 
                        style={{ width: `${cpu.benchmarks.gaming}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Price</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">${cpu.price}</td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Release Date</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(cpu.releaseDate).toLocaleDateString()}
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Features</td>
              {cpus.map((cpu) => (
                <td key={cpu.id} className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {cpu.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ComparisonTable;