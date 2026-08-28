-- ============================================================
-- TWIST Store — تصميم الزبون + دلو التصاميم
-- شغّل هذا الملف إذا سبق ونفّذت 0001 قبل إضافة design_url
-- ============================================================

alter table public.order_items
  add column if not exists design_url text;

insert into storage.buckets (id, name, public)
values ('designs', 'designs', true)
on conflict (id) do nothing;

do $$ begin
  create policy "storage designs public read" on storage.objects for select
    using (bucket_id = 'designs');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "storage designs public insert" on storage.objects for insert
    with check (bucket_id = 'designs');
exception when duplicate_object then null;
end $$;
