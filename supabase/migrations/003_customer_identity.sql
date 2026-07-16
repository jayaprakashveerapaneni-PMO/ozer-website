-- Ozer v3 — customer identity on bookings.
-- Customers sign in with Supabase email magic-link auth; bookings carry the
-- authenticated user's id + email so "my bookings" and future per-user RLS
-- have a real anchor. Nullable for legacy/guest rows.

alter table public.bookings
  add column if not exists customer_id uuid,
  add column if not exists customer_email text;

create index if not exists bookings_customer_idx on public.bookings (customer_id);
