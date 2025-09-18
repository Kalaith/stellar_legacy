// types/heritage.ts
import type { ExtendedResources } from './generationalMissions';
import type { LegacyTypeType, EventCategoryType } from './enums';

export class HeritageModifier {
  id!: string;
  name!: string;
  description!: string;
  source!: HeritageSource;
  tier!: HeritageTier;

  // Mechanical Effects
  resourceModifiers!: ResourceModifier[];
  populationModifiers!: PopulationModifier[];
  eventModifiers!: EventModifier[];
  technologyModifiers!: TechnologyModifier[];

  // Narrative Effects
  startingNarrative!: NarrativeElement[];
  availableChoices!: string[];
  restrictedActions!: string[];
  narrativeReferences!: NarrativeReference[];

  // Conditions
  applicabilityConditions!: string[];
  mutuallyExclusive!: string[]; // Cannot be used with these other modifiers
  prerequisites!: string[];

  // Metadata
  playerRating!: number; // Player's rating of this modifier
  usageCount!: number;
  effectivenessRating!: number; // How impactful this has been
}

export class HeritageSource {
  chronicleId!: string;
  missionNumber!: number;
  sourceType!: 'decision' | 'outcome' | 'artifact' | 'discovery' | 'evolution';
  specificSource!: string; // ID of the specific source
  generationContext!: string;
}

export type HeritageTier = 'minor' | 'moderate' | 'major' | 'legendary';

export class ResourceModifier {
  resource!: keyof ExtendedResources;
  type!: 'flat' | 'percentage' | 'multiplier';
  value!: number;
  condition!: string | null; // When this modifier applies
  duration!: 'permanent' | 'early-game' | 'crisis-only' | 'conditional';
}

export class PopulationModifier {
  target!: 'all' | 'cohort' | 'dynasty' | 'legacy';
  targetSpecific!: string | null; // Specific cohort/dynasty/legacy if applicable
  attribute!: 'count' | 'effectiveness' | 'morale' | 'loyalty' | 'skills';
  effect!: number; // Magnitude of effect
  description!: string;
}

export class EventModifier {
  eventCategory!: EventCategoryType | 'all';
  specificEvents!: string[]; // Specific event IDs if not category-wide
  probabilityModifier!: number; // Multiplier for event occurrence
  outcomeModifiers!: OutcomeModifier[];
  newEventUnlocks!: string[]; // New events this modifier makes possible
}

export class OutcomeModifier {
  outcomeType!: string;
  modifier!: number; // Bonus/penalty to this outcome
  description!: string;
}

export class TechnologyModifier {
  technologyArea!: string;
  researchBonus!: number;
  unlockConditions!: string[];
  restrictedTechs!: string[];
  description!: string;
}

export class NarrativeElement {
  text!: string;
  references!: string[]; // What this text refers to from past chronicles
  context!: string; // When/how this appears
  variability!: string[]; // Alternative versions for variety
}

export class NarrativeReference {
  targetElement!: string; // What in the current mission this refers to
  referencedChronicle!: string;
  referencedElement!: string; // What from the past chronicle
  connectionType!: 'direct' | 'parallel' | 'contrast' | 'evolution';
  narrativeTemplate!: string; // How to construct the reference text
}

// Heritage Application Results
export interface HeritageApplicationResult {
  appliedModifiers: HeritageModifier[];
  resourceChanges: Partial<ExtendedResources>;
  populationEffects: PopulationModifier[];
  narrativeContext: string[];
  warnings: string[]; // Conflicts or issues
}

// Heritage Selection Interface
export interface HeritageSelectionCriteria {
  maxModifiers?: number;
  tierLimits?: Partial<Record<HeritageTier, number>>;
  requiredSources?: HeritageSource['sourceType'][];
  excludeTypes?: string[];
  legacyAlignment?: LegacyTypeType;
}

export interface HeritageConflict {
  modifier1: string; // modifier ID
  modifier2: string; // modifier ID
  conflictType: 'mutually_exclusive' | 'resource_conflict' | 'narrative_inconsistency';
  severity: 'minor' | 'major' | 'critical';
  resolution: string; // How to resolve the conflict
}

// Heritage Templates for Generation
export interface HeritageTemplate {
  id: string;
  name: string;
  sourceTypes: HeritageSource['sourceType'][];
  requiredElements: string[]; // What must be present in source to generate this
  tier: HeritageTier;
  generationRules: HeritageGenerationRules;
}

export class HeritageGenerationRules {
  minimumChronicleWeight!: number; // Minimum decision weight to trigger
  requiredOutcomes!: string[]; // Required mission outcomes
  conflictingModifiers!: string[]; // Cannot exist with these modifiers
  scalingFactors!: Record<string, number>; // How effects scale with source strength
  narrativeTemplates!: string[]; // Available narrative templates
}

// Heritage Library Management
export interface HeritageLibrary {
  modifiers: HeritageModifier[];
  templates: HeritageTemplate[];
  playerCustomizations: Record<string, HeritageModifier>; // Player-modified versions
  generationHistory: HeritageGenerationRecord[];
}

export class HeritageGenerationRecord {
  chronicleId!: string;
  missionId!: string;
  generatedModifiers!: string[]; // IDs of generated modifiers
  sourceElements!: string[]; // What was used to generate them
  playerAccepted!: boolean;
  customizations!: string[]; // What the player changed
  timestamp!: Date;
}

// Modifier Combinations and Synergies
export interface ModifierSynergy {
  modifierIds: string[];
  synergyType: 'resource_boost' | 'narrative_enhancement' | 'unique_unlock';
  effect: string;
  magnitude: number;
  description: string;
}

export interface ModifierCombination {
  modifiers: HeritageModifier[];
  totalResourceEffect: Partial<ExtendedResources>;
  narrativeCoherence: number; // 0-1, how well the combination tells a story
  gameplayBalance: number; // 0-1, how balanced the combination is
  synergies: ModifierSynergy[];
  conflicts: HeritageConflict[];
}

// Analysis and Recommendation System
export interface HeritageRecommendation {
  modifier: HeritageModifier;
  relevanceScore: number; // 0-1, how relevant to current mission
  balanceScore: number; // 0-1, how balanced for gameplay
  narrativeScore: number; // 0-1, how well it fits the story
  playerPreferenceScore: number; // 0-1, how much player might like it
  reasoning: string[];
}

export interface HeritageAnalysis {
  availableModifiers: HeritageModifier[];
  recommendations: HeritageRecommendation[];
  bestCombinations: ModifierCombination[];
  warnings: string[];
  narrativeSummary: string;
}