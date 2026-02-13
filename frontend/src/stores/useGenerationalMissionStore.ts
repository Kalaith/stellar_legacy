// stores/useGenerationalMissionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GenerationalMission,
  LegacyRelation,
  AutomationConfig,
  ExtendedResources,
  PopulationEffect
} from '../types/generationalMissions';
import type { EventCategoryType, LegacyTypeType, MissionObjectiveType, ShipClassType, ShipSizeType } from '../types/enums';
import { MissionService } from '../services/MissionService';
import { EventService } from '../services/EventService';
import { LegacyService } from '../services/LegacyService';
import Logger from '../utils/logger';

interface GenerationalMissionStore {
  // State
  missions: GenerationalMission[];
  activeMissions: string[];
  selectedMission: GenerationalMission | null;
  legacyRelations: LegacyRelation[];
  playerLegacyAffinity: Record<LegacyTypeType, number>;

  // UI State
  selectedEventId: string | null;
  missionCreationConfig: Partial<MissionCreationConfig> | null;

  // Actions - Mission Management
  createMission: (config: MissionCreationConfig) => void;
  selectMission: (missionId: string | null) => void;
  processMissionTurn: (missionId: string, yearsElapsed?: number) => void;
  completeMission: (missionId: string) => void;

  // Actions - Event Management
  selectEvent: (eventId: string | null) => void;
  resolveEvent: (missionId: string, eventId: string, outcomeId: string) => void;
  forceEventGeneration: (missionId: string, category?: string) => void;

  // Actions - Automation Management
  updateAutomationConfig: (missionId: string, config: Partial<AutomationConfig>) => void;
  overrideAIDecision: (missionId: string, decisionId: string, override: unknown) => void;

  // Actions - Legacy Management
  processLegacyDilemma: (
    missionId: string,
    choice:
      | 'tradition'
      | 'adaptation'
      | 'compromise'
      | 'genetic'
      | 'cybernetic'
      | 'biological'
      | 'reject'
      | 'raid'
      | 'trade'
      | 'scavenge'
      | 'conserve'
  ) => void;
  updateLegacyRelations: (fromLegacy: LegacyTypeType, toLegacy: LegacyTypeType, change: number) => void;

  // Utility Actions
  getAllActiveMissions: () => GenerationalMission[];
  getMissionsByObjective: (objective: MissionObjectiveType) => GenerationalMission[];
  getMissionsByLegacy: (legacy: LegacyTypeType) => GenerationalMission[];
}

interface MissionCreationConfig {
  name: string;
  legacy: LegacyTypeType;
  objective: MissionObjectiveType;
  targetSystemId: string;
  estimatedDuration: number;
  shipClass: ShipClassType;
  shipSize: ShipSizeType;
  populationSize: number;
}

