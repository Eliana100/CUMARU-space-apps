import React, { useState } from 'react';

const Header = ({ currentView, setMapView }) => {
  const [language, setLanguage] = useState('en'); // Default to English

  const viewOptions = {
    global: { icon: '🌍', label: 'World' },
    country: { icon: '🇧🇷', label: 'Country' },
    state: { icon: '🏙️', label: 'State' },
    neighborhood: { icon: '🏡', label: 'Neighborhood' },
  };

  const languageOptions = {
    en: 'English',
    pt: 'Português',
    es: 'Español',
    fr: 'Français',
    it: 'Italiano',
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">CUMARU</h1>
      </div>

      <div className="flex items-center space-x-2">
        {Object.entries(viewOptions).map(([key, { icon, label }]) => (
          <button
            key={key}
            onClick={() => setMapView(key)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
              currentView === key ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="block appearance-none w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer"
          >
            {Object.entries(languageOptions).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          {/* Este div faltava o fechamento ou estava cortado */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 000-2H9zm2 6a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"></path></svg>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm-6 6a4 4 0 014-4h2a4 4 0 014 4v3.586l-1 1A1 1 0 0115 13H5a1 1 0 01-.707-1.707l-1-1V8z"></path><path d="M10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;