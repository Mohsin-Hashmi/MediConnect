const ACCESS_TOKEN_STORAGE_KEY = "mediconnect_access_token";


// Retrieves the access token from sessionStorage or localStorage.
export function getAccessToken() {
  if (typeof window === "undefined") return null;

  return (
    window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ??
    window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  );
}

// Saves the access token to either sessionStorage or localStorage based on the persistent flag.
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

// Replaces the access token in storage, preserving the previous storage type (session or local).
export function replaceAccessToken(token: string) {
  const persistent = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) !== null;
  saveAccessToken(token, persistent);
}

// Clears the access token from both sessionStorage and localStorage.
export function clearAccessToken() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
