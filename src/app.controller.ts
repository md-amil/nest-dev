import { CACHE_MANAGER, Controller, Get, Delete, Inject } from '@nestjs/common';
import { Model } from 'objection';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Get('/health')
  async getHealth() {
    await Model.knex().raw('SELECT 1');
    return {
      status: 'ok',
      db: 'ok',
    };
  }

  @Delete('/cache')
  async flushCache() {
    await this.cacheManager.reset();
    console.log('Cache Flushed: ', new Date());
    return { status: true };
  }
}
