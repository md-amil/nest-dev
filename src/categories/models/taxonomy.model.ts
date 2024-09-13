import { QueryBuilder } from 'objection';
import { Model } from 'src/common/models/base.model';

export class Taxonomy extends Model {
  static tableName = 'wp_term_taxonomy';
  static onCreateQuery(query: QueryBuilder<Taxonomy>) {
    query.alias('term_taxonomy');
  }
}
