import { Controller, Get, Param } from '@nestjs/common';
import { Cache } from 'src/common/decorators/cache';
import { SharesService } from './shares.service';

@Controller('posts/:slug/shares')
export class SharesController {
  constructor(private sharesService: SharesService) {}

  @Cache(21 * 60) // cache for 21 mins to avoid third party rate-limit
  @Get()
  async get(@Param('slug') postSlug: string) {
    return this.sharesService.getPostShares(postSlug);
  }
}
