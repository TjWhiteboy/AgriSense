
import React from 'react';
import { INDIAN_STATES_DISTRICTS, COMMON_CROPS, TRANSLATIONS } from '../constants';

interface ContextSelectorProps {
  state: string;
  district: string;
  crop: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  onCropChange: (crop: string) => void;
}

const ContextSelector: React.FC<ContextSelectorProps> = ({
  state,
  district,
  crop,
  onStateChange,
  onDistrictChange,
  onCropChange,
}) => {
  return (
    <div className="p-3 mb-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="state-select" className="block text-xs font-medium text-gray-400 mb-1">
          {TRANSLATIONS.stateLabel}
        </label>
        <div className="relative">
          <select
            id="state-select"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full p-2 text-sm bg-white dark:bg-[#161B22] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-800 dark:text-gray-200"
          >
            {Object.keys(INDIAN_STATES_DISTRICTS).map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <label htmlFor="district-select" className="block text-xs font-medium text-gray-400 mb-1">
          {TRANSLATIONS.locationLabel}
        </label>
        <div className="relative">
          <select
            id="district-select"
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full p-2 text-sm bg-white dark:bg-[#161B22] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-800 dark:text-gray-200"
          >
            {(INDIAN_STATES_DISTRICTS[state] || []).map((districtName) => (
              <option key={districtName} value={districtName}>
                {districtName}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <label htmlFor="crop-select" className="block text-xs font-medium text-gray-400 mb-1">
          {TRANSLATIONS.cropLabel}
        </label>
        <div className="relative">
        <select
          id="crop-select"
          value={crop}
          onChange={(e) => onCropChange(e.target.value)}
          className="w-full p-2 text-sm bg-white dark:bg-[#161B22] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-800 dark:text-gray-200"
        >
          {COMMON_CROPS.map((cropItem) => (
            <option key={cropItem} value={cropItem}>
              {cropItem}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextSelector;
