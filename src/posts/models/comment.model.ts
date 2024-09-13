import { Model } from 'src/common/models/base.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';

export class Comment extends Model {
  static tableName = 'wp_comments';
  static idColumn = 'comment_ID';

  user_id: number;
  author_name: string;
  content: string;
  parent_id: number;
  comment_post_ID: number;
  comment_karma: number;
  comment_approved: number | string;
  comment_type: string;
  created_at: Date;
  comment_date_gmt: Date;

  static hidden = [
    'comment_author_email',
    'comment_author_url',
    'comment_author_IP',
    'comment_date_gmt',
    'comment_karma',
    'comment_approved',
    'comment_agent',
    'comment_post_ID',
    'comment_type',
    'user_id',
  ];

  static get columnNameMappers() {
    return new ColumnAlias(
      ['id', 'comment_ID'],
      ['author_name', 'comment_author'],
      ['content', 'comment_content'],
      ['parent_id', 'comment_parent'],
      ['created_at', 'comment_date'],
    );
  }
}
