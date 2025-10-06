import fetch from 'node-fetch'; // Importar node-fetch para fazer requisições HTTP no Node.js

// --- DADOS SIMULADOS (MANTIDOS COMO FALLBACK) ---
const MOCKED_DATA = {
  globalAlerts: [
    { id: 'g001', type: 'FLOOD ALERT', location: 'Amazon Basin', lat: -5, lng: -60, riskScore: 85, predicted: '48h', details: 'Heavy rainfall expected.' },
    { id: 'g002', type: 'DROUGHT RISK', location: 'Sahel Region', lat: 15, lng: 0, riskScore: 70, predicted: '24h', details: 'Severe water scarcity.' },
    { id: 'g003', type: 'WILDFIRE WATCH', location: 'California, US', lat: 37, lng: -120, riskScore: 90, predicted: '12h', details: 'High temperatures and dry conditions.' },
    { id: 'g004', type: 'EXTREME HEAT', location: 'India', lat: 20, lng: 78, riskScore: 75, predicted: '24h', details: 'Record high temperatures.' },
  ],
  countryAlerts: {
    'Brazil': [
      { id: 'b001', type: 'FLOOD ALERT', location: 'Rio Grande do Sul', lat: -30, lng: -52, riskScore: 95, predicted: '48h', details: 'Flooding in several cities.' },
      { id: 'b002', type: 'DROUGHT RISK', location: 'Nordeste', lat: -8, lng: -37, riskScore: 80, predicted: '24h', details: 'Prolonged dry season.' },
      { id: 'b003', type: 'WILDFIRE WATCH', location: 'Pantanal', lat: -18, lng: -57, riskScore: 70, predicted: '24h', details: 'Increased risk due to dry vegetation.' },
    ],
  },
  stateAlerts: {
    'Sao Paulo': [
      { id: 's001', type: 'FLOOD ALERT', location: 'Vila Olímpia', lat: -23.59, lng: -46.68, riskScore: 88, predicted: '48h', details: 'High risk of flooding along Pinheiros river.', safeRoutes: true, graphData: { rainfall: [10, 20, 30, 40, 50, 45, 35, 25], soilMoisture: [0.6, 0.7, 0.8, 0.85, 0.9, 0.88, 0.82, 0.75] } },
      { id: 's002', type: 'LANDSLIDE ALERT', location: 'Serra do Mar', lat: -23.8, lng: -46.2, riskScore: 75, predicted: '24h', details: 'Heavy rains increase landslide risk.', safeRoutes: false, graphData: { rainfall: [5, 10, 15, 20, 25, 20, 15, 10], soilMoisture: [0.7, 0.75, 0.8, 0.82, 0.85, 0.83, 0.78, 0.72] } },
      { id: 's003', type: 'EXTREME HEAT', location: 'Campinas', lat: -22.9, lng: -47.06, riskScore: 60, predicted: '12h', details: 'Temperatures above 35°C expected.', safeRoutes: true, graphData: { rainfall: [0,0,0,0,0,0,0,0], soilMoisture: [0.4,0.38,0.35,0.3,0.28,0.25,0.23,0.2] } }
    ],
  },
  neighborhoodAlerts: {
    'Vila Olimpia': [
      { id: 'n001', type: 'FLOOD ALERT', location: 'Vila Olímpia', lat: -23.59, lng: -46.68, riskScore: 90, predicted: '48h', details: 'Critical flood level in Rua Funchal.', safeRoutes: true, graphData: { rainfall: [15, 25, 35, 45, 55, 50, 40, 30], soilMoisture: [0.7, 0.78, 0.85, 0.9, 0.95, 0.92, 0.87, 0.8] } },
      { id: 'n002', type: 'TRAFFIC WARNING', location: 'Av. Brigadeiro Faria Lima', lat: -23.58, lng: -46.68, riskScore: 40, details: 'Heavy traffic due to flooding.' }
    ],
    'Avenida Paulista': [
      { id: 'n003', type: 'FLOOD ALERT', location: 'Avenida Paulista', lat: -23.56, lng: -46.65, riskScore: 85, predicted: '24h', details: 'Localized flooding near Trianon-Masp.', safeRoutes: true, graphData: { rainfall: [10, 15, 20, 25, 30, 28, 22, 18], soilMoisture: [0.7, 0.75, 0.8, 0.85, 0.9, 0.88, 0.82, 0.78] } }
    ],
    'Vila Flora': [
      {
        id: 'flood-001',
        type: 'FLOOD ALERT',
        location: 'Vila Flora',
        riskScore: 30,
        predicted: '2.8M',
        details: 'Issue Warning to Civil Defense',
        safeRoutes: true,
        graphData: { rainfall: [10, 15, 20, 25, 30, 28, 22, 18], soilMoisture: [0.7, 0.75, 0.8, 0.85, 0.9, 0.88, 0.82, 0.78] }
      },
    ],
    'Ceara': [
      {
        id: 'drought-001',
        type: 'DROUGHT RISK',
        location: 'Ceara',
        details: 'Relief teams to critical routes',
        safeRoutes: false,
        graphData: { rainfall: [5, 3, 2, 1, 0, 0, 1, 2], soilMoisture: [0.3, 0.28, 0.25, 0.2, 0.18, 0.15, 0.17, 0.2] }
      },
    ],
    'Amazon, Brazil': [
      {
        id: 'wildfire-001',
        type: 'WILDFIRE WATCH',
        location: 'Amazon, Brazil',
        riskScore: 80,
        predicted: '1.2M',
        details: 'Monitor area closely',
        safeRoutes: true,
        graphData: { rainfall: [0, 0, 0, 0, 0, 0, 0, 0], soilMoisture: [0.1, 0.08, 0.07, 0.05, 0.04, 0.03, 0.02, 0.01] }
      },
    ]
  }
};

