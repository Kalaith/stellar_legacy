// types/pacing.ts
export class PacingState {
  currentPhase!: GamePhase;
  phaseProgress!: number; // 0-1 through current phase
  phaseStartYear!: number;

  // Timing Control
  timeAcceleration!: number; // Multiplier for year progression
  eventDensity!: number; // Events per year
  interactionDensity!: number; // Required player interactions per year

  // Player Engagement
  lastPlayerInteraction!: number; // Game timestamp
  interactionHistory!: InteractionEvent[];
  engagementScore!: number; // 0-1, rolling average
  automationLevel!: number; // How much is automated

  // Narrative Flow
  tensionLevel!: number; // 0-1, current narrative tension
  nextMilestone!: PlannedMilestone | null;
  emergentEventQueue!: EmergentEvent[];

  // Adaptive Elements
  playerPreferences!: PacingPreferences;
  adaptiveSettings!: AdaptiveSettings;
  pacingMetrics!: PacingMetrics;
}

export type GamePhase = 'early' | 'mid' | 'late' | 'arrival' | 'post-mission';

export class InteractionEvent {
  timestamp!: number;
  type!: 'decision' | 'exploration' | 'crisis' | 'milestone' | 'configuration';
  duration!: number; // How long player spent on this
  complexity!: number; // How complex the interaction was
  satisfaction!: number | null; // Player rating if available
}

export class PlannedMilestone {
  id!: string;
  type!: 'authored' | 'emergent';
  scheduledYear!: number;
  title!: string;
  description!: string;

  // Milestone Content
  content!: MilestoneContent;
  choices!: MilestoneChoice[];
  requirements!: string[];

  // Adaptive Scheduling
  flexibility!: number; // How much the timing can be adjusted
  priority!: number; // How important this milestone is
  dependsOn!: string[]; // Other milestones this requires
}

export class MilestoneContent {
  narrative!: string;
  context!: ContextReference[];
  visuals!: string[];
  mood!: 'hopeful' | 'tense' | 'celebratory' | 'somber' | 'mysterious';
}

export class ContextReference {
  type!: 'decision' | 'outcome' | 'character' | 'event';
  source!: 'current-mission' | 'chronicle' | 'universal';
  target!: string;
  description!: string;
}

export class MilestoneChoice {
  id!: string;
  text!: string;
  description!: string;
  consequences!: MilestoneConsequence[];
  pacingImpact!: PacingImpact;
}

export class MilestoneConsequence {
  type!: 'immediate' | 'long-term' | 'chronicle';
  description!: string;
  effects!: unknown[]; // Flexible effect system
  narrativeWeight!: number;
}

export class PacingImpact {
  tensionChange!: number; // How this affects narrative tension
  phaseAcceleration!: number; // How this affects phase progression
  eventModifier!: number; // How this affects future event frequency
  engagementExpectation!: number; // Expected player engagement change
}

export class PacingPreferences {
  preferredSpeed!: 'slow' | 'medium' | 'fast' | 'adaptive';
  crisisHandling!: 'immediate' | 'guided' | 'automated';
  milestoneFrequency!: 'frequent' | 'moderate' | 'sparse';
  narrativeStyle!: 'detailed' | 'concise' | 'minimal';

  // Advanced Preferences
  automationThreshold!: number; // When to increase automation
  interactionBudget!: number; // Hours per week player expects to spend
  contentPreferences!: ContentPreferences;
}

export class ContentPreferences {
  dynastyFocus!: number; // 0-1, how much to focus on dynasty content
  legacyFocus!: number; // 0-1, how much to focus on legacy content
  explorationFocus!: number; // 0-1, how much to focus on exploration
  culturalFocus!: number; // 0-1, how much to focus on cultural elements

  contentComplexity!: 'simple' | 'moderate' | 'complex';
  narrativeDepth!: 'surface' | 'moderate' | 'deep';
  choiceConsequences!: 'immediate' | 'mixed' | 'long-term';
}

export class AdaptiveSettings {
  learningRate!: number; // How quickly to adapt to player behavior
  sensitivityThreshold!: number; // How much change triggers adaptation
  stabilityPeriod!: number; // How long to wait before major changes
  overrideHistory!: PlayerOverride[]; // Recent player overrides
}

export class PlayerOverride {
  timestamp!: number;
  type!: 'speed' | 'automation' | 'event_density' | 'milestone_timing';
  oldValue!: unknown;
  newValue!: unknown;
  reason!: string; // Why the player made this change
}

export class PacingMetrics {
  averageEngagement!: number; // Rolling average engagement score
  interactionFrequency!: number; // Interactions per hour
  satisfactionRating!: number; // Player satisfaction with pacing
  automationEfficiency!: number; // How well automation works
  narrativeCoherence!: number; // How well paced the story feels
  adaptationSuccess!: number; // How well the system adapts to player
}

// Emergent Event System
export class EmergentEvent {
  id!: string;
  sourceSystem!: 'dynasty' | 'legacy' | 'population' | 'external';
  emergenceFactors!: string[]; // What conditions led to this event
  adaptiveNarrative!: string; // Dynamically generated based on current state
  priority!: number; // How urgent this event is
  triggerConditions!: EmergentTriggerCondition[];
  scheduledYear!: number;
  flexibility!: number; // How much timing can be adjusted
}

