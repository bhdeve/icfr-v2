/**
 * Performance Hook
 * React hook for performance monitoring and optimization
 */

import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor, getMemoryUsage } from '../utils/performance';

/**
 * Hook to measure component render time
 */
export function useRenderTime(componentName: string, enabled: boolean = process.env.NODE_ENV === 'development') {
  const renderCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    renderCountRef.current += 1;
    const label = `${componentName} - Render #${renderCountRef.current}`;
    
    performanceMonitor.start(label);
    
    // Measure after paint
    requestAnimationFrame(() => {
      performanceMonitor.end(label);
    });
  });
}

/**
 * Hook to monitor memory usage
 */
export function useMemoryMonitor(intervalMs: number = 10000) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const interval = setInterval(() => {
      const memory = getMemoryUsage();
      if (memory && memory.percentage > 80) {
        console.warn(
          `[Memory Warning] High memory usage: ${memory.used}MB / ${memory.total}MB (${memory.percentage}%)`
        );
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);
}

/**
 * Hook to measure async operations
 */
export function useMeasureAsync() {
  return useCallback(async <T,>(label: string, fn: () => Promise<T>): Promise<T> => {
    performanceMonitor.start(label);
    try {
      const result = await fn();
      return result;
    } finally {
      performanceMonitor.end(label);
    }
  }, []);
}

/**
 * Hook for optimized scroll handling
 */
export function useOptimizedScroll(
  callback: (event: Event) => void,
  delay: number = 100
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const optimizedHandler = useCallback(
    (event: Event) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(event);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return optimizedHandler;
}

/**
 * Hook for debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Import React for useState
import React from 'react';
