import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as config from 'src/config/cache';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async remove(key: string | string[]) {
    const keys = typeof key === 'string' ? [key] : key;

    await Promise.all(keys.map((item) => this.cache.del(item)));
  }

  async remember<T>(
    key: string,
    cb: () => Promise<T> | T,
    ttl: number = config.ttl,
  ): Promise<T> {
    let res = await this.cache.get<T>(key);
    if (!res) {
      res = await cb();
      this.cache.set(key, res, ttl);
    }
    return res;
  }
}
