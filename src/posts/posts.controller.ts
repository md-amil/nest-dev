import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Cache } from '../common/decorators/cache';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Cache()
  @Get('/')
  getPosts(@Query('locale') locale: string, @Query() query: any) {
    return this.postsService.getPosts(query, { locale });
  }

  @Cache()
  @Get(':slug')
  getPost(
    @Query('locale') locale: string,
    @Param('slug') slug: string,
  ) {
    return this.postsService.getPost(slug, { locale });
  }
}
