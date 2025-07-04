import { Platform } from 'react-native';
import { logger } from './logger';

/**
 * Alternative storage solution for production builds when AsyncStorage fails
 * Uses multiple storage backends for maximum reliability
 */
class AlternativeStorage {
  private memoryStorage: Map<string, string> = new Map();
  private isInitialized = false;
  private storageBackends: string[] = [];

  /**
   * Initialize alternative storage
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing alternative storage for production...');
    
    // Test available storage backends
    await this.testStorageBackends();
    
    this.isInitialized = true;
    logger.info(`Alternative storage initialized with backends: ${this.storageBackends.join(', ')}`);
  }

  /**
   * Test which storage backends are available
   */
  private async testStorageBackends(): Promise<void> {
    // Always available: Memory storage
    this.storageBackends.push('memory');
    
    // Test AsyncStorage
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const testKey = '__alt_storage_test__';
      const testValue = 'test_' + Date.now();
      
      await AsyncStorage.setItem(testKey, testValue);
      const retrieved = await AsyncStorage.getItem(testKey);
      await AsyncStorage.removeItem(testKey);
      
      if (retrieved === testValue) {
        this.storageBackends.push('async_storage');
        logger.info('AsyncStorage backend available');
      }
    } catch (error) {
      logger.warn('AsyncStorage backend not available', error);
    }

    // Test React Native's built-in storage (if available)
    try {
      // Some React Native versions have alternative storage methods
      if (Platform.OS === 'android') {
        // Android-specific storage tests could go here
      }
    } catch (error) {
      logger.warn('Platform-specific storage not available', error);
    }
  }

  /**
   * Store a value using the best available backend
   */
  async setItem(key: string, value: string): Promise<boolean> {
    await this.initialize();
    
    let success = false;
    
    // Always store in memory first
    this.memoryStorage.set(key, value);
    success = true;
    logger.debug(`Stored ${key} in memory storage`);
    
    // Try AsyncStorage if available
    if (this.storageBackends.includes('async_storage')) {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem(key, value);
        logger.debug(`Stored ${key} in AsyncStorage`);
      } catch (error) {
        logger.warn(`Failed to store ${key} in AsyncStorage`, error);
      }
    }
    
    return success;
  }

  /**
   * Retrieve a value from the best available backend
   */
  async getItem(key: string): Promise<string | null> {
    await this.initialize();
    
    // Try AsyncStorage first if available
    if (this.storageBackends.includes('async_storage')) {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          // Also update memory storage for consistency
          this.memoryStorage.set(key, value);
          logger.debug(`Retrieved ${key} from AsyncStorage`);
          return value;
        }
      } catch (error) {
        logger.warn(`Failed to retrieve ${key} from AsyncStorage`, error);
      }
    }
    
    // Fallback to memory storage
    const memoryValue = this.memoryStorage.get(key) || null;
    if (memoryValue) {
      logger.debug(`Retrieved ${key} from memory storage`);
    }
    return memoryValue;
  }

  /**
   * Remove a value from all backends
   */
  async removeItem(key: string): Promise<boolean> {
    await this.initialize();
    
    let success = false;
    
    // Remove from memory
    this.memoryStorage.delete(key);
    success = true;
    
    // Remove from AsyncStorage if available
    if (this.storageBackends.includes('async_storage')) {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.removeItem(key);
        logger.debug(`Removed ${key} from AsyncStorage`);
      } catch (error) {
        logger.warn(`Failed to remove ${key} from AsyncStorage`, error);
      }
    }
    
    return success;
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<boolean> {
    await this.initialize();
    
    // Clear memory storage
    this.memoryStorage.clear();
    
    // Clear AsyncStorage if available
    if (this.storageBackends.includes('async_storage')) {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.clear();
        logger.debug('Cleared AsyncStorage');
      } catch (error) {
        logger.warn('Failed to clear AsyncStorage', error);
      }
    }
    
    return true;
  }

  /**
   * Get all keys from memory storage
   */
  getAllKeys(): string[] {
    return Array.from(this.memoryStorage.keys());
  }

  /**
   * Get storage diagnostics
   */
  getDiagnostics(): {
    backends: string[];
    memoryKeys: string[];
    isInitialized: boolean;
  } {
    return {
      backends: [...this.storageBackends],
      memoryKeys: this.getAllKeys(),
      isInitialized: this.isInitialized,
    };
  }

  /**
   * Force sync between memory and AsyncStorage
   */
  async syncStorages(): Promise<void> {
    if (!this.storageBackends.includes('async_storage')) return;
    
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      
      // Sync memory to AsyncStorage
      for (const [key, value] of this.memoryStorage.entries()) {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          logger.warn(`Failed to sync ${key} to AsyncStorage`, error);
        }
      }
      
      logger.info('Storage sync completed');
    } catch (error) {
      logger.error('Storage sync failed', error);
    }
  }
}

export const alternativeStorage = new AlternativeStorage();
export default alternativeStorage;
