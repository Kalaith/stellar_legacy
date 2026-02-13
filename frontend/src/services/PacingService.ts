// services/PacingService.ts
import type {
  PacingState,
  GamePhase,
  PlannedMilestone,
  EmergentEvent,
  InteractionEvent,
  PhaseTransition,
  PacingPreferences,
  EngagementAnalysis,
  EngagementLevel,
  EngagementFactor,
  EngagementPrediction,
  EngagementRecommendation,
  AutomationPolicy,
  PacingMetrics,
  AdaptiveSettings,
  EscalationCondition,
} from '../types/pacing';
import type { GenerationalMission } from '../types/generationalMissions';
import type { Chronicle } from '../types/chronicle';
import Logger from '../utils/logger';

interface PacingEventLike {
  urgency?: string;
  requiresPlayerDecision?: boolean;
  category?: string;
}

interface InteractionPatternAnalysis {
  averageEngagement: number;
  crisisOverload: boolean;
  boredom: boolean;
}

export class PacingService {
  private static readonly PACING_STORAGE_KEY = 'stellar-legacy-pacing-state';
  private static readonly DEFAULT_ACCELERATION = 1.0;
  private static readonly MAX_ACCELERATION = 10.0;
  private static readonly MIN_ACCELERATION = 0.1;

  /**
   * Calculate optimal pacing configuration for a mission
   */
  static calculateOptimalPacing(
    mission: GenerationalMission,
    preferences: PacingPreferences,
    chronicle?: Chronicle
  ): PacingState {
    try {
      const currentPhase = this.determineGamePhase(mission);
      const engagementScore = this.calculateEngagementScore(mission);

      const pacingState: PacingState = {
        currentPhase,
        phaseProgress: this.calculatePhaseProgress(mission, currentPhase),
        phaseStartYear: this.calculatePhaseStartYear(mission, currentPhase),

        // Timing Control
        timeAcceleration: this.calculateOptimalAcceleration(
          mission,
          preferences,
          engagementScore
        ),
        eventDensity: this.calculateEventDensity(
          mission,
          currentPhase,
          preferences
        ),
        interactionDensity: this.calculateInteractionDensity(
          preferences,
          engagementScore
        ),

        // Player Engagement
        lastPlayerInteraction: Date.now(),
        interactionHistory: [],
        engagementScore,
        automationLevel: this.calculateAutomationLevel(
          preferences,
          engagementScore
        ),

        // Narrative Flow
        tensionLevel: this.calculateNarrativeTension(mission, currentPhase),
        nextMilestone: this.scheduleNextMilestone(
          mission,
          currentPhase,
          chronicle
        ),
        emergentEventQueue: [],

        // Adaptive Elements
        playerPreferences: preferences,
        adaptiveSettings: this.createAdaptiveSettings(preferences),
        pacingMetrics: this.initializePacingMetrics(),
      };

      Logger.info('Optimal pacing calculated', {
        missionId: mission.id,
        phase: currentPhase,
        acceleration: pacingState.timeAcceleration,
        engagementScore,
      });

      return pacingState;
    } catch (error) {
      Logger.error('Failed to calculate optimal pacing', error);
      return this.createDefaultPacingState(preferences);
    }
  }

  /**
   * Schedule the next major milestone for the mission
   */
  static scheduleNextMilestone(
    mission: GenerationalMission,
    currentPhase: GamePhase,
    chronicle?: Chronicle
  ): PlannedMilestone | null {
    try {
      const milestones = this.generatePhaseMilestones(mission, currentPhase);

      // Add chronicle-influenced milestones
      if (chronicle) {
        const chronicleMilestones = this.generateChronicleInfluencedMilestones(
          mission,
          chronicle
        );
        milestones.push(...chronicleMilestones);
      }

      // Sort by priority and scheduled year
      milestones.sort((a, b) => {
        const priorityDiff = b.priority - a.priority;
        if (priorityDiff !== 0) return priorityDiff;
        return a.scheduledYear - b.scheduledYear;
      });

      const nextMilestone = milestones.find(
        m => m.scheduledYear > mission.currentYear
      );

      if (nextMilestone) {
        Logger.info('Next milestone scheduled', {
          missionId: mission.id,
          milestoneId: nextMilestone.id,
          scheduledYear: nextMilestone.scheduledYear,
        });
      }

      return nextMilestone || null;
    } catch (error) {
      Logger.error('Failed to schedule milestone', error);
      return null;
    }
  }

