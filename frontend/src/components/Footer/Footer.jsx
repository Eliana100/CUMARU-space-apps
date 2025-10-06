import React from 'react';

const Footer = ({ metrics }) => { 
  return (
    <footer className="flex items-center justify-around p-3 bg-white dark:bg-gray-800 shadow-inner text-sm text-gray-700 dark:text-gray-300 flex-shrink-0">
      <div className="flex items-center space-x-2">
        <span className="font-semibold">GENERAL METRICS:</span> {metrics.generalMetrics || 0}
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-semibold">ACTIVE SATELLITES:</span> {metrics.activeSatellites || 0}
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-semibold">ALERTS TODAY:</span> {metrics.alertsToday || 0}
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-semibold">MONITORED AREAS:</span> {metrics.monitoredAreas || 0}
      </div>
    </footer>
  );
};

export default Footer;