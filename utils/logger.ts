import { __DEV__, Platform } from 'react-native';

/**
 * Production-safe logger utility with enhanced production logging
 * Logs to console in development and provides production-safe logging for APK builds
 */
class Logger {
  private isDev = __DEV__;
  private productionLogs: Array<{ timestamp: string, level: string, message: string, data?: any }> = [];
  private readonly MAX_PRODUCTION_LOGS = 100;

  /**
   * Log info messages with production support
   */
  info(message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();

    if (this.isDev) {
      console.log(`[INFO] ${message}`, ...args);
    } else {
      // In production, also log to console for device logs
      console.log(`[${timestamp}] [INFO] ${message}`, ...args);
    }

    this.logToProduction('INFO', message, args);
  }

  /**
   * Log error messages with production support
   */
  error(message: string, error?: any, ...args: any[]) {
    const timestamp = new Date().toISOString();

    if (this.isDev) {
      console.error(`[ERROR] ${message}`, error, ...args);
    } else {
      // In production, always log errors to console for device logs
      console.error(`[${timestamp}] [ERROR] ${message}`, error, ...args);
    }

    this.logToProduction('ERROR', message, [error, ...args]);
  }

  /**
   * Log warning messages with production support
   */
  warn(message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();

    if (this.isDev) {
      console.warn(`[WARN] ${message}`, ...args);
    } else {
      // In production, also log warnings to console for device logs
      console.warn(`[${timestamp}] [WARN] ${message}`, ...args);
    }

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
   * Get production logs for debugging
   */
  getProductionLogs(): Array<{ timestamp: string, level: string, message: string, data?: any }> {
    return [...this.productionLogs];
  }

  /**
   * Clear production logs
   */
  clearProductionLogs(): void {
    this.productionLogs = [];
  }

  /**
   * Enhanced production logging with local storage
   */
  private logToProduction(level: string, message: string, args: any[]) {
    const timestamp = new Date().toISOString();

    // Store in memory for debugging
    this.productionLogs.push({
      timestamp,
      level,
      message,
      data: args.length > 0 ? args : undefined
    });

    // Keep only the most recent logs
    if (this.productionLogs.length > this.MAX_PRODUCTION_LOGS) {
      this.productionLogs = this.productionLogs.slice(-this.MAX_PRODUCTION_LOGS);
    }

    // For critical logs, also try to persist them
    if (level === 'ERROR' || level === 'AUTH' || level === 'STORAGE') {
      try {
        // In production, you could send to a logging service here
        // For now, we ensure they're visible in device logs
        if (!this.isDev) {
          console.log(`[CRITICAL] [${timestamp}] [${level}] ${message}`, ...args);
        }
      } catch (e) {
        // Fail silently in production
      }
    }
  }
}

export const logger = new Logger();
export default logger;
