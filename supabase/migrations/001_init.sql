-- Ozer v1 — initial schema (free-tier friendly).
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).

create table if not exists public.bookings (
  id text primary key,
  service text not null check (service in ('cleaning', 'cook', 'laundry', 'care')),
  service_name text not null,
  detail_label text not null,
  est_low integer not null check (est_low >= 0),
  est_high integer not null check (est_high >= est_low),
  slot_label text not null,
  zone text not null,
  customer_name text not null,
  otp text not null,
  status text not null default 'pending_offer'
    check (status in ('pending_offer', 'assigned', 'en_route', 'arrived', 'in_progress', 'completed')),
  helper_id text,
  helper_name text,
  preferred_helper_id text,
  declined_by text[] not null default '{}',
  created_at bigint not null,
  updated_at bigint not null,
  via text not null default 'app' check (via in ('voice', 'app'))
);

create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_created_idx on public.bookings (created_at desc);

create table if not exists public.wallets (
  helper_id text primary key,
  balance integer not null default 0 check (balance >= 0)
);

-- Atomic wallet credit (no read-modify-write races).
create or replace function public.increment_wallet(p_helper_id text, p_amount integer)
returns integer
language plpgsql
security definer
as $$
declare
  new_balance integer;
begin
  insert into public.wallets (helper_id, balance)
  values (p_helper_id, p_amount)
  on conflict (helper_id)
  do update set balance = public.wallets.balance + p_amount
  returning balance into new_balance;
  return new_balance;
end;
$$;

-- Realtime: broadcast row changes to connected clients.
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.wallets;

-- Demo-phase access policy: the anon key may read/write bookings and wallets.
-- ⚠ Before real launch this MUST be replaced with per-user auth policies —
-- tracked as a Critical item in the production audit.
alter table public.bookings enable row level security;
alter table public.wallets enable row level security;

create policy "demo open access bookings" on public.bookings
  for all using (true) with check (true);
create policy "demo read wallets" on public.wallets
  for select using (true);
