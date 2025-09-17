// stores/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  GameData,
  CrewMember,
  StarSystem,
  Planet,
  Notification,
  ComponentCost,
  ShipStats,
} from '../types/game';

const initialGameData: GameData = {
  resources: {
    credits: 1000,
    energy: 100,
    minerals: 50,
    food: 80,
    influence: 25,
  },
  ship: {
    name: "Pioneer's Dream",
    hull: 'Light Corvette',
    components: {
      engine: 'Basic Thruster',
      cargo: 'Standard Bay',
      weapons: 'Light Laser',
      research: 'Basic Scanner',
      quarters: 'Crew Quarters',
    },
    stats: {
      speed: 3,
      cargo: 100,
      combat: 2,
      research: 1,
      crewCapacity: 6,
    },
  },
  crew: [
    {
      id: 1,
      name: 'Captain Elena Voss',
      role: 'Captain',
      skills: {
        engineering: 6,
        navigation: 8,
        combat: 7,
        diplomacy: 9,
        trade: 5,
      },
      morale: 85,
      background: 'Former military officer turned explorer',
      age: 35,
      isHeir: false,
    },
    {
      id: 2,
      name: 'Chief Engineer Marcus Cole',
      role: 'Engineer',
      skills: {
        engineering: 9,
        navigation: 4,
        combat: 5,
        diplomacy: 3,
        trade: 2,
      },
      morale: 90,
      background: 'Shipyard veteran with decades of experience',
      age: 28,
      isHeir: false,
    },
    {
      id: 3,
      name: 'Navigator Zara Chen',
      role: 'Pilot',
      skills: {
        engineering: 3,
        navigation: 9,
        combat: 6,
        diplomacy: 5,
        trade: 4,
      },
      morale: 80,
      background: 'Ace pilot from the outer colonies',
      age: 26,
      isHeir: false,
    },
    {
      id: 4,
      name: 'Trader Kex Thorne',
      role: 'Diplomat',
      skills: {
        engineering: 2,
        navigation: 3,
        combat: 4,
        diplomacy: 8,
        trade: 9,
      },
      morale: 75,
      background: 'Smooth-talking merchant with connections',
      age: 32,
      isHeir: false,
    },
  ],
  starSystems: [
    {
      name: 'Sol Alpha',
      status: 'explored',
      planets: [
        {
          name: 'Terra Prime',
          type: 'Rocky',
          resources: ['minerals', 'energy'],
          developed: true,
        },
        {
          name: 'Gas Giant Beta',
          type: 'Gas Giant',
          resources: ['energy', 'food'],
          developed: false,
        },
      ],
      tradeRoutes: [],
      coordinates: { x: 100, y: 100 },
    },
    {
      name: 'Kepler Station',
      status: 'unexplored',
      planets: [
        {
          name: 'Unknown',
          type: 'Unknown',
          resources: ['unknown'],
          developed: false,
        },
      ],
      tradeRoutes: [],
      coordinates: { x: 200, y: 150 },
    },
    {
      name: 'Vega Outpost',
      status: 'unexplored',
      planets: [
        {
          name: 'Unknown',
          type: 'Unknown',
          resources: ['unknown'],
          developed: false,
        },
      ],
      tradeRoutes: [],
      coordinates: { x: 150, y: 250 },
    },
  ],
  market: {
    prices: {
      minerals: 15,
      energy: 12,
      food: 8,
      influence: 25,
    },
    trends: {
      minerals: 'rising',
      energy: 'stable',
      food: 'falling',
      influence: 'rising',
    },
  },
  legacy: {
    generation: 1,
    familyName: 'Voss',
    achievements: ['First Command', 'System Explorer'],
    traits: ['Natural Leader', 'Tech Savvy'],
    reputation: {
      military: 20,
      traders: 15,
      scientists: 10,
    },
  },
  shipComponents: {
    hulls: [
      {
        name: 'Light Corvette',
        cost: { credits: 500 },
        stats: { speed: 3, cargo: 100, combat: 2 },
      },
      {
        name: 'Heavy Frigate',
        cost: { credits: 1500, minerals: 200 },
        stats: { speed: 2, cargo: 200, combat: 5 },
      },
      {
        name: 'Exploration Vessel',
        cost: { credits: 1200, energy: 150 },
        stats: { speed: 4, cargo: 150, research: 3 },
      },
    ],
    engines: [
      { name: 'Basic Thruster', cost: { credits: 200 }, stats: { speed: 1 } },
      {
        name: 'Ion Drive',
        cost: { credits: 800, energy: 100 },
        stats: { speed: 3 },
      },
      {
        name: 'Warp Core',
        cost: { credits: 2000, energy: 300, minerals: 100 },
        stats: { speed: 5 },
      },
    ],
    weapons: [
      { name: 'Light Laser', cost: { credits: 300 }, stats: { combat: 2 } },
      {
        name: 'Pulse Cannon',
        cost: { credits: 800, minerals: 50 },
        stats: { combat: 4 },
      },
      {
        name: 'Plasma Artillery',
        cost: { credits: 1500, minerals: 150, energy: 100 },
        stats: { combat: 7 },
      },
    ],
  },
};

