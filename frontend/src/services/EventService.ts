// services/EventService.ts
import type {
  MissionEvent,
  EventOutcome,
  PopulationEffect,
  GenerationalMission,
  PopulationCohort
} from '../types/generationalMissions';
import type {
  EventCategoryType,
  LegacyTypeType,
  MissionPhaseType,
  CohortTypeType
} from '../types/enums';
import { AutomationService } from './AutomationService';
import Logger from '../utils/logger';

export class EventService {
  // Generate Event Based on Mission Context
  static generateEvent(
    mission: GenerationalMission,
    forceCategory?: EventCategoryType
  ): MissionEvent | null {
    const eventCategory = forceCategory || this.selectEventCategory(mission);
    const eventTemplate = this.selectEventTemplate(eventCategory, mission.legacy, mission.currentPhase);

    if (!eventTemplate) return null;

    const event = this.createEventFromTemplate(eventTemplate, mission);

    // Determine if this event requires player intervention
    event.requiresPlayerDecision = this.shouldRequirePlayerDecision(event, mission);

    Logger.info(`Generated event: ${event.title}`, {
      category: event.category,
      requiresPlayer: event.requiresPlayerDecision,
      missionId: mission.id
    });

    return event;
  }

  // Select Event Category Based on Mission State
  private static selectEventCategory(mission: GenerationalMission): EventCategoryType {
    const weights = {
      'immediate_crisis': this.calculateCrisisWeight(mission),
      'generational_challenge': 0.3,
      'mission_milestone': this.calculateMilestoneWeight(mission),
      'legacy_moment': this.calculateLegacyWeight(mission)
    };

    // Weighted random selection
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [category, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return category as EventCategoryType;
      }
    }

