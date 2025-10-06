import React, { useState } from 'react';

const SidebarLeft = () => {
  const [filters, setFilters] = useState({
    flood: false,
    landslide: false,
    drought: false,
    extremeHeat: false,
    wildfire: false,
  });

  const [mapLayers, setMapLayers] = useState({
    vegetationNDVI: true,
    precipitation: true,
    soilMoisture: true,
    relief: true,
  });

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const handleLayerChange = (layerName) => {
    setMapLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-lg overflow-y-auto flex-shrink-0">
      <div className="mb-6">
        <h2 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">FILTERS</h2>
        {Object.entries(filters).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between mb-2">
            <label htmlFor={key} className="capitalize text-sm text-gray-700 dark:text-gray-300">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={() => handleFilterChange(key)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">MAP LAYERS</h2>
        {Object.entries(mapLayers).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between mb-2">
            <label htmlFor={key} className="capitalize text-sm text-gray-700 dark:text-gray-300">
              {key === 'vegetationNDVI' ? 'Vegetation NDVI (MODIS)' :
               key === 'precipitation' ? 'Precipitation (GPM)' :
               key === 'soilMoisture' ? 'Soil Moisture (SMAP)' :
               key === 'relief' ? 'Relief (SRTM)' : key}
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={() => handleLayerChange(key)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">LEGENDS</h2>
        <div className="mb-2">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Risk Level: Low (Green) - High (Red)</p>
          <div className="flex justify-between items-center h-4 rounded overflow-hidden">
            <div className="w-1/5 h-full bg-green-500"></div>
            <div className="w-1/5 h-full bg-yellow-400"></div>
            <div className="w-1/5 h-full bg-orange-500"></div>
            <div className="w-1/5 h-full bg-red-600"></div>
            <div className="w-1/5 h-full bg-red-800"></div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mt-3">
          <span className="mr-2 text-xl">💧</span> Flood Icon
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mt-1">
          <span className="mr-2 text-xl">⛰️</span> Landslide Icon
        </div>
        {/* Add more icons as needed */}
      </div>
    </aside>
  );
};

export default SidebarLeft;