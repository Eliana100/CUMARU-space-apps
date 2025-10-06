import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Using Chart.js for simple graphs

const AlertModal = ({ alert, onClose }) => {
  const rainfallChartRef = useRef(null);
  const soilMoistureChartRef = useRef(null);
  const rainfallChartInstance = useRef(null);
  const soilMoistureChartInstance = useRef(null);

  useEffect(() => {
    if (!alert || !alert.graphData) return;

    // Destroy existing chart instances before creating new ones
    if (rainfallChartInstance.current) {
      rainfallChartInstance.current.destroy();
    }
    if (soilMoistureChartInstance.current) {
      soilMoistureChartInstance.current.destroy();
    }

    const commonChartOptions = (title) => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'rgb(156, 163, 175)' // Tailwind gray-400
          }
        },
        title: {
          display: true,
          text: title,
          color: 'rgb(156, 163, 175)' // Tailwind gray-400
        }
      },
      scales: {
        x: {
          ticks: {
            color: 'rgb(156, 163, 175)'
          },
          grid: {
            color: 'rgba(107, 114, 128, 0.2)' // Tailwind gray-500 with transparency
          }
        },
        y: {
          ticks: {
            color: 'rgb(156, 163, 175)'
          },
          grid: {
            color: 'rgba(107, 114, 128, 0.2)'
          }
        }
      }
    });


    // Rainfall Chart
    if (rainfallChartRef.current) {
      const ctx = rainfallChartRef.current.getContext('2d');
      rainfallChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['-7h', '-6h', '-5h', '-4h', '-3h', '-2h', '-1h', 'Now'], // Example labels for 48h
          datasets: [{
            label: '48h Rainfall (mm)',
            data: alert.graphData.rainfall,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: false,
          }]
        },
        options: commonChartOptions('48h Rainfall Trend')
      });
    }

    // Soil Moisture Chart
    if (soilMoistureChartRef.current) {
      const ctx = soilMoistureChartRef.current.getContext('2d');
      soilMoistureChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['-7h', '-6h', '-5h', '-4h', '-3h', '-2h', '-1h', 'Now'], // Example labels for 48h
          datasets: [{
            label: 'Soil Moisture (%)',
            data: alert.graphData.soilMoisture,
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1,
            fill: false,
          }]
        },
        options: commonChartOptions('Soil Moisture Trend') // Usando a função auxiliar para opções
      });
    }

    // Cleanup: Destroy charts when modal closes or alert changes
    return () => {
      if (rainfallChartInstance.current) {
        rainfallChartInstance.current.destroy();
      }
      if (soilMoistureChartInstance.current) {
        soilMoistureChartInstance.current.destroy();
      }
    };
  }, [alert]); // Depend on alert prop to re-render charts when a new alert is selected

  if (!alert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{alert.type} - {alert.location}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Details:</span> {alert.details}
          </p>
          {alert.riskScore && (
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Risk Score:</span> {alert.riskScore}
            </p>
          )}
          {alert.predicted && (
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Predicted:</span> {alert.predicted}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md h-64">
              <canvas ref={rainfallChartRef}></canvas>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md h-64">
              <canvas ref={soilMoistureChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
          <button
            onClick={() => { /* Logic to issue warning */ onClose(); }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
          >
            Issue Warning
          </button>
          <button
            onClick={() => { /* Logic to mark as resolved */ onClose(); }}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors duration-200"
          >
            Mark as Resolved
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;