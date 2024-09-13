import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { size } from 'src/config/cache';
import { PostsService } from './posts.service';
import { DoctorsService } from 'src/users/doctors.service';

describe('PostsController', () => {
  let controller: PostsController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true, max: size })],
      providers: [PostsService, DoctorsService],
      controllers: [PostsController],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
