// services/ChronicleService.ts
import type {
  Chronicle,
  ChronicleEntry,
  ChronicleDecision,
  ChronicleValidationResult,
  ChronicleExportData,
  ChronicleSearchCriteria,
  ChronicleStatistics,
  SuccessLevel,
  PopulationOutcome
} from '../types/chronicle';
import type { HeritageModifier } from '../types/heritage';
import type { GenerationalMission } from '../types/generationalMissions';
import type { LegacyTypeType } from '../types/enums';
import type { Result } from '../utils/result';
import { ResultHelpers, ERROR_CODES } from '../utils/result';
import { validate } from '../utils/validation';
import { GAME_BALANCE } from '../constants/game-balance';
import Logger from '../utils/logger';

export class ChronicleService {
  private static readonly STORAGE_KEY = 'stellar-legacy-chronicles';
  private static readonly VERSION = '1.0.0';

  /**
   * Create a new chronicle entry from a completed mission
   */
  static createChronicleEntry(mission: GenerationalMission): ChronicleEntry {
    const startedAt = new Date(Date.now() - (mission.currentYear * 24 * 60 * 60 * 1000)); // Approximate
    const completedAt = new Date();

    const entry: ChronicleEntry = {
      missionId: mission.id,
      missionName: mission.name,
      missionNumber: this.getNextMissionNumber(),
      startedAt,
      completedAt,
      realDuration: (completedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60), // hours

      // Mission Parameters
      startingLegacy: mission.legacy,
      targetSystem: mission.targetSystemId,
      estimatedDuration: mission.estimatedDuration,
      actualDuration: mission.currentYear,

      // Mission Outcome
      successLevel: mission.successLevel || 'partial',
      dominantLegacy: this.calculateDominantLegacy(mission),
      populationOutcome: this.calculatePopulationOutcome(mission),
      settlementResult: null, // Would be calculated based on mission outcome

      // Player Choices
      keyDecisions: this.extractKeyDecisions(mission),
      decisionMetrics: this.calculateDecisionMetrics(mission),

      // Final State
      finalResources: { ...mission.resources },
      finalPopulation: this.createPopulationSnapshot(mission),
      culturalState: this.createCulturalSnapshot(mission),
      legacyRelationships: [], // Would come from mission state

      // Generated Artifacts
      artifacts: this.generateArtifacts(mission),
      discoveries: this.extractDiscoveries(mission),
      legacyEvolution: this.calculateLegacyEvolution(mission),

      // Performance Metrics
      playerEngagement: this.calculateEngagementMetrics(mission),
      aiPerformance: this.calculateAIPerformance(mission)
    };

    Logger.info('Created chronicle entry', {
      missionId: mission.id,
      successLevel: entry.successLevel,
      actualDuration: entry.actualDuration
    });

    return entry;
  }

