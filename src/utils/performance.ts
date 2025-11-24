/**
 * Performance Optimization Utilities
 * Tools for monitoring and optimizing application performance
 */

/**
 * Lazy load images with intersection observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.dataset.src;
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                this.observer?.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );
    }
  }

  observe(element: HTMLImageElement): void {
    this.observer?.observe(element);
  }

  unobserve(element: HTMLImageElement): void {
    this.observer?.unobserve(element);
  }

  disconnect(): void {
    this.observer?.disconnect();
  }
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Performance monitor
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  end(label: string): number | null {
    const startTime = this.marks.get(label);
    if (startTime === undefined) {
      console.warn(`[Performance] No start mark found for: ${label}`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  measure(label: string, fn: () => void): number {
    this.start(label);
    fn();
    return this.end(label) || 0;
  }

  async measureAsync(label: string, fn: () => Promise<void>): Promise<number> {
    this.start(label);
    await fn();
    return this.end(label) || 0;
  }
}

/**
 * Memory usage monitor
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} | null {
  // @ts-ignore - performance.memory is only available in Chrome
  if (performance.memory) {
    // @ts-ignore
    const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
    return {
      used: Math.round(usedJSHeapSize / 1024 / 1024), // MB
      total: Math.round(jsHeapSizeLimit / 1024 / 1024), // MB
      percentage: Math.round((usedJSHeapSize / jsHeapSizeLimit) * 100),
    };
  }
  return null;
}

/**
 * Log memory usage
 */
export function logMemoryUsage(): void {
  const memory = getMemoryUsage();
  if (memory) {
    console.log(
      `[Memory] Used: ${memory.used}MB / ${memory.total}MB (${memory.percentage}%)`
    );
  }
}

/**
 * Request idle callback wrapper
 */
export function requestIdleTask(
  callback: () => void,
  options?: { timeout?: number }
): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options);
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Batch DOM updates
 */
export function batchDOMUpdates(updates: (() => void)[]): void {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}

/**
 * Virtual scroll helper
 */
export function calculateVisibleItems(
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number,
  overscan: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);

  return { start, end };
}

/**
 * Preload critical resources
 */
export function preloadResource(
  url: string,
  type: 'image' | 'script' | 'style' | 'font'
): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = type;

  if (type === 'font') {
    link.setAttribute('crossorigin', 'anonymous');
  }

  document.head.appendChild(link);
}

/**
 * Cleanup event listeners on unmount
 */
export class EventListenerManager {
  private listeners: Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
  }> = [];

  add(element: EventTarget, event: string, handler: EventListener): void {
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }

  removeAll(): void {
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];
  }
}

/**
 * Optimize re-renders by deep comparison
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object' ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Create singleton performance monitor
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Create singleton lazy image loader
 */
export const lazyImageLoader = new LazyImageLoader();

// Log memory usage in development
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    logMemoryUsage();
  }, 30000); // Every 30 seconds
}
