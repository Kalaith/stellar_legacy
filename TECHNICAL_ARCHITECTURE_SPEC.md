# Stellar Legacy: Technical Architecture Specification

## Overview

This document provides detailed technical specifications for implementing the narrative agency and pacing systems outlined in the Narrative Implementation Plan. It focuses on TypeScript definitions, store modifications, service architectures, and component specifications needed to support the Chronicle System, Legacy Decks, and dynamic pacing mechanisms.

## New TypeScript Type Definitions

### Chronicle System Types

```typescript
// types/chronicle.ts
import type { LegacyTypeType, MissionPhaseType, EventCategoryType } from './enums';
import type { ExtendedResources, LegacyRelation } from './generationalMissions';

export interface Chronicle {
  id: string;
  version: string; // For migration compatibility
  playerName: string;
  createdAt: Date;
  lastUpdated: Date;
  entries: ChronicleEntry[];
  galaxyState: GalaxyState;
  playerLegacy: PlayerLegacyHistory;
}

export interface ChronicleEntry {
  missionId: string;
  missionName: string;
  missionNumber: number; // Sequential mission counter
  startedAt: Date;
  completedAt: Date;
  realDuration: number; // Real-world hours played
  
  // Mission Parameters
  startingLegacy: LegacyTypeType;
  targetSystem: string;
  estimatedDuration: number; // Mission years
  actualDuration: number; // Actual mission years
  
  // Mission Outcome
  successLevel: SuccessLevel;
  dominantLegacy: LegacyTypeType;
  populationOutcome: PopulationOutcome;
  settlementResult: SettlementResult | null;
  
  // Player Choices
  keyDecisions: ChronicleDecision[];
  decisionMetrics: DecisionMetrics;
  
  // Final State
  finalResources: ExtendedResources;
  finalPopulation: PopulationSnapshot;
  culturalState: CulturalSnapshot;
  legacyRelationships: LegacyRelation[];
  
  // Generated Artifacts
  artifacts: ChronicleArtifact[];
  discoveries: Discovery[];
  legacyEvolution: LegacyEvolution[];
  
  // Performance Metrics
  playerEngagement: EngagementMetrics;
  aiPerformance: AIPerformanceSnapshot;
}

export type SuccessLevel = 'complete' | 'partial' | 'pyrrhic' | 'failure' | 'abandoned';
export type PopulationOutcome = 'thrived' | 'survived' | 'diminished' | 'transformed' | 'extinct';

export interface ChronicleDecision {
  id: string;
  title: string;
  description: string;
  context: string;
  year: number;
  generation: number;
  phase: MissionPhaseType;
  
  // Decision Details
  category: DecisionCategory;
  choice: string;
  alternatives: string[];
  urgency: DecisionUrgency;
  scope: DecisionScope;
  
  // Impact Assessment
  immediateConsequences: ImmediateConsequence[];
  predictedLongTermEffects: string[];
  actualLongTermEffects: LongTermEffect[]; // Filled in over time
  
  // Context References
  referencedDecisions: string[]; // IDs of previous decisions this references
  chronicleWeight: number; // How much this decision influences future chronicles (0-1)
  legacyAlignment: Record<LegacyTypeType, number>; // How much each legacy approved (-1 to 1)
}

export type DecisionCategory = 'resource' | 'population' | 'cultural' | 'diplomatic' | 'crisis' | 'exploration' | 'legacy';
export type DecisionUrgency = 'immediate' | 'urgent' | 'moderate' | 'routine';
export type DecisionScope = 'individual' | 'cohort' | 'dynasty' | 'legacy' | 'civilization';

export interface ImmediateConsequence {
  type: 'resource' | 'population' | 'relationship' | 'event';
  description: string;
  magnitude: number; // -1 to 1, where 1 is very positive
  affectedTargets: string[];
}

export interface LongTermEffect {
  manifestYear: number;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'civilization-defining';
  chainReaction: boolean; // Did this cause other effects?
  playerPredicted: boolean; // Did the player anticipate this?
}

export interface ChronicleArtifact {
  id: string;
  name: string;
  type: ArtifactType;
  description: string;
  origin: ArtifactOrigin;
  
  // Gameplay Effects
  heritageModifiers: HeritageModifier[];
  deckCards: LegacyCardTemplate[];
  unlockConditions: string[];
  
  // Narrative Elements
  flavorText: string;
  discoveryNarrative: string;
  legacySignificance: Record<LegacyTypeType, number>;
}

export type ArtifactType = 'technology' | 'cultural' | 'genetic' | 'historical' | 'philosophical' | 'artistic';

export interface ArtifactOrigin {
  sourceDecision: string | null;
  sourceEvent: string | null;
  sourceGeneration: number;
  circumstances: string;
}

export interface Discovery {
  id: string;
  name: string;
  type: 'scientific' | 'historical' | 'resource' | 'anomaly' | 'contact';
  description: string;
  location: string;
  year: number;
  significance: number; // 0-1, how important this discovery is
  
  // Impact
  resourceValue: Partial<ExtendedResources>;
  knowledgeValue: number;
  culturalImpact: string[];
  futureImplications: string[];
}

export interface LegacyEvolution {
  legacy: LegacyTypeType;
  originalTraits: string[];
  evolvedTraits: string[];
  deviationMagnitude: number; // How far from baseline
  evolutionTriggers: string[]; // What caused the evolution
  stabilityRating: number; // How stable this evolution is
}
```

