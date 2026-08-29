-- ============================================================
-- TWIST Store — صور الفئات (الصفحة الرئيسية)
-- شغّل هذا الملف بعد 0004_cms.sql
-- ============================================================

alter table public.categories
  add column if not exists image_url text;

-- صور ستوديو موحّدة الإطار (3:4) — يمكن تغييرها لاحقاً من لوحة التحكم
update public.categories
set image_url = 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop'
where slug = 'tshirts' and (image_url is null or image_url = '');

update public.categories
set image_url = 'https://images.unsplash.com/photo-1499971442178-8c10fdf5f6ac?auto=format&fit=crop&w=900&h=1200&q=80'
where slug = 'hoodies' and (image_url is null or image_url = '');

update public.categories
set image_url = 'https://images.unsplash.com/photo-1579664531470-ac357f8f8e2b?auto=format&fit=crop&w=900&h=1200&q=80'
where slug = 'uniforms' and (image_url is null or image_url = '');

update public.categories
set image_url = 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&h=1200&q=80'
where slug = 'caps' and (image_url is null or image_url = '');

update public.categories
set image_url = 'https://images.unsplash.com/photo-1625910513413-c23b8bb81cba?auto=format&fit=crop&w=900&h=1200&q=80'
where slug = 'polo' and (image_url is null or image_url = '');
