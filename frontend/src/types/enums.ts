// types/enums.ts
export const TabId = {
  DASHBOARD: 'dashboard',
  SHIP_BUILDER: 'ship-builder',
  CREW_QUARTERS: 'crew-quarters',
  GALAXY_MAP: 'galaxy-map',
  MARKET: 'market',
  LEGACY: 'legacy'
} as const;

export type TabIdType = typeof TabId[keyof typeof TabId];

export const SystemStatus = {
  EXPLORED: 'explored',
  UNEXPLORED: 'unexplored'
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