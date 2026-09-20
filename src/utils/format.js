// Compact number: 1200 -> "1.2K", 600000 -> "600K", 2300000 -> "2.3M".
// `decimals` controls the maximum fraction digits (trailing zeros are dropped).
export function formatCount(n, decimals = 1) {
  const value = Number(n);
  if (!Number.isFinite(value) || value < 0) return "0";
  if (value >= 1_000_000) return `${short(value / 1_000_000, decimals)}M`;
  if (value >= 1_000) return `${short(value / 1_000, decimals)}K`;
  return String(Math.floor(value));
}

function short(x, decimals) {
  const f = 10 ** decimals;
  return String(Math.round(x * f) / f);
}

export const formatViews = (n) => `${formatCount(n)} Views`;

export const formatFullNumber = (n) => Number(n || 0).toLocaleString("en-US");

// "18 hours ago", "3 days ago" ... from an age in hours.
export function formatHoursAgo(hours) {
  const h = Number(hours);
  if (!Number.isFinite(h) || h < 1) return "Just now";
  if (h < 24) return plural(Math.floor(h), "hour");
  const days = Math.floor(h / 24);
  if (days < 30) return plural(days, "day");
  const months = Math.floor(days / 30);
  if (months < 12) return plural(months, "month");
  return plural(Math.floor(months / 12), "year");
}

function plural(n, unit) {
  return `${n} ${unit}${n === 1 ? "" : "s"} ago`;
}

// "Just now", "2 mins ago", "3 hours ago" ... from an age in minutes.
export function formatMinutesAgo(minutes) {
  const m = Number(minutes);
  if (!Number.isFinite(m) || m < 1) return "Just now";
  if (m < 60) return `${Math.floor(m)} min${Math.floor(m) === 1 ? "" : "s"} ago`;
  return formatHoursAgo(m / 60);
}

export function formatDateTime(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatClock(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const m = Math.floor(s / 60);
  const r = String(s % 60).padStart(2, "0");
  return `${m}:${r}`;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
