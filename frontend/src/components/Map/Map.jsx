import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Your Mapbox access token
// O token será carregado da sua variável de ambiente VITE_MAPBOX_ACCESS_TOKEN
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Configurações de câmera para cada visualização
const VIEW_CONFIGS = {
  global: { center: [-55, -15], zoom: 2.5, pitch: 30, bearing: 0 },
  country: { center: [-50, -15], zoom: 4, pitch: 45, bearing: -20 }, // Foco no Brasil
  state: { center: [-47.5, -23.5], zoom: 7, pitch: 0, bearing: 0 }, // Foco em São Paulo Estado
  neighborhood: { center: [-46.6333, -23.5505], zoom: 12, pitch: 0, bearing: 0 }, // Foco em São Paulo Cidade
};

const Map = ({ onViewChange, currentView, onAlertClick }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(VIEW_CONFIGS.global.center[0]);
  const [lat, setLat] = useState(VIEW_CONFIGS.global.center[1]);
  const [zoom, setZoom] = useState(VIEW_CONFIGS.global.zoom);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markers, setMarkers] = useState([]); // Estado para gerenciar os Mapbox Markers

  // --- Dados Simulados para diferentes views (devem vir do backend) ---
  const globalHotspots = [
    { id: 'flood-global', lat: -5, lng: -60, severity: 'high', type: 'Flood', location: 'Amazon Basin', prediction: '48h' },
    { id: 'drought-global', lat: 15, lng: 0, severity: 'medium', type: 'Drought', location: 'Sahel Region' },
    { id: 'wildfire-global', lat: 37, lng: -120, severity: 'high', type: 'Wildfire', location: 'Western US', prediction: '24h' },
    { id: 'heat-global', lat: 0, lng: 100, severity: 'high', type: 'Extreme Heat', location: 'Southeast Asia' },
  ];

  const saoPauloAlerts = [
    { id: 'flood-sp-1', lat: -23.5505, lng: -46.6333, type: 'Flood', location: 'Avenida Paulista', riskLevel: 'High', details: '48h rainfall: 150mm', status: 'active' },
    { id: 'landslide-sp-1', lat: -23.65, lng: -46.7, type: 'Landslide', location: 'Morumbi Hills', riskLevel: 'Medium', details: 'Soil moisture: 90%', status: 'active' },
  ];
  // --- FIM dos Dados Simulados ---

  // Função para buscar dados GeoJSON do backend (que deve estar em localhost:5000)
  const fetchMapData = async (view, location = '') => {
    let url = `http://localhost:5000/api/map-data/${view}`;
    if (location) {
      url += `/${location}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch map data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching map data for ${view}:`, error);
      return { type: 'FeatureCollection', features: [] }; // Retorna GeoJSON vazio em caso de falha
    }
  };

  // Função para adicionar ou atualizar uma camada GeoJSON
  const addOrUpdateGeojsonLayer = async (sourceId, layerId, view, location) => {
    if (!map.current) return;

    const geojsonData = await fetchMapData(view, location);

    if (map.current.getSource(sourceId)) {
      map.current.getSource(sourceId).setData(geojsonData);
    } else {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: geojsonData,
      });

      map.current.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          // Exemplo de estilização de risco: vermelho/alto, amarelo/médio
          'fill-color': [
            'match',
            ['get', 'severity'],
            'high', '#E53E3E', // Vermelho para risco alto (Tailwind red-600)
            'medium', '#F6E05E', // Amarelo para risco médio (Tailwind yellow-400)
            '#48BB78' // Verde/default
          ],
          'fill-opacity': 0.6,
          'fill-outline-color': '#fff'
        },
        layout: {
          'visibility': 'none' // Inicialmente invisível
        }
      });
    }
  };

  // Inicialização do Mapa
  useEffect(() => {
    if (map.current) return; // Inicializa o mapa apenas uma vez

    const config = VIEW_CONFIGS.global;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Tema escuro para combinar com o design
      center: config.center,
      zoom: config.zoom,
      pitch: config.pitch,
      bearing: config.bearing,
      antialias: true,
      maxBounds: [[-180, -85], [180, 85]],
    });

    map.current.on('load', () => {
      setIsMapLoaded(true);

      // Adiciona controles de navegação e escala
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl());

      // --- Inicializa as Fontes de Dados ---

      // 1. Hotspots Globais (para Global/Country views)
      map.current.addSource('global-hotspots-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: globalHotspots.map(spot => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [spot.lng, spot.lat] },
            properties: spot,
          })),
        }
      });
      map.current.addLayer({
        id: 'global-hotspot-layer',
        type: 'circle',
        source: 'global-hotspots-source',
        paint: {
          'circle-color': ['match', ['get', 'severity'], 'high', '#ff0000', 'medium', '#ff7b00', '#ffcc00'],
          'circle-radius': 10,
          'circle-opacity': 0.8,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#fff',
        },
        layout: { 'visibility': 'visible' } // Inicialmente visível (Global)
      });


      // 2. Inicializa fontes GeoJSON para áreas de risco (Country, State, Neighborhood)
      addOrUpdateGeojsonLayer('country-risk-source', 'country-risk-layer', 'country', 'Brazil');
      addOrUpdateGeojsonLayer('state-risk-source', 'state-risk-layer', 'state', 'Sao Paulo');
      addOrUpdateGeojsonLayer('neighborhood-risk-source', 'neighborhood-risk-layer', 'neighborhood', 'Vila Olimpia');

      // 3. Adiciona Markers de Alerta (para visualizações detalhadas)
      const newMarkers = saoPauloAlerts.map((alert) => {
        const el = document.createElement('div');
        el.className = 'marker-pin';
        el.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin">
            <path d="M12 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
          </svg>
        `;
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => onAlertClick(alert));

        const marker = new mapboxgl.Marker(el)
          .setLngLat([alert.lng, alert.lat])
          .addTo(map.current);

        return marker;
      });
      setMarkers(newMarkers); // Salva os markers no estado para controle futuro
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Efeito para lidar com mudanças de visualização (chamado pelo Header)
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const config = VIEW_CONFIGS[currentView];

    // Transição de câmera
    map.current.flyTo({
      center: config.center,
      zoom: config.zoom,
      pitch: config.pitch,
      bearing: config.bearing,
      duration: 1500,
      essential: true
    });

    // --- Lógica de Visibilidade de Camadas ---
    const allLayers = ['global-hotspot-layer', 'country-risk-layer', 'state-risk-layer', 'neighborhood-risk-layer'];
    
    // Esconde todas as camadas de GeoJSON/Pontos inicialmente
    allLayers.forEach(layerId => {
        if (map.current.getLayer(layerId)) {
            map.current.setLayoutProperty(layerId, 'visibility', 'none');
        }
    });

    // Mostra as camadas corretas
    let targetLayer = null;
    let markersVisible = false;

    if (currentView === 'global' || currentView === 'country') {
      // Usa a camada de hotspots para Global e Country (simulando a visualização 3D)
      targetLayer = 'global-hotspot-layer';
    } else if (currentView === 'state') {
      // Mostra a camada de GeoJSON de risco do estado
      targetLayer = 'state-risk-layer';
      markersVisible = true; // Mostra markers detalhados no zoom do estado
    } else if (currentView === 'neighborhood') {
      // Mostra a camada de GeoJSON de risco do bairro
      targetLayer = 'neighborhood-risk-layer';
      markersVisible = true;
    }

    if (targetLayer && map.current.getLayer(targetLayer)) {
      map.current.setLayoutProperty(targetLayer, 'visibility', 'visible');
    }
    
    // Alterna a visibilidade dos Mapbox Markers
    markers.forEach(marker => {
        const el = marker.getElement();
        el.style.display = markersVisible ? 'flex' : 'none'; // 'flex' (definido no CSS) para visível
    });

    // Habilita/Desabilita o 3D Terrain e Light (para o efeito "globo")
    if (currentView === 'global' || currentView === 'country') {
        // Simula o globo 3D inclinando a câmera e usando a luz ambiente
        map.current.setLight({
            'anchor': 'viewport',
            'color': 'rgba(255, 255, 255, 0.8)',
            'intensity': 0.6
        });
    } else {
        // Retorna a visualização 2D normal
        map.current.setLight({
            'anchor': 'viewport',
            'color': 'rgba(255, 255, 255, 0.8)',
            'intensity': 0
        });
    }
  }, [currentView, isMapLoaded, markers]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <div className="flex-1 relative">
      <div ref={mapContainer} className="map-container w-full h-full" />
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-md text-xs shadow-md z-10 text-gray-900 dark:text-gray-100 font-mono">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      {/* Estilos CSS embutidos para Mapbox e Markers */}
      <style>{`
        /* O Mapbox Navigation Control está no canto superior direito por padrão */
        .mapboxgl-ctrl-group {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border-radius: 0.5rem; /* rounded-lg */
          overflow: hidden;
        }
        .marker-pin {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: red; /* Cor do ícone */
          font-size: 24px;
        }
        .marker-pin svg {
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.4));
        }
      `}</style>
    </div>
  );
};

export default Map;
