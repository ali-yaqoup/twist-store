-- ============================================================
-- TWIST Store — Initial schema
-- شغّل هذا الملف في Supabase SQL Editor أو عبر supabase db push
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- الفئات ----------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  image_url  text,
  created_at timestamptz not null default now()
);

-- ---------- المنتجات ----------
create table if not exists public.products (
  id                        uuid primary key default gen_random_uuid(),
  name                      text not null,
  description               text,
  price                     numeric(10,2) not null check (price >= 0),
  category_id               uuid references public.categories(id) on delete set null,
  images                    text[] not null default '{}',
  sizes                     text[] not null default '{}',
  colors                    text[] not null default '{}',
  embroidery_or_print_type  text not null default 'both'
                            check (embroidery_or_print_type in ('embroidery','print','both')),
  is_active                 boolean not null default true,
  created_at                timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_is_active_idx   on public.products (is_active);

-- ---------- الطلبات ----------
do $$ begin
  create type public.order_status as enum
    ('pending','in_progress','ready','delivered','cancelled');
exception when duplicate_object then null;
end $$;

create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  customer_name    text not null,
  customer_phone   text not null,
  customer_address text not null,
  notes            text,
  status           public.order_status not null default 'pending',
  total_price      numeric(10,2) not null default 0,
  created_at       timestamptz not null default now()
);

create index if not exists orders_status_idx     on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  product_id     uuid references public.products(id) on delete set null,
  quantity       int not null check (quantity > 0),
  selected_size  text,
  selected_color text,
  service_type   text check (service_type in ('embroidery','print')),
  note           text,
  design_url     text,
  price_at_order numeric(10,2) not null,
  created_at     timestamptz not null default now()
);

create index if not exists order_items_order_id_idx   on public.order_items (order_id);
create index if not exists order_items_product_id_idx on public.order_items (product_id);

-- ---------- معرض الأعمال ----------
create table if not exists public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  caption    text,
  created_at timestamptz not null default now()
);

-- ---------- رسائل التواصل ----------
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- الأدمن ----------
create table if not exists public.admins (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- دالة تتحقق أن المستخدم الحالي أدمن (security definer لتجاوز RLS على admins)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.gallery_images   enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admins           enable row level security;

-- الفئات: قراءة للجميع، تعديل للأدمن
drop policy if exists "categories public read" on public.categories;
create policy "categories public read"  on public.categories for select using (true);
drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write"  on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- المنتجات: قراءة الفعّال للجميع، وكل شيء للأدمن
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select
  using (is_active = true or public.is_admin());
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- الطلبات: أي زائر ينشئ طلب، الأدمن فقط يقرأ ويعدّل
drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert" on public.orders for insert with check (true);
drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read"    on public.orders for select using (public.is_admin());
drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update"  on public.orders for update
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete"  on public.orders for delete using (public.is_admin());

drop policy if exists "order_items public insert" on public.order_items;
create policy "order_items public insert" on public.order_items for insert with check (true);
drop policy if exists "order_items admin read" on public.order_items;
create policy "order_items admin read"    on public.order_items for select using (public.is_admin());
drop policy if exists "order_items admin delete" on public.order_items;
create policy "order_items admin delete"  on public.order_items for delete using (public.is_admin());

-- معرض الأعمال: قراءة للجميع، تعديل للأدمن
drop policy if exists "gallery public read" on public.gallery_images;
create policy "gallery public read" on public.gallery_images for select using (true);
drop policy if exists "gallery admin write" on public.gallery_images;
create policy "gallery admin write" on public.gallery_images for all
  using (public.is_admin()) with check (public.is_admin());

-- رسائل التواصل: أي زائر يرسل، الأدمن يقرأ ويعدّل
drop policy if exists "messages public insert" on public.contact_messages;
create policy "messages public insert" on public.contact_messages for insert with check (true);
drop policy if exists "messages admin read" on public.contact_messages;
create policy "messages admin read"    on public.contact_messages for select using (public.is_admin());
drop policy if exists "messages admin update" on public.contact_messages;
create policy "messages admin update"  on public.contact_messages for update
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "messages admin delete" on public.contact_messages;
create policy "messages admin delete"  on public.contact_messages for delete using (public.is_admin());

-- جدول الأدمن: الأدمن فقط يقرأه
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins for select using (public.is_admin());

-- ============================================================
-- التخزين (Storage): صور المنتجات ومعرض الأعمال
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('products', 'products', true),
  ('gallery', 'gallery', true),
  ('designs', 'designs', true)
on conflict (id) do nothing;

drop policy if exists "storage public read" on storage.objects;
create policy "storage public read" on storage.objects for select
  using (bucket_id in ('products','gallery','designs'));

drop policy if exists "storage admin insert" on storage.objects;
create policy "storage admin insert" on storage.objects for insert
  with check (bucket_id in ('products','gallery') and public.is_admin());

drop policy if exists "storage admin update" on storage.objects;
create policy "storage admin update" on storage.objects for update
  using (bucket_id in ('products','gallery') and public.is_admin());

drop policy if exists "storage admin delete" on storage.objects;
create policy "storage admin delete" on storage.objects for delete
  using (bucket_id in ('products','gallery','designs') and public.is_admin());

-- الزبون يرفع تصميمه الخاص عند إضافة المنتج للسلة
drop policy if exists "storage designs public insert" on storage.objects;
create policy "storage designs public insert" on storage.objects for insert
  with check (bucket_id = 'designs');
