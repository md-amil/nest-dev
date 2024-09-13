import { Model, QueryBuilder, ref } from 'objection';
import { PostMeta } from 'src/common/models/post-meta.model';
import { Post } from 'src/common/models/post.model';
import { Term } from 'src/common/models/terms.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';

export class FAQ extends Post {
  ID!: string;
  meta!: PostMeta[];
  static onCreateQuery(builder: QueryBuilder<FAQ>) {
    const { ref } = FAQ;
    builder
      .where(ref('post_type'), 'bfhl_faqs')
      .select('ID', 'post_title')
      .withGraphFetched('meta')
      .withGraphFetched('categories');
  }

  static get columnNameMappers() {
    return new ColumnAlias(['id', 'ID'], ['question', 'post_title']);
  }

  static get relationMappings() {
    return {
      ...super.relationMappings,
      categories: {
        relation: Model.ManyToManyRelation,
        modelClass: Term,
        modify(q: QueryBuilder<Term>) {
          q.where('post_term.taxonomy', 'faqs_category');
        },
        join: {
          from: ref('ID').from(Post.tableName),
          through: {
            from: 'post_term.post_id',
            to: 'post_term.term_id',
          },
          to: ref('term_id').from(Term.tableName),
        },
      },
    };
  }
}
