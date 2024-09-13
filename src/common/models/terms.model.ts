import { QueryBuilder, ref } from 'objection';
import { Taxonomy } from 'src/categories/models/taxonomy.model';
import { Model } from './base.model';
import { TermMeta } from './term-meta.model';

export class Term extends Model {
  static tableName = 'wp_terms';
  static idColumn = 'term_id';
  static hidden = ['term_group', 'classic-editor-remember'];

  static modifyMeta(builder: QueryBuilder<Term>) {
    builder.where('meta_key', 'NOT LIKE', '\\_%');
  }

  static get relationMappings() {
    return {
      taxonomies: {
        relation: Model.HasManyRelation,
        modelClass: Taxonomy,
        join: {
          from: ref('term_id').from(Term.tableName),
          to: ref('term_id').from(Taxonomy.tableName),
        },
      },
      meta: {
        relation: Term.HasManyRelation,
        modelClass: TermMeta,
        modify: (builder: QueryBuilder<TermMeta>) => this.modifyMeta(builder),
        join: {
          from: Term.tableName + '.term_id',
          to: TermMeta.tableName + '.term_id',
        },
      },
    };
  }
}
