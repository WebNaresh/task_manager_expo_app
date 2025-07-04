import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { ProductionDiagnostics } from '@/utils/productionDiagnostics';
import { logger } from '@/utils/logger';

/**
 * Production diagnostics component for debugging APK issues
 * This component can be temporarily added to the app to help diagnose production issues
 */
export default function ProductionDiagnosticsComponent() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const results = await ProductionDiagnostics.runFullDiagnostics();
      setDiagnostics(results);
      logger.info('Diagnostics completed successfully');
    } catch (error) {
      logger.error('Diagnostics failed', error);
      Alert.alert('Error', 'Failed to run diagnostics: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const shareDiagnostics = async () => {
    if (!diagnostics) return;
    
    try {
      const diagnosticsText = await ProductionDiagnostics.exportDiagnostics();
      await Share.share({
        message: diagnosticsText,
        title: 'Production Diagnostics',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share diagnostics');
    }
  };

  const clearLogs = () => {
    logger.clearProductionLogs();
    Alert.alert('Success', 'Production logs cleared');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Production Diagnostics</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={runDiagnostics}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Running...' : 'Run Diagnostics'}
          </Text>
        </TouchableOpacity>
        
        {diagnostics && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={shareDiagnostics}
          >
            <Text style={styles.buttonText}>Share Results</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.button, styles.warningButton]}
          onPress={clearLogs}
        >
          <Text style={styles.buttonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      {diagnostics && (
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Platform: {diagnostics.platform}</Text>
          <Text style={styles.sectionTitle}>Timestamp: {diagnostics.timestamp}</Text>
          
          <Text style={styles.sectionTitle}>Storage Status:</Text>
          <Text style={styles.resultText}>
            Available: {diagnostics.storage?.available ? 'YES' : 'NO'}
          </Text>
          <Text style={styles.resultText}>
            Fallback Keys: {diagnostics.storage?.fallbackKeys?.length || 0}
          </Text>
          
          <Text style={styles.sectionTitle}>Auth Status:</Text>
          <Text style={styles.resultText}>
            Token Exists: {diagnostics.auth?.tokenExists ? 'YES' : 'NO'}
          </Text>
          <Text style={styles.resultText}>
            Token Valid: {diagnostics.auth?.tokenValid ? 'YES' : 'NO'}
          </Text>
          {diagnostics.auth?.userInfo && (
            <Text style={styles.resultText}>
              User Role: {diagnostics.auth.userInfo.role}
            </Text>
          )}
          
          <Text style={styles.sectionTitle}>Environment:</Text>
          <Text style={styles.resultText}>
            Development: {diagnostics.environment?.isDevelopment ? 'YES' : 'NO'}
          </Text>
          <Text style={styles.resultText}>
            Node Env: {diagnostics.environment?.nodeEnv}
          </Text>
          
          <Text style={styles.sectionTitle}>Recent Logs ({diagnostics.logs?.length || 0}):</Text>
          {diagnostics.logs?.slice(-5).map((log: any, index: number) => (
            <Text key={index} style={styles.logText}>
              [{log.level}] {log.message}
            </Text>
          ))}
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
  buttonContainer: {
    marginBottom: 20,
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
    backgroundColor: '#34C759',
  },
  warningButton: {
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 3,
    color: '#666',
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 2,
    color: '#444',
  },
});
