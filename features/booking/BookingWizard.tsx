"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  HELPERS,
  SERVICES,
  ZONES,
  bookingQuote,
  estimate as estimateFor,
  type Helper,
  type ServiceId,
} from "@/lib/domain";
import { getBookingService } from "@/lib/services/booking-service";
import type { PaymentRecord } from "@/lib/services/payment-service";
import { customerNameFromUser } from "@/lib/services/auth-service";
import { useAuthUser } from "@/lib/services/use-auth";
import { SLOT_PRESETS, WIZARD_STEPS, type SlotOption } from "./booking.constants";
import { DEFAULT_DETAILS, useServiceDetails, type ServiceDetails } from "./useServiceDetails";
import { clearDraft, readDraft, saveDraft } from "./booking-draft";
import SignInCard from "./SignInCard";
import ServiceStep from "./steps/ServiceStep";
import DetailsStep from "./steps/DetailsStep";
import SlotStep from "./steps/SlotStep";
import HelperStep from "./steps/HelperStep";
import ConfirmStep from "./steps/ConfirmStep";
import SuccessScreen from "./SuccessScreen";
import InstantScreen from "./InstantScreen";
import PaymentSheet from "./PaymentSheet";

/** Orchestrates the ≤5-screen booking flow (FR-9) and the instant path.
 *  Payment-first: the booking row is only created AFTER payment succeeds. */
