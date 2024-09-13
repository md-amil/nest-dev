import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { UsersService } from './users.service';
import { CacheService } from '../common/services/cache.service';

@Module({
  providers: [CacheService, DoctorsService, UsersService],
  exports: [DoctorsService, UsersService],
})
export class UsersModule {}
