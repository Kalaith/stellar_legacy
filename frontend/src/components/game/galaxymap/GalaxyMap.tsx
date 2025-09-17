import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import type { StarSystem } from '../../../types/game';

const GalaxyMap: React.FC = () => {
  const {
    starSystems,
    selectedSystem,
    resources,
    exploreSystem,
    establishColony,
    selectSystem
  } = useGameStore();

  const handleSystemClick = (system: StarSystem) => {
    selectSystem(system);
  };

  const handleExplore = () => {
    if (selectedSystem && resources.energy >= 50) {
      exploreSystem();
    }
  };

  const handleEstablishColony = () => {
    if (selectedSystem && resources.credits >= 200 && resources.minerals >= 100) {
      establishColony();
    }
  };

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'explored':
        return 'text-green-400';
      case 'unexplored':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const canExplore = selectedSystem && selectedSystem.status === 'unexplored' && resources.energy >= 50;
  const canEstablishColony = selectedSystem &&
    selectedSystem.status === 'explored' &&
    selectedSystem.planets.some(p => !p.developed) &&
    resources.credits >= 200 &&
    resources.minerals >= 100;

  return (
    <div className="galaxy-interface grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Galaxy Map View */}
      <div className="lg:col-span-2">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Galaxy Map</h3>
          <div className="galaxy-container relative bg-slate-900 rounded-lg p-4 min-h-[400px] overflow-hidden">
            <div className="galaxy-grid absolute inset-0">
              {starSystems.map((system, index) => (
                <div
                  key={index}
                  className={`star-system absolute cursor-pointer transition-all duration-200 hover:scale-125 ${
                    system.status === 'explored' ? 'text-yellow-400' : 'text-blue-400'
                  } ${
                    selectedSystem?.name === system.name ? 'selected scale-125 ring-2 ring-teal-400' : ''
                  }`}
                  style={{
                    left: `${system.coordinates.x}px`,
                    top: `${system.coordinates.y}px`,
                  }}
                  onClick={() => handleSystemClick(system)}
                  title={system.name}
                >
                  ⭐
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Details */}
      <div className="space-y-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">System Details</h3>
          {selectedSystem ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg">{selectedSystem.name}</h4>
                <p className="text-sm">
                  Status: <span className={`status ${getSystemStatusColor(selectedSystem.status)}`}>
                    {selectedSystem.status}
                  </span>
                </p>
              </div>

              <div>
                <h5 className="font-medium mb-2">Planets:</h5>
                <div className="space-y-2">
                  {selectedSystem.planets.map((planet, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-slate-700 rounded"
                    >
                      <span className="text-sm">
                        {planet.name} ({planet.type})
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        planet.developed
                          ? 'bg-green-600 text-green-100'
                          : 'bg-blue-600 text-blue-100'
                      }`}>
                        {planet.developed ? 'Developed' : 'Undeveloped'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Select a system to view details</p>
          )}
        </div>

        {/* System Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Actions</h3>
          <div className="space-y-2">
            <button
              className={`btn btn--primary w-full ${!canExplore ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleExplore}
              disabled={!canExplore}
            >
              Explore System (50 Energy)
            </button>
            <button
              className={`btn btn--secondary w-full ${!canEstablishColony ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleEstablishColony}
              disabled={!canEstablishColony}
            >
              Establish Colony (200 Credits, 100 Minerals)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalaxyMap;