"use client";

import { GraduationCap } from "lucide-react";
import NumberField from "@/components/ui/NumberField";
import SegmentedControl from "@/components/ui/SegmentedControl";
import type { ServiceId } from "@/lib/domain";
import type { ServiceDetails } from "./useServiceDetails";

/**
 * Per-service detail inputs (FR-6, FR-31..FR-39). Shared by the marketing
 * estimator and the booking wizard so pricing inputs can never drift apart.
 */
export default function ServiceDetailsFields({
  service,
  details,
  set,
  idPrefix,
}: {
  service: ServiceId;
  details: ServiceDetails;
  set: <K extends keyof ServiceDetails>(field: K, value: ServiceDetails[K]) => void;
  idPrefix: string;
}) {
  switch (service) {
    case "cleaning":
      return (
        <>
          <SegmentedControl
            label="Cleaning type"
            options={[
              { value: "regular", label: "Regular" },
              { value: "vessel", label: "Vessel wash" },
              { value: "deep", label: "Deep clean ₹400" },
            ]}
            value={details.cleaningType}
            onChange={(v) => set("cleaningType", v)}
          />
          {details.cleaningType !== "deep" && (
            <NumberField
              id={`${idPrefix}-hours`}
              label="Hours"
              value={details.hours}
              onChange={(v) => set("hours", v)}
              min={1}
              max={8}
              unit="hrs (min 1)"
            />
          )}
        </>
      );
    case "cook":
      return (
        <>
          <SegmentedControl
            label="Pricing mode"
            options={[
              { value: "person", label: "Per person" },
              { value: "dish", label: "Per dish" },
            ]}
            value={details.cookMode}
            onChange={(v) => set("cookMode", v)}
          />
          {details.cookMode === "person" ? (
            <NumberField
              id={`${idPrefix}-people`}
              label="How many people?"
              value={details.people}
              onChange={(v) => set("people", v)}
              min={1}
              max={20}
            />
          ) : (
            <NumberField
              id={`${idPrefix}-dishes`}
              label="How many dishes?"
              value={details.dishes}
              onChange={(v) => set("dishes", v)}
              min={1}
              max={20}
            />
          )}
        </>
      );
    case "laundry":
      return (
        <>
          <SegmentedControl
            label="Service"
            options={[
              { value: "kg", label: "Wash & fold ₹60/kg" },
              { value: "piece", label: "Ironing ₹8/pc" },
            ]}
            value={details.laundryMode}
            onChange={(v) => set("laundryMode", v)}
          />
          {details.laundryMode === "kg" ? (
            <NumberField
              id={`${idPrefix}-kg`}
              label="Approx. weight"
              value={details.kg}
              onChange={(v) => set("kg", v)}
              min={1}
              max={50}
              unit="kg (confirmed at pickup)"
            />
          ) : (
            <NumberField
              id={`${idPrefix}-pieces`}
              label="Pieces"
              value={details.pieces}
              onChange={(v) => set("pieces", v)}
              min={1}
              max={200}
            />
          )}
        </>
      );
    case "care":
      return (
        <>
          <SegmentedControl
            label="Duration"
            options={[
              { value: "hourly", label: "Hourly" },
              { value: "day", label: "Full day ₹600" },
            ]}
            value={details.careMode}
            onChange={(v) => set("careMode", v)}
          />
          {details.careMode === "hourly" ? (
            <NumberField
              id={`${idPrefix}-care-hours`}
              label="Hours"
              value={details.careHours}
              onChange={(v) => set("careHours", v)}
              min={1}
              max={12}
              unit="hrs (6 AM – 10 PM)"
            />
          ) : (
            <NumberField
              id={`${idPrefix}-days`}
              label="Days"
              value={details.days}
              onChange={(v) => set("days", v)}
              min={1}
              max={14}
            />
          )}
          <p className="rounded-2xl bg-surface p-3 text-xs text-muted">
            <GraduationCap className="mr-1 inline h-3.5 w-3.5 text-primary-soft" aria-hidden />
            Only certified, first-aid-trained carers can take care bookings.
            Service window is 6 AM – 10 PM.
          </p>
        </>
      );
  }
}