export class EmergentTriggerCondition {
  type!: 'resource' | 'population' | 'relationship' | 'time' | 'random';
  target!: string;
  threshold!: number;
  probability!: number;
  description!: string;
}

// Phase Management
export class PhaseTransition {
  fromPhase!: GamePhase;
  toPhase!: GamePhase;
  triggerConditions!: PhaseTransitionCondition[];
  narrative!: string;
  effects!: PhaseTransitionEffect[];
  playerNotification!: boolean;
}

export class PhaseTransitionCondition {
  type!: 'year' | 'mission_progress' | 'population' | 'resource' | 'event';
  target!: string;
  operator!: 'greater' | 'less' | 'equals' | 'contains';
  value!: unknown;
  weight!: number; // How important this condition is
}

export class PhaseTransitionEffect {
  type!:
    | 'time_acceleration'
    | 'event_density'
    | 'automation_level'
    | 'milestone_schedule';
  magnitude!: number;
  duration!: 'permanent' | 'phase' | 'temporary';
  description!: string;
}

// Time Management
export class TimeControlState {
  isPaused!: boolean;
  currentAcceleration!: number;
  targetAcceleration!: number;
  accelerationLimits!: AccelerationLimits;
  pauseReasons!: PauseReason[];
  resumeConditions!: ResumeCondition[];
}

export class AccelerationLimits {
  minimum!: number;
  maximum!: number;
  crisisLimit!: number; // Max acceleration during crisis
  playerOverrideLimit!: number; // Max when player takes control
  automationLimit!: number; // Max during automation
}

export class PauseReason {
  type!: 'player_decision' | 'crisis' | 'milestone' | 'error' | 'manual';
  description!: string;
  priority!: number;
  timestamp!: number;
  autoResumable!: boolean;
}

export class ResumeCondition {
  type!: 'player_action' | 'time_elapsed' | 'condition_met' | 'automatic';
  description!: string;
  checkInterval!: number; // How often to check this condition
  expiresAt!: number | null; // When this condition expires
}

// Player Engagement Tracking
export class EngagementAnalysis {
  currentLevel!: EngagementLevel;
  trend!: 'increasing' | 'stable' | 'decreasing';
  factors!: EngagementFactor[];
  predictions!: EngagementPrediction[];
  recommendations!: EngagementRecommendation[];
}

export type EngagementLevel =
  | 'very_low'
  | 'low'
  | 'moderate'
  | 'high'
  | 'very_high';

export class EngagementFactor {
  type!: 'positive' | 'negative' | 'neutral';
  factor!: string;
  weight!: number; // How much this affects engagement
  description!: string;
  trend!: 'increasing' | 'stable' | 'decreasing';
}

export class EngagementPrediction {
  timeframe!: number; // Minutes into the future
  predictedLevel!: EngagementLevel;
  confidence!: number; // 0-1, how confident in this prediction
  factors!: string[]; // What factors this prediction is based on
}

export class EngagementRecommendation {
  type!: 'pacing' | 'content' | 'automation' | 'milestone';
  priority!: 'low' | 'medium' | 'high' | 'critical';
  action!: string;
  expectedEffect!: string;
  risks!: string[];
  timeToEffect!: number; // How long until this takes effect
}

// Automation and AI Control
export class AutomationPolicy {
  category!: string; // What type of decisions this covers
  automationLevel!: number; // 0-1, how much to automate
  playerApprovalRequired!: boolean;
  escalationConditions!: EscalationCondition[];
  fallbackBehavior!: string; // What to do if automation fails
}

export class EscalationCondition {
  type!:
    | 'resource_threshold'
    | 'population_crisis'
    | 'external_threat'
    | 'uncertainty';
  threshold!: unknown;
  response!: 'pause' | 'notify' | 'reduce_automation' | 'emergency_protocol';
  description!: string;
}

// Narrative Flow Management
export class NarrativeFlow {
  currentArc!: NarrativeArc;
  tension!: TensionCurve;
  themes!: ActiveTheme[];
  pacingBeats!: PacingBeat[];
  coherenceScore!: number; // 0-1, how coherent the narrative feels
}

export class NarrativeArc {
  id!: string;
  name!: string;
  startYear!: number;
  estimatedEndYear!: number;
  themes!: string[];
  keyMoments!: string[];
  resolution!: string | null;
}

export class TensionCurve {
  currentLevel!: number; // 0-1
  targetLevel!: number; // Where tension should be
  peakMoments!: number[]; // Years where tension should peak
  relaxationPeriods!: number[]; // Years where tension should drop
  rateCurve!: number[]; // How tension changes over time
}

export class ActiveTheme {
  name!: string;
  weight!: number; // How prominent this theme is
  introduction!: number; // Year introduced
  development!: string[]; // How it's being developed
  resolution!: string | null; // How it might be resolved
}

export class PacingBeat {
  year!: number;
  type!: 'action' | 'reflection' | 'revelation' | 'transition' | 'climax';
  intensity!: number; // 0-1
  duration!: number; // How long this beat lasts
  followUp!: string | null; // What happens next
}
