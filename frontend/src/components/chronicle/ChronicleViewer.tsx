// components/chronicle/ChronicleViewer.tsx
import React, { useState, useEffect } from 'react';
import { TerminalWindow } from '../ui/TerminalWindow';
import { TerminalText } from '../ui/TerminalWindow';
import type { Chronicle, ChronicleEntry, ChronicleSearchCriteria, SuccessLevel } from '../../types/chronicle';
import type { LegacyTypeType } from '../../types/enums';
import { ChronicleService } from '../../services/ChronicleService';

interface ChronicleViewerProps {
  onEntrySelect?: (entry: ChronicleEntry) => void;
  onHeritageGenerate?: (entry: ChronicleEntry) => void;
}

export const ChronicleViewer: React.FC<ChronicleViewerProps> = ({
  onEntrySelect,
  onHeritageGenerate
}) => {
  const [chronicle, setChronicle] = useState<Chronicle | null>(null);
  const [filteredEntries, setFilteredEntries] = useState<ChronicleEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<ChronicleEntry | null>(null);
  const [filters, setFilters] = useState<ChronicleSearchCriteria>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChronicle();
  }, []);

  useEffect(() => {
    if (chronicle) {
      const entries = ChronicleService.searchChronicleEntries(chronicle, filters);
      setFilteredEntries(entries);
    }
  }, [chronicle, filters]);

  const loadChronicle = async () => {
    try {
      setLoading(true);
      const loadedChronicle = await ChronicleService.loadPlayerChronicle();
      setChronicle(loadedChronicle);
    } catch (error) {
      console.error('Failed to load chronicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntrySelect = (entry: ChronicleEntry) => {
    setSelectedEntry(entry);
    onEntrySelect?.(entry);
  };

  const handleExportChronicle = () => {
    if (chronicle) {
      const exportData = ChronicleService.exportChronicle(chronicle);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stellar-legacy-chronicle-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getSuccessLevelColor = (level: SuccessLevel): string => {
    switch (level) {
      case 'complete': return 'text-green-400';
      case 'partial': return 'text-yellow-400';
      case 'pyrrhic': return 'text-orange-400';
      case 'failure': return 'text-red-400';
      case 'abandoned': return 'text-gray-400';
      default: return 'text-gray-300';
    }
  };

  const getLegacyColor = (legacy: LegacyTypeType): string => {
    switch (legacy) {
      case 'preservers': return 'text-blue-400';
      case 'adaptors': return 'text-green-400';
      case 'wanderers': return 'text-purple-400';
      default: return 'text-gray-300';
    }
  };

  if (loading) {
    return (
      <TerminalWindow title="Chronicle Archive - Loading">
        <TerminalText className="text-yellow-400">
          Accessing chronicle archives...
        </TerminalText>
      </TerminalWindow>
    );
  }

  if (!chronicle) {
    return (
      <TerminalWindow title="Chronicle Archive - No Data">
        <TerminalText className="text-red-400">
          No chronicle found. Complete a mission to begin your chronicle.
        </TerminalText>
      </TerminalWindow>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chronicle Header */}
      <TerminalWindow title="Chronicle Archive" className="h-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <TerminalText className="text-cyan-400 text-lg font-bold">
                {chronicle.playerName}'s Chronicle
              </TerminalText>
              <TerminalText className="text-gray-400">
                {chronicle.entries.length} missions completed
              </TerminalText>
            </div>
            <button
              onClick={handleExportChronicle}
              className="px-4 py-2 bg-blue-900/30 border border-blue-400 text-blue-400
                         rounded hover:bg-blue-800/30 transition-colors"
            >
              Export Chronicle
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-600 pt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Legacy Filter</label>
              <select
                value={filters.legacyFilter?.[0] || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  legacyFilter: e.target.value ? [e.target.value as LegacyTypeType] : undefined
                })}
                className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
              >
                <option value="">All Legacies</option>
                <option value="preservers">Preservers</option>
                <option value="adaptors">Adaptors</option>
                <option value="wanderers">Wanderers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Success Level</label>
              <select
                value={filters.successLevelFilter?.[0] || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  successLevelFilter: e.target.value ? [e.target.value as SuccessLevel] : undefined
                })}
                className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
              >
                <option value="">All Outcomes</option>
                <option value="complete">Complete Success</option>
                <option value="partial">Partial Success</option>
                <option value="pyrrhic">Pyrrhic Victory</option>
                <option value="failure">Failure</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <input
                type="text"
                value={filters.textSearch || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  textSearch: e.target.value || undefined
                })}
                placeholder="Search missions..."
                className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
              />
            </div>
          </div>
        </div>
      </TerminalWindow>

      {/* Mission List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TerminalWindow title="Mission History" className="h-96">
          <div className="space-y-2 overflow-y-auto">
            {filteredEntries.map((entry) => (
              <div
                key={entry.missionId}
                onClick={() => handleEntrySelect(entry)}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  selectedEntry?.missionId === entry.missionId
                    ? 'border-cyan-400 bg-cyan-900/20'
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <TerminalText className="font-bold text-cyan-400">
                    {entry.missionName}
                  </TerminalText>
                  <TerminalText className={`text-sm ${getSuccessLevelColor(entry.successLevel)}`}>
                    {entry.successLevel}
                  </TerminalText>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <TerminalText className="text-gray-400">
                    Target: {entry.targetSystem}
                  </TerminalText>
                  <TerminalText className={getLegacyColor(entry.startingLegacy)}>
                    {entry.startingLegacy}
                  </TerminalText>
                  <TerminalText className="text-gray-400">
                    Duration: {entry.actualDuration} years
                  </TerminalText>
                  <TerminalText className="text-gray-400">
                    Population: {entry.populationOutcome}
                  </TerminalText>
                </div>

                {entry.keyDecisions.length > 0 && (
                  <TerminalText className="text-xs text-blue-400 mt-2">
                    {entry.keyDecisions.length} key decisions recorded
                  </TerminalText>
                )}
              </div>
            ))}

            {filteredEntries.length === 0 && (
              <TerminalText className="text-gray-500 text-center py-8">
                No missions match the current filters
              </TerminalText>
            )}
          </div>
        </TerminalWindow>

        {/* Mission Details */}
        <TerminalWindow title="Mission Details" className="h-96">
          {selectedEntry ? (
            <div className="space-y-4 overflow-y-auto">
              <div>
                <TerminalText className="text-cyan-400 font-bold text-lg">
                  {selectedEntry.missionName}
                </TerminalText>
                <TerminalText className="text-gray-400">
                  Mission #{selectedEntry.missionNumber}
                </TerminalText>
              </div>

              <div className="border-t border-gray-600 pt-4">
                <TerminalText className="text-yellow-400 font-bold mb-2">
                  Mission Outcome
                </TerminalText>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <TerminalText>
                    Success Level: <span className={getSuccessLevelColor(selectedEntry.successLevel)}>
                      {selectedEntry.successLevel}
                    </span>
                  </TerminalText>
                  <TerminalText>
                    Population: <span className="text-yellow-400">
                      {selectedEntry.populationOutcome}
                    </span>
                  </TerminalText>
                  <TerminalText>
                    Dominant Legacy: <span className={getLegacyColor(selectedEntry.dominantLegacy)}>
                      {selectedEntry.dominantLegacy}
                    </span>
                  </TerminalText>
                  <TerminalText>
                    Duration: <span className="text-green-400">
                      {selectedEntry.actualDuration} years
                    </span>
                  </TerminalText>
                </div>
              </div>

              {selectedEntry.keyDecisions.length > 0 && (
                <div className="border-t border-gray-600 pt-4">
                  <TerminalText className="text-yellow-400 font-bold mb-2">
                    Key Decisions
                  </TerminalText>
                  <div className="space-y-2">
                    {selectedEntry.keyDecisions.slice(0, 3).map((decision) => (
                      <div key={decision.id} className="text-sm">
                        <TerminalText className="text-blue-400">
                          Year {decision.year}: {decision.title}
                        </TerminalText>
                        <TerminalText className="text-gray-400 ml-4">
                          Choice: {decision.choice}
                        </TerminalText>
                      </div>
                    ))}
                    {selectedEntry.keyDecisions.length > 3 && (
                      <TerminalText className="text-gray-500 text-xs">
                        ...and {selectedEntry.keyDecisions.length - 3} more decisions
                      </TerminalText>
                    )}
                  </div>
                </div>
              )}

              {selectedEntry.artifacts.length > 0 && (
                <div className="border-t border-gray-600 pt-4">
                  <TerminalText className="text-yellow-400 font-bold mb-2">
                    Artifacts Discovered
                  </TerminalText>
                  <div className="space-y-1">
                    {selectedEntry.artifacts.map((artifact) => (
                      <TerminalText key={artifact.id} className="text-purple-400 text-sm">
                        {artifact.name} ({artifact.type})
                      </TerminalText>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-600 pt-4">
                <button
                  onClick={() => onHeritageGenerate?.(selectedEntry)}
                  className="w-full px-4 py-2 bg-green-900/30 border border-green-400
                           text-green-400 rounded hover:bg-green-800/30 transition-colors"
                >
                  Generate Heritage Modifiers
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <TerminalText className="text-gray-500">
                Select a mission to view details
              </TerminalText>
            </div>
          )}
        </TerminalWindow>
      </div>
    </div>
  );
};