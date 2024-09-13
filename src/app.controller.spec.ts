import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { size } from './config/cache';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let cacheManager: Cache;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true, max: size })],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = app.get<AppController>(AppController);
    cacheManager = app.get<Cache>(CACHE_MANAGER);
  });
  it('should call cacheManager.reset() method and return status true', async () => {
    jest.spyOn(cacheManager, 'reset');
    const result = await appController.flushCache();
    expect(cacheManager.reset).toHaveBeenCalled();
    expect(result).toEqual({ status: true });
  });
});