export const useGenerationalMissionStore = create<GenerationalMissionStore>()(
  persist(
    (set, get) => ({
      // Initial State
      missions: [],
      activeMissions: [],
      selectedMission: null,
      legacyRelations: [
        {
          fromLegacy: 'preservers',
          toLegacy: 'adaptors',
          relationship: -20,
          recentEvents: [],
          tradeAgreements: []
        },
        {
          fromLegacy: 'preservers',
          toLegacy: 'wanderers',
          relationship: 10,
          recentEvents: [],
          tradeAgreements: []
        },
        {
          fromLegacy: 'adaptors',
          toLegacy: 'wanderers',
          relationship: -30,
          recentEvents: [],
          tradeAgreements: []
        }
      ],
      playerLegacyAffinity: {
        preservers: 0,
        adaptors: 0,
        wanderers: 0
      },

      // UI State
      selectedEventId: null,
      missionCreationConfig: null,

      // Mission Management Actions
      createMission: (config: MissionCreationConfig) => {
        try {
          const mission = MissionService.createMission({
            ...config
          });

          set(state => ({
            missions: [...state.missions, mission],
            activeMissions: [...state.activeMissions, mission.id],
            selectedMission: mission
          }));

          // Update legacy affinity
          get().updateLegacyRelations(config.legacy, config.legacy, 10);

          Logger.info(`Created generational mission: ${mission.name}`, {
            legacy: mission.legacy,
            objective: mission.objective
          });
        } catch (error) {
          Logger.error('Failed to create mission', error);
        }
      },

      selectMission: (missionId: string | null) => {
        const mission = missionId ? get().missions.find(m => m.id === missionId) || null : null;
        set({ selectedMission: mission, selectedEventId: null });
      },

      processMissionTurn: (missionId: string, yearsElapsed: number = 1) => {
        const mission = get().missions.find(m => m.id === missionId);
        if (!mission) return;

        try {
          const result = MissionService.processMissionTurn(mission, yearsElapsed);

          set(state => ({
            missions: state.missions.map(m => m.id === missionId ? result.mission : m),
            selectedMission: state.selectedMission?.id === missionId ? result.mission : state.selectedMission
          }));

          // Show notification if requires attention
          if (result.requiresPlayerAttention) {
            // Would integrate with main game notification system
            Logger.info(`Mission ${mission.name} requires player attention`);
          }

        } catch (error) {
          Logger.error('Failed to process mission turn', error);
        }
      },

      completeMission: (missionId: string) => {
        const mission = get().missions.find(m => m.id === missionId);
        if (!mission) return;

        set(state => ({
          activeMissions: state.activeMissions.filter(id => id !== missionId),
          selectedMission: state.selectedMission?.id === missionId ? null : state.selectedMission
        }));

        // Update legacy affinity based on success
        const affinityChange = mission.successLevel === 'complete' ? 20 :
                              mission.successLevel === 'partial' ? 10 :
                              mission.successLevel === 'pyrrhic' ? 5 : -10;

        get().updateLegacyRelations(mission.legacy, mission.legacy, affinityChange);

        Logger.info(`Completed mission: ${mission.name}`, {
          successLevel: mission.successLevel
        });
      },

      // Event Management Actions
      selectEvent: (eventId: string | null) => {
        set({ selectedEventId: eventId });
      },

      resolveEvent: (missionId: string, eventId: string, outcomeId: string) => {
        const mission = get().missions.find(m => m.id === missionId);
        const event = mission?.activeEvents.find(e => e.id === eventId);

        if (!mission || !event) return;

        try {
          const resolution = EventService.resolveEventWithChoice(event, outcomeId, mission);

          if (resolution.success) {
            // Move event to history
            mission.eventHistory.push(event);
            mission.activeEvents = mission.activeEvents.filter(e => e.id !== eventId);

            set(state => ({
              missions: state.missions.map(m => m.id === missionId ? mission : m),
              selectedMission: state.selectedMission?.id === missionId ? mission : state.selectedMission,
              selectedEventId: null
            }));

            Logger.info(`Resolved event: ${event.title}`, {
              outcome: resolution.outcome?.title
            });
          }
        } catch (error) {
          Logger.error('Failed to resolve event', error);
        }
      },

      forceEventGeneration: (missionId: string, category?: EventCategoryType) => {
        const mission = get().missions.find(m => m.id === missionId);
        if (!mission) return;

        const event = EventService.generateEvent(mission, category);
        if (event) {
          mission.activeEvents.push(event);

          set(state => ({
            missions: state.missions.map(m => m.id === missionId ? mission : m),
            selectedMission: state.selectedMission?.id === missionId ? mission : state.selectedMission
          }));
        }
      },

      // Automation Management Actions
      updateAutomationConfig: (missionId: string, config: Partial<AutomationConfig>) => {
        set(state => ({
          missions: state.missions.map(mission => {
            if (mission.id === missionId) {
              return {
                ...mission,
                automationConfig: { ...mission.automationConfig, ...config }
              };
            }
            return mission;
          })
        }));
      },

      overrideAIDecision: (targetMissionId: string, decisionId: string, overrideData: unknown) => {
        // Implementation for overriding AI decisions
        Logger.info(`Override AI decision: ${decisionId}`, { targetMissionId, override: overrideData });
      },

      // Legacy Management Actions
      processLegacyDilemma: (missionId: string, choice: 'tradition' | 'adaptation' | 'compromise' | 'genetic' | 'cybernetic' | 'biological' | 'reject' | 'raid' | 'trade' | 'scavenge' | 'conserve') => {
        const mission = get().missions.find(m => m.id === missionId);
        if (!mission) return;

        try {
          let result;
          switch (mission.legacy) {
            case 'preservers':
              result = LegacyService.processPreserversDialemma(mission, choice as 'tradition' | 'adaptation' | 'compromise');
              break;
            case 'adaptors':
              result = LegacyService.processAdaptorsEvolution(mission, choice as 'genetic' | 'cybernetic' | 'biological' | 'reject');
              break;
            case 'wanderers':
              result = LegacyService.processWanderersSurvival(mission, choice as 'raid' | 'trade' | 'scavenge' | 'conserve');
              break;
            default:
              return;
          }

          // Apply results to mission
          (Object.keys(result.resourceChanges) as Array<keyof ExtendedResources>).forEach((resource) => {
            const change = result.resourceChanges[resource];
            if (typeof change === 'number') {
              mission.resources[resource] += change;
            }
          });

          // Apply population effects
          result.populationEffects.forEach((effect: PopulationEffect) => {
            const cohort = mission.population.cohorts.find(c => c.type === effect.cohortType);
            if (cohort) {
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
              }
            }
          });

          set(state => ({
            missions: state.missions.map(m => m.id === missionId ? mission : m),
            selectedMission: state.selectedMission?.id === missionId ? mission : state.selectedMission
          }));

          Logger.info(`Processed legacy dilemma for ${mission.legacy}`, {
            choice,
            consequences: result.longTermConsequences
          });

        } catch (error) {
          Logger.error('Failed to process legacy dilemma', error);
        }
      },

      updateLegacyRelations: (fromLegacy: LegacyTypeType, toLegacy: LegacyTypeType, change: number) => {
        set(state => ({
          legacyRelations: state.legacyRelations.map(relation => {
            if (relation.fromLegacy === fromLegacy && relation.toLegacy === toLegacy) {
              return {
                ...relation,
                relationship: Math.max(-100, Math.min(100, relation.relationship + change))
              };
            }
            return relation;
          }),
          playerLegacyAffinity: {
            ...state.playerLegacyAffinity,
            [fromLegacy]: Math.max(-100, Math.min(100, state.playerLegacyAffinity[fromLegacy] + change))
          }
        }));
      },

      // Utility Actions
      getAllActiveMissions: () => {
        return get().missions.filter(mission => get().activeMissions.includes(mission.id));
      },

      getMissionsByObjective: (objective: MissionObjectiveType) => {
        return get().missions.filter(mission => mission.objective === objective);
      },

      getMissionsByLegacy: (legacy: LegacyTypeType) => {
        return get().missions.filter(mission => mission.legacy === legacy);
      }
    }),
    {
      name: 'generational-mission-storage',
      partialize: (state) => ({
        missions: state.missions,
        activeMissions: state.activeMissions,
        legacyRelations: state.legacyRelations,
        playerLegacyAffinity: state.playerLegacyAffinity
        // Don't persist UI state like selectedMission, selectedEventId
      })
    }
  )
);

// Helper hook for current mission data
export const useCurrentMission = () => {
  const selectedMission = useGenerationalMissionStore(state => state.selectedMission);
  return selectedMission;
};

// Helper hook for active events
export const useActiveEvents = () => {
  const selectedMission = useGenerationalMissionStore(state => state.selectedMission);
  return selectedMission?.activeEvents || [];
};

// Helper hook for mission status
export const useMissionStatus = (missionId?: string) => {
  const missions = useGenerationalMissionStore(state => state.missions);
  const activeMissions = useGenerationalMissionStore(state => state.activeMissions);

  if (!missionId) return null;

  const mission = missions.find(m => m.id === missionId);
  const isActive = activeMissions.includes(missionId);

  return {
    mission,
    isActive,
    requiresAttention: mission?.activeEvents.some(e => e.requiresPlayerDecision) || false
  };
};
