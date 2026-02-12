// services/LegacyService.ts
import type {
  GenerationalMission,
  ExtendedResources,
  PopulationEffect
} from '../types/generationalMissions';
import type { LegacyTypeType } from '../types/enums';

export class LegacyService {
  // Core Legacy Mechanics Implementation

  // Preservers: Stability vs Stagnation
  static processPreserversDialemma(
    mission: GenerationalMission,
    choice: 'tradition' | 'adaptation' | 'compromise'
  ): LegacyDilemmaResult {
    const preserverMetrics = this.getPreserverMetrics(mission);

    switch (choice) {
      case 'tradition':
        return {
          resourceChanges: {
            unity: 0.1,
            culturalDrift: -0.1,
            morale: preserverMetrics.traditionSupport > 0.6 ? 0.1 : -0.05,
            technology: -50 // Resist technological advancement
          },
          populationEffects: [
            {
              cohortType: 'leaders',
              effectType: 'morale',
              magnitude: preserverMetrics.traditionSupport > 0.6 ? 15 : -10,
              description: 'Response to traditional choice'
            },
            {
              cohortType: 'scholars',
              effectType: 'effectiveness',
              magnitude: -0.05, // Reduced innovation
              description: 'Constrained by traditional methods'
            }
          ],
          longTermConsequences: [
            'Increased resistance to future adaptations',
            'Cultural purity maintained',
            preserverMetrics.traditionSupport < 0.4 ? 'Growing underground adaptation movement' : ''
          ].filter(Boolean),
          legacySpecificEffects: {
            traditionPoints: 20,
            adaptationPressure: 10
          }
        };

      case 'adaptation':
        return {
          resourceChanges: {
            unity: -0.15,
            culturalDrift: 0.2,
            technology: 100,
            morale: preserverMetrics.adaptationNeed > 0.7 ? 0.05 : -0.1
          },
          populationEffects: [
            {
              cohortType: 'engineers',
              effectType: 'effectiveness',
              magnitude: 0.1,
              description: 'Embracing new methods'
            },
            {
              cohortType: 'general',
              effectType: 'morale',
              magnitude: preserverMetrics.adaptationNeed > 0.7 ? 5 : -15,
              description: 'Cultural disruption response'
            }
          ],
          longTermConsequences: [
            'Permanent cultural shift',
            'Improved adaptability',
            preserverMetrics.traditionSupport > 0.6 ? 'Traditional faction forms resistance' : ''
          ].filter(Boolean),
          legacySpecificEffects: {
            traditionPoints: -15,
            adaptationPressure: -10,
            culturalSchismRisk: preserverMetrics.traditionSupport > 0.6 ? 25 : 5
          }
        };

      case 'compromise':
        return {
          resourceChanges: {
            unity: -0.05,
            culturalDrift: 0.05,
            technology: 30,
            morale: -0.02 // Some dissatisfaction from both sides
          },
          populationEffects: [
            {
              cohortType: 'leaders',
              effectType: 'morale',
              magnitude: -5,
              description: 'Political compromise stress'
            }
          ],
          longTermConsequences: [
            'Gradual cultural evolution',
            'Delayed decision making in future crises'
          ],
          legacySpecificEffects: {
            traditionPoints: 5,
            adaptationPressure: 5,
            compromiseDebt: 10 // Future decisions become harder
          }
        };

      default:
        throw new Error(`Invalid Preservers choice: ${choice}`);
    }
  }

