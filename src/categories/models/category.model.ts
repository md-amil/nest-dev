import { mixin, Pojo, QueryBuilder, ref } from 'objection';
import { render } from 'src/common/helpers/content.helper';
import { attachMeta } from 'src/common/helpers/meta.helper';
import { TermMeta } from 'src/common/models/term-meta.model';
import { Term } from 'src/common/models/terms.model';
import { Attachment } from 'src/posts/models/attachment.model';
import { TermColumnAlias } from '../mixins/term-column-alias';

export const categoryMetaAlias = {
  category_meta_title: 'meta_title',
  category_meta_description: 'meta_description',
  category_banner_section_heading: 'banner.heading',
  category_banner_section_description: 'banner.description',
  category_banner_section_video_id: 'banner.video_id',
  category_page_description: 'description',
  category_article_banner_redirect: 'article_banner.redirect',
};

const categoryMetaCast = {
  is_location_dependent: Number,
  category_page_description: render,
};
export class Category extends mixin(Term, [TermColumnAlias]) {
  id!: string;
  meta!: TermMeta[];

  static onCreateQuery(query: QueryBuilder<Category>) {
    const { ref } = this;
    query
      .joinRelated('taxonomies')
      .where('taxonomies.taxonomy', 'category')
      .select(ref('term_id'), ref('slug'), ref('name'));
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      hiddenInHealthLibrary(builder: QueryBuilder<Category>) {
        builder.whereIn(
          Category.ref('term_id'),
          TermMeta.query()
            .joinRelated('taxonomies')
            .where('taxonomy', 'category')
            .where('meta_key', 'hide_from_health_library')
            .where('meta_value', 1)
            .select(TermMeta.ref('term_id')),
        );
      },
      notHiddenInHealthLibrary(builder: QueryBuilder<Category>) {
        builder.whereNotIn(
          Category.ref('term_id'),
          TermMeta.query()
            .joinRelated('taxonomies')
            .where('taxonomy', 'category')
            .where('meta_key', 'hide_from_health_library')
            .where('meta_value', 1)
            .select(TermMeta.ref('term_id')),
        );
      },
    };
  }

  static get relationMappings() {
    return {
      ...super.relationMappings,
      icon: attachmentRelation('category_icon'),
      banner: attachmentRelation('category_banner'),
      video_thumbnail: attachmentRelation('category_banner_video_thumbnail'),
      article_banner: attachmentRelation('category_article_banner'),
    };
  }

  static modifyMeta(builder: QueryBuilder<Term>): void {
    super.modifyMeta(builder);

    builder.modify(
      'except',
      'category_icon',
      'category_banner',
      'category_article_banner',
      'category_banner_video_thumbnail',
    );
  }

  $formatJson(json: Pojo) {
    json = super.$formatJson(json);
    if (json.meta) {
      return attachMeta(json, {
        alias: categoryMetaAlias,
        cast: categoryMetaCast,
      });
    }
    return json;
  }
}

export function attachmentRelation(type: string) {
  return {
    relation: Category.HasOneThroughRelation,
    modelClass: Attachment,
    modify(query: QueryBuilder<TermMeta>) {
      query.where(ref('meta_key').from(TermMeta.tableName), type);
    },
    join: {
      from: Term.tableName + '.term_id',
      through: {
        from: ref('term_id').from(TermMeta.tableName),
        to: ref('meta_value').from(TermMeta.tableName),
      },
      to: ref('ID').from(Attachment.tableName),
    },
  };
}
