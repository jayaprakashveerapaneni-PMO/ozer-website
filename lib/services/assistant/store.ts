// Assistant link + draft persistence — plain Supabase REST so the same module
// serves API routes (server) and the /login panel (client). Demo-open RLS,
// like bookings; real per-user policies land in the RLS sprint (§9.1).

import {
  makeDraftId,
  makePairingCode,
  type AssistantDraft,
  type AssistantSource,
} from "@/lib/domain";
import type { ServiceId } from "@/lib/domain";

export interface AssistantLink {
  code: string;
  customerId: string;
  customerEmail: string | null;
  customerName: string;
  deviceRef: string | null;
  createdAt: number;
}

/** Thrown when migration 004 hasn't been applied yet — callers show a
 *  friendly "voice booking is being set up" state instead of an error. */
export class AssistantNotProvisionedError extends Error {
  constructor() {
    super("assistant tables missing — run supabase/migrations/004_assistant.sql");
    this.name = "AssistantNotProvisionedError";
  }
}

const base = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function assistantConfigured(): boolean {
  return Boolean(base() && key());
}

async function rest(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${base()}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key()!,
      Authorization: `Bearer ${key()!}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers,
    },
    cache: "no-store",
  });
  const body: unknown = res.status === 204 ? null : await res.json();
  if (!res.ok) {
    // PostgREST: PGRST205 = table not in schema cache (migration not run).
    const code = (body as { code?: string } | null)?.code;
    if (res.status === 404 || code === "PGRST205" || code === "42P01") {
      throw new AssistantNotProvisionedError();
    }
    throw new Error(`assistant store ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return body;
}

interface LinkRow {
  code: string;
  customer_id: string;
  customer_email: string | null;
  customer_name: string;
  device_ref: string | null;
  created_at: number;
}

interface DraftRow {
  id: string;
  link_code: string;
  source: AssistantSource;
  service: ServiceId;
  hours: number | null;
  zone: string;
  slot_label: string;
  status: "open" | "consumed";
  created_at: number;
  updated_at: number;
}

const toLink = (r: LinkRow): AssistantLink => ({
  code: r.code,
  customerId: r.customer_id,
  customerEmail: r.customer_email,
  customerName: r.customer_name,
  deviceRef: r.device_ref,
  createdAt: r.created_at,
});

const toDraft = (r: DraftRow): AssistantDraft => ({
  id: r.id,
  linkCode: r.link_code,
  source: r.source,
  service: r.service,
  hours: r.hours,
  zone: r.zone,
  slotLabel: r.slot_label,
  status: r.status,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export async function linkForCustomer(customerId: string): Promise<AssistantLink | null> {
  const rows = (await rest(
    `assistant_links?customer_id=eq.${customerId}&order=created_at.desc&limit=1`
  )) as LinkRow[];
  return rows[0] ? toLink(rows[0]) : null;
}

export async function createLink(customer: {
  id: string;
  email: string | null;
  name: string;
}): Promise<AssistantLink> {
  // Retry on the (unlikely) code collision — primary key rejects duplicates.
  for (let attempt = 0; attempt < 3; attempt++) {
    const row: LinkRow = {
      code: makePairingCode(),
      customer_id: customer.id,
      customer_email: customer.email,
      customer_name: customer.name,
      device_ref: null,
      created_at: Date.now(),
    };
    try {
      const rows = (await rest("assistant_links", {
        method: "POST",
        body: JSON.stringify(row),
      })) as LinkRow[];
      return toLink(rows[0]);
    } catch (e) {
      if (e instanceof AssistantNotProvisionedError || attempt === 2) throw e;
    }
  }
  throw new Error("unreachable");
}

export async function linkByCode(code: string): Promise<AssistantLink | null> {
  const rows = (await rest(
    `assistant_links?code=eq.${encodeURIComponent(code)}&limit=1`
  )) as LinkRow[];
  return rows[0] ? toLink(rows[0]) : null;
}

export async function linkByDevice(deviceRef: string): Promise<AssistantLink | null> {
  const rows = (await rest(
    `assistant_links?device_ref=eq.${encodeURIComponent(deviceRef)}&limit=1`
  )) as LinkRow[];
  return rows[0] ? toLink(rows[0]) : null;
}

export async function attachDevice(code: string, deviceRef: string): Promise<void> {
  await rest(`assistant_links?code=eq.${encodeURIComponent(code)}`, {
    method: "PATCH",
    body: JSON.stringify({ device_ref: deviceRef }),
  });
}

export async function createDraft(input: {
  linkCode: string;
  source: AssistantSource;
  service: ServiceId;
  hours: number | null;
  zone: string;
}): Promise<AssistantDraft> {
  const now = Date.now();
  const row: DraftRow = {
    id: makeDraftId(),
    link_code: input.linkCode,
    source: input.source,
    service: input.service,
    hours: input.hours,
    zone: input.zone,
    slot_label: "ASAP",
    status: "open",
    created_at: now,
    updated_at: now,
  };
  const rows = (await rest("assistant_drafts", {
    method: "POST",
    body: JSON.stringify(row),
  })) as DraftRow[];
  return toDraft(rows[0]);
}

export async function openDraftsForCustomer(customerId: string): Promise<AssistantDraft[]> {
  const links = (await rest(
    `assistant_links?customer_id=eq.${customerId}&select=code`
  )) as { code: string }[];
  if (links.length === 0) return [];
  const codes = links.map((l) => l.code).join(",");
  const rows = (await rest(
    `assistant_drafts?link_code=in.(${codes})&status=eq.open&order=created_at.desc`
  )) as DraftRow[];
  return rows.map(toDraft);
}

export async function consumeDraft(id: string): Promise<void> {
  await rest(`assistant_drafts?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "consumed", updated_at: Date.now() }),
  });
}
