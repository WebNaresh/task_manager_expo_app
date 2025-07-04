import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { storage } from '@/utils/storage';
import { alternativeStorage } from '@/utils/alternativeStorage';
import { logger } from '@/utils/logger';

/**
 * Simple storage test component to verify storage is working in production
 * Add this temporarily to any screen to test storage functionality
 */
export default function StorageTest() {
  const [results, setResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runStorageTest = async () => {
    setIsRunning(true);
    const testResults: any = {
      timestamp: new Date().toISOString(),
      primaryStorage: {},
      alternativeStorage: {},
      tokenTest: {},
    };

    try {
      logger.info('Starting storage test...');

      // Test primary storage
      try {
        const testKey = 'test_key_' + Date.now();
        const testValue = 'test_value_' + Math.random();
        
        const setResult = await storage.setItem(testKey, testValue);
        const getValue = await storage.getItem(testKey);
        const removeResult = await storage.removeItem(testKey);
        
        testResults.primaryStorage = {
          available: await storage.isAvailable(),
          setSuccess: setResult,
          getSuccess: getValue === testValue,
          removeSuccess: removeResult,
          diagnostics: await storage.getDiagnostics(),
        };
      } catch (error) {
        testResults.primaryStorage = { error: error.message };
      }

      // Test alternative storage
      try {
        const testKey = 'alt_test_key_' + Date.now();
        const testValue = 'alt_test_value_' + Math.random();
        
        const setResult = await alternativeStorage.setItem(testKey, testValue);
        const getValue = await alternativeStorage.getItem(testKey);
        const removeResult = await alternativeStorage.removeItem(testKey);
        
        testResults.alternativeStorage = {
          setSuccess: setResult,
          getSuccess: getValue === testValue,
          removeSuccess: removeResult,
          diagnostics: alternativeStorage.getDiagnostics(),
        };
      } catch (error) {
        testResults.alternativeStorage = { error: error.message };
      }

      // Test token storage specifically
      try {
        const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTksInJvbGUiOiJBRE1JTiIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlkIjoiMTIzIn0.invalid_signature';
        
        // Test with primary storage
        const primarySet = await storage.setItem('test_token', testToken);
        const primaryGet = await storage.getItem('test_token');
        
        // Test with alternative storage
        const altSet = await alternativeStorage.setItem('test_token_alt', testToken);
        const altGet = await alternativeStorage.getItem('test_token_alt');
        
        testResults.tokenTest = {
          primaryStorage: {
            setSuccess: primarySet,
            getSuccess: primaryGet === testToken,
            tokenLength: primaryGet?.length || 0,
          },
          alternativeStorage: {
            setSuccess: altSet,
            getSuccess: altGet === testToken,
            tokenLength: altGet?.length || 0,
          },
        };
        
        // Clean up
        await storage.removeItem('test_token');
        await alternativeStorage.removeItem('test_token_alt');
        
      } catch (error) {
        testResults.tokenTest = { error: error.message };
      }

      setResults(testResults);
      logger.info('Storage test completed', testResults);
      
    } catch (error) {
      logger.error('Storage test failed', error);
      Alert.alert('Test Failed', error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setResults(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storage Test</Text>
      
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={runStorageTest}
        disabled={isRunning}
      >
        <Text style={styles.buttonText}>
          {isRunning ? 'Testing...' : 'Run Storage Test'}
        </Text>
      </TouchableOpacity>
      
      {results && (
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      )}

      {results && (
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Test Results:</Text>
          
          <Text style={styles.subTitle}>Primary Storage:</Text>
          <Text style={styles.resultText}>
            Available: {results.primaryStorage.available ? 'YES' : 'NO'}
          </Text>
          <Text style={styles.resultText}>
            Set Success: {results.primaryStorage.setSuccess ? 'YES' : 'NO'}
          </Text>
          <Text style={styles.resultText}>
            Get Success: {results.primaryStorage.getSuccess ? 'YES' : 'NO'}
          </Text>
          
          <Text style={styles.subTitle}>Alternative Storage:</Text>
          <Text style={styles.resultText}>
            Set Success: {results.alternativeStorage.setSuccess ? 'YES' : 'NO'}
          </Text>
          <Text style={styles.resultText}>
            Get Success: {results.alternativeStorage.getSuccess ? 'YES' : 'NO'}
          </Text>
          <Text style={styles.resultText}>
            Backends: {results.alternativeStorage.diagnostics?.backends?.join(', ') || 'None'}
          </Text>
          
          <Text style={styles.subTitle}>Token Test:</Text>
          <Text style={styles.resultText}>
            Primary Token Storage: {results.tokenTest.primaryStorage?.setSuccess ? 'SUCCESS' : 'FAILED'}
          </Text>
          <Text style={styles.resultText}>
            Alternative Token Storage: {results.tokenTest.alternativeStorage?.setSuccess ? 'SUCCESS' : 'FAILED'}
          </Text>
          
          {(results.primaryStorage.error || results.alternativeStorage.error || results.tokenTest.error) && (
            <>
              <Text style={styles.errorTitle}>Errors:</Text>
              {results.primaryStorage.error && (
                <Text style={styles.errorText}>Primary: {results.primaryStorage.error}</Text>
              )}
              {results.alternativeStorage.error && (
                <Text style={styles.errorText}>Alternative: {results.alternativeStorage.error}</Text>
              )}
              {results.tokenTest.error && (
                <Text style={styles.errorText}>Token: {results.tokenTest.error}</Text>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#555',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 3,
    color: '#666',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    marginBottom: 3,
    color: '#FF3B30',
    fontFamily: 'monospace',
  },
});