const MOCKED_MAP_DATA = {
  'global': {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-60, -5] }, properties: { id: 'hotspot-amazon', type: 'Flood', severity: 'high', location: 'Amazon Basin' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-50, -25] }, properties: { id: 'hotspot-br-south', type: 'Drought', severity: 'medium', location: 'Southern Brazil' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [100, 0] }, properties: { id: 'hotspot-asia', type: 'Extreme Heat', severity: 'high', location: 'Southeast Asia' } },
    ]
  },
  'country-Brazil': {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-45, -5], [-40, -5], [-40, -10], [-45, -10], [-45, -5]]] }, properties: { id: 'risk-nordeste', severity: 'high', type: 'Drought' } },
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-55, -28], [-50, -28], [-50, -32], [-55, -32], [-55, -28]]] }, properties: { id: 'risk-sul', severity: 'medium', type: 'Flood' } },
    ]
  },
  'state-Sao Paulo': {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-46.7, -23.5], [-46.6, -23.5], [-46.6, -23.6], [-46.7, -23.6], [-46.7, -23.5]]] }, properties: { id: 'risk-vilaolimpia', severity: 'high', type: 'Flood' } },
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-46.8, -23.7], [-46.75, -23.7], [-46.75, -23.75], [-46.8, -23.75], [-46.8, -23.7]]] }, properties: { id: 'risk-morumbi', severity: 'medium', type: 'Landslide' } },
    ]
  },
  'neighborhood-Vila Olimpia': {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-46.685, -23.595], [-46.680, -23.595], [-46.680, -23.600], [-46.685, -23.600], [-46.685, -23.595]]] }, properties: { id: 'risk-ruafunchal', severity: 'high', type: 'Flood' } },
    ]
  }
};
// --- FIM DOS DADOS SIMULADOS ---


// --- FUNÇÕES DO CONTROLLER ---

// API URL da NASA EONET
const EONET_API_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50';

/**
 * Busca alertas globais da API EONET da NASA, com fallback para dados mockados.
 */
export const getGlobalAlerts = async (req, res) => {
  try {
    const nasaResponse = await fetch(EONET_API_URL);
    if (!nasaResponse.ok) throw new Error(`EONET API failed with status ${nasaResponse.status}`);
    const data = await nasaResponse.json();

    // Mapeia os dados da NASA para o formato que seu front-end espera
    const formattedAlerts = data.events.map(event => {
      // Tenta extrair a coordenada mais recente (formato GeoJSON [lng, lat])
      const coords = event.geometries?.[0]?.coordinates;
      let lng = coords?.[0] || 0;
      let lat = coords?.[1] || 0;

      // Classifica o tipo de alerta
      const type = event.categories?.[0]?.title || 'UNKNOWN EVENT';
      const riskScore = Math.min(100, 50 + (event.geometries?.length * 5) || 50); // Simula score baseado no número de geometrias

      return {
        id: event.id,
        type: `${type.toUpperCase()} ALERT`,
        location: event.title,
        lat: lat,
        lng: lng,
        riskScore: riskScore,
        predicted: '24h', 
        details: event.description || event.title,
        safeRoutes: Math.random() > 0.5, // Simula rotas seguras
      };
    });
    
    // Filtra eventos sem coordenadas válidas e retorna
    res.json(formattedAlerts.filter(alert => alert.lat !== 0 || alert.lng !== 0));

  } catch (error) {
    console.error('Erro ao buscar dados da NASA:', error);
    // Retorna os dados simulados como fallback
    res.status(200).json(MOCKED_DATA.globalAlerts); 
  }
};


export const getCountryAlerts = (req, res) => {
  const { countryName } = req.params;
  // NOTE: Para usar dados reais aqui, você precisaria de uma API que filtra por país (ex: dados do INPE/Brasil)
  const alerts = MOCKED_DATA.countryAlerts[countryName] || MOCKED_DATA.globalAlerts;
  res.json(alerts);
};

export const getStateAlerts = (req, res) => {
  const { stateName } = req.params;
  const alerts = MOCKED_DATA.stateAlerts[stateName] || [];
  res.json(alerts);
};

export const getNeighborhoodAlerts = (req, res) => {
  const { neighborhoodName } = req.params;
  const alerts = MOCKED_DATA.neighborhoodAlerts[neighborhoodName] || [];
  res.json(alerts);
};

export const getMapData = (req, res) => {
  const { viewType, location } = req.params;
  let key = viewType;
  if (location) {
    key = `${viewType}-${location}`; // Ex: 'state-Sao Paulo'
  }
  const data = MOCKED_MAP_DATA[key] || { type: 'FeatureCollection', features: [] };
  res.json(data);
};

export const getGeneralMetrics = (req, res) => {
  // Retorna métricas simuladas (idealmente, isto também viria de um serviço externo)
  const metrics = {
    generalMetrics: 14,
    activeSatellites: Math.floor(Math.random() * (20 - 10 + 1)) + 10, 
    alertsToday: Math.floor(Math.random() * (300 - 100 + 1)) + 100,
    monitoredAreas: Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000,
  };
  res.json(metrics);
};
