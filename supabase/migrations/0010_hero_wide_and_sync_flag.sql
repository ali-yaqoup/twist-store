-- ============================================================
-- بنر الواجهة: عمود الصورة العريضة + علم مزامنة لمرة واحدة
-- شغّل على Supabase SQL Editor
-- ============================================================

alter table public.hero_slides
  add column if not exists wide_image_url text;

alter table public.site_settings
  add column if not exists storefront_hero_synced boolean not null default false;
