"use client";

import { useEffect, useRef, useState } from "react";
import { bookingEarnings, type Booking, type Helper } from "@/lib/domain";
import { getBookingService } from "@/lib/services/booking-service";
import { playChime, showNativeOffer } from "./notify";

export interface Toast {
  id: number;
  text: string;
}

/** All helper-portal state and actions for the SIGNED-IN helper; components
 *  stay purely presentational. Identity comes from helper-session. */
export function useHelperPortal(helper: Helper) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wallet, setWallet] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const knownOffers = useRef<Set<string>>(new Set());
  const toastId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    knownOffers.current.clear(); // fresh toast slate when the account changes
    const svc = getBookingService();
    // setState only after awaits (async) and guarded against unmount —
    // never synchronously in the effect body.
    const refresh = async () => {
      const [list, balance] = await Promise.all([svc.list(), svc.getWallet(helper.id)]);
      if (cancelled) return;
      setBookings(list);
      setWallet(balance);
    };
    void refresh();
    const unsubscribe = svc.subscribe(() => void refresh());
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [helper.id]);

  // Offers eligible for this helper (FR-11; certified-only care per FR-37).
  const offers = bookings.filter(
    (b) =>
      b.status === "pending_offer" &&
      helper.services.includes(b.service) &&
      (b.service !== "care" || helper.certified) &&
      !b.declinedBy.includes(helper.id)
  );

  // Toast + chime + native OS notification on newly arrived offers.
  useEffect(() => {
    let fresh = 0;
    offers.forEach((o) => {
      if (knownOffers.current.has(o.id)) return;
      knownOffers.current.add(o.id);
      fresh++;
      const id = ++toastId.current;
      setToasts((t) => [...t, { id, text: `New job nearby: ${o.serviceName} · ${o.zone}` }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
      showNativeOffer(
        `New job offer — ₹${bookingEarnings(o).toLocaleString("en-IN")}`,
        `${o.serviceName} · ${o.zone} · ${o.slotLabel} (already paid)`,
        o.id
      );
    });
    if (fresh > 0) playChime();
  }, [offers]);

  const activeJob = bookings.find(
    (b) => b.helperId === helper.id && b.status !== "completed" && b.status !== "pending_offer"
  );
  const completedJobs = bookings.filter(
    (b) => b.helperId === helper.id && b.status === "completed"
  );

  const svc = () => getBookingService();

  return {
    wallet,
    toasts,
    offers,
    activeJob,
    completedJobs,
    accept: (b: Booking) =>
      void svc().update(b.id, { status: "assigned", helperId: helper.id, helperName: helper.name }),
    decline: (b: Booking) =>
      void svc().update(b.id, { declinedBy: [...b.declinedBy, helper.id] }),
    startJourney: (b: Booking) => void svc().update(b.id, { status: "en_route" }),
    /** FR-16: OTP handshake — returns false (and blocks) on mismatch. */
    verifyOtp: async (b: Booking, otp: string): Promise<boolean> => {
      if (otp !== b.otp) return false;
      await svc().update(b.id, { status: "arrived" });
      return true;
    },
    startJob: (b: Booking) => void svc().update(b.id, { status: "in_progress" }),
    complete: async (b: Booking) => {
      await svc().update(b.id, { status: "completed" });
      setWallet(await svc().creditWallet(helper.id, bookingEarnings(b)));
    },
  };
}
