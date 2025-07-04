import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';
import { Platform } from 'react-native';

/**
 * Production-hardened storage utility with comprehensive error handling,
 * fallback mechanisms, and detailed diagnostics for APK builds
 */
class StorageManager {
  private isInitialized = false;
  private storageAvailable = false;
  private fallbackStorage: Map<string, string> = new Map();
  private readonly STORAGE_TEST_KEY = '__storage_health_check__';
  private readonly STORAGE_TEST_VALUE = 'test_value_' + Date.now();

  /**
   * Initialize storage and perform comprehensive health checks
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return this.storageAvailable;
    }

    logger.info('Initializing storage manager for production environment');

    try {
      // Comprehensive storage availability check
      this.storageAvailable = await this.performStorageHealthCheck();
      this.isInitialized = true;

      logger.info(`Storage initialization complete. Available: ${this.storageAvailable}`);
      return this.storageAvailable;
    } catch (error) {
      logger.error('Storage initialization failed', error);
      this.isInitialized = true;
      this.storageAvailable = false;
      return false;
    }
  }

  /**
   * Perform comprehensive storage health check for production builds
   */
  private async performStorageHealthCheck(): Promise<boolean> {
    try {
      logger.info('Performing storage health check...');

      // Test 1: Basic availability
      if (!AsyncStorage) {
        logger.error('AsyncStorage is not available');
        return false;
      }

      // Test 2: Write operation
      await AsyncStorage.setItem(this.STORAGE_TEST_KEY, this.STORAGE_TEST_VALUE);
      logger.info('Storage write test: SUCCESS');

      // Test 3: Read operation
      const retrievedValue = await AsyncStorage.getItem(this.STORAGE_TEST_KEY);
      if (retrievedValue !== this.STORAGE_TEST_VALUE) {
        logger.error(`Storage read test failed. Expected: ${this.STORAGE_TEST_VALUE}, Got: ${retrievedValue}`);
        return false;
      }
      logger.info('Storage read test: SUCCESS');

      // Test 4: Delete operation
      await AsyncStorage.removeItem(this.STORAGE_TEST_KEY);
      logger.info('Storage delete test: SUCCESS');

      // Test 5: Verify deletion
      const deletedValue = await AsyncStorage.getItem(this.STORAGE_TEST_KEY);
      if (deletedValue !== null) {
        logger.error(`Storage deletion verification failed. Value still exists: ${deletedValue}`);
        return false;
      }
      logger.info('Storage deletion verification: SUCCESS');

      logger.info('All storage health checks passed');
      return true;
    } catch (error) {
      logger.error('Storage health check failed', error);
      return false;
    }
  }