    return 'generational_challenge';
  }

  // Calculate Crisis Weight Based on Current Conditions
  private static calculateCrisisWeight(mission: GenerationalMission): number {
    let weight = 0.2; // Base crisis chance

    const resources = mission.resources;

    // Resource scarcity increases crisis chance
    if (resources.food < 500) weight += 0.3;
    if (resources.energy < 1000) weight += 0.2;
    if (resources.hullIntegrity < 0.7) weight += 0.4;
    if (resources.lifeSupport < 0.8) weight += 0.5;

    // Population issues increase crisis chance
    if (resources.morale < 0.5) weight += 0.3;
    if (resources.unity < 0.4) weight += 0.4;

    // Mission duration increases crisis chance
    const yearsFactor = mission.currentYear / mission.estimatedDuration;
    weight += yearsFactor * 0.2;

    return Math.min(weight, 0.8); // Cap at 80%
  }

  // Calculate Milestone Weight
  private static calculateMilestoneWeight(mission: GenerationalMission): number {
    const progress = mission.phaseProgress / 100;

    // Higher chance near phase transitions
    if (progress > 0.8 || progress < 0.2) {
      return 0.4;
    }

    return 0.15;
  }

  // Calculate Legacy Weight
  private static calculateLegacyWeight(mission: GenerationalMission): number {
    const generationCount = Math.floor(mission.currentYear / 25);

    // Legacy moments more likely in later generations
    return Math.min(0.1 + (generationCount * 0.05), 0.3);
  }

  // Select Event Template
  private static selectEventTemplate(
    category: EventCategoryType,
    legacy: LegacyTypeType,
    phase: MissionPhaseType
  ): EventTemplate | null {
    const templates = this.getEventTemplates(category, legacy, phase);

    if (templates.length === 0) return null;

    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Get Event Templates by Category and Context
  private static getEventTemplates(
    category: EventCategoryType,
    legacy: LegacyTypeType,
    phase: MissionPhaseType
  ): EventTemplate[] {
    const allTemplates = this.getAllEventTemplates();

    return allTemplates.filter(template =>
      template.category === category &&
      (template.legacySpecific === null || template.legacySpecific === legacy) &&
      template.validPhases.includes(phase)
    );
  }

  // Create Event from Template
  private static createEventFromTemplate(
    template: EventTemplate,
    mission: GenerationalMission
  ): MissionEvent {
    const event: MissionEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: template.title,
      description: this.processTemplateVariables(template.description, mission),
      category: template.category,
      requiresPlayerDecision: false, // Will be set later
      autoResolutionDelay: template.autoResolutionDelay,
      possibleOutcomes: template.outcomes.map(outcome => ({
        ...outcome,
        description: this.processTemplateVariables(outcome.description, mission)
      })),
      affectedCohorts: template.affectedCohorts,
      affectedDynasties: template.affectedDynasties,
      legacySpecific: template.legacySpecific,
      triggeredAt: Date.now(),
      resolvedAt: null,
      generation: Math.floor(mission.currentYear / 25) + 1
    };

    return event;
  }

  // Process Template Variables
  private static processTemplateVariables(text: string, mission: GenerationalMission): string {
    const variables: Record<string, string> = {
      '{SHIP_NAME}': mission.ship.name,
      '{YEAR}': mission.currentYear.toString(),
      '{GENERATION}': (Math.floor(mission.currentYear / 25) + 1).toString(),
      '{POPULATION}': mission.population.total.toString(),
      '{SECT}': mission.legacy,
      '{PHASE}': mission.currentPhase
    };

    let result = text;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(key, 'g'), value);
    });

    return result;
  }

  // Determine if Event Requires Player Decision
  private static shouldRequirePlayerDecision(
    event: MissionEvent,
    mission: GenerationalMission
  ): boolean {
    // Always escalate certain categories
    if (event.category === 'legacy_moment') return true;

    // Check automation config
    if (AutomationService.shouldEscalateEvent(event, mission.automationConfig)) {
      return true;
    }

    // High impact events require player attention
    const hasHighImpact = event.possibleOutcomes.some(outcome =>
      Math.abs(outcome.resourceChanges.population || 0) > 1000 ||
      Math.abs(outcome.resourceChanges.hullIntegrity || 0) > 0.2 ||
      outcome.longTermConsequences.length > 0
    );

    if (hasHighImpact) return true;

    // Some random events escalate regardless
    return Math.random() < 0.2;
  }

  // Resolve Event Automatically
  static resolveEventAutomatically(
    event: MissionEvent,
    mission: GenerationalMission
  ): EventResolution {
    if (event.possibleOutcomes.length === 0) {
      return {
        outcome: null,
        success: false,
        message: 'No resolution options available'
      };
    }

    // AI chooses best outcome based on mission state
    const chosenOutcome = this.selectBestOutcome(event.possibleOutcomes, mission);
    const resolution = this.applyEventOutcome(chosenOutcome, mission);

    event.resolvedAt = Date.now();

    Logger.info(`Auto-resolved event: ${event.title}`, {
      outcome: chosenOutcome.title,
      missionId: mission.id
    });

    return resolution;
  }

  // Resolve Event with Player Choice
  static resolveEventWithChoice(
    event: MissionEvent,
    outcomeId: string,
    mission: GenerationalMission
  ): EventResolution {
    const chosenOutcome = event.possibleOutcomes.find(o => o.id === outcomeId);

    if (!chosenOutcome) {
      return {
        outcome: null,
        success: false,
        message: 'Invalid outcome choice'
      };
    }

    const resolution = this.applyEventOutcome(chosenOutcome, mission);
    event.resolvedAt = Date.now();

    Logger.info(`Player resolved event: ${event.title}`, {
      outcome: chosenOutcome.title,
      missionId: mission.id
    });

    return resolution;
  }

  // Select Best Outcome for AI Resolution
  private static selectBestOutcome(
    outcomes: EventOutcome[],
    mission: GenerationalMission
  ): EventOutcome {
    let bestOutcome = outcomes[0];
    let bestScore = -Infinity;

    outcomes.forEach(outcome => {
      const score = this.evaluateOutcomeScore(outcome, mission);
      if (score > bestScore) {
        bestScore = score;
        bestOutcome = outcome;
      }
    });

    return bestOutcome;
  }

  // Evaluate Outcome Score for AI Decision Making
  private static evaluateOutcomeScore(
    outcome: EventOutcome,
    mission: GenerationalMission
  ): number {
    let score = 0;

    // Evaluate resource changes
    const resourceChanges = outcome.resourceChanges;
    const currentResources = mission.resources;

    // Prioritize critical resources
    if (currentResources.food < 500) {
      score += (resourceChanges.food || 0) * 2;
    }
    if (currentResources.hullIntegrity < 0.7) {
      score += (resourceChanges.hullIntegrity || 0) * 1000;
    }
    if (currentResources.lifeSupport < 0.8) {
      score += (resourceChanges.lifeSupport || 0) * 1000;
    }

    // General resource value
    score += (resourceChanges.credits || 0) * 0.1;
    score += (resourceChanges.energy || 0) * 0.2;
    score += (resourceChanges.minerals || 0) * 0.3;
    score += (resourceChanges.morale || 0) * 500;
    score += (resourceChanges.unity || 0) * 600;

    // Penalize long-term negative consequences
    score -= outcome.longTermConsequences.length * 100;

    // Sect-specific bonuses
    const sectBonus = outcome.legacyModifiers[mission.legacy] || 0;
    score += sectBonus * 200;

    return score;
  }

  // Apply Event Outcome to Mission
  private static applyEventOutcome(
    outcome: EventOutcome,
    mission: GenerationalMission
  ): EventResolution {
    const effects: string[] = [];

    // Apply resource changes
    Object.entries(outcome.resourceChanges).forEach(([resource, change]) => {
      if (change !== undefined && change !== 0) {
        const oldValue = (mission.resources as any)[resource] || 0;
        const newValue = Math.max(0, oldValue + change);
        (mission.resources as any)[resource] = newValue;

        effects.push(`${resource}: ${oldValue} → ${newValue}`);
      }
    });

    // Apply population effects
    outcome.populationEffects.forEach(effect => {
      const cohort = mission.population.cohorts.find(c => c.type === effect.cohortType);
      if (cohort) {
        this.applyPopulationEffect(cohort, effect);
        effects.push(`${effect.cohortType} ${effect.effectType}: ${effect.description}`);
      }
    });

    // Record long-term consequences
    if (outcome.longTermConsequences.length > 0) {
      // In a full implementation, these would be stored and affect future events
      effects.push(`Long-term effects: ${outcome.longTermConsequences.join(', ')}`);
    }

    return {
      outcome,
      success: true,
      message: `Event resolved: ${outcome.title}`,
      effects
    };
  }

  // Apply Population Effect to Cohort
  private static applyPopulationEffect(
    cohort: PopulationCohort,
    effect: PopulationEffect
  ): void {
    switch (effect.effectType) {
      case 'count':
        cohort.count = Math.max(0, cohort.count + effect.magnitude);
        break;
      case 'effectiveness':
        cohort.effectiveness = Math.max(0, Math.min(1, cohort.effectiveness + effect.magnitude));
        break;
      case 'morale':
        cohort.morale = Math.max(0, Math.min(100, cohort.morale + effect.magnitude));
        break;
      case 'traits':
        // Add trait effect (would be more sophisticated in production)
        cohort.specialTraits.push(effect.description);
        break;
    }
  }

  // Get All Event Templates
  private static getAllEventTemplates(): EventTemplate[] {
    return [
      // Immediate Crisis Events
      {
        id: 'system_failure',
        title: 'Critical System Failure',
        description: 'Multiple ship systems are failing simultaneously. Immediate action required.',
        category: 'immediate_crisis',
        legacySpecific: null,
        validPhases: ['travel', 'operation'],
        autoResolutionDelay: 2, // 2 hours
        affectedCohorts: ['engineers', 'general'],
        affectedDynasties: ['Engineering'],
        outcomes: [
          {
            id: 'emergency_repairs',
            title: 'Emergency Repairs',
            description: 'Focus all engineering efforts on critical repairs',
            resourceChanges: {
              hullIntegrity: 0.2,
              energy: -500,
              spareParts: -200
            },
            populationEffects: [],
            longTermConsequences: [],
            requirements: [],
            legacyModifiers: { preservers: 0.1, adaptors: 0.2, wanderers: 0.0 }
          },
          {
            id: 'jury_rig_solution',
            title: 'Jury-Rig Solution',
            description: 'Improvise temporary fixes to keep systems running',
            resourceChanges: {
              hullIntegrity: 0.1,
              energy: -200,
              spareParts: -50
            },
            populationEffects: [],
            longTermConsequences: ['Increased system instability'],
            requirements: [],
            legacyModifiers: { preservers: -0.1, adaptors: 0.0, wanderers: 0.3 }
          }
        ]
      },

      // Generational Challenge Events
      {
        id: 'population_growth',
        title: 'Population Boom',
        description: 'Birth rates have increased significantly. Resources are being strained.',
        category: 'generational_challenge',
        legacySpecific: null,
        validPhases: ['travel', 'operation'],
        autoResolutionDelay: 24, // 24 hours for long-term planning
        affectedCohorts: ['general'],
        affectedDynasties: ['Leadership'],
        outcomes: [
          {
            id: 'expand_facilities',
            title: 'Expand Living Facilities',
            description: 'Build new habitation areas to accommodate growth',
            resourceChanges: {
              population: 1000,
              energy: -800,
              minerals: -400,
              food: -200
            },
            populationEffects: [{
              cohortType: 'general',
              effectType: 'morale',
              magnitude: 10,
              description: 'Better living conditions'
            }],
            longTermConsequences: [],
            requirements: [],
            legacyModifiers: { preservers: 0.2, adaptors: 0.1, wanderers: -0.1 }
          },
          {
            id: 'population_control',
            title: 'Implement Population Controls',
            description: 'Establish policies to manage population growth',
            resourceChanges: {
              population: 200,
              unity: -0.1
            },
            populationEffects: [{
              cohortType: 'general',
              effectType: 'morale',
              magnitude: -15,
              description: 'Restrictive policies'
            }],
            longTermConsequences: ['Social tension over reproductive rights'],
            requirements: [],
            legacyModifiers: { preservers: -0.2, adaptors: 0.1, wanderers: 0.0 }
          }
        ]
      },

      // Mission Milestone Events
      {
        id: 'arrival_at_target',
        title: 'Arrival at Target System',
        description: 'After {YEAR} years of travel, we have reached our destination.',
        category: 'mission_milestone',
        legacySpecific: null,
        validPhases: ['travel'],
        autoResolutionDelay: 6,
        affectedCohorts: ['general'],
        affectedDynasties: [],
        outcomes: [
          {
            id: 'immediate_survey',
            title: 'Begin Immediate Survey',
            description: 'Deploy all available resources to survey the system',
            resourceChanges: {
              missionProgress: 15,
              energy: -300,
              researchData: 500
            },
            populationEffects: [{
              cohortType: 'scholars',
              effectType: 'morale',
              magnitude: 20,
              description: 'Excitement over discoveries'
            }],
            longTermConsequences: [],
            requirements: [],
            legacyModifiers: { preservers: 0.0, adaptors: 0.1, wanderers: 0.2 }
          }
        ]
      },

      // Legacy Moment Events
      {
        id: 'cultural_schism',
        title: 'Cultural Schism',
        description: 'A fundamental disagreement about mission direction has divided the population.',
        category: 'legacy_moment',
        legacySpecific: 'preservers',
        validPhases: ['travel', 'operation'],
        autoResolutionDelay: 48, // Very long for major decisions
        affectedCohorts: ['leaders', 'general'],
        affectedDynasties: ['Leadership'],
        outcomes: [
          {
            id: 'preserve_tradition',
            title: 'Preserve Traditional Ways',
            description: 'Maintain cultural purity despite challenges',
            resourceChanges: {
              unity: -0.2
            },
            populationEffects: [{
              cohortType: 'leaders',
              effectType: 'morale',
              magnitude: -10,
              description: 'Resistance to change'
            }],
            longTermConsequences: ['Increased resistance to adaptation'],
            requirements: [],
            legacyModifiers: { preservers: 0.3, adaptors: 0.0, wanderers: 0.0 }
          },
          {
            id: 'cultural_adaptation',
            title: 'Allow Cultural Evolution',
            description: 'Permit society to adapt to new circumstances',
            resourceChanges: {
              unity: 0.1
            },
            populationEffects: [{
              cohortType: 'general',
              effectType: 'morale',
              magnitude: 5,
              description: 'Embrace of change'
            }],
            longTermConsequences: ['Permanent cultural shift'],
            requirements: [],
            legacyModifiers: { preservers: -0.2, adaptors: 0.2, wanderers: 0.1 }
          }
        ]
      }
    ];
  }
}

// Helper Interfaces
interface EventTemplate {
  id: string;
  title: string;
  description: string;
  category: EventCategoryType;
  legacySpecific: LegacyTypeType | null;
  validPhases: MissionPhaseType[];
  autoResolutionDelay: number; // hours
  affectedCohorts: CohortTypeType[];
  affectedDynasties: string[]; // Specialization names
  outcomes: EventOutcome[];
}

interface EventResolution {
  outcome: EventOutcome | null;
  success: boolean;
  message: string;
  effects?: string[];
}