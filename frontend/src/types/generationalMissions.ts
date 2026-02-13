// types/generationalMissions.ts
import type {
  LegacyTypeType,
  CohortTypeType,
  MissionObjectiveType,
  MissionPhaseType,
  EventCategoryType,
  ShipClassType,
  ShipSizeType,
} from './enums';

// Core Cohort System - Abstract Population Management
export class PopulationCohort {
  type!: CohortTypeType;
  count!: number;
  effectiveness!: number;
  generation!: number;
  specialTraits!: string[];
  morale!: number;
}

// Dynasty System - Named Characters for Narrative Continuity
export class StoryThread {
  id!: string;
  title!: string;
  description!: string;
  isActive!: boolean;
  generationsActive!: number;
}

export class DynastyMember {
  id!: string;
  name!: string;
  age!: number;
  role!: string;
  skills!: Record<string, number>;
  traits!: string[];
  isLeader!: boolean;
}

export class Dynasty {
  id!: string;
  name!: string;
  familyLine!: string;
  currentLeader!: DynastyMember;
  members!: DynastyMember[];
  influence!: number;
  specialization!: string;
  legacyTraits!: string[];
  storyThreads!: StoryThread[];
  generationsActive!: number;
}

// Population System with Abstraction
export class Population {
  total!: number;
  cohorts!: PopulationCohort[];
  dynasties!: Dynasty[];

  // Social Metrics
  morale!: number;
  unity!: number;
  stability!: number;

  // Legacy-Specific Metrics
  legacyLoyalty!: number;
  adaptationLevel!: number;
  culturalDrift!: number;

  // Demographics
  birthRate!: number;
  deathRate!: number;
  avgAge!: number;
}

// Extended Resources for Generational Missions
export class ExtendedResources {
  // Basic Resources (existing)
  credits!: number;
  energy!: number;
  minerals!: number;
  food!: number;
  influence!: number;

  // Generational Mission Resources
  population!: number;
  morale!: number;
  unity!: number;
  knowledge!: number;
  technology!: number;
  culturalDrift!: number;
  adaptationLevel!: number;

  // Ship Resources
  hullIntegrity!: number;
  lifeSupport!: number;
  fuel!: number;
  spareParts!: number;

  // Mission-Specific
  missionProgress!: number;
  extractedResources!: number;
  researchData!: number;
  geneticSamples!: number;
}

// Automation and Delegation Systems
export class DelegationRule {
  id!: string;
  category!: string;
  condition!: string;
  action!: string;
  isActive!: boolean;
  dynastyResponsible!: string | null;
}

export class CouncilMember {
  dynastyId!: string;
  role!: string;
  authority!: string[];
  performance!: number;
  autonomyLevel!: number; // How much can act without player approval
}

export class AutomationConfig {
  resourceThresholds!: Record<string, number>;
  crisisEscalationRules!: DelegationRule[];
  councilMembers!: CouncilMember[];
  delegationRules!: DelegationRule[];
  emergencyProtocols!: Record<string, string>;
}

// Mission Event System
export class MissionEvent {
  id!: string;
  title!: string;
  description!: string;
  category!: EventCategoryType;

  // Event Mechanics
  requiresPlayerDecision!: boolean;
  autoResolutionDelay!: number; // hours before auto-resolve
  possibleOutcomes!: EventOutcome[];

  // Context
  affectedCohorts!: string[];
  affectedDynasties!: string[];
  legacySpecific!: LegacyTypeType | null;

  // Timing
  triggeredAt!: number;
  resolvedAt!: number | null;
  generation!: number;
}

export class EventOutcome {
  id!: string;
  title!: string;
  description!: string;

  // Effects
  resourceChanges!: Partial<ExtendedResources>;
  populationEffects!: PopulationEffect[];
  longTermConsequences!: string[];

  // Requirements
  requirements!: string[];
  legacyModifiers!: Record<LegacyTypeType, number>;
}

export class PopulationEffect {
  cohortType!: CohortTypeType;
  effectType!: 'count' | 'effectiveness' | 'morale' | 'traits';
  magnitude!: number;
  description!: string;
}

// Generational Ship Configuration
export class GenerationalShip {
  id!: string;
  name!: string;
  class!: ShipClassType;
  size!: ShipSizeType;
  populationCapacity!: number;

