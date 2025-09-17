// config/gameConfig.ts
interface GameConfig {
  intervals: {
    resourceGeneration: number;
    autoSave: number;
    notificationTimeout: number;
  };
  limits: {
    maxNotifications: number;
    maxCrewMembers: number;
    maxStarSystems: number;
  };
  features: {
    enableAutoSave: boolean;
    enableAnalytics: boolean;
    debugMode: boolean;
  };
  ui: {
    theme: 'dark' | 'light';
    animations: boolean;
    soundEffects: boolean;
  };
  performance: {
    maxRenderDistance: number;
    enableCulling: boolean;
    targetFPS: number;
  };
}

export const gameConfig: GameConfig = {
  intervals: {
    resourceGeneration: 3000,
    autoSave: 30000,
    notificationTimeout: 3000
  },
  limits: {
    maxNotifications: 5,
    maxCrewMembers: 20,
    maxStarSystems: 50
  },
  features: {
    enableAutoSave: true,
    enableAnalytics: false,
    debugMode: import.meta.env.DEV
  },
  ui: {
    theme: 'dark',
    animations: true,
    soundEffects: false
  },
  performance: {
    maxRenderDistance: 1000,
    enableCulling: true,
    targetFPS: 60
  }
};

// Environment-specific overrides
if (import.meta.env.PROD) {
  gameConfig.features.enableAnalytics = true;
  gameConfig.performance.targetFPS = 30; // Lower FPS for better performance in production
}

export default gameConfig;