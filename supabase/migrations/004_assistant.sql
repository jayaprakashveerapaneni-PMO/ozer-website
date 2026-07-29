-- Ozer v4 — voice assistant integration (EP-14).
-- FR-27 / AI-7: voice NEVER books alone. Assistants only create DRAFTS; the
-- customer confirms & pays on the website, which is when a booking row exists.
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run).

-- One row per pairing code. A customer generates the code on /login and
-- speaks it once to Alexa (or pastes it into their Siri Shortcut).
create table if not exists public.assistant_links (
  code text primary key,           -- 6-digit speakable pairing code
  customer_id uuid not null,
  customer_email text,
  customer_name text not null,
  device_ref text,                 -- Alexa userId once that device pairs
  created_at bigint not null
);

create index if not exists assistant_links_customer_idx
  on public.assistant_links (customer_id);
create index if not exists assistant_links_device_idx
  on public.assistant_links (device_ref);

create table if not exists public.assistant_drafts (
  id text primary key,
  link_code text not null references public.assistant_links(code) on delete cascade,
  source text not null check (source in ('alexa', 'siri')),
  service text not null check (service in ('cleaning', 'cook', 'laundry', 'care')),
  hours integer,
  zone text not null,
  slot_label text not null default 'ASAP',
  status text not null default 'open' check (status in ('open', 'consumed')),
  created_at bigint not null,
  updated_at bigint not null
);

create index if not exists assistant_drafts_link_idx
  on public.assistant_drafts (link_code, status);

-- Realtime so a spoken draft pops onto the /login panel live.
alter publication supabase_realtime add table public.assistant_drafts;

alter table public.assistant_links enable row level security;
alter table public.assistant_drafts enable row level security;

-- Demo-phase access like bookings (001): the anon key may read/write.
-- ⚠ MUST be replaced with per-user policies in the real-RLS sprint
-- (roadmap §9.1) — pairing codes and drafts are per-customer data.
create policy "demo open assistant_links" on public.assistant_links
  for all using (true) with check (true);
create policy "demo open assistant_drafts" on public.assistant_drafts
  for all using (true) with check (true);
