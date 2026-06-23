-- Run in Supabase SQL Editor (full setup)

create table if not exists pages (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  data jsonb not null,
  created_at timestamptz default now(),
  views integer default 0
);

alter table pages enable row level security;

-- Drop existing policies if re-running
drop policy if exists "public read" on pages;
drop policy if exists "public insert" on pages;

create policy "public read" on pages
  for select using (true);

create policy "public insert" on pages
  for insert with check (true);

-- SECURITY DEFINER bypasses RLS so anon can increment views via RPC only
create or replace function increment_views(page_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update pages
  set views = views + 1
  where slug = page_slug;
end;
$$;

grant execute on function increment_views(text) to anon;
grant execute on function increment_views(text) to authenticated;
