import { Pojo, QueryBuilder } from 'objection';
import { attachMeta } from 'src/common/helpers/meta.helper';
import { PostMeta } from 'src/common/models/post-meta.model';
import { Post } from 'src/common/models/post.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';

const metaAlias = {
  testimonial_author: 'author.name',
  testimonial_content: 'content',
};

export class Testimonial extends Post {
  static onCreateQuery(query: QueryBuilder<Testimonial>) {
    query.where(Testimonial.ref('post_type'), 'bfhl_testimonial');
  }

  static get columnNameMappers() {
    return new ColumnAlias(['id', 'ID']);
  }

  meta!: PostMeta[];

  $formatJson(json: Pojo) {
    json = super.$formatJson(json);
    if (json.meta) {
      return attachMeta(json, { alias: metaAlias });
    }
    return json;
  }
}
