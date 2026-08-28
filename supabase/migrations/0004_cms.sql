-- ============================================================
-- TWIST Store — CMS: إعدادات الموقع، البانر، الآراء، المحتوى
-- شغّل هذا الملف بعد 0001 (و 0002 إن أردت البيانات الأولية)
-- ============================================================

-- منتجات مميزة + أيقونة الفئة
alter table public.products
  add column if not exists is_featured boolean not null default false;

alter table public.categories
  add column if not exists icon text;

create index if not exists products_is_featured_idx on public.products (is_featured);

update public.categories set icon = '👕' where slug = 'tshirts' and icon is null;
update public.categories set icon = '🧥' where slug = 'hoodies' and icon is null;
update public.categories set icon = '🥼' where slug = 'uniforms' and icon is null;
update public.categories set icon = '🧢' where slug = 'caps' and icon is null;
update public.categories set icon = '👔' where slug = 'polo' and icon is null;

update public.products
set is_featured = true
where id in (
  select id from public.products order by created_at desc limit 8
);

-- ---------- صور البانر (الصفحة الرئيسية) ----------
create table if not exists public.hero_slides (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  alt_text   text,
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists hero_slides_sort_idx on public.hero_slides (sort_order, created_at);

-- ---------- إعدادات الموقع (صف واحد) ----------
create table if not exists public.site_settings (
  id                         text primary key default 'default',
  shop_name                  text not null default 'TWIST',
  tagline                    text not null default 'تطريز & طباعة',
  logo_url                   text not null default '',
  whatsapp_number            text not null default '',
  contact_phone              text not null default '',
  address                    text not null default '',
  email                      text not null default '',
  instagram_url              text not null default '',
  facebook_url               text not null default '',
  tiktok_url                 text not null default '',
  footer_blurb               text not null default '',
  hero_badge                 text not null default '',
  hero_title                 text not null default '',
  hero_highlight             text not null default '',
  hero_subtitle              text not null default '',
  hero_cta_label             text not null default '',
  hero_cta_href              text not null default '/products',
  hero_secondary_cta_label   text not null default '',
  hero_secondary_cta_href    text not null default '/contact',
  categories_title           text not null default '',
  featured_title             text not null default '',
  featured_subtitle          text not null default '',
  featured_cta               text not null default '',
  gallery_title              text not null default '',
  gallery_subtitle           text not null default '',
  home_about_title           text not null default '',
  home_about_text            text not null default '',
  home_about_bullets         text[] not null default '{}',
  home_about_cta             text not null default '',
  testimonials_title         text not null default '',
  about_title                text not null default '',
  about_paragraphs           text[] not null default '{}',
  about_values               jsonb not null default '[]'::jsonb,
  about_cta_title            text not null default '',
  about_cta_text             text not null default '',
  contact_title              text not null default '',
  contact_intro              text not null default '',
  contact_whatsapp_label     text not null default '',
  contact_success_title      text not null default '',
  contact_success_text       text not null default '',
  products_title             text not null default '',
  products_empty             text not null default '',
  updated_at                 timestamptz not null default now()
);

alter table public.site_settings add column if not exists logo_url text not null default '';
alter table public.site_settings add column if not exists categories_title text not null default '';
alter table public.site_settings add column if not exists featured_cta text not null default '';
alter table public.site_settings add column if not exists home_about_cta text not null default '';
alter table public.site_settings add column if not exists testimonials_title text not null default '';
alter table public.site_settings add column if not exists contact_title text not null default '';
alter table public.site_settings add column if not exists contact_intro text not null default '';
alter table public.site_settings add column if not exists contact_whatsapp_label text not null default '';
alter table public.site_settings add column if not exists contact_success_title text not null default '';
alter table public.site_settings add column if not exists contact_success_text text not null default '';
alter table public.site_settings add column if not exists products_title text not null default '';
alter table public.site_settings add column if not exists products_empty text not null default '';

-- ---------- آراء الزبائن ----------
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  quote      text not null,
  rating     int not null default 5 check (rating between 1 and 5),
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_sort_idx on public.testimonials (sort_order, created_at);

-- ============================================================
-- RLS
-- ============================================================

alter table public.hero_slides    enable row level security;
alter table public.site_settings  enable row level security;
alter table public.testimonials   enable row level security;

drop policy if exists "hero public read" on public.hero_slides;
create policy "hero public read" on public.hero_slides for select
  using (is_active = true or public.is_admin());
drop policy if exists "hero admin write" on public.hero_slides;
create policy "hero admin write" on public.hero_slides for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings for select using (true);
drop policy if exists "settings admin write" on public.site_settings;
create policy "settings admin write" on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "testimonials public read" on public.testimonials;
create policy "testimonials public read" on public.testimonials for select
  using (is_active = true or public.is_admin());
drop policy if exists "testimonials admin write" on public.testimonials;
create policy "testimonials admin write" on public.testimonials for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- التخزين: صور البانر والشعار
-- ============================================================

insert into storage.buckets (id, name, public)
values ('hero', 'hero', true)
on conflict (id) do nothing;

do $$ begin
  create policy "storage hero public read" on storage.objects for select
    using (bucket_id = 'hero');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "storage hero admin insert" on storage.objects for insert
    with check (bucket_id = 'hero' and public.is_admin());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "storage hero admin update" on storage.objects for update
    using (bucket_id = 'hero' and public.is_admin());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "storage hero admin delete" on storage.objects for delete
    using (bucket_id = 'hero' and public.is_admin());
exception when duplicate_object then null;
end $$;

-- ============================================================
-- بيانات أولية (لا تستبدل إعدادات موجودة)
-- ============================================================

insert into public.site_settings (
  id, shop_name, tagline, footer_blurb,
  hero_badge, hero_title, hero_highlight, hero_subtitle,
  hero_cta_label, hero_cta_href, hero_secondary_cta_label, hero_secondary_cta_href,
  categories_title, featured_title, featured_subtitle, featured_cta,
  gallery_title, gallery_subtitle,
  home_about_title, home_about_text, home_about_bullets, home_about_cta,
  testimonials_title, about_title, about_paragraphs, about_values,
  about_cta_title, about_cta_text,
  contact_title, contact_intro, contact_whatsapp_label,
  contact_success_title, contact_success_text,
  products_title, products_empty
) values (
  'default',
  'TWIST',
  'تطريز & طباعة',
  'براند متخصص بالتطريز والطباعة على الملابس. جودة بريميوم، تصاميم مخصصة، وتنفيذ يليق باسمك وشغلك.',
  'تطريز & طباعة بجودة بريميوم',
  'اللبس تصميمك…',
  'بلمسة TWIST',
  'تيشيرتات، هوديز، يونيفورم وقبعات — نطرّز ونطبع فكرتك بأدق التفاصيل وبخامات تدوم. لأن مظهرك يستاهل الأفضل.',
  'تسوّق الآن',
  '/products',
  'اطلب تصميم خاص',
  '/contact',
  'تسوّق حسب الفئة',
  'منتجات مميزة',
  'أحدث إضافاتنا — قطع مختارة بعناية جاهزة للتخصيص باسمك أو شعارك',
  'عرض كل المنتجات',
  'من أعمالنا',
  'لقطات حقيقية من تنفيذنا — تطريز وطباعة بأعلى دقة',
  'ليش TWIST؟',
  'نحنا مش بس مطبعة — نحنا ورشة إبداع. من اختيار الخامة، لتنفيذ التطريز غرزة بغرزة، لطباعة تثبت بوجه الغسيل والزمن. كل قطعة بتطلع من عنا لازم تليق باسمنا واسمك.',
  array['خامات مختارة بعناية','تطريز وطباعة بأحدث المعدات','تصاميم مخصصة حسب طلبك','تسليم سريع والتزام بالمواعيد'],
  'اعرف أكثر عنا',
  'شو حكوا عنا',
  'قصة TWIST',
  array[
    'بدأنا TWIST من شغف بسيط: نحوّل الأفكار لقطع ملابس تحكي عن أصحابها. اليوم صرنا وجهة لكل من يريد تيشيرت بلمسة شخصية، هودي بشعار فريقه، أو يونيفورم يعكس هوية شركته.',
    'نجمع بين حرفية التطريز التقليدي ودقة الطباعة الحديثة، ونشتغل مع الأفراد والشركات والفرق — من قطعة واحدة لمئات القطع، بنفس المستوى من الاهتمام والجودة.'
  ],
  '[
    {"icon":"🧵","title":"حرفية بكل غرزة","text":"التطريز عنا فن. ماكينات حديثة وأيادي خبيرة تتعامل مع كل قطعة كأنها الوحيدة."},
    {"icon":"🎨","title":"طباعة تدوم","text":"أحبار عالية الجودة وتقنيات طباعة تقاوم الغسيل والاستخدام اليومي دون بهتان."},
    {"icon":"⚡","title":"سرعة والتزام","text":"مواعيد واضحة من أول يوم، وتسليم بالوقت المتفق عليه — لأن وقتك يهمنا."},
    {"icon":"💎","title":"خامات بريميوم","text":"نختار الأقمشة والخامات بعناية لتحصل على قطعة تفتخر بلبسها وإهدائها."}
  ]'::jsonb,
  'عندك فكرة؟ خلينا ننفذها سوا',
  'سواء كانت قطعة واحدة أو طلبية كاملة لشركتك — احكيلنا شو ببالك',
  'تواصل معنا',
  'عندك استفسار، طلب خاص، أو مشروع لشركتك؟ اترك رسالتك وسنرد عليك بأقرب وقت — أو راسلنا مباشرة على واتساب.',
  'واتساب مباشر',
  'وصلتنا رسالتك!',
  'سنتواصل معك بأقرب وقت ممكن.',
  'كل المنتجات',
  'لا توجد منتجات مطابقة للفلاتر الحالية'
)
on conflict (id) do nothing;

