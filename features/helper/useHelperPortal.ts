"use client";

import { useEffect, useRef, useState } from "react";
import { HELPERS, bookingEarnings, type Booking, type Helper } from "@/lib/domain";
import { getBookingService } from "@/lib/services/booking-service";

export interface Toast {
  id: number;
  text: string;
}

/** All helper-portal state and actions; components stay purely presentational. */
export function useHelperPortal() {
  const [helper, setHelper] = useState<Helper>(HELPERS[0]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wallet, setWallet] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const knownOffers = useRef<Set<string>>(new Set());
  const toastId = useRef(0);

  useEffect(() => {
    let cancelled = false;
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

  // Toast on newly arrived offers.
  useEffect(() => {
    offers.forEach((o) => {
      if (knownOffers.current.has(o.id)) return;
      knownOffers.current.add(o.id);
      const id = ++toastId.current;
      setToasts((t) => [...t, { id, text: `New job nearby: ${o.serviceName} · ${o.zone}` }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
    });
  }, [offers]);

  const activeJob = bookings.find(
    (b) => b.helperId === helper.id && b.status !== "completed" && b.status !== "pending_offer"
  );
  const completedJobs = bookings.filter(
    (b) => b.helperId === helper.id && b.status === "completed"
  );

  const svc = () => getBookingService();

  return {
    helper,
    switchHelper: (h: Helper) => {
      setHelper(h);
      knownOffers.current.clear();
    },
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
