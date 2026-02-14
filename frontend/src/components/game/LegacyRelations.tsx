import React, { useState } from 'react';
import type { LegacyRelation } from '../../types/generationalMissions';
import type { LegacyTypeType } from '../../types/enums';
import {
  TerminalWindow,
  TerminalText,
  TerminalButton,
  TerminalTable,
  TerminalProgress,
} from '../ui/TerminalWindow';

interface LegacyRelationsProps {
  legacyRelations: LegacyRelation[];
  playerLegacy: LegacyTypeType;
  playerLegacyAffinity: Record<LegacyTypeType, number>;
  onLegacyAction?: (targetLegacy: LegacyTypeType, action: string) => void;
}

export const LegacyRelations: React.FC<LegacyRelationsProps> = ({
  legacyRelations,
  playerLegacy,
  playerLegacyAffinity,
  onLegacyAction,
}) => {
  const [selectedLegacy, setSelectedLegacy] = useState<LegacyTypeType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'diplomacy' | 'trade' | 'threats'>(
    'overview'
  );

  const legacyInfo = {
    preservers: {
      name: 'The Preservers',
      description: 'Guardians of human tradition and cultural purity',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900',
      philosophy: 'Maintain baseline humanity at all costs',
      strengths: ['Cultural Unity', 'Traditional Knowledge', 'Social Stability'],
      weaknesses: ['Technological Stagnation', 'Adaptation Resistance'],
    },
    adaptors: {
      name: 'The Adaptors',
      description: 'Champions of human evolution and enhancement',
      color: 'text-green-400',
      bgColor: 'bg-green-900',
      philosophy: 'Evolve or perish in the void of space',
      strengths: ['Genetic Enhancement', 'Rapid Adaptation', 'Innovation'],
      weaknesses: ['Cultural Drift', 'Humanity Loss Risk'],
    },
    wanderers: {
      name: 'The Wanderers',
      description: 'Nomads of the void, masters of survival',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900',
      philosophy: 'Freedom through eternal journey',
      strengths: ['Resource Conservation', 'Survival Skills', 'Independence'],
      weaknesses: ['Fleet Cohesion Issues', 'Existential Dread'],
    },
  };

  const getRelationshipStatus = (relationship: number) => {
    if (relationship > 75) return { text: 'Allied', color: 'text-green-400' };
    if (relationship > 50) return { text: 'Friendly', color: 'text-blue-400' };
    if (relationship > 25) return { text: 'Neutral', color: 'text-yellow-400' };
    if (relationship > 0) return { text: 'Tense', color: 'text-orange-400' };
    if (relationship > -25) return { text: 'Hostile', color: 'text-red-400' };
    return { text: 'Enemy', color: 'text-red-600' };
  };

  const renderLegacyOverview = () => (
    <div className="terminal-space-y">
      <TerminalWindow title="LEGACY FACTIONS" statusLine="MONITORING">
        <div className="terminal-grid cols-3">
          {(Object.keys(legacyInfo) as LegacyTypeType[]).map(legacy => {
            const info = legacyInfo[legacy];
            const relation = legacyRelations.find(
              r =>
                (r.fromLegacy === playerLegacy && r.toLegacy === legacy) ||
                (r.fromLegacy === legacy && r.toLegacy === playerLegacy)
            );
            const relationshipValue = relation?.relationship || 0;
            const status = getRelationshipStatus(relationshipValue);
            const affinity = playerLegacyAffinity[legacy] || 0;

            return (
              <div
                key={legacy}
                className="cursor-pointer"
                onClick={() => setSelectedLegacy(legacy)}
              >
                <TerminalWindow
                  title={info.name.toUpperCase()}
                  statusLine={legacy === playerLegacy ? 'YOUR LEGACY' : status.text.toUpperCase()}
                  className={`hover:border-terminal-primary transition-colors ${
                    legacy === playerLegacy ? 'border-terminal-warning' : ''
                  }`}
                  isActive={legacy === playerLegacy}
                >
                  <div className="terminal-space-y-sm">
                    <TerminalText variant="secondary" className="text-sm">
                      {info.description.toUpperCase()}
                    </TerminalText>

                    {legacy !== playerLegacy && (
                      <div className="border-t border-terminal-border pt-2">
                        <div className="terminal-flex between">
                          <TerminalText variant="dim">RELATIONSHIP:</TerminalText>
                          <TerminalText
                            variant={
                              relationshipValue > 50
                                ? 'success'
                                : relationshipValue > 0
                                  ? 'warning'
                                  : 'error'
                            }
                          >
                            {status.text.toUpperCase()}
                          </TerminalText>
                        </div>

                        <div className="terminal-flex between">
                          <TerminalText variant="dim">YOUR AFFINITY:</TerminalText>
                          <TerminalText
                            variant={
                              affinity > 50 ? 'success' : affinity > 25 ? 'warning' : 'error'
                            }
                          >
                            {affinity}%
                          </TerminalText>
                        </div>

                        <TerminalProgress
                          value={Math.max(0, relationshipValue + 100)}
                          max={200}
                          ascii={true}
                          variant={relationshipValue > 0 ? 'success' : 'error'}
                        />
                      </div>
                    )}

                    {legacy === playerLegacy && (
                      <div className="border-t border-terminal-border pt-2">
                        <TerminalText variant="warning" className="text-sm">
                          PHILOSOPHY: {info.philosophy.toUpperCase()}
                        </TerminalText>
                      </div>
                    )}
                  </div>
                </TerminalWindow>
              </div>
            );
          })}
        </div>
      </TerminalWindow>

      <TerminalWindow title="RELATIONS MATRIX" statusLine="DIPLOMATIC STATUS">
        <TerminalTable
          headers={[
            'FROM/TO',
            ...Object.keys(legacyInfo).map(l =>
              legacyInfo[l as LegacyTypeType].name.split(' ')[1].toUpperCase()
            ),
          ]}
          rows={(Object.keys(legacyInfo) as LegacyTypeType[]).map(fromLegacy => [
            legacyInfo[fromLegacy].name.split(' ')[1].toUpperCase(),
            ...(Object.keys(legacyInfo) as LegacyTypeType[]).map(toLegacy => {
              if (fromLegacy === toLegacy) {
                return <TerminalText variant="dim">—</TerminalText>;
              }
              const relation = legacyRelations.find(
                r => r.fromLegacy === fromLegacy && r.toLegacy === toLegacy
              );
              const value = relation?.relationship || 0;
              return (
                <TerminalText variant={value > 0 ? 'success' : value < 0 ? 'error' : 'warning'}>
                  {value}
                </TerminalText>
              );
            }),
          ])}
        />
      </TerminalWindow>
    </div>
  );

  const renderLegacyDetail = () => {
    if (!selectedLegacy) return null;

    const info = legacyInfo[selectedLegacy];
    const relation = legacyRelations.find(
      r =>
        (r.fromLegacy === playerLegacy && r.toLegacy === selectedLegacy) ||
        (r.fromLegacy === selectedLegacy && r.toLegacy === playerLegacy)
    );

    return (
      <TerminalWindow
        title={`◎ ${info.name.toUpperCase()} - DIPLOMATIC INTERFACE`}
        statusLine="DETAILED ANALYSIS"
      >
        <div className="terminal-flex between mb-4">
          <div>
            <TerminalText variant="primary" className="text-lg mb-2">
              {info.name.toUpperCase()}
            </TerminalText>
            <TerminalText variant="secondary" className="text-sm">
              {info.description.toUpperCase()}
            </TerminalText>
          </div>
          <div className="cursor-pointer hover:opacity-80" onClick={() => setSelectedLegacy(null)}>
            <TerminalText variant="warning">[X] CLOSE</TerminalText>
          </div>
        </div>

        <div className="terminal-flex start gap-2 mb-6">
          {(['overview', 'diplomacy', 'trade', 'threats'] as const).map(tab => (
            <div
              key={tab}
              className={`cursor-pointer px-2 py-1 border transition-colors ${
                activeTab === tab
                  ? 'border-terminal-primary bg-terminal-primary bg-opacity-20'
                  : 'border-terminal-border hover:border-terminal-secondary'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <TerminalText variant={activeTab === tab ? 'primary' : 'dim'} className="uppercase">
                [{tab}]
              </TerminalText>
            </div>
          ))}
        </div>

        <div className="terminal-content">{renderLegacyTabContent(selectedLegacy, relation)}</div>
      </TerminalWindow>
    );
  };

  const renderLegacyTabContent = (legacy: LegacyTypeType, relation?: LegacyRelation) => {
    const info = legacyInfo[legacy];

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TerminalWindow title="PHILOSOPHY" statusLine="IDEOLOGY">
                <TerminalText className="text-cyan-400 italic">{info.philosophy}</TerminalText>
              </TerminalWindow>

              <TerminalWindow title="STRENGTHS" statusLine="ASSETS">
                <div className="space-y-1">
                  {info.strengths.map((strength, index) => (
                    <TerminalText key={index} className="text-xs">
                      ▶ {strength}
                    </TerminalText>
                  ))}
                </div>
              </TerminalWindow>

              <TerminalWindow title="WEAKNESSES" statusLine="LIABILITIES">
                <div className="space-y-1">
                  {info.weaknesses.map((weakness, index) => (
                    <TerminalText key={index} className="text-xs">
                      ▶ {weakness}
                    </TerminalText>
                  ))}
                </div>
              </TerminalWindow>

              {relation && (
                <TerminalWindow title="CURRENT RELATIONS" statusLine="DIPLOMATIC">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <TerminalText className="text-xs">STATUS:</TerminalText>
                      <TerminalText
                        className={`text-xs ${getRelationshipStatus(relation.relationship).color}`}
                      >
                        {getRelationshipStatus(relation.relationship).text}
                      </TerminalText>
                    </div>
                    <div className="flex justify-between">
                      <TerminalText className="text-xs">VALUE:</TerminalText>
                      <TerminalText className="text-xs font-mono text-amber-400">
                        {relation.relationship}
                      </TerminalText>
                    </div>
                  </div>
                  <TerminalProgress
                    value={Math.max(0, relation.relationship)}
                    max={100}
                    variant={
                      relation.relationship > 50
                        ? 'success'
                        : relation.relationship > 0
                          ? 'warning'
                          : 'error'
                    }
                    className="mt-2"
                  />
                </TerminalWindow>
              )}
            </div>

            {relation?.recentEvents && relation.recentEvents.length > 0 && (
              <TerminalWindow title="RECENT EVENTS" statusLine="HISTORY">
                <div className="space-y-2">
                  {relation.recentEvents.slice(0, 3).map((event, index) => (
                    <TerminalText key={index} className="text-xs border-l-2 border-purple-500 pl-3">
                      ▶ {event}
                    </TerminalText>
                  ))}
                </div>
              </TerminalWindow>
            )}
          </div>
        );

      case 'diplomacy':
        return renderDiplomacyTab(legacy, relation);

      case 'trade':
        return renderTradeTab(legacy, relation);

      case 'threats':
        return renderThreatsTab(legacy);

      default:
        return null;
    }
  };

  const renderDiplomacyTab = (legacy: LegacyTypeType, relation?: LegacyRelation) => {
    if (legacy === playerLegacy) {
      return (
        <TerminalWindow title="INTERNAL AFFAIRS" statusLine="RESTRICTED">
          <TerminalText className="text-center text-amber-400">
            ▲ THIS IS YOUR OWN LEGACY
          </TerminalText>
          <TerminalText className="text-center text-xs text-gray-400 mt-2">
            Manage internal affairs through other systems
          </TerminalText>
        </TerminalWindow>
      );
    }

    return (
      <div className="space-y-4">
        <TerminalWindow title="DIPLOMATIC STATUS" statusLine="RELATIONS">
          {relation && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <TerminalText className="text-xs">CURRENT RELATIONSHIP:</TerminalText>
                <TerminalText
                  className={`text-xs ${getRelationshipStatus(relation.relationship).color}`}
                >
                  {getRelationshipStatus(relation.relationship).text} ({relation.relationship})
                </TerminalText>
              </div>
              <TerminalProgress
                value={Math.max(0, relation.relationship + 100)}
                max={200}
                variant={
                  relation.relationship > 50
                    ? 'success'
                    : relation.relationship > 0
                      ? 'warning'
                      : 'error'
                }
              />
            </div>
          )}
        </TerminalWindow>

        {onLegacyAction && (
          <TerminalWindow title="DIPLOMATIC ACTIONS" statusLine="AVAILABLE">
            <div className="grid grid-cols-2 gap-2">
              <TerminalButton
                onClick={() => onLegacyAction(legacy, 'improve_relations')}
                variant="success"
                className="text-xs"
              >
                IMPROVE RELATIONS
              </TerminalButton>
              <TerminalButton
                onClick={() => onLegacyAction(legacy, 'formal_alliance')}
                variant="primary"
                className="text-xs"
              >
                PROPOSE ALLIANCE
              </TerminalButton>
              <TerminalButton
                onClick={() => onLegacyAction(legacy, 'cultural_exchange')}
                variant="success"
                className="text-xs"
              >
                CULTURAL EXCHANGE
              </TerminalButton>
              <TerminalButton
                onClick={() => onLegacyAction(legacy, 'issue_warning')}
                variant="warning"
                className="text-xs"
              >
                ISSUE WARNING
              </TerminalButton>
            </div>
          </TerminalWindow>
        )}

        <TerminalWindow title="DIPLOMATIC HISTORY" statusLine="ARCHIVE">
          {relation?.recentEvents && relation.recentEvents.length > 0 ? (
            <div className="space-y-1">
              {relation.recentEvents.map((event, index) => (
                <TerminalText key={index} className="text-xs border-l-2 border-yellow-500 pl-3">
                  ▶ {event}
                </TerminalText>
              ))}
            </div>
          ) : (
            <TerminalText className="text-xs text-gray-400">
              No significant diplomatic events recorded
            </TerminalText>
          )}
        </TerminalWindow>
      </div>
    );
  };

  const renderTradeTab = (legacy: LegacyTypeType, relation?: LegacyRelation) => (
    <div className="space-y-4">
      <TerminalWindow title="ACTIVE TRADE AGREEMENTS" statusLine="COMMERCE">
        {relation?.tradeAgreements && relation.tradeAgreements.length > 0 ? (
          <div className="space-y-2">
            {relation.tradeAgreements.map(agreement => (
              <TerminalWindow
                key={agreement.id}
                title={agreement.resource.toUpperCase()}
                className="bg-gray-800"
              >
                <div className="flex justify-between items-center mb-1">
                  <TerminalText className="text-xs">AMOUNT:</TerminalText>
                  <TerminalText className="text-xs font-mono text-green-400">
                    {agreement.amount} UNITS
                  </TerminalText>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <TerminalText className="text-xs">PRICE:</TerminalText>
                  <TerminalText className="text-xs font-mono text-amber-400">
                    {agreement.price} CR/UNIT
                  </TerminalText>
                </div>
                <div className="flex justify-between items-center">
                  <TerminalText className="text-xs">DURATION:</TerminalText>
                  <TerminalText className="text-xs font-mono text-cyan-400">
                    {agreement.duration} DAYS
                  </TerminalText>
                </div>
              </TerminalWindow>
            ))}
          </div>
        ) : (
          <TerminalText className="text-xs text-gray-400">No active trade agreements</TerminalText>
        )}
      </TerminalWindow>

      {onLegacyAction && (
        <TerminalWindow title="TRADE ACTIONS" statusLine="AVAILABLE">
          <div className="grid grid-cols-2 gap-2">
            <TerminalButton
              onClick={() => onLegacyAction && onLegacyAction(legacy, 'propose_trade')}
              variant="success"
              className="text-xs"
            >
              PROPOSE TRADE DEAL
            </TerminalButton>
            <TerminalButton
              onClick={() => onLegacyAction && onLegacyAction(legacy, 'resource_exchange')}
              variant="primary"
              className="text-xs"
            >
              RESOURCE EXCHANGE
            </TerminalButton>
            <TerminalButton
              onClick={() => onLegacyAction && onLegacyAction(legacy, 'technology_share')}
              variant="primary"
              className="text-xs"
            >
              TECHNOLOGY SHARE
            </TerminalButton>
            <TerminalButton
              onClick={() => onLegacyAction && onLegacyAction(legacy, 'trade_embargo')}
              variant="error"
              className="text-xs"
            >
              TRADE EMBARGO
            </TerminalButton>
          </div>
        </TerminalWindow>
      )}
    </div>
  );

  const renderThreatsTab = (legacy: LegacyTypeType) => {
    const getLegacyThreats = (legacyType: LegacyTypeType) => {
      switch (legacyType) {
        case 'preservers':
          return [
            {
              name: 'Cultural Collapse',
              level: 'Medium',
              description: 'Loss of traditional values',
            },
            {
              name: 'Innovation Stagnation',
              level: 'High',
              description: 'Falling behind technologically',
            },
            {
              name: 'Generational Conflict',
              level: 'Low',
              description: 'Youth rejecting traditions',
            },
          ];
        case 'adaptors':
          return [
            {
              name: 'Humanity Loss',
              level: 'High',
              description: 'Modifications may go too far',
            },
            {
              name: 'Genetic Instability',
              level: 'Medium',
              description: 'Enhancement side effects',
            },
            {
              name: 'Social Fragmentation',
              level: 'Medium',
              description: 'Enhanced vs unenhanced divide',
            },
          ];
        case 'wanderers':
          return [
            {
              name: 'Fleet Dissolution',
              level: 'High',
              description: 'Ships may scatter permanently',
            },
            {
              name: 'Resource Depletion',
              level: 'Medium',
              description: 'Running out of supplies',
            },
            {
              name: 'Existential Despair',
              level: 'Low',
              description: 'Loss of purpose in endless journey',
            },
          ];
        default:
          return [];
      }
    };

    const threats = getLegacyThreats(legacy);
    const getThreatColor = (level: string) => {
      switch (level) {
        case 'High':
          return 'text-red-400';
        case 'Medium':
          return 'text-yellow-400';
        case 'Low':
          return 'text-green-400';
        default:
          return 'text-gray-400';
      }
    };

    return (
      <div className="space-y-4">
        <TerminalWindow title="EXISTENTIAL THREATS" statusLine="CRITICAL">
          <div className="space-y-3">
            {threats.map((threat, index) => (
              <TerminalWindow key={index} title={threat.name.toUpperCase()} className="bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <TerminalText className="text-xs">RISK LEVEL:</TerminalText>
                  <TerminalText className={`text-xs font-mono ${getThreatColor(threat.level)}`}>
                    {threat.level.toUpperCase()}
                  </TerminalText>
                </div>
                <TerminalText className="text-xs text-gray-300">{threat.description}</TerminalText>
              </TerminalWindow>
            ))}
          </div>
        </TerminalWindow>

        <TerminalWindow title="MITIGATION STRATEGIES" statusLine="PROTOCOLS">
          <div className="space-y-1">
            {legacy === 'preservers' && (
              <>
                <TerminalText className="text-xs">
                  ▶ Gradual adaptation to maintain cultural continuity
                </TerminalText>
                <TerminalText className="text-xs">
                  ▶ Inter-generational dialogue programs
                </TerminalText>
                <TerminalText className="text-xs">▶ Selective technology adoption</TerminalText>
              </>
            )}
            {legacy === 'adaptors' && (
              <>
                <TerminalText className="text-xs">
                  ▶ Careful monitoring of enhancement procedures
                </TerminalText>
                <TerminalText className="text-xs">
                  ▶ Ethical guidelines for modifications
                </TerminalText>
                <TerminalText className="text-xs">
                  ▶ Baseline human preservation protocols
                </TerminalText>
              </>
            )}
            {legacy === 'wanderers' && (
              <>
                <TerminalText className="text-xs">
                  ▶ Fleet cohesion maintenance systems
                </TerminalText>
                <TerminalText className="text-xs">▶ Resource sharing agreements</TerminalText>
                <TerminalText className="text-xs">▶ Collective purpose reinforcement</TerminalText>
              </>
            )}
          </div>
        </TerminalWindow>
      </div>
    );
  };

  return (
    <div className="terminal-window active fullscreen">
      <div className="terminal-header">
        <div className="terminal-title-bar">
          ┌─[◎ LEGACY RELATIONS - DIPLOMATIC INTERFACE]─────────────┐
        </div>
        <div className="terminal-status">
          │ STATUS: MONITORING IDEOLOGICAL FACTION RELATIONSHIPS │
        </div>
        <div className="terminal-separator">
          ├──────────────────────────────────────────────────────────┤
        </div>
      </div>

      <div className="terminal-content">
        {selectedLegacy ? renderLegacyDetail() : renderLegacyOverview()}
      </div>

      <div className="terminal-footer">
        └──────────────────────────────────────────────────────────┘
      </div>
    </div>
  );
};

export default LegacyRelations;
