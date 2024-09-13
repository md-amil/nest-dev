import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl: url, headers } = request;
    const requestId = randomUUID();

    this.logger.debug(
      `[${requestId}]: ${method} ${url} ${JSON.stringify(headers)}`,
    );

    response.on('close', () => {
      this.logger.debug(`[${requestId}]: Response Code ${response.statusCode}`);
    });

    next();
  }
}
