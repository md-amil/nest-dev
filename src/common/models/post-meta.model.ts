import { QueryBuilder } from 'objection';
import { Model } from './base.model';

export class PostMeta extends Model {
  static tableName = 'wp_postmeta';

  static onCreateQuery(query: QueryBuilder<PostMeta>) {
    const { ref } = this;
    query.where((q) => {
      q.where(ref('meta_key'), 'Not Like', '\\_%');
      q.orWhere(ref('meta_key'), '_yoast_wpseo_estimated-reading-time-minutes');
      q.orWhere(ref('meta_key'), '_wp_attached_file');
      q.orWhere(ref('meta_key'), '_locale');
      q.orWhere(function (query: QueryBuilder<PostMeta>) {
        query.where(ref('meta_key'), 'Not Like', '\\_oembed_time_%');
        query.where(ref('meta_key'), 'Like', '\\_oembed_%');
      });
    });
  }

  meta_key!: string;
  meta_value!: string;

  static modifiers = {
    only(query: QueryBuilder<PostMeta>, ...fields: string[]) {
      return query.whereIn(PostMeta.ref('meta_key'), fields);
    },
    filterEmpty(query: QueryBuilder<PostMeta>) {
      return query
        .whereNotNull(PostMeta.ref('meta_value'))
        .where(PostMeta.ref('meta_value'), '!=', '');
    },
    except(query: QueryBuilder<PostMeta>, ...fields: string[]) {
      return query.whereNotIn(PostMeta.ref('meta_key'), fields);
    },
  };
}
