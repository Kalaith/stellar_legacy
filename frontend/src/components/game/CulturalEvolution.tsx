import React, { useState } from 'react';
import type { CulturalEvolution } from '../../types/generationalMissions';
import type { LegacyTypeType } from '../../types/enums';
import { TerminalWindow, TerminalText, TerminalButton, TerminalProgress } from '../ui/TerminalWindow';

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
  const [selectedLegacy, setSelectedLegacy] = useState<LegacyTypeType | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'trends' | 'analysis' | 'decisions'>('timeline');

  const legacyInfo = {
    preservers: {
      name: 'The Preservers',
      color: 'text-cyan-400',
      bgColor: 'bg-gray-800',
      baseline: 'Traditional Human Culture'
    },
    adaptors: {
      name: 'The Adaptors',
      color: 'text-green-400',
      bgColor: 'bg-gray-800',
      baseline: 'Enhanced Human Potential'
    },
    wanderers: {
      name: 'The Wanderers',
      color: 'text-amber-400',
      bgColor: 'bg-gray-800',
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {culturalEvolution.map((evolution) => {
          const info = legacyInfo[evolution.legacy];
          const totalChanges = evolution.majorChanges.length;
          const permanentChanges = evolution.majorChanges.filter(c => c.isPermanent).length;

          return (
            <div
              key={evolution.legacy}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedLegacy(evolution.legacy)}
            >
              <TerminalWindow
                title={`${info.name} - GEN ${currentGeneration}`}
                className="h-full"
              >
                <TerminalText className="mb-2 text-xs">
                  ┌ BASELINE: {info.baseline}
                </TerminalText>

                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <TerminalText className="text-xs">CULTURAL DRIFT:</TerminalText>
                    <TerminalText className={`text-xs font-mono ${getDeviationColor(evolution.baselineDeviation)}`}>
                      {evolution.baselineDeviation > 0 ? '+' : ''}{evolution.baselineDeviation}%
                    </TerminalText>
                  </div>
                  <TerminalProgress
                    value={Math.abs(evolution.baselineDeviation)}
                    max={100}
                    variant={
                      Math.abs(evolution.baselineDeviation) > 50 ? 'error' :
                      Math.abs(evolution.baselineDeviation) > 25 ? 'warning' : 'success'
                    }
                  />
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex justify-between">
                    <TerminalText className="text-xs">├ TOTAL CHANGES:</TerminalText>
                    <TerminalText className="text-xs font-mono text-amber-400">{totalChanges}</TerminalText>
                  </div>
                  <div className="flex justify-between">
                    <TerminalText className="text-xs">├ PERMANENT:</TerminalText>
                    <TerminalText className="text-xs font-mono text-green-400">{permanentChanges}</TerminalText>
                  </div>
                  <TerminalText className="text-xs text-gray-400">
                    └ {getDeviationDescription(evolution.baselineDeviation)}
                  </TerminalText>
                </div>

                {evolution.currentTrends.length > 0 && (
                  <div className="border-t border-gray-600 pt-2">
                    <TerminalText className="text-xs text-cyan-400">
                      ▶ ACTIVE: {evolution.currentTrends[0]}
                    </TerminalText>
                  </div>
                )}
              </TerminalWindow>
            </div>
          );
        })}
      </div>

      <TerminalWindow title="⟡ CULTURAL EVOLUTION SUMMARY">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <TerminalText className="text-xl font-mono text-cyan-400">
              {culturalEvolution.reduce((sum, e) => sum + e.majorChanges.length, 0)}
            </TerminalText>
            <TerminalText className="text-xs text-gray-400">TOTAL CHANGES</TerminalText>
          </div>
          <div>
            <TerminalText className="text-xl font-mono text-green-400">
              {culturalEvolution.reduce((sum, e) => sum + e.majorChanges.filter(c => c.isPermanent).length, 0)}
            </TerminalText>
            <TerminalText className="text-xs text-gray-400">PERMANENT ADAPTATIONS</TerminalText>
          </div>
          <div>
            <TerminalText className="text-xl font-mono text-amber-400">
              {culturalEvolution.reduce((sum, e) => sum + e.currentTrends.length, 0)}
            </TerminalText>
            <TerminalText className="text-xs text-gray-400">ACTIVE TRENDS</TerminalText>
          </div>
        </div>
      </TerminalWindow>
    </div>
  );

  const renderLegacyDetail = () => {
    if (!selectedLegacy) return null;

    const evolution = culturalEvolution.find(e => e.legacy === selectedLegacy);
    if (!evolution) return null;

    const info = legacyInfo[selectedLegacy];

    return (
      <TerminalWindow title={`${info.name} - CULTURAL EVOLUTION ANALYSIS`}>
        <div className="flex items-center justify-between mb-4">
          <TerminalText className="text-cyan-400">DETAILED ANALYSIS</TerminalText>
          <TerminalButton
            onClick={() => setSelectedLegacy(null)}
            variant="warning"
            className="text-xs"
          >
            ← BACK
          </TerminalButton>
        </div>

        <div className="flex space-x-2 mb-6">
          {(['timeline', 'trends', 'analysis', 'decisions'] as const).map((tab) => (
            <TerminalButton
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? 'primary' : 'error'}
              className="uppercase text-xs"
            >
              {tab}
            </TerminalButton>
          ))}
        </div>

        <div className="terminal-content">
          {renderTabContent(evolution)}
        </div>
      </TerminalWindow>
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
    <TerminalWindow title="CULTURAL TIMELINE" statusLine="CHRONOLOGICAL ANALYSIS">
      <div className="space-y-3">
        {evolution.majorChanges
          .sort((a, b) => a.generation - b.generation)
          .map((change) => (
            <div key={change.id} className="border-l-2 border-terminal-secondary pl-4 relative">
              <div className="absolute -left-2 top-1 w-3 h-3 bg-terminal-secondary rounded-full" />
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <TerminalText variant="primary" className="font-mono">
                    {change.name.toUpperCase()}
                  </TerminalText>
                  <div className="flex items-center space-x-2">
                    <TerminalText variant="dim" className="text-xs">
                      GEN {change.generation}
                    </TerminalText>
                    <TerminalText className="text-lg">
                      {getImpactIcon(change.impact)}
                    </TerminalText>
                    {change.isPermanent && (
                      <TerminalText variant="success" className="text-xs border border-terminal-success px-1">
                        [PERMANENT]
                      </TerminalText>
                    )}
                  </div>
                </div>
                <TerminalText variant="secondary" className="text-sm mt-1">
                  {change.description}
                </TerminalText>
                <div className="mt-2">
                  <TerminalText variant="dim" className="text-xs">
                    CULTURAL IMPACT: <span className={getDeviationColor(change.impact)}>
                      {change.impact > 0 ? '+' : ''}{change.impact}%
                    </span>
                  </TerminalText>
                </div>
              </div>
            </div>
          ))}
      </div>
    </TerminalWindow>
  );

  const renderTrendsTab = (evolution: CulturalEvolution) => (
    <div className="space-y-4">
      <TerminalWindow title="CURRENT TRENDS" statusLine="ACTIVE MONITORING">
        {evolution.currentTrends.length > 0 ? (
          <div className="space-y-3">
            {evolution.currentTrends.map((trend, index) => (
              <div key={index} className="border-l-4 border-terminal-success pl-3">
                <TerminalText variant="primary" className="font-mono mb-1">
                  ▶ {trend.toUpperCase()}
                </TerminalText>
                <TerminalText variant="secondary" className="text-sm">
                  TREND ACTIVE IN GENERATION {currentGeneration}
                </TerminalText>
              </div>
            ))}
          </div>
        ) : (
          <TerminalText variant="dim">NO MAJOR CULTURAL TRENDS DETECTED</TerminalText>
        )}
      </TerminalWindow>

      <TerminalWindow title="TREND PREDICTIONS" statusLine="PROBABILITY ANALYSIS">
        <div className="space-y-3">
          <div className="border border-terminal-border p-3">
            <TerminalText variant="primary" className="font-mono mb-1">
              TECHNOLOGICAL INTEGRATION
            </TerminalText>
            <TerminalText variant="secondary" className="text-sm">
              LIKELIHOOD: <TerminalText variant="warning" className="inline">75%</TerminalText> -
              EXPECTED IMPACT ON HUMAN-MACHINE INTERACTION NORMS
            </TerminalText>
          </div>
          <div className="border border-terminal-border p-3">
            <TerminalText variant="primary" className="font-mono mb-1">
              GENERATIONAL VALUES SHIFT
            </TerminalText>
            <TerminalText variant="secondary" className="text-sm">
              LIKELIHOOD: <TerminalText variant="primary" className="inline">60%</TerminalText> -
              NEW GENERATION MAY DEVELOP DIFFERENT PRIORITIES
            </TerminalText>
          </div>
          <div className="border border-terminal-border p-3">
            <TerminalText variant="primary" className="font-mono mb-1">
              RESOURCE SCARCITY ADAPTATION
            </TerminalText>
            <TerminalText variant="secondary" className="text-sm">
              LIKELIHOOD: <TerminalText variant="error" className="inline">45%</TerminalText> -
              CULTURAL PRACTICES MAY EVOLVE BASED ON RESOURCES
            </TerminalText>
          </div>
        </div>
      </TerminalWindow>
    </div>
  );

  const renderAnalysisTab = (evolution: CulturalEvolution) => {
    const totalImpact = evolution.majorChanges.reduce((sum, change) => sum + Math.abs(change.impact), 0);
    const averageImpact = evolution.majorChanges.length > 0 ? totalImpact / evolution.majorChanges.length : 0;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TerminalWindow title="CULTURAL METRICS" statusLine="STATISTICAL ANALYSIS">
            <div className="space-y-2">
              <div className="flex justify-between">
                <TerminalText variant="dim">BASELINE DEVIATION:</TerminalText>
                <TerminalText className={getDeviationColor(evolution.baselineDeviation)}>
                  {evolution.baselineDeviation > 0 ? '+' : ''}{evolution.baselineDeviation}%
                </TerminalText>
              </div>
              <div className="flex justify-between">
                <TerminalText variant="dim">TOTAL CHANGES:</TerminalText>
                <TerminalText variant="primary">{evolution.majorChanges.length}</TerminalText>
              </div>
              <div className="flex justify-between">
                <TerminalText variant="dim">AVERAGE IMPACT:</TerminalText>
                <TerminalText variant="primary">{averageImpact.toFixed(1)}%</TerminalText>
              </div>
              <div className="flex justify-between">
                <TerminalText variant="dim">PERMANENT SHIFTS:</TerminalText>
                <TerminalText variant="success">
                  {evolution.majorChanges.filter(c => c.isPermanent).length}
                </TerminalText>
              </div>
            </div>
          </TerminalWindow>

          <TerminalWindow title="CULTURAL HEALTH" statusLine="STABILITY MONITOR">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <TerminalText variant="dim">STABILITY:</TerminalText>
                  <TerminalText variant={Math.abs(evolution.baselineDeviation) < 25 ? 'success' :
                    Math.abs(evolution.baselineDeviation) < 50 ? 'warning' : 'error'}>
                    {Math.abs(evolution.baselineDeviation) < 25 ? 'STABLE' :
                     Math.abs(evolution.baselineDeviation) < 50 ? 'SHIFTING' : 'UNSTABLE'}
                  </TerminalText>
                </div>
                <TerminalProgress
                  value={Math.min(100, 100 - Math.abs(evolution.baselineDeviation))}
                  max={100}
                  variant={Math.abs(evolution.baselineDeviation) < 25 ? 'success' :
                    Math.abs(evolution.baselineDeviation) < 50 ? 'warning' : 'error'}
                  ascii={true}
                />
              </div>
              <TerminalText variant="secondary" className="text-sm">
                {Math.abs(evolution.baselineDeviation) < 25
                  ? 'CULTURE REMAINS CLOSE TO FOUNDING PRINCIPLES'
                  : Math.abs(evolution.baselineDeviation) < 50
                  ? 'MODERATE DRIFT FROM ORIGINAL CULTURE'
                  : 'SIGNIFICANT CULTURAL TRANSFORMATION OCCURRING'}
              </TerminalText>
            </div>
          </TerminalWindow>
        </div>

        <TerminalWindow title="RISK ASSESSMENT" statusLine="THREAT ANALYSIS">
          <div className="space-y-3">
            {Math.abs(evolution.baselineDeviation) > 75 && (
              <div className="border border-terminal-error p-3 bg-terminal-error bg-opacity-10">
                <TerminalText variant="error" className="font-mono mb-1">
                  [CRITICAL] CULTURAL DRIFT
                </TerminalText>
                <TerminalText variant="secondary" className="text-sm">
                  CULTURE HAS DEVIATED SIGNIFICANTLY FROM BASELINE. RISK OF IDENTITY CRISIS.
                </TerminalText>
              </div>
            )}
            {evolution.majorChanges.filter(c => !c.isPermanent).length > 3 && (
              <div className="border border-terminal-warning p-3 bg-terminal-warning bg-opacity-10">
                <TerminalText variant="warning" className="font-mono mb-1">
                  [WARNING] CULTURAL INSTABILITY
                </TerminalText>
                <TerminalText variant="secondary" className="text-sm">
                  MULTIPLE TEMPORARY CHANGES SUGGEST UNCERTAINTY. CONSIDER STABILIZING MEASURES.
                </TerminalText>
              </div>
            )}
            {evolution.currentTrends.length === 0 && (
              <div className="border border-terminal-primary p-3 bg-terminal-primary bg-opacity-10">
                <TerminalText variant="primary" className="font-mono mb-1">
                  [INFO] CULTURAL STAGNATION
                </TerminalText>
                <TerminalText variant="secondary" className="text-sm">
                  NO ACTIVE CULTURAL TRENDS. SOCIETY MAY BENEFIT FROM CULTURAL INITIATIVES.
                </TerminalText>
              </div>
            )}
          </div>
        </TerminalWindow>
      </div>
    );
  };

  const renderDecisionsTab = (evolution: CulturalEvolution) => {
    if (!onCulturalAction) {
      return (
        <TerminalWindow title="CULTURAL DECISIONS" statusLine="SYSTEM UNAVAILABLE">
          <TerminalText variant="dim" className="text-center py-4">
            CULTURAL DECISION SYSTEM NOT AVAILABLE
          </TerminalText>
        </TerminalWindow>
      );
    }

    return (
      <div className="space-y-4">
        <TerminalWindow title="CULTURAL GUIDANCE" statusLine="POLICY MANAGEMENT">
          <TerminalText variant="secondary" className="mb-4">
            SHAPE THE CULTURAL EVOLUTION OF YOUR CIVILIZATION THROUGH DELIBERATE ACTIONS
          </TerminalText>
          <div className="grid grid-cols-2 gap-3">
            <TerminalButton
              onClick={() => onCulturalAction('preserve_traditions', { legacy: evolution.legacy })}
              variant="primary"
            >
              PRESERVE TRADITIONS
            </TerminalButton>
            <TerminalButton
              onClick={() => onCulturalAction('encourage_innovation', { legacy: evolution.legacy })}
              variant="success"
            >
              ENCOURAGE INNOVATION
            </TerminalButton>
            <TerminalButton
              onClick={() => onCulturalAction('cultural_festival', { legacy: evolution.legacy })}
              variant="primary"
            >
              CULTURAL FESTIVAL
            </TerminalButton>
            <TerminalButton
              onClick={() => onCulturalAction('generational_dialogue', { legacy: evolution.legacy })}
              variant="warning"
            >
              GENERATIONAL DIALOGUE
            </TerminalButton>
          </div>
        </TerminalWindow>

        <TerminalWindow title="STABILIZATION ACTIONS" statusLine="CULTURAL CONTROL">
          <div className="space-y-3">
            <div 
              className="border border-terminal-border p-3 cursor-pointer hover:border-terminal-primary transition-colors"
              onClick={() => onCulturalAction('cultural_census', { legacy: evolution.legacy })}
            >
              <TerminalText variant="primary" className="font-mono mb-1">
                ▶ CULTURAL CENSUS
              </TerminalText>
              <TerminalText variant="dim" className="text-xs">
                ASSESS CURRENT CULTURAL STATE AND TRENDS
              </TerminalText>
            </div>
            <div 
              className="border border-terminal-border p-3 cursor-pointer hover:border-terminal-primary transition-colors"
              onClick={() => onCulturalAction('cultural_education', { legacy: evolution.legacy })}
            >
              <TerminalText variant="primary" className="font-mono mb-1">
                ▶ CULTURAL EDUCATION PROGRAM
              </TerminalText>
              <TerminalText variant="dim" className="text-xs">
                REINFORCE CORE VALUES AND BELIEFS
              </TerminalText>
            </div>
            <div 
              className="border border-terminal-border p-3 cursor-pointer hover:border-terminal-primary transition-colors"
              onClick={() => onCulturalAction('cultural_reform', { legacy: evolution.legacy })}
            >
              <TerminalText variant="primary" className="font-mono mb-1">
                ▶ CULTURAL REFORM INITIATIVE
              </TerminalText>
              <TerminalText variant="dim" className="text-xs">
                ACTIVELY GUIDE CULTURAL DEVELOPMENT
              </TerminalText>
            </div>
          </div>
        </TerminalWindow>

        {Math.abs(evolution.baselineDeviation) > 50 && (
          <TerminalWindow title="EMERGENCY MEASURES" statusLine="CRITICAL ALERT" className="border-terminal-error">
            <TerminalText variant="error" className="mb-3 text-sm">
              HIGH CULTURAL DEVIATION DETECTED. CONSIDER EMERGENCY STABILIZATION MEASURES.
            </TerminalText>
            <div className="space-y-3">
              <div 
                className="border border-terminal-error p-3 cursor-pointer hover:bg-terminal-error hover:bg-opacity-10 transition-colors"
                onClick={() => onCulturalAction('cultural_restoration', { legacy: evolution.legacy })}
              >
                <TerminalText variant="error" className="font-mono mb-1">
                  ⚠ CULTURAL RESTORATION
                </TerminalText>
                <TerminalText variant="dim" className="text-xs">
                  ATTEMPT TO RETURN TO BASELINE CULTURE
                </TerminalText>
              </div>
              <div 
                className="border border-terminal-warning p-3 cursor-pointer hover:bg-terminal-warning hover:bg-opacity-10 transition-colors"
                onClick={() => onCulturalAction('accept_evolution', { legacy: evolution.legacy })}
              >
                <TerminalText variant="warning" className="font-mono mb-1">
                  ⚡ ACCEPT EVOLUTION
                </TerminalText>
                <TerminalText variant="dim" className="text-xs">
                  EMBRACE THE CULTURAL CHANGE AS NEW BASELINE
                </TerminalText>
              </div>
            </div>
          </TerminalWindow>
        )}
      </div>
    );
  };

  return (
    <TerminalWindow title="⟡ CULTURAL EVOLUTION">
      <TerminalText className="mb-4">
        Track how your civilization's culture evolves and adapts across generations of space travel.
      </TerminalText>

      {selectedLegacy ? renderLegacyDetail() : renderOverview()}
    </TerminalWindow>
  );
};

export default CulturalEvolutionComponent;