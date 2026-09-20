-- Allow authenticated admins to receive live INSERT/UPDATE events for orders.
do $$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when duplicate_object then null;
end $$;
