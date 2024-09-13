import { ColumnNameMappers, Pojo } from 'objection';

export function mergeMappers(
  ...mappers: ColumnNameMappers[]
): ColumnNameMappers {
  return {
    parse(data: Pojo) {
      for (const mapper of mappers) {
        data = mapper.parse(data);
      }
      return data;
    },
    format(data: Pojo) {
      for (const mapper of mappers) {
        data = mapper.format(data);
      }
      return data;
    },
  };
}