### Heritage Modifier System

```typescript
// types/heritage.ts
export interface HeritageModifier {
  id: string;
  name: string;
  description: string;
  source: HeritageSource;
  tier: HeritageTier;
  
  // Mechanical Effects
  resourceModifiers: ResourceModifier[];
  populationModifiers: PopulationModifier[];
  eventModifiers: EventModifier[];
  technologyModifiers: TechnologyModifier[];
  
  // Narrative Effects
  startingNarrative: NarrativeElement[];
  availableChoices: string[];
  restrictedActions: string[];
  narrativeReferences: NarrativeReference[];
  
  // Conditions
  applicabilityConditions: string[];
  mutuallyExclusive: string[]; // Cannot be used with these other modifiers
  prerequisites: string[];
  
  // Metadata
  playerRating: number; // Player's rating of this modifier
  usageCount: number;
  effectivenessRating: number; // How impactful this has been
}

export interface HeritageSource {
  chronicleId: string;
  missionNumber: number;
  sourceType: 'decision' | 'outcome' | 'artifact' | 'discovery' | 'evolution';
  specificSource: string; // ID of the specific source
  generationContext: string;
}

export type HeritageTier = 'minor' | 'moderate' | 'major' | 'legendary';

export interface ResourceModifier {
  resource: keyof ExtendedResources;
  type: 'flat' | 'percentage' | 'multiplier';
  value: number;
  condition: string | null; // When this modifier applies
  duration: 'permanent' | 'early-game' | 'crisis-only' | 'conditional';
}

export interface PopulationModifier {
  target: 'all' | 'cohort' | 'dynasty' | 'legacy';
  targetSpecific: string | null; // Specific cohort/dynasty/legacy if applicable
  attribute: 'count' | 'effectiveness' | 'morale' | 'loyalty' | 'skills';
  effect: number; // Magnitude of effect
  description: string;
}

export interface EventModifier {
  eventCategory: EventCategoryType | 'all';
  specificEvents: string[]; // Specific event IDs if not category-wide
  probabilityModifier: number; // Multiplier for event occurrence
  outcomeModifiers: OutcomeModifier[];
  newEventUnlocks: string[]; // New events this modifier makes possible
}

export interface OutcomeModifier {
  outcomeType: string;
  modifier: number; // Bonus/penalty to this outcome
  description: string;
}

export interface TechnologyModifier {
  technologyArea: string;
  researchBonus: number;
  unlockConditions: string[];
  restrictedTechs: string[];
  description: string;
}

export interface NarrativeElement {
  text: string;
  references: string[]; // What this text refers to from past chronicles
  context: string; // When/how this appears
  variability: string[]; // Alternative versions for variety
}

export interface NarrativeReference {
  targetElement: string; // What in the current mission this refers to
  referencedChronicle: string;
  referencedElement: string; // What from the past chronicle
  connectionType: 'direct' | 'parallel' | 'contrast' | 'evolution';
  narrativeTemplate: string; // How to construct the reference text
}
```

