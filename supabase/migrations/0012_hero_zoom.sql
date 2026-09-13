-- ============================================================
-- قص البنر: تكبير (zoom) عشان التحريك يشتغل بكل الاتجاهات
-- شغّل على Supabase SQL Editor
-- ============================================================

alter table public.hero_slides
  add column if not exists zoom double precision not null default 1,
  add column if not exists wide_zoom double precision not null default 1;
