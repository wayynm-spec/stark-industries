import { env } from "./env";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  timestamp: string;
  level: LogLevel;
  service: string;
  requestId?: string;
  userId?: string;
  message: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const logLevelPriority = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private minLevel = logLevelPriority[env.LOG_LEVEL as LogLevel];
  private service: string;

  constructor(service: string) {
    this.service = service;
  }

  private shouldLog(level: LogLevel): boolean {
    return logLevelPriority[level] >= this.minLevel;
  }

  private format(context: LogContext): string {
    return JSON.stringify(context);
  }

  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const context: LogContext = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      data,
    };

    if (error) {
      context.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    const formatted = this.format(context);

    if (level === "error") {
      console.error(formatted);
    } else if (level === "warn") {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log("debug", message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log("info", message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log("warn", message, data);
  }

  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log("error", message, data, error);
  }
}

export function createLogger(service: string): Logger {
  return new Logger(service);
}

export const logger = createLogger("stark");