### Legacy Deck System

```typescript
// types/legacyDecks.ts
export interface LegacyDeck {
  legacy: LegacyTypeType;
  cards: LegacyCard[];
  activeCards: string[]; // Cards currently in play
  discardPile: string[];
  
  // Deck Composition
  baseCards: string[]; // Always present in this legacy's deck
  chronicleCards: string[]; // Added from chronicle history
  customCards: string[]; // Player-created or modified
  
  // Deck Statistics
  totalPlays: number;
  averageImpact: number;
  playerSatisfaction: number;
  balanceRating: number;
  
  // Curation Settings
  playerFilters: DeckFilter[];
  cardRatings: Record<string, number>;
  disabledCards: string[];
}

export interface LegacyCard {
  id: string;
  name: string;
  type: CardType;
  legacy: LegacyTypeType;
  tier: CardTier;
  
  // Card Content
  title: string;
  description: string;
  flavorText: string;
  artwork: string | null;
  
  // Gameplay Mechanics
  triggerConditions: CardTrigger[];
  effects: CardEffect[];
  choices: CardChoice[];
  duration: CardDuration;
  
  // Chronicle Integration
  originChronicle: string | null;
  originSource: string | null; // Specific decision/outcome that created this
  generationCreated: number;
  
  // Balancing
  weight: number; // Likelihood of appearing (0-1)
  impact: CardImpact;
  balanceMetrics: CardBalanceMetrics;
  
  // Player Interaction
  timesPlayed: number;
  playerChoices: Record<string, number>; // Which choices players make
  playerRating: number;
  effectiveness: number; // How impactful this card has been
}

export type CardType = 'event' | 'bonus' | 'crisis' | 'opportunity' | 'memory' | 'tradition';
export type CardTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CardDuration = 'instant' | 'temporary' | 'permanent' | 'generational';

export interface CardTrigger {
  id: string;
  condition: TriggerCondition;
  probability: number; // Base probability (modified by weight)
  phase: MissionPhaseType | 'any';
  prerequisites: string[];
  cooldown: number; // Minimum years between triggers
}

export interface TriggerCondition {
  type: 'resource' | 'population' | 'event' | 'year' | 'decision' | 'relationship';
  target: string;
  operator: 'equals' | 'greater' | 'less' | 'contains' | 'not';
  value: any;
  description: string;
}

export interface CardEffect {
  id: string;
  type: 'resource' | 'population' | 'relationship' | 'event' | 'narrative';
  target: string;
  magnitude: number;
  duration: CardDuration;
  description: string;
  
  // Advanced Effects
  scaling: EffectScaling | null;
  conditions: string[];
  side_effects: CardEffect[];
}

export interface EffectScaling {
  scalesWith: string; // What the effect scales with
  scalingFactor: number;
  maximumEffect: number;
  description: string;
}

export interface CardChoice {
  id: string;
  text: string;
  description: string;
  
  // Requirements
  requirements: ChoiceRequirement[];
  costs: Partial<ExtendedResources>;
  
  // Effects
  immediateEffects: CardEffect[];
  longTermEffects: LongTermEffect[];
  chronicleConsequence: ChronicleConsequence;
  
  // Narrative
  outcomeText: string;
  legacyReaction: Record<LegacyTypeType, LegacyReaction>;
}

export interface ChoiceRequirement {
  type: 'resource' | 'population' | 'technology' | 'relationship' | 'legacy';
  target: string;
  condition: string;
  description: string;
}

export interface ChronicleConsequence {
  weight: number; // How much this affects future chronicles
  type: 'artifact' | 'modifier' | 'relationship' | 'reputation' | 'tradition';
  description: string;
  futureReferences: string[];
}

export interface LegacyReaction {
  approval: number; // -1 to 1
  relationshipChange: number;
  comment: string;
}
```

