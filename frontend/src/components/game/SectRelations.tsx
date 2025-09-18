import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SectRelation, TradeAgreement } from '../../types/generationalMissions';
import type { SectTypeType } from '../../types/enums';
import { SectService } from '../../services/SectService';

interface SectRelationsProps {
  sectRelations: SectRelation[];
  playerSect: SectTypeType;
  playerSectAffinity: Record<SectTypeType, number>;
  onSectAction?: (targetSect: SectTypeType, action: string) => void;
}

export const SectRelations: React.FC<SectRelationsProps> = ({
  sectRelations,
  playerSect,
  playerSectAffinity,
  onSectAction
}) => {
  const [selectedSect, setSelectedSect] = useState<SectTypeType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'diplomacy' | 'trade' | 'threats'>('overview');

  const sectInfo = {
    preservers: {
      name: 'The Preservers',
      description: 'Guardians of human tradition and cultural purity',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900',
      philosophy: 'Maintain baseline humanity at all costs',
      strengths: ['Cultural Unity', 'Traditional Knowledge', 'Social Stability'],
      weaknesses: ['Technological Stagnation', 'Adaptation Resistance']
    },
    adaptors: {
      name: 'The Adaptors',
      description: 'Champions of human evolution and enhancement',
      color: 'text-green-400',
      bgColor: 'bg-green-900',
      philosophy: 'Evolve or perish in the void of space',
      strengths: ['Genetic Enhancement', 'Rapid Adaptation', 'Innovation'],
      weaknesses: ['Cultural Drift', 'Humanity Loss Risk']
    },
    wanderers: {
      name: 'The Wanderers',
      description: 'Nomads of the void, masters of survival',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900',
      philosophy: 'Freedom through eternal journey',
      strengths: ['Resource Conservation', 'Survival Skills', 'Independence'],
      weaknesses: ['Fleet Cohesion Issues', 'Existential Dread']
    }
  };

  const getRelationshipStatus = (relationship: number) => {
    if (relationship > 75) return { text: 'Allied', color: 'text-green-400' };
    if (relationship > 50) return { text: 'Friendly', color: 'text-blue-400' };
    if (relationship > 25) return { text: 'Neutral', color: 'text-yellow-400' };
    if (relationship > 0) return { text: 'Tense', color: 'text-orange-400' };
    if (relationship > -25) return { text: 'Hostile', color: 'text-red-400' };
    return { text: 'Enemy', color: 'text-red-600' };
  };

  const getAffinityColor = (affinity: number) => {
    if (affinity > 75) return 'text-green-400';
    if (affinity > 50) return 'text-blue-400';
    if (affinity > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderSectOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(sectInfo) as SectTypeType[]).map((sect) => {
          const info = sectInfo[sect];
          const relation = sectRelations.find(r =>
            (r.fromSect === playerSect && r.toSect === sect) ||
            (r.fromSect === sect && r.toSect === playerSect)
          );
          const relationshipValue = relation?.relationship || 0;
          const status = getRelationshipStatus(relationshipValue);
          const affinity = playerSectAffinity[sect] || 0;

          return (
            <motion.div
              key={sect}
              className={`${info.bgColor} bg-opacity-20 border border-gray-600 rounded-lg p-4 cursor-pointer hover:border-opacity-60 transition-colors`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedSect(sect)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={`text-lg font-bold ${info.color}`}>{info.name}</h3>
                {sect === playerSect && (
                  <span className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded text-xs">
                    Your Sect
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-sm mb-3">{info.description}</p>

              {sect !== playerSect && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Relationship:</span>
                    <span className={`font-medium ${status.color}`}>{status.text}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Your Affinity:</span>
                    <span className={`font-medium ${getAffinityColor(affinity)}`}>
                      {affinity}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        relationshipValue > 50 ? 'bg-green-500' :
                        relationshipValue > 0 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(5, (relationshipValue + 100) / 2)}%` }}
                    />
                  </div>
                </div>
              )}

              {sect === playerSect && (
                <div className="text-sm text-gray-400">
                  Your civilization follows the {info.philosophy.toLowerCase()}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">◎ Sect Relations Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-2 text-gray-400">From / To</th>
                {(Object.keys(sectInfo) as SectTypeType[]).map(sect => (
                  <th key={sect} className={`text-center py-2 ${sectInfo[sect].color}`}>
                    {sectInfo[sect].name.split(' ')[1]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(sectInfo) as SectTypeType[]).map(fromSect => (
                <tr key={fromSect} className="border-b border-gray-700">
                  <td className={`py-2 font-medium ${sectInfo[fromSect].color}`}>
                    {sectInfo[fromSect].name.split(' ')[1]}
                  </td>
                  {(Object.keys(sectInfo) as SectTypeType[]).map(toSect => {
                    if (fromSect === toSect) {
                      return <td key={toSect} className="text-center py-2 text-gray-500">—</td>;
                    }
                    const relation = sectRelations.find(r =>
                      r.fromSect === fromSect && r.toSect === toSect
                    );
                    const status = getRelationshipStatus(relation?.relationship || 0);
                    return (
                      <td key={toSect} className={`text-center py-2 ${status.color}`}>
                        {relation?.relationship || 0}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSectDetail = () => {
    if (!selectedSect) return null;

    const info = sectInfo[selectedSect];
    const relation = sectRelations.find(r =>
      (r.fromSect === playerSect && r.toSect === selectedSect) ||
      (r.fromSect === selectedSect && r.toSect === playerSect)
    );

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${info.color} mb-2`}>{info.name}</h2>
            <p className="text-gray-300">{info.description}</p>
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
          {(['overview', 'diplomacy', 'trade', 'threats'] as const).map((tab) => (
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
            {renderSectTabContent(selectedSect, relation)}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const renderSectTabContent = (sect: SectTypeType, relation?: SectRelation) => {
    const info = sectInfo[sect];

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Philosophy</h4>
                <p className="text-gray-300 italic">{info.philosophy}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-green-400 mb-3">Strengths</h4>
                <ul className="space-y-1">
                  {info.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-300">• {strength}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-red-400 mb-3">Weaknesses</h4>
                <ul className="space-y-1">
                  {info.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-gray-300">• {weakness}</li>
                  ))}
                </ul>
              </div>

              {relation && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Current Relations</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Status:</span>
                      <span className={getRelationshipStatus(relation.relationship).color}>
                        {getRelationshipStatus(relation.relationship).text}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Value:</span>
                      <span className="text-white">{relation.relationship}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {relation?.recentEvents && relation.recentEvents.length > 0 && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-400 mb-3">Recent Events</h4>
                <div className="space-y-2">
                  {relation.recentEvents.slice(0, 3).map((event, index) => (
                    <div key={index} className="text-sm text-gray-300 border-l-2 border-purple-500 pl-3">
                      {event}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'diplomacy':
        return renderDiplomacyTab(sect, relation);

      case 'trade':
        return renderTradeTab(sect, relation);

      case 'threats':
        return renderThreatsTab(sect);

      default:
        return null;
    }
  };

  const renderDiplomacyTab = (sect: SectTypeType, relation?: SectRelation) => {
    if (sect === playerSect) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-400">This is your own sect.</div>
          <div className="text-gray-300 mt-2">Manage internal affairs through other systems.</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-400 mb-4">Diplomatic Status</h4>
          {relation && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Current Relationship:</span>
                <span className={getRelationshipStatus(relation.relationship).color}>
                  {getRelationshipStatus(relation.relationship).text} ({relation.relationship})
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    relation.relationship > 50 ? 'bg-green-500' :
                    relation.relationship > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(5, (relation.relationship + 100) / 2)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {onSectAction && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-green-400 mb-4">Diplomatic Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSectAction(sect, 'improve_relations')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
              >
                Improve Relations
              </button>
              <button
                onClick={() => onSectAction(sect, 'formal_alliance')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
              >
                Propose Alliance
              </button>
              <button
                onClick={() => onSectAction(sect, 'cultural_exchange')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
              >
                Cultural Exchange
              </button>
              <button
                onClick={() => onSectAction(sect, 'issue_warning')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
              >
                Issue Warning
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-yellow-400 mb-4">Diplomatic History</h4>
          {relation?.recentEvents && relation.recentEvents.length > 0 ? (
            <div className="space-y-2">
              {relation.recentEvents.map((event, index) => (
                <div key={index} className="text-sm text-gray-300 border-l-2 border-yellow-500 pl-3 py-1">
                  {event}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No significant diplomatic events recorded.</div>
          )}
        </div>
      </div>
    );
  };

  const renderTradeTab = (sect: SectTypeType, relation?: SectRelation) => (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-green-400 mb-4">Active Trade Agreements</h4>
        {relation?.tradeAgreements && relation.tradeAgreements.length > 0 ? (
          <div className="space-y-3">
            {relation.tradeAgreements.map((agreement) => (
              <div key={agreement.id} className="bg-gray-600 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">{agreement.resource}</span>
                  <span className="text-green-400">{agreement.amount} units</span>
                </div>
                <div className="text-sm text-gray-300">
                  Price: {agreement.price} credits/unit • Duration: {agreement.duration} days
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No active trade agreements</div>
        )}
      </div>

      {onSectAction && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-400 mb-4">Trade Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSectAction(sect, 'propose_trade')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
            >
              Propose Trade Deal
            </button>
            <button
              onClick={() => onSectAction(sect, 'resource_exchange')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              Resource Exchange
            </button>
            <button
              onClick={() => onSectAction(sect, 'technology_share')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              Technology Share
            </button>
            <button
              onClick={() => onSectAction(sect, 'trade_embargo')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
            >
              Trade Embargo
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderThreatsTab = (sect: SectTypeType) => {
    const getSectThreats = (sectType: SectTypeType) => {
      switch (sectType) {
        case 'preservers':
          return [
            { name: 'Cultural Collapse', level: 'Medium', description: 'Loss of traditional values' },
            { name: 'Innovation Stagnation', level: 'High', description: 'Falling behind technologically' },
            { name: 'Generational Conflict', level: 'Low', description: 'Youth rejecting traditions' }
          ];
        case 'adaptors':
          return [
            { name: 'Humanity Loss', level: 'High', description: 'Modifications may go too far' },
            { name: 'Genetic Instability', level: 'Medium', description: 'Enhancement side effects' },
            { name: 'Social Fragmentation', level: 'Medium', description: 'Enhanced vs unenhanced divide' }
          ];
        case 'wanderers':
          return [
            { name: 'Fleet Dissolution', level: 'High', description: 'Ships may scatter permanently' },
            { name: 'Resource Depletion', level: 'Medium', description: 'Running out of supplies' },
            { name: 'Existential Despair', level: 'Low', description: 'Loss of purpose in endless journey' }
          ];
        default:
          return [];
      }
    };

    const threats = getSectThreats(sect);
    const getThreatColor = (level: string) => {
      switch (level) {
        case 'High': return 'text-red-400';
        case 'Medium': return 'text-yellow-400';
        case 'Low': return 'text-green-400';
        default: return 'text-gray-400';
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-red-400 mb-4">Existential Threats</h4>
          <div className="space-y-4">
            {threats.map((threat, index) => (
              <div key={index} className="bg-gray-600 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">{threat.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${getThreatColor(threat.level)}`}>
                    {threat.level} Risk
                  </span>
                </div>
                <p className="text-sm text-gray-300">{threat.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-orange-400 mb-4">Mitigation Strategies</h4>
          <div className="text-sm text-gray-300 space-y-2">
            {sect === 'preservers' && (
              <>
                <div>• Gradual adaptation to maintain cultural continuity</div>
                <div>• Inter-generational dialogue programs</div>
                <div>• Selective technology adoption</div>
              </>
            )}
            {sect === 'adaptors' && (
              <>
                <div>• Careful monitoring of enhancement procedures</div>
                <div>• Ethical guidelines for modifications</div>
                <div>• Baseline human preservation protocols</div>
              </>
            )}
            {sect === 'wanderers' && (
              <>
                <div>• Fleet cohesion maintenance systems</div>
                <div>• Resource sharing agreements</div>
                <div>• Collective purpose reinforcement</div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">◎ Sect Relations</h1>
        <p className="text-gray-300">
          Navigate the complex relationships between the great ideological factions of humanity.
        </p>
      </div>

      {selectedSect ? renderSectDetail() : renderSectOverview()}
    </div>
  );
};

export default SectRelations;