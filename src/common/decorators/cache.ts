import * as config from 'src/config/cache';
import {
  applyDecorators,
  CacheInterceptor,
  CacheTTL,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import _ from 'lodash';

interface CacheOption {
  cookies?: string[];
  headers?: string[];
}

@Injectable()
class HttpCacheInterceptor extends CacheInterceptor {
  private cookies: string[] = [];
  private headers: string[] = ['accept-language'];

  trackBy(context: ExecutionContext): string | undefined {
    const option = this.reflector.get(
      'CACHE_SETTING',
      context.getHandler(),
    ) as CacheOption;
    const req = context.switchToHttp().getRequest();

    let key = '';
    key += new URLSearchParams(
      _.pick(req.cookies, this.cookies.concat(option.cookies ?? [])),
    );
    key += new URLSearchParams(
      _.pick(req.headers, this.headers.concat(option.headers ?? [])),
    );

    return req.url + ':' + key;
  }
}

export function Cache(ttl: number = config.ttl, option: CacheOption = {}) {
  if (!config.enabled) {
    return applyDecorators();
  }

  return applyDecorators(
    UseInterceptors(HttpCacheInterceptor),
    CacheTTL(ttl),
    SetMetadata('CACHE_SETTING', option),
  );
}
