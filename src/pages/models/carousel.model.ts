import { QueryBuilder } from 'objection';
import { Post } from 'src/common/models/post.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';

export class Carousel extends Post {
  static onCreateQuery(query: QueryBuilder<Carousel>) {
    query
      .where(Carousel.ref('post_type'), 'bfhl_carousel')
      .select('ID', 'post_title', 'post_content');
  }

  static get columnNameMappers() {
    return new ColumnAlias(
      ['title', 'post_title'],
      ['description', 'post_content'],
    );
  }
}
