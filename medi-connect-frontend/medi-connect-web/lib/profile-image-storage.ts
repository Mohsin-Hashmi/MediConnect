const DATABASE_NAME = "mediconnect-onboarding";
const DATABASE_VERSION = 1;
const ASSET_STORE = "assets";
const PROFILE_IMAGE_KEY = "doctor-profile-image";

export const PROFILE_IMAGE_QUERY_KEY = [
  "onboarding",
  "doctor",
  "profile-image",
] as const;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(ASSET_STORE)) {
        database.createObjectStore(ASSET_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withDatabase<T>(
  operation: (database: IDBDatabase) => Promise<T>,
): Promise<T> {
  const database = await openDatabase();

  try {
    return await operation(database);
  } finally {
    database.close();
  }
}

function updateStoredProfileImage(
  operation: "put" | "delete",
  image?: File,
): Promise<void> {
  return withDatabase(
    (database) =>
      new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(ASSET_STORE, "readwrite");
        const store = transaction.objectStore(ASSET_STORE);

        if (operation === "put" && image) {
          store.put(image, PROFILE_IMAGE_KEY);
        } else {
          store.delete(PROFILE_IMAGE_KEY);
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = () =>
          reject(transaction.error ?? new Error("Profile image storage failed."));
        transaction.onabort = () =>
          reject(transaction.error ?? new Error("Profile image storage was cancelled."));
      }),
  );
}

/** Stores an onboarding image draft locally until the doctor is submitted. */
export function saveStoredProfileImage(image: File): Promise<void> {
  return updateStoredProfileImage("put", image);
}

export function deleteStoredProfileImage(): Promise<void> {
  return updateStoredProfileImage("delete");
}

function getStoredProfileImage(): Promise<Blob | null> {
  return withDatabase(
    (database) =>
      new Promise<Blob | null>((resolve, reject) => {
        const transaction = database.transaction(ASSET_STORE, "readonly");
        const request = transaction.objectStore(ASSET_STORE).get(PROFILE_IMAGE_KEY);
        request.onsuccess = () =>
          resolve((request.result as Blob | undefined) ?? null);
        request.onerror = () =>
          reject(request.error ?? new Error("Profile image could not be read."));
      }),
  );
}

export async function getStoredProfileImageDataUrl(): Promise<string | null> {
  const image = await getStoredProfileImage();
  if (!image) return null;

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error("Profile image preview could not be created."));
    reader.readAsDataURL(image);
  });
}
