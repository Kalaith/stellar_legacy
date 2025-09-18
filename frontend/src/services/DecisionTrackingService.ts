// services/DecisionTrackingService.ts
import type {
  ChronicleDecision,
  LongTermEffect,
  DecisionCategory,
  DecisionUrgency,
  DecisionScope,
  ImmediateConsequence
} from '../types/chronicle';
import type { GenerationalMission } from '../types/generationalMissions';
import type { LegacyTypeType } from '../types/enums';
import Logger from '../utils/logger';

export interface DecisionInput {
  title: string;
  description: string;
  context: string;
  category: DecisionCategory;
  choice: string;
  alternatives: string[];
  urgency: DecisionUrgency;
  scope: DecisionScope;
  immediateConsequences: ImmediateConsequence[];
  predictedLongTermEffects: string[];
}

export interface DecisionLedger {
  entries: DecisionEntry[];
  consequenceChains: ConsequenceChain[];
  playerReflections: PlayerReflection[];
}

export interface DecisionEntry {
  id: string;
  year: number;
  generation: number;
  decision: ChronicleDecision;
  context: string;
  alternativeChoices: string[];

  // Immediate Effects
  immediateConsequences: string[];
  resourceChanges: Record<string, number>;

  // Long-term Tracking
  longTermConsequences: LongTermEffect[];
  chronicleImpact: number; // How much this decision shapes the chronicle
}

export interface ConsequenceChain {
  originDecisionId: string;
  chainEvents: ChainEvent[];
  stillActive: boolean;
  finalOutcome: string | null;
}

export interface ChainEvent {
  year: number;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'civilization-defining';
  references: string[]; // References to original decision
}

export interface PlayerReflection {
  decisionId: string;
  reflectionText: string;
  timestamp: Date;
  satisfaction: number; // 1-5 rating
  wouldChooseDifferently: boolean;
  lessons: string[];
}

export interface DecisionFilter {
  categories?: DecisionCategory[];
  urgencyLevels?: DecisionUrgency[];
  scopes?: DecisionScope[];
  timeRange?: {
    startYear: number;
    endYear: number;
  };
  legacyFilter?: LegacyTypeType[];
  impactThreshold?: number;
  textSearch?: string;
}

export interface DecisionPattern {
  pattern: string;
  frequency: number;
  outcomes: string[];
  averageImpact: number;
  playerSatisfaction: number;
}

export interface DecisionAnalytics {
  totalDecisions: number;
  decisionsByCategory: Record<DecisionCategory, number>;
  decisionsByUrgency: Record<DecisionUrgency, number>;
  decisionsByScope: Record<DecisionScope, number>;
  averageImpact: number;
  averageSatisfaction: number;
  commonPatterns: DecisionPattern[];
  consequenceAccuracy: number; // How often predictions matched reality
}

export class DecisionTrackingService {
  private static readonly DECISION_STORAGE_KEY = 'stellar-legacy-decision-ledger';
  private static currentLedger: DecisionLedger | null = null;

  /**
   * Record a new decision made by the player
   */
  static recordDecision(
    decision: DecisionInput,
    mission: GenerationalMission
  ): DecisionEntry {
    try {
      const chronicleDecision: ChronicleDecision = {
        id: this.generateDecisionId(),
        title: decision.title,
        description: decision.description,
        context: decision.context,
        year: mission.currentYear,
        generation: Math.floor(mission.currentYear / 25), // Assuming 25 years per generation
        phase: mission.currentPhase,
        category: decision.category,
        choice: decision.choice,
        alternatives: decision.alternatives,
        urgency: decision.urgency,
        scope: decision.scope,
        immediateConsequences: decision.immediateConsequences,
        predictedLongTermEffects: decision.predictedLongTermEffects,
        actualLongTermEffects: [],
        referencedDecisions: this.findReferencedDecisions(decision, mission),
        chronicleWeight: this.calculateChronicleWeight(decision, mission),
        legacyAlignment: this.calculateLegacyAlignment(decision, mission)
      };

      const entry: DecisionEntry = {
        id: chronicleDecision.id,
        year: mission.currentYear,
        generation: Math.floor(mission.currentYear / 25),
        decision: chronicleDecision,
        context: this.generateDecisionContext(decision, mission),
        alternativeChoices: decision.alternatives,
        immediateConsequences: decision.immediateConsequences.map(c => c.description),
        resourceChanges: this.extractResourceChanges(decision.immediateConsequences),
        longTermConsequences: [],
        chronicleImpact: chronicleDecision.chronicleWeight
      };

      // Add to ledger
      this.addToLedger(entry);

      // Start tracking consequence chains
      this.initializeConsequenceChain(entry);

      Logger.info('Decision recorded', {
        decisionId: entry.id,
        title: decision.title,
        category: decision.category,
        chronicleWeight: chronicleDecision.chronicleWeight
      });

      return entry;
    } catch (error) {
      Logger.error('Failed to record decision', error);
      throw error;
    }
  }

