import { Pojo, QueryBuilder, ref } from 'objection';
import { Model } from 'src/common/models/base.model';
import { attachMeta } from 'src/common/helpers/meta.helper';
import { ColumnAlias } from 'src/common/modifiers/column-alias';
import { UserMeta } from './user-meta.model';

export class User extends Model {
  static tableName = 'wp_users';
  static idColumn = 'ID';

  id!: number;
  name!: string;
  username!: string;
  user_pass!: string;
  user_registered!: Date;
  meta!: UserMeta[];

  static hidden = [
    'username',
    'user_nicename',
    'user_email',
    'user_url',
    'user_activation_key',
    'user_pass',
    'user_status',
  ];

  static get columnNameMappers() {
    return new ColumnAlias(
      ['id', 'ID'],
      ['name', 'display_name'],
      ['username', 'user_login'],
      ['created_at', 'user_registered'],
    );
  }

  static get modifiers() {
    return {
      phrId(query: QueryBuilder<User>, phrId: string) {
        query
          .withGraphJoined('meta')
          .where('meta.meta_key', 'phr_id')
          .andWhere('meta.meta_value', phrId);
      },
    };
  }

  static get relationMappings() {
    return {
      meta: {
        relation: Model.HasManyRelation,
        modelClass: UserMeta,
        join: {
          from: ref('ID').from(User.tableName),
          to: ref('user_id').from(UserMeta.tableName),
        },
      },
    };
  }

  $formatJson(json: Pojo) {
    json = super.$formatJson(json);
    if (json.meta) json = attachMeta(json);
    return json;
  }
}
