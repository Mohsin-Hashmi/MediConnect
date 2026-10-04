const ACCESS_TOKEN_STORAGE_KEY = "mediconnect_access_token";

export function getAccessToken() {
  if (typeof window === "undefined") return null;

  return (
    window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ??
    window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  );
}

export function saveAccessToken(token: string, persistent = false) {
  const primaryStorage = persistent
    ? window.localStorage
    : window.sessionStorage;
  const secondaryStorage = persistent
    ? window.sessionStorage
    : window.localStorage;

  primaryStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  secondaryStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function replaceAccessToken(token: string) {
  const persistent = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) !== null;
  saveAccessToken(token, persistent);
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
