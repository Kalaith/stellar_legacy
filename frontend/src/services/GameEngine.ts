// services/GameEngine.ts
import type { CrewMember, Resources, Ship, StarSystem, Planet } from '../types/game';
import type { GameOperationResult } from '../types/errors';
import { GameOperationError } from '../types/errors';
import { CrewIdGenerator } from '../types/branded';
import { GAME_CONSTANTS } from '../constants/gameConstants';
import { ResourceService } from './ResourceService';
import { ValidationService } from './ValidationService';

export class GameEngine {
  static calculateMoraleBoost(crew: CrewMember[]): CrewMember[] {
    return crew.map(member => ({
      ...member,
      morale: Math.min(GAME_CONSTANTS.LIMITS.MAX_MORALE, member.morale + GAME_CONSTANTS.LIMITS.CREW_MORALE_BOOST)
    }));
  }

  static trainRandomCrew(crew: CrewMember[]): { updatedCrew: CrewMember[]; trainedMember: CrewMember; skill: string } {
    const randomCrew = crew[Math.floor(Math.random() * crew.length)];
    const skills = Object.keys(randomCrew.skills) as (keyof typeof randomCrew.skills)[];
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];

    const updatedCrew = crew.map(member =>
      member.id === randomCrew.id
        ? { ...member, skills: { ...member.skills, [randomSkill]: Math.min(GAME_CONSTANTS.LIMITS.MAX_SKILL_LEVEL, member.skills[randomSkill] + 1) } }
        : member
    );

