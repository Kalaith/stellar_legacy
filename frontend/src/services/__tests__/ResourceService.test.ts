import { describe, it, expect } from 'vitest';
import { ResourceService } from '../ResourceService';
import type { Resources } from '../../types/game';

describe('ResourceService', () => {
  const mockResources: Resources = {
    credits: 1000,
    minerals: 500,
    energy: 300,
    food: 200,
    influence: 100,
  };

  describe('canAfford', () => {
    it('should return true when resources are sufficient', () => {
      const cost = { credits: 500, minerals: 200 };
      expect(ResourceService.canAfford(mockResources, cost)).toBe(true);
    });

    it('should return false when resources are insufficient', () => {
      const cost = { credits: 1500, minerals: 200 };
      expect(ResourceService.canAfford(mockResources, cost)).toBe(false);
    });

    it('should return false when any resource is insufficient', () => {
      const cost = { credits: 500, minerals: 600 };
      expect(ResourceService.canAfford(mockResources, cost)).toBe(false);
    });
  });

  describe('deductCost', () => {
    it('should deduct costs from resources correctly', () => {
      const cost = { credits: 200, minerals: 100 };
      const result = ResourceService.deductCost(mockResources, cost);

      expect(result.credits).toBe(800);
      expect(result.minerals).toBe(400);
      expect(result.energy).toBe(300); // unchanged
    });

    it('should not mutate original resources object', () => {
      const cost = { credits: 200 };
      const result = ResourceService.deductCost(mockResources, cost);

      expect(mockResources.credits).toBe(1000);
      expect(result).not.toBe(mockResources);
    });
  });

  describe('addResources', () => {
    it('should add resources correctly', () => {
      const addition = { credits: 100, minerals: 50 };
      const result = ResourceService.addResources(mockResources, addition);

      expect(result.credits).toBe(1100);
      expect(result.minerals).toBe(550);
      expect(result.energy).toBe(300); // unchanged
    });

    it('should not mutate original resources object', () => {
      const addition = { credits: 100 };
      const result = ResourceService.addResources(mockResources, addition);

      expect(mockResources.credits).toBe(1000);
      expect(result).not.toBe(mockResources);
    });
  });

  describe('validateResourceAmount', () => {
    it('should return true for valid amounts', () => {
      expect(ResourceService.validateResourceAmount(0)).toBe(true);
      expect(ResourceService.validateResourceAmount(100)).toBe(true);
      expect(ResourceService.validateResourceAmount(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it('should return false for invalid amounts', () => {
      expect(ResourceService.validateResourceAmount(-1)).toBe(false);
      expect(ResourceService.validateResourceAmount(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    });
  });

  describe('calculateTradeCost', () => {
    it('should calculate trade cost correctly', () => {
      expect(ResourceService.calculateTradeCost(10, 5)).toBe(50);
      expect(ResourceService.calculateTradeCost(0, 10)).toBe(0);
    });
  });

  describe('canAffordTrade', () => {
    it('should return true when credits are sufficient', () => {
      expect(ResourceService.canAffordTrade(mockResources, 500)).toBe(true);
    });

    it('should return false when credits are insufficient', () => {
      expect(ResourceService.canAffordTrade(mockResources, 1500)).toBe(false);
    });
  });

  describe('processTrade', () => {
    it('should process buying trade correctly', () => {
      const result = ResourceService.processTrade(mockResources, 200, 'minerals', 10, true);

      expect(result.credits).toBe(800);
      expect(result.minerals).toBe(510);
    });

    it('should process selling trade correctly', () => {
      const result = ResourceService.processTrade(mockResources, 200, 'minerals', 10, false);

      expect(result.credits).toBe(1200);
      expect(result.minerals).toBe(490);
    });

    it('should not mutate original resources object', () => {
      const result = ResourceService.processTrade(mockResources, 200, 'minerals', 10, true);

      expect(mockResources.credits).toBe(1000);
      expect(result).not.toBe(mockResources);
    });
  });

  describe('generateResources', () => {
    it('should generate resources based on rates', () => {
      const rates = { credits: 50, minerals: 25 };
      const result = ResourceService.generateResources(mockResources, rates);

      expect(result.credits).toBe(1050);
      expect(result.minerals).toBe(525);
      expect(result.energy).toBe(300); // unchanged
    });

    it('should not mutate original resources object', () => {
      const rates = { credits: 50 };
      const result = ResourceService.generateResources(mockResources, rates);

      expect(mockResources.credits).toBe(1000);
      expect(result).not.toBe(mockResources);
    });
  });
});
