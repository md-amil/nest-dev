import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BacksupportLocaleMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    // We need to provide back support for the old 4 chars locale.
    // TODO: Temp remove after all the translations are completed.
    if (!request.query['locale'] && request.headers['accept-language']) {
      request.query['locale'] = request.headers['accept-language'];
    }

    next();
  }
}
