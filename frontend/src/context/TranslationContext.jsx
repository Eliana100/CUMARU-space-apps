import React, { createContext, useContext, useState } from 'react';

// Dicionário de tradução
const TRANSLATIONS = {
  pt: {
    // Header Views
    world: 'Mundo',
    country: 'País',
    state: 'Estado',
    neighborhood: 'Bairro',
    // Sidebar Left (Filtros e Camadas)
    filters: 'FILTROS',
    flood: 'Inundação',
    landslide: 'Deslizamento',
    drought: 'Seca',
    extremeHeat: 'Calor Extremo',
    wildfire: 'Incêndio Florestal',
    mapLayers: 'CAMADAS DO MAPA',
    vegetation: 'Vegetação NDVI (MODIS)',
    precipitation: 'Precipitação (GPM)',
    soilMoisture: 'Umidade do Solo (SMAP)',
    relief: 'Relevo (SRTM)',
    legends: 'LEGENDAS',
    riskLevel: 'Nível de Risco: Baixo (Verde) - Alto (Vermelho)',
    floodIcon: 'Ícone de Inundação',
    landslideIcon: 'Ícone de Deslizamento',
    // Sidebar Right (Alertas)
    activeAlerts: 'ALERTAS ATIVOS',
    // Footer
    generalMetrics: 'MÉTRICAS GERAIS',
    activeSatellites: 'SATÉLITES ATIVOS',
    alertsToday: 'ALERTAS HOJE',
    monitoredAreas: 'ÁREAS MONITORADAS',
  },
  en: {
    // Header Views
    world: 'World',
    country: 'Country',
    state: 'State',
    neighborhood: 'Neighborhood',
    // Sidebar Left (Filtros e Camadas)
    filters: 'FILTERS',
    flood: 'Flood',
    landslide: 'Landslide',
    drought: 'Drought',
    extremeHeat: 'Extreme Heat',
    wildfire: 'Wildfire',
    mapLayers: 'MAP LAYERS',
    vegetation: 'Vegetation NDVI (MODIS)',
    precipitation: 'Precipitation (GPM)',
    soilMoisture: 'Soil Moisture (SMAP)',
    relief: 'Relief (SRTM)',
    legends: 'LEGENDS',
    riskLevel: 'Risk Level: Low (Green) - High (Red)',
    floodIcon: 'Flood Icon',
    landslideIcon: 'Landslide Icon',
    // Sidebar Right (Alertas)
    activeAlerts: 'ACTIVE ALERTS',
    // Footer
    generalMetrics: 'GENERAL METRICS',
    activeSatellites: 'ACTIVE SATELLITES',
    alertsToday: 'ALERTS TODAY',
    monitoredAreas: 'MONITORED AREAS',
  }
};

// 1. Criação do Contexto
const TranslationContext = createContext();

// 2. Hook para usar a tradução nos componentes
export const useTranslation = () => {
  return useContext(TranslationContext);
};

// 3. Componente Provider
export const TranslationProvider = ({ children }) => {
  // Inicializa o idioma como Português
  const [language, setLanguage] = useState('pt'); 

  // Função que retorna a tradução do texto ou a chave original
  const translate = (key) => {
    const translation = TRANSLATIONS[language];
    // Retorna o texto traduzido; se não for encontrado, tenta a versão em Inglês, e por último, a chave
    return translation[key] || TRANSLATIONS.en[key] || key; 
  };
  
  // Objeto de valor a ser fornecido
  const value = {
    t: translate,
    language,
    setLanguage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
