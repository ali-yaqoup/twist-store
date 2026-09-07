-- ============================================================
-- ربط صلاحية الأدمن بـ auth.uid() بدل الإيميل وحده
-- يمنع ترقية حساب عادي إذا غيّر إيميله لإيميل موجود في admins
-- شغّل بعد 0006_security.sql
-- ============================================================

alter table public.admins
  add column if not exists user_id uuid unique;

update public.admins a
set user_id = u.id
from auth.users u
where a.user_id is null
  and lower(a.email) = lower(u.email);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where (user_id is not null and user_id = auth.uid())
       or (
         user_id is null
         and coalesce(auth.jwt() ->> 'email', '') <> ''
         and lower(email) = lower(auth.jwt() ->> 'email')
       )
  );
$$;

create or replace function public.claim_admin_identity()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  update public.admins
  set user_id = auth.uid()
  where user_id is null
    and coalesce(auth.jwt() ->> 'email', '') <> ''
    and lower(email) = lower(auth.jwt() ->> 'email');
end;
$$;

revoke all on function public.claim_admin_identity() from public;
grant execute on function public.claim_admin_identity() to authenticated;
