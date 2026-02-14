// types/chronicle.ts
import type { LegacyTypeType, MissionPhaseType } from './enums';
import type { ExtendedResources, LegacyRelation } from './generationalMissions';

export class Chronicle {
  id!: string;
  version!: string; // For migration compatibility
  playerName!: string;
  createdAt!: Date;
  lastUpdated!: Date;
  entries!: ChronicleEntry[];
  galaxyState!: GalaxyState;
  playerLegacy!: PlayerLegacyHistory;
}

export class ChronicleEntry {
  missionId!: string;
  missionName!: string;
  missionNumber!: number; // Sequential mission counter
  startedAt!: Date;
  completedAt!: Date;
  realDuration!: number; // Real-world hours played

  // Mission Parameters
  startingLegacy!: LegacyTypeType;
  targetSystem!: string;
  estimatedDuration!: number; // Mission years
  actualDuration!: number; // Actual mission years

  // Mission Outcome
  successLevel!: SuccessLevel;
  dominantLegacy!: LegacyTypeType;
  populationOutcome!: PopulationOutcome;
  settlementResult!: SettlementResult | null;

  // Player Choices
  keyDecisions!: ChronicleDecision[];
  decisionMetrics!: DecisionMetrics;

  // Final State
  finalResources!: ExtendedResources;
  finalPopulation!: PopulationSnapshot;
  culturalState!: CulturalSnapshot;
  legacyRelationships!: LegacyRelation[];

  // Generated Artifacts
  artifacts!: ChronicleArtifact[];
  discoveries!: Discovery[];
  legacyEvolution!: LegacyEvolution[];

  // Performance Metrics
  playerEngagement!: EngagementMetrics;
  aiPerformance!: AIPerformanceSnapshot;
}

export type SuccessLevel = 'complete' | 'partial' | 'pyrrhic' | 'failure' | 'abandoned';
export type PopulationOutcome = 'thrived' | 'survived' | 'diminished' | 'transformed' | 'extinct';

export class ChronicleDecision {
  id!: string;
  title!: string;
  description!: string;
  context!: string;
  year!: number;
  generation!: number;
  phase!: MissionPhaseType;

  // Decision Details
  category!: DecisionCategory;
  choice!: string;
  alternatives!: string[];
  urgency!: DecisionUrgency;
  scope!: DecisionScope;

  // Impact Assessment
  immediateConsequences!: ImmediateConsequence[];
  predictedLongTermEffects!: string[];
  actualLongTermEffects!: LongTermEffect[]; // Filled in over time

  // Context References
  referencedDecisions!: string[]; // IDs of previous decisions this references
  chronicleWeight!: number; // How much this decision influences future chronicles (0-1)
  legacyAlignment!: Record<LegacyTypeType, number>; // How much each legacy approved (-1 to 1)
}

export type DecisionCategory =
  | 'resource'
  | 'population'
  | 'cultural'
  | 'diplomatic'
  | 'crisis'
  | 'exploration'
  | 'legacy';
export type DecisionUrgency = 'immediate' | 'urgent' | 'moderate' | 'routine';
export type DecisionScope = 'individual' | 'cohort' | 'dynasty' | 'legacy' | 'civilization';

export class ImmediateConsequence {
  type!: 'resource' | 'population' | 'relationship' | 'event';
  description!: string;
  magnitude!: number; // -1 to 1, where 1 is very positive
  affectedTargets!: string[];
}

export class LongTermEffect {
  manifestYear!: number;
  description!: string;
  severity!: 'minor' | 'moderate' | 'major' | 'civilization-defining';
  chainReaction!: boolean; // Did this cause other effects?
  playerPredicted!: boolean; // Did the player anticipate this?
}

export class ChronicleConsequence {
  type!: 'immediate' | 'delayed' | 'cascade';
  description!: string;
  impacts!: ImmediateConsequence[];
  futureEffects!: LongTermEffect[];
  severity!: 'minor' | 'moderate' | 'major' | 'civilization-defining';
}

export class ChronicleArtifact {
  id!: string;
  name!: string;
  type!: ArtifactType;
  description!: string;
  origin!: ArtifactOrigin;

  // Gameplay Effects
  heritageModifiers!: string[]; // References to HeritageModifier IDs
  deckCards!: string[]; // References to LegacyCardTemplate IDs
  unlockConditions!: string[];

  // Narrative Elements
  flavorText!: string;
  discoveryNarrative!: string;
  legacySignificance!: Record<LegacyTypeType, number>;
}

export type ArtifactType =
  | 'technology'
  | 'cultural'
  | 'genetic'
  | 'historical'
  | 'philosophical'
  | 'artistic';

