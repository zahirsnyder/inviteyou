export const USER_ROLES = ["ADMIN", "CUSTOMER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const GUEST_STATUSES = [
  "INVITED",
  "OPENED",
  "RSVP_PENDING",
  "ATTENDING",
  "NOT_ATTENDING",
  "MAYBE",
] as const;
export type GuestStatus = (typeof GUEST_STATUSES)[number];

export const ATTENDANCE_OPTIONS = ["ATTENDING", "NOT_ATTENDING", "MAYBE"] as const;
export type Attendance = (typeof ATTENDANCE_OPTIONS)[number];

export const ANALYTICS_EVENTS = ["VISIT", "QR_SCAN", "RSVP_SUBMIT", "WISH_SUBMIT"] as const;
export type AnalyticsEventType = (typeof ANALYTICS_EVENTS)[number];

export const APP_NAME = "InviteYou";

/** Days after the wedding date that a live invitation stays publicly viewable. */
export const INVITATION_GRACE_DAYS = 90;
/** Length of a paid extension. */
export const INVITATION_EXTENSION_DAYS = 180;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Default expiry for a freshly locked invitation: wedding date + grace period. */
export function defaultExpiry(weddingDate: Date): Date {
  return new Date(weddingDate.getTime() + INVITATION_GRACE_DAYS * DAY_MS);
}

/** Push an expiry out by one extension, from whichever is later: now or current expiry. */
export function extendedExpiry(current: Date | null): Date {
  const base = Math.max(Date.now(), current?.getTime() ?? 0);
  return new Date(base + INVITATION_EXTENSION_DAYS * DAY_MS);
}

/** True once `expiresAt` is in the past. Null = no expiry set. */
export function isExpired(expiresAt: Date | null | undefined): boolean {
  return !!expiresAt && Date.now() > expiresAt.getTime();
}

/** True when `expiresAt` is set, not yet passed, and within `days` from now. */
export function expiresWithin(expiresAt: Date | null | undefined, days: number): boolean {
  if (!expiresAt) return false;
  const remaining = expiresAt.getTime() - Date.now();
  return remaining > 0 && remaining < days * DAY_MS;
}

export function appUrl(path = ""): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}
