// stores/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameData, CrewMember, StarSystem, Planet, Notification, ShipStats, ComponentCost } from '../types/game';
import { GAME_CONSTANTS } from '../constants/gameConstants';
import type { TabIdType, TradeActionType } from '../types/enums';
import { ResourceService } from '../services/ResourceService';
import { ValidationService } from '../services/ValidationService';
import gameConfig from '../config/gameConfig';
import Logger from '../utils/logger';

const initialGameData: GameData = {
  resources: {
    credits: 1000,
    energy: 100,
    minerals: 50,
    food: 80,
    influence: 25
  },
  ship: {
    name: "Pioneer's Dream",
    hull: "Light Corvette",
    components: {
      engine: "Basic Thruster",
      cargo: "Standard Bay",
      weapons: "Light Laser",
      research: "Basic Scanner",
      quarters: "Crew Quarters"
    },
    stats: {
      speed: 3,
      cargo: 100,
      combat: 2,
      research: 1,
      crewCapacity: 6
    }
  },
  crew: [
    {
      id: 1,
      name: "Captain Elena Voss",
      role: "Captain",
      skills: {engineering: 6, navigation: 8, combat: 7, diplomacy: 9, trade: 5},
      morale: 85,
      background: "Former military officer turned explorer",
      age: 35,
      isHeir: false
    },
    {
      id: 2,
      name: "Chief Engineer Marcus Cole",
      role: "Engineer",
      skills: {engineering: 9, navigation: 4, combat: 5, diplomacy: 3, trade: 2},
      morale: 90,
      background: "Shipyard veteran with decades of experience",
      age: 28,
      isHeir: false
    },
    {
      id: 3,
      name: "Navigator Zara Chen",
      role: "Pilot",
      skills: {engineering: 3, navigation: 9, combat: 6, diplomacy: 5, trade: 4},
      morale: 80,
      background: "Ace pilot from the outer colonies",
      age: 26,
      isHeir: false
    },
    {
      id: 4,
      name: "Trader Kex Thorne",
      role: "Diplomat",
      skills: {engineering: 2, navigation: 3, combat: 4, diplomacy: 8, trade: 9},
      morale: 75,
      background: "Smooth-talking merchant with connections",
      age: 32,
      isHeir: false
    }
  ],
  starSystems: [
    {
      name: "Sol Alpha",
      status: "explored",
      planets: [
        {name: "Terra Prime", type: "Rocky", resources: ["minerals", "energy"], developed: true},
        {name: "Gas Giant Beta", type: "Gas Giant", resources: ["energy", "food"], developed: false}
      ],
      tradeRoutes: [],
      coordinates: {x: 100, y: 100}
    },
    {
      name: "Kepler Station",
      status: "unexplored",
      planets: [{name: "Unknown", type: "Unknown", resources: ["unknown"], developed: false}],
      tradeRoutes: [],
      coordinates: {x: 200, y: 150}
    },
    {
      name: "Vega Outpost",
      status: "unexplored",
      planets: [{name: "Unknown", type: "Unknown", resources: ["unknown"], developed: false}],
      tradeRoutes: [],
      coordinates: {x: 150, y: 250}
    }
  ],
  market: {
    prices: {
      minerals: 15,
      energy: 12,
      food: 8,
      influence: 25
    },
    trends: {
      minerals: "rising",
      energy: "stable",
      food: "falling",
      influence: "rising"
    }
  },
  legacy: {
    generation: 1,
    familyName: "Voss",
    achievements: ["First Command", "System Explorer"],
    traits: ["Natural Leader", "Tech Savvy"],
    reputation: {
      military: 20,
      traders: 15,
      scientists: 10
    }
  },
  shipComponents: {
    hulls: [
      {name: "Light Corvette", cost: {credits: 500}, stats: {speed: 3, cargo: 100, combat: 2}},
      {name: "Heavy Frigate", cost: {credits: 1500, minerals: 200}, stats: {speed: 2, cargo: 200, combat: 5}},
      {name: "Exploration Vessel", cost: {credits: 1200, energy: 150}, stats: {speed: 4, cargo: 150, research: 3}}
    ],
    engines: [
      {name: "Basic Thruster", cost: {credits: 200}, stats: {speed: 1}},
      {name: "Ion Drive", cost: {credits: 800, energy: 100}, stats: {speed: 3}},
      {name: "Warp Core", cost: {credits: 2000, energy: 300, minerals: 100}, stats: {speed: 5}}
    ],
    weapons: [
      {name: "Light Laser", cost: {credits: 300}, stats: {combat: 2}},
      {name: "Pulse Cannon", cost: {credits: 800, minerals: 50}, stats: {combat: 4}},
      {name: "Plasma Artillery", cost: {credits: 1500, minerals: 150, energy: 100}, stats: {combat: 7}}
    ]
  }
};

