// services/HeritageService.ts
import type {
  HeritageModifier,
  HeritageApplicationResult,
  HeritageSelectionCriteria,
  HeritageConflict,
  HeritageTemplate,
  HeritageLibrary,
  HeritageRecommendation,
  HeritageAnalysis,
  ModifierCombination,
  ModifierSynergy,
  ResourceModifier,
  PopulationModifier,
  EventModifier,
  TechnologyModifier,
  NarrativeElement,
  HeritageSource,
  HeritageTier
} from '../types/heritage';
import type { ChronicleEntry, ChronicleDecision, ChronicleArtifact } from '../types/chronicle';
import type { ExtendedResources, GenerationalMission } from '../types/generationalMissions';
import type { LegacyTypeType } from '../types/enums';
import Logger from '../utils/logger';

export class HeritageService {
  private static readonly HERITAGE_STORAGE_KEY = 'stellar-legacy-heritage-library';
  private static modifierTemplates: HeritageTemplate[] = [];
  private static heritageLibrary: HeritageLibrary | null = null;

  /**
   * Generate heritage modifiers from a completed chronicle entry
   */
  static generateHeritageModifiers(entry: ChronicleEntry): HeritageModifier[] {
    const modifiers: HeritageModifier[] = [];

    try {
      // Generate from key decisions
      entry.keyDecisions.forEach(decision => {
        if (decision.chronicleWeight >= 0.7) {
          const modifier = this.createModifierFromDecision(decision, entry);
          if (modifier) modifiers.push(modifier);
        }
      });

      // Generate from artifacts
      entry.artifacts.forEach(artifact => {
        const modifier = this.createModifierFromArtifact(artifact, entry);
        if (modifier) modifiers.push(modifier);
      });

      // Generate from population outcome
      if (entry.populationOutcome !== 'survived') {
        const modifier = this.createModifierFromPopulationOutcome(entry);
        if (modifier) modifiers.push(modifier);
      }

      // Generate from legacy evolution
      entry.legacyEvolution.forEach(evolution => {
        if (evolution.deviationMagnitude > 0.5) {
          const modifier = this.createModifierFromLegacyEvolution(evolution, entry);
          if (modifier) modifiers.push(modifier);
        }
      });

      // Generate from settlement results
      if (entry.settlementResult && entry.settlementResult.influence > 0.3) {
        const modifier = this.createModifierFromSettlement(entry.settlementResult, entry);
        if (modifier) modifiers.push(modifier);
      }

      Logger.info('Generated heritage modifiers', {
        chronicleEntry: entry.missionId,
        modifierCount: modifiers.length
      });

      return modifiers;
    } catch (error) {
      Logger.error('Failed to generate heritage modifiers', error);
      return [];
    }
  }

  /**
   * Apply heritage modifiers to a new mission
   */
  static applyHeritageModifiers(
    modifiers: HeritageModifier[],
    mission: GenerationalMission
  ): HeritageApplicationResult {
    const result: HeritageApplicationResult = {
      appliedModifiers: [],
      resourceChanges: {},
      populationEffects: [],
      narrativeContext: [],
      warnings: []
    };

    try {
      // Check for conflicts first
      const conflicts = this.detectConflicts(modifiers);
      const validModifiers = this.resolveConflicts(modifiers, conflicts);

      // Apply each valid modifier
      validModifiers.forEach(modifier => {
        // Apply resource modifiers
        modifier.resourceModifiers.forEach(resourceMod => {
          this.applyResourceModifier(resourceMod, mission, result);
        });

        // Apply population modifiers
        modifier.populationModifiers.forEach(popMod => {
          this.applyPopulationModifier(popMod, mission, result);
        });

        // Collect narrative elements
        modifier.startingNarrative.forEach(narrative => {
          result.narrativeContext.push(narrative.text);
        });

        result.appliedModifiers.push(modifier);
      });

      // Report any conflicts
      conflicts.forEach(conflict => {
        result.warnings.push(`Conflict resolved: ${conflict.resolution}`);
      });

      Logger.info('Applied heritage modifiers', {
        missionId: mission.id,
        appliedCount: result.appliedModifiers.length,
        conflictCount: conflicts.length
      });

      return result;
    } catch (error) {
      Logger.error('Failed to apply heritage modifiers', error);
      result.warnings.push('Error applying heritage modifiers');
      return result;
    }
  }

