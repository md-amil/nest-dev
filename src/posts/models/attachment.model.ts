import { QueryBuilder } from 'objection';
import { Post } from 'src/common/models/post.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';

export class Attachment extends Post {
  static get columnNameMappers() {
    return new ColumnAlias(
      ['id', 'ID'],
      ['url', 'guid'],
      ['mime_type', 'post_mime_type'],
    );
  }

  static onCreateQuery(q: QueryBuilder<Attachment>) {
    const { ref } = Attachment;
    q.alias('attachments')
      .where(ref('post_type'), 'attachment')
      .select('ID', 'guid', 'post_mime_type');
  }
}
