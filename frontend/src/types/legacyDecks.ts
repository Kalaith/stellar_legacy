// types/legacyDecks.ts
import type { LegacyTypeType, MissionPhaseType } from './enums';
import type { ExtendedResources } from './generationalMissions';
import type { LongTermEffect, ChronicleConsequence } from './chronicle';

export class LegacyDeck {
  legacy!: LegacyTypeType;
  cards!: LegacyCard[];
  activeCards!: string[]; // Cards currently in play
  discardPile!: string[];

  // Deck Composition
  baseCards!: string[]; // Always present in this legacy's deck
  chronicleCards!: string[]; // Added from chronicle history
  customCards!: string[]; // Player-created or modified

  // Deck Statistics
  totalPlays!: number;
  averageImpact!: number;
  playerSatisfaction!: number;
  balanceRating!: number;

  // Curation Settings
  playerFilters!: DeckFilter[];
  cardRatings!: Record<string, number>;
  disabledCards!: string[];
}

export class LegacyCard {
  id!: string;
  name!: string;
  type!: CardType;
  legacy!: LegacyTypeType;
  tier!: CardTier;

  // Card Content
  title!: string;
  description!: string;
  flavorText!: string;
  artwork!: string | null;

  // Gameplay Mechanics
  triggerConditions!: CardTrigger[];
  effects!: CardEffect[];
  choices!: CardChoice[];
  duration!: CardDuration;

  // Chronicle Integration
  originChronicle!: string | null;
  originSource!: string | null; // Specific decision/outcome that created this
  generationCreated!: number;

  // Balancing
  weight!: number; // Likelihood of appearing (0-1)
  impact!: CardImpact;
  balanceMetrics!: CardBalanceMetrics;

  // Player Interaction
  timesPlayed!: number;
  playerChoices!: Record<string, number>; // Which choices players make
  playerRating!: number;
  effectiveness!: number; // How impactful this card has been
}

export type CardType = 'event' | 'bonus' | 'crisis' | 'opportunity' | 'memory' | 'tradition';
export type CardTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CardDuration = 'instant' | 'temporary' | 'permanent' | 'generational';

export class CardTrigger {
  id!: string;
  condition!: TriggerCondition;
  probability!: number; // Base probability (modified by weight)
  phase!: MissionPhaseType | 'any';
  prerequisites!: string[];
  cooldown!: number; // Minimum years between triggers
}

export class TriggerCondition {
  type!: 'resource' | 'population' | 'event' | 'year' | 'decision' | 'relationship';
  target!: string;
  operator!: 'equals' | 'greater' | 'less' | 'contains' | 'not';
  value!: any;
  description!: string;
}

export class CardEffect {
  id!: string;
  type!: 'resource' | 'population' | 'relationship' | 'event' | 'narrative';
  target!: string;
  magnitude!: number;
  duration!: CardDuration;
  description!: string;

  // Advanced Effects
  scaling!: EffectScaling | null;
  conditions!: string[];
  sideEffects!: CardEffect[];
}

export class EffectScaling {
  scalesWith!: string; // What the effect scales with
  scalingFactor!: number;
  maximumEffect!: number;
  description!: string;
}

export class CardChoice {
  id!: string;
  text!: string;
  description!: string;

  // Requirements
  requirements!: ChoiceRequirement[];
  costs!: Partial<ExtendedResources>;

  // Effects
  immediateEffects!: CardEffect[];
  longTermEffects!: LongTermEffect[];
  chronicleConsequence!: ChronicleConsequence;

  // Narrative
  outcomeText!: string;
  legacyReaction!: Record<LegacyTypeType, LegacyReaction>;
}

export class ChoiceRequirement {
  type!: 'resource' | 'population' | 'technology' | 'relationship' | 'legacy';
  target!: string;
  condition!: string;
  description!: string;
}

export class LegacyReaction {
  approval!: number; // -1 to 1
  relationshipChange!: number;
  comment!: string;
}

export type CardImpact = 'negligible' | 'minor' | 'moderate' | 'major' | 'game-changing';

export class CardBalanceMetrics {
  powerLevel!: number; // 0-1, how powerful this card is
  situationalUseful!: number; // 0-1, how often it's useful
  playerChoice!: number; // 0-1, how much agency it gives players
  narrativeWeight!: number; // 0-1, how much it affects story
  synergies!: string[]; // Cards that work well with this one
  counters!: string[]; // Cards that conflict with this one
}

// Deck Management
export class DeckFilter {
  name!: string;
  type!: 'include' | 'exclude';
  criteria!: FilterCriteria;
  isActive!: boolean;
}

