"use client";

import { useMemo, useReducer } from "react";
import { estimate, type Estimate, type EstimateInput, type ServiceId } from "@/lib/domain";

export interface ServiceDetails {
  hours: number;
  cleaningType: "regular" | "vessel" | "deep";
  cookMode: "person" | "dish";
  people: number;
  dishes: number;
  laundryMode: "kg" | "piece";
  kg: number;
  pieces: number;
  careMode: "hourly" | "day";
  careHours: number;
  days: number;
}

export const DEFAULT_DETAILS: ServiceDetails = {
  hours: 2,
  cleaningType: "regular",
  cookMode: "person",
  people: 3,
  dishes: 3,
  laundryMode: "kg",
  kg: 4,
  pieces: 10,
  careMode: "hourly",
  careHours: 4,
  days: 1,
};

type Action = { [K in keyof ServiceDetails]: { field: K; value: ServiceDetails[K] } }[keyof ServiceDetails];

function reducer(state: ServiceDetails, action: Action): ServiceDetails {
  return { ...state, [action.field]: action.value };
}

/** Form state + derived estimate for a service's detail inputs (FR-6). */
export function useServiceDetails(service: ServiceId): {
  details: ServiceDetails;
  set: <K extends keyof ServiceDetails>(field: K, value: ServiceDetails[K]) => void;
  estimate: Estimate;
} {
  const [details, dispatch] = useReducer(reducer, DEFAULT_DETAILS);
  const est = useMemo(() => {
    const input: EstimateInput = { service, ...details };
    return estimate(input);
  }, [service, details]);
  return {
    details,
    set: (field, value) => dispatch({ field, value } as Action),
    estimate: est,
  };
}
