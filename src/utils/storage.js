// Safe localStorage helpers. Reading never throws: on any problem
// (missing key, corrupt JSON, failed validation, blocked storage) the
// fallback is returned instead.
export const STORAGE_PREFIX = "play:";

export function readStorage(key, fallback, validate = () => true) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* storage unavailable - nothing to do */
  }
}

export function clearAllStorage() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

// Small validators reused by the providers.
export const isArrayOf = (test) => (v) => Array.isArray(v) && v.every(test);
export const isString = (v) => typeof v === "string";
export const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
