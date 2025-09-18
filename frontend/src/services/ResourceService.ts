// services/ResourceService.ts
import type { Resources, ComponentCost } from '../types/game';
import { ValidationService } from './ValidationService';

export class ResourceService {
  static canAfford(resources: Resources, cost: ComponentCost): boolean {
    return Object.entries(cost).every(([resource, amount]) => {
      const resourceKey = resource as keyof Resources;
      return resources[resourceKey] >= (amount ?? 0);
    });
  }

  static deductCost(resources: Resources, cost: ComponentCost): Resources {
    const validation = ValidationService.validateResourceOperation(resources, 'subtract', cost);
    if (!validation.isValid) {
      throw new Error(`Resource deduction would violate constraints: ${validation.message}`);
    }

    const newResources = { ...resources };
    Object.entries(cost).forEach(([resource, amount]) => {
      const resourceKey = resource as keyof Resources;
      if (amount && newResources[resourceKey] !== undefined) {
        newResources[resourceKey] -= amount;
      }
    });
    return newResources;
  }

  static addResources(resources: Resources, addition: Partial<Resources>): Resources {
    const validation = ValidationService.validateResourceOperation(resources, 'add', addition);
    if (!validation.isValid) {
      throw new Error(`Resource addition would violate constraints: ${validation.message}`);
    }

    const newResources = { ...resources };
    Object.entries(addition).forEach(([resource, amount]) => {
      const resourceKey = resource as keyof Resources;
      if (amount && newResources[resourceKey] !== undefined) {
        newResources[resourceKey] += amount;
      }
    });
    return newResources;
  }

  static validateResourceAmount(amount: number): boolean {
    return amount >= 0 && amount <= Number.MAX_SAFE_INTEGER;
  }

  static calculateTradeCost(price: number, amount: number): number {
    return price * amount;
  }

  static canAffordTrade(resources: Resources, cost: number): boolean {
    return resources.credits >= cost;
  }

  static processTrade(resources: Resources, cost: number, resource: keyof Resources, amount: number, isBuying: boolean): Resources {
    // Validate trade limits
    const tradeValidation = ValidationService.validateTradeLimits(resources, resource, amount, !isBuying);
    if (!tradeValidation.isValid) {
      throw new Error(tradeValidation.message);
    }

    // Validate credit transaction
    const creditValidation = ValidationService.validateTradeLimits(resources, 'credits', cost, isBuying);
    if (!creditValidation.isValid) {
      throw new Error(creditValidation.message);
    }

    const newResources = { ...resources };

    if (isBuying) {
      newResources.credits -= cost;
      newResources[resource] += amount;
    } else {
      newResources.credits += cost;
      newResources[resource] -= amount;
    }

    return newResources;
  }

  static generateResources(resources: Resources, rates: Partial<Resources>): Resources {
    const validation = ValidationService.validateResourceOperation(resources, 'add', rates);
    if (!validation.isValid) {
      // For generation, we cap at max instead of throwing
      const newResources = { ...resources };
      Object.entries(rates).forEach(([resource, rate]) => {
        const resourceKey = resource as keyof Resources;
        if (rate && newResources[resourceKey] !== undefined) {
          const constraints = ValidationService.RESOURCE_CONSTRAINTS[resourceKey];
          newResources[resourceKey] = Math.min(constraints.max, newResources[resourceKey] + rate);
        }
      });
      return newResources;
    }

    const newResources = { ...resources };
    Object.entries(rates).forEach(([resource, rate]) => {
      const resourceKey = resource as keyof Resources;
      if (rate && newResources[resourceKey] !== undefined) {
        newResources[resourceKey] += rate;
      }
    });
    return newResources;
  }
}