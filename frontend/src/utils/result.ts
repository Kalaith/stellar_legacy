// utils/result.ts
/**
 * Result type for consistent error handling across the application
 * Eliminates the need for throwing exceptions and provides type-safe error handling
 */

export type Result<T, E = ServiceError> = { success: true; data: T } | { success: false; error: E };

/**
 * Custom error class for service-layer errors
 */
export class ServiceError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;
  public readonly innerError?: Error;

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>,
    innerError?: Error
  ) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.context = context;
    this.innerError = innerError;

    // Maintain proper stack trace in Node.js environments
    const errorCtor = Error as ErrorConstructor & {
      captureStackTrace?: (target: object, constructorOpt?: new (...args: never[]) => unknown) => void;
    };
    if (typeof errorCtor.captureStackTrace === 'function') {
      errorCtor.captureStackTrace(this, ServiceError);
    }
  }

  /**
   * Convert to plain object for logging/serialization
   */
  toObject(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
      innerError: this.innerError?.message,
    };
  }
}

/**
 * Pre-defined error codes for common scenarios
 */
export const errorCodes = {
  // Validation errors
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // Chronicle errors
  CHRONICLE_NOT_FOUND: 'CHRONICLE_NOT_FOUND',
  INVALID_CHRONICLE_ENTRY: 'INVALID_CHRONICLE_ENTRY',
  CHRONICLE_GENERATION_FAILED: 'CHRONICLE_GENERATION_FAILED',

  // Heritage errors
  HERITAGE_MODIFIER_CONFLICT: 'HERITAGE_MODIFIER_CONFLICT',
  HERITAGE_GENERATION_FAILED: 'HERITAGE_GENERATION_FAILED',
  INVALID_HERITAGE_SELECTION: 'INVALID_HERITAGE_SELECTION',

  // Legacy Deck errors
  CARD_NOT_FOUND: 'CARD_NOT_FOUND',
  DECK_GENERATION_FAILED: 'DECK_GENERATION_FAILED',
  INVALID_CARD_TRIGGER: 'INVALID_CARD_TRIGGER',

  // Pacing errors
  INVALID_PACING_STATE: 'INVALID_PACING_STATE',
  PACING_UPDATE_FAILED: 'PACING_UPDATE_FAILED',

  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  OPERATION_FAILED: 'OPERATION_FAILED',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const;

/**
 * Helper functions for creating Results
 */
export const ResultHelpers = {
  /**
   * Create a successful result
   */
  success: <T>(data: T): Result<T> => ({
    success: true,
    data,
  }),

  /**
   * Create a failed result with ServiceError
   */
  error: <T>(
    message: string,
    code: string,
    context?: Record<string, unknown>,
    innerError?: Error
  ): Result<T> => ({
    success: false,
    error: new ServiceError(message, code, context, innerError),
  }),

  /**
   * Create a failed result with existing error
   */
  errorWithCause: <T>(error: ServiceError): Result<T> => ({
    success: false,
    error,
  }),

  /**
   * Convert a potentially throwing function to return a Result
   */
  fromThrowable: <T>(fn: () => T, context?: Record<string, unknown>): Result<T> => {
    try {
      const data = fn();
      return ResultHelpers.success(data);
    } catch (error) {
      const serviceError =
        error instanceof ServiceError
          ? error
          : new ServiceError(
              'Operation failed',
              errorCodes.OPERATION_FAILED,
              context,
              error instanceof Error ? error : new Error(String(error))
            );

      return ResultHelpers.errorWithCause(serviceError);
    }
  },

  /**
   * Convert a Promise to return a Result
   */
  fromPromise: async <T>(
    promise: Promise<T>,
    context?: Record<string, unknown>
  ): Promise<Result<T>> => {
    try {
      const data = await promise;
      return ResultHelpers.success(data);
    } catch (error) {
      const serviceError =
        error instanceof ServiceError
          ? error
          : new ServiceError(
              'Async operation failed',
              errorCodes.OPERATION_FAILED,
              context,
              error instanceof Error ? error : new Error(String(error))
            );

      return ResultHelpers.errorWithCause(serviceError);
    }
  },
};

/**
 * Type guards for Result types
 */
export const isSuccess = <T, E>(result: Result<T, E>): result is { success: true; data: T } => {
  return result.success;
};

export const isError = <T, E>(result: Result<T, E>): result is { success: false; error: E } => {
  return !result.success;
};

/**
 * Result utility functions
 */
export const ResultUtils = {
  /**
   * Map over the data in a successful result
   */
  map: <T, U, E = ServiceError>(result: Result<T, E>, mapFn: (data: T) => U): Result<U, E> => {
    if (isSuccess(result)) {
      return ResultHelpers.success(mapFn(result.data)) as Result<U, E>;
    }
    return result as Result<U, E>;
  },

  /**
   * FlatMap for chaining Results
   */
  flatMap: <T, U, E = ServiceError>(
    result: Result<T, E>,
    mapFn: (data: T) => Result<U, E>
  ): Result<U, E> => {
    if (isSuccess(result)) {
      return mapFn(result.data);
    }
    return result as Result<U, E>;
  },

  /**
   * Combine multiple Results - fails if any fail
   */
  combine: <T extends readonly unknown[]>(results: {
    [K in keyof T]: Result<T[K], ServiceError>;
  }): Result<T, ServiceError> => {
    const data: unknown[] = [];

    for (const result of results) {
      if (isError(result)) {
        return result;
      }
      data.push(result.data);
    }

    return ResultHelpers.success(data as unknown as T);
  },

  /**
   * Get data or throw error
   */
  unwrap: <T, E extends Error>(result: Result<T, E>): T => {
    if (isSuccess(result)) {
      return result.data;
    }
    throw result.error;
  },

  /**
   * Get data or return default value
   */
  unwrapOr: <T, E>(result: Result<T, E>, defaultValue: T): T => {
    if (isSuccess(result)) {
      return result.data;
    }
    return defaultValue;
  },
};

/**
 * Async Result utilities
 */
export const AsyncResultUtils = {
  /**
   * Map over async Result
   */
  map: async <T, U>(
    result: Promise<Result<T, ServiceError>>,
    mapFn: (data: T) => U | Promise<U>
  ): Promise<Result<U, ServiceError>> => {
    const resolved = await result;
    if (isSuccess(resolved)) {
      const mapped = await mapFn(resolved.data);
      return ResultHelpers.success(mapped);
    }
    return resolved as Result<U, ServiceError>;
  },

  /**
   * FlatMap for async Results
   */
  flatMap: async <T, U, E>(
    result: Promise<Result<T, E>>,
    mapFn: (data: T) => Promise<Result<U, E>>
  ): Promise<Result<U, E>> => {
    const resolved = await result;
    if (isSuccess(resolved)) {
      return await mapFn(resolved.data);
    }
    return resolved;
  },
};
