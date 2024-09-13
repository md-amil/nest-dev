export {};

export function nested(data: any, fields: string[], sep = '_') {
  for (const field of fields) {
    const sub = {};
    for (const [key, val] of Object.entries(data)) {
      const rest = restKey(field + sep, key);
      if (!rest) {
        continue;
      }
      delete data[key];
      sub[rest] = val;
    }
    data[field] = sub;
  }
  return data;
}

function restKey(field: string, key: string) {
  if (!key.startsWith(field)) {
    return null;
  }
  return key.replace(field, '');
}

export function castTo<T = any>(
  obj: any,
  casts: Record<string, (c: any, o: T) => any>,
) {
  for (const [key, callback] of Object.entries(casts)) {
    if (!(key in obj)) {
      continue;
    }
    obj[key] = callback(obj[key], obj);
  }
}
