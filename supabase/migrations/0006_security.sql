-- ============================================================
-- TWIST Store — قيود أمنية: أطوال الحقول، أسعار الطلب، حدود الرفع
-- شغّل بعد 0001–0005
-- ============================================================

-- ---------- حدود النصوص والكميات ----------
do $$ begin
  alter table public.orders add constraint orders_name_len
    check (char_length(customer_name) between 2 and 80);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.orders add constraint orders_phone_len
    check (char_length(customer_phone) between 8 and 30);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.orders add constraint orders_address_len
    check (char_length(customer_address) between 5 and 200);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.orders add constraint orders_notes_len
    check (notes is null or char_length(notes) <= 500);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.order_items add constraint order_items_qty_max
    check (quantity > 0 and quantity <= 20);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.order_items add constraint order_items_note_len
    check (note is null or char_length(note) <= 300);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.contact_messages add constraint contact_name_len
    check (char_length(name) between 2 and 80);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.contact_messages add constraint contact_phone_len
    check (char_length(phone) between 8 and 30);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.contact_messages add constraint contact_message_len
    check (char_length(message) between 5 and 2000);
exception when duplicate_object then null;
end $$;

-- الزائر لا يقدر يحقن حالة غير pending
drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert" on public.orders for insert
  with check (status = 'pending');

create or replace function public.order_accepts_items(oid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.orders
    where id = oid and status = 'pending'
  );
$$;

drop policy if exists "order_items public insert" on public.order_items;
create policy "order_items public insert" on public.order_items for insert
  with check (public.order_accepts_items(order_id));

-- ---------- فرض سعر المنتج على بند الطلب ----------
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

  -- Allow detaching products from order lines (ON DELETE SET NULL / admin delete).
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

drop trigger if exists order_items_enforce_price on public.order_items;
create trigger order_items_enforce_price
  before insert or update of product_id, quantity, price_at_order
  on public.order_items
  for each row
  execute procedure public.enforce_order_item_price();

create or replace function public.recalc_order_total()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  oid uuid;
begin
  oid := coalesce(new.order_id, old.order_id);
  update public.orders
  set total_price = coalesce((
    select sum(price_at_order * quantity)
    from public.order_items
    where order_id = oid
  ), 0)
  where id = oid;
  return coalesce(new, old);
end;
$$;

drop trigger if exists order_items_recalc_total on public.order_items;
create trigger order_items_recalc_total
  after insert or update or delete
  on public.order_items
  for each row
  execute procedure public.recalc_order_total();

-- ---------- حدود دلاء التخزين ----------
update storage.buckets
set
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id in ('products', 'gallery', 'designs', 'hero');

drop policy if exists "storage designs public insert" on storage.objects;
create policy "storage designs public insert" on storage.objects for insert
  with check (
    bucket_id = 'designs'
    and lower(coalesce(storage.extension(name), '')) in ('jpg', 'jpeg', 'png', 'webp')
  );