  /**
   * Track the manifestation of a long-term effect
   */
  static trackConsequence(
    decisionId: string,
    consequence: LongTermEffect,
    mission: GenerationalMission
  ): void {
    try {
      const ledger = this.getLedger();
      const entry = ledger.entries.find(e => e.id === decisionId);

      if (!entry) {
        Logger.warn('Decision not found for consequence tracking', { decisionId });
        return;
      }

      // Add to decision's long-term consequences
      entry.longTermConsequences.push(consequence);

      // Update consequence chain
      const chain = ledger.consequenceChains.find(c => c.originDecisionId === decisionId);
      if (chain) {
        chain.chainEvents.push({
          year: mission.currentYear,
          description: consequence.description,
          severity: consequence.severity,
          references: [decisionId]
        });

        // Check if this is a final outcome
        if (consequence.severity === 'civilization-defining') {
          chain.stillActive = false;
          chain.finalOutcome = consequence.description;
        }
      }

      // Update chronicle weight based on actual impact
      this.updateChronicleWeight(entry, consequence);

      // Save updated ledger
      this.saveLedger(ledger);

      Logger.info('Consequence tracked', {
        decisionId,
        consequenceYear: consequence.manifestYear,
        severity: consequence.severity
      });
    } catch (error) {
      Logger.error('Failed to track consequence', error);
    }
  }

  /**
   * Review decision history with filters
   */
  static reviewDecisionHistory(filters: DecisionFilter): DecisionEntry[] {
    try {
      const ledger = this.getLedger();
      let entries = [...ledger.entries];

      // Apply filters
      if (filters.categories?.length) {
        entries = entries.filter(entry => filters.categories!.includes(entry.decision.category));
      }

      if (filters.urgencyLevels?.length) {
        entries = entries.filter(entry => filters.urgencyLevels!.includes(entry.decision.urgency));
      }

      if (filters.scopes?.length) {
        entries = entries.filter(entry => filters.scopes!.includes(entry.decision.scope));
      }

      if (filters.timeRange) {
        entries = entries.filter(entry =>
          entry.year >= filters.timeRange!.startYear &&
          entry.year <= filters.timeRange!.endYear
        );
      }

      if (filters.legacyFilter?.length) {
        entries = entries.filter(entry => {
          return filters.legacyFilter!.some(legacy =>
            Object.keys(entry.decision.legacyAlignment).includes(legacy) &&
            entry.decision.legacyAlignment[legacy] > 0
          );
        });
      }

      if (filters.impactThreshold !== undefined) {
        entries = entries.filter(entry => entry.chronicleImpact >= filters.impactThreshold!);
      }

      if (filters.textSearch) {
        const searchTerm = filters.textSearch.toLowerCase();
        entries = entries.filter(entry =>
          entry.decision.title.toLowerCase().includes(searchTerm) ||
          entry.decision.description.toLowerCase().includes(searchTerm) ||
          entry.decision.choice.toLowerCase().includes(searchTerm)
        );
      }

      // Sort by year (most recent first)
      entries.sort((a, b) => b.year - a.year);

      Logger.info('Decision history reviewed', {
        totalEntries: ledger.entries.length,
        filteredEntries: entries.length
      });

      return entries;
    } catch (error) {
      Logger.error('Failed to review decision history', error);
      return [];
    }
  }