  // Adaptors: Evolution vs Humanity
  static processAdaptorsEvolution(
    mission: GenerationalMission,
    enhancement: 'genetic' | 'cybernetic' | 'biological' | 'reject'
  ): LegacyDilemmaResult {
    const adaptorMetrics = this.getAdaptorMetrics(mission);

    switch (enhancement) {
      case 'genetic': {
        const geneticSuccess = Math.random() > 0.3; // 70% success rate
        return {
          resourceChanges: {
            technology: geneticSuccess ? 200 : -100,
            energy: -500,
            population: geneticSuccess ? 0 : -200, // Failed modifications
            adaptationLevel: geneticSuccess ? 0.1 : 0.05
          },
          populationEffects: [
            {
              cohortType: 'general',
              effectType: 'effectiveness',
              magnitude: geneticSuccess ? 0.15 : -0.1,
              description: geneticSuccess ? 'Enhanced capabilities' : 'Genetic complications'
            }
          ],
          longTermConsequences: geneticSuccess ? [
            'Population gains genetic enhancements',
            'Increased adaptation to space environment'
          ] : [
            'Genetic instability in population',
            'Fear of future modifications',
            'Medical complications'
          ],
          legacySpecificEffects: {
            mutationEvents: geneticSuccess ? 0 : 1,
            enhancementResistance: geneticSuccess ? -5 : 15,
            bodyHorrorRisk: geneticSuccess ? 5 : 20
          }
        };
      }

      case 'cybernetic': {
        const cyberneticSuccess = Math.random() > 0.25; // 75% success rate
        return {
          resourceChanges: {
            technology: cyberneticSuccess ? 150 : -50,
            minerals: -300,
            energy: cyberneticSuccess ? 100 : -200,
            adaptationLevel: cyberneticSuccess ? 0.08 : 0.02
          },
          populationEffects: [
            {
              cohortType: 'engineers',
              effectType: 'effectiveness',
              magnitude: cyberneticSuccess ? 0.2 : -0.05,
              description: cyberneticSuccess ? 'Enhanced technical abilities' : 'Interface problems'
            }
          ],
          longTermConsequences: cyberneticSuccess ? [
            'Enhanced human-machine interface',
            'Improved ship system integration'
          ] : [
            'Cybernetic rejection syndrome',
            'Technology dependency issues'
          ],
          legacySpecificEffects: {
            cyberneticIntegration: cyberneticSuccess ? 20 : -10,
            humanityDrift: cyberneticSuccess ? 10 : 5
          }
        };
      }

      case 'biological': {
        const biologicalSuccess = Math.random() > 0.4; // 60% success rate
        return {
          resourceChanges: {
            food: biologicalSuccess ? 200 : -100,
            lifeSupport: biologicalSuccess ? 0.1 : -0.05,
            adaptationLevel: biologicalSuccess ? 0.12 : 0.03
          },
          populationEffects: [
            {
              cohortType: 'farmers',
              effectType: 'effectiveness',
              magnitude: biologicalSuccess ? 0.25 : -0.1,
              description: biologicalSuccess ? 'Enhanced biological efficiency' : 'Biological incompatibility'
            }
          ],
          longTermConsequences: biologicalSuccess ? [
            'Improved space adaptation',
            'Reduced resource requirements',
            'Enhanced biological systems'
          ] : [
            'Biological system rejection',
            'Increased medical needs'
          ],
          legacySpecificEffects: {
            biologicalIntegration: biologicalSuccess ? 25 : -15,
            bodyHorrorRisk: biologicalSuccess ? 3 : 15
          }
        };
      }

      case 'reject':
        return {
          resourceChanges: {
            unity: 0.05,
            morale: adaptorMetrics.enhancementPressure > 0.7 ? -0.1 : 0.02
          },
          populationEffects: [
            {
              cohortType: 'general',
              effectType: 'morale',
              magnitude: adaptorMetrics.enhancementPressure > 0.7 ? -10 : 5,
              description: 'Conservative choice response'
            }
          ],
          longTermConsequences: [
            'Delayed adaptation progress',
            adaptorMetrics.enhancementPressure > 0.7 ? 'Rogue enhancement groups may form' : ''
          ].filter(Boolean),
          legacySpecificEffects: {
            enhancementPressure: 15,
            purityFactionStrength: 10
          }
        };

      default:
        throw new Error(`Invalid Adaptors enhancement: ${enhancement}`);
    }
  }

