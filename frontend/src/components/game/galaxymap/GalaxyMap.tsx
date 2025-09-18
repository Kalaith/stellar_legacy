import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { UI_CONSTANTS } from '../../../constants/uiConstants';
import type { StarSystem } from '../../../types/game';

const GalaxyMap: React.FC = React.memo(() => {
  const {
    starSystems,
    selectedSystem,
    resources,
    exploreSystem,
    establishColony,
    selectSystem
  } = useGameStore();

  const handleSystemClick = useCallback((system: StarSystem) => {
    selectSystem(system);
  }, [selectSystem]);

  const handleExplore = useCallback(() => {
    if (selectedSystem && resources.energy >= 50) {
      exploreSystem();
    }
  }, [selectedSystem, resources.energy, exploreSystem]);

  const handleEstablishColony = useCallback(() => {
    if (selectedSystem && resources.credits >= 200 && resources.minerals >= 100) {
      establishColony();
    }
  }, [selectedSystem, resources.credits, resources.minerals, establishColony]);

  const canExplore = useMemo(() =>
    selectedSystem && selectedSystem.status === 'unexplored' && resources.energy >= 50,
    [selectedSystem, resources.energy]
  );

  const canEstablishColony = useMemo(() =>
    selectedSystem &&
    selectedSystem.status === 'explored' &&
    selectedSystem.planets.some(p => !p.developed) &&
    resources.credits >= 200 &&
    resources.minerals >= 100,
    [selectedSystem, resources.credits, resources.minerals]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Galaxy Map View */}
      <div className="lg:col-span-2">
        <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
          <h3 className={`text-lg font-semibold ${UI_CONSTANTS.SPACING.SECTION_MARGIN} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Galaxy Map</h3>
          <div className={`relative ${UI_CONSTANTS.COLORS.BG_PRIMARY} rounded-lg p-4 min-h-[400px] overflow-hidden`}>
            <div className="absolute inset-0">
              {starSystems.map((system, index) => (
                <div
                  key={index}
                  className={`absolute cursor-pointer transition-all duration-200 hover:scale-125 ${
                    system.status === 'explored' ? 'text-yellow-400' : 'text-blue-400'
                  } ${
                    selectedSystem?.name === system.name ? 'scale-125 ring-2 ring-teal-400' : ''
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
        <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
          <h3 className={`text-lg font-semibold ${UI_CONSTANTS.SPACING.SECTION_MARGIN} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>System Details</h3>
          {selectedSystem ? (
            <div className="space-y-4">
              <div>
                <h4 className={`font-medium text-lg ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>{selectedSystem.name}</h4>
                <p className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY}`}>
                  Status: <span className={`font-medium ${
                    selectedSystem.status === 'explored' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {selectedSystem.status}
                  </span>
                </p>
              </div>

              <div>
                <h5 className={`font-medium mb-2 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Planets:</h5>
                <div className="space-y-2">
                  {selectedSystem.planets.map((planet, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-2 ${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded`}
                    >
                      <span className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY}`}>
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
            <p className={UI_CONSTANTS.COLORS.TEXT_MUTED}>Select a system to view details</p>
          )}
        </div>

        {/* System Actions */}
        <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
          <h3 className={`text-lg font-semibold ${UI_CONSTANTS.SPACING.SECTION_MARGIN} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Actions</h3>
          <div className="space-y-2">
            <button
              className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                canExplore
                  ? `${UI_CONSTANTS.COLORS.BG_SUCCESS} hover:bg-teal-700 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`
                  : `${UI_CONSTANTS.COLORS.BG_TERTIARY} ${UI_CONSTANTS.COLORS.TEXT_MUTED} cursor-not-allowed`
              }`}
              onClick={handleExplore}
              disabled={!canExplore}
            >
              Explore System (50 Energy)
            </button>
            <button
              className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                canEstablishColony
                  ? `${UI_CONSTANTS.COLORS.BG_TERTIARY} ${UI_CONSTANTS.COLORS.HOVER_BG_SECONDARY} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`
                  : `${UI_CONSTANTS.COLORS.BG_TERTIARY} ${UI_CONSTANTS.COLORS.TEXT_MUTED} cursor-not-allowed`
              }`}
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
});

GalaxyMap.displayName = 'GalaxyMap';

export default GalaxyMap;