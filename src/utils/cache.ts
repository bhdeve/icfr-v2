/**
 * Cache Utility
 * Provides in-memory caching with TTL support and automatic cleanup
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private cleanupInterval: number;
  private cleanupTimer: NodeJS.Timeout | null;

  constructor(cleanupInterval: number = 60000) { // Default 1 minute
    this.cache = new Map();
    this.cleanupInterval = cleanupInterval;
    this.cleanupTimer = null;
    this.startCleanup();
  }

  /**
   * Set a value in the cache with TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns Cached data or null if expired/not found
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if a key exists and is not expired
   * @param key Cache key
   * @returns True if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific cache entry
   * @param key Cache key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear cache entries matching a pattern
   * @param pattern RegExp pattern to match keys
   */
  clearPattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Clean up expired cache entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      const isExpired = now - entry.timestamp > entry.ttl;
      if (isExpired) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
  }
}

// Singleton instance
export const cache = new CacheManager();

/**
 * Cache decorator for async functions
 * @param key Cache key or function to generate key from args
 * @param ttl Time to live in milliseconds
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
  key: string | ((...args: Parameters<T>) => string),
  ttl: number = 300000
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: Parameters<T>): Promise<ReturnType<T>> {
      const cacheKey = typeof key === 'function' ? key(...args) : key;
      
      // Check cache first
      const cached = cache.get<ReturnType<T>>(cacheKey);
      if (cached !== null) {
        console.log(`[Cache] Hit: ${cacheKey}`);
        return cached;
      }

      // Execute original method
      console.log(`[Cache] Miss: ${cacheKey}`);
      const result = await originalMethod.apply(this, args);
      
      // Store in cache
      cache.set(cacheKey, result, ttl);
      
      return result;
    };

    return descriptor;
  };
}

/**
 * Memoize function with cache
 * @param fn Function to memoize
 * @param keyGenerator Function to generate cache key from args
 * @param ttl Time to live in milliseconds
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = 300000
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator(...args);
    
    const cached = cache.get<ReturnType<T>>(key);
    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result, ttl);
    
    return result;
  }) as T;
}

// Export cache instance as default
export default cache;
