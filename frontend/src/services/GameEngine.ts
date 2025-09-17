// services/GameEngine.ts
import type { CrewMember, Resources, Ship, StarSystem, Planet } from '../types/game';
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

  static generateRandomCrew(): CrewMember {
    const names = GAME_CONSTANTS.RANDOM_NAMES.CREW_FIRST_NAMES;
    const roles = GAME_CONSTANTS.CREW_ROLES;
    const backgrounds = GAME_CONSTANTS.CREW_BACKGROUNDS;

    return {
      id: Date.now(),
      name: names[Math.floor(Math.random() * names.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      skills: {
        engineering: Math.floor(Math.random() * (GAME_CONSTANTS.LIMITS.MAX_RANDOM_SKILL - GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL + 1)) + GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL,
        navigation: Math.floor(Math.random() * (GAME_CONSTANTS.LIMITS.MAX_RANDOM_SKILL - GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL + 1)) + GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL,
        combat: Math.floor(Math.random() * (GAME_CONSTANTS.LIMITS.MAX_RANDOM_SKILL - GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL + 1)) + GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL,
        diplomacy: Math.floor(Math.random() * (GAME_CONSTANTS.LIMITS.MAX_RANDOM_SKILL - GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL + 1)) + GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL,
        trade: Math.floor(Math.random() * (GAME_CONSTANTS.LIMITS.MAX_RANDOM_SKILL - GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL + 1)) + GAME_CONSTANTS.LIMITS.MIN_RANDOM_SKILL
      },
      morale: Math.floor(Math.random() * (GAME_CONSTANTS.LIMITS.MAX_CREW_MORALE - GAME_CONSTANTS.LIMITS.MIN_CREW_MORALE + 1)) + GAME_CONSTANTS.LIMITS.MIN_CREW_MORALE,
      background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
      age: Math.floor(Math.random() * (GAME_CONSTANTS.LIMITS.MAX_CREW_AGE - GAME_CONSTANTS.LIMITS.MIN_CREW_AGE + 1)) + GAME_CONSTANTS.LIMITS.MIN_CREW_AGE,
      isHeir: false
    };
  }

  static generatePlanets(): Planet[] {
    const planetTypes = GAME_CONSTANTS.PLANET_TYPES;
    const resourceTypes = GAME_CONSTANTS.RESOURCE_TYPES;
    const planetCount = Math.floor(Math.random() * (GAME_CONSTANTS.WORLD_GENERATION.MAX_PLANETS_PER_SYSTEM - GAME_CONSTANTS.WORLD_GENERATION.MIN_PLANETS_PER_SYSTEM + 1)) + GAME_CONSTANTS.WORLD_GENERATION.MIN_PLANETS_PER_SYSTEM;
    const planets: Planet[] = [];

    for (let i = 0; i < planetCount; i++) {
      const type = planetTypes[Math.floor(Math.random() * planetTypes.length)];
      const resourceCount = Math.floor(Math.random() * (GAME_CONSTANTS.WORLD_GENERATION.MAX_RESOURCES_PER_PLANET - GAME_CONSTANTS.WORLD_GENERATION.MIN_RESOURCES_PER_PLANET + 1)) + GAME_CONSTANTS.WORLD_GENERATION.MIN_RESOURCES_PER_PLANET;
      const resources: string[] = [];

      for (let j = 0; j < resourceCount; j++) {
        const resource = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
        if (!resources.includes(resource)) {
          resources.push(resource);
        }
      }

      planets.push({
        name: `Planet ${String.fromCharCode(65 + i)}`,
        type,
        resources,
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

  static processMoraleBoost(resources: Resources, crew: CrewMember[]): { newResources: Resources; updatedCrew: CrewMember[] } | null {
    const validation = ValidationService.validateMoraleBoost(resources.credits);
    if (!validation.isValid) return null;

    const newResources = ResourceService.deductCost(resources, { credits: GAME_CONSTANTS.COSTS.MORALE_BOOST });
    const updatedCrew = this.calculateMoraleBoost(crew);

    return { newResources, updatedCrew };
  }

  static processCrewTraining(resources: Resources, crew: CrewMember[]): { newResources: Resources; result: { updatedCrew: CrewMember[]; trainedMember: CrewMember; skill: string } } | null {
    const validation = ValidationService.validateCrewTraining(resources.credits);
    if (!validation.isValid) return null;

    const newResources = ResourceService.deductCost(resources, { credits: GAME_CONSTANTS.COSTS.CREW_TRAINING });
    const result = this.trainRandomCrew(crew);

    return { newResources, result };
  }

  static processCrewRecruitment(resources: Resources, crew: CrewMember[], ship: Ship): { newResources: Resources; newCrew: CrewMember } | null {
    const validation = ValidationService.validateCrewRecruitment(resources.credits, crew, ship);
    if (!validation.isValid) return null;

    const newResources = ResourceService.deductCost(resources, { credits: GAME_CONSTANTS.COSTS.CREW_RECRUITMENT });
    const newCrew = this.generateRandomCrew();

    return { newResources, newCrew };
  }

  static processSystemExploration(resources: Resources, selectedSystem: StarSystem | null): { newResources: Resources; planets: Planet[] } | null {
    if (!selectedSystem) return null;

    const validation = ValidationService.validateSystemExploration(resources.energy);
    if (!validation.isValid) return null;

    const newResources = ResourceService.deductCost(resources, { energy: GAME_CONSTANTS.COSTS.EXPLORATION.energy });
    const planets = this.generatePlanets();

    return { newResources, planets };
  }

  static processColonyEstablishment(resources: Resources, selectedSystem: StarSystem | null): { newResources: Resources; colonyPlanet: Planet; newGenerationRate: Partial<Resources> } | null {
    if (!selectedSystem) return null;

    const validation = ValidationService.validateColonyEstablishment(resources);
    if (!validation.isValid) return null;

    const newResources = ResourceService.deductCost(resources, {
      credits: GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.credits,
      minerals: GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.minerals
    });

    const undevelopedPlanet = selectedSystem.planets.find(p => !p.developed);
    if (!undevelopedPlanet) return null;

    const newGenerationRate: Partial<Resources> = {};
    undevelopedPlanet.resources.forEach(resource => {
      if (newGenerationRate[resource as keyof Resources] !== undefined) {
        newGenerationRate[resource as keyof Resources] = (newGenerationRate[resource as keyof Resources] || 0) + GAME_CONSTANTS.RESOURCE_GENERATION.COLONY_BOOST;
      }
    });

    return { newResources, colonyPlanet: undevelopedPlanet, newGenerationRate };
  }
}