### Pacing System Types

```typescript
// types/pacing.ts
export interface PacingState {
  currentPhase: GamePhase;
  phaseProgress: number; // 0-1 through current phase
  phaseStartYear: number;
  
  // Timing Control
  timeAcceleration: number; // Multiplier for year progression
  eventDensity: number; // Events per year
  interactionDensity: number; // Required player interactions per year
  
  // Player Engagement
  lastPlayerInteraction: number; // Game timestamp
  interactionHistory: InteractionEvent[];
  engagementScore: number; // 0-1, rolling average
  automationLevel: number; // How much is automated
  
  // Narrative Flow
  tensionLevel: number; // 0-1, current narrative tension
  nextMilestone: PlannedMilestone | null;
  emergentEventQueue: EmergentEvent[];
  
  // Adaptive Elements
  playerPreferences: PacingPreferences;
  adaptiveSettings: AdaptiveSettings;
  pacingMetrics: PacingMetrics;
}

export type GamePhase = 'early' | 'mid' | 'late' | 'arrival' | 'post-mission';

export interface InteractionEvent {
  timestamp: number;
  type: 'decision' | 'exploration' | 'crisis' | 'milestone' | 'configuration';
  duration: number; // How long player spent on this
  complexity: number; // How complex the interaction was
  satisfaction: number | null; // Player rating if available
}

export interface PlannedMilestone {
  id: string;
  type: 'authored' | 'emergent';
  scheduledYear: number;
  title: string;
  description: string;
  
  // Milestone Content
  content: MilestoneContent;
  choices: MilestoneChoice[];
  requirements: string[];
  
  // Adaptive Scheduling
  flexibility: number; // How much the timing can be adjusted
  priority: number; // How important this milestone is
  dependsOn: string[]; // Other milestones this requires
}

export interface MilestoneContent {
  narrative: string;
  context: ContextReference[];
  visuals: string[];
  mood: 'hopeful' | 'tense' | 'celebratory' | 'somber' | 'mysterious';
}

export interface ContextReference {
  type: 'decision' | 'outcome' | 'character' | 'event';
  source: 'current-mission' | 'chronicle' | 'universal';
  target: string;
  description: string;
}

export interface MilestoneChoice {
  id: string;
  text: string;
  description: string;
  consequences: MilestoneConsequence[];
  pacingImpact: PacingImpact;
}

export interface MilestoneConsequence {
  type: 'immediate' | 'long-term' | 'chronicle';
  description: string;
  effects: any[]; // Flexible effect system
  narrativeWeight: number;
}

export interface PacingImpact {
  tensionChange: number; // How this affects narrative tension
  phaseAcceleration: number; // How this affects phase progression
  eventModifier: number; // How this affects future event frequency
  engagementExpectation: number; // Expected player engagement change
}

export interface PacingPreferences {
  preferredSpeed: 'slow' | 'medium' | 'fast' | 'adaptive';
  crisisHandling: 'immediate' | 'guided' | 'automated';
  milestoneFrequency: 'frequent' | 'moderate' | 'sparse';
  narrativeStyle: 'detailed' | 'concise' | 'minimal';
  
  // Advanced Preferences
  automationThreshold: number; // When to increase automation
  interactionBudget: number; // Hours per week player expects to spend
  contentPreferences: ContentPreferences;
}

export interface ContentPreferences {
  dynastyFocus: number; // 0-1, how much to focus on dynasty content
  legacyFocus: number; // 0-1, how much to focus on legacy content  
  explorationFocus: number; // 0-1, how much to focus on exploration
  culturalFocus: number; // 0-1, how much to focus on cultural elements
  
  contentComplexity: 'simple' | 'moderate' | 'complex';
  narrativeDepth: 'surface' | 'moderate' | 'deep';
  choiceConsequences: 'immediate' | 'mixed' | 'long-term';
}
```

