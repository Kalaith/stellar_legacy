// types/enums.ts
export const TabId = {
  DASHBOARD: 'dashboard',
  SHIP_BUILDER: 'ship-builder',
  CREW_QUARTERS: 'crew-quarters',
  GALAXY_MAP: 'galaxy-map',
  MARKET: 'market',
  LEGACY: 'legacy',
  MISSION_COMMAND: 'mission-command',
  DYNASTY_HALL: 'dynasty-hall',
  LEGACY_RELATIONS: 'legacy-relations',
  CULTURAL_EVOLUTION: 'cultural-evolution',
  CHRONICLE: 'chronicle'
} as const;

export type TabIdType = typeof TabId[keyof typeof TabId];

export const SystemStatus = {
  EXPLORED: 'explored',
  UNEXPLORED: 'unexplored',
  MISSION_TARGET: 'mission_target',
  MISSION_ACTIVE: 'mission_active'
} as const;

export type SystemStatusType = typeof SystemStatus[keyof typeof SystemStatus];

export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

export type NotificationTypeType = typeof NotificationType[keyof typeof NotificationType];

export const PlanetType = {
  ROCKY: 'Rocky',
  GAS_GIANT: 'Gas Giant',
  ICE: 'Ice',
  DESERT: 'Desert',
  UNKNOWN: 'Unknown'
} as const;

export type PlanetTypeType = typeof PlanetType[keyof typeof PlanetType];

export const CrewRole = {
  CAPTAIN: 'Captain',
  ENGINEER: 'Engineer',
  PILOT: 'Pilot',
  DIPLOMAT: 'Diplomat',
  GUNNER: 'Gunner',
  SCIENTIST: 'Scientist',
  MEDIC: 'Medic'
} as const;

export type CrewRoleType = typeof CrewRole[keyof typeof CrewRole];

export const TradeAction = {
  BUY: 'buy',
  SELL: 'sell'
} as const;

export type TradeActionType = typeof TradeAction[keyof typeof TradeAction];

export const ComponentCategory = {
  HULLS: 'hulls',
  ENGINES: 'engines',
  WEAPONS: 'weapons'
} as const;

export type ComponentCategoryType = typeof ComponentCategory[keyof typeof ComponentCategory];

// Generational Mission Types
export const LegacyType = {
  PRESERVERS: 'preservers',
  ADAPTORS: 'adaptors',
  WANDERERS: 'wanderers'
} as const;

export type LegacyTypeType = typeof LegacyType[keyof typeof LegacyType];

export const CohortType = {
  ENGINEERS: 'engineers',
  FARMERS: 'farmers',
  SCHOLARS: 'scholars',
  SECURITY: 'security',
  LEADERS: 'leaders',
  GENERAL: 'general'
} as const;

export type CohortTypeType = typeof CohortType[keyof typeof CohortType];

export const MissionObjective = {
  MINING: 'mining',
  COLONIZATION: 'colonization',
  EXPLORATION: 'exploration',
  RESCUE: 'rescue'
} as const;

export type MissionObjectiveType = typeof MissionObjective[keyof typeof MissionObjective];

export const MissionPhase = {
  PREPARATION: 'preparation',
  TRAVEL: 'travel',
  OPERATION: 'operation',
  RETURN: 'return',
  COMPLETION: 'completion'
} as const;

export type MissionPhaseType = typeof MissionPhase[keyof typeof MissionPhase];

export const EventCategory = {
  IMMEDIATE_CRISIS: 'immediate_crisis',
  GENERATIONAL_CHALLENGE: 'generational_challenge',
  MISSION_MILESTONE: 'mission_milestone',
  LEGACY_MOMENT: 'legacy_moment'
} as const;

export type EventCategoryType = typeof EventCategory[keyof typeof EventCategory];

export const ShipClass = {
  COLONY: 'colony',
  HARVESTER: 'harvester',
  EXPLORER: 'explorer',
  FORTRESS: 'fortress'
} as const;

export type ShipClassType = typeof ShipClass[keyof typeof ShipClass];

export const ShipSize = {
  MEDIUM: 'medium',
  LARGE: 'large',
  MASSIVE: 'massive',
  GIGANTIC: 'gigantic'
} as const;

export type ShipSizeType = typeof ShipSize[keyof typeof ShipSize];