export class ArtifactOrigin {
  sourceDecision!: string | null;
  sourceEvent!: string | null;
  sourceGeneration!: number;
  circumstances!: string;
}

export class Discovery {
  id!: string;
  name!: string;
  type!: 'scientific' | 'historical' | 'resource' | 'anomaly' | 'contact';
  description!: string;
  location!: string;
  year!: number;
  significance!: number; // 0-1, how important this discovery is

  // Impact
  resourceValue!: Partial<ExtendedResources>;
  knowledgeValue!: number;
  culturalImpact!: string[];
  futureImplications!: string[];
}

export class LegacyEvolution {
  legacy!: LegacyTypeType;
  originalTraits!: string[];
  evolvedTraits!: string[];
  deviationMagnitude!: number; // How far from baseline
  evolutionTriggers!: string[]; // What caused the evolution
  stabilityRating!: number; // How stable this evolution is
}

export class GalaxyState {
  exploredSystems!: string[];
  establishedColonies!: SettlementResult[];
  knownThreats!: string[];
  diplomaticRelations!: Record<string, number>;
  sharedKnowledge!: Discovery[];
}

export class PlayerLegacyHistory {
  preferredLegacy!: LegacyTypeType;
  legacyExperience!: Record<LegacyTypeType, number>;
  characteristicChoices!: string[];
  narrativePreferences!: NarrativePreferences;
}

export class NarrativePreferences {
  preferredComplexity!: 'simple' | 'moderate' | 'complex';
  decisionSpeed!: 'deliberate' | 'moderate' | 'quick';
  riskTolerance!: 'conservative' | 'balanced' | 'bold';
  contentFocus!: ContentFocus;
}

export class ContentFocus {
  exploration!: number; // 0-1
  diplomacy!: number; // 0-1
  technology!: number; // 0-1
  culture!: number; // 0-1
  survival!: number; // 0-1
}

export class SettlementResult {
  name!: string;
  location!: string;
  populationType!: 'pure-human' | 'adapted' | 'hybrid' | 'neo-human';
  culturalType!: 'preserver' | 'adaptor' | 'wanderer' | 'hybrid';
  status!: 'thriving' | 'struggling' | 'isolated' | 'lost' | 'transformed';
  influence!: number; // How much this settlement affects future missions
  establishedYear!: number;
  lastContact!: number;
}

export class DecisionMetrics {
  totalDecisions!: number;
  averageDecisionTime!: number; // seconds
  consensusRate!: number; // how often player chose popular option
  innovationRate!: number; // how often player chose unique options
  legacyConsistency!: Record<LegacyTypeType, number>; // how consistently player follows each legacy
}

export class PopulationSnapshot {
  total!: number;
  byLegacy!: Record<LegacyTypeType, number>;
  byCohort!: Record<string, number>;
  averageAge!: number;
  morale!: number;
  unity!: number;
  culturalDrift!: number;
}

export class CulturalSnapshot {
  dominantValues!: string[];
  emergentTraditions!: string[];
  languageEvolution!: string[];
  artStyles!: string[];
  religiousBeliefs!: string[];
  technicalPhilosophies!: string[];
}

export class EngagementMetrics {
  totalPlayTime!: number; // hours
  activeDecisionTime!: number; // hours spent actively making decisions
  automationUsage!: number; // percentage of time automated
  eventsTriggered!: number;
  eventsResolved!: number;
  playerInitiatedActions!: number;
  averageSessionLength!: number; // minutes
}

export class AIPerformanceSnapshot {
  decisionsAutomated!: number;
  playerOverrides!: number;
  successfulPredictions!: number;
  averageConfidence!: number; // 0-1
  learningProgress!: number; // how well AI adapted to player preferences
}

// Utility types for validation and processing
export interface ChronicleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ChronicleExportData {
  chronicle: Chronicle;
  metadata: {
    exportedAt: Date;
    version: string;
    checksum: string;
  };
}

export interface ChronicleSearchCriteria {
  legacyFilter?: LegacyTypeType[];
  successLevelFilter?: SuccessLevel[];
  timeRangeFilter?: {
    startDate: Date;
    endDate: Date;
  };
  textSearch?: string;
  minimumDuration?: number;
  maximumDuration?: number;
}

export interface ChronicleStatistics {
  totalMissions: number;
  totalPlayTime: number;
  successRate: number;
  favoriteSpaces: string[];
  mostUsedChoices: string[];
  legacyDistribution: Record<LegacyTypeType, number>;
  averageMissionDuration: number;
  decisionPatterns: Record<string, number>;
}
