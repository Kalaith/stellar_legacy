// stores/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameData, CrewMember, StarSystem, Planet, Notification, ShipStats, ComponentCost } from '../types/game';
import type { CulturalEvolution } from '../types/generationalMissions';
import type { Chronicle, ChronicleEntry, ChronicleDecision } from '../types/chronicle';
import type { HeritageModifier, HeritageApplicationResult } from '../types/heritage';
import type { PacingState, PacingPreferences, PlannedMilestone } from '../types/pacing';
import type { LegacyCard, LegacyDeck, CardTriggerResult } from '../types/legacyDecks';
import { ChronicleService } from '../services/ChronicleService';
import { HeritageService } from '../services/HeritageService';
import { PacingService } from '../services/PacingService';
import { LegacyDeckService } from '../services/LegacyDeckService';
import { DecisionTrackingService, type DecisionInput } from '../services/DecisionTrackingService';
import { GAME_CONSTANTS } from '../constants/gameConstants';
import type { TabIdType, TradeActionType, LegacyTypeType } from '../types/enums';
import { TabId } from '../types/enums';
import { DynastyService } from '../services/DynastyService';
import { CrewIdGenerator } from '../types/branded';
import type { CrewMemberId, NotificationId } from '../types/branded';
import { NotificationManager } from '../services/NotificationManager';
import { ResourceService } from '../services/ResourceService';
import { ValidationService } from '../services/ValidationService';
import gameConfig from '../config/gameConfig';
import Logger from '../utils/logger';
import { GameEngine } from '../services/GameEngine';

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
      id: CrewIdGenerator.generate(),
      name: "Captain Elena Voss",
      role: "Captain",
      skills: {engineering: 6, navigation: 8, combat: 7, diplomacy: 9, trade: 5},
      morale: 85,
      background: "Former military officer turned explorer",
      age: 35,
      isHeir: false
    },
    {
      id: CrewIdGenerator.generate(),
      name: "Chief Engineer Marcus Cole",
      role: "Engineer",
      skills: {engineering: 9, navigation: 4, combat: 5, diplomacy: 3, trade: 2},
      morale: 90,
      background: "Shipyard veteran with decades of experience",
      age: 28,
      isHeir: false
    },
    {
      id: CrewIdGenerator.generate(),
      name: "Navigator Zara Chen",
      role: "Pilot",
      skills: {engineering: 3, navigation: 9, combat: 6, diplomacy: 5, trade: 4},
      morale: 80,
      background: "Ace pilot from the outer colonies",
      age: 26,
      isHeir: false
    },
    {
      id: CrewIdGenerator.generate(),
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
  // Chronicle System State
  chronicle: Chronicle | null;
  availableHeritageModifiers: HeritageModifier[];
  selectedHeritageModifiers: HeritageModifier[];

  // Pacing System State
  pacingState: PacingState | null;
  pacingPreferences: PacingPreferences;

  // Legacy Deck System State
  legacyDecks: Record<LegacyTypeType, LegacyDeck>;
  activeCards: LegacyCard[];
  pendingCardChoices: CardTriggerResult[];

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
  selectHeir: (heirId: CrewMemberId) => void;
  showNotification: (message: string, type?: Notification['type']) => void;
  clearNotification: (id: NotificationId) => void;
  tradeResource: (resource: 'minerals' | 'energy' | 'food' | 'influence', action: TradeActionType) => void;

  // Dynasty System Actions
  dynastyAction: (dynastyId: string, action: string) => void;
  legacyAction: (targetLegacy: LegacyTypeType, action: string) => void;
  culturalAction: (action: string, parameters?: any) => void;
  initializeDynasties: (legacy: LegacyTypeType) => void;

  // Chronicle System Actions
  loadChronicle: () => Promise<void>;
  saveChronicleEntry: (entry: ChronicleEntry) => Promise<void>;
  generateHeritageModifiers: (entry: ChronicleEntry) => Promise<void>;
  selectHeritageModifiers: (modifiers: HeritageModifier[]) => void;
  applyHeritageModifiers: () => Promise<void>;
  exportChronicle: () => string | null;
  recordDecision: (decision: DecisionInput) => void;

  // Pacing System Actions
  initializePacing: (mission?: any) => Promise<void>;
  updatePacingState: (updates: Partial<PacingState>) => void;
  updatePacingPreferences: (preferences: PacingPreferences) => void;
  pauseTime: () => void;
  resumeTime: () => void;
  forceTimeAcceleration: (acceleration: number) => void;

  // Legacy Deck Actions
  initializeLegacyDecks: () => Promise<void>;
  checkCardTriggers: () => void;
  triggerCard: (cardId: string) => void;
  resolveCardChoice: (cardId: string, choiceId: string) => void;
  rateCard: (cardId: string, rating: number) => void;
  customizeCard: (cardId: string, modifications: any[]) => void;

  // Helper methods
  canAffordComponent: (cost: ComponentCost) => boolean;
  generateRandomCrew: () => CrewMember;
  generatePlanets: () => Planet[];

  // Cleanup
  cleanup: () => void;

  // Internal state
  resourceIntervalId: number | null;
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
      resourceIntervalId: null,

      // Generational Missions State
      generationalMissions: [],
      activeMissions: [],
      selectedMission: null,
      legacyRelations: [],
      playerLegacyAffinity: {
        preservers: 0,
        adaptors: 0,
        wanderers: 0
      },

      // Dynasty System State
      dynasties: [],
      playerLegacy: 'preservers' as LegacyTypeType,
      currentGeneration: 1,
      culturalEvolution: [
        {
          legacy: 'preservers',
          baselineDeviation: 0,
          majorChanges: [],
          currentTrends: []
        },
        {
          legacy: 'adaptors',
          baselineDeviation: 0,
          majorChanges: [],
          currentTrends: []
        },
        {
          legacy: 'wanderers',
          baselineDeviation: 0,
          majorChanges: [],
          currentTrends: []
        }
      ] as CulturalEvolution[],

      // Chronicle System State
      chronicle: null,
      availableHeritageModifiers: [],
      selectedHeritageModifiers: [],

      // Pacing System State
      pacingState: null,
      pacingPreferences: {
        preferredSpeed: 'medium',
        crisisHandling: 'guided',
        milestoneFrequency: 'moderate',
        narrativeStyle: 'concise',
        automationThreshold: 0.3,
        interactionBudget: 2,
        contentPreferences: {
          dynastyFocus: 0.5,
          legacyFocus: 0.5,
          explorationFocus: 0.5,
          culturalFocus: 0.5,
          contentComplexity: 'moderate',
          narrativeDepth: 'moderate',
          choiceConsequences: 'mixed'
        }
      },

      // Legacy Deck System State
      legacyDecks: {
        preservers: { legacy: 'preservers', cards: [], activeCards: [], discardPile: [], baseCards: [], chronicleCards: [], customCards: [], totalPlays: 0, averageImpact: 0, playerSatisfaction: 0, balanceRating: 0, playerFilters: [], cardRatings: {}, disabledCards: [] },
        adaptors: { legacy: 'adaptors', cards: [], activeCards: [], discardPile: [], baseCards: [], chronicleCards: [], customCards: [], totalPlays: 0, averageImpact: 0, playerSatisfaction: 0, balanceRating: 0, playerFilters: [], cardRatings: {}, disabledCards: [] },
        wanderers: { legacy: 'wanderers', cards: [], activeCards: [], discardPile: [], baseCards: [], chronicleCards: [], customCards: [], totalPlays: 0, averageImpact: 0, playerSatisfaction: 0, balanceRating: 0, playerFilters: [], cardRatings: {}, disabledCards: [] }
      },
      activeCards: [],
      pendingCardChoices: [],

      initializeGame: () => {
        Logger.info('Initializing game store');
        // Start resource generation
        const generateResources = () => {
          get().generateResources();
        };
        generateResources();
        const intervalId = setInterval(generateResources, gameConfig.intervals.resourceGeneration);
        set({ resourceIntervalId: intervalId });
        Logger.info('Game initialized successfully');
      },

      switchTab: (tabName: TabIdType) => {
        if (!Object.values(TabId).includes(tabName)) {
          Logger.warn('Invalid tab requested', { tabName });
          return;
        }
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
        try {
          const { resources, crew } = get();
          const result = GameEngine.processCrewTraining(resources, crew);

          if (!result.success) {
            get().showNotification(result.error.message, 'error');
            Logger.error('Crew training failed', result.error);
            return;
          }

          const { newResources, result: trainingResult } = result.data;
          const { updatedCrew, trainedMember, skill } = trainingResult;

          set({ resources: newResources, crew: updatedCrew });
          const message = NotificationManager.createCrewMessage('trained', trainedMember.name, `${skill} skill improved`);
          get().showNotification(message, 'success');
          Logger.crewAction('skill_training', trainedMember.name, { skill, newLevel: updatedCrew.find(c => c.id === trainedMember.id)?.skills[skill as keyof typeof trainedMember.skills] });
        } catch (error) {
          Logger.error('Crew training failed', error);
          get().showNotification('An error occurred during crew training.', 'error');
        }
      },

      boostMorale: () => {
        try {
          const { resources, crew } = get();
          const result = GameEngine.processMoraleBoost(resources, crew);

          if (!result.success) {
            get().showNotification(result.error.message, 'error');
            Logger.error('Morale boost failed', result.error);
            return;
          }

          const { newResources, updatedCrew } = result.data;

          set({ resources: newResources, crew: updatedCrew });
          get().showNotification('Crew morale improved!', 'success');
          Logger.gameAction('morale_boost', { affectedCrew: updatedCrew.length });
        } catch (error) {
          Logger.error('Morale boost failed', error);
          get().showNotification('An error occurred during morale boost.', 'error');
        }
      },

      recruitCrew: () => {
        try {
          const { resources, crew, ship } = get();
          const result = GameEngine.processCrewRecruitment(resources, crew, ship);

          if (!result.success) {
            get().showNotification(result.error.message, 'error');
            Logger.error('Crew recruitment failed', result.error);
            return;
          }

          const { newResources, newCrew } = result.data;
          const updatedCrew = [...crew, newCrew];

          set({ resources: newResources, crew: updatedCrew });
          const message = NotificationManager.createCrewMessage('recruited', newCrew.name, newCrew.role);
          get().showNotification(message, 'success');
          Logger.crewAction('recruitment', newCrew.name, { role: newCrew.role });
        } catch (error) {
          Logger.error('Crew recruitment failed', error);
          get().showNotification('An error occurred during crew recruitment.', 'error');
        }
      },

      generateRandomCrew: () => {
        return GameEngine.generateRandomCrew();
      },

      selectSystem: (system: StarSystem) => {
        if (!system || !system.name) {
          Logger.warn('Invalid system selected', { system });
          return;
        }
        set({ selectedSystem: system });
      },

      exploreSystem: () => {
        try {
          const { selectedSystem, resources } = get();
          const result = GameEngine.processSystemExploration(resources, selectedSystem);

          if (!result.success) {
            get().showNotification(result.error.message, 'error');
            Logger.error('System exploration failed', result.error);
            return;
          }

          const { newResources, planets } = result.data;

          if (selectedSystem) {
            const updatedSystem = { ...selectedSystem, status: 'explored' as const, planets };
            const updatedSystems = get().starSystems.map(sys =>
              sys.name === selectedSystem.name ? updatedSystem : sys
            );

            set({ resources: newResources, starSystems: updatedSystems, selectedSystem: updatedSystem });
            const message = NotificationManager.createSystemMessage('explored', selectedSystem.name, `Discovered ${planets.length} planets`);
            get().showNotification(message, 'success');
            Logger.systemEvent('exploration', selectedSystem.name, { planetsDiscovered: planets.length });
          }
        } catch (error) {
          Logger.error('System exploration failed', error);
          get().showNotification('An error occurred during system exploration.', 'error');
        }
      },

      establishColony: () => {
        try {
          const { selectedSystem, resources, resourceGenerationRate } = get();
          const result = GameEngine.processColonyEstablishment(resources, selectedSystem);

          if (!result.success) {
            get().showNotification(result.error.message, 'error');
            Logger.error('Colony establishment failed', result.error);
            return;
          }

          const { newResources, colonyPlanet, newGenerationRate } = result.data;

          if (selectedSystem) {
            const updatedPlanets = selectedSystem.planets.map(p =>
              p.name === colonyPlanet.name ? { ...p, developed: true } : p
            );

            const updatedSystem = { ...selectedSystem, planets: updatedPlanets };
            const updatedSystems = get().starSystems.map(sys =>
              sys.name === selectedSystem.name ? updatedSystem : sys
            );

            set({
              resources: newResources,
              starSystems: updatedSystems,
              selectedSystem: updatedSystem,
              resourceGenerationRate: { ...resourceGenerationRate, ...newGenerationRate }
            });

            const message = NotificationManager.createSystemMessage('colonized', colonyPlanet.name);
            get().showNotification(message, 'success');
            Logger.systemEvent('colony_established', selectedSystem.name, { planet: colonyPlanet.name });
          }
        } catch (error) {
          Logger.error('Colony establishment failed', error);
          get().showNotification('An error occurred during colony establishment.', 'error');
        }
      },

      generatePlanets: () => {
        return GameEngine.generatePlanets();
      },

      switchComponentCategory: (category) => {
        set({ currentComponentCategory: category });
      },

      canAffordComponent: (cost: ComponentCost) => {
        const { resources } = get();
        return ResourceService.canAfford(resources, cost);
      },

      purchaseComponent: (category: string, componentName: string) => {
        try {
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
        } catch (error) {
          Logger.error('Component purchase failed', error);
          get().showNotification('An error occurred during component purchase.', 'error');
        }
      },

      selectHeir: (heirId: CrewMemberId) => {
        const { crew } = get();
        const targetCrew = crew.find(m => m.id === heirId);

        if (!targetCrew) {
          Logger.warn('Invalid crew member selected as heir', { heirId });
          get().showNotification('Invalid crew member selected', 'error');
          return;
        }

        const updatedCrew = crew.map(member => ({ ...member, isHeir: member.id === heirId }));
        set({ crew: updatedCrew });
        const message = NotificationManager.createCrewMessage('promoted', targetCrew.name, 'selected as heir');
        get().showNotification(message, 'success');
      },

      showNotification: (message: string, type: Notification['type'] = 'info') => {
        const notification = NotificationManager.create(message, type);
        set(state => ({ notifications: [...state.notifications, notification] }));

        // Auto-remove using NotificationManager
        NotificationManager.autoRemove(notification, get().clearNotification);
      },

      clearNotification: (id: NotificationId) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      tradeResource: (resource: 'minerals' | 'energy' | 'food' | 'influence', action: TradeActionType) => {
        try {
          // Validate inputs
          const validResources = ['minerals', 'energy', 'food', 'influence'];
          const validActions = ['buy', 'sell'];

          if (!validResources.includes(resource)) {
            Logger.warn('Invalid resource for trade', { resource });
            get().showNotification('Invalid resource selected', 'error');
            return;
          }

          if (!validActions.includes(action)) {
            Logger.warn('Invalid trade action', { action });
            get().showNotification('Invalid trade action', 'error');
            return;
          }

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
          const message = NotificationManager.createResourceMessage(isBuying ? 'bought' : 'sold', amount, resource, cost);
          get().showNotification(message, 'success');
          Logger.gameAction('trade', { resource, action: isBuying ? 'buy' : 'sell', amount, cost });
        } catch (error) {
          Logger.error('Resource trade failed', error);
          get().showNotification('An error occurred during resource trade.', 'error');
        }
      },

      // Dynasty System Actions
      dynastyAction: (dynastyId: string, action: string) => {
        try {
          const { dynasties } = get();
          const dynasty = dynasties.find(d => d.id === dynastyId);

          if (!dynasty) {
            get().showNotification('Dynasty not found', 'error');
            return;
          }

          let message = '';
          let updatedDynasties = [...dynasties];

          switch (action) {
            case 'grant_autonomy':
              message = `Granted autonomy to ${dynasty.name}`;
              // Update dynasty influence or other properties
              updatedDynasties = dynasties.map(d =>
                d.id === dynastyId ? { ...d, influence: Math.min(100, d.influence + 10) } : d
              );
              break;
            case 'assign_mission':
              message = `Assigned special mission to ${dynasty.name}`;
              break;
            case 'promote_member':
              message = `Promoted a member in ${dynasty.name}`;
              break;
            case 'expand_influence':
              message = `Expanded influence for ${dynasty.name}`;
              updatedDynasties = dynasties.map(d =>
                d.id === dynastyId ? { ...d, influence: Math.min(100, d.influence + 5) } : d
              );
              break;
            default:
              message = `Unknown action: ${action}`;
          }

          set({ dynasties: updatedDynasties });
          get().showNotification(message, 'success');
          Logger.gameAction('dynasty_action', { dynastyId, action });
        } catch (error) {
          Logger.error('Dynasty action failed', error);
          get().showNotification('Dynasty action failed', 'error');
        }
      },

      legacyAction: (targetLegacy: LegacyTypeType, action: string) => {
        try {
          let message = '';

          switch (action) {
            case 'improve_relations':
              message = `Attempting to improve relations with ${targetLegacy}`;
              break;
            case 'formal_alliance':
              message = `Proposing formal alliance with ${targetLegacy}`;
              break;
            case 'cultural_exchange':
              message = `Initiating cultural exchange with ${targetLegacy}`;
              break;
            case 'issue_warning':
              message = `Issued warning to ${targetLegacy}`;
              break;
            default:
              message = `Unknown legacy action: ${action}`;
          }

          get().showNotification(message, 'success');
          Logger.gameAction('legacy_action', { targetLegacy, action });
        } catch (error) {
          Logger.error('Legacy action failed', error);
          get().showNotification('Legacy action failed', 'error');
        }
      },

      culturalAction: (action: string, parameters?: any) => {
        try {
          let message = '';

          switch (action) {
            case 'preserve_traditions':
              message = 'Implementing traditional preservation measures';
              break;
            case 'encourage_innovation':
              message = 'Encouraging cultural innovation';
              break;
            case 'cultural_festival':
              message = 'Organizing cultural festival';
              break;
            case 'generational_dialogue':
              message = 'Facilitating generational dialogue';
              break;
            case 'cultural_census':
              message = 'Conducting cultural census';
              break;
            case 'cultural_education':
              message = 'Starting cultural education program';
              break;
            case 'cultural_reform':
              message = 'Implementing cultural reform initiative';
              break;
            case 'cultural_restoration':
              message = 'Attempting cultural restoration';
              break;
            case 'accept_evolution':
              message = 'Accepting cultural evolution as new baseline';
              break;
            default:
              message = `Unknown cultural action: ${action}`;
          }

          get().showNotification(message, 'success');
          Logger.gameAction('cultural_action', { action, parameters });
        } catch (error) {
          Logger.error('Cultural action failed', error);
          get().showNotification('Cultural action failed', 'error');
        }
      },

      initializeDynasties: (legacy: LegacyTypeType) => {
        try {
          const dynasties = DynastyService.generateInitialDynasties(legacy, 50000); // 50k population
          set({ dynasties, playerLegacy: legacy });
          get().showNotification(`Initialized ${dynasties.length} dynasties for ${legacy} legacy`, 'success');
          Logger.gameAction('dynasties_initialized', { legacy, count: dynasties.length });
        } catch (error) {
          Logger.error('Dynasty initialization failed', error);
          get().showNotification('Failed to initialize dynasties', 'error');
        }
      },

      // Chronicle System Actions
      loadChronicle: async () => {
        try {
          const chronicle = await ChronicleService.loadPlayerChronicle();
          set({ chronicle });
          if (chronicle) {
            Logger.info('Chronicle loaded', { entryCount: chronicle.entries.length });
          }
        } catch (error) {
          Logger.error('Failed to load chronicle', error);
          get().showNotification('Failed to load chronicle', 'error');
        }
      },

      saveChronicleEntry: async (entry: ChronicleEntry) => {
        try {
          await ChronicleService.saveChronicleEntry(entry);
          await get().loadChronicle(); // Reload to get updated chronicle
          get().showNotification('Chronicle entry saved', 'success');
          Logger.info('Chronicle entry saved', { missionId: entry.missionId });
        } catch (error) {
          Logger.error('Failed to save chronicle entry', error);
          get().showNotification('Failed to save chronicle entry', 'error');
        }
      },

      generateHeritageModifiers: async (entry: ChronicleEntry) => {
        try {
          const modifiers = ChronicleService.generateHeritageModifiers(entry);
          set({ availableHeritageModifiers: modifiers });
          get().showNotification(`Generated ${modifiers.length} heritage modifiers`, 'success');
          Logger.info('Heritage modifiers generated', { count: modifiers.length });
        } catch (error) {
          Logger.error('Failed to generate heritage modifiers', error);
          get().showNotification('Failed to generate heritage modifiers', 'error');
        }
      },

      selectHeritageModifiers: (modifiers: HeritageModifier[]) => {
        set({ selectedHeritageModifiers: modifiers });
        Logger.info('Heritage modifiers selected', { count: modifiers.length });
      },

      applyHeritageModifiers: async () => {
        try {
          const { selectedHeritageModifiers, selectedMission } = get();
          if (!selectedMission) {
            get().showNotification('No mission selected for heritage application', 'error');
            return;
          }

          const result = HeritageService.applyHeritageModifiers(selectedHeritageModifiers, selectedMission);

          // Apply resource changes to current resources
          const currentResources = get().resources;
          const updatedResources = { ...currentResources };
          Object.entries(result.resourceChanges).forEach(([resource, change]) => {
            if (updatedResources[resource as keyof typeof updatedResources] !== undefined) {
              (updatedResources as any)[resource] += change;
            }
          });

          set({ resources: updatedResources });
          get().showNotification(`Applied ${result.appliedModifiers.length} heritage modifiers`, 'success');
          Logger.info('Heritage modifiers applied', {
            count: result.appliedModifiers.length,
            warnings: result.warnings.length
          });
        } catch (error) {
          Logger.error('Failed to apply heritage modifiers', error);
          get().showNotification('Failed to apply heritage modifiers', 'error');
        }
      },

      exportChronicle: () => {
        try {
          const { chronicle } = get();
          if (!chronicle) {
            get().showNotification('No chronicle to export', 'error');
            return null;
          }

          const exportData = ChronicleService.exportChronicle(chronicle);
          Logger.info('Chronicle exported');
          return exportData;
        } catch (error) {
          Logger.error('Failed to export chronicle', error);
          get().showNotification('Failed to export chronicle', 'error');
          return null;
        }
      },

      recordDecision: (decision: DecisionInput) => {
        try {
          const { selectedMission } = get();
          if (!selectedMission) {
            Logger.warn('Cannot record decision without active mission');
            return;
          }

          const entry = DecisionTrackingService.recordDecision(decision, selectedMission);
          get().showNotification('Decision recorded in chronicle', 'success');
          Logger.info('Decision recorded', { decisionId: entry.id, title: decision.title });
        } catch (error) {
          Logger.error('Failed to record decision', error);
          get().showNotification('Failed to record decision', 'error');
        }
      },

      // Pacing System Actions
      initializePacing: async (mission?: any) => {
        try {
          const { pacingPreferences, chronicle } = get();
          const targetMission = mission || get().selectedMission;

          if (!targetMission) {
            Logger.warn('Cannot initialize pacing without mission');
            return;
          }

          const pacingState = PacingService.calculateOptimalPacing(
            targetMission,
            pacingPreferences,
            chronicle || undefined
          );

          set({ pacingState });
          await PacingService.savePacingState(pacingState);
          get().showNotification('Pacing system initialized', 'success');
          Logger.info('Pacing system initialized', { phase: pacingState.currentPhase });
        } catch (error) {
          Logger.error('Failed to initialize pacing', error);
          get().showNotification('Failed to initialize pacing', 'error');
        }
      },

      updatePacingState: (updates: Partial<PacingState>) => {
        const { pacingState } = get();
        if (!pacingState) return;

        const newState = { ...pacingState, ...updates };
        set({ pacingState: newState });
        PacingService.savePacingState(newState).catch(error => {
          Logger.error('Failed to save pacing state', error);
        });
      },

      updatePacingPreferences: (preferences: PacingPreferences) => {
        set({ pacingPreferences: preferences });
        Logger.info('Pacing preferences updated');
      },

      pauseTime: () => {
        get().updatePacingState({ timeAcceleration: 0 });
        get().showNotification('Time paused', 'info');
      },

      resumeTime: () => {
        const { pacingPreferences } = get();
        const defaultAcceleration = pacingPreferences.preferredSpeed === 'slow' ? 0.5 :
                                   pacingPreferences.preferredSpeed === 'fast' ? 2.0 : 1.0;
        get().updatePacingState({ timeAcceleration: defaultAcceleration });
        get().showNotification('Time resumed', 'info');
      },

      forceTimeAcceleration: (acceleration: number) => {
        get().updatePacingState({ timeAcceleration: acceleration });
        get().showNotification(`Time acceleration set to ${acceleration}x`, 'info');
      },

      // Legacy Deck Actions
      initializeLegacyDecks: async () => {
        try {
          const { playerLegacy, availableHeritageModifiers } = get();

          // For now, just initialize empty decks
          // In a full implementation, this would load cards from heritage modifiers
          Logger.info('Legacy decks initialized', { legacy: playerLegacy });
          get().showNotification('Legacy decks initialized', 'success');
        } catch (error) {
          Logger.error('Failed to initialize legacy decks', error);
          get().showNotification('Failed to initialize legacy decks', 'error');
        }
      },

      checkCardTriggers: () => {
        try {
          const { legacyDecks, playerLegacy, selectedMission } = get();
          if (!selectedMission) return;

          const currentDeck = legacyDecks[playerLegacy];
          const triggers = LegacyDeckService.checkCardTriggers(currentDeck, selectedMission);

          set({ pendingCardChoices: triggers });
          if (triggers.length > 0) {
            get().showNotification(`${triggers.length} legacy cards triggered`, 'info');
          }
        } catch (error) {
          Logger.error('Failed to check card triggers', error);
        }
      },

      triggerCard: (cardId: string) => {
        const { pendingCardChoices } = get();
        const trigger = pendingCardChoices.find(t => t.card.id === cardId);

        if (trigger) {
          set({ activeCards: [...get().activeCards, trigger.card] });
          get().showNotification(`Legacy card activated: ${trigger.card.name}`, 'info');
          Logger.info('Legacy card triggered', { cardId, cardName: trigger.card.name });
        }
      },

      resolveCardChoice: (cardId: string, choiceId: string) => {
        try {
          const { activeCards, selectedMission } = get();
          const card = activeCards.find(c => c.id === cardId);
          const choice = card?.choices.find(c => c.id === choiceId);

          if (!card || !choice || !selectedMission) {
            Logger.warn('Invalid card choice resolution', { cardId, choiceId });
            return;
          }

          const result = LegacyDeckService.resolveCardChoice(card, choice, selectedMission);

          // Remove card from active cards
          set({ activeCards: activeCards.filter(c => c.id !== cardId) });

          get().showNotification(`Card resolved: ${result.narrativeOutcome}`, 'success');
          Logger.info('Card choice resolved', { cardId, choiceId, outcome: result.narrativeOutcome });
        } catch (error) {
          Logger.error('Failed to resolve card choice', error);
          get().showNotification('Failed to resolve card choice', 'error');
        }
      },

      rateCard: (cardId: string, rating: number) => {
        const { legacyDecks, playerLegacy } = get();
        const deck = legacyDecks[playerLegacy];

        const updatedDeck = LegacyDeckService.applyCuration(deck, cardId, 'rate', rating);

        set({
          legacyDecks: {
            ...legacyDecks,
            [playerLegacy]: updatedDeck
          }
        });

        get().showNotification(`Card rated: ${rating}/5`, 'success');
      },

      customizeCard: (cardId: string, modifications: any[]) => {
        const { legacyDecks, playerLegacy } = get();
        const deck = legacyDecks[playerLegacy];

        const updatedDeck = LegacyDeckService.applyCuration(deck, cardId, 'modify', modifications);

        set({
          legacyDecks: {
            ...legacyDecks,
            [playerLegacy]: updatedDeck
          }
        });

        get().showNotification('Card customized', 'success');
      },

      cleanup: () => {
        const { resourceIntervalId } = get();
        if (resourceIntervalId) {
          clearInterval(resourceIntervalId);
          set({ resourceIntervalId: null });
          Logger.info('Game store cleanup completed');
        }
      }
    }),
    {
      name: 'stellar-legacy-storage',
      partialize: (state) => ({
        ...state,
        notifications: [], // Don't persist notifications
        resourceIntervalId: null, // Don't persist interval ID
      })
    }
  )
);

// Cleanup function to clear intervals and prevent memory leaks
export const cleanupGameStore = () => {
  useGameStore.getState().cleanup();
};