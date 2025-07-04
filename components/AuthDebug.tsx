import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useAuth from '@/hooks/useAuth';
import { storage } from '@/utils/storage';
import { alternativeStorage } from '@/utils/alternativeStorage';
import { validateToken } from '@/utils/tokenUtils';
import { logger } from '@/utils/logger';

/**
 * Temporary debug component to diagnose auth issues
 * Add this to the admin dashboard temporarily to debug the user undefined issue
 */
export default function AuthDebug() {
  const { user, token, isFetching, error } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const runDebug = async () => {
    try {
      // Get token from storage directly
      const directToken = await storage.getItem('token');
      const altToken = await alternativeStorage.getItem('token');
      
      // Validate tokens
      const directValidation = directToken ? validateToken(directToken) : null;
      const altValidation = altToken ? validateToken(altToken) : null;
      
      // Get recent logs
      const recentLogs = logger.getProductionLogs().slice(-10);
      
      const info = {
        timestamp: new Date().toISOString(),
        useAuthResult: {
          hasUser: !!user,
          hasToken: !!token,
          isFetching,
          hasError: !!error,
          userRole: user?.role,
          userId: user?.id,
          tokenLength: token?.length,
        },
        directStorage: {
          hasToken: !!directToken,
          tokenLength: directToken?.length,
          validation: directValidation ? {
            isValid: directValidation.isValid,
            reason: directValidation.reason,
            hasUser: !!directValidation.user,
            userRole: directValidation.user?.role,
          } : null,
        },
        alternativeStorage: {
          hasToken: !!altToken,
          tokenLength: altToken?.length,
          validation: altValidation ? {
            isValid: altValidation.isValid,
            reason: altValidation.reason,
            hasUser: !!altValidation.user,
            userRole: altValidation.user?.role,
          } : null,
        },
        recentLogs: recentLogs.map(log => ({
          level: log.level,
          message: log.message,
          timestamp: log.timestamp,
        })),
      };
      
      setDebugInfo(info);
      console.log('Auth Debug Info:', info);
      
    } catch (error) {
      console.error('Debug failed:', error);
      setDebugInfo({ error: error.message });
    }
  };

  useEffect(() => {
    // Auto-run debug on mount
    runDebug();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Debug</Text>
      
      <TouchableOpacity style={styles.button} onPress={runDebug}>
        <Text style={styles.buttonText}>Refresh Debug Info</Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>useAuth Hook:</Text>
        <Text style={styles.value}>User: {user ? `${user.name} (${user.role})` : 'undefined'}</Text>
        <Text style={styles.value}>Token: {token ? 'present' : 'null'}</Text>
        <Text style={styles.value}>Fetching: {isFetching ? 'yes' : 'no'}</Text>
        <Text style={styles.value}>Error: {error ? 'yes' : 'no'}</Text>
        
        {debugInfo && (
          <>
            <Text style={styles.label}>Direct Storage:</Text>
            <Text style={styles.value}>
              Token: {debugInfo.directStorage?.hasToken ? 'present' : 'null'}
            </Text>
            <Text style={styles.value}>
              Valid: {debugInfo.directStorage?.validation?.isValid ? 'yes' : 'no'}
            </Text>
            {debugInfo.directStorage?.validation?.reason && (
              <Text style={styles.error}>
                Reason: {debugInfo.directStorage.validation.reason}
              </Text>
            )}
            
            <Text style={styles.label}>Alternative Storage:</Text>
            <Text style={styles.value}>
              Token: {debugInfo.alternativeStorage?.hasToken ? 'present' : 'null'}
            </Text>
            <Text style={styles.value}>
              Valid: {debugInfo.alternativeStorage?.validation?.isValid ? 'yes' : 'no'}
            </Text>
            
            <Text style={styles.label}>Recent Logs:</Text>
            {debugInfo.recentLogs?.slice(-3).map((log: any, index: number) => (
              <Text key={index} style={styles.logText}>
                [{log.level}] {log.message}
              </Text>
            ))}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  value: {
    fontSize: 12,
    marginBottom: 3,
    color: '#666',
  },
  error: {
    fontSize: 12,
    marginBottom: 3,
    color: '#ff6b6b',
  },
  logText: {
    fontSize: 10,
    fontFamily: 'monospace',
    marginBottom: 2,
    color: '#444',
  },
});
