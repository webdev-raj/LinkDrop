-- Run this in Supabase SQL Editor if views stay at 0
-- Cause: RLS blocks UPDATE unless the function uses SECURITY DEFINER

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
