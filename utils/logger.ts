import { __DEV__ } from 'react-native';

/**
 * Production-safe logger utility
 * Logs to console in development and can be extended for production logging
 */
class Logger {
  private isDev = __DEV__;

  /**
   * Log info messages
   */
  info(message: string, ...args: any[]) {
    if (this.isDev) {
      console.log(`[INFO] ${message}`, ...args);
    }
    // In production, you could send to a logging service
    this.logToProduction('INFO', message, args);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: any, ...args: any[]) {
    if (this.isDev) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
    // In production, you could send to a logging service
    this.logToProduction('ERROR', message, [error, ...args]);
  }

  /**
   * Log warning messages
   */
  warn(message: string, ...args: any[]) {
    if (this.isDev) {
      console.warn(`[WARN] ${message}`, ...args);
    }
    // In production, you could send to a logging service
    this.logToProduction('WARN', message, args);
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, ...args: any[]) {
    if (this.isDev) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log authentication-specific events
   */
  auth(event: string, data?: any) {
    const message = `Auth: ${event}`;
    if (this.isDev) {
      console.log(`[AUTH] ${message}`, data);
    }
    this.logToProduction('AUTH', message, data ? [data] : []);
  }

  /**
   * Log AsyncStorage operations
   */
  storage(operation: string, key: string, success: boolean, error?: any) {
    const message = `AsyncStorage ${operation} for key "${key}" - ${success ? 'SUCCESS' : 'FAILED'}`;
    if (this.isDev) {
      if (success) {
        console.log(`[STORAGE] ${message}`);
      } else {
        console.error(`[STORAGE] ${message}`, error);
      }
    }
    this.logToProduction('STORAGE', message, error ? [error] : []);
  }

  /**
   * Production logging placeholder
   * In a real app, you would send these to a logging service like Sentry, LogRocket, etc.
   */
  private logToProduction(level: string, message: string, args: any[]) {
    if (!this.isDev) {
      // Store logs locally or send to a logging service
      // For now, we'll just store critical errors
      if (level === 'ERROR' || level === 'AUTH') {
        try {
          // You could implement local storage of critical logs here
          // or send to a remote logging service
        } catch (e) {
          // Fail silently in production
        }
      }
    }
  }
}

export const logger = new Logger();
export default logger;
