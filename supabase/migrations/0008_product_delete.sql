-- ============================================================
-- إصلاح حذف المنتجات المرتبطة ببنود طلبات
-- ON DELETE SET NULL يحتاج صلاحية UPDATE على order_items
-- شغّل هذا الملف على مشروع Supabase (SQL Editor أو CLI)
-- ============================================================

drop policy if exists "order_items admin update" on public.order_items;
create policy "order_items admin update" on public.order_items
  for update
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.admin_delete_product(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update public.order_items
  set product_id = null
  where product_id = p_id;

  delete from public.products
  where id = p_id;
end;
$$;

revoke all on function public.admin_delete_product(uuid) from public;
grant execute on function public.admin_delete_product(uuid) to authenticated;
