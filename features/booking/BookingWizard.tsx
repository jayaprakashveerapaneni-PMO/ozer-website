"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Mic } from "lucide-react";
import {
  SERVICES,
  ZONES,
  estimate as estimateFor,
  type Helper,
  type ServiceId,
} from "@/lib/domain";
import { getBookingService } from "@/lib/services/booking-service";
import { SLOT_PRESETS, WIZARD_STEPS, type SlotOption } from "./booking.constants";
import { DEFAULT_DETAILS, useServiceDetails } from "./useServiceDetails";
import ServiceStep from "./steps/ServiceStep";
import DetailsStep from "./steps/DetailsStep";
import SlotStep from "./steps/SlotStep";
import HelperStep from "./steps/HelperStep";
import ConfirmStep from "./steps/ConfirmStep";
import SuccessScreen from "./SuccessScreen";
import InstantScreen from "./InstantScreen";

/** Orchestrates the ≤5-screen booking flow (FR-9) and the instant path. */
export default function BookingWizard() {
  const params = useSearchParams();
  const initial = params.get("service") as ServiceId | null;
  const validInitial = SERVICES.some((s) => s.id === initial) ? initial : null;
  const initialSlot = SLOT_PRESETS.find((s) => s.id === params.get("slot")) ?? null;
  const viaVoice = params.get("via") === "voice";
  const instant = params.get("instant") === "1";

  const [step, setStep] = useState(validInitial ? 1 : 0);
  const [service, setService] = useState<ServiceId>(validInitial ?? "cleaning");
  const { details, set, estimate } = useServiceDetails(service);
  const [zone, setZone] = useState(ZONES[0]);
  const [slot, setSlot] = useState<SlotOption | null>(initialSlot);
  const [customDate, setCustomDate] = useState("");
  const [helper, setHelper] = useState<Helper | null>(null);
  const [placing, setPlacing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const svcMeta = SERVICES.find((s) => s.id === service)!;

  const placeBooking = async () => {
    setPlacing(true);
    const b = await getBookingService().create({
      service,
      serviceName: svcMeta.name,
      detailLabel: estimate.label,
      estLow: estimate.low,
      estHigh: estimate.high,
      slotLabel: slot?.id === "custom" ? customDate : slot?.label ?? "ASAP",
      zone,
      customerName: "You (demo customer)",
      preferredHelperId: helper?.id ?? null,
      via: viaVoice ? "voice" : "app",
    });
    setBookingId(b.id);
    setPlacing(false);
  };

  // ⚡ Instant path: create an ASAP booking with defaults, land on live status.
  const instantFired = useRef(false);
  useEffect(() => {
    if (!instant || !validInitial || instantFired.current) return;
    instantFired.current = true;
    const svc = SERVICES.find((s) => s.id === validInitial)!;
    const est = estimateFor({ service: validInitial, ...DEFAULT_DETAILS });
    const t = setTimeout(() => {
      void getBookingService()
        .create({
          service: validInitial,
          serviceName: svc.name,
          detailLabel: est.label,
          estLow: est.low,
          estHigh: est.high,
          slotLabel: "ASAP",
          zone: ZONES[0],
          customerName: "You (instant customer)",
          preferredHelperId: null,
          via: "app",
        })
        .then((b) => setBookingId(b.id));
    }, 700);
    return () => clearTimeout(t);
  }, [instant, validInitial]);

  const reset = () => {
    setBookingId(null);
    setStep(0);
    setSlot(null);
    setHelper(null);
  };

  if (bookingId) return <SuccessScreen bookingId={bookingId} onReset={reset} />;

  if (instant && validInitial) return <InstantScreen serviceName={svcMeta.name} />;

  const continueDisabled =
    (step === 2 && (!slot || (slot.id === "custom" && !customDate))) ||
    (step === 3 && !helper);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {viaVoice && step === 1 && (
        <p className="animate-fade-up mb-6 flex items-center gap-2 rounded-2xl glass px-4 py-3 text-sm font-medium text-primary-soft">
          <Mic className="h-4 w-4 shrink-0" aria-hidden />
          Filled in by voice — review the details, everything stays in your control.
          {initialSlot && (
            <span className="ml-auto rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold">
              {initialSlot.label}
            </span>
          )}
        </p>
      )}

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
              <span className={`text-xs ${i === step ? "font-bold text-primary-soft" : "text-muted"}`}>
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
          <ConfirmStep
            serviceName={svcMeta.name}
            estimate={estimate}
            slot={slot}
            customDate={customDate}
            helper={helper}
            zone={zone}
          />
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="glass inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:text-primary-soft"
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
        ) : (
          <button
            type="button"
            onClick={() => void placeBooking()}
            disabled={placing}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary glow-primary transition-transform duration-200 hover:scale-105 disabled:opacity-60"
          >
            {placing ? "Placing booking…" : "Confirm booking"}
          </button>
        )}
      </div>
    </div>
  );
}
