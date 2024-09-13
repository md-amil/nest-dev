import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { DBError } from 'objection';
import { logger } from './logger';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return super.catch(exception, host);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception instanceof DBError) {
      const message = this.getDBErrorMessage(exception);
      logger(request).error(new Error(message));
      return response.status(500).json({
        statusCode: 500,
        message,
      });
    }
    console.error(exception);
    if (exception instanceof Error) {
      logger(request).error(exception);
      return response.status(500).json({
        statusCode: 500,
        message: exception.message,
      });
    }
    logger(request).error(new Error('Interval server error'));
    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }

  getDBErrorMessage(err: any) {
    if (err.nativeError?.sqlMessage) {
      return err.nativeError.sqlMessage;
    }
    return err.message;
  }
}
