import { QueryBuilder, ref } from 'objection';
import { Model } from './base.model';
import { PostMeta } from './post-meta.model';

export class Post extends Model {
  static tableName = 'wp_posts';
  static idColumn = 'ID';
  static hidden = [
    'post_password',
    'post_date_gmt',
    'post_modified_gmt',
    'classic-editor-remember',
    'post_author',
    'post_parent',
    'guid',
    'post_mime_type',
    'type',
    'menu_order',
  ];

  static get modifiers() {
    return {
      published(query: QueryBuilder<Post>) {
        query.where(Post.ref('post_status'), 'publish');
      },
    };
  }

  static get relationMappings() {
    return {
      meta: {
        relation: Model.HasManyRelation,
        modelClass: PostMeta,
        join: {
          from: ref('ID').from(Post.tableName),
          to: ref('post_id').from(PostMeta.tableName),
        },
      },
    };
  }
}
