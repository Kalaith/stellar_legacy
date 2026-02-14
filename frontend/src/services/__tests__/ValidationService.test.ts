import { describe, it, expect } from 'vitest';
import { ValidationService } from '../ValidationService';
import type { Resources, CrewMember, Ship } from '../../types/game';
import type { CrewMemberId } from '../../types/branded';

describe('ValidationService', () => {
  const mockResources: Resources = {
    credits: 1000,
    minerals: 500,
    energy: 300,
    food: 200,
    influence: 100,
  };

  const mockCrew: CrewMember[] = [
    {
      id: 'crew_1' as CrewMemberId,
      name: 'Test Crew',
      role: 'Engineer',
      skills: {
        engineering: 5,
        navigation: 3,
        combat: 2,
        diplomacy: 1,
        trade: 1,
      },
      morale: 80,
      background: 'Test background',
      age: 30,
      isHeir: false,
    },
  ];

  const mockShip: Ship = {
    name: 'Test Ship',
    hull: 'Standard Hull',
    components: {
      engine: 'Basic Engine',
      cargo: 'Basic Cargo',
      weapons: 'Basic Weapons',
      research: 'Basic Research',
      quarters: 'Basic Quarters',
    },
    stats: {
      speed: 10,
      cargo: 100,
      combat: 5,
      research: 2,
      crewCapacity: 5,
    },
  };

  describe('validateCrewTraining', () => {
    it('should return valid when credits are sufficient', () => {
      const result = ValidationService.validateCrewTraining(200);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid when credits are insufficient', () => {
      const result = ValidationService.validateCrewTraining(50);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Need 100 credits for training');
    });
  });

  describe('validateMoraleBoost', () => {
    it('should return valid when credits are sufficient', () => {
      const result = ValidationService.validateMoraleBoost(100);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid when credits are insufficient', () => {
      const result = ValidationService.validateMoraleBoost(25);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Need 50 credits to boost morale');
    });
  });

  describe('validateCrewRecruitment', () => {
    it('should return valid when all conditions are met', () => {
      const result = ValidationService.validateCrewRecruitment(300, mockCrew, mockShip);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid when credits are insufficient', () => {
      const result = ValidationService.validateCrewRecruitment(100, mockCrew, mockShip);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Need 200 credits to recruit crew');
    });

    it('should return invalid when ship is at capacity', () => {
      const fullCrew = Array(5).fill(mockCrew[0]);
      const result = ValidationService.validateCrewRecruitment(300, fullCrew, mockShip);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Ship at crew capacity! Upgrade living quarters.');
    });
  });

  describe('validateSystemExploration', () => {
    it('should return valid when energy is sufficient', () => {
      const result = ValidationService.validateSystemExploration(100);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid when energy is insufficient', () => {
      const result = ValidationService.validateSystemExploration(25);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Need 50 energy to explore');
    });
  });

  describe('validateColonyEstablishment', () => {
    it('should return valid when resources are sufficient', () => {
      const result = ValidationService.validateColonyEstablishment(mockResources);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid when credits are insufficient', () => {
      const insufficientResources = { ...mockResources, credits: 100 };
      const result = ValidationService.validateColonyEstablishment(insufficientResources);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Need 200 credits to establish colony');
    });

    it('should return invalid when minerals are insufficient', () => {
      const insufficientResources = { ...mockResources, minerals: 50 };
      const result = ValidationService.validateColonyEstablishment(insufficientResources);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Need 100 minerals to establish colony');
    });
  });

  describe('validateTrade', () => {
    it('should return valid for buying when credits are sufficient', () => {
      const result = ValidationService.validateTrade(mockResources, 'minerals', 'buy', 10);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid for buying when credits are insufficient', () => {
      const result = ValidationService.validateTrade(mockResources, 'minerals', 'buy', 200);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Not enough credits!');
    });

    it('should return valid for selling when resource is sufficient', () => {
      const result = ValidationService.validateTrade(mockResources, 'minerals', 'sell', 10);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid for selling when resource is insufficient', () => {
      const lowInfluenceResources = { ...mockResources, influence: 0 };
      const result = ValidationService.validateTrade(
        lowInfluenceResources,
        'influence',
        'sell',
        10
      );
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Not enough influence!');
    });
  });

  describe('validateResourceAmount', () => {
    it('should return valid for positive amounts', () => {
      const result = ValidationService.validateResourceAmount(100, 'credits');
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid for negative amounts', () => {
      const result = ValidationService.validateResourceAmount(-10, 'credits');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('credits amount cannot be negative');
    });

    it('should return invalid for amounts too large', () => {
      const result = ValidationService.validateResourceAmount(
        Number.MAX_SAFE_INTEGER + 1,
        'credits'
      );
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('credits amount is too large');
    });
  });

  describe('validateCrewCapacity', () => {
    it('should return valid when below capacity', () => {
      const result = ValidationService.validateCrewCapacity(3, 5);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid when at capacity', () => {
      const result = ValidationService.validateCrewCapacity(5, 5);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Ship at crew capacity!');
    });
  });

  describe('validateSkillLevel', () => {
    it('should return valid for skill levels within range', () => {
      const result = ValidationService.validateSkillLevel(5);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid for skill levels below minimum', () => {
      const result = ValidationService.validateSkillLevel(-1);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Skill level must be between 0 and 10');
    });

    it('should return invalid for skill levels above maximum', () => {
      const result = ValidationService.validateSkillLevel(15);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Skill level must be between 0 and 10');
    });
  });

  describe('validateMorale', () => {
    it('should return valid for morale within range', () => {
      const result = ValidationService.validateMorale(75);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid for morale below minimum', () => {
      const result = ValidationService.validateMorale(-10);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Morale must be between 0 and 100');
    });

    it('should return invalid for morale above maximum', () => {
      const result = ValidationService.validateMorale(150);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Morale must be between 0 and 100');
    });
  });
});