  /**
   * Analyze available heritage modifiers and provide recommendations
   */
  static analyzeHeritageOptions(
    availableModifiers: HeritageModifier[],
    targetMission: Partial<GenerationalMission>,
    criteria: HeritageSelectionCriteria
  ): HeritageAnalysis {
    try {
      // Filter modifiers based on criteria
      const filteredModifiers = this.filterModifiers(availableModifiers, criteria);

      // Generate recommendations
      const recommendations = this.generateRecommendations(filteredModifiers, targetMission);

      // Find best combinations
      const combinations = this.findBestCombinations(filteredModifiers, criteria);

      // Detect warnings
      const warnings = this.analyzeWarnings(filteredModifiers, targetMission);

      // Generate narrative summary
      const narrativeSummary = this.generateNarrativeSummary(filteredModifiers);

      return {
        availableModifiers: filteredModifiers,
        recommendations: recommendations.slice(0, 5), // Top 5 recommendations
        bestCombinations: combinations.slice(0, 3), // Top 3 combinations
        warnings,
        narrativeSummary
      };
    } catch (error) {
      Logger.error('Failed to analyze heritage options', error);
      return {
        availableModifiers: [],
        recommendations: [],
        bestCombinations: [],
        warnings: ['Error analyzing heritage options'],
        narrativeSummary: 'Unable to analyze heritage options'
      };
    }
  }

  /**
   * Detect conflicts between heritage modifiers
   */
  static detectConflicts(modifiers: HeritageModifier[]): HeritageConflict[] {
    const conflicts: HeritageConflict[] = [];

    for (let i = 0; i < modifiers.length; i++) {
      for (let j = i + 1; j < modifiers.length; j++) {
        const mod1 = modifiers[i];
        const mod2 = modifiers[j];

        // Check mutual exclusivity
        if (mod1.mutuallyExclusive.includes(mod2.id)) {
          conflicts.push({
            modifier1: mod1.id,
            modifier2: mod2.id,
            conflictType: 'mutually_exclusive',
            severity: 'critical',
            resolution: `Cannot use ${mod1.name} with ${mod2.name}`
          });
        }

        // Check resource conflicts
        const resourceConflict = this.checkResourceConflicts(mod1, mod2);
        if (resourceConflict) {
          conflicts.push(resourceConflict);
        }

        // Check narrative consistency
        const narrativeConflict = this.checkNarrativeConflicts(mod1, mod2);
        if (narrativeConflict) {
          conflicts.push(narrativeConflict);
        }
      }
    }

    return conflicts;
  }

  /**
   * Save heritage library to storage
   */
  static async saveHeritageLibrary(library: HeritageLibrary): Promise<void> {
    try {
      const serialized = JSON.stringify(library);
      localStorage.setItem(this.HERITAGE_STORAGE_KEY, serialized);
      this.heritageLibrary = library;

      Logger.info('Heritage library saved', {
        modifierCount: library.modifiers.length,
        templateCount: library.templates.length
      });
    } catch (error) {
      Logger.error('Failed to save heritage library', error);
      throw error;
    }
  }

  /**
   * Load heritage library from storage
   */
  static async loadHeritageLibrary(): Promise<HeritageLibrary> {
    try {
      if (this.heritageLibrary) {
        return this.heritageLibrary;
      }

      const stored = localStorage.getItem(this.HERITAGE_STORAGE_KEY);
      if (stored) {
        this.heritageLibrary = JSON.parse(stored);
        return this.heritageLibrary!;
      }

      // Create new library if none exists
      this.heritageLibrary = this.createEmptyLibrary();
      return this.heritageLibrary;
    } catch (error) {
      Logger.error('Failed to load heritage library', error);
      return this.createEmptyLibrary();
    }
  }

  // Private helper methods