interface GameStore extends GameState {
  // Actions
  initializeGame: () => void;
  switchTab: (tabName: TabIdType) => void;
  updateDisplay: () => void;
  generateResources: () => void;
  trainCrew: () => void;
  boostMorale: () => void;
  recruitCrew: () => void;
  selectSystem: (system: StarSystem) => void;
  exploreSystem: () => void;
  establishColony: () => void;
  switchComponentCategory: (category: keyof typeof initialGameData.shipComponents) => void;
  purchaseComponent: (category: string, componentName: string) => void;
  selectHeir: (heirId: number) => void;
  showNotification: (message: string, type?: Notification['type']) => void;
  clearNotification: (id: string) => void;
  tradeResource: (resource: 'minerals' | 'energy' | 'food' | 'influence', action: TradeActionType) => void;

  // Helper methods
  canAffordComponent: (cost: ComponentCost) => boolean;
  generateRandomCrew: () => CrewMember;
  generatePlanets: () => Planet[];

  // Cleanup
  cleanup: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialGameData,
      selectedSystem: null,
      currentComponentCategory: 'hulls',
      resourceGenerationRate: {
        credits: GAME_CONSTANTS.RESOURCE_GENERATION.BASE_RATES.CREDITS,
        energy: GAME_CONSTANTS.RESOURCE_GENERATION.BASE_RATES.ENERGY,
        minerals: GAME_CONSTANTS.RESOURCE_GENERATION.BASE_RATES.MINERALS,
        food: GAME_CONSTANTS.RESOURCE_GENERATION.BASE_RATES.FOOD,
        influence: GAME_CONSTANTS.RESOURCE_GENERATION.BASE_RATES.INFLUENCE
      },
      currentTab: 'dashboard',
      notifications: [],

      initializeGame: () => {
        Logger.info('Initializing game store');
        // Start resource generation
        const generateResources = () => {
          get().generateResources();
        };
        generateResources();
        const interval = setInterval(generateResources, gameConfig.intervals.resourceGeneration);
        // Store interval ID for cleanup if needed
        (window as any).resourceInterval = interval;
        Logger.info('Game initialized successfully');
      },

      switchTab: (tabName: TabIdType) => {
        set({ currentTab: tabName });
      },

      updateDisplay: () => {
        // This will trigger re-renders in React components
        // No need to manually update DOM elements
      },

      generateResources: () => {
        const { resources, resourceGenerationRate } = get();
        const newResources = ResourceService.generateResources(resources, resourceGenerationRate);
        set({ resources: newResources });
        Logger.resourceChange('all', 0, 'Resource generation tick');
      },

      trainCrew: () => {
        const { resources, crew } = get();
        const validation = ValidationService.validateCrewTraining(resources.credits);

        if (!validation.isValid) {
          get().showNotification(validation.message!, 'error');
          return;
        }

        const newResources = ResourceService.deductCost(resources, { credits: GAME_CONSTANTS.COSTS.CREW_TRAINING });
        const randomCrew = crew[Math.floor(Math.random() * crew.length)];
        const skills = Object.keys(randomCrew.skills) as (keyof typeof randomCrew.skills)[];
        const randomSkill = skills[Math.floor(Math.random() * skills.length)];

        const updatedCrew = crew.map(member =>
          member.id === randomCrew.id
            ? { ...member, skills: { ...member.skills, [randomSkill]: Math.min(GAME_CONSTANTS.LIMITS.MAX_SKILL_LEVEL, member.skills[randomSkill] + 1) } }
            : member
        );

        set({ resources: newResources, crew: updatedCrew });
        get().showNotification(`${randomCrew.name} improved their ${randomSkill} skill!`, 'success');
        Logger.crewAction('skill_training', randomCrew.name, { skill: randomSkill, newLevel: updatedCrew.find(c => c.id === randomCrew.id)?.skills[randomSkill] });
      },

