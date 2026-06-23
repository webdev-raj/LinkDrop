import { supabase } from './supabase';

export function generateSlug(name) {
  const base = name
    ? name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)
    : 'page';
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export async function savePage(data) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const slug = generateSlug(data.name);
  const { error } = await supabase.from('pages').insert({ slug, data });

  if (error?.code === '23505') {
    const retrySlug = generateSlug(data.name);
    const { error: retryError } = await supabase
      .from('pages')
      .insert({ slug: retrySlug, data });
    if (retryError) throw new Error(retryError.message);
    return retrySlug;
  }

  if (error) throw new Error(error.message);
  return slug;
}

export async function fetchPage(slug) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('pages')
    .select('data, views')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

export async function incrementViews(slug) {
  if (!supabase) return;

  const { error } = await supabase.rpc('increment_views', { page_slug: slug });

  if (error && process.env.NODE_ENV === 'development') {
    console.warn('[LinkDrop] incrementViews failed:', error.message);
  }
}
