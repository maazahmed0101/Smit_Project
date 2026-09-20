// Prefix for files in /public so the app also works when deployed under a sub-path
// (Vite sets BASE_URL from the `base` option; it is "/" by default).
const BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) || "/";

export const asset = (path) => `${BASE}${String(path).replace(/^\/+/, "")}`;
