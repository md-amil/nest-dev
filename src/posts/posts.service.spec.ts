import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { CacheModule } from '@nestjs/common';
import { size } from 'src/config/cache';
import { DoctorsService } from 'src/users/doctors.service';
describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true, max: size })],
      providers: [PostsService, DoctorsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
