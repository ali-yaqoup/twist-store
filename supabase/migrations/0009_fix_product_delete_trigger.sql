-- ============================================================
-- إصلاح حذف المنتجات: تريغر الأسعار كان يرفض product_id = null
-- (ON DELETE SET NULL يفشل → تعذر حذف أي منتج مربوط بطلب)
-- شغّل على Supabase SQL Editor
-- ============================================================

create or replace function public.enforce_order_item_price()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  p numeric;
begin
  if new.quantity < 1 or new.quantity > 20 then
    raise exception 'invalid quantity';
  end if;

  -- Allow detaching a product from an order line (product delete / SET NULL).
  if new.product_id is null then
    return new;
  end if;

  select price into p
  from public.products
  where id = new.product_id and is_active = true;

  if p is null then
    raise exception 'invalid product';
  end if;

  new.price_at_order := p;
  return new;
end;
$$;

-- Ensure order_items can be updated by admins (needed for SET NULL path).
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
  if auth.uid() is null or not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update public.order_items
  set product_id = null
  where product_id = p_id;

  delete from public.products
  where id = p_id;

  if not found then
    raise exception 'product not found';
  end if;
end;
$$;

revoke all on function public.admin_delete_product(uuid) from public;
grant execute on function public.admin_delete_product(uuid) to authenticated;