  /**
   * Adapt pacing based on player behavior patterns
   */
  static adaptToPlayerBehavior(
    currentState: PacingState,
    recentInteractions: InteractionEvent[]
  ): PacingState {
    try {
      const adaptedState = { ...currentState };

      // Analyze interaction patterns
      const analysis = this.analyzeInteractionPatterns(recentInteractions);

      // Adjust time acceleration based on engagement
      if (analysis.averageEngagement < 0.3) {
        adaptedState.timeAcceleration = Math.min(
          adaptedState.timeAcceleration * 1.5,
          this.MAX_ACCELERATION
        );
      } else if (analysis.averageEngagement > 0.8) {
        adaptedState.timeAcceleration = Math.max(
          adaptedState.timeAcceleration * 0.8,
          this.MIN_ACCELERATION
        );
      }

      // Adjust event density
      if (analysis.crisisOverload) {
        adaptedState.eventDensity *= 0.7;
      } else if (analysis.boredom) {
        adaptedState.eventDensity *= 1.3;
      }

      // Update automation level
      adaptedState.automationLevel = this.adaptAutomationLevel(
        adaptedState.automationLevel,
        analysis
      );

      // Update adaptive settings
      adaptedState.adaptiveSettings = this.updateAdaptiveSettings(
        adaptedState.adaptiveSettings,
        analysis
      );

      Logger.info('Pacing adapted to player behavior', {
        newAcceleration: adaptedState.timeAcceleration,
        newEventDensity: adaptedState.eventDensity,
        newAutomationLevel: adaptedState.automationLevel,
      });

      return adaptedState;
    } catch (error) {
      Logger.error('Failed to adapt pacing to player behavior', error);
      return currentState;
    }
  }

  /**
   * Generate emergent events based on current game state
   */
  static generateEmergentEvents(
    mission: GenerationalMission,
    pacingState: PacingState
  ): EmergentEvent[] {
    try {
      const events: EmergentEvent[] = [];

      // Dynasty-based emergent events
      const dynastyEvents = this.generateDynastyEmergentEvents(
        mission,
        pacingState
      );
      events.push(...dynastyEvents);

      // Legacy conflict events
      const legacyEvents = this.generateLegacyEmergentEvents(
        mission,
        pacingState
      );
      events.push(...legacyEvents);

      // Population-driven events
      const populationEvents = this.generatePopulationEmergentEvents(
        mission,
        pacingState
      );
      events.push(...populationEvents);

      // External events based on mission phase and state
      const externalEvents = this.generateExternalEmergentEvents(
        mission,
        pacingState
      );
      events.push(...externalEvents);

      // Sort by priority and urgency
      events.sort((a, b) => b.priority - a.priority);

      Logger.info('Generated emergent events', {
        missionId: mission.id,
        eventCount: events.length,
        phase: pacingState.currentPhase,
      });

      return events;
    } catch (error) {
      Logger.error('Failed to generate emergent events', error);
      return [];
    }
  }

  /**
   * Check if a phase transition should occur
   */
  static checkPhaseTransition(
    mission: GenerationalMission,
    pacingState: PacingState
  ): PhaseTransition | null {
    try {
      const transitions = this.getAvailablePhaseTransitions(
        pacingState.currentPhase
      );

      for (const transition of transitions) {
        if (
          this.evaluateTransitionConditions(transition, mission, pacingState)
        ) {
          Logger.info('Phase transition triggered', {
            missionId: mission.id,
            from: transition.fromPhase,
            to: transition.toPhase,
          });
          return transition;
        }
      }

      return null;
    } catch (error) {
      Logger.error('Failed to check phase transition', error);
      return null;
    }
  }