## Store Architecture Modifications

### Enhanced Game Store

```typescript
// stores/useGameStore.ts - Additional interfaces
interface EnhancedGameStore extends GameStore {
  // Chronicle Management
  chronicle: Chronicle | null;
  currentChronicleEntry: Partial<ChronicleEntry>;
  heritageModifiers: HeritageModifier[];
  selectedHeritageModifiers: string[];
  
  // Legacy Deck System
  legacyDecks: Record<LegacyTypeType, LegacyDeck>;
  activeCards: LegacyCard[];
  pendingCardChoices: PendingCardChoice[];
  
  // Pacing System
  pacingState: PacingState;
  pacingRules: PacingRules;
  
  // Decision Tracking
  decisionLedger: DecisionLedger;
  consequenceChains: ConsequenceChain[];
  
  // Actions
  // Chronicle Actions
  loadChronicle: (chronicleId: string) => Promise<void>;
  saveChronicleEntry: () => Promise<void>;
  applyHeritageModifiers: (modifierIds: string[]) => void;
  exportChronicle: () => string;
  importChronicle: (chronicleData: string) => Promise<void>;
  
  // Deck Actions
  triggerLegacyCard: (cardId: string) => void;
  makeCardChoice: (cardId: string, choiceId: string) => void;
  rateCard: (cardId: string, rating: number) => void;
  customizeCard: (cardId: string, modifications: CardModification[]) => void;
  
  // Pacing Actions
  adjustPacing: (settings: Partial<PacingPreferences>) => void;
  forceMilestone: (milestoneId: string) => void;
  overrideAutomation: () => void;
  skipToNextEvent: () => void;
  
  // Decision Actions
  recordDecision: (decision: DecisionInput) => void;
  reviewDecisionHistory: (filters: DecisionFilter[]) => DecisionEntry[];
  trackConsequence: (decisionId: string, consequence: LongTermEffect) => void;
}
```

### New Store Implementations

```typescript
// stores/useChronicleStore.ts
interface ChronicleStore {
  chronicles: Chronicle[];
  currentChronicle: Chronicle | null;
  heritageLibrary: HeritageModifier[];
  
  // Actions
  createNewChronicle: (playerName: string) => Chronicle;
  loadChronicle: (id: string) => Promise<Chronicle>;
  saveChronicle: (chronicle: Chronicle) => Promise<void>;
  deleteChronicle: (id: string) => Promise<void>;
  
  // Heritage Management
  generateHeritageModifiers: (entry: ChronicleEntry) => HeritageModifier[];
  applyHeritageModifiers: (modifiers: HeritageModifier[]) => void;
  filterHeritageModifiers: (criteria: HeritageCriteria) => HeritageModifier[];
  
  // Export/Import
  exportChronicle: (id: string) => string;
  importChronicle: (data: string) => Promise<Chronicle>;
  
  // Analytics
  getChronicleStats: (id: string) => ChronicleStatistics;
  getPlayerProgress: () => PlayerProgress;
}

// stores/useLegacyDeckStore.ts
interface LegacyDeckStore {
  decks: Record<LegacyTypeType, LegacyDeck>;
  cardTemplates: LegacyCardTemplate[];
  activeCards: LegacyCard[];
  
  // Deck Management
  initializeDecks: (heritage: HeritageModifier[]) => void;
  addChronicleCards: (cards: LegacyCardTemplate[]) => void;
  customizeCard: (cardId: string, modifications: CardModification[]) => void;
  
  // Card Triggering
  checkCardTriggers: (gameState: GameState) => LegacyCard[];
  triggerCard: (cardId: string) => CardTriggerResult;
  resolveCardChoice: (cardId: string, choiceId: string) => void;
  
  // Balance and Curation
  updateCardWeights: () => void;
  playerCuration: (cardId: string, action: CurationAction) => void;
  generateBalanceReport: () => DeckBalanceReport;
}

// stores/usePacingStore.ts
interface PacingStore {
  state: PacingState;
  rules: PacingRules;
  milestones: PlannedMilestone[];
  
  // Phase Management
  updatePhase: (newPhase: GamePhase, context: PhaseContext) => void;
  calculatePhaseProgress: () => number;
  schedulePhaseTransition: (transition: PhaseTransition) => void;
  
  // Time Control
  setTimeAcceleration: (multiplier: number) => void;
  pauseTime: () => void;
  resumeTime: () => void;
  skipToNextEvent: () => void;
  
  // Milestone Management
  scheduleMilestone: (milestone: PlannedMilestone) => void;
  triggerMilestone: (milestoneId: string) => void;
  adaptMilestoneSchedule: (factors: AdaptationFactor[]) => void;
  
  // Player Engagement
  recordInteraction: (interaction: InteractionEvent) => void;
  calculateEngagement: () => number;
  adaptToEngagement: () => void;
  
  // Automation
  increaseAutomation: (category: string) => void;
  decreaseAutomation: (category: string) => void;
  overrideAutomation: () => void;
}
```