export class FilterCriteria {
  cardTypes!: CardType[];
  tiers!: CardTier[];
  legacies!: LegacyTypeType[];
  sources!: string[]; // Chronicle sources
  impactLevels!: CardImpact[];
  playerRatingRange!: [number, number];
  customTags!: string[];
}

// Card Generation
export class LegacyCardTemplate {
  id!: string;
  name!: string;
  templateType!: 'decision_echo' | 'outcome_memory' | 'cultural_tradition' | 'crisis_preparation';
  generationRules!: CardGenerationRules;
  effectTemplates!: EffectTemplate[];
  narrativeTemplates!: NarrativeTemplate[];
  balancingRules!: BalancingRules;
}

export class CardGenerationRules {
  minimumDecisionWeight!: number;
  requiredElements!: string[]; // What must be present to generate
  excludedCombinations!: string[]; // What combinations are forbidden
  scalingFactors!: Record<string, number>;
  rarityCalculation!: RarityCalculation;
}

export class EffectTemplate {
  type!: CardEffect['type'];
  magnitudeFormula!: string; // Formula for calculating effect magnitude
  durationRules!: Record<string, CardDuration>;
  scalingRules!: EffectScaling | null;
}

export class NarrativeTemplate {
  title!: string;
  description!: string;
  flavorText!: string;
  variables!: string[]; // Variables to substitute
  conditions!: string[]; // When this template applies
}

export class BalancingRules {
  maxPowerLevel!: number;
  costFormula!: string; // How to calculate resource costs
  cooldownFormula!: string; // How to calculate trigger cooldowns
  tierAdjustments!: Record<CardTier, number>;
}

export class RarityCalculation {
  baseRarity!: CardTier;
  impactModifier!: number; // How much impact affects rarity
  uniquenessBonus!: number; // Bonus for unique circumstances
  playerPreferenceWeight!: number; // How much player history matters
}

// Card Interaction System
export interface CardTriggerResult {
  success: boolean;
  card: LegacyCard;
  triggeredBy: string; // What caused the trigger
  availableChoices: CardChoice[];
  context: string; // Narrative context for the trigger
}

export interface CardResolutionResult {
  chosenOption: CardChoice;
  immediateEffects: CardEffect[];
  futureEffects: LongTermEffect[];
  narrativeOutcome: string;
  legacyReactions: Record<LegacyTypeType, LegacyReaction>;
  chronicleUpdate: ChronicleConsequence;
}

// Deck Balancing and Analytics
export class DeckAnalytics {
  totalCards!: number;
  tierDistribution!: Record<CardTier, number>;
  typeDistribution!: Record<CardType, number>;
  averagePowerLevel!: number;
  averageUsage!: number;
  usageFrequency!: Record<string, number>;
  playerSatisfactionScores!: Record<string, number>;
  balanceIssues!: BalanceIssue[];
}

export class BalanceIssue {
  type!: 'overpowered' | 'underpowered' | 'too_frequent' | 'too_rare' | 'poor_narrative';
  cardId!: string;
  severity!: 'minor' | 'moderate' | 'major' | 'critical';
  description!: string;
  suggestedFix!: string;
  automaticFix!: boolean; // Can this be fixed automatically?
}

export interface DeckBalanceReport {
  overallScore: number; // 0-1, how balanced the deck is
  powerCurve: number[]; // Power distribution across tiers
  diversityScore: number; // How diverse the deck composition is
  playerEngagement: number; // How engaging players find the deck
  issues: BalanceIssue[];
  recommendations: string[];
}

// Player Curation
export type CurationAction = 'rate' | 'disable' | 'modify' | 'favorite' | 'report';

export interface CardModification {
  type: 'effect_magnitude' | 'trigger_condition' | 'narrative_text' | 'rarity_adjustment';
  target: string; // What part of the card to modify
  newValue: any; // New value
  reason: string; // Why the player made this change
}

export interface CustomCard extends LegacyCard {
  isCustom: true;
  baseCardId: string; // Original card this is based on
  modifications: CardModification[];
  createdBy: string; // Player identifier
  sharedWithCommunity: boolean;
}

// Deck Sharing and Community
export interface SharedDeck {
  id: string;
  name: string;
  description: string;
  legacy: LegacyTypeType;
  cards: (LegacyCard | CustomCard)[];
  creator: string;
  createdAt: Date;
  downloads: number;
  rating: number;
  tags: string[];
}

export interface CommunityCardRating {
  cardId: string;
  ratings: {
    fun: number; // 1-5
    balance: number; // 1-5
    narrative: number; // 1-5
    uniqueness: number; // 1-5
  };
  comments: string[];
  reportedIssues: string[];
}