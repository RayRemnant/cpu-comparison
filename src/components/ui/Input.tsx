import React from 'react';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: 'search' | 'none';
  variant?: 'default' | 'transparent';
}

export const Input: React.FC<InputProps> = ({ 
  icon = 'none',
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseStyles = "block w-full text-sm transition-colors";
  const variantStyles = {
    default: "border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    transparent: "border border-transparent rounded-md bg-blue-500 bg-opacity-25 text-white placeholder-blue-200 focus:bg-white focus:placeholder-gray-400 focus:text-gray-900 focus:ring-0"
  };
  const iconPadding = icon !== 'none' ? 'pl-10 pr-3' : 'px-3';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${iconPadding} ${className}`;

  return (
    <div className="relative">
      {icon === 'search' && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${variant === 'transparent' ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
      )}
      <input
        {...props}
        className={combinedClassName}
      />
    </div>
  );
};