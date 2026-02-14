// hooks/useChronicleViewer.ts
import { useState, useMemo, useCallback } from 'react';
import type { ChronicleEntry } from '../types/chronicle';
import type { HeritageModifier } from '../types/heritage';

/**
 * Filter criteria for chronicle entries
 */
export interface ChronicleFilter {
  successLevel?: string;
  legacy?: string;
  yearRange?: [number, number];
  hasArtifacts?: boolean;
  searchText?: string;
}

/**
 * Sort criteria for chronicle entries
 */
export interface ChronicleSortCriteria {
  field: 'missionNumber' | 'startedAt' | 'completedAt' | 'successLevel' | 'dominantLegacy';
  direction: 'asc' | 'desc';
}

/**
 * Custom hook for managing chronicle viewer state and business logic
 */
export const useChronicleViewer = (entries: ChronicleEntry[]) => {
  const [filters, setFilters] = useState<ChronicleFilter>({});
  const [sortCriteria, setSortCriteria] = useState<ChronicleSortCriteria>({
    field: 'missionNumber',
    direction: 'desc',
  });
  const [selectedEntry, setSelectedEntry] = useState<ChronicleEntry | null>(null);
  const [showHeritageGenerator, setShowHeritageGenerator] = useState(false);

  /**
   * Filter chronicle entries based on current filter criteria
   */
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Success level filter
      if (filters.successLevel && entry.successLevel !== filters.successLevel) {
        return false;
      }

      // Legacy filter
      if (filters.legacy && entry.startingLegacy !== filters.legacy) {
        return false;
      }

      // Year range filter
      if (filters.yearRange) {
        const [minYear, maxYear] = filters.yearRange;
        if (entry.actualDuration < minYear || entry.actualDuration > maxYear) {
          return false;
        }
      }

      // Artifacts filter
      if (filters.hasArtifacts !== undefined) {
        const hasArtifacts = entry.artifacts && entry.artifacts.length > 0;
        if (filters.hasArtifacts !== hasArtifacts) {
          return false;
        }
      }

      // Search text filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const searchFields = [
          entry.missionName,
          entry.targetSystem,
          entry.keyDecisions.map(d => d.title).join(' '),
        ]
          .join(' ')
          .toLowerCase();

        if (!searchFields.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [entries, filters]);

  /**
   * Sort filtered entries based on current sort criteria
   */
  const sortedEntries = useMemo(() => {
    const sorted = [...filteredEntries].sort((a, b) => {
      let comparison = 0;

      switch (sortCriteria.field) {
        case 'missionNumber':
          comparison = a.missionNumber - b.missionNumber;
          break;
        case 'startedAt':
          comparison = a.startedAt.getTime() - b.startedAt.getTime();
          break;
        case 'completedAt':
          comparison = a.completedAt.getTime() - b.completedAt.getTime();
          break;
        case 'successLevel': {
          const successOrder = ['failure', 'partial', 'success', 'major_success'];
          comparison = successOrder.indexOf(a.successLevel) - successOrder.indexOf(b.successLevel);
          break;
        }
        case 'dominantLegacy':
          comparison = a.dominantLegacy.localeCompare(b.dominantLegacy);
          break;
      }

      return sortCriteria.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredEntries, sortCriteria]);

  /**
   * Calculate statistics for the filtered entries
   */
  const statistics = useMemo(() => {
    const total = filteredEntries.length;
    if (total === 0) {
      return {
        total: 0,
        successRate: 0,
        averageDuration: 0,
        legacyDistribution: {},
        artifactCount: 0,
      };
    }

    const successful = filteredEntries.filter(e => {
      const level = e.successLevel as string;
      return level === 'success' || level === 'major_success';
    }).length;

    const totalDuration = filteredEntries.reduce((sum, e) => sum + e.actualDuration, 0);

    const legacyDistribution = filteredEntries.reduce(
      (acc, entry) => {
        acc[entry.dominantLegacy] = (acc[entry.dominantLegacy] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const artifactCount = filteredEntries.reduce((sum, e) => sum + (e.artifacts?.length || 0), 0);

    return {
      total,
      successRate: successful / total,
      averageDuration: totalDuration / total,
      legacyDistribution,
      artifactCount,
    };
  }, [filteredEntries]);

  /**
   * Update filter criteria
   */
  const updateFilter = useCallback((newFilter: Partial<ChronicleFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilter }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Update sort criteria
   */
  const updateSort = useCallback((newSort: Partial<ChronicleSortCriteria>) => {
    setSortCriteria(prev => ({ ...prev, ...newSort }));
  }, []);

  /**
   * Toggle sort direction for current field
   */
  const toggleSortDirection = useCallback(() => {
    setSortCriteria(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  /**
   * Select an entry for detailed view
   */
  const selectEntry = useCallback((entry: ChronicleEntry | null) => {
    setSelectedEntry(entry);
  }, []);

  /**
   * Generate heritage modifiers for selected entry
   */
  const generateHeritageForEntry = useCallback((entry: ChronicleEntry) => {
    setSelectedEntry(entry);
    setShowHeritageGenerator(true);
  }, []);

  /**
   * Close heritage generator
   */
  const closeHeritageGenerator = useCallback(() => {
    setShowHeritageGenerator(false);
  }, []);

  /**
   * Get available filter options based on current data
   */
  const filterOptions = useMemo(() => {
    const successLevels = [...new Set(entries.map(e => e.successLevel))];
    const legacies = [...new Set(entries.map(e => e.startingLegacy))];
    const yearRange: [number, number] =
      entries.length > 0
        ? [
            Math.min(...entries.map(e => e.actualDuration)),
            Math.max(...entries.map(e => e.actualDuration)),
          ]
        : [0, 100];

    return {
      successLevels,
      legacies,
      yearRange,
    };
  }, [entries]);

  return {
    // Data
    entries: sortedEntries,
    selectedEntry,
    statistics,
    filterOptions,

    // Filter state
    filters,
    updateFilter,
    clearFilters,

    // Sort state
    sortCriteria,
    updateSort,
    toggleSortDirection,

    // Selection state
    selectEntry,

    // Heritage generation
    showHeritageGenerator,
    generateHeritageForEntry,
    closeHeritageGenerator,

    // Derived state
    hasFilters: Object.keys(filters).length > 0,
    isEmpty: sortedEntries.length === 0,
    isFiltered: filteredEntries.length < entries.length,
  };
};

/**
 * Hook for managing heritage modifier generation UI state
 */
export const useHeritageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModifiers, setGeneratedModifiers] = useState<HeritageModifier[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateModifiers = useCallback(async (_entry: ChronicleEntry) => {
    setIsGenerating(true);
    setError(null);

    try {
      // This would call the actual service
      // const result = await ChronicleService.generateHeritageModifiers(entry);
      // if (result.success) {
      //   setGeneratedModifiers(result.data);
      // } else {
      //   setError(result.error.message);
      // }

      // Placeholder for now
      setGeneratedModifiers([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearGeneration = useCallback(() => {
    setGeneratedModifiers([]);
    setError(null);
  }, []);

  return {
    isGenerating,
    generatedModifiers,
    error,
    generateModifiers,
    clearGeneration,
    hasModifiers: generatedModifiers.length > 0,
  };
};

/**
 * Utility functions for chronicle data processing
 */
export const ChronicleUtils = {
  /**
   * Format mission duration for display
   */
  formatDuration: (years: number): string => {
    if (years < 1) {
      return `${Math.round(years * 12)} months`;
    }
    return `${Math.round(years)} years`;
  },

  /**
   * Get success level display text
   */
  getSuccessLevelText: (level: string): string => {
    const levels: Record<string, string> = {
      failure: 'Mission Failed',
      partial: 'Partial Success',
      success: 'Mission Success',
      major_success: 'Major Success',
    };
    return levels[level] || level;
  },

  /**
   * Get success level color class
   */
  getSuccessLevelColor: (level: string): string => {
    const colors: Record<string, string> = {
      failure: 'text-red-400',
      partial: 'text-yellow-400',
      success: 'text-green-400',
      major_success: 'text-blue-400',
    };
    return colors[level] || 'text-gray-400';
  },

  /**
   * Calculate entry significance score
   */
  calculateSignificance: (entry: ChronicleEntry): number => {
    let score = 0;

    // Success level weight
    const successWeights = {
      failure: 0.5,
      partial: 0.7,
      success: 1.0,
      major_success: 1.5,
    };
    score += successWeights[entry.successLevel as keyof typeof successWeights] || 0.5;

    // Decision impact weight
    const avgDecisionWeight =
      entry.keyDecisions.length > 0
        ? entry.keyDecisions.reduce((sum, d) => sum + d.chronicleWeight, 0) /
          entry.keyDecisions.length
        : 0;
    score += avgDecisionWeight;

    // Artifact bonus
    score += (entry.artifacts?.length || 0) * 0.2;

    // Duration factor (longer missions are more significant)
    score += Math.min(entry.actualDuration / 100, 1) * 0.5;

    return Math.min(score, 3); // Cap at 3.0
  },

  /**
   * Group entries by time period
   */
  groupByPeriod: (
    entries: ChronicleEntry[],
    periodYears: number = 50
  ): Record<string, ChronicleEntry[]> => {
    return entries.reduce(
      (groups, entry) => {
        const period = Math.floor(entry.missionNumber / (periodYears / 10)) * (periodYears / 10);
        const key = `Years ${period}-${period + periodYears - 1}`;
        groups[key] = groups[key] || [];
        groups[key].push(entry);
        return groups;
      },
      {} as Record<string, ChronicleEntry[]>
    );
  },
};