  private static createModifierFromDecision(
    decision: ChronicleDecision,
    entry: ChronicleEntry
  ): HeritageModifier | null {
    const tier = this.calculateTierFromWeight(decision.chronicleWeight);
    const source: HeritageSource = {
      chronicleId: entry.missionId,
      missionNumber: entry.missionNumber,
      sourceType: 'decision',
      specificSource: decision.id,
      generationContext: `Generation ${decision.generation}, Year ${decision.year}`
    };

    const modifier: HeritageModifier = {
      id: this.generateModifierId(),
      name: `Echo of ${decision.title}`,
      description: `The consequences of ${decision.title} continue to influence future generations.`,
      source,
      tier,
      resourceModifiers: this.generateResourceModifiersFromDecision(decision),
      populationModifiers: this.generatePopulationModifiersFromDecision(decision),
      eventModifiers: this.generateEventModifiersFromDecision(decision),
      technologyModifiers: [],
      startingNarrative: this.generateNarrativeFromDecision(decision),
      availableChoices: [],
      restrictedActions: [],
      narrativeReferences: [],
      applicabilityConditions: [],
      mutuallyExclusive: [],
      prerequisites: [],
      playerRating: 0,
      usageCount: 0,
      effectivenessRating: 0
    };

    return modifier;
  }

  private static createModifierFromArtifact(
    artifact: ChronicleArtifact,
    entry: ChronicleEntry
  ): HeritageModifier | null {
    const tier = this.calculateTierFromArtifact(artifact);
    const source: HeritageSource = {
      chronicleId: entry.missionId,
      missionNumber: entry.missionNumber,
      sourceType: 'artifact',
      specificSource: artifact.id,
      generationContext: artifact.origin.circumstances
    };

    const modifier: HeritageModifier = {
      id: this.generateModifierId(),
      name: `Legacy of ${artifact.name}`,
      description: artifact.description,
      source,
      tier,
      resourceModifiers: this.generateResourceModifiersFromArtifact(artifact),
      populationModifiers: [],
      eventModifiers: [],
      technologyModifiers: this.generateTechnologyModifiersFromArtifact(artifact),
      startingNarrative: [{ text: artifact.flavorText, references: [], context: 'mission_start', variability: [] }],
      availableChoices: [],
      restrictedActions: [],
      narrativeReferences: [],
      applicabilityConditions: [],
      mutuallyExclusive: [],
      prerequisites: [],
      playerRating: 0,
      usageCount: 0,
      effectivenessRating: 0
    };

    return modifier;
  }

  private static createModifierFromPopulationOutcome(entry: ChronicleEntry): HeritageModifier | null {
    const source: HeritageSource = {
      chronicleId: entry.missionId,
      missionNumber: entry.missionNumber,
      sourceType: 'outcome',
      specificSource: entry.populationOutcome,
      generationContext: `Population ${entry.populationOutcome} after ${entry.actualDuration} years`
    };

    const modifier: HeritageModifier = {
      id: this.generateModifierId(),
      name: `Survivors' Legacy`,
      description: `The ${entry.populationOutcome} population has left its mark on future generations.`,
      source,
      tier: this.calculateTierFromPopulationOutcome(entry.populationOutcome),
      resourceModifiers: [],
      populationModifiers: this.generatePopulationModifiersFromOutcome(entry.populationOutcome),
      eventModifiers: [],
      technologyModifiers: [],
      startingNarrative: [],
      availableChoices: [],
      restrictedActions: [],
      narrativeReferences: [],
      applicabilityConditions: [],
      mutuallyExclusive: [],
      prerequisites: [],
      playerRating: 0,
      usageCount: 0,
      effectivenessRating: 0
    };

    return modifier;
  }

  private static createModifierFromLegacyEvolution(evolution: any, entry: ChronicleEntry): HeritageModifier | null {
    // Implementation for legacy evolution modifiers
    return null;
  }

  private static createModifierFromSettlement(settlement: any, entry: ChronicleEntry): HeritageModifier | null {
    // Implementation for settlement modifiers
    return null;
  }

