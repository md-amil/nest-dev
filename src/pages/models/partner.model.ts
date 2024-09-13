import { Model, QueryBuilder, ref } from 'objection';
import { PostMeta } from 'src/common/models/post-meta.model';
import { Post } from 'src/common/models/post.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';
import { Attachment } from 'src/posts/models/attachment.model';

export class Partner extends Post {
  static onCreateQuery(query: QueryBuilder<Partner>) {
    query.where(Partner.ref('post_type'), 'bfhl_partner');
  }

  static get columnNameMappers() {
    return new ColumnAlias(['id', 'ID'], ['name', 'post_title']);
  }

  static get relationMappings() {
    return {
      ...super.relationMappings,
      logo: {
        relation: Model.HasOneThroughRelation,
        modelClass: Attachment,
        modify(q: QueryBuilder<Post>) {
          q.where(ref('meta_key').from('wp_postmeta'), 'partners_logo');
        },
        join: {
          from: ref('ID').from(Post.tableName),
          through: {
            modelClass: PostMeta,
            from: ref('post_id').from(PostMeta.tableName),
            to: ref('meta_value').from(PostMeta.tableName),
          },
          to: ref('ID').from(Post.tableName),
        },
      },

      meta: {
        ...super.relationMappings.meta,
        modify(builder: QueryBuilder<PostMeta>) {
          builder.modify('except', 'partners_logo');
        },
      },
    };
  }

  meta!: PostMeta[];
}
