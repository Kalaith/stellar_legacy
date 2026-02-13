// components/chronicle/HeritageSelector.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { TerminalWindow } from '../ui/TerminalWindow';
import { TerminalText } from '../ui/TerminalWindow';
import type {
  HeritageModifier,
  HeritageSelectionCriteria,
  HeritageAnalysis,
  HeritageConflict,
  HeritageTier,
} from '../../types/heritage';
import type { GenerationalMission } from '../../types/generationalMissions';
import { HeritageService } from '../../services/HeritageService';

interface HeritageSelectorProps {
  availableModifiers: HeritageModifier[];
  targetMission?: Partial<GenerationalMission>;
  onSelectionChange: (selectedModifiers: HeritageModifier[]) => void;
  onApply: (selectedModifiers: HeritageModifier[]) => void;
  maxSelections?: number;
}

export const HeritageSelector: React.FC<HeritageSelectorProps> = ({
  availableModifiers,
  targetMission,
  onSelectionChange,
  onApply,
  maxSelections = 5,
}) => {
  const [selectedModifiers, setSelectedModifiers] = useState<
    HeritageModifier[]
  >([]);
  const [analysis, setAnalysis] = useState<HeritageAnalysis | null>(null);
  const [conflicts, setConflicts] = useState<HeritageConflict[]>([]);
  const [criteria] = useState<HeritageSelectionCriteria>({
    maxModifiers: maxSelections,
    tierLimits: {
      legendary: 1,
      major: 2,
      moderate: 3,
      minor: 5,
    },
  });
  const [activeTab, setActiveTab] = useState<
    'available' | 'selected' | 'analysis'
  >('available');

  const analyzeOptions = useCallback(async () => {
    try {
      const result = await HeritageService.analyzeHeritageOptions(
        availableModifiers,
        targetMission || {},
        criteria
      );
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze heritage options:', error);
    }
  }, [availableModifiers, criteria, targetMission]);

  useEffect(() => {
    if (availableModifiers.length > 0 && targetMission) {
      analyzeOptions();
    }
  }, [availableModifiers, analyzeOptions, targetMission]);

  useEffect(() => {
    const newConflicts = HeritageService.detectConflicts(selectedModifiers);
    setConflicts(newConflicts);
    onSelectionChange(selectedModifiers);
  }, [selectedModifiers, onSelectionChange]);

  const toggleModifier = (modifier: HeritageModifier) => {
    const isSelected = selectedModifiers.some(m => m.id === modifier.id);

    if (isSelected) {
      setSelectedModifiers(prev => prev.filter(m => m.id !== modifier.id));
    } else {
      if (selectedModifiers.length >= maxSelections) {
        return; // Max selections reached
      }

      // Check tier limits
      const currentTierCount = selectedModifiers.filter(
        m => m.tier === modifier.tier
      ).length;
      const tierLimit = criteria.tierLimits?.[modifier.tier];
      if (tierLimit && currentTierCount >= tierLimit) {
        return; // Tier limit reached
      }

      setSelectedModifiers(prev => [...prev, modifier]);
    }
  };

  const isModifierSelectable = (modifier: HeritageModifier): boolean => {
    const isSelected = selectedModifiers.some(m => m.id === modifier.id);
    if (isSelected) return true;

    if (selectedModifiers.length >= maxSelections) return false;

    const currentTierCount = selectedModifiers.filter(
      m => m.tier === modifier.tier
    ).length;
    const tierLimit = criteria.tierLimits?.[modifier.tier];
    if (tierLimit && currentTierCount >= tierLimit) return false;

    return true;
  };

  const getTierColor = (tier: HeritageTier): string => {
    switch (tier) {
      case 'legendary':
        return 'text-yellow-400';
      case 'major':
        return 'text-purple-400';
      case 'moderate':
        return 'text-blue-400';
      case 'minor':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getConflictSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'text-red-400';
      case 'major':
        return 'text-orange-400';
      case 'minor':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const canApply =
    selectedModifiers.length > 0 &&
    conflicts.filter(c => c.severity === 'critical').length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <TerminalWindow title="Heritage Selection" className="h-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <TerminalText className="text-cyan-400 text-lg font-bold">
              Choose Your Heritage
            </TerminalText>
            <TerminalText className="text-gray-400">
              {selectedModifiers.length} / {maxSelections} selected
            </TerminalText>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 border-b border-gray-600">
            {(
              [
                { id: 'available', label: 'Available Modifiers' },
                { id: 'selected', label: 'Selected' },
                { id: 'analysis', label: 'Analysis' },
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-1 transition-colors ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tier Limits Display */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            {Object.entries(criteria.tierLimits || {}).map(([tier, limit]) => {
              const currentCount = selectedModifiers.filter(
                m => m.tier === tier
              ).length;
              return (
                <div key={tier} className="text-center">
                  <TerminalText className={getTierColor(tier as HeritageTier)}>
                    {tier}
                  </TerminalText>
                  <TerminalText className="text-gray-400">
                    {currentCount} / {limit}
                  </TerminalText>
                </div>
              );
            })}
          </div>
        </div>
      </TerminalWindow>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TerminalWindow
          title={
            activeTab === 'available'
              ? 'Available Modifiers'
              : activeTab === 'selected'
                ? 'Selected Modifiers'
                : 'Heritage Analysis'
          }
          className="h-96"
        >
          <div className="space-y-2 overflow-y-auto">
            {activeTab === 'available' && (
              <>
                {availableModifiers.map(modifier => {
                  const isSelected = selectedModifiers.some(
                    m => m.id === modifier.id
                  );
                  const isSelectable = isModifierSelectable(modifier);

                  return (
                    <div
                      key={modifier.id}
                      onClick={() => isSelectable && toggleModifier(modifier)}
                      className={`p-3 rounded border transition-colors ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-900/20'
                          : isSelectable
                            ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 cursor-pointer'
                            : 'border-gray-700 bg-gray-900/50 opacity-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <TerminalText className="font-bold text-cyan-400">
                          {modifier.name}
                        </TerminalText>
                        <TerminalText
                          className={`text-sm ${getTierColor(modifier.tier)}`}
                        >
                          {modifier.tier}
                        </TerminalText>
                      </div>

                      <TerminalText className="text-gray-300 text-sm mb-2">
                        {modifier.description}
                      </TerminalText>

                      <div className="text-xs space-y-1">
                        <TerminalText className="text-blue-400">
                          Source: {modifier.source.sourceType} from mission #
                          {modifier.source.missionNumber}
                        </TerminalText>

                        {modifier.resourceModifiers.length > 0 && (
                          <TerminalText className="text-green-400">
                            Resource Effects:{' '}
                            {modifier.resourceModifiers.length}
                          </TerminalText>
                        )}

                        {modifier.populationModifiers.length > 0 && (
                          <TerminalText className="text-yellow-400">
                            Population Effects:{' '}
                            {modifier.populationModifiers.length}
                          </TerminalText>
                        )}

                        {modifier.usageCount > 0 && (
                          <TerminalText className="text-purple-400">
                            Used {modifier.usageCount} times • Rating:{' '}
                            {modifier.playerRating.toFixed(1)}/5
                          </TerminalText>
                        )}
                      </div>
                    </div>
                  );
                })}

                {availableModifiers.length === 0 && (
                  <TerminalText className="text-gray-500 text-center py-8">
                    No heritage modifiers available. Complete missions to
                    generate modifiers.
                  </TerminalText>
                )}
              </>
            )}

            {activeTab === 'selected' && (
              <>
                {selectedModifiers.map(modifier => (
                  <div
                    key={modifier.id}
                    className="p-3 rounded border border-cyan-400 bg-cyan-900/20"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <TerminalText className="font-bold text-cyan-400">
                        {modifier.name}
                      </TerminalText>
                      <button
                        onClick={() => toggleModifier(modifier)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <TerminalText className="text-gray-300 text-sm mb-2">
                      {modifier.description}
                    </TerminalText>

                    {modifier.startingNarrative.length > 0 && (
                      <TerminalText className="text-blue-400 text-xs italic">
                        "{modifier.startingNarrative[0].text}"
                      </TerminalText>
                    )}
                  </div>
                ))}

                {selectedModifiers.length === 0 && (
                  <TerminalText className="text-gray-500 text-center py-8">
                    No modifiers selected
                  </TerminalText>
                )}
              </>
            )}

            {activeTab === 'analysis' && analysis && (
              <div className="space-y-4">
                {analysis.recommendations.length > 0 && (
                  <div>
                    <TerminalText className="text-yellow-400 font-bold mb-2">
                      Recommendations
                    </TerminalText>
                    {analysis.recommendations.slice(0, 3).map((rec, index) => (
                      <div
                        key={index}
                        className="p-2 border border-gray-600 rounded mb-2"
                      >
                        <TerminalText className="text-cyan-400 font-bold text-sm">
                          {rec.modifier.name}
                        </TerminalText>
                        <TerminalText className="text-gray-400 text-xs">
                          Relevance: {(rec.relevanceScore * 100).toFixed(0)}% •
                          Balance: {(rec.balanceScore * 100).toFixed(0)}% •
                          Narrative: {(rec.narrativeScore * 100).toFixed(0)}%
                        </TerminalText>
                        <TerminalText className="text-green-400 text-xs">
                          {rec.reasoning.join(' • ')}
                        </TerminalText>
                      </div>
                    ))}
                  </div>
                )}

                {analysis.warnings.length > 0 && (
                  <div>
                    <TerminalText className="text-orange-400 font-bold mb-2">
                      Warnings
                    </TerminalText>
                    {analysis.warnings.map((warning, index) => (
                      <TerminalText
                        key={index}
                        className="text-orange-400 text-sm"
                      >
                        • {warning}
                      </TerminalText>
                    ))}
                  </div>
                )}

                {analysis.narrativeSummary && (
                  <div>
                    <TerminalText className="text-purple-400 font-bold mb-2">
                      Narrative Summary
                    </TerminalText>
                    <TerminalText className="text-gray-300 text-sm italic">
                      {analysis.narrativeSummary}
                    </TerminalText>
                  </div>
                )}
              </div>
            )}
          </div>
        </TerminalWindow>

        {/* Conflicts and Actions */}
        <TerminalWindow title="Selection Status" className="h-96">
          <div className="space-y-4">
            {/* Conflicts */}
            {conflicts.length > 0 && (
              <div>
                <TerminalText className="text-red-400 font-bold mb-2">
                  Conflicts Detected
                </TerminalText>
                <div className="space-y-2">
                  {conflicts.map((conflict, index) => (
                    <div
                      key={index}
                      className="p-2 border border-red-600 rounded"
                    >
                      <TerminalText
                        className={`text-sm ${getConflictSeverityColor(conflict.severity)}`}
                      >
                        {conflict.conflictType} ({conflict.severity})
                      </TerminalText>
                      <TerminalText className="text-gray-400 text-xs">
                        {conflict.resolution}
                      </TerminalText>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Effects Preview */}
            {selectedModifiers.length > 0 && (
              <div className="border-t border-gray-600 pt-4">
                <TerminalText className="text-green-400 font-bold mb-2">
                  Combined Effects Preview
                </TerminalText>
                <div className="space-y-1 text-sm">
                  <TerminalText className="text-gray-400">
                    Resource Modifiers:{' '}
                    {selectedModifiers.reduce(
                      (sum, m) => sum + m.resourceModifiers.length,
                      0
                    )}
                  </TerminalText>
                  <TerminalText className="text-gray-400">
                    Population Effects:{' '}
                    {selectedModifiers.reduce(
                      (sum, m) => sum + m.populationModifiers.length,
                      0
                    )}
                  </TerminalText>
                  <TerminalText className="text-gray-400">
                    Event Modifiers:{' '}
                    {selectedModifiers.reduce(
                      (sum, m) => sum + m.eventModifiers.length,
                      0
                    )}
                  </TerminalText>
                </div>
              </div>
            )}

            {/* Apply Button */}
            <div className="border-t border-gray-600 pt-4">
              <button
                onClick={() => onApply(selectedModifiers)}
                disabled={!canApply}
                className={`w-full px-4 py-3 rounded font-bold transition-colors ${
                  canApply
                    ? 'bg-green-900/30 border-2 border-green-400 text-green-400 hover:bg-green-800/30'
                    : 'bg-gray-900/30 border-2 border-gray-600 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canApply
                  ? 'Apply Heritage Modifiers'
                  : 'Resolve Conflicts First'}
              </button>

              {selectedModifiers.length === 0 && (
                <TerminalText className="text-gray-500 text-center text-sm mt-2">
                  Select at least one modifier to continue
                </TerminalText>
              )}
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
};
