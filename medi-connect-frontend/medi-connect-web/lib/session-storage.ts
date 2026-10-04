export const SESSION_STORAGE_UPDATE_EVENT = "mediconnect:session-storage";

export function readSessionStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function writeSessionStorage<T>(key: string, value: T) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(SESSION_STORAGE_UPDATE_EVENT));
}
