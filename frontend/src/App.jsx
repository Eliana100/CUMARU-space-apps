// src/App.jsx
import React, { useState, useEffect } from 'react'; 
import Header from './components/Header/Header';
import SidebarLeft from './components/Sidebar/SidebarLeft';
import SidebarRight from './components/Sidebar/SiderbarRight'; 
import Map from './components/Map/Map';
import Footer from './components/Footer/Footer';
import AlertModal from './components/AlertModal/AlertModal';
// 1. Importa o TranslationProvider que acabamos de criar
import { TranslationProvider } from './context/TranslationContext'; 

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [mapView, setMapView] = useState('global');
  const [generalMetrics, setGeneralMetrics] = useState({});

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  // Buscar métricas gerais do back-end
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch general metrics');
        }
        const data = await response.json();
        setGeneralMetrics(data);
      } catch (error) {
        console.error('Error fetching general metrics:', error);
      }
    };
    fetchMetrics();
  }, []); 

  // O componente principal (App) é onde a lógica da aplicação vive, mas
  // o Provider deve ser usado no nível mais alto do JSX renderizado.
  const AppContent = () => (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header currentView={mapView} setMapView={setMapView} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft />
        <Map onViewChange={setMapView} currentView={mapView} onAlertClick={handleAlertClick} />
        <SidebarRight onAlertClick={handleAlertClick} currentView={mapView} /> 
      </div>
      <Footer metrics={generalMetrics} /> 
      {isModalOpen && (
        <AlertModal alert={selectedAlert} onClose={handleCloseModal} />
      )}
    </div>
  );

  return (
    // 2. Envolvemos a aplicação no Provider para que todos os componentes filhos
    // tenham acesso às funções de tradução.
    <TranslationProvider>
      {AppContent()}
    </TranslationProvider>
  );
}

export default App;