  /**
   * Safely get an item from AsyncStorage with production-specific handling
   */
  async getItem(key: string): Promise<string | null> {
    try {
      // Ensure storage is initialized
      await this.initialize();

      logger.debug(`Getting item from storage: ${key} (Platform: ${Platform.OS})`);

      if (!this.storageAvailable) {
        logger.warn(`Storage not available, checking fallback for key: ${key}`);
        const fallbackValue = this.fallbackStorage.get(key) || null;
        logger.storage('GET_FALLBACK', key, !!fallbackValue);
        return fallbackValue;
      }

      // Add retry mechanism for production builds
      let lastError: any;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const value = await AsyncStorage.getItem(key);
          logger.storage('GET', key, true, { attempt, value: value ? 'present' : 'null' });
          return value;
        } catch (error) {
          lastError = error;
          logger.warn(`Storage GET attempt ${attempt} failed for key ${key}`, error);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 100 * attempt));
          }
        }
      }

      // If all attempts failed, try fallback
      logger.error(`All storage GET attempts failed for key ${key}`, lastError);
      const fallbackValue = this.fallbackStorage.get(key) || null;
      logger.storage('GET_FALLBACK_AFTER_FAILURE', key, !!fallbackValue);
      return fallbackValue;

    } catch (error) {
      logger.storage('GET', key, false, error);
      logger.error(`Failed to get item from storage: ${key}`, error);
      return this.fallbackStorage.get(key) || null;
    }
  }

  /**
   * Safely set an item in AsyncStorage with production-specific handling
   */
  async setItem(key: string, value: string): Promise<boolean> {
    try {
      // Ensure storage is initialized
      await this.initialize();

      logger.debug(`Setting item in storage: ${key} (Platform: ${Platform.OS}, Length: ${value.length})`);

      if (!this.storageAvailable) {
        logger.warn(`Storage not available, using fallback for key: ${key}`);
        this.fallbackStorage.set(key, value);
        logger.storage('SET_FALLBACK', key, true);
        return true;
      }

      // Add retry mechanism for production builds
      let lastError: any;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await AsyncStorage.setItem(key, value);

          // Verify the write was successful
          const verifyValue = await AsyncStorage.getItem(key);
          if (verifyValue === value) {
            logger.storage('SET', key, true, { attempt, verified: true });
            // Also store in fallback for redundancy
            this.fallbackStorage.set(key, value);
            return true;
          } else {
            throw new Error(`Write verification failed. Expected: ${value.substring(0, 50)}..., Got: ${verifyValue?.substring(0, 50)}...`);
          }
        } catch (error) {
          lastError = error;
          logger.warn(`Storage SET attempt ${attempt} failed for key ${key}`, error);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 200 * attempt));
          }
        }
      }

      // If all attempts failed, store in fallback
      logger.error(`All storage SET attempts failed for key ${key}`, lastError);
      this.fallbackStorage.set(key, value);
      logger.storage('SET_FALLBACK_AFTER_FAILURE', key, true);
      return false; // Return false to indicate AsyncStorage failed, but fallback succeeded

    } catch (error) {
      logger.storage('SET', key, false, error);
      logger.error(`Failed to set item in storage: ${key}`, error);
      // Store in fallback as last resort
      this.fallbackStorage.set(key, value);
      return false;
    }
  }

  /**
   * Safely remove an item from AsyncStorage with production-specific handling
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      // Ensure storage is initialized
      await this.initialize();

      logger.debug(`Removing item from storage: ${key} (Platform: ${Platform.OS})`);

      // Remove from fallback storage regardless
      this.fallbackStorage.delete(key);

      if (!this.storageAvailable) {
        logger.warn(`Storage not available, removed from fallback for key: ${key}`);
        logger.storage('REMOVE_FALLBACK', key, true);
        return true;
      }

      // Add retry mechanism for production builds
      let lastError: any;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await AsyncStorage.removeItem(key);

          // Verify the removal was successful
          const verifyValue = await AsyncStorage.getItem(key);
          if (verifyValue === null) {
            logger.storage('REMOVE', key, true, { attempt, verified: true });
            return true;
          } else {
            throw new Error(`Remove verification failed. Value still exists: ${verifyValue?.substring(0, 50)}...`);
          }
        } catch (error) {
          lastError = error;
          logger.warn(`Storage REMOVE attempt ${attempt} failed for key ${key}`, error);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 100 * attempt));
          }
        }
      }

      logger.error(`All storage REMOVE attempts failed for key ${key}`, lastError);
      logger.storage('REMOVE_FALLBACK_AFTER_FAILURE', key, true);
      return false;

    } catch (error) {
      logger.storage('REMOVE', key, false, error);
      logger.error(`Failed to remove item from storage: ${key}`, error);
      this.fallbackStorage.delete(key);
      return false;
    }
  }

  /**
   * Clear all AsyncStorage data
   */
  async clear(): Promise<boolean> {
    try {
      logger.debug('Clearing all storage');
      await AsyncStorage.clear();
      logger.storage('CLEAR', 'ALL', true);
      return true;
    } catch (error) {
      logger.storage('CLEAR', 'ALL', false, error);
      logger.error('Failed to clear AsyncStorage', error);
      return false;
    }
  }

  /**
   * Get multiple items from AsyncStorage
   */
  async multiGet(keys: string[]): Promise<Record<string, string | null>> {
    try {
      logger.debug(`Getting multiple items from storage: ${keys.join(', ')}`);
      const result = await AsyncStorage.multiGet(keys);
      const data: Record<string, string | null> = {};

      result.forEach(([key, value]) => {
        data[key] = value;
      });

      logger.storage('MULTI_GET', keys.join(','), true);
      return data;
    } catch (error) {
      logger.storage('MULTI_GET', keys.join(','), false, error);
      logger.error('Failed to get multiple items from AsyncStorage', error);
      return {};
    }
  }

  /**
   * Set multiple items in AsyncStorage
   */
  async multiSet(keyValuePairs: [string, string][]): Promise<boolean> {
    try {
      const keys = keyValuePairs.map(([key]) => key);
      logger.debug(`Setting multiple items in storage: ${keys.join(', ')}`);
      await AsyncStorage.multiSet(keyValuePairs);
      logger.storage('MULTI_SET', keys.join(','), true);
      return true;
    } catch (error) {
      const keys = keyValuePairs.map(([key]) => key);
      logger.storage('MULTI_SET', keys.join(','), false, error);
      logger.error('Failed to set multiple items in AsyncStorage', error);
      return false;
    }
  }

  /**
   * Check if AsyncStorage is available and working (legacy method for compatibility)
   */
  async isAvailable(): Promise<boolean> {
    await this.initialize();
    return this.storageAvailable;
  }

  /**
   * Get comprehensive storage diagnostics for production debugging
   */
  async getDiagnostics(): Promise<{
    platform: string;
    storageAvailable: boolean;
    fallbackItemCount: number;
    lastHealthCheck: string;
    asyncStorageExists: boolean;
  }> {
    await this.initialize();

    return {
      platform: Platform.OS,
      storageAvailable: this.storageAvailable,
      fallbackItemCount: this.fallbackStorage.size,
      lastHealthCheck: new Date().toISOString(),
      asyncStorageExists: !!AsyncStorage,
    };
  }

  /**
   * Force re-initialization of storage (useful for recovery)
   */
  async reinitialize(): Promise<boolean> {
    logger.info('Force reinitializing storage...');
    this.isInitialized = false;
    this.storageAvailable = false;
    return await this.initialize();
  }

  /**
   * Get all fallback storage keys (for debugging)
   */
  getFallbackKeys(): string[] {
    return Array.from(this.fallbackStorage.keys());
  }

  /**
   * Clear fallback storage
   */
  clearFallback(): void {
    this.fallbackStorage.clear();
    logger.info('Fallback storage cleared');
  }

  /**
   * Migrate data from fallback to AsyncStorage when it becomes available
   */
  async migrateFallbackToAsyncStorage(): Promise<boolean> {
    if (!this.storageAvailable || this.fallbackStorage.size === 0) {
      return true;
    }

    logger.info(`Migrating ${this.fallbackStorage.size} items from fallback to AsyncStorage`);

    let successCount = 0;
    for (const [key, value] of this.fallbackStorage.entries()) {
      try {
        await AsyncStorage.setItem(key, value);
        successCount++;
      } catch (error) {
        logger.error(`Failed to migrate key ${key} to AsyncStorage`, error);
      }
    }

    logger.info(`Migration complete. ${successCount}/${this.fallbackStorage.size} items migrated successfully`);
    return successCount === this.fallbackStorage.size;
  }
}

export const storage = new StorageManager();
export default storage;
