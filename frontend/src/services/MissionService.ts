// services/MissionService.ts
import type {
  GenerationalMission,
  PopulationCohort,
  ExtendedResources,
  GenerationalShip,
  Population,
  SuccessMetric,
  FailureRisk,
  Milestone
} from '../types/generationalMissions';
import type {
  LegacyTypeType,
  MissionObjectiveType,
  ShipClassType,
  ShipSizeType,
  CohortTypeType
} from '../types/enums';
import { DynastyService } from './DynastyService';
import { AutomationService } from './AutomationService';
import { EventService } from './EventService';
import { LegacyService } from './LegacyService';
import Logger from '../utils/logger';

export class MissionService {
  // Create New Generational Mission
  static createMission(config: MissionCreationConfig): GenerationalMission {
    const ship = this.createGenerationalShip(config);
    const population = this.createMissionPopulation(config);
    const resources = this.createInitialResources(config);
    const automationConfig = AutomationService.createDefaultAutomationConfig(config.legacy);

    // Assign council positions
    automationConfig.councilMembers = AutomationService.assignCouncilPositions(
      population.dynasties,
      automationConfig
    );

    const mission: GenerationalMission = {
      id: `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: config.name,
      legacy: config.legacy,

      // Mission Parameters
      objective: config.objective,
      targetSystemId: config.targetSystemId,
      estimatedDuration: config.estimatedDuration,
      currentYear: 0,

      // Ship and Population
      ship,
      population,

      // Resources and Production
      resources,
      productionRates: this.calculateInitialProduction(population),

      // Mission Progress
      currentPhase: 'preparation',
      phaseProgress: 0,
      milestones: this.createMissionMilestones(config),

      // Events and History
      activeEvents: [],
      eventHistory: [],

      // Automation
      automationConfig,
      lastPlayerInteraction: Date.now(),

      // Success/Failure Tracking
      successMetrics: this.createSuccessMetrics(config),
      failureRisks: this.createFailureRisks(config),

      // Victory Conditions
      isCompleted: false,
      successLevel: null,
      finalRewards: {}
    };

    Logger.info(`Created generational mission: ${mission.name}`, {
      legacy: mission.legacy,
      objective: mission.objective,
      population: mission.population.total
    });

    return mission;
  }

  // Create Generational Ship
  private static createGenerationalShip(config: MissionCreationConfig): GenerationalShip {
    return {
      id: `ship_${Date.now()}`,
      name: config.shipName || this.generateShipName(config.legacy),
      class: config.shipClass,
      size: config.shipSize,
      populationCapacity: this.calculatePopulationCapacity(config.shipSize),
      currentPopulation: config.populationSize,
      hullIntegrity: 1.0,
      systemsEfficiency: 0.9,
      legacyModifications: this.getLegacyModifications(config.legacy),
      aiSystems: this.getAISystems(config.legacy),
      automationLevel: 0.8
    };
  }

  // Generate Ship Name
  private static generateShipName(legacy: LegacyTypeType): string {
    const names = {
      preservers: [
        'Heritage', 'Legacy', 'Tradition', 'Foundation', 'Covenant',
        'Monument', 'Memorial', 'Archive', 'Chronicle', 'Testament'
      ],
      adaptors: [
        'Evolution', 'Synthesis', 'Metamorphosis', 'Genesis', 'Prototype',
        'Mutation', 'Adaptation', 'Catalyst', 'Transformation', 'Emergence'
      ],
      wanderers: [
        'Nomad', 'Drifter', 'Pathfinder', 'Voyager', 'Wanderer',
        'Pioneer', 'Explorer', 'Vagrant', 'Roamer', 'Odyssey'
      ]
    };

    const legacyNames = names[legacy];
    const prefix = ['GSV', 'SSV', 'CSV'][Math.floor(Math.random() * 3)]; // Generational/Seed/Colony Ship Vessel
    const name = legacyNames[Math.floor(Math.random() * legacyNames.length)];

    return `${prefix} ${name}`;
  }

  // Calculate Population Capacity
  private static calculatePopulationCapacity(size: ShipSizeType): number {
    const capacities = {
      medium: 15000,
      large: 30000,
      massive: 50000,
      gigantic: 80000
    };

    return capacities[size];
  }

  // Get Legacy Modifications
  private static getLegacyModifications(legacy: LegacyTypeType): any[] {
    // Would return actual SectModification objects in full implementation
    const modifications = {
      preservers: ['Cultural Preservation Protocols', 'Traditional Life Support', 'Heritage Archives'],
      adaptors: ['Biological Integration Systems', 'Genetic Modification Labs', 'Adaptive Life Support'],
      wanderers: ['Modular Fleet Configuration', 'Extended Range Systems', 'Resource Conservation Protocols']
    };

    return modifications[legacy].map((name, index) => ({
      id: `mod_${legacy}_${index}`,
      name,
      legacy,
      description: `${legacy}-specific modification: ${name}`,
      effects: {},
      unlockRequirements: []
    }));
  }

  // Get AI Systems
  private static getAISystems(legacy: LegacyTypeType): string[] {
    const systems = {
      preservers: ['Cultural Archive AI', 'Tradition Compliance Monitor', 'Heritage Preservation System'],
      adaptors: ['Evolution Guidance AI', 'Adaptation Controller', 'Enhancement Risk Assessor'],
      wanderers: ['Navigation Coordinator', 'Resource Optimizer', 'Fleet Cohesion Monitor']
    };

    return systems[legacy];
  }

  // Create Mission Population
  private static createMissionPopulation(config: MissionCreationConfig): Population {
    const dynasties = DynastyService.generateInitialDynasties(config.legacy, config.populationSize);
    const cohorts = this.createPopulationCohorts(config.populationSize, config.legacy);

    // Apply dynasty effects to cohorts
    const enhancedCohorts = DynastyService.assignDynasTiesToCohorts(dynasties, cohorts);

    return {
      total: config.populationSize,
      cohorts: enhancedCohorts,
      dynasties,

      // Social Metrics
      morale: 0.7,
      unity: 0.8,
      stability: 0.75,

      // Legacy-Specific Metrics
      legacyLoyalty: 0.9,
      adaptationLevel: config.legacy === 'adaptors' ? 0.2 : 0.05,
      culturalDrift: 0.1,

      // Demographics
      birthRate: 0.02,
      deathRate: 0.015,
      avgAge: 35
    };
  }

  // Create Population Cohorts
  private static createPopulationCohorts(populationSize: number, legacy: LegacyTypeType): PopulationCohort[] {
    const distributions = {
      preservers: {
        engineers: 0.15,
        farmers: 0.25,
        scholars: 0.20,
        security: 0.10,
        leaders: 0.05,
        general: 0.25
      },
      adaptors: {
        engineers: 0.20,
        farmers: 0.15,
        scholars: 0.25,
        security: 0.08,
        leaders: 0.07,
        general: 0.25
      },
      wanderers: {
        engineers: 0.18,
        farmers: 0.12,
        scholars: 0.15,
        security: 0.15,
        leaders: 0.08,
        general: 0.32
      }
    };

    const distribution = distributions[legacy];
    const cohorts: PopulationCohort[] = [];

    Object.entries(distribution).forEach(([type, percentage]) => {
      cohorts.push({
        type: type as CohortTypeType,
        count: Math.floor(populationSize * percentage),
        effectiveness: 0.7 + Math.random() * 0.2, // 0.7-0.9
        generation: 1,
        specialTraits: [],
        morale: 70 + Math.random() * 20 // 70-90
      });
    });

    return cohorts;
  }

  // Create Initial Resources
  private static createInitialResources(config: MissionCreationConfig): ExtendedResources {
    const baseResources = {
      credits: 50000,
      energy: 10000,
      minerals: 5000,
      food: 8000,
      influence: 1000
    };

    // Scale by population size
    const scaleFactor = config.populationSize / 20000;

    return {
      // Basic Resources
      credits: Math.floor(baseResources.credits * scaleFactor),
      energy: Math.floor(baseResources.energy * scaleFactor),
      minerals: Math.floor(baseResources.minerals * scaleFactor),
      food: Math.floor(baseResources.food * scaleFactor),
      influence: Math.floor(baseResources.influence * scaleFactor),

      // Generational Mission Resources
      population: config.populationSize,
      morale: 0.7,
      unity: 0.8,
      knowledge: 1000,
      technology: 500,

      // Ship Resources
      hullIntegrity: 1.0,
      lifeSupport: 1.0,
      fuel: 5000,
      spareParts: 1000,

      // Mission-Specific
      missionProgress: 0,
      extractedResources: 0,
      researchData: 0,
      geneticSamples: 0,

      // Legacy-Specific
      culturalDrift: 0.1,
      adaptationLevel: config.legacy === 'adaptors' ? 0.2 : 0.05
    };
  }

  // Calculate Initial Production Rates
  private static calculateInitialProduction(
    population: Population
  ): Partial<ExtendedResources> {
    const farmerCount = population.cohorts.find(c => c.type === 'farmers')?.count || 0;
    const engineerCount = population.cohorts.find(c => c.type === 'engineers')?.count || 0;
    const scholarCount = population.cohorts.find(c => c.type === 'scholars')?.count || 0;

    return {
      food: Math.floor(farmerCount * 0.5),
      energy: Math.floor(engineerCount * 0.3),
      knowledge: Math.floor(scholarCount * 0.2),
      spareParts: Math.floor(engineerCount * 0.1),
      credits: Math.floor(population.total * 0.01) // Base economic activity
    };
  }

  // Create Mission Milestones
  private static createMissionMilestones(config: MissionCreationConfig): Milestone[] {
    const milestones: Milestone[] = [
      {
        id: 'launch',
        name: 'Mission Launch',
        description: 'Successfully depart from home system',
        phase: 'preparation',
        isCompleted: false,
        completedAt: null,
        rewards: { morale: 0.1, unity: 0.05 }
      },
      {
        id: 'deep_space',
        name: 'Deep Space Navigation',
        description: 'Successfully navigate to deep space',
        phase: 'travel',
        isCompleted: false,
        completedAt: null,
        rewards: { knowledge: 200, technology: 100 }
      }
    ];

    // Add objective-specific milestones
    switch (config.objective) {
      case 'colonization':
        milestones.push(
          {
            id: 'planet_survey',
            name: 'Planet Survey',
            description: 'Complete detailed survey of target planet',
            phase: 'operation',
            isCompleted: false,
            completedAt: null,
            rewards: { researchData: 1000, knowledge: 500 }
          },
          {
            id: 'colony_established',
            name: 'Colony Established',
            description: 'Successfully establish self-sustaining colony',
            phase: 'operation',
            isCompleted: false,
            completedAt: null,
            rewards: { influence: 2000, credits: 50000 }
          }
        );
        break;

      case 'mining':
        milestones.push(
          {
            id: 'mining_setup',
            name: 'Mining Operations Setup',
            description: 'Establish mining infrastructure',
            phase: 'operation',
            isCompleted: false,
            completedAt: null,
            rewards: { extractedResources: 5000, minerals: 2000 }
          },
          {
            id: 'resource_quota',
            name: 'Resource Quota Met',
            description: 'Extract target amount of resources',
            phase: 'operation',
            isCompleted: false,
            completedAt: null,
            rewards: { extractedResources: 20000, credits: 100000 }
          }
        );
        break;

      case 'exploration':
        milestones.push(
          {
            id: 'system_mapping',
            name: 'System Mapping',
            description: 'Complete comprehensive system survey',
            phase: 'operation',
            isCompleted: false,
            completedAt: null,
            rewards: { researchData: 2000, knowledge: 1000 }
          },
          {
            id: 'discovery_made',
            name: 'Major Discovery',
            description: 'Make significant scientific discovery',
            phase: 'operation',
            isCompleted: false,
            completedAt: null,
            rewards: { technology: 1000, influence: 1500 }
          }
        );
        break;
    }

    return milestones;
  }

  // Create Success Metrics
  private static createSuccessMetrics(config: MissionCreationConfig): SuccessMetric[] {
    const baseMetrics: SuccessMetric[] = [
      {
        id: 'population_survival',
        name: 'Population Survival',
        currentValue: 100,
        targetValue: 90, // 90% survival rate
        weight: 0.4
      },
      {
        id: 'mission_completion',
        name: 'Mission Objective Completion',
        currentValue: 0,
        targetValue: 100,
        weight: 0.3
      },
      {
        id: 'resource_efficiency',
        name: 'Resource Management',
        currentValue: 100,
        targetValue: 80, // Maintain 80% of starting resources
        weight: 0.2
      },
      {
        id: 'social_cohesion',
        name: 'Social Unity',
        currentValue: 80,
        targetValue: 60, // Maintain social unity above 60%
        weight: 0.1
      }
    ];

    // Add objective-specific metrics
    switch (config.objective) {
      case 'colonization':
        baseMetrics.push({
          id: 'colony_sustainability',
          name: 'Colony Self-Sufficiency',
          currentValue: 0,
          targetValue: 100,
          weight: 0.25
        });
        break;

      case 'mining':
        baseMetrics.push({
          id: 'extraction_quota',
          name: 'Resource Extraction Target',
          currentValue: 0,
          targetValue: 100,
          weight: 0.25
        });
        break;

      case 'exploration':
        baseMetrics.push({
          id: 'discovery_value',
          name: 'Scientific Discovery Value',
          currentValue: 0,
          targetValue: 100,
          weight: 0.25
        });
        break;
    }

    return baseMetrics;
  }

  // Create Failure Risks
  private static createFailureRisks(config: MissionCreationConfig): FailureRisk[] {
    const risks: FailureRisk[] = [
      {
        id: 'system_cascade_failure',
        name: 'System Cascade Failure',
        probability: 0.05,
        severity: 0.9,
        mitigation: ['Regular maintenance', 'Redundant systems', 'Emergency protocols'],
        isActive: true
      },
      {
        id: 'population_unrest',
        name: 'Social Uprising',
        probability: 0.15,
        severity: 0.6,
        mitigation: ['Maintain morale', 'Fair resource distribution', 'Cultural programs'],
        isActive: true
      },
      {
        id: 'resource_depletion',
        name: 'Critical Resource Shortage',
        probability: 0.2,
        severity: 0.7,
        mitigation: ['Resource monitoring', 'Recycling systems', 'Emergency reserves'],
        isActive: true
      }
    ];

    // Add legacy-specific risks
    switch (config.legacy) {
      case 'preservers':
        risks.push({
          id: 'cultural_collapse',
          name: 'Cultural Identity Loss',
          probability: 0.1,
          severity: 0.8,
          mitigation: ['Cultural education', 'Tradition maintenance', 'Elder councils'],
          isActive: true
        });
        break;

      case 'adaptors':
        risks.push({
          id: 'enhancement_catastrophe',
          name: 'Enhancement Failure Cascade',
          probability: 0.25,
          severity: 0.7,
          mitigation: ['Careful testing', 'Medical monitoring', 'Reversal protocols'],
          isActive: true
        });
        break;

      case 'wanderers':
        risks.push({
          id: 'fleet_dissolution',
          name: 'Fleet Separation',
          probability: 0.3,
          severity: 0.9,
          mitigation: ['Communication systems', 'Unity programs', 'Resource sharing'],
          isActive: true
        });
        break;
    }

    return risks;
  }

  // Process Mission Turn (Time Advancement)
  static processMissionTurn(mission: GenerationalMission, yearsElapsed: number = 1): MissionUpdateResult {
    const updates: string[] = [];

    // Advance mission time
    mission.currentYear += yearsElapsed;

    // Process resource generation
    this.processResourceGeneration(mission, yearsElapsed, updates);

    // Process population changes
    this.processPopulationChanges(mission, yearsElapsed, updates);

    // Process automation decisions
    const aiDecisions = AutomationService.processAutomatedDecisions(mission, yearsElapsed);
    updates.push(...aiDecisions.map(d => `AI Decision: ${d.decision}`));

    // Generate events
    const eventChance = 0.3 + (yearsElapsed * 0.1); // Higher chance for longer time periods
    if (Math.random() < eventChance) {
      const event = EventService.generateEvent(mission);
      if (event) {
        mission.activeEvents.push(event);
        updates.push(`New Event: ${event.title}`);

        // Auto-resolve if not requiring player decision
        if (!event.requiresPlayerDecision && event.autoResolutionDelay <= 0) {
          const resolution = EventService.resolveEventAutomatically(event, mission);
          if (resolution.success) {
            updates.push(`Auto-resolved: ${event.title}`);
            mission.eventHistory.push(event);
            mission.activeEvents = mission.activeEvents.filter(e => e.id !== event.id);
          }
        }
      }
    }

    // Check legacy-specific failure conditions
    const failureCheck = LegacyService.checkLegacyFailureConditions(mission);
    if (failureCheck.isAtRisk) {
      updates.push(...failureCheck.warnings);
    }

    // Update success metrics
    this.updateSuccessMetrics(mission);

    // Check mission completion
    this.checkMissionCompletion(mission, updates);

    Logger.info(`Processed mission turn for ${mission.name}`, {
      yearsElapsed,
      currentYear: mission.currentYear,
      updates: updates.length
    });

    return {
      mission,
      updates,
      requiresPlayerAttention: mission.activeEvents.some(e => e.requiresPlayerDecision) || failureCheck.isAtRisk
    };
  }

  // Process Resource Generation
  private static processResourceGeneration(
    mission: GenerationalMission,
    yearsElapsed: number,
    updates: string[]
  ): void {
    Object.entries(mission.productionRates).forEach(([resource, rate]) => {
      if (rate !== undefined) {
        const generated = Math.floor(rate * yearsElapsed);
        if (generated > 0) {
          (mission.resources as any)[resource] += generated;
          updates.push(`Generated ${generated} ${resource}`);
        }
      }
    });
  }

  // Process Population Changes
  private static processPopulationChanges(
    mission: GenerationalMission,
    yearsElapsed: number,
    updates: string[]
  ): void {
    const population = mission.population;

    // Natural population change
    const birthsPerYear = population.total * population.birthRate;
    const deathsPerYear = population.total * population.deathRate;
    const netChangePerYear = birthsPerYear - deathsPerYear;
    const totalChange = Math.floor(netChangePerYear * yearsElapsed);

    if (totalChange !== 0) {
      population.total = Math.max(0, population.total + totalChange);
      mission.resources.population = population.total;
      updates.push(`Population ${totalChange > 0 ? 'grew' : 'declined'} by ${Math.abs(totalChange)}`);
    }

    // Age dynasties
    if (yearsElapsed >= 25) {
      const generationsAdvanced = Math.floor(yearsElapsed / 25);
      for (let i = 0; i < generationsAdvanced; i++) {
        population.dynasties = population.dynasties.map(dynasty =>
          DynastyService.advanceGeneration(dynasty)
        );
      }
      updates.push(`Advanced ${generationsAdvanced} generation(s)`);
    }
  }

  // Update Success Metrics
  private static updateSuccessMetrics(mission: GenerationalMission): void {
    mission.successMetrics.forEach(metric => {
      switch (metric.id) {
        case 'population_survival': {
          // Calculate survival rate based on starting population
          const initialPopulation = mission.ship.populationCapacity; // Approximation
          metric.currentValue = (mission.population.total / initialPopulation) * 100;
          break;
        }

        case 'mission_completion':
          metric.currentValue = mission.phaseProgress;
          break;

        case 'resource_efficiency': {
          // Simple approximation - would be more sophisticated in production
          const resourceHealth = Math.min(
            mission.resources.food / 1000,
            mission.resources.energy / 2000,
            mission.resources.hullIntegrity
          );
          metric.currentValue = resourceHealth * 100;
          break;
        }

        case 'social_cohesion':
          metric.currentValue = mission.resources.unity * 100;
          break;
      }
    });
  }

  // Check Mission Completion
  private static checkMissionCompletion(mission: GenerationalMission, updates: string[]): void {
    if (mission.isCompleted) return;

    // Check if mission duration exceeded
    if (mission.currentYear >= mission.estimatedDuration) {
      const successScore = this.calculateOverallSuccessScore(mission);
      mission.isCompleted = true;

      if (successScore >= 0.9) {
        mission.successLevel = 'complete';
      } else if (successScore >= 0.7) {
        mission.successLevel = 'partial';
      } else if (successScore >= 0.4) {
        mission.successLevel = 'pyrrhic';
      } else {
        mission.successLevel = 'failure';
      }

      updates.push(`Mission completed with ${mission.successLevel} success`);
    }
  }

  // Calculate Overall Success Score
  private static calculateOverallSuccessScore(mission: GenerationalMission): number {
    return mission.successMetrics.reduce((totalScore, metric) => {
      const achievement = Math.min(1, metric.currentValue / metric.targetValue);
      return totalScore + (achievement * metric.weight);
    }, 0);
  }
}

// Helper Interfaces
interface MissionCreationConfig {
  name: string;
  legacy: LegacyTypeType;
  objective: MissionObjectiveType;
  targetSystemId: string;
  estimatedDuration: number; // years
  shipName?: string;
  shipClass: ShipClassType;
  shipSize: ShipSizeType;
  populationSize: number;
}

interface MissionUpdateResult {
  mission: GenerationalMission;
  updates: string[];
  requiresPlayerAttention: boolean;
}
