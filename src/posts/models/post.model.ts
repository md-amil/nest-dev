/* eslint-disable @typescript-eslint/no-var-requires */
import _ from 'lodash';
import { load as cheerioLoad } from 'cheerio';
import { mixin, Model, Pojo, QueryBuilder } from 'objection';
import { Category } from './category.model';
import { PostMeta } from 'src/common/models/post-meta.model';
import { Post as BasePost } from 'src/common/models/post.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';
import { Attachment } from './attachment.model';
import { DoctorType } from './doctor-type.model';
import { PostTerm } from 'src/common/models/post-term.model';
import { Term } from 'src/common/models/terms.model';
import { toArray } from 'src/common/helpers/query.helper';
import {
  thumbnailRelation,
  WithPostExtended,
} from '../mixins/with-post-extended';
import { nested } from '../../common/helpers/object.helper';
import { isDefault, normalizeSlug } from 'src/common/helpers/localization.helper';

export class Post extends mixin(BasePost, [WithPostExtended]) {
  id!: number;
  categories?: Category[];
  post_name!: string;
  meta!: PostMeta[];
  slug!: string;
  content!: string;
  title!: string;
  post_meta_title!: string;
  post_meta_description!: string;
  post_translations!: Record<string, number>;
  summary_field!: Record<string, string>;
  synopsis!: string;
  table_of_content!: string[];

  /**
   * The fields will be removed from the json.
   */
  $exclude = ['summary_field'];

  static onCreateQuery(builder: QueryBuilder<Post>) {
    const { ref } = Post;
    builder.where(ref('post_type'), 'post');
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      doctor(query: QueryBuilder<Post>, doctorId: string) {
        query
          .innerJoin('wp_postmeta', 'ID', 'post_id')
          .where('meta_key', 'doctor_id')
          .where('meta_value', doctorId);
      },
      doctorTypes(query: QueryBuilder<Post>, doctorTypes: string | string[]) {
        query.whereIn(
          'ID',
          PostTerm.query()
            .innerJoin(
              Term.tableName,
              Term.ref('term_id'),
              PostTerm.ref('term_id'),
            )
            .where('taxonomy', 'doctor_type')
            .whereIn(Term.ref('name'), toArray(doctorTypes))
            .select('post_id'),
        );
      },
      notHiddenInHealthLibrary(query: QueryBuilder<Post>) {
        return query.whereNotIn(
          'ID',
          PostTerm.query()
            .whereIn(
              'term_id',
              Category.query()
                .modify('hiddenInHealthLibrary')
                .select(Category.ref('term_id')),
            )
            .where('taxonomy', 'category')
            .select('post_id'),
        );
      },
      locale(query: QueryBuilder<Post>, locale: string) {
        if (locale === 'ALL') return;

        if (isDefault(locale)) {
          return query.whereNotIn('ID', function () {
            this.select('wp_posts.ID')
              .from('wp_posts')
              .join('wp_postmeta', 'wp_posts.ID', '=', 'wp_postmeta.post_id')
              .where('wp_postmeta.meta_key', '_locale');
          });
        }

        if (locale.includes('hi')) {
          return query
          .innerJoin('wp_postmeta as locale', 'ID', 'post_id')
          .where('locale.meta_key', '_locale')
          .where(function (q) {
            q.where('locale.meta_value', 'hi')
              .orWhere('locale.meta_value', 'hi_IN')
          });
        }

        return query
          .innerJoin('wp_postmeta as locale', 'ID', 'post_id')
          .where('locale.meta_key', '_locale')
          .where('locale.meta_value', locale);
      },
    };
  }

  static get columnNameMappers() {
    return new ColumnAlias(
      ['id', 'ID'],
      ['createdAt', 'post_date'],
      ['slug', 'post_name'],
      ['updatedAt', 'post_modified'],
      ['title', 'post_title'],
      ['subtitle', 'post_excerpt'],
      ['content', 'post_content'],
      ['status', 'post_status'],
      ['type', 'post_type'],
    );
  }

  static get relationMappings() {
    const { User } = require('../../users/models/user.model');
    const { ref } = User;
    return {
      ...super.relationMappings,
      doctorTypes: {
        relation: Model.ManyToManyRelation,
        modelClass: DoctorType,
        modify(q: QueryBuilder<DoctorType>) {
          q.where('post_term.taxonomy', 'doctor_type');
        },
        join: {
          from: ref('ID').from(Post.tableName),
          through: {
            from: 'post_term.post_id',
            to: 'post_term.term_id',
          },
          to: ref('term_id').from(DoctorType.tableName),
        },
      },
      attachments: {
        relation: Model.HasManyRelation,
        modelClass: Attachment,
        join: {
          from: ref('ID').from(Post.tableName),
          to: ref('post_parent').from(Post.tableName),
        },
      },
      thumbnail: thumbnailRelation('post_thumbnail'),
    };
  }

  $formatJson(json: Pojo) {
    json = super.$formatJson(json);

    generateTableOfContents(json);

    json = nested(json, ['summary_field']);

    if (json.summary_field) {
      json.summaries = Object.values(json.summary_field);
    }

    if (json._locale) {
      json.slug = normalizeSlug(json.slug, json._locale);
    }

    let post_translations = {};

    if (json.post_translations) {
      post_translations = JSON.parse(json.post_translations);

      if (post_translations['hi_IN']) {
        post_translations = {
          'hi': post_translations['hi_IN'],
        };
      }
    }

    json.post_translations = post_translations;
    json = _.omit(json, this.$exclude);

    return json;
  }
}

function generateTableOfContents(json: Pojo) {
  if (!json.content) return;

  const listItems = cheerioLoad(json.content)('h2').map((_, el) =>
    cheerioLoad(el).text(),
  );
  json.table_of_content = listItems.toArray();
}