  private static applyResourceModifier(
    modifier: ResourceModifier,
    mission: GenerationalMission,
    result: HeritageApplicationResult
  ): void {
    const currentValue = (mission.resources as any)[modifier.resource] || 0;
    let change = 0;

    switch (modifier.type) {
      case 'flat':
        change = modifier.value;
        break;
      case 'percentage':
        change = currentValue * (modifier.value / 100);
        break;
      case 'multiplier':
        change = currentValue * modifier.value - currentValue;
        break;
    }

    result.resourceChanges[modifier.resource] = (result.resourceChanges[modifier.resource] || 0) + change;
  }

  private static applyPopulationModifier(
    modifier: PopulationModifier,
    mission: GenerationalMission,
    result: HeritageApplicationResult
  ): void {
    result.populationEffects.push(modifier);
    // Actual application to mission would happen in the calling code
  }

  private static resolveConflicts(
    modifiers: HeritageModifier[],
    conflicts: HeritageConflict[]
  ): HeritageModifier[] {
    // For now, just remove conflicting modifiers with lower priority
    const conflictingIds = new Set<string>();
    conflicts.forEach(conflict => {
      if (conflict.severity === 'critical') {
        conflictingIds.add(conflict.modifier2); // Remove the second modifier
      }
    });

    return modifiers.filter(mod => !conflictingIds.has(mod.id));
  }

  private static filterModifiers(
    modifiers: HeritageModifier[],
    criteria: HeritageSelectionCriteria
  ): HeritageModifier[] {
    let filtered = [...modifiers];

    if (criteria.tierLimits) {
      // Apply tier limits
      const tierCounts: Partial<Record<HeritageTier, number>> = {};
      filtered = filtered.filter(mod => {
        const currentCount = tierCounts[mod.tier] || 0;
        const limit = criteria.tierLimits![mod.tier];
        if (limit && currentCount >= limit) {
          return false;
        }
        tierCounts[mod.tier] = currentCount + 1;
        return true;
      });
    }

    if (criteria.maxModifiers) {
      filtered = filtered.slice(0, criteria.maxModifiers);
    }

    return filtered;
  }

  private static generateRecommendations(
    modifiers: HeritageModifier[],
    targetMission: Partial<GenerationalMission>
  ): HeritageRecommendation[] {
    return modifiers.map(modifier => ({
      modifier,
      relevanceScore: this.calculateRelevanceScore(modifier, targetMission),
      balanceScore: this.calculateBalanceScore(modifier),
      narrativeScore: this.calculateNarrativeScore(modifier),
      playerPreferenceScore: this.calculatePlayerPreferenceScore(modifier),
      reasoning: this.generateRecommendationReasoning(modifier, targetMission)
    })).sort((a, b) => {
      const scoreA = (a.relevanceScore + a.balanceScore + a.narrativeScore + a.playerPreferenceScore) / 4;
      const scoreB = (b.relevanceScore + b.balanceScore + b.narrativeScore + b.playerPreferenceScore) / 4;
      return scoreB - scoreA;
    });
  }

  private static findBestCombinations(
    modifiers: HeritageModifier[],
    criteria: HeritageSelectionCriteria
  ): ModifierCombination[] {
    // This would implement a complex algorithm to find synergistic combinations
    // For now, return empty array
    return [];
  }

  private static analyzeWarnings(
    modifiers: HeritageModifier[],
    targetMission: Partial<GenerationalMission>
  ): string[] {
    const warnings: string[] = [];

    // Check for balance issues
    const totalPowerLevel = modifiers.reduce((sum, mod) => sum + mod.effectivenessRating, 0);
    if (totalPowerLevel > 5) {
      warnings.push('High total modifier power may make the mission too easy');
    }

    // Check for narrative consistency
    const legacyTypes = new Set(modifiers.map(mod =>
      mod.source.specificSource.includes('preservers') ? 'preservers' :
      mod.source.specificSource.includes('adaptors') ? 'adaptors' : 'wanderers'
    ));

    if (legacyTypes.size > 2) {
      warnings.push('Mixed legacy modifiers may create narrative inconsistencies');
    }

    return warnings;
  }

