import { Post } from './models/post.model';
import { PostTerm } from '../common/models/post-term.model';

export class PostmetaService {
  private queryBuilder(locale: string, categories = []) {
    return Post.query()
      .whereIn(
        'ID',
        PostTerm.query()
          .where('taxonomy', 'category')
          .whereIn('term_id', categories)
          .select('post_id'),
      )
      .modify('locale', locale)
      .modify('published')
      .withGraphFetched('meta')
      .modifyGraph('meta', (q) => q.modify('only', '_locale'))
      .first();
  }

  private transform(post) {
    const clone = post.toJSON();

    return {
      title: clone.title,
      slug: clone.slug,
    };
  }

  async getPaginationLinks(post) {
    const categories = post.categories.map((category) => category.id);

    const [previous_post, next_post] = await Promise.all([
      this.queryBuilder(post._locale, categories)
        .orderBy('ID', 'desc')
        .where('ID', '<', post.id),
      this.queryBuilder(post._locale, categories).where('ID', '>', post.id),
    ]);

    return {
      previous_page: previous_post ? this.transform(previous_post) : undefined,
      next_page: next_post ? this.transform(next_post) : undefined,
    };
  }
}
