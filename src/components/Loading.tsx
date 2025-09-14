import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`}></div>
  );
};

// Loading skeleton for game cards
export const GameCardSkeleton: React.FC = () => {
  return (
    <div className="game-card animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-1/2"></div>
        <div className="flex gap-1 mb-3">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

// Grid of loading skeletons
export const GameGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <GameCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default LoadingSpinner;