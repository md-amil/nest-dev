import { Model } from 'src/common/models/base.model';

export class UserMeta extends Model {
  static tableName = 'wp_usermeta';
  static hidden = ['umeta_id', 'user_id'];

  meta_key!: string;
  meta_value!: string;
}