interface GameStore extends GameState {
  // Actions
  initializeGame: () => void;
  switchTab: (tabName: string) => void;
  updateDisplay: () => void;
  generateResources: () => void;
  trainCrew: () => void;
  boostMorale: () => void;
  recruitCrew: () => void;
  selectSystem: (system: StarSystem) => void;
  exploreSystem: () => void;
  establishColony: () => void;
  switchComponentCategory: (
    category: keyof typeof initialGameData.shipComponents
  ) => void;
  purchaseComponent: (category: string, componentName: string) => void;
  selectHeir: (heirId: number) => void;
  showNotification: (message: string, type?: Notification['type']) => void;
  clearNotification: (id: string) => void;
  tradeResource: (
    resource: 'minerals' | 'energy' | 'food' | 'influence',
    action: 'buy' | 'sell'
  ) => void;

  // Helper methods
  canAffordComponent: (cost: ComponentCost) => boolean;
  generateRandomCrew: () => CrewMember;
  generatePlanets: () => Planet[];
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialGameData,
      selectedSystem: null,
      currentComponentCategory: 'hulls',
      resourceGenerationRate: {
        credits: 2,
        energy: 1,
        minerals: 1,
        food: 1,
        influence: 0.2,
      },
      currentTab: 'dashboard',
      notifications: [],

      initializeGame: () => {
        // Start resource generation
        const generateResources = () => {
          get().generateResources();
        };
        generateResources();
        const interval = setInterval(generateResources, 3000);
        // Store interval ID for cleanup if needed
        (window as Window & { resourceInterval?: number }).resourceInterval =
          interval as unknown as number;
      },

      switchTab: (tabName: string) => {
        set({ currentTab: tabName });
      },

      updateDisplay: () => {
        // This will trigger re-renders in React components
        // No need to manually update DOM elements
      },

      generateResources: () => {
        const { resources, resourceGenerationRate } = get();
        const newResources = { ...resources };

        Object.entries(resourceGenerationRate).forEach(([resource, rate]) => {
          if (
            newResources[resource as keyof typeof newResources] !== undefined
          ) {
            newResources[resource as keyof typeof newResources] += rate;
          }
        });

        set({ resources: newResources });
      },

      trainCrew: () => {
        const { resources, crew } = get();
        if (resources.credits >= 100) {
          const newResources = {
            ...resources,
            credits: resources.credits - 100,
          };
          const randomCrew = crew[Math.floor(Math.random() * crew.length)];
          const skills = Object.keys(
            randomCrew.skills
          ) as (keyof typeof randomCrew.skills)[];
          const randomSkill = skills[Math.floor(Math.random() * skills.length)];

          const updatedCrew = crew.map(member =>
            member.id === randomCrew.id
              ? {
                  ...member,
                  skills: {
                    ...member.skills,
                    [randomSkill]: Math.min(10, member.skills[randomSkill] + 1),
                  },
                }
              : member
          );

          set({ resources: newResources, crew: updatedCrew });
          get().showNotification(
            `${randomCrew.name} improved their ${randomSkill} skill!`,
            'success'
          );
        } else {
          get().showNotification('Not enough credits for training!', 'error');
        }
      },

      boostMorale: () => {
        const { resources, crew } = get();
        if (resources.credits >= 50) {
          const newResources = {
            ...resources,
            credits: resources.credits - 50,
          };
          const updatedCrew = crew.map(member => ({
            ...member,
            morale: Math.min(100, member.morale + 10),
          }));

          set({ resources: newResources, crew: updatedCrew });
          get().showNotification('Crew morale improved!', 'success');
        } else {
          get().showNotification(
            'Not enough credits to boost morale!',
            'error'
          );
        }
      },