  /**
   * Add player reflection on a decision
   */
  static addPlayerReflection(
    decisionId: string,
    reflectionText: string,
    satisfaction: number,
    wouldChooseDifferently: boolean,
    lessons: string[]
  ): void {
    try {
      const reflection: PlayerReflection = {
        decisionId,
        reflectionText,
        timestamp: new Date(),
        satisfaction,
        wouldChooseDifferently,
        lessons
      };

      const ledger = this.getLedger();
      ledger.playerReflections.push(reflection);
      this.saveLedger(ledger);

      Logger.info('Player reflection added', {
        decisionId,
        satisfaction,
        wouldChooseDifferently
      });
    } catch (error) {
      Logger.error('Failed to add player reflection', error);
    }
  }

  /**
   * Analyze decision patterns and provide insights
   */
  static analyzeDecisionPatterns(): DecisionAnalytics {
    try {
      const ledger = this.getLedger();
      const entries = ledger.entries;

      if (entries.length === 0) {
        return this.getEmptyAnalytics();
      }

      // Count decisions by category
      const decisionsByCategory: Record<DecisionCategory, number> = {
        resource: 0,
        population: 0,
        cultural: 0,
        diplomatic: 0,
        crisis: 0,
        exploration: 0,
        legacy: 0
      };

      // Count decisions by urgency
      const decisionsByUrgency: Record<DecisionUrgency, number> = {
        immediate: 0,
        urgent: 0,
        moderate: 0,
        routine: 0
      };

      // Count decisions by scope
      const decisionsByScope: Record<DecisionScope, number> = {
        individual: 0,
        cohort: 0,
        dynasty: 0,
        legacy: 0,
        civilization: 0
      };

      let totalImpact = 0;
      let totalSatisfaction = 0;
      let satisfactionCount = 0;
      let correctPredictions = 0;
      let totalPredictions = 0;

      entries.forEach(entry => {
        decisionsByCategory[entry.decision.category]++;
        decisionsByUrgency[entry.decision.urgency]++;
        decisionsByScope[entry.decision.scope]++;
        totalImpact += entry.chronicleImpact;

        // Check prediction accuracy
        const predictedCount = entry.decision.predictedLongTermEffects.length;
        const actualCount = entry.longTermConsequences.length;

        if (predictedCount > 0) {
          totalPredictions += predictedCount;
          // Simple accuracy check - in reality would be more sophisticated
          const matchingPredictions = entry.decision.predictedLongTermEffects.filter(prediction =>
            entry.longTermConsequences.some(actual =>
              actual.description.toLowerCase().includes(prediction.toLowerCase())
            )
          ).length;
          correctPredictions += matchingPredictions;
        }
      });

      // Calculate satisfaction from reflections
      ledger.playerReflections.forEach(reflection => {
        totalSatisfaction += reflection.satisfaction;
        satisfactionCount++;
      });

      // Identify common patterns
      const commonPatterns = this.identifyDecisionPatterns(entries);

      return {
        totalDecisions: entries.length,
        decisionsByCategory,
        decisionsByUrgency,
        decisionsByScope,
        averageImpact: totalImpact / entries.length,
        averageSatisfaction: satisfactionCount > 0 ? totalSatisfaction / satisfactionCount : 0,
        commonPatterns,
        consequenceAccuracy: totalPredictions > 0 ? correctPredictions / totalPredictions : 0
      };
    } catch (error) {
      Logger.error('Failed to analyze decision patterns', error);
      return this.getEmptyAnalytics();
    }
  }

  /**
   * Generate narrative references to past decisions
   */
  static generateDecisionReferences(
    currentContext: string,
    mission: GenerationalMission
  ): string[] {
    try {
      const ledger = this.getLedger();
      const relevantDecisions = this.findRelevantDecisions(currentContext, ledger.entries);

      return relevantDecisions.map(entry => {
        const timeAgo = mission.currentYear - entry.year;
        const generationAgo = Math.floor(timeAgo / 25);

        if (generationAgo === 0) {
          return `The recent decision to ${entry.decision.choice} still influences current events.`;
        } else if (generationAgo === 1) {
          return `The previous generation's choice to ${entry.decision.choice} echoes in today's challenges.`;
        } else {
          return `${generationAgo} generations ago, ancestors chose to ${entry.decision.choice}, setting the stage for current circumstances.`;
        }
      });
    } catch (error) {
      Logger.error('Failed to generate decision references', error);
      return [];
    }
  }

