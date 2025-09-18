// types/errors.ts
import type { ComponentCost } from './game';

export class GameOperationError extends Error {
  public readonly operation: string;
  public readonly reason: string;
  public readonly requiredResources?: ComponentCost;

  constructor(
    operation: string,
    reason: string,
    requiredResources?: ComponentCost
  ) {
    super(`${operation} failed: ${reason}`);
    this.name = 'GameOperationError';
    this.operation = operation;
    this.reason = reason;
    this.requiredResources = requiredResources;
  }
}

export type GameOperationResult<T> =
  | { success: true; data: T }
  | { success: false; error: GameOperationError };

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export type GameError = {
  type: 'VALIDATION' | 'RESOURCE' | 'NETWORK' | 'UNKNOWN';
  message: string;
  context?: Record<string, any>;
};