      recruitCrew: () => {
        const { resources, crew, ship } = get();
        if (resources.credits >= 200 && crew.length < ship.stats.crewCapacity) {
          const newResources = {
            ...resources,
            credits: resources.credits - 200,
          };
          const newCrew = get().generateRandomCrew();
          const updatedCrew = [...crew, newCrew];

          set({ resources: newResources, crew: updatedCrew });
          get().showNotification(`Recruited ${newCrew.name}!`, 'success');
        } else if (crew.length >= ship.stats.crewCapacity) {
          get().showNotification(
            'Ship at crew capacity! Upgrade living quarters.',
            'warning'
          );
        } else {
          get().showNotification(
            'Not enough credits to recruit crew!',
            'error'
          );
        }
      },

      generateRandomCrew: () => {
        const names = [
          'Alex Rivera',
          'Sam Johnson',
          'Taylor Kim',
          'Jordan Smith',
          'Casey Wu',
        ];
        const roles = ['Engineer', 'Pilot', 'Gunner', 'Scientist', 'Medic'];
        const backgrounds = [
          'Academy graduate seeking adventure',
          'Veteran spacer with mysterious past',
          'Talented rookie with natural abilities',
          'Former corporate employee turned explorer',
        ];

        return {
          id: Date.now(),
          name: names[Math.floor(Math.random() * names.length)],
          role: roles[Math.floor(Math.random() * roles.length)],
          skills: {
            engineering: Math.floor(Math.random() * 8) + 2,
            navigation: Math.floor(Math.random() * 8) + 2,
            combat: Math.floor(Math.random() * 8) + 2,
            diplomacy: Math.floor(Math.random() * 8) + 2,
            trade: Math.floor(Math.random() * 8) + 2,
          },
          morale: Math.floor(Math.random() * 30) + 60,
          background:
            backgrounds[Math.floor(Math.random() * backgrounds.length)],
          age: Math.floor(Math.random() * 20) + 25,
          isHeir: false,
        };
      },

      selectSystem: (system: StarSystem) => {
        set({ selectedSystem: system });
      },

      exploreSystem: () => {
        const { selectedSystem, resources } = get();
        if (selectedSystem && resources.energy >= 50) {
          const newResources = { ...resources, energy: resources.energy - 50 };
          const planets = get().generatePlanets();
          const updatedSystem = {
            ...selectedSystem,
            status: 'explored' as const,
            planets,
          };

          const updatedSystems = get().starSystems.map(sys =>
            sys.name === selectedSystem.name ? updatedSystem : sys
          );

          set({
            resources: newResources,
            starSystems: updatedSystems,
            selectedSystem: updatedSystem,
          });
          get().showNotification(
            `Explored ${selectedSystem.name}! Discovered ${planets.length} planets.`,
            'success'
          );
        } else {
          get().showNotification('Not enough energy to explore!', 'error');
        }
      },

      establishColony: () => {
        const { selectedSystem, resources, resourceGenerationRate } = get();
        if (
          selectedSystem &&
          resources.credits >= 200 &&
          resources.minerals >= 100
        ) {
          const newResources = {
            ...resources,
            credits: resources.credits - 200,
            minerals: resources.minerals - 100,
          };

          const undevelopedPlanet = selectedSystem.planets.find(
            p => !p.developed
          );
          if (undevelopedPlanet) {
            const updatedPlanets = selectedSystem.planets.map(p =>
              p.name === undevelopedPlanet.name ? { ...p, developed: true } : p
            );

            const newGenerationRate = { ...resourceGenerationRate };
            undevelopedPlanet.resources.forEach(resource => {
              if (
                newGenerationRate[
                  resource as keyof typeof newGenerationRate
                ] !== undefined
              ) {
                newGenerationRate[
                  resource as keyof typeof newGenerationRate
                ]! += 0.5;
              }
            });

            const updatedSystem = {
              ...selectedSystem,
              planets: updatedPlanets,
            };
            const updatedSystems = get().starSystems.map(sys =>
              sys.name === selectedSystem.name ? updatedSystem : sys
            );

            set({
              resources: newResources,
              starSystems: updatedSystems,
              selectedSystem: updatedSystem,
              resourceGenerationRate: newGenerationRate,
            });

            get().showNotification(
              `Established colony on ${undevelopedPlanet.name}!`,
              'success'
            );
          }
        } else {
          get().showNotification(
            'Not enough resources to establish colony!',
            'error'
          );
        }
      },

