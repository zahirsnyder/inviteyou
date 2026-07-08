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

export function appUrl(path = ""): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}