export default function BookingWizard() {
  const params = useSearchParams();
  const initial = params.get("service") as ServiceId | null;
  const validInitial = SERVICES.some((s) => s.id === initial) ? initial : null;
  const initialSlot = SLOT_PRESETS.find((s) => s.id === params.get("slot")) ?? null;
  const [instant, setInstant] = useState(params.get("instant") === "1");

  const [step, setStep] = useState(validInitial ? 1 : 0);
  const [service, setService] = useState<ServiceId>(validInitial ?? "cleaning");
  const { details, set, estimate } = useServiceDetails(service);
  const [zone, setZone] = useState(ZONES[0]);
  const [slot, setSlot] = useState<SlotOption | null>(initialSlot);
  const [customDate, setCustomDate] = useState("");
  const [helper, setHelper] = useState<Helper | null>(null);
  const [placing, setPlacing] = useState(false);
  const [paying, setPaying] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const user = useAuthUser();

  const svcMeta = SERVICES.find((s) => s.id === service)!;
  const quote = bookingQuote(estimate.low, estimate.high);

  // Draft lifecycle: saved ONLY at the moment a sign-in email is requested
  // (the magic link may open a fresh tab); restored ONLY when returning from
  // that email (?resume=1); any other visit purges leftovers. A blanket
  // save/restore here previously trapped users at Review & pay forever.
  const resuming = params.get("resume") === "1";
  const saveDraftForSignIn = () => {
    saveDraft({ service, details, zone, slotId: slot?.id ?? null, customDate, helperId: helper?.id ?? null });
  };

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      if (!resuming) {
        clearDraft(); // heal any stale draft from an abandoned sign-in
        return;
      }
      const draft = readDraft();
      if (!draft || !SERVICES.some((s) => s.id === draft.service)) return;
      setService(draft.service);
      for (const [field, value] of Object.entries(draft.details)) {
        set(field as keyof ServiceDetails, value as never);
      }
      setZone(draft.zone);
      setSlot(SLOT_PRESETS.find((s) => s.id === draft.slotId) ?? null);
      setCustomDate(draft.customDate);
      setHelper(HELPERS.find((h) => h.id === draft.helperId) ?? null);
      setStep(4);
      clearDraft();
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeBooking = async (payment: PaymentRecord) => {
    if (!user) return;
    setPlacing(true);
    const b = await getBookingService().create({
      service,
      serviceName: svcMeta.name,
      detailLabel: estimate.label,
      estLow: estimate.low,
      estHigh: estimate.high,
      slotLabel: slot?.id === "custom" ? customDate : slot?.label ?? "ASAP",
      zone,
      customerName: customerNameFromUser(user),
      preferredHelperId: helper?.id ?? null,
      via: "app",
      amountPaid: payment.amount,
      paymentId: payment.paymentId,
      paymentMethod: payment.method,
      customerId: user.id,
      customerEmail: user.email ?? null,
    });
    clearDraft();
    setBookingId(b.id);
    setPlacing(false);
    setPaying(false);
  };

  // ⚡ Instant path: ASAP defaults, but payment still comes first.
  const instantEst = validInitial
    ? estimateFor({ service: validInitial, ...DEFAULT_DETAILS })
    : null;

  const placeInstantBooking = async (payment: PaymentRecord) => {
    if (!validInitial || !instantEst || !user) return;
    const svc = SERVICES.find((s) => s.id === validInitial)!;
    const b = await getBookingService().create({
      service: validInitial,
      serviceName: svc.name,
      detailLabel: instantEst.label,
      estLow: instantEst.low,
      estHigh: instantEst.high,
      slotLabel: "ASAP",
      zone: ZONES[0],
      customerName: customerNameFromUser(user),
      preferredHelperId: null,
      via: "app",
      amountPaid: payment.amount,
      paymentId: payment.paymentId,
      paymentMethod: payment.method,
      customerId: user.id,
      customerEmail: user.email ?? null,
    });
    setBookingId(b.id);
  };

  const reset = () => {
    setBookingId(null);
    setStep(0);
    setSlot(null);
    setHelper(null);
    setInstant(false);
  };

  if (bookingId) return <SuccessScreen bookingId={bookingId} onReset={reset} />;

  if (instant && validInitial && instantEst) {
    return (
      <>
        <InstantScreen serviceName={svcMeta.name} />
        {user ? (
          <PaymentSheet
            amount={bookingQuote(instantEst.low, instantEst.high)}
            description={`${svcMeta.name} · ASAP · ${ZONES[0]}`}
            onPaid={(rec) => void placeInstantBooking(rec)}
            onClose={() => setInstant(false)}
          />
        ) : (
          <div className="mx-auto -mt-10 max-w-xl px-4 pb-16 sm:px-6">
            <SignInCard title="Sign in to pay & book instantly" />
          </div>
        )}
      </>
    );
  }

  const continueDisabled =
    (step === 2 && (!slot || (slot.id === "custom" && !customDate))) ||
    (step === 3 && !helper);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav aria-label="Booking progress">
        <ol className="flex items-center gap-2">
          {WIZARD_STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                  i < step ? "bg-success" : i === step ? "bg-primary glow-primary" : "bg-black/10"
                }`}
                aria-hidden
              />
              <span className={`text-xs ${i === step ? "font-bold text-primary" : "text-muted"}`}>
                {s}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-8 min-h-[420px]">
        {step === 0 && (
          <ServiceStep service={service} onSelect={(s) => { setService(s); setHelper(null); }} />
        )}
        {step === 1 && (
          <DetailsStep
            service={service}
            serviceName={svcMeta.name}
            details={details}
            set={set}
            estimate={estimate}
            zone={zone}
            onZoneChange={setZone}
          />
        )}
        {step === 2 && (
          <SlotStep slot={slot} onSelect={setSlot} customDate={customDate} onCustomDate={setCustomDate} />
        )}
        {step === 3 && <HelperStep service={service} helper={helper} onSelect={setHelper} />}
        {step === 4 && (
          <>
            <ConfirmStep
              serviceName={svcMeta.name}
              estimate={estimate}
              slot={slot}
              customDate={customDate}
              helper={helper}
              zone={zone}
            />
            {!user && <SignInCard onBeforeSend={saveDraftForSignIn} />}
          </>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="glass inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden /> Back
          </button>
        ) : (
          <span />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={continueDisabled}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary glow-primary transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Continue
          </button>
        ) : user ? (
          <button
            type="button"
            onClick={() => setPaying(true)}
            disabled={placing}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary glow-primary transition-transform duration-200 hover:scale-105 disabled:opacity-60"
          >
            {placing ? "Placing booking…" : `Pay ₹${quote.toLocaleString("en-IN")} & book`}
          </button>
        ) : (
          <span className="text-sm font-semibold text-muted">Sign in above to pay & book</span>
        )}
      </div>

      {paying && (
        <PaymentSheet
          amount={quote}
          description={`${svcMeta.name} · ${slot?.id === "custom" ? customDate : slot?.label ?? "ASAP"} · ${zone}`}
          onPaid={(rec) => void placeBooking(rec)}
          onClose={() => setPaying(false)}
        />
      )}
    </div>
  );
}
