
import React from 'react';
import LeafLogoIcon from './icons/LeafLogoIcon';

const Preloader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0D1117] transition-colors duration-300 ease-in-out">
      <div className="relative flex items-center justify-center w-24 h-24">
        <LeafLogoIcon className="h-20 w-20 text-green-500" />
        <div className="absolute inset-0 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-6">AgriSense</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Initializing your smart farming assistant...</p>
    </div>
  );
};

export default Preloader;
