import set from 'lodash/set';
export interface MetaOption {
  key?: string;
  value?: string;
  alias?: Record<string, string>;
  cast?: Record<string, (value: any) => any>;
  nested?: string;
}

export function attachMeta<
  T extends { meta: U[] },
  U extends Record<string, any>,
>(data: T | T[], option: MetaOption = {}) {
  if (Array.isArray(data)) {
    return data.map((row) => attachMeta(row, option));
  }
  // temporary
  if (!data.meta) {
    return data;
  }
  const { meta, ...row } = data;
  const { key = 'meta_key', value = 'meta_value', alias, cast } = option;
  if (cast) {
    meta.forEach((row) => {
      if (row[key] in cast) {
        (row as any)[value] = cast[row[key]](row[value]);
      }
    });
  }
  if (!alias) {
    return meta.reduce((record, item) => {
      record[item[key]] = item[value];
      return record;
    }, row);
  }
  return meta.reduce((record, item) => {
    const field = alias[item[key]] ?? item[key];
    return set(record, field, item[value]);
  }, row);
}
