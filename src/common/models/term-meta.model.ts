import { QueryBuilder, ref } from 'objection';
import { Taxonomy } from 'src/categories/models/taxonomy.model';
import { Model } from './base.model';

export class TermMeta extends Model {
  static tableName = 'wp_termmeta';
  static idColumn = 'meta_id';

  meta_key!: string;
  meta_value!: string;

  static modifiers = {
    only(query: QueryBuilder<TermMeta>, ...fields: string[]) {
      return query.whereIn('meta_key', fields);
    },
    except(query: QueryBuilder<TermMeta>, ...fields: string[]) {
      return query.whereNotIn('meta_key', fields);
    },
  };

  static get relationMappings() {
    return {
      taxonomies: {
        relation: Model.HasManyRelation,
        modelClass: Taxonomy,
        join: {
          from: ref('term_id').from(TermMeta.tableName),
          to: ref('term_id').from(Taxonomy.tableName),
        },
      },
    };
  }
}
