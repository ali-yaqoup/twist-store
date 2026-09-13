-- Reset banner zoom so previews aren't stuck zoomed-in by default.
-- Run on Supabase SQL Editor after 0012.

alter table public.hero_slides
  alter column zoom set default 1,
  alter column wide_zoom set default 1;

update public.hero_slides
set
  zoom = 1,
  wide_zoom = 1
where coalesce(zoom, 1.35) >= 1.34
  and coalesce(wide_zoom, 1.35) >= 1.34
  and coalesce(focus_x, 50) = 50
  and coalesce(focus_y, 50) = 50
  and coalesce(wide_focus_x, 50) = 50
  and coalesce(wide_focus_y, 50) = 50;
