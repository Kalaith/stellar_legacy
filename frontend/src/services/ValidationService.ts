// services/ValidationService.ts
import { GAME_CONSTANTS } from '../constants/gameConstants';
import type { Resources, CrewMember, Ship } from '../types/game';

export const ValidationService = {
  validateCrewTraining: (credits: number): { isValid: boolean; message?: string } => {
    if (credits < GAME_CONSTANTS.COSTS.CREW_TRAINING) {
      return {
        isValid: false,
        message: `Need ${GAME_CONSTANTS.COSTS.CREW_TRAINING} credits for training`
      };
    }
    return { isValid: true };
  },

  validateMoraleBoost: (credits: number): { isValid: boolean; message?: string } => {
    if (credits < GAME_CONSTANTS.COSTS.MORALE_BOOST) {
      return {
        isValid: false,
        message: `Need ${GAME_CONSTANTS.COSTS.MORALE_BOOST} credits to boost morale`
      };
    }
    return { isValid: true };
  },

  validateCrewRecruitment: (credits: number, currentCrew: CrewMember[], ship: Ship): { isValid: boolean; message?: string } => {
    if (credits < GAME_CONSTANTS.COSTS.CREW_RECRUITMENT) {
      return {
        isValid: false,
        message: `Need ${GAME_CONSTANTS.COSTS.CREW_RECRUITMENT} credits to recruit crew`
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
    if (energy < GAME_CONSTANTS.COSTS.EXPLORATION.energy) {
      return {
        isValid: false,
        message: `Need ${GAME_CONSTANTS.COSTS.EXPLORATION.energy} energy to explore`
      };
    }
    return { isValid: true };
  },

  validateColonyEstablishment: (resources: Resources): { isValid: boolean; message?: string } => {
    if (resources.credits < GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.credits) {
      return {
        isValid: false,
        message: `Need ${GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.credits} credits to establish colony`
      };
    }
    if (resources.minerals < GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.minerals) {
      return {
        isValid: false,
        message: `Need ${GAME_CONSTANTS.COSTS.COLONY_ESTABLISHMENT.minerals} minerals to establish colony`
      };
    }
    return { isValid: true };
  },

  validateTrade: (resources: Resources, resource: keyof Resources, action: 'buy' | 'sell', marketPrice: number): { isValid: boolean; message?: string } => {
    const amount = GAME_CONSTANTS.TRADE.DEFAULT_AMOUNT;

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
    if (skillLevel < 0 || skillLevel > GAME_CONSTANTS.LIMITS.MAX_SKILL_LEVEL) {
      return {
        isValid: false,
        message: `Skill level must be between 0 and ${GAME_CONSTANTS.LIMITS.MAX_SKILL_LEVEL}`
      };
    }
    return { isValid: true };
  },

  validateMorale: (morale: number): { isValid: boolean; message?: string } => {
    if (morale < 0 || morale > GAME_CONSTANTS.LIMITS.MAX_MORALE) {
      return {
        isValid: false,
        message: `Morale must be between 0 and ${GAME_CONSTANTS.LIMITS.MAX_MORALE}`
      };
    }
    return { isValid: true };
  }
};