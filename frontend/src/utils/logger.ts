// utils/logger.ts
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
} as const;

type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

class Logger {
  private static level: LogLevelType = LogLevel.INFO;

  static setLevel(level: LogLevelType) {
    this.level = level;
  }

  static debug(message: string, data?: any) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  static info(message: string, data?: any) {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  static warn(message: string, data?: any) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  static error(message: string, error?: Error | any) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error);
    }
  }

  static gameAction(action: string, data?: any) {
    this.info(`Game Action: ${action}`, data);
  }

  static resourceChange(resource: string, amount: number, reason: string) {
    this.debug(`Resource Change: ${resource} ${amount > 0 ? '+' : ''}${amount} (${reason})`);
  }

  static crewAction(action: string, crewName: string, data?: any) {
    this.info(`Crew Action: ${action} by ${crewName}`, data);
  }

  static systemEvent(event: string, systemName: string, data?: any) {
    this.info(`System Event: ${event} in ${systemName}`, data);
  }

  static performance(metric: string, value: number, unit: string = '') {
    this.debug(`Performance: ${metric} = ${value}${unit}`);
  }

  static uiEvent(event: string, component: string, data?: any) {
    this.debug(`UI Event: ${event} in ${component}`, data);
  }
}

export default Logger;
export { LogLevel };