// services/AutomationService.ts
import type {
  AutomationConfig,
  CouncilMember,
  DelegationRule,
  MissionEvent,
  Dynasty,
  PopulationCohort,
  AIDecision,
  GenerationalMission,
} from '../types/generationalMissions';
import type { LegacyTypeType } from '../types/enums';
import { DynastyService } from './DynastyService';
import Logger from '../utils/logger';

export class AutomationService {
  // Initialize Default Automation Config for New Mission
  static createDefaultAutomationConfig(legacy: LegacyTypeType): AutomationConfig {
    return {
      resourceThresholds: this.getDefaultResourceThresholds(legacy),
      crisisEscalationRules: this.getDefaultEscalationRules(legacy),
      councilMembers: [], // Will be populated when dynasties are assigned
      delegationRules: this.getDefaultDelegationRules(legacy),
      emergencyProtocols: this.getDefaultEmergencyProtocols(legacy),
    };
  }

  // Default Resource Thresholds by Sect
  private static getDefaultResourceThresholds(legacy: LegacyTypeType): Record<string, number> {
    const baseThresholds = {
      credits: 1000,
      energy: 500,
      minerals: 300,
      food: 200,
      fuel: 100,
      hullIntegrity: 0.7,
      lifeSupport: 0.8,
      morale: 0.6,
      unity: 0.5,
    };

    // Legacy-specific adjustments
    switch (legacy) {
      case 'preservers':
        return {
          ...baseThresholds,
          food: 400, // More conservative food reserves
          hullIntegrity: 0.8, // Higher safety standards
          unity: 0.7, // Value social cohesion more
        };

      case 'adaptors':
        return {
          ...baseThresholds,
          energy: 800, // Higher energy needs for modifications
          lifeSupport: 0.6, // More tolerant of system variations
          morale: 0.4, // Accept lower traditional morale
        };

      case 'wanderers':
        return {
          ...baseThresholds,
          fuel: 200, // Critical for constant travel
          credits: 500, // Lower credit dependency
          food: 150, // Efficient consumption
          unity: 0.3, // Used to fragmentation
        };

      default:
        return baseThresholds;
    }
  }

  // Default Crisis Escalation Rules
  private static getDefaultEscalationRules(legacy: LegacyTypeType): DelegationRule[] {
    const rules: DelegationRule[] = [
      {
        id: 'critical_resources',
        category: 'resources',
        condition: 'any_resource < critical_threshold',
        action: 'escalate_to_player',
        isActive: true,
        dynastyResponsible: null,
      },
      {
        id: 'system_failure',
        category: 'systems',
        condition: 'hull_integrity < 0.5 OR life_support < 0.5',
        action: 'immediate_escalation',
        isActive: true,
        dynastyResponsible: null,
      },
      {
        id: 'population_crisis',
        category: 'population',
        condition: 'morale < 0.3 OR unity < 0.2',
        action: 'escalate_to_player',
        isActive: true,
        dynastyResponsible: null,
      },
    ];

    // Add legacy-specific escalation rules
    switch (legacy) {
      case 'preservers':
        rules.push({
          id: 'cultural_drift',
          category: 'culture',
          condition: 'cultural_drift > 0.5',
          action: 'escalate_to_player',
          isActive: true,
          dynastyResponsible: null,
        });
        break;

      case 'adaptors':
        rules.push({
          id: 'mutation_crisis',
          category: 'evolution',
          condition: 'failed_mutations > 3',
          action: 'immediate_escalation',
          isActive: true,
          dynastyResponsible: null,
        });
        break;

      case 'wanderers':
        rules.push({
          id: 'fleet_separation',
          category: 'fleet',
          condition: 'ships_lost > 1',
          action: 'escalate_to_player',
          isActive: true,
          dynastyResponsible: null,
        });
        break;
    }

    return rules;
  }

  // Default Delegation Rules
  private static getDefaultDelegationRules(_legacy: LegacyTypeType): DelegationRule[] {
    return [
      {
        id: 'routine_maintenance',
        category: 'maintenance',
        condition: 'no_critical_issues',
        action: 'auto_approve_maintenance',
        isActive: true,
        dynastyResponsible: 'Engineering',
      },
      {
        id: 'food_production',
        category: 'resources',
        condition: 'food_level_stable',
        action: 'auto_manage_agriculture',
        isActive: true,
        dynastyResponsible: 'Agriculture',
      },
      {
        id: 'education_continuity',
        category: 'population',
        condition: 'stable_population',
        action: 'auto_manage_education',
        isActive: true,
        dynastyResponsible: 'Leadership',
      },
      {
        id: 'security_patrols',
        category: 'security',
        condition: 'no_threats_detected',
        action: 'auto_security_operations',
        isActive: true,
        dynastyResponsible: 'Security',
      },
    ];
  }

