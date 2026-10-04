"use client";

import { useMemo, useSyncExternalStore } from "react";

import { SESSION_STORAGE_UPDATE_EVENT } from "@/lib/session-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SESSION_STORAGE_UPDATE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SESSION_STORAGE_UPDATE_EVENT, callback);
  };
}

export function useSessionStorageValue<T>(key: string) {
  const serializedValue = useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem(key),
    () => null,
  );

  return useMemo(() => {
    if (!serializedValue) return null;

    try {
      return JSON.parse(serializedValue) as T;
    } catch {
      return null;
    }
  }, [serializedValue]);
}
