// types/errors.ts
import type { ComponentCost } from './game';

export class GameOperationError extends Error {
  constructor(
    public readonly operation: string,
    public readonly reason: string,
    public readonly requiredResources?: ComponentCost
  ) {
    super(`${operation} failed: ${reason}`);
    this.name = 'GameOperationError';
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