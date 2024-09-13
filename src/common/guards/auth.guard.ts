import {
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

export interface AuthGuardOptions {
  required: boolean;
}

export function AuthGuard(options: AuthGuardOptions): any {
  class MixinAuthGuard implements CanActivate {
    @Inject(UsersService)
    usersService: UsersService;

    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const authHeader = JSON.parse(request.headers['x-user-detail'] || '{}');

      if (options.required && !authHeader.masterPhrId) {
        throw new UnauthorizedException();
      }

      if (authHeader.masterPhrId) {
        response.locals.user = await this.usersService.findOrCreateFromRequest(
          authHeader,
        );
      }

      return true;
    }
  }

  return mixin(MixinAuthGuard);
}
