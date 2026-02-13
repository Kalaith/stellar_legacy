// services/ValidationService.ts
import { gameConstants } from '../constants/gameConstants';
import type { Resources, CrewMember, Ship } from '../types/game';
import type { ValidationResult } from '../types/errors';

export interface ResourceConstraints {
  min: number;
  max: number;
  dependencies?: Partial<Resources>;
}

export const resourceConstraints: Record<keyof Resources, ResourceConstraints> = {
  credits: { min: 0, max: 1_000_000 },
  energy: { min: 0, max: 10_000 },
  minerals: { min: 0, max: 50_000 },
  food: { min: 0, max: 25_000 },
  influence: { min: 0, max: 1_000 }
} as const;

export const ValidationService = {
  resourceConstraints,
  validateResourceConstraints: (resources: Resources): ValidationResult => {
    for (const [resource, amount] of Object.entries(resources)) {
      const constraints = resourceConstraints[resource as keyof Resources];
      if (amount < constraints.min || amount > constraints.max) {
        return {
          isValid: false,
          message: `${resource} must be between ${constraints.min} and ${constraints.max}`
        };
      }
    }
    return { isValid: true };
  },

  validateResourceOperation: (
    resources: Resources,
    operation: 'add' | 'subtract',
    changes: Partial<Resources>
  ): ValidationResult => {
    const projectedResources = { ...resources };

    for (const [resource, amount] of Object.entries(changes)) {
      const resourceKey = resource as keyof Resources;
      if (amount && projectedResources[resourceKey] !== undefined) {
        if (operation === 'add') {
          projectedResources[resourceKey] += amount;
        } else {
          projectedResources[resourceKey] -= amount;
        }
      }
    }

    return ValidationService.validateResourceConstraints(projectedResources);
  },

  validateTradeLimits: (
    resources: Resources,
    resource: keyof Resources,
    amount: number,
    isSelling: boolean
  ): ValidationResult => {
    const constraints = resourceConstraints[resource];
    const currentAmount = resources[resource];

    if (isSelling) {
      if (currentAmount - amount < constraints.min) {
        return {
          isValid: false,
          message: `Cannot sell ${amount} ${resource}. Would result in ${currentAmount - amount}, minimum is ${constraints.min}`
        };
      }
    } else {
      if (currentAmount + amount > constraints.max) {
        return {
          isValid: false,
          message: `Cannot buy ${amount} ${resource}. Would result in ${currentAmount + amount}, maximum is ${constraints.max}`
        };
      }
    }

    return { isValid: true };
  },
  validateCrewTraining: (credits: number): { isValid: boolean; message?: string } => {
    if (credits < gameConstants.COSTS.CREW_TRAINING) {
      return {
        isValid: false,
        message: `Need ${gameConstants.COSTS.CREW_TRAINING} credits for training`
      };
    }
    return { isValid: true };
  },

  validateMoraleBoost: (credits: number): { isValid: boolean; message?: string } => {
    if (credits < gameConstants.COSTS.MORALE_BOOST) {
      return {
        isValid: false,
        message: `Need ${gameConstants.COSTS.MORALE_BOOST} credits to boost morale`
      };
    }
    return { isValid: true };
  },

  validateCrewRecruitment: (credits: number, currentCrew: CrewMember[], ship: Ship): { isValid: boolean; message?: string } => {
    if (credits < gameConstants.COSTS.CREW_RECRUITMENT) {
      return {
        isValid: false,
        message: `Need ${gameConstants.COSTS.CREW_RECRUITMENT} credits to recruit crew`
      };
    }
    if (currentCrew.length >= ship.stats.crewCapacity) {
      return {
        isValid: false,
        message: 'Ship at crew capacity! Upgrade living quarters.'
      };
    }
    return { isValid: true };
  },

  validateSystemExploration: (energy: number): { isValid: boolean; message?: string } => {
    if (energy < gameConstants.COSTS.EXPLORATION.energy) {
      return {
        isValid: false,
        message: `Need ${gameConstants.COSTS.EXPLORATION.energy} energy to explore`
      };
    }
    return { isValid: true };
  },

  validateColonyEstablishment: (resources: Resources): { isValid: boolean; message?: string } => {
    if (resources.credits < gameConstants.COSTS.COLONY_ESTABLISHMENT.credits) {
      return {
        isValid: false,
        message: `Need ${gameConstants.COSTS.COLONY_ESTABLISHMENT.credits} credits to establish colony`
      };
    }
    if (resources.minerals < gameConstants.COSTS.COLONY_ESTABLISHMENT.minerals) {
      return {
        isValid: false,
        message: `Need ${gameConstants.COSTS.COLONY_ESTABLISHMENT.minerals} minerals to establish colony`
      };
    }
    return { isValid: true };
  },

  validateTrade: (resources: Resources, resource: keyof Resources, action: 'buy' | 'sell', marketPrice: number): { isValid: boolean; message?: string } => {
    const amount = gameConstants.TRADE.DEFAULT_AMOUNT;

    if (action === 'buy') {
      const cost = marketPrice * amount;
      if (resources.credits < cost) {
        return {
          isValid: false,
          message: 'Not enough credits!'
        };
      }
    } else {
      if (resources[resource] < amount) {
        return {
          isValid: false,
          message: `Not enough ${resource}!`
        };
      }
    }
    return { isValid: true };
  },

  validateResourceAmount: (amount: number, resource: string): { isValid: boolean; message?: string } => {
    if (amount < 0) {
      return {
        isValid: false,
        message: `${resource} amount cannot be negative`
      };
    }
    if (amount > Number.MAX_SAFE_INTEGER) {
      return {
        isValid: false,
        message: `${resource} amount is too large`
      };
    }
    return { isValid: true };
  },

  validateCrewCapacity: (currentCrew: number, maxCapacity: number): { isValid: boolean; message?: string } => {
    if (currentCrew >= maxCapacity) {
      return {
        isValid: false,
        message: 'Ship at crew capacity!'
      };
    }
    return { isValid: true };
  },

  validateSkillLevel: (skillLevel: number): { isValid: boolean; message?: string } => {
    if (skillLevel < 0 || skillLevel > gameConstants.LIMITS.MAX_SKILL_LEVEL) {
      return {
        isValid: false,
        message: `Skill level must be between 0 and ${gameConstants.LIMITS.MAX_SKILL_LEVEL}`
      };
    }
    return { isValid: true };
  },

  validateMorale: (morale: number): { isValid: boolean; message?: string } => {
    if (morale < 0 || morale > gameConstants.LIMITS.MAX_MORALE) {
      return {
        isValid: false,
        message: `Morale must be between 0 and ${gameConstants.LIMITS.MAX_MORALE}`
      };
    }
    return { isValid: true };
  }
};