  /**
   * Calculate optimal time acceleration based on current state
   */
  static calculateTimeAcceleration(
    mission: GenerationalMission,
    pacingState: PacingState,
    preferences: PacingPreferences
  ): number {
    try {
      let acceleration = this.DEFAULT_ACCELERATION;

      // Base acceleration on phase
      const phaseAcceleration = this.getPhaseBaseAcceleration(
        pacingState.currentPhase
      );
      acceleration *= phaseAcceleration;

      // Adjust for player preferences
      const preferenceMultiplier =
        this.getPreferenceAccelerationMultiplier(preferences);
      acceleration *= preferenceMultiplier;

      // Adjust for engagement level
      const engagementMultiplier = this.getEngagementAccelerationMultiplier(
        pacingState.engagementScore
      );
      acceleration *= engagementMultiplier;

      // Adjust for active events
      if (mission.activeEvents.some(e => e.requiresPlayerDecision)) {
        acceleration = Math.min(acceleration, 0.5); // Slow down for important decisions
      }

      // Apply limits
      acceleration = Math.max(
        this.MIN_ACCELERATION,
        Math.min(this.MAX_ACCELERATION, acceleration)
      );

      Logger.debug('Time acceleration calculated', {
        missionId: mission.id,
        acceleration,
        factors: {
          phaseAcceleration,
          preferenceMultiplier,
          engagementMultiplier,
        },
      });

      return acceleration;
    } catch (error) {
      Logger.error('Failed to calculate time acceleration', error);
      return this.DEFAULT_ACCELERATION;
    }
  }

  /**
   * Determine if game should pause for player interaction
   */
  static shouldPauseForInteraction(
    event: PacingEventLike,
    pacingState: PacingState,
    automationPolicies: AutomationPolicy[]
  ): boolean {
    try {
      // Always pause for critical decisions
      if (event.urgency === 'critical' || event.requiresPlayerDecision) {
        return true;
      }

      // Check automation policies
      const applicablePolicy = automationPolicies.find(
        policy =>
          policy.category === event.category || policy.category === 'all'
      );

      if (applicablePolicy) {
        // Check if automation level allows handling this event
        if (
          applicablePolicy.automationLevel >= 0.8 &&
          !applicablePolicy.playerApprovalRequired
        ) {
          return false;
        }

        // Check escalation conditions
        const shouldEscalate = applicablePolicy.escalationConditions.some(
          condition =>
            this.evaluateEscalationCondition(condition, event, pacingState)
        );

        if (shouldEscalate) {
          return true;
        }
      }

      // Default behavior based on engagement
      if (pacingState.engagementScore < 0.3) {
        return false; // Player seems disengaged, handle automatically
      }

      if (pacingState.engagementScore > 0.8) {
        return true; // Player is highly engaged, involve them in decisions
      }

      // Medium engagement - pause for moderate+ importance events
      return event.importance >= 0.6;
    } catch (error) {
      Logger.error(
        'Failed to determine if should pause for interaction',
        error
      );
      return true; // Default to pausing for safety
    }
  }

  /**
   * Analyze player engagement and provide recommendations
   */
  static analyzePlayerEngagement(
    interactions: InteractionEvent[],
    pacingState: PacingState
  ): EngagementAnalysis {
    try {
      if (interactions.length === 0) {
        return this.getDefaultEngagementAnalysis();
      }

      const currentLevel = this.classifyEngagementLevel(
        pacingState.engagementScore
      );
      const trend = this.calculateEngagementTrend(interactions);
      const factors = this.identifyEngagementFactors(interactions, pacingState);
      const predictions = this.generateEngagementPredictions(
        interactions,
        pacingState
      );
      const recommendations = this.generateEngagementRecommendations(
        currentLevel,
        trend,
        factors
      );

      return {
        currentLevel,
        trend,
        factors,
        predictions,
        recommendations,
      };
    } catch (error) {
      Logger.error('Failed to analyze player engagement', error);
      return this.getDefaultEngagementAnalysis();
    }
  }

