import { Request } from 'express';
import axios from 'axios';
import * as loggerConfig from 'src/config/logger';
export type LoggerType = 'error' | 'info';
export interface LoggerInfo {
  message: string;
  path: string;
  attr?: Record<string, any>;
}

class Logger {
  constructor(private req?: Request) {}
  error(err: Error, attr?: LoggerInfo['attr']) {
    return this.send('error', {
      ...attr,
      message: err.message,
      path: this.req?.path,
    });
  }
  async send(type: LoggerType, data: LoggerInfo) {
    if (!loggerConfig.isEnabled) {
      console.warn('No logger endpoint found...');
      return;
    }
    const payload = {
      source: loggerConfig.source,
      payload: { type, ...data },
    };
    try {
      const res = await axios.post(loggerConfig.endpoint, payload);
      return res;
    } catch (err) {
      console.error(err);
      return;
    }
  }
}
export function logger(req?: Request) {
  return new Logger(req);
}