  /**
   * Get consequence chain for a specific decision
   */
  static getConsequenceChain(decisionId: string): ConsequenceChain | null {
    try {
      const ledger = this.getLedger();
      return ledger.consequenceChains.find(chain => chain.originDecisionId === decisionId) || null;
    } catch (error) {
      Logger.error('Failed to get consequence chain', error);
      return null;
    }
  }

  /**
   * Export decision ledger for chronicle
   */
  static exportDecisionLedger(): DecisionLedger {
    return this.getLedger();
  }

  /**
   * Import decision ledger from chronicle
   */
  static importDecisionLedger(ledger: DecisionLedger): void {
    try {
      this.saveLedger(ledger);
      this.currentLedger = ledger;

      Logger.info('Decision ledger imported', {
        entryCount: ledger.entries.length,
        chainCount: ledger.consequenceChains.length
      });
    } catch (error) {
      Logger.error('Failed to import decision ledger', error);
      throw error;
    }
  }

  // Private helper methods

  private static getLedger(): DecisionLedger {
    if (!this.currentLedger) {
      this.currentLedger = this.loadLedger();
    }
    return this.currentLedger;
  }

  private static loadLedger(): DecisionLedger {
    try {
      const stored = localStorage.getItem(this.DECISION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      Logger.error('Failed to load decision ledger', error);
    }

    return {
      entries: [],
      consequenceChains: [],
      playerReflections: []
    };
  }

  private static saveLedger(ledger: DecisionLedger): void {
    try {
      localStorage.setItem(this.DECISION_STORAGE_KEY, JSON.stringify(ledger));
      this.currentLedger = ledger;
    } catch (error) {
      Logger.error('Failed to save decision ledger', error);
      throw error;
    }
  }

  private static addToLedger(entry: DecisionEntry): void {
    const ledger = this.getLedger();
    ledger.entries.push(entry);
    this.saveLedger(ledger);
  }

  private static findReferencedDecisions(
    decision: DecisionInput,
    mission: GenerationalMission
  ): string[] {
    const ledger = this.getLedger();
    const references: string[] = [];

    // Find decisions in the same category within recent years
    const recentDecisions = ledger.entries.filter(entry =>
      entry.decision.category === decision.category &&
      mission.currentYear - entry.year <= 50 // Within 50 years
    );

    // Add the most impactful recent decision as a reference
    const mostImpactful = recentDecisions.sort((a, b) => b.chronicleImpact - a.chronicleImpact)[0];
    if (mostImpactful) {
      references.push(mostImpactful.id);
    }

    return references;
  }

  private static calculateChronicleWeight(
    decision: DecisionInput,
    mission: GenerationalMission
  ): number {
    let weight = 0.5; // Base weight

    // Increase weight based on urgency
    switch (decision.urgency) {
      case 'immediate': weight += 0.3; break;
      case 'urgent': weight += 0.2; break;
      case 'moderate': weight += 0.1; break;
      case 'routine': break;
    }

    // Increase weight based on scope
    switch (decision.scope) {
      case 'civilization': weight += 0.4; break;
      case 'legacy': weight += 0.3; break;
      case 'dynasty': weight += 0.2; break;
      case 'cohort': weight += 0.1; break;
      case 'individual': break;
    }

    // Increase weight based on number of predicted long-term effects
    weight += decision.predictedLongTermEffects.length * 0.05;

    // Increase weight if it affects multiple resource types
    const resourceTypes = decision.immediateConsequences
      .filter(c => c.type === 'resource')
      .map(c => c.affectedTargets)
      .flat();
    weight += new Set(resourceTypes).size * 0.02;

    return Math.min(1.0, weight);
  }

  private static calculateLegacyAlignment(
    decision: DecisionInput,
    mission: GenerationalMission
  ): Record<LegacyTypeType, number> {
    const alignment: Record<LegacyTypeType, number> = {
      preservers: 0,
      adaptors: 0,
      wanderers: 0
    };

    // Simple alignment calculation based on decision category and choice
    // In a real implementation, this would be more sophisticated
    switch (decision.category) {
      case 'cultural':
        alignment.preservers = 0.8;
        alignment.adaptors = -0.2;
        break;
      case 'exploration':
        alignment.wanderers = 0.8;
        alignment.preservers = -0.2;
        break;
      case 'resource':
        alignment.adaptors = 0.6;
        break;
    }

    // Adjust based on mission's current legacy
    const currentLegacy = mission.legacy;
    alignment[currentLegacy] += 0.3;

    return alignment;
  }

  private static generateDecisionContext(
    decision: DecisionInput,
    mission: GenerationalMission
  ): string {
    return `During ${mission.currentPhase} phase of year ${mission.currentYear}, facing ${decision.urgency} ${decision.category} decision affecting ${decision.scope} level.`;
  }

  private static extractResourceChanges(consequences: ImmediateConsequence[]): Record<string, number> {
    const changes: Record<string, number> = {};

    consequences
      .filter(c => c.type === 'resource')
      .forEach(c => {
        c.affectedTargets.forEach(target => {
          changes[target] = (changes[target] || 0) + (c.magnitude * 100); // Scale magnitude
        });
      });

    return changes;
  }

  private static initializeConsequenceChain(entry: DecisionEntry): void {
    const ledger = this.getLedger();

    const chain: ConsequenceChain = {
      originDecisionId: entry.id,
      chainEvents: [{
        year: entry.year,
        description: `Decision made: ${entry.decision.choice}`,
        severity: 'minor',
        references: [entry.id]
      }],
      stillActive: true,
      finalOutcome: null
    };

    ledger.consequenceChains.push(chain);
    this.saveLedger(ledger);
  }

  private static updateChronicleWeight(entry: DecisionEntry, consequence: LongTermEffect): void {
    // Increase chronicle weight based on the severity of actual consequences
    const weightIncrease = {
      'minor': 0.05,
      'moderate': 0.1,
      'major': 0.2,
      'civilization-defining': 0.4
    }[consequence.severity];

    entry.chronicleImpact = Math.min(1.0, entry.chronicleImpact + weightIncrease);
    entry.decision.chronicleWeight = entry.chronicleImpact;
  }

  private static identifyDecisionPatterns(entries: DecisionEntry[]): DecisionPattern[] {
    const patterns: Map<string, DecisionPattern> = new Map();

    entries.forEach(entry => {
      const patternKey = `${entry.decision.category}_${entry.decision.urgency}`;

      if (!patterns.has(patternKey)) {
        patterns.set(patternKey, {
          pattern: `${entry.decision.category} decisions with ${entry.decision.urgency} urgency`,
          frequency: 0,
          outcomes: [],
          averageImpact: 0,
          playerSatisfaction: 0
        });
      }

      const pattern = patterns.get(patternKey)!;
      pattern.frequency++;
      pattern.outcomes.push(entry.decision.choice);
      pattern.averageImpact += entry.chronicleImpact;
    });

    // Convert to array and calculate averages
    return Array.from(patterns.values()).map(pattern => ({
      ...pattern,
      averageImpact: pattern.averageImpact / pattern.frequency,
      // Player satisfaction would be calculated from reflections in a real implementation
      playerSatisfaction: 3.5 // Placeholder
    })).sort((a, b) => b.frequency - a.frequency);
  }

  private static findRelevantDecisions(context: string, entries: DecisionEntry[]): DecisionEntry[] {
    const contextLower = context.toLowerCase();

    // Find decisions with similar context or category keywords
    const relevant = entries.filter(entry => {
      const entryContext = `${entry.decision.title} ${entry.decision.description} ${entry.decision.category}`.toLowerCase();
      return entryContext.split(' ').some(word => contextLower.includes(word) && word.length > 3);
    });

    // Sort by impact and recency
    return relevant
      .sort((a, b) => (b.chronicleImpact + (100 - b.year) / 1000) - (a.chronicleImpact + (100 - a.year) / 1000))
      .slice(0, 3); // Return top 3 most relevant
  }

  private static getEmptyAnalytics(): DecisionAnalytics {
    return {
      totalDecisions: 0,
      decisionsByCategory: {
        resource: 0,
        population: 0,
        cultural: 0,
        diplomatic: 0,
        crisis: 0,
        exploration: 0,
        legacy: 0
      },
      decisionsByUrgency: {
        immediate: 0,
        urgent: 0,
        moderate: 0,
        routine: 0
      },
      decisionsByScope: {
        individual: 0,
        cohort: 0,
        dynasty: 0,
        legacy: 0,
        civilization: 0
      },
      averageImpact: 0,
      averageSatisfaction: 0,
      commonPatterns: [],
      consequenceAccuracy: 0
    };
  }

  private static generateDecisionId(): string {
    return `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}