  // Default Emergency Protocols
  private static getDefaultEmergencyProtocols(legacy: LegacyTypeType): Record<string, string> {
    const baseProtocols = {
      hull_breach: 'seal_compartments_evacuate_affected_areas',
      life_support_failure: 'activate_emergency_systems_reduce_population_activity',
      food_shortage: 'implement_rationing_activate_emergency_reserves',
      energy_crisis: 'power_down_non_essential_systems',
      population_unrest: 'deploy_security_open_communication_channels',
      system_cascade_failure: 'activate_all_emergency_protocols_wake_leadership',
    };

    // Add legacy-specific protocols
    switch (legacy) {
      case 'preservers':
        return {
          ...baseProtocols,
          cultural_crisis: 'convene_elder_council_review_traditions',
          tradition_violation: 'cultural_mediation_committee',
        };

      case 'adaptors':
        return {
          ...baseProtocols,
          mutation_outbreak: 'quarantine_affected_isolate_cause',
          enhancement_failure: 'medical_intervention_genetic_counseling',
        };

      case 'wanderers':
        return {
          ...baseProtocols,
          fleet_separation: 'activate_emergency_beacons_coordinate_rendezvous',
          resource_depletion: 'implement_survival_protocols_seek_opportunities',
        };

      default:
        return baseProtocols;
    }
  }

  // Assign Dynasties to Council Positions
  static assignCouncilPositions(
    dynasties: Dynasty[],
    _automationConfig: AutomationConfig
  ): CouncilMember[] {
    const councilPositions = [
      {
        role: 'Chief Administrator',
        authority: ['resources', 'population', 'general'],
        priority: 'leadership',
      },
      {
        role: 'Engineering Director',
        authority: ['systems', 'maintenance', 'construction'],
        priority: 'engineering',
      },
      {
        role: 'Life Support Manager',
        authority: ['agriculture', 'health', 'environment'],
        priority: 'agriculture',
      },
      {
        role: 'Security Chief',
        authority: ['security', 'emergency', 'defense'],
        priority: 'security',
      },
      {
        role: 'Cultural Coordinator',
        authority: ['education', 'culture', 'morale'],
        priority: 'diplomacy',
      },
    ];

    const councilMembers: CouncilMember[] = [];

    councilPositions.forEach(position => {
      // Find best dynasty for this role
      const suitableDynasties = dynasties
        .filter(d => this.isDynastyQualified(d, position.priority))
        .sort(
          (a, b) =>
            this.calculateDynastyFitness(b, position.priority) -
            this.calculateDynastyFitness(a, position.priority)
        );

      if (suitableDynasties.length > 0) {
        const chosenDynasty = suitableDynasties[0];
        councilMembers.push({
          dynastyId: chosenDynasty.id,
          role: position.role,
          authority: position.authority,
          performance: 0.7, // Starting performance
          autonomyLevel: 0.8, // High autonomy for routine decisions
        });
      }
    });

    return councilMembers;
  }

  // Check if Dynasty is Qualified for Role
  private static isDynastyQualified(dynasty: Dynasty, priority: string): boolean {
    const specialization = dynasty.specialization.toLowerCase();
    const influence = dynasty.influence;

    // Minimum influence requirement
    if (influence < 30) return false;

    // Check specialization match
    const specializationMatches: Record<string, string[]> = {
      leadership: ['leadership', 'diplomacy'],
      engineering: ['engineering', 'research'],
      agriculture: ['agriculture', 'medicine'],
      security: ['security'],
      diplomacy: ['diplomacy', 'trade', 'culture'],
    };

    return specializationMatches[priority]?.some(spec => specialization.includes(spec)) || false;
  }

  // Calculate Dynasty Fitness for Role
  private static calculateDynastyFitness(dynasty: Dynasty, priority: string): number {
    let fitness = dynasty.influence; // Base fitness from influence

    // Add leader skill bonus
    const leader = dynasty.currentLeader;
    switch (priority) {
      case 'leadership':
        fitness += leader.skills.leadership * 10;
        break;
      case 'engineering':
        fitness += leader.skills.technical * 10;
        break;
      case 'agriculture':
        fitness += (leader.skills.technical + leader.skills.survival) * 5;
        break;
      case 'security':
        fitness += leader.skills.survival * 10;
        break;
      case 'diplomacy':
        fitness += leader.skills.social * 10;
        break;
    }

    // Add trait bonuses
    leader.traits.forEach(trait => {
      if (this.isRelevantTrait(trait, priority)) {
        fitness += 15;
      }
    });

    return fitness;
  }

  // Check if Trait is Relevant to Role
  private static isRelevantTrait(trait: string, priority: string): boolean {
    const traitRelevance: Record<string, string[]> = {
      leadership: ['Natural Leader', 'Strategic Thinker', 'Inspiring Presence'],
      engineering: ['Technical Genius', 'System Optimizer', 'Problem Solver'],
      agriculture: ['Life Cultivator', 'Resource Manager', 'Ecosystem Guardian'],
      security: ['Threat Assessor', 'Tactical Thinker', 'Guardian Spirit'],
      diplomacy: ['Negotiator', 'Cultural Bridge', 'Conflict Resolver'],
    };

    return traitRelevance[priority]?.includes(trait) || false;
  }

