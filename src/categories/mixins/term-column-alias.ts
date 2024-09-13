import { Model } from 'objection';
import { ColumnAlias } from 'src/common/modifiers/column-alias';
import { Constructable } from 'src/common/types';

export function TermColumnAlias<B extends typeof Model>(Base: B) {
  return (<I extends Constructable<Model>>(Instance: I) => {
    return class extends Instance {
      static get columnNameMappers() {
        return new ColumnAlias(['id', 'term_id']);
      }
    };
  })(Base);
}
