import { Controller, Get, Param, Query } from '@nestjs/common';
import { Cache } from 'src/common/decorators/cache';
import { paginate, toArray } from 'src/common/helpers/query.helper';
import { PostTerm } from 'src/common/models/post-term.model';
import { WebStory } from './models/web-story.model';

@Controller('web-stories/posts')
export class WebStoriesController {
  @Cache()
  @Get('trending')
  getTrendingWebStories(@Query() query: any) {
    const builder = WebStory.query()
      .modify('published')
      .withGraphFetched('image.meta')
      .orderBy('ID', 'desc')
      .select('ID', 'post_title', 'post_name', 'post_date');

    return paginate(query, builder);
  }

  @Cache()
  @Get()
  getWebStories(@Query() query: any) {
    const builder = WebStory.query()
      .modify('published')
      .withGraphFetched('image.meta')
      .withRequestQuery(query)
      .orderBy('ID', 'desc')
      .select('ID', 'post_title', 'post_name', 'post_date');

    if (query.category_id) {
      builder.whereIn(
        'ID',
        PostTerm.query()
          .where('taxonomy', 'web_story_category')
          .whereIn('term_id', toArray(query.category_id))
          .select('post_id'),
      );
    }

    return paginate(query, builder);
  }

  @Cache()
  @Get(':slug')
  getWebStory(@Param('slug') slug: string) {
    return WebStory.query()
      .modify('published')
      .withGraphFetched('image')
      .findOne({ post_name: slug })
      .throwIfNotFound();
  }
}
