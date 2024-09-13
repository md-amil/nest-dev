import { Controller, Get, Query } from '@nestjs/common';
import { Cache } from 'src/common/decorators/cache';
import { paginate } from 'src/common/helpers/query.helper';
import { PostTerm } from 'src/common/models/post-term.model';
import { WebStory } from 'src/posts/models/web-story.model';
import { WebStoryCategory } from './models/web-story-category.model';

@Controller('web-stories/categories')
export class WebStoryCategories {
  @Cache()
  @Get('/')
  async getAll(@Query() query: any) {
    const { results: categories, ...response } = await paginate(
      query,
      WebStoryCategory.query().orderBy('name', 'asc'),
    );

    const postsPromise = categories.map((category) =>
      WebStory.query()
        .modify('published')
        .withGraphFetched('image')
        .whereIn(
          'ID',
          PostTerm.query()
            .where('taxonomy', 'web_story_category')
            .where('term_id', category.id)
            .select('post_id'),
        )
        .limit(12)
        .orderBy('ID', 'desc')
        .select('ID', 'post_title', 'post_name', 'post_date'),
    );

    const results = [],
      postsCollection = await Promise.all(postsPromise);

    for (let i = 0; i < categories.length; i++) {
      results[i] = {
        ...categories[i],
        posts: postsCollection[i],
      };
    }

    return {
      results,
      ...response,
    };
  }
}
