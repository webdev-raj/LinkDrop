import { generateSlug } from './slugify';

describe('slugify', () => {
  test('generateSlug produces lowercase slug with suffix', () => {
    const slug = generateSlug('Maya Chen');
    expect(slug).toMatch(/^maya[a-z0-9]*-[a-z0-9]{4}$/);
  });

  test('generateSlug falls back to page prefix', () => {
    const slug = generateSlug('');
    expect(slug.startsWith('page-')).toBe(true);
  });
});