insert into public.hero_slides (image_url, alt_text, sort_order)
select v.image_url, v.alt_text, v.sort_order
from (
  values
    ('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1920&q=80', 'طباعة تيشيرتات', 0),
    ('https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1920&q=80', 'هودي بتطريز فاخر', 1),
    ('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1920&q=80', 'تشكيلة ملابس جاهزة للتخصيص', 2),
    ('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1920&q=80', 'بولو شركات', 3)
) as v(image_url, alt_text, sort_order)
where not exists (select 1 from public.hero_slides);

insert into public.testimonials (name, quote, rating, sort_order)
select v.name, v.quote, v.rating, v.sort_order
from (
  values
    ('أحمد س.', 'طلبت يونيفورم كامل لفريق العمل — التطريز نظيف والخامة ممتازة. تعامل راقي وسرعة بالتسليم.', 5, 0),
    ('ليان م.', 'صممت هودي خاص فيني وطلع أحلى من المتوقع بكثير. الألوان ثابتة حتى بعد الغسيل.', 5, 1),
    ('شركة نواة', 'شريكنا الدائم لطباعة تيشيرتات الفعاليات. جودة ثابتة والتزام بالمواعيد بكل مرة.', 5, 2)
) as v(name, quote, rating, sort_order)
where not exists (select 1 from public.testimonials);