  private static generateNarrativeSummary(modifiers: HeritageModifier[]): string {
    if (modifiers.length === 0) {
      return 'No heritage modifiers selected. This mission will begin with a clean slate.';
    }

    const narrativeElements = modifiers.flatMap(mod => mod.startingNarrative.map(n => n.text));
    return `Your mission begins with the legacy of ${modifiers.length} previous journeys: ${narrativeElements.join(' ')}`;
  }

  // Utility methods for calculations
  private static calculateTierFromWeight(weight: number): HeritageTier {
    if (weight >= 0.9) return 'legendary';
    if (weight >= 0.8) return 'major';
    if (weight >= 0.7) return 'moderate';
    return 'minor';
  }

  private static calculateTierFromArtifact(artifact: ChronicleArtifact): HeritageTier {
    if (artifact.type === 'historical') return 'legendary';
    if (artifact.type === 'technology') return 'major';
    return 'moderate';
  }

  private static calculateTierFromPopulationOutcome(outcome: string): HeritageTier {
    switch (outcome) {
      case 'thrived': return 'major';
      case 'transformed': return 'major';
      case 'survived': return 'minor';
      case 'diminished': return 'moderate';
      case 'extinct': return 'legendary';
      default: return 'minor';
    }
  }

  private static calculateRelevanceScore(modifier: HeritageModifier, mission: Partial<GenerationalMission>): number {
    // Calculate how relevant this modifier is to the target mission
    return 0.5; // Placeholder
  }

  private static calculateBalanceScore(modifier: HeritageModifier): number {
    // Calculate how balanced this modifier is for gameplay
    return 0.7; // Placeholder
  }

  private static calculateNarrativeScore(modifier: HeritageModifier): number {
    // Calculate how well this modifier fits narratively
    return 0.6; // Placeholder
  }

  private static calculatePlayerPreferenceScore(modifier: HeritageModifier): number {
    // Calculate how much the player might like this modifier
    return modifier.playerRating / 5; // Convert 1-5 rating to 0-1 score
  }

  private static generateRecommendationReasoning(
    modifier: HeritageModifier,
    mission: Partial<GenerationalMission>
  ): string[] {
    return [
      `Based on previous decision: ${modifier.source.specificSource}`,
      `Tier: ${modifier.tier}`,
      `Source: ${modifier.source.sourceType}`
    ];
  }

  private static checkResourceConflicts(mod1: HeritageModifier, mod2: HeritageModifier): HeritageConflict | null {
    // Check for resource conflicts between modifiers
    return null; // Placeholder
  }

  private static checkNarrativeConflicts(mod1: HeritageModifier, mod2: HeritageModifier): HeritageConflict | null {
    // Check for narrative conflicts between modifiers
    return null; // Placeholder
  }

  private static createEmptyLibrary(): HeritageLibrary {
    return {
      modifiers: [],
      templates: [],
      playerCustomizations: {},
      generationHistory: []
    };
  }

  // Generation helper methods
  private static generateResourceModifiersFromDecision(decision: ChronicleDecision): ResourceModifier[] {
    // Generate resource modifiers based on decision impact
    return [];
  }

  private static generatePopulationModifiersFromDecision(decision: ChronicleDecision): PopulationModifier[] {
    // Generate population modifiers based on decision impact
    return [];
  }

  private static generateEventModifiersFromDecision(decision: ChronicleDecision): EventModifier[] {
    // Generate event modifiers based on decision impact
    return [];
  }

  private static generateNarrativeFromDecision(decision: ChronicleDecision): NarrativeElement[] {
    return [{
      text: `The memory of ${decision.title} lingers in the collective consciousness.`,
      references: [decision.id],
      context: 'mission_start',
      variability: []
    }];
  }

  private static generateResourceModifiersFromArtifact(artifact: ChronicleArtifact): ResourceModifier[] {
    return [];
  }

  private static generateTechnologyModifiersFromArtifact(artifact: ChronicleArtifact): TechnologyModifier[] {
    return [];
  }

  private static generatePopulationModifiersFromOutcome(outcome: string): PopulationModifier[] {
    return [];
  }

  private static generateModifierId(): string {
    return `heritage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}