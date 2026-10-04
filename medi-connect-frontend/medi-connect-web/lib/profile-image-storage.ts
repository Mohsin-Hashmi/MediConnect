const DATABASE_NAME = "mediconnect-onboarding";
const DATABASE_VERSION = 1;
const ASSET_STORE = "assets";
const PROFILE_IMAGE_KEY = "doctor-profile-image";

export const PROFILE_IMAGE_QUERY_KEY = [
  "onboarding",
  "doctor",
  "profile-image",
] as const;

function openDatabase() {
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

export async function saveStoredProfileImage(image: File) {
  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(ASSET_STORE, "readwrite");
    transaction.objectStore(ASSET_STORE).put(image, PROFILE_IMAGE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });

  database.close();
}

export async function deleteStoredProfileImage() {
  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(ASSET_STORE, "readwrite");
    transaction.objectStore(ASSET_STORE).delete(PROFILE_IMAGE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });

  database.close();
}

async function getStoredProfileImage() {
  const database = await openDatabase();

  const image = await new Promise<Blob | null>((resolve, reject) => {
    const transaction = database.transaction(ASSET_STORE, "readonly");
    const request = transaction.objectStore(ASSET_STORE).get(PROFILE_IMAGE_KEY);
    request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });

  database.close();
  return image;
}

export async function getStoredProfileImageDataUrl() {
  const image = await getStoredProfileImage();
  if (!image) return null;

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(image);
  });
}