    return { updatedCrew, trainedMember: randomCrew, skill: randomSkill };
  }

  private static generateRandomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static getRandomFromArray<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static generateRandomSkill(): number {
    return this.generateRandomInRange(
      GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL,
      GAME_CONSTANTS.LIMITS.MAX_RANDOM_SKILL
    );
  }

  private static generateSkillSet(): CrewMember['skills'] {
    return {
      engineering: this.generateRandomSkill(),
      navigation: this.generateRandomSkill(),
      combat: this.generateRandomSkill(),
      diplomacy: this.generateRandomSkill(),
      trade: this.generateRandomSkill()
    };
  }

  static generateRandomCrew(): CrewMember {
    return {
      id: CrewIdGenerator.generate(),
      name: this.getRandomFromArray(GAME_CONSTANTS.RANDOM_NAMES.CREW_FIRST_NAMES),
      role: this.getRandomFromArray(GAME_CONSTANTS.CREW_ROLES),
      skills: this.generateSkillSet(),
      morale: this.generateRandomInRange(
        GAME_CONSTANTS.LIMITS.MIN_CREW_MORALE,
        GAME_CONSTANTS.LIMITS.MAX_CREW_MORALE
      ),
      background: this.getRandomFromArray(GAME_CONSTANTS.CREW_BACKGROUNDS),
      age: this.generateRandomInRange(
        GAME_CONSTANTS.LIMITS.MIN_CREW_AGE,
        GAME_CONSTANTS.LIMITS.MAX_CREW_AGE
      ),
      isHeir: false
    };
  }

  private static generatePlanetResources(): string[] {
    const resourceCount = this.generateRandomInRange(
      GAME_CONSTANTS.WORLD_GENERATION.MIN_RESOURCES_PER_PLANET,
      GAME_CONSTANTS.WORLD_GENERATION.MAX_RESOURCES_PER_PLANET
    );

    const resources = new Set<string>();
    const maxAttempts = resourceCount * 3; // Prevent infinite loop
    let attempts = 0;

    while (resources.size < resourceCount && attempts < maxAttempts) {
      const resource = this.getRandomFromArray(GAME_CONSTANTS.RESOURCE_TYPES);
      resources.add(resource);
      attempts++;
    }

    return Array.from(resources);
  }

  private static generatePlanetName(systemName: string, index: number): string {
    const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'] as const;
    const suffixes = ['Prime', 'Major', 'Minor', 'Station', 'Outpost', 'Colony', 'Base', 'Haven'] as const;

    const prefix = prefixes[index] || `Planet-${index + 1}`;
    const suffix = this.getRandomFromArray(suffixes);

    return `${systemName} ${prefix} ${suffix}`;
  }

  static generatePlanets(systemName: string = 'Unknown'): Planet[] {
    const planetCount = this.generateRandomInRange(
      GAME_CONSTANTS.WORLD_GENERATION.MIN_PLANETS_PER_SYSTEM,
      GAME_CONSTANTS.WORLD_GENERATION.MAX_PLANETS_PER_SYSTEM
    );

    const planets: Planet[] = [];

    for (let i = 0; i < planetCount; i++) {
      planets.push({
        name: this.generatePlanetName(systemName, i),
        type: this.getRandomFromArray(GAME_CONSTANTS.PLANET_TYPES),
        resources: this.generatePlanetResources(),
        developed: false
      });
    }

    return planets;
  }

  static calculateEmpireStats(starSystems: StarSystem[], legacy: { generation: number }) {
    const exploredSystems = starSystems.filter(s => s.status === 'explored').length;
    const activeColonies = starSystems.reduce((acc, sys) =>
      acc + sys.planets.filter(p => p.developed).length, 0
    );
    const tradeRoutes = starSystems.reduce((acc, sys) => acc + sys.tradeRoutes.length, 0);

    return {
      exploredSystems,
      activeColonies,
      tradeRoutes,
      generation: legacy.generation
    };
  }

  static processMoraleBoost(resources: Resources, crew: CrewMember[]): GameOperationResult<{ newResources: Resources; updatedCrew: CrewMember[] }> {
    const validation = ValidationService.validateMoraleBoost(resources.credits);
    if (!validation.isValid) {
      return {
        success: false,
        error: new GameOperationError(
          'Morale Boost',
          validation.message || 'Insufficient resources',
          { credits: GAME_CONSTANTS.COSTS.MORALE_BOOST }
        )
      };
    }

    const newResources = ResourceService.deductCost(resources, { credits: GAME_CONSTANTS.COSTS.MORALE_BOOST });
    const updatedCrew = this.calculateMoraleBoost(crew);

    return { success: true, data: { newResources, updatedCrew } };
  }

  static processCrewTraining(resources: Resources, crew: CrewMember[]): GameOperationResult<{ newResources: Resources; result: { updatedCrew: CrewMember[]; trainedMember: CrewMember; skill: string } }> {
    const validation = ValidationService.validateCrewTraining(resources.credits);
    if (!validation.isValid) {
      return {
        success: false,
        error: new GameOperationError(
          'Crew Training',
          validation.message || 'Insufficient resources',
          { credits: GAME_CONSTANTS.COSTS.CREW_TRAINING }
        )
      };
    }

    const newResources = ResourceService.deductCost(resources, { credits: GAME_CONSTANTS.COSTS.CREW_TRAINING });
    const result = this.trainRandomCrew(crew);

    return { success: true, data: { newResources, result } };
  }

  static processCrewRecruitment(resources: Resources, crew: CrewMember[], ship: Ship): GameOperationResult<{ newResources: Resources; newCrew: CrewMember }> {
    const validation = ValidationService.validateCrewRecruitment(resources.credits, crew, ship);
    if (!validation.isValid) {
      return {
        success: false,
        error: new GameOperationError(
          'Crew Recruitment',
          validation.message || 'Cannot recruit crew',
          { credits: GAME_CONSTANTS.COSTS.CREW_RECRUITMENT }
        )
      };
    }

    const newResources = ResourceService.deductCost(resources, { credits: GAME_CONSTANTS.COSTS.CREW_RECRUITMENT });
    const newCrew = this.generateRandomCrew();

    return { success: true, data: { newResources, newCrew } };
  }

  static processSystemExploration(resources: Resources, selectedSystem: StarSystem | null): GameOperationResult<{ newResources: Resources; planets: Planet[] }> {
    if (!selectedSystem) {
      return {
        success: false,
        error: new GameOperationError('System Exploration', 'No system selected')
      };
    }

    const validation = ValidationService.validateSystemExploration(resources.energy);
    if (!validation.isValid) {
      return {
        success: false,
        error: new GameOperationError(
          'System Exploration',
          validation.message || 'Insufficient energy',
          { energy: GAME_CONSTANTS.COSTS.EXPLORATION.energy }
        )
      };
    }

    const newResources = ResourceService.deductCost(resources, { energy: GAME_CONSTANTS.COSTS.EXPLORATION.energy });
    const planets = this.generatePlanets(selectedSystem.name);

    return { success: true, data: { newResources, planets } };
  }

  static processColonyEstablishment(resources: Resources, selectedSystem: StarSystem | null): GameOperationResult<{ newResources: Resources; colonyPlanet: Planet; newGenerationRate: Partial<Resources> }> {
    if (!selectedSystem) {
      return {
        success: false,
        error: new GameOperationError('Colony Establishment', 'No system selected')
      };
    }

    const validation = ValidationService.validateColonyEstablishment(resources);
    if (!validation.isValid) {
      return {
        success: false,
        error: new GameOperationError(
          'Colony Establishment',
          validation.message || 'Insufficient resources',
          {
            credits: GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.credits,
            minerals: GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.minerals
          }
        )
      };
    }

    const undevelopedPlanet = selectedSystem.planets.find(p => !p.developed);
    if (!undevelopedPlanet) {
      return {
        success: false,
        error: new GameOperationError('Colony Establishment', 'No undeveloped planets available')
      };
    }

    const newResources = ResourceService.deductCost(resources, {
      credits: GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.credits,
      minerals: GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.minerals
    });

    const newGenerationRate: Partial<Resources> = {};
    undevelopedPlanet.resources.forEach(resource => {
      if (newGenerationRate[resource as keyof Resources] !== undefined) {
        newGenerationRate[resource as keyof Resources] = (newGenerationRate[resource as keyof Resources] || 0) + GAME_CONSTANTS.RESOURCE_GENERATION.COLONY_BOOST;
      }
    });

    return { success: true, data: { newResources, colonyPlanet: undevelopedPlanet, newGenerationRate } };
  }
}