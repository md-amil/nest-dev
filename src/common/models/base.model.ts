import { NotFoundException } from '@nestjs/common';
import {
  ColumnNameMappers,
  Model as BaseModel,
  OrderByDirection,
  Page,
  QueryBuilder,
} from 'objection';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { ColumnAlias } from '../modifiers/column-alias';
import visibilityPlugin from 'objection-visibility';
import { toArray } from '../helpers/query.helper';

function mapColumns(cols: string[], mapper: ColumnNameMappers) {
  if (!(mapper instanceof ColumnAlias)) {
    return cols;
  }
  return cols.map((col) => mapper.toDatabase(col));
}

export interface RequestQuery {
  _exclude?: Record<string, string | string[]>;
  _fetch?: string;
  '_fetch:add'?: string;
  _select?: string;
  '_select:add'?: string;
  _limit?: string;
  _sort?: string;
}

type OptionKeys = keyof RequestQuery;

export interface RequestQueryOption {
  only?: OptionKeys[];
  except?: OptionKeys[];
}

export class AppQueryBuilder<M extends BaseModel, R = M[]> extends QueryBuilder<
  M,
  R
> {
  ArrayQueryBuilderType!: AppQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: AppQueryBuilder<M, M>;
  MaybeSingleQueryBuilderType!: AppQueryBuilder<M, M | undefined>;
  NumberQueryBuilderType!: AppQueryBuilder<M, number>;
  PageQueryBuilderType!: AppQueryBuilder<M, Page<M>>;

  withRequestQuery(req: RequestQuery, opt: RequestQueryOption = {}) {
    const mapper = this.modelClass().columnNameMappers;
    if (opt.except) {
      req = omit(req, opt.except);
    }
    if (opt.only) {
      req = pick(req, opt.only);
    }
    if (req['_select:add']) {
      this.select(...mapColumns(req['_select:add'].split(','), mapper));
    }
    if (req._select) {
      this.clearSelect().select(...mapColumns(req._select.split(','), mapper));
    }
    if (req._fetch === '') {
      this.clearWithGraph();
    } else if (req._fetch) {
      this.clearWithGraph();
      for (const f of req._fetch.split(',')) {
        this.withGraphFetched(f);
      }
    }
    if (req['_fetch:add']) {
      for (const f of req['_fetch:add'].split(',')) {
        this.withGraphFetched(f);
      }
    }
    if (req._limit) {
      this.limit(Number(req._limit));
    }
    if (req._sort) {
      this.clearOrder();
      for (let field of req._sort.split(',')) {
        let sort: OrderByDirection = 'asc';
        if (field.startsWith('-')) {
          sort = 'desc';
          field = field.substring(1);
        }
        this.orderBy(field, sort);
      }
    }
    if (req._exclude) {
      for (const [field, value] of Object.entries(req._exclude)) {
        this.whereNotIn(field, toArray(value));
      }
    }
    return this;
  }
}

export class Model extends visibilityPlugin(BaseModel) {
  QueryBuilderType!: AppQueryBuilder<this>;
  static QueryBuilder = AppQueryBuilder;

  static get useLimitInFirst() {
    return true;
  }

  static createNotFoundError() {
    return new NotFoundException(`${this.name} not found.`);
  }
}
