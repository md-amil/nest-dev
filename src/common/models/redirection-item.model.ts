import { QueryBuilder } from 'objection';
import { Model } from './base.model';

export class RedirectionItem extends Model {
  static tableName = 'wp_redirection_items';

  action_code: number;
  action_data: string;
  url: string;

  static get modifiers() {
    return {
      enabled(query: QueryBuilder<RedirectionItem>) {
        query.where('status', 'enabled');
      },
    };
  }
}
