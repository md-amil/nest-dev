export { unserialize } from 'locutus/php/var';

/**
 * Returns the php inspired serialized representation of the value.
 *
 * It's a temporary modified workaround for serializing the data in
 * the PHP inspired serialization format. The discussion is in
 * continuation to fix a bug [https://github.com/locutusjs/locutus/issues/460]
 * in a library once that is resolved then we can directly use the
 * library and eliminate the method.
 *
 * @see   https://github.com/locutusjs/locutus/blob/master/src/php/var/serialize.js
 * @param mixedValue
 *
 * @returns {string}
 */
export function serialize(mixedValue: unknown): string {
  let val, key, okey;
  let ktype = '';
  let vals = '';
  let count = 0;
  const _utf8Size = (str) => ~-encodeURI(str).split(/%..|./).length;

  const _getType = function (inp) {
    let match;
    let key;
    let cons;
    let types;
    let type = typeof inp;
    if (type === 'object' && !inp) return 'null';
    if (!isNaN(inp) && inp.toString().indexOf('.') != -1) return 'number';
    if (type === 'object') {
      if (!inp.constructor) return 'object';

      cons = inp.constructor.toString();
      match = cons.match(/(\w+)\(/);

      if (match) cons = match[1].toLowerCase();

      types = ['boolean', 'number', 'string', 'array'];
      for (key in types) {
        if (cons === types[key]) {
          type = types[key];
          break;
        }
      }
    }

    return type;
  };

  const type = _getType(mixedValue);
  switch (type) {
    case 'function':
      val = '';
      break;
    case 'boolean':
      val = 'b:' + (mixedValue ? '1' : '0');
      break;
    case 'number':
      val =
        (Math.round(mixedValue as number) === mixedValue ? 'i' : 'd') +
        ':' +
        parseFloat(mixedValue as string);
      break;
    case 'string':
      val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"';
      break;
    case 'object':
      val = 'a';
      for (key in mixedValue as Record<string, unknown>) {
        if (mixedValue.hasOwnProperty(key)) {
          ktype = _getType(mixedValue[key]);
          if (ktype === 'function') {
            continue;
          }
          okey = key.match(/^[0-9]+$/) ? parseInt(key, 10) : key;
          vals += serialize(okey) + serialize(mixedValue[key]);
          count++;
        }
      }
      val += ':' + count + ':{' + vals + '}';
      break;
    case 'undefined':
    default:
      // Fall-through
      // if the JS object has a property which contains a null value,
      // the string cannot be unserialized by PHP
      val = 'N';
      break;
  }

  if (type !== 'object') val += ';';

  return val;
}