      generatePlanets: () => {
        const planetTypes = ['Rocky', 'Gas Giant', 'Ice', 'Desert'];
        const resourceTypes = ['minerals', 'energy', 'food'];
        const planetCount = Math.floor(Math.random() * 3) + 1;
        const planets: Planet[] = [];

        for (let i = 0; i < planetCount; i++) {
          const type =
            planetTypes[Math.floor(Math.random() * planetTypes.length)];
          const resourceCount = Math.floor(Math.random() * 2) + 1;
          const resources: string[] = [];

          for (let j = 0; j < resourceCount; j++) {
            const resource =
              resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
            if (!resources.includes(resource)) {
              resources.push(resource);
            }
          }

          planets.push({
            name: `Planet ${String.fromCharCode(65 + i)}`,
            type,
            resources,
            developed: false,
          });
        }

        return planets;
      },

      switchComponentCategory: category => {
        set({ currentComponentCategory: category });
      },

      canAffordComponent: (cost: ComponentCost) => {
        const { resources } = get();
        return Object.entries(cost).every(
          ([resource, amount]) =>
            resources[resource as keyof typeof resources] >= (amount as number)
        );
      },

      purchaseComponent: (category: string, componentName: string) => {
        const { shipComponents, resources, ship } = get();
        const component = shipComponents[
          category as keyof typeof shipComponents
        ].find(c => c.name === componentName);

        if (component && get().canAffordComponent(component.cost)) {
          // Deduct cost
          const newResources = { ...resources };
          Object.entries(component.cost).forEach(([resource, amount]) => {
            newResources[resource as keyof typeof newResources] -=
              amount as number;
          });

          let updatedShip = { ...ship };

          if (category === 'hulls') {
            updatedShip = {
              ...updatedShip,
              hull: component.name,
              stats: { ...component.stats } as ShipStats, // Hull replaces all stats
            };
          } else {
            const componentType = category.slice(0, -1); // Remove 's' from plural
            updatedShip.components = {
              ...updatedShip.components,
              [componentType]: component.name,
            };

            // Add component stats to ship
            updatedShip.stats = { ...updatedShip.stats };
            Object.entries(component.stats).forEach(([stat, value]) => {
              if (
                updatedShip.stats[stat as keyof typeof updatedShip.stats] !==
                undefined
              ) {
                updatedShip.stats[stat as keyof typeof updatedShip.stats] +=
                  value as number;
              }
            });
          }

          set({ resources: newResources, ship: updatedShip });
          get().showNotification(`Installed ${component.name}!`, 'success');
        }
      },

      selectHeir: (heirId: number) => {
        const { crew } = get();
        const updatedCrew = crew.map(member => ({
          ...member,
          isHeir: member.id === heirId,
        }));
        const heir = updatedCrew.find(m => m.id === heirId);

        set({ crew: updatedCrew });
        if (heir) {
          get().showNotification(`${heir.name} selected as heir!`, 'success');
        }
      },

      showNotification: (
        message: string,
        type: Notification['type'] = 'info'
      ) => {
        const notification: Notification = {
          id: Date.now().toString(),
          message,
          type,
          timestamp: Date.now(),
        };

        set(state => ({
          notifications: [...state.notifications, notification],
        }));

        // Auto-remove after 3 seconds
        setTimeout(() => {
          get().clearNotification(notification.id);
        }, 3000);
      },

      clearNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      tradeResource: (
        resource: 'minerals' | 'energy' | 'food' | 'influence',
        action: 'buy' | 'sell'
      ) => {
        const { resources, market } = get();
        const price = market.prices[resource];
        const amount = 10;

        if (action === 'buy') {
          const cost = price * amount;
          if (resources.credits >= cost) {
            const newResources = {
              ...resources,
              credits: resources.credits - cost,
              [resource]: resources[resource] + amount,
            };
            set({ resources: newResources });
            get().showNotification(
              `Bought ${amount} ${resource} for ${cost} credits`,
              'success'
            );
          } else {
            get().showNotification('Not enough credits!', 'error');
          }
        } else {
          if (resources[resource] >= amount) {
            const earnings = price * amount;
            const newResources = {
              ...resources,
              credits: resources.credits + earnings,
              [resource]: resources[resource] - amount,
            };
            set({ resources: newResources });
            get().showNotification(
              `Sold ${amount} ${resource} for ${earnings} credits`,
              'success'
            );
          } else {
            get().showNotification(`Not enough ${resource}!`, 'error');
          }
        }
      },
    }),
    {
      name: 'stellar-legacy-storage',
      partialize: state => ({
        ...state,
        notifications: [], // Don't persist notifications
      }),
    }
  )
);