  // Process Automated Decision Making
  static processAutomatedDecisions(
    mission: GenerationalMission,
    _timeElapsed: number
  ): AIDecision[] {
    const decisions: AIDecision[] = [];
    const config = mission.automationConfig;

    // Check each council member's domain
    config.councilMembers.forEach(councilMember => {
      const dynasty = mission.population.dynasties.find(d => d.id === councilMember.dynastyId);
      if (!dynasty) return;

      // Evaluate if automated action is needed
      const needsAction = this.evaluateNeedsAction(
        mission,
        councilMember.authority,
        config.resourceThresholds
      );

      if (needsAction) {
        const decision = DynastyService.makeAutomatedDecision(dynasty, {
          availableResources: mission.resources,
          populationNeeds: this.assessPopulationNeeds(mission.population.cohorts),
        });

        decisions.push(decision);
      }
    });

    return decisions;
  }

  // Evaluate if Automated Action is Needed
  private static evaluateNeedsAction(
    mission: GenerationalMission,
    authority: string[],
    thresholds: Record<string, number>
  ): boolean {
    const resources = mission.resources;

    // Check resource thresholds
    if (authority.includes('resources')) {
      if (
        resources.credits < thresholds.credits ||
        resources.energy < thresholds.energy ||
        resources.food < thresholds.food
      ) {
        return true;
      }
    }

    // Check system thresholds
    if (authority.includes('systems')) {
      if (
        resources.hullIntegrity < thresholds.hullIntegrity ||
        resources.lifeSupport < thresholds.lifeSupport
      ) {
        return true;
      }
    }

    // Check population thresholds
    if (authority.includes('population')) {
      if (resources.morale < thresholds.morale || resources.unity < thresholds.unity) {
        return true;
      }
    }

    return false;
  }

  // Assess Population Needs
  private static assessPopulationNeeds(cohorts: PopulationCohort[]): string[] {
    const needs: string[] = [];

    cohorts.forEach(cohort => {
      if (cohort.effectiveness < 0.6) {
        needs.push(`${cohort.type}_support`);
      }
      if (cohort.morale < 0.5) {
        needs.push(`${cohort.type}_morale`);
      }
    });

    return needs;
  }

  // Check if Event Should Escalate to Player
  static shouldEscalateEvent(event: MissionEvent, config: AutomationConfig): boolean {
    // Always escalate if event specifically requires player decision
    if (event.requiresPlayerDecision) return true;

    // Check escalation rules
    return config.crisisEscalationRules.some(rule => {
      if (!rule.isActive) return false;

      // Simple rule evaluation (would be more sophisticated in production)
      if (event.category === 'immediate_crisis' && rule.condition.includes('immediate')) {
        return true;
      }

      if (
        event.title.toLowerCase().includes('critical') &&
        rule.condition.includes('critical_threshold')
      ) {
        return true;
      }

      return false;
    });
  }

  // Apply Emergency Protocol
  static applyEmergencyProtocol(
    protocolName: string,
    mission: GenerationalMission
  ): { success: boolean; effects: string[]; message: string } {
    const protocol = mission.automationConfig.emergencyProtocols[protocolName];

    if (!protocol) {
      return {
        success: false,
        effects: [],
        message: `Unknown emergency protocol: ${protocolName}`,
      };
    }

    // Simulate protocol effects (would be more detailed in production)
    const effects: string[] = [];
    const success = true;

    switch (protocolName) {
      case 'hull_breach':
        effects.push('Sealed compartments', 'Evacuated affected areas');
        mission.resources.hullIntegrity = Math.max(0.3, mission.resources.hullIntegrity);
        break;

      case 'life_support_failure':
        effects.push('Activated emergency systems', 'Reduced population activity');
        mission.resources.lifeSupport = Math.max(0.4, mission.resources.lifeSupport);
        break;

      case 'food_shortage':
        effects.push('Implemented rationing', 'Activated emergency reserves');
        mission.resources.food = Math.max(50, mission.resources.food + 100);
        break;

      case 'energy_crisis':
        effects.push('Powered down non-essential systems');
        mission.resources.energy = Math.max(100, mission.resources.energy + 200);
        break;

      default:
        effects.push(`Applied protocol: ${protocol}`);
    }

    Logger.info(`Emergency protocol applied: ${protocolName}`, {
      effects,
      missionId: mission.id,
    });

    return {
      success,
      effects,
      message: `Emergency protocol "${protocolName}" executed successfully`,
    };
  }

  // Update Council Performance
  static updateCouncilPerformance(councilMember: CouncilMember, outcomeSuccess: boolean): void {
    const performanceDelta = outcomeSuccess ? 0.05 : -0.1;
    councilMember.performance = Math.max(
      0.1,
      Math.min(1.0, councilMember.performance + performanceDelta)
    );

    // Adjust autonomy based on performance
    if (councilMember.performance > 0.8) {
      councilMember.autonomyLevel = Math.min(0.95, councilMember.autonomyLevel + 0.02);
    } else if (councilMember.performance < 0.4) {
      councilMember.autonomyLevel = Math.max(0.3, councilMember.autonomyLevel - 0.05);
    }
  }
}
