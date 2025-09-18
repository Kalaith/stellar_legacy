import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CulturalEvolution, CulturalChange } from '../../types/generationalMissions';
import type { SectTypeType } from '../../types/enums';

interface CulturalEvolutionProps {
  culturalEvolution: CulturalEvolution[];
  currentGeneration: number;
  onCulturalAction?: (action: string, parameters?: any) => void;
}

export const CulturalEvolutionComponent: React.FC<CulturalEvolutionProps> = ({
  culturalEvolution,
  currentGeneration,
  onCulturalAction
}) => {
  const [selectedSect, setSelectedSect] = useState<SectTypeType | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'trends' | 'analysis' | 'decisions'>('timeline');

  const sectInfo = {
    preservers: {
      name: 'The Preservers',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900',
      baseline: 'Traditional Human Culture'
    },
    adaptors: {
      name: 'The Adaptors',
      color: 'text-green-400',
      bgColor: 'bg-green-900',
      baseline: 'Enhanced Human Potential'
    },
    wanderers: {
      name: 'The Wanderers',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900',
      baseline: 'Nomadic Freedom Culture'
    }
  };

  const getDeviationColor = (deviation: number) => {
    const absDeviation = Math.abs(deviation);
    if (absDeviation > 75) return 'text-red-400';
    if (absDeviation > 50) return 'text-orange-400';
    if (absDeviation > 25) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getDeviationDescription = (deviation: number) => {
    const absDeviation = Math.abs(deviation);
    const direction = deviation > 0 ? 'Progressive' : 'Conservative';

    if (absDeviation > 75) return `Extreme ${direction} Shift`;
    if (absDeviation > 50) return `Major ${direction} Change`;
    if (absDeviation > 25) return `Moderate ${direction} Drift`;
    return 'Minimal Change';
  };

  const getImpactIcon = (impact: number) => {
    if (impact > 50) return '🌟'; // High impact
    if (impact > 25) return '⭐'; // Medium impact
    return '✨'; // Low impact
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {culturalEvolution.map((evolution) => {
          const info = sectInfo[evolution.sect];
          const totalChanges = evolution.majorChanges.length;
          const permanentChanges = evolution.majorChanges.filter(c => c.isPermanent).length;

          return (
            <motion.div
              key={evolution.sect}
              className={`${info.bgColor} bg-opacity-20 border border-gray-600 rounded-lg p-4 cursor-pointer hover:border-opacity-60 transition-colors`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedSect(evolution.sect)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={`text-lg font-bold ${info.color}`}>{info.name}</h3>
                <span className="text-xs text-gray-400">Gen {currentGeneration}</span>
              </div>

              <div className="mb-3">
                <div className="text-sm text-gray-300 mb-2">
                  Baseline: {info.baseline}
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Cultural Drift:</span>
                  <span className={`font-medium ${getDeviationColor(evolution.baselineDeviation)}`}>
                    {evolution.baselineDeviation > 0 ? '+' : ''}{evolution.baselineDeviation}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      Math.abs(evolution.baselineDeviation) > 50 ? 'bg-red-500' :
                      Math.abs(evolution.baselineDeviation) > 25 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.abs(evolution.baselineDeviation))}%`,
                      marginLeft: evolution.baselineDeviation < 0 ? 'auto' : '0'
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Changes:</span>
                  <span className="text-white">{totalChanges}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Permanent:</span>
                  <span className="text-green-400">{permanentChanges}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {getDeviationDescription(evolution.baselineDeviation)}
                </div>
              </div>

              {evolution.currentTrends.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="text-xs text-blue-300">
                    Active: {evolution.currentTrends[0]}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">⟡ Cultural Evolution Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {culturalEvolution.reduce((sum, e) => sum + e.majorChanges.length, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Cultural Changes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {culturalEvolution.reduce((sum, e) => sum + e.majorChanges.filter(c => c.isPermanent).length, 0)}
            </div>
            <div className="text-sm text-gray-400">Permanent Adaptations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {culturalEvolution.reduce((sum, e) => sum + e.currentTrends.length, 0)}
            </div>
            <div className="text-sm text-gray-400">Active Trends</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectDetail = () => {
    if (!selectedSect) return null;

    const evolution = culturalEvolution.find(e => e.sect === selectedSect);
    if (!evolution) return null;

    const info = sectInfo[selectedSect];

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${info.color} mb-2`}>{info.name}</h2>
            <p className="text-gray-300">Cultural Evolution Analysis</p>
          </div>
          <button
            onClick={() => setSelectedSect(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          {(['timeline', 'trends', 'analysis', 'decisions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent(evolution)}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const renderTabContent = (evolution: CulturalEvolution) => {
    switch (activeTab) {
      case 'timeline':
        return renderTimelineTab(evolution);
      case 'trends':
        return renderTrendsTab(evolution);
      case 'analysis':
        return renderAnalysisTab(evolution);
      case 'decisions':
        return renderDecisionsTab(evolution);
      default:
        return null;
    }
  };

  const renderTimelineTab = (evolution: CulturalEvolution) => (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-blue-400 mb-4">Cultural Timeline</h4>
        <div className="space-y-4">
          {evolution.majorChanges
            .sort((a, b) => a.generation - b.generation)
            .map((change) => (
              <div key={change.id} className="relative pl-6 border-l-2 border-blue-500">
                <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full" />
                <div className="mb-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-white">{change.name}</h5>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Gen {change.generation}</span>
                      <span className="text-lg">{getImpactIcon(change.impact)}</span>
                      {change.isPermanent && (
                        <span className="px-2 py-1 bg-green-600 text-green-100 rounded text-xs">
                          Permanent
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{change.description}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    Cultural Impact: <span className={getDeviationColor(change.impact)}>
                      {change.impact > 0 ? '+' : ''}{change.impact}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderTrendsTab = (evolution: CulturalEvolution) => (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-green-400 mb-4">Current Trends</h4>
        {evolution.currentTrends.length > 0 ? (
          <div className="space-y-3">
            {evolution.currentTrends.map((trend, index) => (
              <div key={index} className="bg-gray-600 rounded p-3 border-l-4 border-green-500">
                <div className="font-medium text-white mb-1">{trend}</div>
                <div className="text-sm text-gray-300">
                  This trend is actively shaping cultural development in Generation {currentGeneration}.
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No major cultural trends detected in this generation.</div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-yellow-400 mb-4">Trend Predictions</h4>
        <div className="space-y-3">
          <div className="bg-gray-600 rounded p-3">
            <div className="font-medium text-white mb-1">Technological Integration</div>
            <div className="text-sm text-gray-300">
              Likelihood: <span className="text-yellow-400">75%</span> -
              Expected impact on cultural norms regarding human-machine interaction.
            </div>
          </div>
          <div className="bg-gray-600 rounded p-3">
            <div className="font-medium text-white mb-1">Generational Values Shift</div>
            <div className="text-sm text-gray-300">
              Likelihood: <span className="text-blue-400">60%</span> -
              New generation may develop different priorities than founders.
            </div>
          </div>
          <div className="bg-gray-600 rounded p-3">
            <div className="font-medium text-white mb-1">Resource Scarcity Adaptation</div>
            <div className="text-sm text-gray-300">
              Likelihood: <span className="text-red-400">45%</span> -
              Cultural practices may evolve based on available resources.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysisTab = (evolution: CulturalEvolution) => {
    const info = sectInfo[evolution.sect];
    const totalImpact = evolution.majorChanges.reduce((sum, change) => sum + Math.abs(change.impact), 0);
    const averageImpact = evolution.majorChanges.length > 0 ? totalImpact / evolution.majorChanges.length : 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-purple-400 mb-4">Cultural Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Baseline Deviation:</span>
                <span className={getDeviationColor(evolution.baselineDeviation)}>
                  {evolution.baselineDeviation > 0 ? '+' : ''}{evolution.baselineDeviation}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Changes:</span>
                <span className="text-white">{evolution.majorChanges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Average Impact:</span>
                <span className="text-blue-400">{averageImpact.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Permanent Shifts:</span>
                <span className="text-green-400">
                  {evolution.majorChanges.filter(c => c.isPermanent).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-orange-400 mb-4">Cultural Health</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Stability:</span>
                  <span className={Math.abs(evolution.baselineDeviation) < 25 ? 'text-green-400' :
                    Math.abs(evolution.baselineDeviation) < 50 ? 'text-yellow-400' : 'text-red-400'}>
                    {Math.abs(evolution.baselineDeviation) < 25 ? 'Stable' :
                     Math.abs(evolution.baselineDeviation) < 50 ? 'Shifting' : 'Unstable'}
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      Math.abs(evolution.baselineDeviation) < 25 ? 'bg-green-500' :
                      Math.abs(evolution.baselineDeviation) < 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, 100 - Math.abs(evolution.baselineDeviation))}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-300">
                {Math.abs(evolution.baselineDeviation) < 25
                  ? 'Culture remains close to founding principles'
                  : Math.abs(evolution.baselineDeviation) < 50
                  ? 'Moderate drift from original culture'
                  : 'Significant cultural transformation occurring'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-red-400 mb-4">Risk Assessment</h4>
          <div className="space-y-3">
            {Math.abs(evolution.baselineDeviation) > 75 && (
              <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-3">
                <div className="font-medium text-red-400">Critical Cultural Drift</div>
                <div className="text-sm text-gray-300">
                  Culture has deviated significantly from baseline. Risk of identity crisis and social fragmentation.
                </div>
              </div>
            )}
            {evolution.majorChanges.filter(c => !c.isPermanent).length > 3 && (
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-500 rounded p-3">
                <div className="font-medium text-yellow-400">Cultural Instability</div>
                <div className="text-sm text-gray-300">
                  Multiple temporary changes suggest cultural uncertainty. Consider stabilizing measures.
                </div>
              </div>
            )}
            {evolution.currentTrends.length === 0 && (
              <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded p-3">
                <div className="font-medium text-blue-400">Cultural Stagnation</div>
                <div className="text-sm text-gray-300">
                  No active cultural trends. Society may benefit from deliberate cultural initiatives.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDecisionsTab = (evolution: CulturalEvolution) => {
    if (!onCulturalAction) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-400">Cultural decision system not available.</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-400 mb-4">Cultural Guidance</h4>
          <p className="text-gray-300 mb-4">
            Shape the cultural evolution of your civilization through deliberate actions and policies.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onCulturalAction('preserve_traditions', { sect: evolution.sect })}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              Preserve Traditions
            </button>
            <button
              onClick={() => onCulturalAction('encourage_innovation', { sect: evolution.sect })}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
            >
              Encourage Innovation
            </button>
            <button
              onClick={() => onCulturalAction('cultural_festival', { sect: evolution.sect })}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              Cultural Festival
            </button>
            <button
              onClick={() => onCulturalAction('generational_dialogue', { sect: evolution.sect })}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition-colors"
            >
              Generational Dialogue
            </button>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-400 mb-4">Stabilization Actions</h4>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => onCulturalAction('cultural_census', { sect: evolution.sect })}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm transition-colors text-left"
            >
              <div className="font-medium">Cultural Census</div>
              <div className="text-xs text-indigo-200">Assess current cultural state and trends</div>
            </button>
            <button
              onClick={() => onCulturalAction('cultural_education', { sect: evolution.sect })}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded text-sm transition-colors text-left"
            >
              <div className="font-medium">Cultural Education Program</div>
              <div className="text-xs text-teal-200">Reinforce core values and beliefs</div>
            </button>
            <button
              onClick={() => onCulturalAction('cultural_reform', { sect: evolution.sect })}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm transition-colors text-left"
            >
              <div className="font-medium">Cultural Reform Initiative</div>
              <div className="text-xs text-orange-200">Actively guide cultural development</div>
            </button>
          </div>
        </div>

        {Math.abs(evolution.baselineDeviation) > 50 && (
          <div className="bg-gray-700 rounded-lg p-4 border border-red-500">
            <h4 className="text-lg font-semibold text-red-400 mb-4">Emergency Measures</h4>
            <p className="text-gray-300 mb-3 text-sm">
              High cultural deviation detected. Consider emergency stabilization measures.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => onCulturalAction('cultural_restoration', { sect: evolution.sect })}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors text-left"
              >
                <div className="font-medium">Cultural Restoration</div>
                <div className="text-xs text-red-200">Attempt to return to baseline culture</div>
              </button>
              <button
                onClick={() => onCulturalAction('accept_evolution', { sect: evolution.sect })}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors text-left"
              >
                <div className="font-medium">Accept Evolution</div>
                <div className="text-xs text-purple-200">Embrace the cultural change as new baseline</div>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">⟡ Cultural Evolution</h1>
        <p className="text-gray-300">
          Track how your civilization's culture evolves and adapts across generations of space travel.
        </p>
      </div>

      {selectedSect ? renderSectDetail() : renderOverview()}
    </div>
  );
};

export default CulturalEvolutionComponent;