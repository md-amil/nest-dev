import { HttpException, Injectable } from '@nestjs/common';
import { QueryBuilder } from 'objection';
import { TermMeta } from 'src/common/models/term-meta.model';
import { DoctorsService } from 'src/users/doctors.service';
import { Post } from './models/post.model';
import { PostTerm } from '../common/models/post-term.model';
import { paginate, toArray } from '../common/helpers/query.helper';
import { PostmetaService } from './postmeta.service';
import { localizeSlug } from 'src/common/helpers/localization.helper';

interface PostOptions {
  locale: string;
}

@Injectable()
export class PostsService {
  constructor(
    private doctorsService: DoctorsService,
    private postmetaService: PostmetaService,
  ) {}

  async getPost(slug: string, { locale }: PostOptions) {
    let query = Post.query()
      .modify('published')
      .withGraphFetched('attachments')
      .withGraphFetched('thumbnail.meta')
      .withGraphFetched('image.meta')
      .withGraphFetched('meta')
      .withGraphFetched(
        'categories.[meta, banner, icon, article_banner, video_thumbnail]',
      )
      .modifyGraph('categories.meta', (query: QueryBuilder<TermMeta>) => {
        query.modify(
          'except',
          'category_meta_description',
          'category_meta_title',
        );
      })
      .withGraphFetched('doctorTypes')

    // We need to provide back support for the old 4 chars locale.
    // TODO: Temp remove after all the translations are completed.
    if (locale && locale.includes('hi')) {
      query = query.where(function (q) {
        q.where('post_name', localizeSlug(slug, 'hi'))
          .orWhere('post_name', slug + '-hi_in');
      });
    } else {
      query = query.where('post_name', localizeSlug(slug, locale));
    }

    const post = await query.first();

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    const response = post.toJSON() as any;

    const [doctor_info, pagination_links] = await Promise.all([
      this.doctorsService.getDoctor(
        response.doctor_id,
        response.custom_author_name,
      ),
      this.postmetaService.getPaginationLinks(response),
    ]);

    response.doctor_info = doctor_info;
    response.next_page = pagination_links.next_page;
    response.previous_page = pagination_links.previous_page;

    return response;
  }

  getPosts(query: any, { locale }: PostOptions) {
    const builder = Post.query()
      .modify('locale', locale)
      .modify('published')
      .select('ID', 'post_title', 'post_date', 'post_modified', 'post_name')
      .withGraphFetched('thumbnail.meta')
      .withGraphFetched('image.meta')
      .withGraphFetched('author')
      .withGraphFetched('doctorTypes')
      .withGraphFetched('categories')
      .withGraphFetched('meta')
      .modifyGraph('meta', (q) =>
        q.modify(
          'only',
          '_locale',
          '_yoast_wpseo_estimated-reading-time-minutes',
          'custom_author_name',
        ),
      )
      .modify('notHiddenInHealthLibrary')
      .withRequestQuery(query)
      .orderBy('ID', 'desc');

    if (query.specialties) {
      builder.modify('doctorTypes', query.specialties);
    }
    if (query.tag_id) {
      builder.where(
        'ID',
        'IN',
        PostTerm.query()
          .where('taxonomy', 'post_tag')
          .where('term_id', query.tag_id)
          .select('post_id'),
      );
    }
    if (query.category_id) {
      builder.whereIn(
        'ID',
        PostTerm.query()
          .where('taxonomy', 'category')
          .whereIn('term_id', toArray(query.category_id))
          .select('post_id'),
      );
    }
    if (query.title) {
      builder.where('post_title', 'like', `%${query.title}%`);
    }
    if (query.id) {
      builder.where('ID', query.id);
    }
    if (query.q) {
      builder.where((b) => {
        b.where('post_title', 'LIKE', `%${query.q}%`);
        b.orWhere('post_content', 'LIKE', `%${query.q}%`);
        b.orWhere('ID', 'LIKE', query.q);
      });
    }
    if (query.doctor_id) {
      builder.modify('doctor', query.doctor_id);
    }
    return paginate(query, builder);
  }
}