  // Wanderers: Freedom vs Extinction
  static processWanderersSurvival(
    mission: GenerationalMission,
    action: 'raid' | 'trade' | 'scavenge' | 'conserve'
  ): LegacyDilemmaResult {
    const wandererMetrics = this.getWandererMetrics(mission);

    switch (action) {
      case 'raid': {
        const raidSuccess = Math.random() > 0.4; // 60% success rate
        const raidSeverity = Math.random(); // How severe the raid is

        return {
          resourceChanges: {
            credits: raidSuccess ? 1000 + (raidSeverity * 2000) : -500,
            energy: raidSuccess ? 500 : -200,
            food: raidSuccess ? 300 : -100,
            influence: -50, // Reputation damage
            unity: raidSuccess ? 0.05 : -0.1
          },
          populationEffects: [
            {
              cohortType: 'security',
              effectType: 'morale',
              magnitude: raidSuccess ? 10 : -15,
              description: raidSuccess ? 'Successful raid morale boost' : 'Failed raid demoralization'
            }
          ],
          longTermConsequences: raidSuccess ? [
            'Reputation as raiders spreads',
            'Other vessels become more hostile',
            raidSeverity > 0.7 ? 'Severe diplomatic consequences' : 'Minor diplomatic impact'
          ] : [
            'Failed raid weakens position',
            'Potential retaliation from target',
            'Crew questions leadership'
          ],
          legacySpecificEffects: {
            piracyReputation: raidSuccess ? (10 + raidSeverity * 20) : 5,
            moralCode: -(5 + raidSeverity * 10),
            existentialDread: raidSuccess ? -5 : 10
          }
        };
      }

      case 'trade': {
        const tradeSuccess = Math.random() > (0.3 + wandererMetrics.piracyReputation * 0.01); // Reputation affects trade

        return {
          resourceChanges: {
            credits: tradeSuccess ? 300 : -100,
            energy: tradeSuccess ? 200 : -50,
            minerals: tradeSuccess ? 150 : -30,
            influence: tradeSuccess ? 10 : -5
          },
          populationEffects: [
            {
              cohortType: 'general',
              effectType: 'morale',
              magnitude: tradeSuccess ? 5 : -5,
              description: tradeSuccess ? 'Successful peaceful exchange' : 'Trade rejection'
            }
          ],
          longTermConsequences: tradeSuccess ? [
            'Improved relations with traders',
            'Trade route opportunities'
          ] : [
            'Decreased trust from trading partners',
            'Limited future trade options'
          ],
          legacySpecificEffects: {
            tradeReputation: tradeSuccess ? 5 : -3,
            moralCode: tradeSuccess ? 2 : -1,
            existentialDread: tradeSuccess ? -2 : 3
          }
        };
      }

      case 'scavenge': {
        const scavengeFind = Math.random();

        return {
          resourceChanges: {
            minerals: 50 + (scavengeFind * 200),
            energy: 30 + (scavengeFind * 150),
            spareParts: 20 + (scavengeFind * 100),
            fuel: 10 + (scavengeFind * 50)
          },
          populationEffects: [
            {
              cohortType: 'engineers',
              effectType: 'effectiveness',
              magnitude: 0.02,
              description: 'Experience with salvage operations'
            }
          ],
          longTermConsequences: [
            'Improved scavenging capabilities',
            scavengeFind > 0.8 ? 'Discovered valuable technology cache' : ''
          ].filter(Boolean),
          legacySpecificEffects: {
            scavengingSkill: 3,
            resourceConservation: 2,
            existentialDread: -1
          }
        };
      }

      case 'conserve':
        return {
          resourceChanges: {
            fuel: -Math.max(10, mission.resources.fuel * 0.05), // Reduce consumption
            energy: -Math.max(20, mission.resources.energy * 0.03),
            morale: -0.05 // Hardship from conservation
          },
          populationEffects: [
            {
              cohortType: 'general',
              effectType: 'morale',
              magnitude: -8,
              description: 'Conservation hardships'
            }
          ],
          longTermConsequences: [
            'Extended operational range',
            'Improved resource efficiency',
            wandererMetrics.existentialDread > 50 ? 'Growing despair over endless journey' : ''
          ].filter(Boolean),
          legacySpecificEffects: {
            resourceConservation: 5,
            survivalSkills: 3,
            existentialDread: wandererMetrics.existentialDread > 50 ? 8 : 2
          }
        };

      default:
        throw new Error(`Invalid Wanderers action: ${action}`);
    }
  }

