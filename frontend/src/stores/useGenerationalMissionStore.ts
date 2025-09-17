// stores/useGenerationalMissionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GenerationalMission,
  MissionEvent,
  Dynasty,
  SectRelation,
  ExtendedResources
} from '../types/generationalMissions';
import type { SectTypeType, MissionObjectiveType } from '../types/enums';
import { MissionService } from '../services/MissionService';
import { EventService } from '../services/EventService';
import { SectService } from '../services/SectService';
import { AutomationService } from '../services/AutomationService';
import Logger from '../utils/logger';

interface GenerationalMissionStore {
  // State
  missions: GenerationalMission[];
  activeMissions: string[];
  selectedMission: GenerationalMission | null;
  sectRelations: SectRelation[];
  playerSectAffinity: Record<SectTypeType, number>;

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
  updateAutomationConfig: (missionId: string, config: Partial<any>) => void;
  overrideAIDecision: (missionId: string, decisionId: string, override: any) => void;

  // Actions - Sect Management
  processSectDilemma: (missionId: string, choice: any) => void;
  updateSectRelations: (fromSect: SectTypeType, toSect: SectTypeType, change: number) => void;

  // Utility Actions
  getAllActiveMissions: () => GenerationalMission[];
  getMissionsByObjective: (objective: MissionObjectiveType) => GenerationalMission[];
  getMissionsBySect: (sect: SectTypeType) => GenerationalMission[];
}

interface MissionCreationConfig {
  name: string;
  sect: SectTypeType;
  objective: MissionObjectiveType;
  targetSystemId: string;
  estimatedDuration: number;
  shipClass: string;
  shipSize: string;
  populationSize: number;
}

export const useGenerationalMissionStore = create<GenerationalMissionStore>()(
  persist(
    (set, get) => ({
      // Initial State
      missions: [],
      activeMissions: [],
      selectedMission: null,
      sectRelations: [
        {
          fromSect: 'preservers',
          toSect: 'adaptors',
          relationship: -20,
          recentEvents: [],
          tradeAgreements: []
        },
        {
          fromSect: 'preservers',
          toSect: 'wanderers',
          relationship: 10,
          recentEvents: [],
          tradeAgreements: []
        },
        {
          fromSect: 'adaptors',
          toSect: 'wanderers',
          relationship: -30,
          recentEvents: [],
          tradeAgreements: []
        }
      ],
      playerSectAffinity: {
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
            ...config,
            shipClass: config.shipClass as any,
            shipSize: config.shipSize as any
          });

          set(state => ({
            missions: [...state.missions, mission],
            activeMissions: [...state.activeMissions, mission.id],
            selectedMission: mission
          }));

          // Update sect affinity
          get().updateSectRelations(config.sect, config.sect, 10);

          Logger.info(`Created generational mission: ${mission.name}`, {
            sect: mission.sect,
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

        // Update sect affinity based on success
        const affinityChange = mission.successLevel === 'complete' ? 20 :
                              mission.successLevel === 'partial' ? 10 :
                              mission.successLevel === 'pyrrhic' ? 5 : -10;

        get().updateSectRelations(mission.sect, mission.sect, affinityChange);

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

      forceEventGeneration: (missionId: string, category?: string) => {
        const mission = get().missions.find(m => m.id === missionId);
        if (!mission) return;

        const event = EventService.generateEvent(mission, category as any);
        if (event) {
          mission.activeEvents.push(event);

          set(state => ({
            missions: state.missions.map(m => m.id === missionId ? mission : m),
            selectedMission: state.selectedMission?.id === missionId ? mission : state.selectedMission
          }));
        }
      },

      // Automation Management Actions
      updateAutomationConfig: (missionId: string, config: Partial<any>) => {
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

      overrideAIDecision: (missionId: string, decisionId: string, override: any) => {
        // Implementation for overriding AI decisions
        Logger.info(`Override AI decision: ${decisionId}`, { override });
      },

      // Sect Management Actions
      processSectDilemma: (missionId: string, choice: any) => {
        const mission = get().missions.find(m => m.id === missionId);
        if (!mission) return;

        try {
          let result;
          switch (mission.sect) {
            case 'preservers':
              result = SectService.processPreserversDialemma(mission, choice);
              break;
            case 'adaptors':
              result = SectService.processAdaptorsEvolution(mission, choice);
              break;
            case 'wanderers':
              result = SectService.processWanderersSurvival(mission, choice);
              break;
            default:
              return;
          }

          // Apply results to mission
          Object.entries(result.resourceChanges).forEach(([resource, change]) => {
            if (change !== undefined) {
              (mission.resources as any)[resource] += change;
            }
          });

          // Apply population effects
          result.populationEffects.forEach(effect => {
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

          Logger.info(`Processed sect dilemma for ${mission.sect}`, {
            choice,
            consequences: result.longTermConsequences
          });

        } catch (error) {
          Logger.error('Failed to process sect dilemma', error);
        }
      },

      updateSectRelations: (fromSect: SectTypeType, toSect: SectTypeType, change: number) => {
        set(state => ({
          sectRelations: state.sectRelations.map(relation => {
            if (relation.fromSect === fromSect && relation.toSect === toSect) {
              return {
                ...relation,
                relationship: Math.max(-100, Math.min(100, relation.relationship + change))
              };
            }
            return relation;
          }),
          playerSectAffinity: {
            ...state.playerSectAffinity,
            [fromSect]: Math.max(-100, Math.min(100, state.playerSectAffinity[fromSect] + change))
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

      getMissionsBySect: (sect: SectTypeType) => {
        return get().missions.filter(mission => mission.sect === sect);
      }
    }),
    {
      name: 'generational-mission-storage',
      partialize: (state) => ({
        missions: state.missions,
        activeMissions: state.activeMissions,
        sectRelations: state.sectRelations,
        playerSectAffinity: state.playerSectAffinity
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