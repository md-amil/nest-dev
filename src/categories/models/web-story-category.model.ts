import { mixin, Model, QueryBuilder, ref } from 'objection';
import { PostTerm } from 'src/common/models/post-term.model';
import { TermMeta } from 'src/common/models/term-meta.model';
import { Term } from 'src/common/models/terms.model';
import { WebStory } from 'src/posts/models/web-story.model';
import { TermColumnAlias } from '../mixins/term-column-alias';

export class WebStoryCategory extends mixin(Term, [TermColumnAlias]) {
  id!: string;
  meta!: TermMeta[];

  static onCreateQuery(query: QueryBuilder<WebStoryCategory>) {
    const { ref } = this;
    query
      .joinRelated('taxonomies')
      .where('taxonomies.taxonomy', 'web_story_category')
      .select(ref('term_id'), ref('slug'), ref('name'));
  }

  static get relationMappings() {
    return {
      ...super.relationMappings,
      posts: {
        relation: Model.ManyToManyRelation,
        modelClass: WebStory,
        join: {
          from: ref('term_id').from(WebStoryCategory.tableName),
          through: {
            from: ref('term_id').from(PostTerm.tableName),
            to: ref('post_id').from(PostTerm.tableName),
          },
          to: ref('ID').from(WebStory.tableName),
        },
      },
    };
  }
}
