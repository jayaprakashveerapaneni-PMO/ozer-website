# Ozer backend setup (free tier, ~10 minutes)

The app runs in two modes, selected automatically at startup:

| Mode | When | Capability |
|---|---|---|
| `local` | No Supabase env vars | Single device, localStorage, zero-config |
| `supabase` | Env vars present | **Multi-device real-time** — customer on one phone, helper on another |

## One-time setup

1. **Create the project (free):** go to <https://supabase.com> → *Start your project* → sign in **with GitHub** → *New project* (any name, e.g. `ozer`, Region: `ap-south-1` Mumbai, Free plan).
2. **Run the migration:** Dashboard → *SQL Editor* → *New query* → paste the contents of [`supabase/migrations/001_init.sql`](../supabase/migrations/001_init.sql) → *Run*.
3. **Copy the two keys:** Dashboard → *Project Settings* → *API*:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Local dev:** create `ozer-website/.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOURPROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
5. **Production:** `npx vercel env add NEXT_PUBLIC_SUPABASE_URL production` (paste value), same for the anon key, then redeploy — or add both in the Vercel dashboard → Project → Settings → Environment Variables.

That's it. The service factory (`lib/services/booking-service.ts`) detects the vars and switches to the Supabase adapter; the UI shows the active mode.

## Security posture (current vs. required)

The migration ships a **demo-phase open policy** (anon key can read/write bookings) so client testing works without accounts. Before real customer launch:

- Replace open policies with per-user RLS (customers see their bookings; helpers see offers assigned/eligible to them).
- Move the OTP column behind a security-definer verification function so helpers can *check* an OTP but never *read* it.
- Add Supabase Auth (phone OTP login — FR-1) and key rotation.

These are tracked as Critical items in the production audit (`/flow` → audit).
