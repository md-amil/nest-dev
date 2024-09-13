import { Model } from 'src/common/models/base.model';

export class Like extends Model {
  static tableName = 'wp_wti_like_post';
  static idColumn = 'id';
}
