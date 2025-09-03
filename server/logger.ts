export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type LogContext = 'auth' | 'security' | 'health' | 'api' | 'database' | 'general';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: LogContext;
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit", 
      second: "2-digit",
      hour12: true,
    });
    
    let message = `${timestamp} [${entry.context}] ${entry.level.toUpperCase()}: ${entry.message}`;
    
    if (entry.userId) {
      message += ` (user: ${entry.userId})`;
    }
    
    if (entry.metadata) {
      message += ` ${JSON.stringify(entry.metadata)}`;
    }
    
    return message;
  }
  
  private log(level: LogLevel, context: LogContext, message: string, metadata?: Record<string, any>, userId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      metadata,
      userId,
    };
    
    const formattedMessage = this.formatMessage(entry);
    
    // In production, you could send to external logging service
    // For now, use console with appropriate level
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
    }
  }
  
  error(context: LogContext, message: string, metadata?: Record<string, any>, userId?: string): void {
    this.log('error', context, message, metadata, userId);
  }
  
  warn(context: LogContext, message: string, metadata?: Record<string, any>, userId?: string): void {
    this.log('warn', context, message, metadata, userId);
  }
  
  info(context: LogContext, message: string, metadata?: Record<string, any>, userId?: string): void {
    this.log('info', context, message, metadata, userId);
  }
  
  debug(context: LogContext, message: string, metadata?: Record<string, any>, userId?: string): void {
    this.log('debug', context, message, metadata, userId);
  }
  
  // Convenience methods for common scenarios
  apiRequest(method: string, path: string, statusCode: number, duration: number, userId?: string): void {
    this.info('api', `${method} ${path} ${statusCode}`, { duration, statusCode }, userId);
  }
  
  authEvent(event: string, success: boolean, userId?: string, metadata?: Record<string, any>): void {
    const level = success ? 'info' : 'warn';
    this.log(level, 'auth', `${event}: ${success ? 'success' : 'failed'}`, metadata, userId);
  }
  
  securityEvent(event: string, severity: 'low' | 'medium' | 'high', metadata?: Record<string, any>): void {
    const level = severity === 'high' ? 'error' : severity === 'medium' ? 'warn' : 'info';
    this.log(level, 'security', event, { ...metadata, severity });
  }
  
  healthCheck(status: 'healthy' | 'unhealthy' | 'degraded', component: string, metadata?: Record<string, any>): void {
    const level = status === 'healthy' ? 'info' : status === 'degraded' ? 'warn' : 'error';
    this.log(level, 'health', `${component} is ${status}`, metadata);
  }
}

export const logger = new Logger();