  /**
   * Save pacing state to storage
   */
  static async savePacingState(state: PacingState): Promise<void> {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(this.PACING_STORAGE_KEY, serialized);

      Logger.info('Pacing state saved', {
        phase: state.currentPhase,
        acceleration: state.timeAcceleration,
      });
    } catch (error) {
      Logger.error('Failed to save pacing state', error);
      throw error;
    }
  }

  /**
   * Load pacing state from storage
   */
  static async loadPacingState(): Promise<PacingState | null> {
    try {
      const stored = localStorage.getItem(this.PACING_STORAGE_KEY);
      if (!stored) return null;

      const state = JSON.parse(stored) as PacingState;

      Logger.info('Pacing state loaded', {
        phase: state.currentPhase,
        acceleration: state.timeAcceleration,
      });

      return state;
    } catch (error) {
      Logger.error('Failed to load pacing state', error);
      return null;
    }
  }

  // Private helper methods

  private static determineGamePhase(mission: GenerationalMission): GamePhase {
    const year = mission.currentYear;
    const estimatedDuration = mission.estimatedDuration;

    if (year < estimatedDuration * 0.2) return 'early';
    if (year < estimatedDuration * 0.8) return 'mid';
    if (year < estimatedDuration * 0.95) return 'late';
    if (mission.isCompleted) return 'post-mission';
    return 'arrival';
  }

  private static calculatePhaseProgress(
    mission: GenerationalMission,
    phase: GamePhase
  ): number {
    const year = mission.currentYear;
    const total = mission.estimatedDuration;

    switch (phase) {
      case 'early':
        return Math.min(1.0, year / (total * 0.2));
      case 'mid':
        return Math.min(1.0, (year - total * 0.2) / (total * 0.6));
      case 'late':
        return Math.min(1.0, (year - total * 0.8) / (total * 0.15));
      case 'arrival':
        return Math.min(1.0, (year - total * 0.95) / (total * 0.05));
      default:
        return 1.0;
    }
  }

  private static calculatePhaseStartYear(
    mission: GenerationalMission,
    phase: GamePhase
  ): number {
    const total = mission.estimatedDuration;

    switch (phase) {
      case 'early':
        return 0;
      case 'mid':
        return total * 0.2;
      case 'late':
        return total * 0.8;
      case 'arrival':
        return total * 0.95;
      default:
        return mission.currentYear;
    }
  }

  private static calculateEngagementScore(
    mission: GenerationalMission
  ): number {
    // Simple engagement calculation based on mission state
    // In a real implementation, this would consider interaction history
    let score = 0.5;

    // Increase engagement if there are active events
    if (mission.activeEvents.length > 0) {
      score += 0.2;
    }

    // Increase engagement if population is stable
    if (mission.population.morale > 70) {
      score += 0.1;
    }

    // Decrease engagement if resources are critically low
    if (mission.resources.food < 100 || mission.resources.energy < 100) {
      score -= 0.2;
    }

    return Math.max(0, Math.min(1, score));
  }

  private static calculateOptimalAcceleration(
    mission: GenerationalMission,
    preferences: PacingPreferences,
    engagementScore: number
  ): number {
    let acceleration = this.DEFAULT_ACCELERATION;

    // Adjust based on preferences
    switch (preferences.preferredSpeed) {
      case 'slow':
        acceleration *= 0.5;
        break;
      case 'fast':
        acceleration *= 2.0;
        break;
      case 'adaptive':
        acceleration *= 1.0 + engagementScore;
        break;
      default:
        break; // medium
    }

    // Slow down if there are urgent events
    if (mission.activeEvents.some(e => e.requiresPlayerDecision)) {
      acceleration *= 0.3;
    }

    return Math.max(
      this.MIN_ACCELERATION,
      Math.min(this.MAX_ACCELERATION, acceleration)
    );
  }

  private static calculateEventDensity(
    mission: GenerationalMission,
    phase: GamePhase,
    preferences: PacingPreferences
  ): number {
    let density = 1.0;

    // Adjust based on phase
    switch (phase) {
      case 'early':
        density = 0.8;
        break;
      case 'mid':
        density = 1.2;
        break;
      case 'late':
        density = 1.5;
        break;
      case 'arrival':
        density = 2.0;
        break;
      default:
        density = 1.0;
        break;
    }

    // Adjust based on preferences
    switch (preferences.milestoneFrequency) {
      case 'sparse':
        density *= 0.7;
        break;
      case 'frequent':
        density *= 1.4;
        break;
      default:
        break; // moderate
    }

    return density;
  }

  private static calculateInteractionDensity(
    preferences: PacingPreferences,
    engagementScore: number
  ): number {
    let density = 1.0;

    // Adjust based on automation threshold
    density *= 1.0 - preferences.automationThreshold;

    // Adjust based on engagement
    density *= 0.5 + engagementScore;

    return Math.max(0.1, Math.min(2.0, density));
  }

  private static calculateAutomationLevel(
    preferences: PacingPreferences,
    engagementScore: number
  ): number {
    let automation = preferences.automationThreshold;

    // Increase automation if engagement is low
    if (engagementScore < 0.3) {
      automation = Math.min(1.0, automation + 0.3);
    }

    // Decrease automation if engagement is high
    if (engagementScore > 0.8) {
      automation = Math.max(0.0, automation - 0.2);
    }

    return automation;
  }

  private static calculateNarrativeTension(
    mission: GenerationalMission,
    phase: GamePhase
  ): number {
    let tension = 0.5;

    // Increase tension based on active crises
    const crises = mission.activeEvents.filter(
      e => e.category === 'immediate_crisis'
    ).length;
    tension += crises * 0.2;

    // Adjust based on phase
    switch (phase) {
      case 'early':
        tension *= 0.7;
        break;
      case 'mid':
        tension *= 1.0;
        break;
      case 'late':
        tension *= 1.3;
        break;
      case 'arrival':
        tension *= 1.5;
        break;
    }

    // Adjust based on resource scarcity
    const resourceStress = this.calculateResourceStress(mission);
    tension += resourceStress * 0.3;

    return Math.max(0, Math.min(1, tension));
  }

  private static calculateResourceStress(mission: GenerationalMission): number {
    const resources = mission.resources;
    const critical = (['food', 'energy', 'fuel'] as const).map(
      resource => Math.max(0, 1 - resources[resource] / 1000) // Assuming 1000 is a comfortable level
    );

    return critical.reduce((sum, stress) => sum + stress, 0) / critical.length;
  }

  private static createAdaptiveSettings(
    _preferences: PacingPreferences
  ): AdaptiveSettings {
    return {
      learningRate: 0.1,
      sensitivityThreshold: 0.2,
      stabilityPeriod: 300, // 5 minutes
      overrideHistory: [],
    };
  }

  private static initializePacingMetrics(): PacingMetrics {
    return {
      averageEngagement: 0.5,
      interactionFrequency: 1.0,
      satisfactionRating: 0.5,
      automationEfficiency: 0.7,
      narrativeCoherence: 0.8,
      adaptationSuccess: 0.6,
    };
  }

  private static createDefaultPacingState(
    preferences: PacingPreferences
  ): PacingState {
    return {
      currentPhase: 'early',
      phaseProgress: 0,
      phaseStartYear: 0,
      timeAcceleration: this.DEFAULT_ACCELERATION,
      eventDensity: 1.0,
      interactionDensity: 1.0,
      lastPlayerInteraction: Date.now(),
      interactionHistory: [],
      engagementScore: 0.5,
      automationLevel: preferences.automationThreshold,
      tensionLevel: 0.3,
      nextMilestone: null,
      emergentEventQueue: [],
      playerPreferences: preferences,
      adaptiveSettings: this.createAdaptiveSettings(preferences),
      pacingMetrics: this.initializePacingMetrics(),
    };
  }

  private static generatePhaseMilestones(
    _mission: GenerationalMission,
    _phase: GamePhase
  ): PlannedMilestone[] {
    // Generate phase-appropriate milestones
    return [];
  }

  private static generateChronicleInfluencedMilestones(
    _mission: GenerationalMission,
    _chronicle: Chronicle
  ): PlannedMilestone[] {
    // Generate milestones influenced by chronicle history
    return [];
  }

  private static analyzeInteractionPatterns(
    interactions: InteractionEvent[]
  ): InteractionPatternAnalysis {
    const recentInteractions = interactions.slice(-10); // Last 10 interactions

    return {
      averageEngagement:
        recentInteractions.reduce(
          (sum, i) => sum + (i.satisfaction || 0.5),
          0
        ) / recentInteractions.length,
      crisisOverload:
        recentInteractions.filter(i => i.type === 'crisis').length > 5,
      boredom:
        recentInteractions.length < 3 &&
        Date.now() - recentInteractions[0]?.timestamp > 300000, // 5 minutes
    };
  }

  private static adaptAutomationLevel(
    currentLevel: number,
    analysis: InteractionPatternAnalysis
  ): number {
    if (analysis.crisisOverload) {
      return Math.min(1.0, currentLevel + 0.2);
    }
    if (analysis.boredom) {
      return Math.max(0.0, currentLevel - 0.1);
    }
    return currentLevel;
  }

  private static updateAdaptiveSettings(
    settings: AdaptiveSettings,
    _analysis: InteractionPatternAnalysis
  ): AdaptiveSettings {
    return {
      ...settings,
      // Update based on analysis
    };
  }

  private static generateDynastyEmergentEvents(
    _mission: GenerationalMission,
    _pacingState: PacingState
  ): EmergentEvent[] {
    return [];
  }

  private static generateLegacyEmergentEvents(
    _mission: GenerationalMission,
    _pacingState: PacingState
  ): EmergentEvent[] {
    return [];
  }

  private static generatePopulationEmergentEvents(
    _mission: GenerationalMission,
    _pacingState: PacingState
  ): EmergentEvent[] {
    return [];
  }

  private static generateExternalEmergentEvents(
    _mission: GenerationalMission,
    _pacingState: PacingState
  ): EmergentEvent[] {
    return [];
  }

  private static getAvailablePhaseTransitions(
    _currentPhase: GamePhase
  ): PhaseTransition[] {
    // Return possible transitions from current phase
    return [];
  }

  private static evaluateTransitionConditions(
    _transition: PhaseTransition,
    _mission: GenerationalMission,
    _pacingState: PacingState
  ): boolean {
    // Evaluate if transition conditions are met
    return false;
  }

  private static getPhaseBaseAcceleration(phase: GamePhase): number {
    switch (phase) {
      case 'early':
        return 1.5;
      case 'mid':
        return 1.0;
      case 'late':
        return 0.8;
      case 'arrival':
        return 0.3;
      default:
        return 1.0;
    }
  }

  private static getPreferenceAccelerationMultiplier(
    preferences: PacingPreferences
  ): number {
    switch (preferences.preferredSpeed) {
      case 'slow':
        return 0.6;
      case 'fast':
        return 1.8;
      case 'adaptive':
        return 1.0;
      default:
        return 1.0; // medium
    }
  }

  private static getEngagementAccelerationMultiplier(
    engagementScore: number
  ): number {
    // Lower engagement = higher acceleration to get to interesting parts faster
    return 2.0 - engagementScore;
  }

  private static evaluateEscalationCondition(
    _condition: EscalationCondition,
    _event: PacingEventLike,
    _pacingState: PacingState
  ): boolean {
    // Evaluate specific escalation condition
    return false;
  }

  private static classifyEngagementLevel(score: number): EngagementLevel {
    if (score >= 0.8) return 'very_high';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'moderate';
    if (score >= 0.2) return 'low';
    return 'very_low';
  }

  private static calculateEngagementTrend(
    interactions: InteractionEvent[]
  ): 'increasing' | 'stable' | 'decreasing' {
    if (interactions.length < 2) return 'stable';

    const recent = interactions.slice(-5);
    const older = interactions.slice(-10, -5);

    const recentAvg =
      recent.reduce((sum, i) => sum + (i.satisfaction || 0.5), 0) /
      recent.length;
    const olderAvg =
      older.reduce((sum, i) => sum + (i.satisfaction || 0.5), 0) / older.length;

    if (recentAvg > olderAvg + 0.1) return 'increasing';
    if (recentAvg < olderAvg - 0.1) return 'decreasing';
    return 'stable';
  }

  private static identifyEngagementFactors(
    _interactions: InteractionEvent[],
    _pacingState: PacingState
  ): EngagementFactor[] {
    // Identify factors affecting engagement
    return [];
  }

  private static generateEngagementPredictions(
    _interactions: InteractionEvent[],
    _pacingState: PacingState
  ): EngagementPrediction[] {
    // Generate predictions about future engagement
    return [];
  }

  private static generateEngagementRecommendations(
    _level: EngagementLevel,
    _trend: string,
    _factors: EngagementFactor[]
  ): EngagementRecommendation[] {
    // Generate recommendations to improve engagement
    return [];
  }

  private static getDefaultEngagementAnalysis(): EngagementAnalysis {
    return {
      currentLevel: 'moderate',
      trend: 'stable',
      factors: [],
      predictions: [],
      recommendations: [],
    };
  }
}