  // Current State
  currentPopulation!: number;
  hullIntegrity!: number;
  systemsEfficiency!: number;

  // Legacy Modifications
  legacyModifications!: LegacyModification[];

  // Automation Systems
  aiSystems!: string[];
  automationLevel!: number;
}

export class LegacyModification {
  id!: string;
  name!: string;
  legacy!: LegacyTypeType;
  description!: string;
  effects!: Record<string, number>;
  unlockRequirements!: string[];
}

// Backwards compatibility alias
export class SectModification extends LegacyModification {
  constructor() {
    super();
    // Map legacy to sect for compatibility
    Object.defineProperty(this, 'sect', {
      get() {
        return this.legacy;
      },
      set(value) {
        this.legacy = value;
      },
    });
  }
}

// Mission System
export class GenerationalMission {
  id!: string;
  name!: string;
  legacy!: LegacyTypeType;

  // Mission Parameters
  objective!: MissionObjectiveType;
  targetSystemId!: string;
  estimatedDuration!: number; // years
  currentYear!: number;

  // Ship and Population
  ship!: GenerationalShip;
  population!: Population;

  // Resources and Production
  resources!: ExtendedResources;
  productionRates!: Partial<ExtendedResources>;

  // Mission Progress
  currentPhase!: MissionPhaseType;
  phaseProgress!: number; // 0-100%
  milestones!: Milestone[];

  // Events and History
  activeEvents!: MissionEvent[];
  eventHistory!: MissionEvent[];

  // Automation
  automationConfig!: AutomationConfig;
  lastPlayerInteraction!: number;

  // Success/Failure Tracking
  successMetrics!: SuccessMetric[];
  failureRisks!: FailureRisk[];

  // Victory Conditions
  isCompleted!: boolean;
  successLevel!: 'complete' | 'partial' | 'pyrrhic' | 'failure' | null;
  finalRewards!: Partial<ExtendedResources>;
}

export class Milestone {
  id!: string;
  name!: string;
  description!: string;
  phase!: MissionPhaseType;
  isCompleted!: boolean;
  completedAt!: number | null;
  rewards!: Partial<ExtendedResources>;
}

export class SuccessMetric {
  id!: string;
  name!: string;
  currentValue!: number;
  targetValue!: number;
  weight!: number; // How important this metric is to overall success
}

export class FailureRisk {
  id!: string;
  name!: string;
  probability!: number;
  severity!: number;
  mitigation!: string[];
  isActive!: boolean;
}

// Legacy Relations and Cultural Evolution
export class LegacyRelation {
  fromLegacy!: LegacyTypeType;
  toLegacy!: LegacyTypeType;
  relationship!: number; // -100 to 100
  recentEvents!: string[];
  tradeAgreements!: TradeAgreement[];
}

// Backwards compatibility alias
export class SectRelation extends LegacyRelation {
  fromSect!: LegacyTypeType;
  toSect!: LegacyTypeType;
  constructor() {
    super();
    Object.defineProperty(this, 'fromSect', {
      get() {
        return this.fromLegacy;
      },
      set(value) {
        this.fromLegacy = value;
      },
    });
    Object.defineProperty(this, 'toSect', {
      get() {
        return this.toLegacy;
      },
      set(value) {
        this.toLegacy = value;
      },
    });
  }
}

export class TradeAgreement {
  id!: string;
  resource!: string;
  amount!: number;
  price!: number;
  duration!: number;
}

export class CulturalEvolution {
  legacy!: LegacyTypeType;
  baselineDeviation!: number;
  majorChanges!: CulturalChange[];
  currentTrends!: string[];
}

export class CulturalChange {
  id!: string;
  name!: string;
  description!: string;
  impact!: number;
  generation!: number;
  isPermanent!: boolean;
}

// AI Decision Making for Automation
export class AIDecision {
  id!: string;
  category!: string;
  decision!: string;
  reasoning!: string;
  confidence!: number;
  timestamp!: number;
  wasOverridden!: boolean;
  outcome!: string | null;
}

export class AIPerformance {
  category!: string;
  successRate!: number;
  playerOverrideRate!: number;
  averageConfidence!: number;
  recentDecisions!: AIDecision[];
}
