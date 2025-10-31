
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  colorClass?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', colorClass = 'border-white' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-r-2 ${colorClass} ${sizeClasses[size]}`}
      style={{ borderTopColor: 'transparent' }}
    ></div>
  );
};

export default Spinner;