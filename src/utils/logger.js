/**
 * Simple Logger Implementation for Architecture Compliance System
 */

export class Logger {
  constructor(name) {
    this.name = name;
  }

  info(message) {
    console.log(`[${this.name}] INFO: ${message}`);
  }

  debug(message) {
    if (process.env.DEBUG) {
      console.log(`[${this.name}] DEBUG: ${message}`);
    }
  }

  warn(message) {
    console.warn(`[${this.name}] WARN: ${message}`);
  }

  error(message) {
    console.error(`[${this.name}] ERROR: ${message}`);
  }
}

// Export default logger instance
export const logger = new Logger('Archon');

export default Logger;
