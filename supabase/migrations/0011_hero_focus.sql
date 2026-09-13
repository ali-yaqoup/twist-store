-- ============================================================
-- قص البنر: نقطة تركيز الصورة (object-position)
-- شغّل على Supabase SQL Editor
-- ============================================================

alter table public.hero_slides
  add column if not exists focus_x double precision not null default 50,
  add column if not exists focus_y double precision not null default 50,
  add column if not exists wide_focus_x double precision not null default 50,
  add column if not exists wide_focus_y double precision not null default 50;
