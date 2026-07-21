
import React, { useState } from 'react';
import { COMMON_CROPS, TRANSLATIONS } from '../constants';
import { apiClient } from '../services/apiClient';

interface ContextSelectorProps {
  state: string;
  district: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
}

const ContextSelector: React.FC<ContextSelectorProps> = ({
  state,
  district,
  onStateChange,
  onDistrictChange,
}) => {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const fallbackLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data.city) onDistrictChange(data.city);
      if (data.region) onStateChange(data.region);
      setLocationError('');
    } catch(err) {
      setLocationError('Could not determine location automatically.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleLocateMe = () => {
    setLoadingLocation(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      fallbackLocation();
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await apiClient.get(`/weather/reverse-geocode?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          if (res.data.state) onStateChange(res.data.state);
          // Sometimes OWM returns generic state names, let's prioritize district
          if (res.data.district) onDistrictChange(res.data.district);
          setLoadingLocation(false);
        } catch (err) {
          console.error('Reverse geocode failed, falling back to IP location', err);
          fallbackLocation();
        }
      },
      (err) => {
        console.error('GPS blocked, falling back to IP location', err);
        fallbackLocation();
      },
      { timeout: 5000 }
    );
  };

  return (
    <div className="p-3 mb-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 sm:flex-[2]">
        <label className="block text-xs font-medium text-gray-400 mb-1">
          {TRANSLATIONS.locationLabel || 'Location'}
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-2 text-sm bg-white dark:bg-[#161B22] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-gray-800 dark:text-gray-200 truncate">
            {district && state ? `${district}, ${state}` : district ? district : 'No location set'}
          </div>
          <button 
            onClick={handleLocateMe} 
            disabled={loadingLocation}
            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
          >
            {loadingLocation ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="flex items-center gap-1 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Locate Me
              </span>
            )}
          </button>
        </div>
        {locationError && <p className="text-red-500 text-xs mt-1">{locationError}</p>}
      </div>
      
    </div>
  );
};

export default ContextSelector;