## Service Layer Architecture

### Core Services

```typescript
// services/ChronicleService.ts
export class ChronicleService {
  static async saveChronicleEntry(entry: ChronicleEntry): Promise<void>;
  static async loadChronicle(id: string): Promise<Chronicle>;
  static generateHeritageModifiers(entry: ChronicleEntry): HeritageModifier[];
  static validateChronicleData(data: any): ValidationResult;
  static migrateChronicleVersion(data: any, targetVersion: string): Chronicle;
  static exportChronicle(chronicle: Chronicle): string;
  static importChronicle(data: string): Promise<Chronicle>;
  
  // Analytics
  static calculateChronicleMetrics(chronicle: Chronicle): ChronicleMetrics;
  static generateProgressReport(chronicles: Chronicle[]): ProgressReport;
  static identifyNarrativePatterns(chronicles: Chronicle[]): NarrativePattern[];
}

// services/LegacyDeckService.ts
export class LegacyDeckService {
  static generateCardFromChronicle(entry: ChronicleEntry): LegacyCardTemplate[];
  static balanceCardWeights(deck: LegacyDeck): LegacyDeck;
  static checkTriggerConditions(card: LegacyCard, gameState: GameState): boolean;
  static resolveCardEffects(card: LegacyCard, choice: CardChoice): EffectResult[];
  
  // Card Generation
  static createCardFromDecision(decision: ChronicleDecision): LegacyCardTemplate;
  static createCardFromOutcome(outcome: any): LegacyCardTemplate;
  static createCardFromArtifact(artifact: ChronicleArtifact): LegacyCardTemplate;
  
  // Balance Management
  static calculateCardImpact(card: LegacyCard): CardImpactMetrics;
  static adjustCardForBalance(card: LegacyCard, metrics: DeckBalanceMetrics): LegacyCard;
  static generateBalanceReport(deck: LegacyDeck): DeckBalanceReport;
}

// services/PacingService.ts
export class PacingService {
  static calculateOptimalPacing(state: GameState, preferences: PacingPreferences): PacingConfiguration;
  static scheduleNextMilestone(state: PacingState): PlannedMilestone;
  static adaptToPlayerBehavior(interactions: InteractionEvent[]): PacingAdjustments;
  static generateEmergentEvents(state: GameState): EmergentEvent[];
  
  // Phase Management
  static checkPhaseTransition(state: PacingState): PhaseTransition | null;
  static calculatePhaseProgress(state: GameState): number;
  static adaptPhaseForEngagement(state: PacingState): PacingState;
  
  // Time Control
  static calculateTimeAcceleration(state: GameState): number;
  static shouldPauseForInteraction(event: any): boolean;
  static estimateInteractionTime(event: any): number;
}

// services/NarrativeService.ts
export class NarrativeService {
  static generateNarrativeText(template: string, context: NarrativeContext): string;
  static createDecisionReference(decision: ChronicleDecision, currentContext: any): string;
  static generateMilestoneNarrative(milestone: PlannedMilestone, gameState: GameState): string;
  static createConsequenceNarrative(consequence: LongTermEffect): string;
  
  // Reference System
  static findRelevantDecisions(context: any, chronicle: Chronicle): ChronicleDecision[];
  static createContextualReference(decision: ChronicleDecision, currentSituation: any): string;
  static generateVariableText(template: string, variables: Record<string, any>): string;
  
  // Quality Assurance
  static validateNarrativeCoherence(text: string, context: NarrativeContext): boolean;
  static ensureReferenceAccuracy(reference: string, chronicle: Chronicle): boolean;
  static generateAlternativeText(originalText: string): string[];
}
```

