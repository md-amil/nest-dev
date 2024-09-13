import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard, AuthGuardOptions } from 'src/common/guards/auth.guard';

export function Auth(options: AuthGuardOptions = { required: true }) {
  return applyDecorators(UseGuards(AuthGuard(options)));
}

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse<Response>();
    return response.locals.user;
  },
);
