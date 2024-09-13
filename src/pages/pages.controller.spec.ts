import { Test, TestingModule } from '@nestjs/testing';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { size } from 'src/config/cache';

describe('PagesController', () => {
  let controller: PagesController;
  let cacheManager: Cache;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true, max: size })],
      providers: [PagesService],
      controllers: [PagesController],
    }).compile();
    controller = module.get<PagesController>(PagesController);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