## Component Architecture

### New Component Categories

```typescript
// components/chronicle/
export interface ChronicleComponents {
  ChronicleViewer: React.ComponentType<ChronicleViewerProps>;
  HeritageSelector: React.ComponentType<HeritageSelectorProps>;
  DecisionLedger: React.ComponentType<DecisionLedgerProps>;
  ConsequenceChain: React.ComponentType<ConsequenceChainProps>;
  GalaxyTimeline: React.ComponentType<GalaxyTimelineProps>;
  ChronicleExporter: React.ComponentType<ChronicleExporterProps>;
}

// components/pacing/
export interface PacingComponents {
  TimeController: React.ComponentType<TimeControllerProps>;
  PhaseIndicator: React.ComponentType<PhaseIndicatorProps>;
  MilestoneDisplay: React.ComponentType<MilestoneDisplayProps>;
  EngagementMeter: React.ComponentType<EngagementMeterProps>;
  AutomationPanel: React.ComponentType<AutomationPanelProps>;
  PacingPreferences: React.ComponentType<PacingPreferencesProps>;
}

// components/legacydecks/
export interface LegacyDeckComponents {
  CardDisplay: React.ComponentType<CardDisplayProps>;
  DeckViewer: React.ComponentType<DeckViewerProps>;
  CardChoice: React.ComponentType<CardChoiceProps>;
  DeckCustomizer: React.ComponentType<DeckCustomizerProps>;
  CardGenerator: React.ComponentType<CardGeneratorProps>;
  BalanceReport: React.ComponentType<BalanceReportProps>;
}
```

### Integration Components

```typescript
// components/integration/
export interface IntegrationComponents {
  NarrativePanel: React.ComponentType<NarrativePanelProps>; // Shows contextual narrative
  DecisionContext: React.ComponentType<DecisionContextProps>; // Shows how current decision relates to past
  ConsequencePreview: React.ComponentType<ConsequencePreviewProps>; // Hints at future effects
  LegacyImpactMeter: React.ComponentType<LegacyImpactMeterProps>; // Shows how choices affect each legacy
  TimelineNavigator: React.ComponentType<TimelineNavigatorProps>; // Navigate through mission history
  CrossMissionReference: React.ComponentType<CrossMissionReferenceProps>; // Links to other missions
}
```

## Data Persistence Strategy

### Storage Architecture

```typescript
// storage/ChronicleStorage.ts
export interface ChronicleStorage {
  save(chronicle: Chronicle): Promise<void>;
  load(id: string): Promise<Chronicle>;
  list(): Promise<ChronicleMetadata[]>;
  delete(id: string): Promise<void>;
  export(id: string): Promise<string>;
  import(data: string): Promise<Chronicle>;
  
  // Advanced Operations
  search(criteria: SearchCriteria): Promise<Chronicle[]>;
  backup(): Promise<BackupData>;
  restore(backup: BackupData): Promise<void>;
  migrate(from: string, to: string): Promise<void>;
}

// storage/LocalChronicleStorage.ts
export class LocalChronicleStorage implements ChronicleStorage {
  private readonly storageKey = 'stellar-legacy-chronicles';
  private readonly indexKey = 'stellar-legacy-chronicle-index';
  
  // Implementation using IndexedDB for large data
  // localStorage for metadata and small data
  // Compression for large chronicle files
}

// storage/CloudChronicleStorage.ts
export class CloudChronicleStorage implements ChronicleStorage {
  // Future implementation for cloud sync
  // Authentication integration
  // Sharing and collaboration features
}
```