      boostMorale: () => {
        const { resources, crew } = get();
        const validation = ValidationService.validateMoraleBoost(resources.credits);

        if (!validation.isValid) {
          get().showNotification(validation.message!, 'error');
          return;
        }

        const newResources = ResourceService.deductCost(resources, { credits: GAME_CONSTANTS.COSTS.MORALE_BOOST });
        const updatedCrew = crew.map(member => ({ ...member, morale: Math.min(GAME_CONSTANTS.LIMITS.MAX_MORALE, member.morale + GAME_CONSTANTS.LIMITS.CREW_MORALE_BOOST) }));

        set({ resources: newResources, crew: updatedCrew });
        get().showNotification('Crew morale improved!', 'success');
        Logger.gameAction('morale_boost', { affectedCrew: updatedCrew.length });
      },

      recruitCrew: () => {
        const { resources, crew, ship } = get();
        const validation = ValidationService.validateCrewRecruitment(resources.credits, crew, ship);

        if (!validation.isValid) {
          get().showNotification(validation.message!, 'error');
          return;
        }

        const newResources = ResourceService.deductCost(resources, { credits: GAME_CONSTANTS.COSTS.CREW_RECRUITMENT });
        const newCrew = get().generateRandomCrew();
        const updatedCrew = [...crew, newCrew];

        set({ resources: newResources, crew: updatedCrew });
        get().showNotification(`Recruited ${newCrew.name}!`, 'success');
        Logger.crewAction('recruitment', newCrew.name, { role: newCrew.role });
      },

      generateRandomCrew: () => {
        // Memoized constant arrays to avoid recreation on each call
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
      },

      selectSystem: (system: StarSystem) => {
        set({ selectedSystem: system });
      },

      exploreSystem: () => {
        const { selectedSystem, resources } = get();
        const validation = ValidationService.validateSystemExploration(resources.energy);

        if (!validation.isValid) {
          get().showNotification(validation.message!, 'error');
          return;
        }

        if (selectedSystem) {
          const newResources = ResourceService.deductCost(resources, { energy: GAME_CONSTANTS.COSTS.EXPLORATION.energy });
          const planets = get().generatePlanets();
          const updatedSystem = { ...selectedSystem, status: 'explored' as const, planets };

          const updatedSystems = get().starSystems.map(sys =>
            sys.name === selectedSystem.name ? updatedSystem : sys
          );

          set({ resources: newResources, starSystems: updatedSystems, selectedSystem: updatedSystem });
          get().showNotification(`Explored ${selectedSystem.name}! Discovered ${planets.length} planets.`, 'success');
          Logger.systemEvent('exploration', selectedSystem.name, { planetsDiscovered: planets.length });
        }
      },

      establishColony: () => {
        const { selectedSystem, resources, resourceGenerationRate } = get();
        const validation = ValidationService.validateColonyEstablishment(resources);

        if (!validation.isValid) {
          get().showNotification(validation.message!, 'error');
          return;
        }

        if (selectedSystem) {
          const newResources = ResourceService.deductCost(resources, {
            credits: GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.credits,
            minerals: GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.minerals
          });

          const undevelopedPlanet = selectedSystem.planets.find(p => !p.developed);
          if (undevelopedPlanet) {
            const updatedPlanets = selectedSystem.planets.map(p =>
              p.name === undevelopedPlanet.name ? { ...p, developed: true } : p
            );

            const newGenerationRate = { ...resourceGenerationRate };
            undevelopedPlanet.resources.forEach(resource => {
              if (newGenerationRate[resource as keyof typeof newGenerationRate] !== undefined) {
                newGenerationRate[resource as keyof typeof newGenerationRate]! += GAME_CONSTANTS.RESOURCE_GENERATION.COLONY_BOOST;
              }
            });

            const updatedSystem = { ...selectedSystem, planets: updatedPlanets };
            const updatedSystems = get().starSystems.map(sys =>
              sys.name === selectedSystem.name ? updatedSystem : sys
            );

            set({
              resources: newResources,
              starSystems: updatedSystems,
              selectedSystem: updatedSystem,
              resourceGenerationRate: newGenerationRate
            });

            get().showNotification(`Established colony on ${undevelopedPlanet.name}!`, 'success');
            Logger.systemEvent('colony_established', selectedSystem.name, { planet: undevelopedPlanet.name });
          }
        }
      },

