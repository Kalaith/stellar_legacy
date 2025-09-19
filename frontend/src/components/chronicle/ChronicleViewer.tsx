// components/chronicle/ChronicleViewer.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TerminalWindow } from '../ui/TerminalWindow';
import { TerminalText } from '../ui/TerminalWindow';
import type { Chronicle, ChronicleEntry } from '../../types/chronicle';
import { ChronicleService } from '../../services/ChronicleService';
import { useChronicleViewer, ChronicleUtils } from '../../hooks/useChronicleViewer';
import { useDebounce, usePerformanceMonitor, useStableObject } from '../../utils/performance';

interface ChronicleViewerProps {
  onEntrySelect?: (entry: ChronicleEntry) => void;
  onHeritageGenerate?: (entry: ChronicleEntry) => void;
}

export const ChronicleViewer: React.FC<ChronicleViewerProps> = React.memo(({
  onEntrySelect,
  onHeritageGenerate
}) => {
  const [chronicle, setChronicle] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Performance monitoring
  const { start: startRender, end: endRender } = usePerformanceMonitor('ChronicleViewer-render');

  React.useLayoutEffect(() => {
    startRender();
    return () => {
      endRender();
    };
  });

  // Use custom hook for business logic
  const chronicleViewer = useChronicleViewer(chronicle?.entries || []);

  // Memoize stable event handlers
  const stableProps = useStableObject({ onEntrySelect, onHeritageGenerate });

  useEffect(() => {
    loadChronicle();
  }, []);

  const loadChronicle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ChronicleService.loadPlayerChronicle();

      if (result.success) {
        setChronicle(result.data);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chronicle');
    } finally {
      setLoading(false);
    }
  };

  // Optimized and memoized event handlers
  const handleEntrySelect = useCallback((entry: ChronicleEntry) => {
    chronicleViewer.selectEntry(entry);
    stableProps.onEntrySelect?.(entry);
  }, [chronicleViewer.selectEntry, stableProps.onEntrySelect]);

  const handleHeritageGenerate = useCallback((entry: ChronicleEntry) => {
    chronicleViewer.generateHeritageForEntry(entry);
    stableProps.onHeritageGenerate?.(entry);
  }, [chronicleViewer.generateHeritageForEntry, stableProps.onHeritageGenerate]);

  // Debounced search handler to prevent excessive filtering
  const debouncedSearch = useDebounce((...args: unknown[]) => {
    const searchText = args[0] as string;
    chronicleViewer.updateFilter({ searchText: searchText || undefined });
  }, 300);

  const handleExportChronicle = () => {
    if (chronicle) {
      const exportData = ChronicleService.exportChronicle(chronicle);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chronicle-${chronicle.playerName}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <TerminalWindow title="LOADING CHRONICLES" className="min-h-96">
        <TerminalText className="dim">
          Accessing temporal databank...
        </TerminalText>
      </TerminalWindow>
    );
  }

  if (error) {
    return (
      <TerminalWindow title="CHRONICLE ACCESS ERROR" className="min-h-96">
        <TerminalText className="warning">
          ERROR: {error}
        </TerminalText>
        <button
          onClick={loadChronicle}
          className="mt-4 px-4 py-2 bg-yellow-600 text-black rounded hover:bg-yellow-500"
        >
          RETRY ACCESS
        </button>
      </TerminalWindow>
    );
  }

  if (!chronicle || chronicleViewer.isEmpty) {
    return (
      <TerminalWindow title="CHRONICLE ARCHIVE" className="min-h-96">
        <TerminalText className="dim">
          No chronicle entries found. Begin your legacy by completing your first mission.
        </TerminalText>
        {onHeritageGenerate && (
          <button
            onClick={() => onHeritageGenerate({} as ChronicleEntry)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            GENERATE TEST HERITAGE
          </button>
        )}
      </TerminalWindow>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Panel */}
      <TerminalWindow title="CHRONICLE STATISTICS" className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <TerminalText className="primary text-xl">
              {chronicleViewer.statistics.total}
            </TerminalText>
            <TerminalText className="dim text-sm">Missions</TerminalText>
          </div>
          <div>
            <TerminalText className="primary text-xl">
              {Math.round(chronicleViewer.statistics.successRate * 100)}%
            </TerminalText>
            <TerminalText className="dim text-sm">Success Rate</TerminalText>
          </div>
          <div>
            <TerminalText className="primary text-xl">
              {Math.round(chronicleViewer.statistics.averageDuration)}
            </TerminalText>
            <TerminalText className="dim text-sm">Avg. Years</TerminalText>
          </div>
          <div>
            <TerminalText className="primary text-xl">
              {chronicleViewer.statistics.artifactCount}
            </TerminalText>
            <TerminalText className="dim text-sm">Artifacts</TerminalText>
          </div>
        </div>
      </TerminalWindow>

      {/* Filters Panel */}
      <TerminalWindow title="CHRONICLE FILTERS">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Legacy Filter</label>
            <select
              value={chronicleViewer.filters.legacy || ''}
              onChange={(e) => chronicleViewer.updateFilter({
                legacy: e.target.value || undefined
              })}
              className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
            >
              <option value="">All Legacies</option>
              {chronicleViewer.filterOptions.legacies.map(legacy => (
                <option key={legacy} value={legacy}>
                  {legacy.charAt(0).toUpperCase() + legacy.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Success Level</label>
            <select
              value={chronicleViewer.filters.successLevel || ''}
              onChange={(e) => chronicleViewer.updateFilter({
                successLevel: e.target.value || undefined
              })}
              className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
            >
              <option value="">All Outcomes</option>
              {chronicleViewer.filterOptions.successLevels.map(level => (
                <option key={level} value={level}>
                  {ChronicleUtils.getSuccessLevelText(level)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Search</label>
            <input
              type="text"
              value={chronicleViewer.filters.searchText || ''}
              onChange={(e) => debouncedSearch(e.target.value)}
              placeholder="Search missions..."
              className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
            />
          </div>
        </div>

        {chronicleViewer.hasFilters && (
          <div className="mt-4 flex justify-between items-center">
            <TerminalText className="dim">
              Showing {chronicleViewer.entries.length} of {chronicle.entries.length} entries
            </TerminalText>
            <button
              onClick={chronicleViewer.clearFilters}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500"
            >
              Clear Filters
            </button>
          </div>
        )}
      </TerminalWindow>

      {/* Mission List */}
      <TerminalWindow title="MISSION CHRONICLES">
        <div className="space-y-2">
          {chronicleViewer.entries.map((entry, index) => (
            <div
              key={entry.missionId || index}
              className={`border border-gray-600 p-4 rounded cursor-pointer hover:border-green-400 transition-colors ${
                chronicleViewer.selectedEntry?.missionId === entry.missionId ? 'border-green-400 bg-green-900/20' : ''
              }`}
              onClick={() => handleEntrySelect(entry)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-green-400 font-mono text-lg">
                    Mission {entry.missionNumber}: {entry.missionName}
                  </h3>
                  <div className="text-gray-400 text-sm mt-1">
                    <span>Target: {entry.targetSystem}</span>
                    <span className="mx-2">•</span>
                    <span>Duration: {ChronicleUtils.formatDuration(entry.actualDuration)}</span>
                    <span className="mx-2">•</span>
                    <span className={ChronicleUtils.getSuccessLevelColor(entry.successLevel)}>
                      {ChronicleUtils.getSuccessLevelText(entry.successLevel)}
                    </span>
                  </div>
                  {entry.keyDecisions.length > 0 && (
                    <div className="text-gray-500 text-xs mt-2">
                      {entry.keyDecisions.length} key decisions recorded
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHeritageGenerate(entry);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-500"
                  >
                    Generate Heritage
                  </button>
                  <div className="text-right text-xs text-gray-500">
                    Significance: {ChronicleUtils.calculateSignificance(entry).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {chronicleViewer.entries.length === 0 && (
            <TerminalText className="dim text-center py-8">
              No missions match current filters
            </TerminalText>
          )}
        </div>
      </TerminalWindow>

      {/* Selected Entry Details */}
      {chronicleViewer.selectedEntry && (
        <TerminalWindow title={`MISSION DETAILS: ${chronicleViewer.selectedEntry.missionName}`}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <TerminalText className="dim">Mission Parameters</TerminalText>
                <div className="mt-2 space-y-1 text-sm">
                  <div>Legacy: <span className="text-green-400">{chronicleViewer.selectedEntry.startingLegacy}</span></div>
                  <div>Target: <span className="text-green-400">{chronicleViewer.selectedEntry.targetSystem}</span></div>
                  <div>Duration: <span className="text-green-400">{ChronicleUtils.formatDuration(chronicleViewer.selectedEntry.actualDuration)}</span></div>
                </div>
              </div>
              <div>
                <TerminalText className="dim">Mission Outcome</TerminalText>
                <div className="mt-2 space-y-1 text-sm">
                  <div>Result: <span className={ChronicleUtils.getSuccessLevelColor(chronicleViewer.selectedEntry.successLevel)}>
                    {ChronicleUtils.getSuccessLevelText(chronicleViewer.selectedEntry.successLevel)}
                  </span></div>
                  <div>Dominant Legacy: <span className="text-green-400">{chronicleViewer.selectedEntry.dominantLegacy}</span></div>
                </div>
              </div>
            </div>

            {chronicleViewer.selectedEntry.keyDecisions.length > 0 && (
              <div>
                <TerminalText className="dim">Key Decisions</TerminalText>
                <div className="mt-2 space-y-2">
                  {chronicleViewer.selectedEntry.keyDecisions.map((decision, index) => (
                    <div key={decision.id || index} className="border-l-2 border-yellow-600 pl-3">
                      <div className="text-sm text-yellow-400">{decision.title}</div>
                      <div className="text-xs text-gray-400">{decision.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chronicleViewer.selectedEntry.artifacts && chronicleViewer.selectedEntry.artifacts.length > 0 && (
              <div>
                <TerminalText className="dim">Artifacts Discovered</TerminalText>
                <div className="mt-2 space-y-2">
                  {chronicleViewer.selectedEntry.artifacts.map((artifact, index) => (
                    <div key={artifact.id || index} className="border-l-2 border-blue-600 pl-3">
                      <div className="text-sm text-blue-400">{artifact.name}</div>
                      <div className="text-xs text-gray-400">{artifact.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TerminalWindow>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleExportChronicle}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Export Chronicle
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo optimization
  return (
    prevProps.onEntrySelect === nextProps.onEntrySelect &&
    prevProps.onHeritageGenerate === nextProps.onHeritageGenerate
  );
});