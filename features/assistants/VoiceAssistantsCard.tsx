"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Mic, RefreshCw } from "lucide-react";
import { SERVICES, draftEstimate, formatEstimate, type AssistantDraft } from "@/lib/domain";
import { customerNameFromUser } from "@/lib/services/auth-service";
import { getSupabaseClient } from "@/lib/services/supabase-client";
import {
  AssistantNotProvisionedError,
  consumeDraft,
  createLink,
  linkForCustomer,
  openDraftsForCustomer,
} from "@/lib/services/assistant/store";
import { saveDraft } from "@/features/booking/booking-draft";
import { DEFAULT_DETAILS } from "@/features/booking/useServiceDetails";

type State =
  | { kind: "loading" }
  | { kind: "unprovisioned" }
  | { kind: "ready"; code: string | null; drafts: AssistantDraft[] };

/** /login: pairing code + drafts started on Alexa/Siri. Drafts resume the
 *  booking wizard at Review & pay — voice never books alone (FR-27). */
export default function VoiceAssistantsCard({ user }: { user: User }) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [link, drafts] = await Promise.all([
          linkForCustomer(user.id),
          openDraftsForCustomer(user.id),
        ]);
        if (!cancelled) setState({ kind: "ready", code: link?.code ?? null, drafts });
      } catch (e) {
        if (!cancelled && e instanceof AssistantNotProvisionedError) {
          setState({ kind: "unprovisioned" });
        }
      }
    };
    void load();
    // A draft spoken to Alexa/Siri pops in live.
    const channel = getSupabaseClient()
      ?.channel("assistant-drafts")
      .on("postgres_changes", { event: "*", schema: "public", table: "assistant_drafts" }, () => void load())
      .subscribe();
    return () => {
      cancelled = true;
      void channel?.unsubscribe();
    };
  }, [user.id]);

  if (state.kind === "unprovisioned" || state.kind === "loading") return null;

  const generate = async () => {
    setBusy(true);
    try {
      const link = await createLink({
        id: user.id,
        email: user.email ?? null,
        name: customerNameFromUser(user),
      });
      setState({ ...state, code: link.code });
    } finally {
      setBusy(false);
    }
  };

  const resume = async (d: AssistantDraft) => {
    const details = { ...DEFAULT_DETAILS };
    if (d.hours != null) {
      details.hours = d.hours;
      details.careHours = d.hours;
    }
    saveDraft({
      service: d.service,
      details,
      zone: d.zone,
      slotId: "asap",
      customDate: "",
      helperId: null,
      via: "voice",
    });
    await consumeDraft(d.id).catch(() => {});
    router.push("/book?resume=1");
  };

  return (
    <section className="mt-6 rounded-2xl border border-line bg-surface/70 p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        <Mic className="h-4 w-4 text-primary" aria-hidden />
        Voice assistants
      </h3>

      {state.drafts.length > 0 && (
        <ul className="mt-3 space-y-2">
          {state.drafts.map((d) => {
            const svc = SERVICES.find((s) => s.id === d.service);
            const est = draftEstimate(d.service, d.hours);
            return (
              <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-surface p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {svc?.name}
                    {d.hours != null ? ` · ${d.hours} hr` : ""} · {d.zone}
                  </p>
                  <p className="text-xs text-muted">
                    Started on {d.source === "alexa" ? "Alexa" : "Siri"} ·{" "}
                    {formatEstimate(est.low, est.high)} · pay to confirm
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void resume(d)}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-on-primary glow-primary transition-transform hover:scale-105"
                >
                  Continue &amp; pay
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        {state.code ? (
          <p className="text-muted">
            Pairing code:{" "}
            <span className="font-display text-base font-bold tracking-[0.25em] text-primary">
              {state.code}
            </span>{" "}
            — say <em>“Alexa, ask Ozer to pair {state.code.split("").join(" ")}”</em>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => void generate()}
            disabled={busy}
            className="glass inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-colors hover:text-primary disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin motion-reduce:animate-none" : ""}`} aria-hidden />
            Generate pairing code
          </button>
        )}
        <Link href="/assistants" className="text-xs font-semibold text-primary hover:underline">
          Set up Alexa &amp; Siri →
        </Link>
      </div>
    </section>
  );
}
