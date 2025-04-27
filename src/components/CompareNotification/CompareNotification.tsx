import React from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { selectedCPUsAtom } from '../../store/atoms';
import { CpuIcon } from 'lucide-react';

const CompareNotification: React.FC = () => {
  const [selectedCPUs] = useAtom(selectedCPUsAtom);
  const navigate = useNavigate();

  if (selectedCPUs.length === 0) return null;

  return (
    <button
      onClick={() => navigate('/compare')}
      className="fixed top-4 right-4 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors group"
    >
      <div className="relative">
        <CpuIcon className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {selectedCPUs.length}
        </span>
      </div>
      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Compare CPUs
      </span>
    </button>
  );
};

export default CompareNotification;