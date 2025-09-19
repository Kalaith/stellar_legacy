// utils/validation.ts
import { ServiceError, ERROR_CODES } from './result';
import type { ChronicleEntry, ChronicleDecision } from '../types/chronicle';
import type { HeritageModifier } from '../types/heritage';
import type { LegacyCard } from '../types/legacyDecks';
import type { PacingState } from '../types/pacing';

/**
 * Type guards and validation utilities for runtime type checking
 */

/**
 * Base validation interface
 */
interface ValidationRule<T> {
  validate: (value: unknown) => value is T;
  errorMessage: string;
}

/**
 * Common validation utilities
 */
export const ValidationUtils = {
  /**
   * Check if value is a non-empty string
   */
  isNonEmptyString: (value: unknown): value is string => {
    return typeof value === 'string' && value.trim().length > 0;
  },

  /**
   * Check if value is a positive number
   */
  isPositiveNumber: (value: unknown): value is number => {
    return typeof value === 'number' && value > 0 && !isNaN(value);
  },

  /**
   * Check if value is a non-negative number
   */
  isNonNegativeNumber: (value: unknown): value is number => {
    return typeof value === 'number' && value >= 0 && !isNaN(value);
  },

  /**
   * Check if value is within range
   */
  isInRange: (value: unknown, min: number, max: number): value is number => {
    return typeof value === 'number' && value >= min && value <= max && !isNaN(value);
  },

  /**
   * Check if value is a valid date
   */
  isValidDate: (value: unknown): value is Date => {
    return value instanceof Date && !isNaN(value.getTime());
  },

  /**
   * Check if value is an array with minimum length
   */
  isArrayWithMinLength: <T>(value: unknown, minLength: number): value is T[] => {
    return Array.isArray(value) && value.length >= minLength;
  },

  /**
   * Check if object has required properties
   */
  hasRequiredProperties: (
    value: unknown,
    properties: string[]
  ): value is Record<string, unknown> => {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const obj = value as Record<string, unknown>;
    return properties.every(prop => prop in obj && obj[prop] !== undefined);
  },
};

/**
 * Domain-specific validators
 */
export const DomainValidators = {
  /**
   * Validate ChronicleEntry
   */
  chronicleEntry: (value: unknown): value is ChronicleEntry => {
    if (!ValidationUtils.hasRequiredProperties(value, [
      'missionId',
      'missionName',
      'missionNumber',
      'startedAt',
      'completedAt',
    ])) {
      return false;
    }

    const entry = value as unknown as ChronicleEntry;

    return (
      ValidationUtils.isNonEmptyString(entry.missionId) &&
      ValidationUtils.isNonEmptyString(entry.missionName) &&
      ValidationUtils.isPositiveNumber(entry.missionNumber) &&
      ValidationUtils.isValidDate(entry.startedAt) &&
      ValidationUtils.isValidDate(entry.completedAt)
    );
  },

  /**
   * Validate ChronicleDecision
   */
  chronicleDecision: (value: unknown): value is ChronicleDecision => {
    if (!ValidationUtils.hasRequiredProperties(value, [
      'id',
      'title',
      'description',
      'category',
      'urgency',
      'scope',
    ])) {
      return false;
    }

    const decision = value as unknown as ChronicleDecision;

    return (
      ValidationUtils.isNonEmptyString(decision.id) &&
      ValidationUtils.isNonEmptyString(decision.title) &&
      ValidationUtils.isNonEmptyString(decision.description)
    );
  },

  /**
   * Validate HeritageModifier
   */
  heritageModifier: (value: unknown): value is HeritageModifier => {
    if (!ValidationUtils.hasRequiredProperties(value, [
      'id',
      'name',
      'source',
      'tier',
    ])) {
      return false;
    }

    const modifier = value as unknown as HeritageModifier;

    return (
      ValidationUtils.isNonEmptyString(modifier.id) &&
      ValidationUtils.isNonEmptyString(modifier.name) &&
      ['mission_success', 'decision_consequence', 'cultural_evolution', 'artifact_discovery'].includes(String(modifier.source)) &&
      ['minor', 'moderate', 'major', 'legendary'].includes(modifier.tier)
    );
  },

  /**
   * Validate LegacyCard
   */
  legacyCard: (value: unknown): value is LegacyCard => {
    if (!ValidationUtils.hasRequiredProperties(value, [
      'id',
      'name',
      'type',
      'legacy',
      'tier',
    ])) {
      return false;
    }

    const card = value as unknown as LegacyCard;

    return (
      ValidationUtils.isNonEmptyString(card.id) &&
      ValidationUtils.isNonEmptyString(card.name) &&
      ['event', 'bonus', 'crisis', 'opportunity', 'memory', 'tradition'].includes(card.type) &&
      ['preservers', 'adaptors', 'wanderers'].includes(card.legacy) &&
      ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(card.tier)
    );
  },

  /**
   * Validate PacingState
   */
  pacingState: (value: unknown): value is PacingState => {
    if (!ValidationUtils.hasRequiredProperties(value, [
      'currentPhase',
      'timeAcceleration',
      'paused',
    ])) {
      return false;
    }

    const state = value as unknown as PacingState;

    return (
      ['early_game', 'mid_game', 'late_game', 'end_game'].includes(state.currentPhase) &&
      ValidationUtils.isPositiveNumber(state.timeAcceleration) &&
      typeof (state as any).paused === 'boolean' || typeof (state as any).isPaused === 'boolean'
    );
  },
};

