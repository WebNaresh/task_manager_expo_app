import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

/**
 * Enhanced AsyncStorage utility with error handling and logging
 */
class StorageManager {
  /**
   * Safely get an item from AsyncStorage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      logger.debug(`Getting item from storage: ${key}`);
      const value = await AsyncStorage.getItem(key);
      logger.storage('GET', key, true);
      return value;
    } catch (error) {
      logger.storage('GET', key, false, error);
      logger.error(`Failed to get item from AsyncStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Safely set an item in AsyncStorage
   */
  async setItem(key: string, value: string): Promise<boolean> {
    try {
      logger.debug(`Setting item in storage: ${key}`);
      await AsyncStorage.setItem(key, value);
      logger.storage('SET', key, true);
      return true;
    } catch (error) {
      logger.storage('SET', key, false, error);
      logger.error(`Failed to set item in AsyncStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Safely remove an item from AsyncStorage
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      logger.debug(`Removing item from storage: ${key}`);
      await AsyncStorage.removeItem(key);
      logger.storage('REMOVE', key, true);
      return true;
    } catch (error) {
      logger.storage('REMOVE', key, false, error);
      logger.error(`Failed to remove item from AsyncStorage: ${key}`, error);
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
   * Check if AsyncStorage is available and working
   */
  async isAvailable(): Promise<boolean> {
    try {
      const testKey = '__storage_test__';
      const testValue = 'test';
      
      // Try to set and get a test value
      await AsyncStorage.setItem(testKey, testValue);
      const retrievedValue = await AsyncStorage.getItem(testKey);
      await AsyncStorage.removeItem(testKey);
      
      const isWorking = retrievedValue === testValue;
      logger.debug(`AsyncStorage availability check: ${isWorking ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
      return isWorking;
    } catch (error) {
      logger.error('AsyncStorage availability check failed', error);
      return false;
    }
  }
}

export const storage = new StorageManager();
export default storage;
