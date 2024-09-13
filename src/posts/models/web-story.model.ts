import { mixin, Pojo, QueryBuilder } from 'objection';
import { castTo } from 'src/common/helpers/object.helper';
import { Post } from 'src/common/models/post.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';
import { WithPostExtended } from '../mixins/with-post-extended';

export class WebStory extends mixin(Post, [WithPostExtended]) {
  static columnNameMappers = new ColumnAlias(
    ['id', 'ID'],
    ['created_at', 'post_date'],
    ['title', 'post_title'],
    ['slug', 'post_name'],
    ['subtitle', 'post_excerpt'],
    ['content', 'post_content'],
    ['status', 'post_status'],
    ['type', 'post_type'],
  );

  static hidden = [
    ...super.hidden,
    'comment_count',
    'comment_status',
    'ping_status',
    'pinged',
    'post_content_filtered',
    'post_modified',
    'status',
    'subtitle',
    'to_ping',
  ];

  static onCreateQuery(builder: QueryBuilder<WebStory>) {
    builder.where(this.ref('post_type'), 'web-story');
  }

  static modifyCategory(builder: QueryBuilder<WebStory>) {
    builder.where('post_term.taxonomy', 'web_story_category');
  }

  $formatJson(json: Pojo) {
    json = super.$formatJson(json);

    castTo(json, {
      content: replaceWebstoriesLink,
    });

    return json;
  }
}

function replaceWebstoriesLink(content: string) {
  return content
    .replace(
      'wp-staging.bajajfinservhealth.in/web-stories',
      'stag.bajajfinservhealth.in/web-stories',
    )
    .replace(
      'wp-api.bajajfinservhealth.in/web-stories',
      'www.bajajfinservhealth.in/web-stories',
    );
}