/**
 * Validation helper that throws ServiceError on failure
 */
export const validate = {
  /**
   * Require a value to be non-null/undefined
   */
  required: <T>(value: T | null | undefined, fieldName: string): T => {
    if (value === null || value === undefined) {
      throw new ServiceError(
        `${fieldName} is required`,
        ERROR_CODES.REQUIRED_FIELD,
        { fieldName, value }
      );
    }
    return value;
  },

  /**
   * Validate against a type guard
   */
  against: <T>(
    value: unknown,
    guard: (value: unknown) => value is T,
    fieldName: string,
    expectedType: string
  ): T => {
    if (!guard(value)) {
      throw new ServiceError(
        `${fieldName} must be a valid ${expectedType}`,
        ERROR_CODES.INVALID_FORMAT,
        { fieldName, value, expectedType }
      );
    }
    return value;
  },

  /**
   * Validate string length
   */
  stringLength: (
    value: string,
    fieldName: string,
    minLength: number = 1,
    maxLength: number = 1000
  ): string => {
    if (value.length < minLength || value.length > maxLength) {
      throw new ServiceError(
        `${fieldName} must be between ${minLength} and ${maxLength} characters`,
        ERROR_CODES.INVALID_FORMAT,
        { fieldName, value, minLength, maxLength, actualLength: value.length }
      );
    }
    return value;
  },

  /**
   * Validate number range
   */
  numberRange: (
    value: number,
    fieldName: string,
    min: number = Number.MIN_SAFE_INTEGER,
    max: number = Number.MAX_SAFE_INTEGER
  ): number => {
    if (value < min || value > max) {
      throw new ServiceError(
        `${fieldName} must be between ${min} and ${max}`,
        ERROR_CODES.INVALID_FORMAT,
        { fieldName, value, min, max }
      );
    }
    return value;
  },

  /**
   * Validate array length
   */
  arrayLength: <T>(
    value: T[],
    fieldName: string,
    minLength: number = 0,
    maxLength: number = Number.MAX_SAFE_INTEGER
  ): T[] => {
    if (value.length < minLength || value.length > maxLength) {
      throw new ServiceError(
        `${fieldName} must contain between ${minLength} and ${maxLength} items`,
        ERROR_CODES.INVALID_FORMAT,
        { fieldName, minLength, maxLength, actualLength: value.length }
      );
    }
    return value;
  },

  /**
   * Validate enum value
   */
  enumValue: <T extends string>(
    value: string,
    fieldName: string,
    allowedValues: readonly T[]
  ): T => {
    if (!allowedValues.includes(value as T)) {
      throw new ServiceError(
        `${fieldName} must be one of: ${allowedValues.join(', ')}`,
        ERROR_CODES.INVALID_FORMAT,
        { fieldName, value, allowedValues }
      );
    }
    return value as T;
  },

  /**
   * Validate ChronicleEntry with detailed error reporting
   */
  chronicleEntry: (value: unknown): ChronicleEntry => {
    return validate.against(
      value,
      DomainValidators.chronicleEntry,
      'chronicleEntry',
      'ChronicleEntry'
    );
  },

  /**
   * Validate ChronicleDecision with detailed error reporting
   */
  chronicleDecision: (value: unknown): ChronicleDecision => {
    return validate.against(
      value,
      DomainValidators.chronicleDecision,
      'chronicleDecision',
      'ChronicleDecision'
    );
  },

  /**
   * Validate HeritageModifier with detailed error reporting
   */
  heritageModifier: (value: unknown): HeritageModifier => {
    return validate.against(
      value,
      DomainValidators.heritageModifier,
      'heritageModifier',
      'HeritageModifier'
    );
  },

  /**
   * Validate LegacyCard with detailed error reporting
   */
  legacyCard: (value: unknown): LegacyCard => {
    return validate.against(
      value,
      DomainValidators.legacyCard,
      'legacyCard',
      'LegacyCard'
    );
  },

  /**
   * Validate PacingState with detailed error reporting
   */
  pacingState: (value: unknown): PacingState => {
    return validate.against(
      value,
      DomainValidators.pacingState,
      'pacingState',
      'PacingState'
    );
  },
};

/**
 * Sanitization utilities for user input
 */
export const sanitize = {
  /**
   * Sanitize text input
   */
  text: (input: string, maxLength: number = 1000): string => {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .trim()
      .slice(0, maxLength);
  },

  /**
   * Sanitize filename
   */
  filename: (name: string, maxLength: number = 255): string => {
    return name
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, maxLength);
  },

  /**
   * Sanitize numeric input
   */
  number: (input: string): number => {
    const cleaned = input.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  },

  /**
   * Sanitize array of strings
   */
  stringArray: (input: unknown[], maxLength: number = 100): string[] => {
    return input
      .filter((item): item is string => typeof item === 'string')
      .map(str => sanitize.text(str))
      .slice(0, maxLength);
  },
};

/**
 * Export commonly used validators for convenience
 */
export const { chronicleEntry, chronicleDecision, heritageModifier, legacyCard, pacingState } = validate;