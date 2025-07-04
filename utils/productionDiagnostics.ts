import { Platform } from 'react-native';
import { storage } from './storage';
import { logger } from './logger';
import { validateToken } from './tokenUtils';

/**
 * Production diagnostics utility for debugging APK build issues
 */
export class ProductionDiagnostics {
  /**
   * Run comprehensive diagnostics for production builds
   */
  static async runFullDiagnostics(): Promise<{
    platform: string;
    timestamp: string;
    storage: any;
    auth: any;
    environment: any;
    logs: any[];
  }> {
    logger.info('Running full production diagnostics...');
    
    const timestamp = new Date().toISOString();
    
    try {
      // Storage diagnostics
      const storageDiagnostics = await this.testStorage();
      
      // Auth diagnostics
      const authDiagnostics = await this.testAuth();
      
      // Environment diagnostics
      const envDiagnostics = this.getEnvironmentInfo();
      
      // Get recent logs
      const recentLogs = logger.getProductionLogs();
      
      const results = {
        platform: Platform.OS,
        timestamp,
        storage: storageDiagnostics,
        auth: authDiagnostics,
        environment: envDiagnostics,
        logs: recentLogs.slice(-20), // Last 20 logs
      };
      
      logger.info('Production diagnostics completed', results);
      return results;
      
    } catch (error) {
      logger.error('Production diagnostics failed', error);
      throw error;
    }
  }

  /**
   * Test storage functionality
   */
  static async testStorage(): Promise<{
    available: boolean;
    fallbackKeys: string[];
    testResults: any;
    diagnostics: any;
  }> {
    try {
      logger.info('Testing storage functionality...');
      
      // Get storage diagnostics
      const diagnostics = await storage.getDiagnostics();
      
      // Test basic operations
      const testKey = '__production_test_' + Date.now();
      const testValue = 'production_test_value_' + Math.random();
      
      const setResult = await storage.setItem(testKey, testValue);
      const getValue = await storage.getItem(testKey);
      const removeResult = await storage.removeItem(testKey);
      const verifyRemoval = await storage.getItem(testKey);
      
      const testResults = {
        setSuccess: setResult,
        getSuccess: getValue === testValue,
        removeSuccess: removeResult,
        removalVerified: verifyRemoval === null,
        retrievedValue: getValue,
        expectedValue: testValue,
      };
      
      const fallbackKeys = storage.getFallbackKeys();
      
      logger.info('Storage test completed', testResults);
      
      return {
        available: diagnostics.storageAvailable,
        fallbackKeys,
        testResults,
        diagnostics,
      };
      
    } catch (error) {
      logger.error('Storage test failed', error);
      return {
        available: false,
        fallbackKeys: [],
        testResults: { error: error.message },
        diagnostics: null,
      };
    }
  }

  /**
   * Test authentication functionality
   */
  static async testAuth(): Promise<{
    tokenExists: boolean;
    tokenValid: boolean;
    userInfo: any;
    tokenLength?: number;
  }> {
    try {
      logger.info('Testing auth functionality...');
      
      // Check if token exists
      const token = await storage.getItem('token');
      const tokenExists = !!token;
      
      if (!token) {
        return {
          tokenExists: false,
          tokenValid: false,
          userInfo: null,
        };
      }
      
      // Validate token
      const validation = validateToken(token);
      
      return {
        tokenExists: true,
        tokenValid: validation.isValid,
        userInfo: validation.user,
        tokenLength: token.length,
      };
      
    } catch (error) {
      logger.error('Auth test failed', error);
      return {
        tokenExists: false,
        tokenValid: false,
        userInfo: null,
        error: error.message,
      };
    }
  }

  /**
   * Get environment information
   */
  static getEnvironmentInfo(): {
    platform: string;
    isDevelopment: boolean;
    nodeEnv: string;
    timestamp: string;
  } {
    return {
      platform: Platform.OS,
      isDevelopment: process.env.NODE_ENV !== 'production',
      nodeEnv: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Export diagnostics for sharing/debugging
   */
  static async exportDiagnostics(): Promise<string> {
    try {
      const diagnostics = await this.runFullDiagnostics();
      return JSON.stringify(diagnostics, null, 2);
    } catch (error) {
      logger.error('Failed to export diagnostics', error);
      return JSON.stringify({ error: error.message }, null, 2);
    }
  }

  /**
   * Test token storage and retrieval specifically
   */
  static async testTokenPersistence(testToken: string): Promise<{
    stored: boolean;
    retrieved: boolean;
    matches: boolean;
    fallbackUsed: boolean;
  }> {
    try {
      logger.info('Testing token persistence...');
      
      const testKey = 'test_token_' + Date.now();
      
      // Store test token
      const stored = await storage.setItem(testKey, testToken);
      
      // Retrieve test token
      const retrieved = await storage.getItem(testKey);
      const matches = retrieved === testToken;
      
      // Check if fallback was used
      const fallbackKeys = storage.getFallbackKeys();
      const fallbackUsed = fallbackKeys.includes(testKey);
      
      // Clean up
      await storage.removeItem(testKey);
      
      const result = {
        stored,
        retrieved: !!retrieved,
        matches,
        fallbackUsed,
      };
      
      logger.info('Token persistence test completed', result);
      return result;
      
    } catch (error) {
      logger.error('Token persistence test failed', error);
      return {
        stored: false,
        retrieved: false,
        matches: false,
        fallbackUsed: false,
      };
    }
  }
}

export default ProductionDiagnostics;
