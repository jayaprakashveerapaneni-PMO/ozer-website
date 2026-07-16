"use client";

import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { getAuthUser, getServerAuthSnapshot, subscribeAuth } from "./auth-service";

/** Current signed-in customer (null on the server and while signed out). */
export function useAuthUser(): User | null {
  return useSyncExternalStore(subscribeAuth, getAuthUser, getServerAuthSnapshot);
}