  /**
   * Save a chronicle entry to storage
   */
  static async saveChronicleEntry(entry: ChronicleEntry): Promise<Result<void>> {
    try {
      // Validate input
      validate.chronicleEntry(entry);

      const chronicleResult = await this.loadPlayerChronicle();
      if (!chronicleResult.success) {
        return chronicleResult;
      }

      let chronicle = chronicleResult.data;
      if (!chronicle) {
        chronicle = this.createNewChronicle();
      }

      // Validate chronicle doesn't exceed maximum entries
      if (chronicle.entries.length >= GAME_BALANCE.CHRONICLE.MAX_ENTRIES_PER_MISSION) {
        return ResultHelpers.error(
          'Chronicle has reached maximum entries',
          ERROR_CODES.CHRONICLE_GENERATION_FAILED,
          { maxEntries: GAME_BALANCE.CHRONICLE.MAX_ENTRIES_PER_MISSION, currentCount: chronicle.entries.length }
        );
      }

      // Add entry to chronicle
      chronicle.entries.push(entry);
      chronicle.lastUpdated = new Date();

      // Update galaxy state based on entry
      this.updateGalaxyState(chronicle, entry);

      // Save to storage
      await this.saveChronicle(chronicle);

      Logger.info('Saved chronicle entry', {
        chronicleId: chronicle.id,
        entryCount: chronicle.entries.length
      });

      return ResultHelpers.success(undefined);
    } catch (error) {
      Logger.error('Failed to save chronicle entry', error);
      return ResultHelpers.error(
        'Failed to save chronicle entry',
        ERROR_CODES.CHRONICLE_GENERATION_FAILED,
        { entry },
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Generate heritage modifiers from a chronicle entry
   */
  static generateHeritageModifiers(entry: ChronicleEntry): Result<HeritageModifier[]> {
    try {
      // Validate input
      validate.chronicleEntry(entry);

      const modifiers: HeritageModifier[] = [];

      // Generate modifiers based on key decisions
      for (const decision of entry.keyDecisions) {
        if (decision.chronicleWeight > GAME_BALANCE.CHRONICLE.HIGH_IMPACT_THRESHOLD) {
          const modifier = this.createModifierFromDecision(decision, entry);
          if (modifier) {
            modifiers.push(modifier);
          }
        }
      }

    // Generate modifiers based on artifacts
    for (const artifact of entry.artifacts) {
      const modifier = this.createModifierFromArtifact(artifact, entry);
      if (modifier) {
        modifiers.push(modifier);
      }
    }

    // Generate modifiers based on population outcome
    if (entry.populationOutcome !== 'survived') {
      const modifier = this.createModifierFromPopulationOutcome(entry);
      if (modifier) {
        modifiers.push(modifier);
      }
    }

      Logger.info('Generated heritage modifiers', {
        missionId: entry.missionId,
        modifierCount: modifiers.length
      });

      return ResultHelpers.success(modifiers);
    } catch (error) {
      Logger.error('Failed to generate heritage modifiers', error);
      return ResultHelpers.error(
        'Failed to generate heritage modifiers',
        ERROR_CODES.HERITAGE_GENERATION_FAILED,
        { entry },
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Load the player's main chronicle
   */
  static async loadPlayerChronicle(): Promise<Result<Chronicle | null>> {
    return ResultHelpers.fromThrowable(() => {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);

      // Validate and migrate if necessary
      const validation = this.validateChronicleData(data);
      if (!validation.isValid) {
        Logger.warn('Invalid chronicle data found', validation.errors);
        throw new Error(`Invalid chronicle data: ${validation.errors.join(', ')}`);
      }

      return this.migrateChronicleVersion(data, this.VERSION);
    }, { operation: 'loadPlayerChronicle' });
  }

  /**
   * Export chronicle data for sharing
   */
  static exportChronicle(chronicle: Chronicle): string {
    const exportData: ChronicleExportData = {
      chronicle,
      metadata: {
        exportedAt: new Date(),
        version: this.VERSION,
        checksum: this.calculateChecksum(chronicle)
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import chronicle data from external source
   */
  static async importChronicle(data: string): Promise<Chronicle> {
    try {
      const parsed = JSON.parse(data) as ChronicleExportData;

      // Validate import data
      if (!parsed.chronicle || !parsed.metadata) {
        throw new Error('Invalid chronicle export format');
      }

      // Verify checksum
      const calculatedChecksum = this.calculateChecksum(parsed.chronicle);
      if (calculatedChecksum !== parsed.metadata.checksum) {
        throw new Error('Chronicle data integrity check failed');
      }

      // Validate chronicle structure
      const validation = this.validateChronicleData(parsed.chronicle);
      if (!validation.isValid) {
        throw new Error(`Invalid chronicle data: ${validation.errors.join(', ')}`);
      }

      // Migrate to current version if needed
      return this.migrateChronicleVersion(parsed.chronicle, this.VERSION);
    } catch (error) {
      Logger.error('Failed to import chronicle', error);
      throw error;
    }
  }

  /**
   * Search chronicle entries based on criteria
   */
  static searchChronicleEntries(
    chronicle: Chronicle,
    criteria: ChronicleSearchCriteria
  ): ChronicleEntry[] {
    let entries = [...chronicle.entries];

    // Apply filters
    if (criteria.legacyFilter?.length) {
      entries = entries.filter(entry =>
        criteria.legacyFilter!.includes(entry.startingLegacy) ||
        criteria.legacyFilter!.includes(entry.dominantLegacy)
      );
    }

    if (criteria.successLevelFilter?.length) {
      entries = entries.filter(entry =>
        criteria.successLevelFilter!.includes(entry.successLevel)
      );
    }

    if (criteria.timeRangeFilter) {
      entries = entries.filter(entry =>
        entry.completedAt >= criteria.timeRangeFilter!.startDate &&
        entry.completedAt <= criteria.timeRangeFilter!.endDate
      );
    }

    if (criteria.textSearch) {
      const searchTerm = criteria.textSearch.toLowerCase();
      entries = entries.filter(entry =>
        entry.missionName.toLowerCase().includes(searchTerm) ||
        entry.targetSystem.toLowerCase().includes(searchTerm) ||
        entry.keyDecisions.some(decision =>
          decision.title.toLowerCase().includes(searchTerm) ||
          decision.description.toLowerCase().includes(searchTerm)
        )
      );
    }

    if (criteria.minimumDuration !== undefined) {
      entries = entries.filter(entry => entry.actualDuration >= criteria.minimumDuration!);
    }

    if (criteria.maximumDuration !== undefined) {
      entries = entries.filter(entry => entry.actualDuration <= criteria.maximumDuration!);
    }

    return entries;
  }

  /**
   * Calculate comprehensive chronicle statistics
   */
  static calculateChronicleStatistics(chronicle: Chronicle): ChronicleStatistics {
    const entries = chronicle.entries;

    if (entries.length === 0) {
      return this.getEmptyStatistics();
    }

    const totalPlayTime = entries.reduce((sum, entry) => sum + entry.realDuration, 0);
    const successfulMissions = entries.filter(entry =>
      entry.successLevel === 'complete' || entry.successLevel === 'partial'
    ).length;

    const legacyDistribution: Record<LegacyTypeType, number> = {
      preservers: 0,
      adaptors: 0,
      wanderers: 0
    };

    // Calculate legacy distribution
    entries.forEach(entry => {
      legacyDistribution[entry.startingLegacy]++;
    });

    // Extract decision patterns
    const decisionPatterns: Record<string, number> = {};
    entries.forEach(entry => {
      entry.keyDecisions.forEach(decision => {
        const pattern = `${decision.category}_${decision.urgency}`;
        decisionPatterns[pattern] = (decisionPatterns[pattern] || 0) + 1;
      });
    });

    return {
      totalMissions: entries.length,
      totalPlayTime,
      successRate: successfulMissions / entries.length,
      favoriteSpaces: this.extractFavoriteSpaces(entries),
      mostUsedChoices: this.extractMostUsedChoices(entries),
      legacyDistribution,
      averageMissionDuration: entries.reduce((sum, entry) => sum + entry.actualDuration, 0) / entries.length,
      decisionPatterns
    };
  }

  // Private helper methods
  private static createNewChronicle(): Chronicle {
    return {
      id: this.generateId(),
      version: this.VERSION,
      playerName: 'Unknown Explorer',
      createdAt: new Date(),
      lastUpdated: new Date(),
      entries: [],
      galaxyState: {
        exploredSystems: [],
        establishedColonies: [],
        knownThreats: [],
        diplomaticRelations: {},
        sharedKnowledge: []
      },
      playerLegacy: {
        preferredLegacy: 'preservers',
        legacyExperience: {
          preservers: 0,
          adaptors: 0,
          wanderers: 0
        },
        characteristicChoices: [],
        narrativePreferences: {
          preferredComplexity: 'moderate',
          decisionSpeed: 'moderate',
          riskTolerance: 'balanced',
          contentFocus: {
            exploration: 0.5,
            diplomacy: 0.5,
            technology: 0.5,
            culture: 0.5,
            survival: 0.5
          }
        }
      }
    };
  }

  private static async saveChronicle(chronicle: Chronicle): Promise<void> {
    try {
      const serialized = JSON.stringify(chronicle);
      localStorage.setItem(this.STORAGE_KEY, serialized);

      Logger.info('Chronicle saved successfully', {
        chronicleId: chronicle.id,
        entryCount: chronicle.entries.length
      });
    } catch (error) {
      Logger.error('Failed to save chronicle to storage', error);
      throw error;
    }
  }

  private static validateChronicleData(data: any): ChronicleValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data) {
      errors.push('Chronicle data is null or undefined');
      return { isValid: false, errors, warnings };
    }

    if (!data.id) errors.push('Chronicle missing required ID');
    if (!data.version) warnings.push('Chronicle missing version information');
    if (!data.entries || !Array.isArray(data.entries)) {
      errors.push('Chronicle entries must be an array');
    }

    // Validate entries
    if (data.entries) {
      data.entries.forEach((entry: any, index: number) => {
        if (!entry.missionId) errors.push(`Entry ${index} missing missionId`);
        if (!entry.missionName) errors.push(`Entry ${index} missing missionName`);
        if (!entry.successLevel) errors.push(`Entry ${index} missing successLevel`);
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static migrateChronicleVersion(data: any, targetVersion: string): Chronicle {
    // For now, just return the data as-is since we're on version 1.0.0
    // Future versions would implement migration logic here
    return data as Chronicle;
  }

  private static calculateChecksum(chronicle: Chronicle): string {
    // Simple checksum calculation - in production would use a proper hash
    const str = JSON.stringify(chronicle);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private static getNextMissionNumber(): number {
    // This would query existing chronicles to determine the next mission number
    // For now, just return 1
    return 1;
  }

  private static calculateDominantLegacy(mission: GenerationalMission): LegacyTypeType {
    // Analyze mission decisions and outcomes to determine dominant legacy
    // For now, just return the starting legacy
    return mission.legacy;
  }

  private static calculatePopulationOutcome(mission: GenerationalMission): PopulationOutcome {
    const populationRatio = mission.population.total / 10000; // Assuming 10k starting population

    if (populationRatio > 1.5) return 'thrived';
    if (populationRatio > 1.0) return 'survived';
    if (populationRatio > 0.5) return 'diminished';
    if (populationRatio > 0.1) return 'transformed';
    return 'extinct';
  }

  private static extractKeyDecisions(mission: GenerationalMission): ChronicleDecision[] {
    // Extract significant decisions from mission history
    // This would analyze the mission's event history and decision points
    return [];
  }

  private static calculateDecisionMetrics(mission: GenerationalMission): any {
    return {
      totalDecisions: 0,
      averageDecisionTime: 30,
      consensusRate: 0.5,
      innovationRate: 0.3,
      legacyConsistency: {
        preservers: 0.7,
        adaptors: 0.3,
        wanderers: 0.2
      }
    };
  }

  private static createPopulationSnapshot(mission: GenerationalMission): any {
    return {
      total: mission.population.total,
      byLegacy: {
        preservers: mission.population.total * 0.4,
        adaptors: mission.population.total * 0.3,
        wanderers: mission.population.total * 0.3
      },
      byCohort: {},
      averageAge: 35,
      morale: mission.population.morale,
      unity: mission.population.unity,
      culturalDrift: mission.population.culturalDrift
    };
  }

  private static createCulturalSnapshot(mission: GenerationalMission): any {
    return {
      dominantValues: ['exploration', 'preservation'],
      emergentTraditions: [],
      languageEvolution: [],
      artStyles: [],
      religiousBeliefs: [],
      technicalPhilosophies: []
    };
  }

  private static generateArtifacts(mission: GenerationalMission): any[] {
    // Generate artifacts based on mission achievements and discoveries
    return [];
  }

  private static extractDiscoveries(mission: GenerationalMission): any[] {
    // Extract discoveries from mission history
    return [];
  }

  private static calculateLegacyEvolution(mission: GenerationalMission): any[] {
    // Calculate how legacies evolved during the mission
    return [];
  }

  private static calculateEngagementMetrics(mission: GenerationalMission): any {
    return {
      totalPlayTime: 10,
      activeDecisionTime: 3,
      automationUsage: 0.3,
      eventsTriggered: 50,
      eventsResolved: 45,
      playerInitiatedActions: 100,
      averageSessionLength: 45
    };
  }

  private static calculateAIPerformance(mission: GenerationalMission): any {
    return {
      decisionsAutomated: 30,
      playerOverrides: 5,
      successfulPredictions: 25,
      averageConfidence: 0.75,
      learningProgress: 0.6
    };
  }

  private static updateGalaxyState(chronicle: Chronicle, entry: ChronicleEntry): void {
    // Update galaxy state based on the new entry
    if (!chronicle.galaxyState.exploredSystems.includes(entry.targetSystem)) {
      chronicle.galaxyState.exploredSystems.push(entry.targetSystem);
    }
  }

  private static createModifierFromDecision(decision: ChronicleDecision, entry: ChronicleEntry): HeritageModifier | null {
    // Create heritage modifier based on significant decision
    // This would be a complex algorithm analyzing the decision's impact
    return null;
  }

  private static createModifierFromArtifact(artifact: any, entry: ChronicleEntry): HeritageModifier | null {
    // Create heritage modifier based on discovered artifact
    return null;
  }

  private static createModifierFromPopulationOutcome(entry: ChronicleEntry): HeritageModifier | null {
    // Create heritage modifier based on population outcome
    return null;
  }

  private static getEmptyStatistics(): ChronicleStatistics {
    return {
      totalMissions: 0,
      totalPlayTime: 0,
      successRate: 0,
      favoriteSpaces: [],
      mostUsedChoices: [],
      legacyDistribution: { preservers: 0, adaptors: 0, wanderers: 0 },
      averageMissionDuration: 0,
      decisionPatterns: {}
    };
  }

  private static extractFavoriteSpaces(entries: ChronicleEntry[]): string[] {
    const spaceCounts: Record<string, number> = {};
    entries.forEach(entry => {
      spaceCounts[entry.targetSystem] = (spaceCounts[entry.targetSystem] || 0) + 1;
    });

    return Object.entries(spaceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([space]) => space);
  }

  private static extractMostUsedChoices(entries: ChronicleEntry[]): string[] {
    const choiceCounts: Record<string, number> = {};
    entries.forEach(entry => {
      entry.keyDecisions.forEach(decision => {
        choiceCounts[decision.choice] = (choiceCounts[decision.choice] || 0) + 1;
      });
    });

    return Object.entries(choiceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([choice]) => choice);
  }

  private static generateId(): string {
    return `chronicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}