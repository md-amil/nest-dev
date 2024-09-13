import { ColumnNameMappers, Pojo } from 'objection';

export type Alias = [string, string];

export class ColumnAlias implements ColumnNameMappers {
  readonly #toDatabase: Pojo;
  readonly #toCode: Pojo;
  constructor(...alias: Alias[]) {
    this.#toDatabase = alias.reduce<Pojo>((json, [name, col]) => {
      json[name] = col;
      return json;
    }, {});
    this.#toCode = alias.reduce<Pojo>((json, [name, col]) => {
      json[col] = name;
      return json;
    }, {});
  }
  parse(json: Pojo): Pojo {
    return Object.entries(json).reduce<Pojo>((data, [key, val]) => {
      data[this.toCode(key)] = val;
      return data;
    }, {});
  }
  format(json: Pojo): Pojo {
    return Object.entries(json).reduce<Pojo>((data, [key, val]) => {
      data[this.toDatabase(key)] = val;
      return data;
    }, {});
  }
  toCode(col: string) {
    if (!(col in this.#toCode)) {
      return col;
    }
    return this.#toCode[col];
  }
  toDatabase(col: string) {
    if (!(col in this.#toDatabase)) {
      return col;
    }
    return this.#toDatabase[col];
  }
}
