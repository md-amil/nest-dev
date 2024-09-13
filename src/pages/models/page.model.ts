import { Pojo, QueryBuilder } from 'objection';
import { attachMeta } from 'src/common/helpers/meta.helper';
import { PostMeta } from 'src/common/models/post-meta.model';
import { Post } from 'src/common/models/post.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';

const pageMetaAlias = {
  why_us_point_one_title: 'why_us.0.title',
  why_us_point_one_description: 'why_us.0.description',
  why_us_point_two_title: 'why_us.1.title',
  why_us_point_two_description: 'why_us.1.description',
  why_us_point_three_title: 'why_us.2.title',
  why_us_point_three_description: 'why_us.2.description',
  why_us: '_why_us',
  dive_into_our_dna_title: 'our_dna.title',
  dive_into_our_dna_description: 'our_dna.description',
  our_legacy_title: 'our_legacy.title',
  our_legacy_description: 'our_legacy.description',
  banner_title: 'banner.title',
  banner_description: 'banner.description',
  banner: '_banner',
};

export class Page extends Post {
  id!: string;
  meta!: PostMeta[];
  static onCreateQuery(builder: QueryBuilder<Page>) {
    const { ref } = Page;
    builder.where(ref('post_type'), 'page');
  }

  static get columnNameMappers() {
    return new ColumnAlias(
      ['id', 'ID'],
      ['slug', 'post_name'],
      ['title', 'post_title'],
    );
  }

  $formatJson(json: Pojo) {
    json = super.$formatJson(json);
    if (!json.meta) {
      return json;
    }

    return attachMeta(json, { alias: pageMetaAlias });
  }
}
