import { Model, QueryBuilder } from 'objection';

export interface PaginateOption {
  page?: string;
  size?: string;
}

export type Paginate<T extends Model> = ReturnType<typeof paginate<T>>;
export async function paginate<T extends Model>(
  opt: PaginateOption,
  builder: QueryBuilder<T>,
) {
  const size = Math.min(Number(opt.size || 10), 50);
  const page = Number(opt.page || 1);
  const data = await builder.page(page - 1, size);
  return {
    ...data,
    page,
    size,
    pages: Math.ceil(data.total / size),
  };
}

export function withRequestQuery<T extends Model>(
  req: Record<string, any>,
  builder: QueryBuilder<T>,
) {
  if (req.select) {
    builder.select(...(req.query.select as string).split(','));
  }
  if (req.fetch) {
    for (const f of req.fetch.split(',')) {
      builder.withGraphFetched(f);
    }
  }
  return builder;
}

export function toArray<T>(v: T | T[]): T[] {
  if (Array.isArray(v)) {
    return v;
  }
  return [v];
}