      generatePlanets: () => {
        // Memoized constant arrays to avoid recreation on each call
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
      },

      switchComponentCategory: (category) => {
        set({ currentComponentCategory: category });
      },

      canAffordComponent: (cost: ComponentCost) => {
        const { resources } = get();
        return ResourceService.canAfford(resources, cost);
      },

      purchaseComponent: (category: string, componentName: string) => {
        const { shipComponents, resources, ship } = get();
        const component = shipComponents[category as keyof typeof shipComponents].find(c => c.name === componentName);

        if (component && get().canAffordComponent(component.cost)) {
          // Deduct cost using ResourceService
          const newResources = ResourceService.deductCost(resources, component.cost);

          let updatedShip = { ...ship };

          if (category === 'hulls') {
            updatedShip = {
              ...updatedShip,
              hull: component.name,
              stats: { ...component.stats } as ShipStats // Hull replaces all stats
            };
          } else {
            const componentType = category.slice(0, -1); // Remove 's' from plural
            updatedShip.components = {
              ...updatedShip.components,
              [componentType]: component.name
            };

            // Add component stats to ship
            updatedShip.stats = { ...updatedShip.stats };
            Object.entries(component.stats).forEach(([stat, value]) => {
              if (updatedShip.stats[stat as keyof typeof updatedShip.stats] !== undefined) {
                updatedShip.stats[stat as keyof typeof updatedShip.stats] += value as number;
              }
            });
          }

          set({ resources: newResources, ship: updatedShip });
          get().showNotification(`Installed ${component.name}!`, 'success');
        }
      },

      selectHeir: (heirId: number) => {
        const { crew } = get();
        const updatedCrew = crew.map(member => ({ ...member, isHeir: member.id === heirId }));
        const heir = updatedCrew.find(m => m.id === heirId);

        set({ crew: updatedCrew });
        if (heir) {
          get().showNotification(`${heir.name} selected as heir!`, 'success');
        }
      },

      showNotification: (message: string, type: Notification['type'] = 'info') => {
        const notification: Notification = {
          id: Date.now().toString(),
          message,
          type,
          timestamp: Date.now()
        };

        set(state => ({ notifications: [...state.notifications, notification] }));

        // Auto-remove after configured timeout
        setTimeout(() => {
          get().clearNotification(notification.id);
        }, gameConfig.intervals.notificationTimeout);
      },

      clearNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      tradeResource: (resource: 'minerals' | 'energy' | 'food' | 'influence', action: TradeActionType) => {
        const { resources, market } = get();
        const price = market.prices[resource];
        const validation = ValidationService.validateTrade(resources, resource, action, price);

        if (!validation.isValid) {
          get().showNotification(validation.message!, 'error');
          return;
        }

        const amount = GAME_CONSTANTS.TRADE.DEFAULT_AMOUNT;
        const cost = ResourceService.calculateTradeCost(price, amount);
        const isBuying = action === 'buy';
        const newResources = ResourceService.processTrade(resources, cost, resource, amount, isBuying);

        set({ resources: newResources });
        get().showNotification(`${isBuying ? 'Bought' : 'Sold'} ${amount} ${resource} for ${cost} credits`, 'success');
        Logger.gameAction('trade', { resource, action: isBuying ? 'buy' : 'sell', amount, cost });
      },

      cleanup: () => {
        if ((window as any).resourceInterval) {
          clearInterval((window as any).resourceInterval);
          (window as any).resourceInterval = null;
          Logger.info('Game store cleanup completed');
        }
      }
    }),
    {
      name: 'stellar-legacy-storage',
      partialize: (state) => ({
        ...state,
        notifications: [] // Don't persist notifications
      })
    }
  )
);

// Cleanup function to clear intervals and prevent memory leaks
export const cleanupGameStore = () => {
  if ((window as any).resourceInterval) {
    clearInterval((window as any).resourceInterval);
    (window as any).resourceInterval = null;
  }
};