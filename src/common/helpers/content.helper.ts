import linkifyHtml from 'linkifyjs/lib/linkify-html';
import { themeContentWidth } from '../../config/app';
import { createMD5Hash } from './crypto.helper';
import { serialize } from './serializer.helper';

export function render(content: string, obj: Record<string, unknown> = {}) {
  return linkifyHtml(renderBlock(renderEmbed(replaceAmp(content), obj)), {
    target: '_blank',
  });
}

function renderEmbed(content: string, obj: Record<string, unknown>) {
  // Do not perform the embedding operation on translated variants as the regex
  // below consumes too much CPU which will lead the pod to crash.
  if (obj._locale) return content;

  const regex =
    /^\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/?)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\)){0,}(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s\!()\[\]{};:\'\"\.\,<>?«»“”‘’]){0,})$/gm;
  return content.replace(regex, function (url) {
    const width = themeContentWidth;

    /** @see https://github.com/locutusjs/locutus/issues/460 */
    let height: number | string = Math.ceil(width * 1.5).toFixed(1);
    if (parseInt(height) > 1000) height = 1000;

    const key = url + serialize({ width, height });
    const keysuffix = createMD5Hash(key);
    return (obj[`_oembed_${keysuffix}`] as string) ?? url;
  });
}

function renderBlock(content: string) {
  let out = '';
  for (let line of content.split('\r\n')) {
    if (!line) {
      continue;
    }
    if (hasPara(line)) {
      line = `<p>${line}</p>`;
    }
    out += line;
  }
  return out;
}

const blockTag = ['span', 'strong'];

function hasPara(line: string) {
  if (line.trim().match(/^[A-z0-9]/)) {
    return true;
  }
  if (
    blockTag.some((x) => line.startsWith(`<${x}`) && line.endsWith(`/${x}>`))
  ) {
    return true;
  }
  return false;
}

function replaceAmp(content: string) {
  return content.split('&amp;').join('&');
}