  // Get Preservers Specific Metrics
  private static getPreserverMetrics(mission: GenerationalMission): PreserverMetrics {
    const culturalDrift = mission.resources.culturalDrift || 0;

    return {
      traditionSupport: Math.max(0, 1 - culturalDrift - (mission.currentYear / mission.estimatedDuration)),
      adaptationNeed: Math.min(1, culturalDrift + (mission.currentYear / mission.estimatedDuration * 0.5)),
      culturalStress: Math.abs(culturalDrift - 0.3), // Stress when too much or too little change
      generationGap: Math.floor(mission.currentYear / 25) * 0.1
    };
  }

  // Get Adaptors Specific Metrics
  private static getAdaptorMetrics(mission: GenerationalMission): AdaptorMetrics {
    const adaptationLevel = mission.resources.adaptationLevel || 0;
    const technology = mission.resources.technology || 0;

    return {
      enhancementPressure: Math.min(1, (mission.currentYear / mission.estimatedDuration) + (adaptationLevel * 0.5)),
      humanityDrift: adaptationLevel,
      enhancementResistance: Math.max(0, 0.5 - adaptationLevel),
      innovationPotential: Math.min(1, technology / 1000)
    };
  }

  // Get Wanderers Specific Metrics
  private static getWandererMetrics(mission: GenerationalMission): WandererMetrics {
    // These would be stored as legacy-specific resources in a full implementation
    return {
      resourceScarcity: this.calculateResourceScarcity(mission.resources),
      piracyReputation: 20, // Would be tracked over time
      existentialDread: Math.min(100, mission.currentYear / 10), // Increases with time
      fleetCohesion: Math.max(0, 1 - (mission.currentYear / mission.estimatedDuration * 0.3))
    };
  }

  // Calculate Resource Scarcity
  private static calculateResourceScarcity(resources: ExtendedResources): number {
    const criticalResources = [
      resources.fuel / 1000,
      resources.food / 1000,
      resources.energy / 2000,
      resources.spareParts / 500
    ];

    const avgScarcity = criticalResources.reduce((sum, val) => sum + Math.min(1, val), 0) / criticalResources.length;
    return Math.max(0, 1 - avgScarcity);
  }

  // Apply Legacy-Specific Failure Conditions
  static checkLegacyFailureConditions(mission: GenerationalMission): LegacyFailureCheck {
    switch (mission.legacy) {
      case 'preservers':
        return this.checkPreserversFailure(mission);
      case 'adaptors':
        return this.checkAdaptorsFailure(mission);
      case 'wanderers':
        return this.checkWanderersFailure(mission);
      default:
        return { isAtRisk: false, riskLevel: 0, warnings: [] };
    }
  }

  // Check Preservers Failure: Cultural Collapse
  private static checkPreserversFailure(mission: GenerationalMission): LegacyFailureCheck {
    const culturalDrift = mission.resources.culturalDrift || 0;
    const unity = mission.resources.unity || 0.5;
    const traditionPoints = 50; // Would be tracked in legacy-specific data

    const riskFactors = [];
    let riskLevel = 0;

    if (culturalDrift > 0.7) {
      riskFactors.push('Severe cultural drift from baseline');
      riskLevel += 30;
    }

    if (unity < 0.3) {
      riskFactors.push('Critical loss of social unity');
      riskLevel += 25;
    }

    if (traditionPoints < 20) {
      riskFactors.push('Tradition points critically low');
      riskLevel += 35;
    }

    const isAtRisk = riskLevel > 50;
    const warnings = [];

    if (riskLevel > 30) {
      warnings.push('Cultural collapse warning: Society losing traditional identity');
    }
    if (riskLevel > 60) {
      warnings.push('CRITICAL: Cultural fragmentation imminent');
    }

    return { isAtRisk, riskLevel, warnings, failureType: 'cultural_collapse' };
  }

