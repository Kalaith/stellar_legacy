// utils/performance.ts
/**
 * Performance optimization utilities for React components and expensive operations
 */

import React, { useMemo, useRef, useCallback, useState } from 'react';

/**
 * Simple memoization function for expensive calculations
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  cacheSize: number = 100
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);

    // Implement LRU cache by clearing oldest entries
    if (cache.size >= cacheSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    cache.set(key, result);
    return result;
  };
}

/**
 * Hook for memoizing expensive calculations with dependency tracking
 */
export function useExpensiveCalculation<T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T {
  return useMemo(calculation, dependencies);
}

/**
 * Hook for debouncing function calls to prevent excessive re-renders
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<number | undefined>(undefined);

  return useCallback(
    ((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook for throttling function calls to limit execution frequency
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false);

  return useCallback(
    ((...args) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    }) as T,
    [callback, limit]
  );
}

/**
 * Hook for creating stable object references to prevent unnecessary re-renders
 */
export function useStableObject<T extends Record<string, unknown>>(obj: T): T {
  return useMemo(() => obj, [JSON.stringify(obj)]);
}

/**
 * Hook for creating stable array references
 */
export function useStableArray<T>(arr: T[]): T[] {
  return useMemo(() => arr, [JSON.stringify(arr)]);
}

/**
 * Performance measurement utility
 */
export class PerformanceMonitor {
  private static measurements = new Map<string, number[]>();

  static start(label: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  }

  static end(label: string): number | null {
    if (typeof performance === 'undefined') {
      return null;
    }

    const startMark = `${label}-start`;
    const endMark = `${label}-end`;

    performance.mark(endMark);

    try {
      performance.measure(label, startMark, endMark);
      const measure = performance.getEntriesByName(label, 'measure')[0];
      const duration = measure.duration;

      // Store measurement for analysis
      if (!this.measurements.has(label)) {
        this.measurements.set(label, []);
      }
      this.measurements.get(label)!.push(duration);

      // Clean up marks
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(label);

      return duration;
    } catch (error) {
      console.warn('Performance measurement failed:', error);
      return null;
    }
  }

  static getAverageTime(label: string): number | null {
    const measurements = this.measurements.get(label);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const sum = measurements.reduce((acc, val) => acc + val, 0);
    return sum / measurements.length;
  }

  static getStats(label: string): {
    count: number;
    average: number;
    min: number;
    max: number;
  } | null {
    const measurements = this.measurements.get(label);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    return {
      count: measurements.length,
      average: measurements.reduce((acc, val) => acc + val, 0) / measurements.length,
      min: Math.min(...measurements),
      max: Math.max(...measurements),
    };
  }

  static clearStats(label?: string): void {
    if (label) {
      this.measurements.delete(label);
    } else {
      this.measurements.clear();
    }
  }
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitor(label: string, enabled: boolean = true) {
  const start = useCallback(() => {
    if (enabled) {
      PerformanceMonitor.start(label);
    }
  }, [label, enabled]);

  const end = useCallback(() => {
    if (enabled) {
      return PerformanceMonitor.end(label);
    }
    return null;
  }, [label, enabled]);

  const getStats = useCallback(() => {
    return PerformanceMonitor.getStats(label);
  }, [label]);

  return { start, end, getStats };
}

/**
 * Higher-order component for automatic performance monitoring
 */
export function withPerformanceMonitoring<TProps extends Record<string, unknown>>(
  Component: React.ComponentType<TProps>,
  componentName?: string
): React.ComponentType<TProps> {
  const WrappedComponent: React.FC<TProps> = (props: TProps) => {
    const name = componentName || Component.displayName || Component.name || 'Anonymous';
    const { start, end } = usePerformanceMonitor(`component-${name}`);

    React.useLayoutEffect(() => {
      start();
      return () => {
        end();
      };
    });

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withPerformanceMonitoring(${
    componentName || Component.displayName || Component.name || 'Anonymous'
  })`;

  return WrappedComponent;
}

/**
 * Virtual scrolling utilities for large lists
 */
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function calculateVirtualScrollItems<T>(
  items: T[],
  scrollTop: number,
  options: VirtualScrollOptions
): {
  startIndex: number;
  endIndex: number;
  visibleItems: T[];
  totalHeight: number;
  offsetY: number;
} {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const totalHeight = items.length * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan);

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
  };
}

/**
 * React hook for virtual scrolling
 */
export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useThrottle((...args: unknown[]) => {
    const event = args[0] as React.UIEvent<HTMLDivElement>;
    setScrollTop(event.currentTarget.scrollTop);
  }, 16); // ~60fps

  const virtualItems = useMemo(
    () => calculateVirtualScrollItems(items, scrollTop, options),
    [items, scrollTop, options.itemHeight, options.containerHeight, options.overscan]
  );

  return {
    containerRef,
    handleScroll,
    ...virtualItems,
  };
}