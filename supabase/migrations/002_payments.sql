-- Ozer v2 — payment-first booking (TR-20).
-- Run in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).
--
-- Payment is captured BEFORE the booking row is inserted, so these columns
-- are written at create time. They are nullable only for legacy rows created
-- before upfront payment shipped; the app treats null as "legacy estimate".

alter table public.bookings
  add column if not exists amount_paid integer check (amount_paid is null or amount_paid >= 0),
  add column if not exists payment_id text,
  add column if not exists payment_method text
    check (payment_method is null or payment_method in ('upi', 'card', 'netbanking'));

create index if not exists bookings_payment_idx on public.bookings (payment_id);
