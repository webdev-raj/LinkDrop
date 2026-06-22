import LZString from 'lz-string';

const FORMAT_PREFIX = '2.';

function compactData(data) {
  const out = {};

  if (data.name) out.n = data.name;
  if (data.bio) out.b = data.bio;
  if (data.theme && data.theme !== 'dark') out.t = data.theme;
  if (data.buttonStyle && data.buttonStyle !== 'solid') out.bs = data.buttonStyle;
  if (data.bgMedia) out.bg = data.bgMedia;

  const links = (data.links || [])
    .filter((l) => l.url || l.label)
    .map((l) => {
      const link = {};
      if (l.type && l.type !== 'other') link.t = l.type;
      if (l.label) link.l = l.label;
      if (l.url) link.u = l.url;
      return link;
    });

  if (links.length) out.l = links;

  return out;
}

export function expandData(compact) {
  if (!compact || typeof compact !== 'object') return null;

  return {
    name: compact.n || compact.name || '',
    bio: compact.b || compact.bio || '',
    theme: compact.t || compact.theme || 'dark',
    buttonStyle: compact.bs || compact.buttonStyle || 'solid',
    bgMedia: compact.bg || compact.bgMedia || null,
    links: (compact.l || compact.links || []).map((l) => ({
      type: l.t || l.type || 'other',
      label: l.l || l.label || '',
      url: l.u || l.url || '',
    })),
  };
}

export function encodePageData(data) {
  try {
    const compact = compactData(data);
    const json = JSON.stringify(compact);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return `${FORMAT_PREFIX}${compressed}`;
  } catch {
    return '';
  }
}

export function decodePageData(hash) {
  try {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!raw) return null;

    if (raw.startsWith(FORMAT_PREFIX)) {
      const payload = raw.slice(FORMAT_PREFIX.length);
      const json = LZString.decompressFromEncodedURIComponent(payload);
      if (!json) return null;
      return expandData(JSON.parse(json));
    }

    const legacy = JSON.parse(decodeURIComponent(escape(atob(raw))));
    return expandData(legacy);
  } catch {
    return null;
  }
}

export function buildShareUrl(data) {
  const encoded = encodePageData(data);
  return `${window.location.origin}/p#${encoded}`;
}

export function getShareUrlLength(data) {
  return buildShareUrl(data).length;
}
