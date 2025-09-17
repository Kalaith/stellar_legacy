// constants/gameConstants.ts
import gameConfig from '../config/gameConfig';
export const GAME_CONSTANTS = {
  COSTS: {
    CREW_TRAINING: 100,
    MORALE_BOOST: 50,
    CREW_RECRUITMENT: 200,
    EXPLORATION: { energy: 50 },
    COLONY_ESTABLISHMENT: { credits: 200, minerals: 100 }
  },
  LIMITS: {
    MAX_MORALE: 100,
    MAX_SKILL_LEVEL: 10,
    CREW_MORALE_BOOST: 10,
    MAX_CREW_AGE: 45,
    MIN_CREW_AGE: 25,
    MAX_CREW_MORALE: 90,
    MIN_CREW_MORALE: 60,
    MAX_RANDOM_SKILL: 10,
    MIN_RANDOM_SKILL: 2,
    MAX_CREW_MEMBERS: gameConfig.limits.maxCrewMembers,
    MAX_STAR_SYSTEMS: gameConfig.limits.maxStarSystems
  },
  RESOURCE_GENERATION: {
    INTERVAL_MS: gameConfig.intervals.resourceGeneration,
    BASE_RATES: {
      CREDITS: 2,
      ENERGY: 1,
      MINERALS: 1,
      FOOD: 1,
      INFLUENCE: 0.2
    },
    COLONY_BOOST: 0.5
  },
  TRADE: {
    DEFAULT_AMOUNT: 10
  },
  NOTIFICATIONS: {
    TIMEOUT_MS: gameConfig.intervals.notificationTimeout,
    MAX_COUNT: gameConfig.limits.maxNotifications
  },
  WORLD_GENERATION: {
    MAX_PLANETS_PER_SYSTEM: 3,
    MIN_PLANETS_PER_SYSTEM: 1,
    MAX_RESOURCES_PER_PLANET: 2,
    MIN_RESOURCES_PER_PLANET: 1
  },
  RANDOM_NAMES: {
    CREW_FIRST_NAMES: ['Alex', 'Sam', 'Taylor', 'Jordan', 'Casey', 'Elena', 'Marcus', 'Zara', 'Kex', 'Rivera', 'Johnson', 'Kim', 'Smith', 'Wu', 'Chen', 'Thorne'],
    CREW_LAST_NAMES: ['Rivera', 'Johnson', 'Kim', 'Smith', 'Wu', 'Voss', 'Cole', 'Chen', 'Thorne']
  },
  CREW_ROLES: ['Engineer', 'Pilot', 'Gunner', 'Scientist', 'Medic', 'Captain', 'Diplomat'],
  CREW_BACKGROUNDS: [
    'Academy graduate seeking adventure',
    'Veteran spacer with mysterious past',
    'Talented rookie with natural abilities',
    'Former corporate employee turned explorer',
    'Former military officer turned explorer',
    'Shipyard veteran with decades of experience',
    'Ace pilot from the outer colonies',
    'Smooth-talking merchant with connections'
  ],
  PLANET_TYPES: ['Rocky', 'Gas Giant', 'Ice', 'Desert'],
  RESOURCE_TYPES: ['minerals', 'energy', 'food']
} as const;