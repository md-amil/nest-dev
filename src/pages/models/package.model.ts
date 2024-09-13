import { QueryBuilder } from 'objection';
import { PostMeta } from 'src/common/models/post-meta.model';
import { Post } from 'src/common/models/post.model';
import { ColumnAlias } from 'src/common/modifiers/column-alias';
export const packageMetaAlias = {
  with_age_of_eldest_member_min_age: 'age_of_eldest_member.min_age',
  with_age_of_eldest_member_max_age: 'age_of_eldest_member.max_age',
  with_age_of_eldest_member: 'age_of_eldest_member.name',
};
for (const b of Array(6).keys()) {
  const ib = b + 1;
  packageMetaAlias[
    `fast_tracked_benefits-${ib}_title`
  ] = `fast_tracked_benefits.${b}.title`;
  packageMetaAlias[
    `fast_tracked_benefits-${ib}`
  ] = `fast_tracked_benefits.${b}.name`;
  packageMetaAlias[
    `fast_tracked_benefits-${ib}_description`
  ] = `fast_tracked_benefits.${b}.description`;
  for (const o of Array(3).keys()) {
    packageMetaAlias[
      `fast_tracked_benefits-${ib}_option-${o + 1}`
    ] = `fast_tracked_benefits.${b}.options.${o}`;
  }
}

export class Package extends Post {
  static onCreateQuery(query: QueryBuilder<Package>) {
    const { ref } = this;
    query
      .where(ref('post_type'), 'bfhl_packages')
      .select(ref('ID'), ref('post_title'), ref('post_name'));
  }

  static get columnNameMappers() {
    return new ColumnAlias(
      ['id', 'ID'],
      ['name', 'post_title'],
      ['slug', 'post_name'],
    );
  }

  meta!: PostMeta[];
}