### Migration System

```typescript
// migration/ChronicleVersionManager.ts
export class ChronicleVersionManager {
  static readonly CURRENT_VERSION = '2.0.0';
  
  static migrate(data: any, targetVersion: string): Chronicle {
    const currentVersion = data.version || '1.0.0';
    const migrations = this.getMigrationPath(currentVersion, targetVersion);
    
    return migrations.reduce((data, migration) => {
      return migration.migrate(data);
    }, data);
  }
  
  static getMigrationPath(from: string, to: string): Migration[] {
    // Return ordered list of migrations needed
  }
}

interface Migration {
  fromVersion: string;
  toVersion: string;
  migrate(data: any): any;
  rollback(data: any): any;
}
```

## Testing Strategy

### Test Categories

```typescript
// __tests__/chronicle/
describe('Chronicle System', () => {
  describe('ChronicleService', () => {
    test('generates heritage modifiers from mission outcomes');
    test('validates chronicle data integrity');
    test('handles chronicle version migration');
    test('exports and imports chronicle data correctly');
  });
  
  describe('Heritage Modifiers', () => {
    test('applies modifiers to new missions correctly');
    test('prevents conflicting modifiers');
    test('calculates cumulative effects properly');
  });
});

// __tests__/legacydecks/
describe('Legacy Deck System', () => {
  describe('Card Generation', () => {
    test('creates appropriate cards from chronicle entries');
    test('balances card weights correctly');
    test('maintains narrative coherence');
  });
  
  describe('Card Triggering', () => {
    test('evaluates trigger conditions accurately');
    test('respects card cooldowns and prerequisites');
    test('handles concurrent card triggers');
  });
});

// __tests__/pacing/
describe('Pacing System', () => {
  describe('Phase Management', () => {
    test('transitions between phases at appropriate times');
    test('adapts pacing to player behavior');
    test('maintains narrative tension');
  });
  
  describe('Milestone Scheduling', () => {
    test('schedules authored milestones appropriately');
    test('generates emergent events based on state');
    test('balances authored vs emergent content');
  });
});
```

### Integration Testing

```typescript
// __tests__/integration/
describe('System Integration', () => {
  test('chronicle entries generate appropriate deck cards');
  test('heritage modifiers affect pacing correctly');
  test('decision tracking creates proper narrative references');
  test('cross-mission state persistence works correctly');
  test('narrative coherence across multiple missions');
  
  describe('Performance', () => {
    test('chronicle data loading performance');
    test('deck card generation efficiency');
    test('pacing calculation response time');
    test('memory usage with large chronicles');
  });
});
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load chronicle data only when needed
2. **Incremental Updates**: Update chronicles incrementally during gameplay
3. **Data Compression**: Compress large chronicle files for storage
4. **Caching**: Cache frequently accessed chronicle data and generated content
5. **Background Processing**: Generate cards and consequences during idle time
6. **Memory Management**: Proper cleanup of old chronicle data
7. **Debounced Updates**: Batch decision tracking updates to prevent performance issues

### Memory Management

```typescript
// utils/MemoryManager.ts
export class ChronicleMemoryManager {
  private static cache = new Map<string, Chronicle>();
  private static readonly MAX_CACHE_SIZE = 5;
  
  static getCachedChronicle(id: string): Chronicle | null;
  static cacheChronicle(chronicle: Chronicle): void;
  static clearOldCaches(): void;
  static getMemoryUsage(): MemoryUsageReport;
}
```

This technical specification provides the detailed architecture needed to implement the narrative agency and pacing systems outlined in the implementation plan. The focus on TypeScript definitions, service architectures, and component specifications ensures that the development team has clear guidance for building these complex systems while maintaining code quality and performance.