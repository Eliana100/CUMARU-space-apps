// backend/src/routes/api.js
import { Router } from 'express';
import * as alertsController from '../controllers/alertsController.js';

const router = Router();

// Rotas para alertas (simuladas)
router.get('/alerts/global', alertsController.getGlobalAlerts);
router.get('/alerts/country/:countryName', alertsController.getCountryAlerts);
router.get('/alerts/state/:stateName', alertsController.getStateAlerts);
router.get('/alerts/neighborhood/:neighborhoodName', alertsController.getNeighborhoodAlerts);

// Rotas para dados do mapa (simuladas)
router.get('/map-data/:viewType', alertsController.getMapData);
router.get('/map-data/:viewType/:location', alertsController.getMapData); // Para localização específica

// Rotas para métricas gerais (simuladas)
router.get('/metrics', alertsController.getGeneralMetrics);

export default router;