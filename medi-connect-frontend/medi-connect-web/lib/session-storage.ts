export const SESSION_STORAGE_UPDATE_EVENT = "mediconnect:session-storage";

export function readSessionStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.sessionStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function writeSessionStorage<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(SESSION_STORAGE_UPDATE_EVENT));
    return true;
  } catch {
    return false;
  }
}
