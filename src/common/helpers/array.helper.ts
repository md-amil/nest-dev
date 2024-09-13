export function pluck<T>(items: T[], key: keyof T, value: keyof T) {
  return items.reduce<Record<string, any>>((record, item) => {
    (record as any)[item[key]] = item[value];
    return record;
  }, {});
}
