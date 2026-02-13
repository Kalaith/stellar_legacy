// constants/game-balance.ts
/**
 * Game balance constants to replace magic numbers throughout the codebase
 * All values are centralized here for easy balancing and maintenance
 */

export const gameBalance = {
  CHRONICLE: {
    HIGH_IMPACT_THRESHOLD: 0.7,
    MAJOR_DECISION_WEIGHT: 0.8,
    SIGNIFICANT_CONSEQUENCE_THRESHOLD: 0.6,
    CHRONICLE_WEIGHT_MULTIPLIER: 1.2,
    MAX_ENTRIES_PER_MISSION: 50,
  },

  HERITAGE: {
    MAX_RESOURCE_MODIFIERS: 3,
    MAX_POPULATION_MODIFIERS: 2,
    TIER_IMPACT_MULTIPLIER: 1.5,
    MAX_MODIFIERS_PER_SELECTION: 5,
    SYNERGY_BONUS_THRESHOLD: 0.8,
    CONFLICT_PENALTY_MULTIPLIER: 0.5,

    TIER_WEIGHTS: {
      MINOR: 0.2,
      MODERATE: 0.5,
      MAJOR: 0.8,
      LEGENDARY: 1.0,
    },

    TIER_LIMITS: {
      LEGENDARY: 1,
      MAJOR: 2,
      MODERATE: 3,
      MINOR: 5,
    },
  },

  PACING: {
    EARLY_GAME_YEARS: 50,
    MID_GAME_YEARS: 150,
    LATE_GAME_YEARS: 300,

    ACCELERATION_LIMITS: {
      MIN_MULTIPLIER: 0.1,
      MAX_MULTIPLIER: 10.0,
      NORMAL_MULTIPLIER: 1.0,
    },

    ENGAGEMENT_THRESHOLDS: {
      BORED: 0.3,
      ENGAGED: 0.7,
      OVERWHELMED: 0.9,
    },

    AUTO_PAUSE_EVENTS: {
      MAJOR_CRISIS: true,
      LEGACY_CHOICE: true,
      MISSION_COMPLETION: false,
    },
  },

  LEGACY_DECK: {
    DEFAULT_DECK_SIZE: 20,
    MAX_ACTIVE_CARDS: 5,
    CARD_WEIGHT_MULTIPLIER: 1.2,

    TRIGGER_PROBABILITIES: {
      BASE: 0.1,
      RARE_EVENT: 0.05,
      COMMON_EVENT: 0.3,
    },

    BALANCE_THRESHOLDS: {
      OVERPOWERED: 0.9,
      UNDERPOWERED: 0.2,
      TOO_FREQUENT: 3.0, // Times average usage
      TOO_RARE: 0.2, // Times average usage
    },

    RARITY_WEIGHTS: {
      COMMON: 0.5,
      UNCOMMON: 0.3,
      RARE: 0.15,
      EPIC: 0.04,
      LEGENDARY: 0.01,
    },
  },

  DECISION_TRACKING: {
    MAX_CHAIN_DEPTH: 5,
    SIGNIFICANT_IMPACT_THRESHOLD: 0.5,
    PREDICTION_ACCURACY_BONUS: 0.1,

    CONSEQUENCE_DELAYS: {
      IMMEDIATE: 0, // Years
      SHORT_TERM: 5,
      MEDIUM_TERM: 20,
      LONG_TERM: 50,
    },

    SEVERITY_MULTIPLIERS: {
      MINOR: 0.5,
      MODERATE: 1.0,
      MAJOR: 2.0,
      CIVILIZATION_DEFINING: 5.0,
    },
  },

  UI: {
    NOTIFICATION_DURATION: 5000, // milliseconds
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,

    PAGINATION: {
      DEFAULT_PAGE_SIZE: 25,
      MAX_PAGE_SIZE: 100,
    },

    TERMINAL: {
      BORDER_WIDTH: 65,
      GENERATIONAL_BORDER_WIDTH: 80,
      TAB_PADDING: '0.5rem 1rem',
    },
  },

  PERFORMANCE: {
    MEMOIZATION_CACHE_SIZE: 100,
    DEBOUNCE_SEARCH_MS: 300,
    VIRTUAL_LIST_ITEM_HEIGHT: 60,
    MAX_RENDERED_ITEMS: 50,
  },
} as const;

/**
 * Type-safe helper to get nested balance values
 */
export type GameBalanceKey = keyof typeof gameBalance;
export type GameBalanceValue<K extends GameBalanceKey> = typeof gameBalance[K];

/**
 * Helper function to get balance values with type safety
 */
export function getGameBalance<K extends GameBalanceKey>(
  category: K
): GameBalanceValue<K> {
  return gameBalance[category];
}

/**
 * Helper function to get nested balance values
 */
export function getBalanceValue<
  K extends GameBalanceKey,
  T extends keyof GameBalanceValue<K>
>(category: K, key: T): GameBalanceValue<K>[T] {
  return gameBalance[category][key];
}