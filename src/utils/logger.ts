/**
 * Logger Utility
 * Centralized logging with environment-based controls
 */

import { envConfig } from '../config/env.config';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  context?: string;
}

class Logger {
  private context?: string;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor(context?: string) {
    this.context = context;
  }

  /**
   * Create a logger with specific context
   */
  static createLogger(context: string): Logger {
    return new Logger(context);
  }

  /**
   * Check if logging is enabled for this level
   */
  private isEnabled(level: LogLevel): boolean {
    if (envConfig.isProduction) {
      // In production, only log warnings and errors
      return level === LogLevel.WARN || level === LogLevel.ERROR;
    }
    
    // In development, log everything if debug logs are enabled
    return envConfig.enableDebugLogs || level === LogLevel.ERROR || level === LogLevel.WARN;
  }

  /**
   * Create log entry
   */
  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context: this.context,
    };
  }

  /**
   * Store log entry
   */
  private storeLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Format log message for console
   */
  private formatMessage(entry: LogEntry): string {
    const contextStr = entry.context ? `[${entry.context}]` : '';
    const timeStr = new Date(entry.timestamp).toLocaleTimeString('ar-SA');
    return `${timeStr} ${entry.level} ${contextStr} ${entry.message}`;
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    if (!this.isEnabled(LogLevel.DEBUG)) return;

    const entry = this.createLogEntry(LogLevel.DEBUG, message, data);
    this.storeLog(entry);

    console.log(this.formatMessage(entry), data || '');
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    if (!this.isEnabled(LogLevel.INFO)) return;

    const entry = this.createLogEntry(LogLevel.INFO, message, data);
    this.storeLog(entry);

    console.info(this.formatMessage(entry), data || '');
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any): void {
    if (!this.isEnabled(LogLevel.WARN)) return;

    const entry = this.createLogEntry(LogLevel.WARN, message, data);
    this.storeLog(entry);

    console.warn(this.formatMessage(entry), data || '');
  }

  /**
   * Log error message
   */
  error(message: string, error?: any): void {
    if (!this.isEnabled(LogLevel.ERROR)) return;

    const entry = this.createLogEntry(LogLevel.ERROR, message, error);
    this.storeLog(entry);

    console.error(this.formatMessage(entry), error || '');
  }

  /**
   * Get all stored logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs(): void {
    const blob = new Blob([this.exportLogs()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Create default logger instance
export const logger = new Logger('App');

// Create specialized loggers
export const authLogger = Logger.createLogger('Auth');
export const apiLogger = Logger.createLogger('API');
export const uiLogger = Logger.createLogger('UI');

export default logger;