  // Check Adaptors Failure: Humanity Loss
  private static checkAdaptorsFailure(mission: GenerationalMission): LegacyFailureCheck {
    const adaptationLevel = mission.resources.adaptationLevel || 0;
    const unity = mission.resources.unity || 0.5;
    const bodyHorrorEvents = 2; // Would be tracked

    const riskFactors = [];
    let riskLevel = 0;

    if (adaptationLevel > 0.8) {
      riskFactors.push('Extreme divergence from baseline humanity');
      riskLevel += 40;
    }

    if (bodyHorrorEvents > 3) {
      riskFactors.push('Multiple failed enhancement events');
      riskLevel += 30;
    }

    if (unity < 0.2) {
      riskFactors.push('Population fragmenting into incompatible subspecies');
      riskLevel += 35;
    }

    const isAtRisk = riskLevel > 50;
    const warnings = [];

    if (riskLevel > 30) {
      warnings.push('Humanity loss warning: Population becoming unrecognizably altered');
    }
    if (riskLevel > 60) {
      warnings.push('CRITICAL: Imminent speciation event - civil war likely');
    }

    return { isAtRisk, riskLevel, warnings, failureType: 'humanity_loss' };
  }

  // Check Wanderers Failure: Fleet Dissolution
  private static checkWanderersFailure(mission: GenerationalMission): LegacyFailureCheck {
    const fuel = mission.resources.fuel || 0;
    const unity = mission.resources.unity || 0.5;
    const existentialDread = 40; // Would be tracked
    const resourceScarcity = this.calculateResourceScarcity(mission.resources);

    const riskFactors = [];
    let riskLevel = 0;

    if (fuel < 200) {
      riskFactors.push('Critical fuel shortage threatens fleet mobility');
      riskLevel += 35;
    }

    if (resourceScarcity > 0.7) {
      riskFactors.push('Severe resource depletion across all categories');
      riskLevel += 30;
    }

    if (existentialDread > 70) {
      riskFactors.push('Population losing hope in endless journey');
      riskLevel += 25;
    }

    if (unity < 0.2) {
      riskFactors.push('Fleet ships operating independently');
      riskLevel += 40;
    }

    const isAtRisk = riskLevel > 50;
    const warnings = [];

    if (riskLevel > 30) {
      warnings.push('Fleet dissolution warning: Ships may separate permanently');
    }
    if (riskLevel > 60) {
      warnings.push('CRITICAL: Fleet breakup imminent - ships going rogue');
    }

    return { isAtRisk, riskLevel, warnings, failureType: 'fleet_dissolution' };
  }

  // Get Legacy-Specific Event Modifiers
  static getLegacyEventModifiers(legacy: LegacyTypeType, eventCategory: string): number {
    const modifiers: Record<LegacyTypeType, Record<string, number>> = {
      preservers: {
        'cultural': 0.3,
        'tradition': 0.4,
        'stability': 0.2,
        'innovation': -0.2,
        'risk': -0.3
      },
      adaptors: {
        'evolution': 0.4,
        'innovation': 0.3,
        'risk': 0.2,
        'stability': -0.2,
        'tradition': -0.4
      },
      wanderers: {
        'survival': 0.4,
        'resource': 0.3,
        'mobility': 0.3,
        'stability': -0.3,
        'long_term': -0.2
      }
    };

    return modifiers[legacy][eventCategory] || 0;
  }
}

// Helper Interfaces
interface LegacyDilemmaResult {
  resourceChanges: Partial<ExtendedResources>;
  populationEffects: PopulationEffect[];
  longTermConsequences: string[];
  legacySpecificEffects: Record<string, number>;
}

interface PreserverMetrics {
  traditionSupport: number;
  adaptationNeed: number;
  culturalStress: number;
  generationGap: number;
}

interface AdaptorMetrics {
  enhancementPressure: number;
  humanityDrift: number;
  enhancementResistance: number;
  innovationPotential: number;
}

interface WandererMetrics {
  resourceScarcity: number;
  piracyReputation: number;
  existentialDread: number;
  fleetCohesion: number;
}

interface LegacyFailureCheck {
  isAtRisk: boolean;
  riskLevel: number;
  warnings: string[];
  failureType?: string;
}
