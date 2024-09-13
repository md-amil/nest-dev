import {
  Controller,
  Get,
  HttpException,
  Param,
  Query,
} from '@nestjs/common';
import { Cache } from 'src/common/decorators/cache';
import { paginate } from 'src/common/helpers/query.helper';
import { PostTerm } from 'src/common/models/post-term.model';
import { Post } from 'src/posts/models/post.model';
import { Category } from './models/category.model';

@Controller('categories')
export class CategoriesController {
  @Cache(60 * 60 * 10) // cache for 10 hours
  @Get('/')
  getAll(@Query() query: any) {
    const builder = Category.query()
      .withGraphFetched('icon')
      .withGraphFetched('banner')
      .withGraphFetched('meta')
      .modifyGraph('meta', (q) => {
        q.modify('only', 'category_meta_title', 'category_meta_description');
      })
      .modify('notHiddenInHealthLibrary')
      .withRequestQuery(query);
    if (query.name) {
      builder.where('name', 'LIKE', `${query.name}%`);
    }
    return builder;
  }

  @Get('/:category')
  @Cache()
  async getCategory(@Param('category') slug: string) {
    const category = await Category.query()
      .withGraphFetched('icon')
      .withGraphFetched('banner')
      .withGraphFetched('video_thumbnail')
      .withGraphFetched('article_banner')
      .withGraphFetched('meta')
      .where('slug', slug)
      .first();

    if (!category) {
      throw new HttpException(`${slug} is not valid`, 404);
    }
    return category;
  }

  @Cache()
  @Get('/:category/posts')
  async getCategoryPosts(
    @Param('category') slug: string,
    @Query('locale') locale: string,
    @Query() query: Record<string, string>,
  ) {
    const [category] = await Promise.all([
      Category.query()
        .withGraphFetched('banner')
        .withGraphFetched('video_thumbnail')
        .withGraphFetched('meta')
        .where('slug', slug)
        .first(),
    ]);
    if (!category) {
      throw new HttpException('Invalid slug', 404);
    }

    const posts = await paginate(
      query,
      Post.query()
        .whereIn(
          'ID',
          PostTerm.query().where('term_id', category.id).select('post_id'),
        )
        .orderBy('ID', 'desc')
        .modify('published')
        .modify('locale', locale)
        .withRequestQuery(query)
        .select('ID', 'post_title', 'post_name')
        .withGraphFetched('meta')
        .modifyGraph('meta', (q) =>
          q.modify(
            'only',
            '_yoast_wpseo_estimated-reading-time-minutes',
            '_locale',
          ),
        )
        .withGraphFetched('thumbnail.meta')
        .withGraphFetched('image.meta'),
    );

    return {
      ...category.toJSON(),
      ...posts,
    };
  }
}
