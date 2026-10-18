const ACCESS_TOKEN_STORAGE_KEY = "mediconnect_access_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return (
      window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ??
      window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    );
  } catch {
    return null;
  }
}

/** Stores the token for either the current tab or a persistent login. */
export function saveAccessToken(token: string, persistent = false): void {
  if (typeof window === "undefined") return;

  const primaryStorage = persistent
    ? window.localStorage
    : window.sessionStorage;
  const secondaryStorage = persistent
    ? window.sessionStorage
    : window.localStorage;

  primaryStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  secondaryStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function replaceAccessToken(token: string): void {
  if (typeof window === "undefined") return;

  const persistent =
    window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) !== null;
  saveAccessToken(token, persistent);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
