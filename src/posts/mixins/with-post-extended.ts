import { Model, Pojo, QueryBuilder } from 'objection';
import { Category } from '../models/category.model';
import { render } from 'src/common/helpers/content.helper';
import { attachMeta } from 'src/common/helpers/meta.helper';
import { castTo } from 'src/common/helpers/object.helper';
import { unserialize } from 'src/common/helpers/serializer.helper';
import { PostMeta } from 'src/common/models/post-meta.model';
import { Post } from 'src/common/models/post.model';
import { Constructable } from 'src/common/types';
import { Attachment } from '../models/attachment.model';
import { TermMeta } from 'src/common/models/term-meta.model';

const postMetaAlias = {
  call_to_action_banner_details_is_cta_available: 'cta_banner.is_available',
  call_to_action_banner_details_cta_title: 'cta_banner.title',
  call_to_action_banner_details_cta_banner_link: 'cta_banner.link',
  call_to_action_banner_details: 'cta_banner.details',
  post_meta_title: 'meta_title',
  post_meta_description: 'meta_description',
  post_references_list: 'references_list',
  '_yoast_wpseo_estimated-reading-time-minutes': 'read_time',
};

export function cloudStorage(items: TermMeta[]) {
  const item = items.find(
    (item) => item.meta_key == 'windows_azure_storage_info',
  );

  if (!item) return;

  return unserialize(item.meta_value);
}

function extractExt(name: string) {
  const index = name.lastIndexOf('.');
  return [name.substring(index + 1), name.substring(0, index)] as const;
}

export function thumbnailRelation(key: string) {
  const { ref } = Model;
  return {
    relation: Model.HasOneThroughRelation,
    modelClass: Attachment,
    modify(q: QueryBuilder<Post>) {
      q.where(ref('meta_key').from('wp_postmeta'), key);
    },
    join: {
      from: ref('ID').from(Post.tableName),
      through: {
        modelClass: PostMeta,
        from: ref('post_id').from(PostMeta.tableName),
        to: ref('meta_value').from(PostMeta.tableName),
      },
      to: ref('ID').from(Post.tableName),
    },
  };
}

export function WithPostExtended<B extends typeof Model>(Base: B) {
  return (<I extends Constructable<Model>>(Instance: I) => {
    return class extends Instance {
      static modifyCategory(q: QueryBuilder<Category>) {
        q.where('post_term.taxonomy', 'category');
      }

      static get relationMappings() {
        const { User } = require('../../users/models/user.model');
        const { ref } = User;

        return {
          ...Base.relationMappings,
          author: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            modify(q: QueryBuilder<typeof User>) {
              q.select(ref('display_name'), ref('user_login'));
            },
            join: {
              from: ref('post_author').from(Post.tableName),
              to: ref('ID').from(User.tableName),
            },
          },
          categories: {
            relation: Model.ManyToManyRelation,
            modelClass: Category,
            modify: (q: QueryBuilder<Category>) => this.modifyCategory(q),
            join: {
              from: ref('ID').from(Post.tableName),
              through: {
                from: 'post_term.post_id',
                to: 'post_term.term_id',
              },
              to: ref('term_id').from(Category.tableName),
            },
          },
          image: thumbnailRelation('_thumbnail_id'),
        };
      }

      $formatJson(json: Pojo) {
        json = super.$formatJson(json);
        if (json.meta) {
          json = attachMeta(json, {
            alias: postMetaAlias,
            cast: { synopsis: (synopsis) => render(synopsis, json) },
          });
        }

        castTo(json, {
          content: (content) => render(content, json),
        });

        // Temporary: This change is temporary and needed to revert back once
        // the app handles the logic. This is to avoid the app from crashing.
        //
        // if (!json.image) {
        //   return json;
        // }
        // const [ext, name] = extractExt(json.image.url);
        // json.thumbnail = `${name}-150x150.${ext}`;
        // return json;

        if (json.image) {
          // Cloud storage platform is being used.
          if (!json.image.url.includes('wp-content') && json.image.meta) {
            const storage = cloudStorage(json.image.meta);
            if (storage) json.image.url = storage.url;
          }

          delete json.image.meta;
        } else {
          json.image = {};
        }

        if (json.thumbnail) {
          // Cloud storage platform is being used.
          if (
            !json.thumbnail.url.includes('wp-content') &&
            json.thumbnail.meta
          ) {
            const storage = cloudStorage(json.thumbnail.meta);
            if (storage) json.thumbnail = storage.url;
            else json.thumbnail = json.thumbnail.url;
          } else {
            json.thumbnail = json.thumbnail.url;
          }
        } else if (json.image.url) {
          const [ext, name] = extractExt(json.image.url);
          json.thumbnail = `${name}-150x150.${ext}`;
        }

        return json;
      }
    };
  })(Base);
}
