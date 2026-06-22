import { encodePageData, decodePageData, expandData } from './encode';

describe('encode', () => {
  const sample = {
    name: 'Maya Chen',
    bio: 'Photographer',
    theme: 'dark',
    buttonStyle: 'glass',
    bgMedia: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    links: [
      { type: 'instagram', label: 'Photos', url: 'instagram.com/maya' },
      { type: 'youtube', label: 'Videos', url: 'youtube.com/maya' },
    ],
  };

  test('roundtrips compact v2 format', () => {
    const encoded = encodePageData(sample);
    expect(encoded.startsWith('2.')).toBe(true);
    const decoded = decodePageData(`#${encoded}`);
    expect(decoded.name).toBe(sample.name);
    expect(decoded.bgMedia).toBe(sample.bgMedia);
    expect(decoded.links).toHaveLength(2);
  });

  test('v2 links are much shorter than legacy with embedded image', () => {
    const heavy = {
      ...sample,
      bgMedia: `data:image/png;base64,${'A'.repeat(50000)}`,
    };
    const v2 = encodePageData(sample);
    const legacy = btoa(unescape(encodeURIComponent(JSON.stringify(heavy))));
    expect(v2.length).toBeLessThan(legacy.length / 10);
  });

  test('decodes legacy base64 URLs', () => {
    const legacy = btoa(unescape(encodeURIComponent(JSON.stringify({ name: 'Raj', theme: 'warm', links: [] }))));
    const decoded = decodePageData(`#${legacy}`);
    expect(decoded.name).toBe('Raj');
    expect(decoded.theme).toBe('warm');
  });

  test('expandData handles compact keys', () => {
    const data = expandData({ n: 'Test', l: [{ t: 'github', u: 'github.com/x' }] });
    expect(data.name).toBe('Test');
    expect(data.links[0].type).toBe('github');
  });
});
