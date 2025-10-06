// src/components/Sidebar/SiderbarRight.jsx

// CORREÇÃO: Importando useState e useEffect, que são usados no componente.
import React, { useState, useEffect } from 'react';

// NOTE: Para o backend funcionar corretamente, você precisa garantir que o SidebarRight
// esteja recebendo e usando o 'currentView' e 'onAlertClick' no App.jsx.

const SidebarRight = ({ onAlertClick, currentView }) => {
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            setIsLoading(true);
            setError(null);
            let url = '';
            // Para simular, usaremos um endpoint específico. Em um app real, o currentView
            // definiria a localização (ex: 'country-Brazil' ou 'state-Sao Paulo')
            const MOCKED_LOCATION = 'Sao Paulo'; 

            switch (currentView) {
                case 'global':
                    url = 'http://localhost:5000/api/alerts/global';
                    break;
                case 'country':
                    url = 'http://localhost:5000/api/alerts/country/Brazil';
                    break;
                case 'state':
                case 'neighborhood':
                    // Usamos um mock de estado/bairro para o sidebar
                    url = `http://localhost:5000/api/alerts/state/${MOCKED_LOCATION}`;
                    break;
                default:
                    url = 'http://localhost:5000/api/alerts/global';
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch alerts from ${url}`);
                }
                const data = await response.json();
                setAlerts(data);
            } catch (err) {
                console.error("Fetch error in SidebarRight:", err);
                // Define alerts simulados como fallback se o servidor Node não estiver rodando
                if (currentView === 'global') {
                     setAlerts(MOCKED_GLOBAL_ALERTS);
                } else {
                     setAlerts(MOCKED_ACTIVE_ALERTS); 
                }
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAlerts();
    }, [currentView]); // Re-executa quando a visualização do mapa muda


    // Dados Mockados para fallback (se o fetch falhar)
    const MOCKED_ACTIVE_ALERTS = [
        {
            id: 'flood-001',
            type: 'FLOOD ALERT',
            location: 'Vila Flora',
            riskScore: 30,
            predicted: '2.8M',
            details: 'Issue Warning to Civil Defense',
            safeRoutes: true,
        },
        {
            id: 'drought-001',
            type: 'DROUGHT RISK',
            location: 'Ceara',
            details: 'Relief teams to critical routes',
            safeRoutes: false,
        },
        {
            id: 'wildfire-001',
            type: 'WILDFIRE WATCH',
            location: 'Amazon, Brazil',
            riskScore: 80,
            predicted: '1.2M',
            details: 'Monitor area closely',
            safeRoutes: true,
        },
    ];

    const MOCKED_GLOBAL_ALERTS = [
        { id: 'g001', type: 'FLOOD ALERT', location: 'Amazon Basin', riskScore: 85, predicted: '48h', details: 'Heavy rainfall expected.' },
        { id: 'g002', type: 'DROUGHT RISK', location: 'Sahel Region', riskScore: 70, predicted: '24h', details: 'Severe water scarcity.' },
    ];


    let displayAlerts = alerts.length > 0 ? alerts : MOCKED_ACTIVE_ALERTS;
    
    // Se o fetch falhou, e alerts está vazio, usamos o mock.
    if (error && alerts.length === 0) {
        displayAlerts = currentView === 'global' ? MOCKED_GLOBAL_ALERTS : MOCKED_ACTIVE_ALERTS;
    }


    return (
        <aside className="w-80 bg-white dark:bg-gray-800 p-4 shadow-lg overflow-y-auto flex-shrink-0">
            <h2 className="text-md font-semibold mb-4 text-gray-800 dark:text-gray-200">
                ACTIVE ALERTS ({currentView.toUpperCase()})
            </h2>
            {isLoading && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading alerts...</div>
            )}
            {error && !isLoading && (
                <div className="text-center py-4 text-red-500">
                    Falha ao conectar com o backend. Exibindo dados de simulação.
                </div>
            )}
            {!isLoading && displayAlerts.length === 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">Nenhum alerta ativo.</div>
            )}
            
            <div className="space-y-4">
                {displayAlerts.map(alert => (
                    <div 
                        key={alert.id} 
                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer"
                        // Adicionando o clique no container
                        onClick={() => onAlertClick(alert)} 
                    >
                        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">{alert.type} - {alert.location}</h3>
                        {alert.riskScore && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">Risk Score: {alert.riskScore}</p>
                        )}
                        {alert.predicted && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">Predicted: {alert.predicted}</p>
                        )}
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{alert.details}</p>
                        <div className="flex flex-col space-y-2 mt-3">
                            {/* O botão agora só exibe se safeRoutes for true, e o clique vai para o onAlertClick */}
                            {alert.safeRoutes && (
                                <button
                                    // onClick já está no container, mas mantemos o botão para estilo e foco
                                    onClick={(e) => { e.stopPropagation(); onAlertClick(alert); }}
                                    className="w-full text-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors duration-200"
                                >
                                    View Safe Routes
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); onAlertClick(alert); }}
                                className="w-full text-center px-3 py-1 border border-gray-300 dark:border-gray-500 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-md transition-colors duration-200"
                            >
                                Issue Warning to Civil Defense
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

// CORREÇÃO: Apenas uma exportação default no final
export default SidebarRight;
