import { z } from "zod";
import { ATTENDANCE_OPTIONS } from "@/lib/constants";

export const registerSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password"),
});

export const projectSchema = z.object({
  brideName: z.string().min(1, "Bride name is required"),
  groomName: z.string().min(1, "Groom name is required"),
  weddingDate: z.string().min(1, "Wedding date is required"),
  title: z.string().optional(),
  quote: z.string().optional(),
  story: z.string().optional(),
  coverImageUrl: z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional(),
  musicUrl: z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional(),
  giftDetails: z.string().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venueName: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  mapUrl: z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional(),
});

export const rsvpSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().optional(),
  attendance: z.enum(ATTENDANCE_OPTIONS),
  paxCount: z.coerce.number().int().min(1).max(20),
  mealPreference: z.string().optional(),
  message: z.string().max(500).optional(),
});

export const wishSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  message: z.string().min(2, "Please write a message").max(500),
});

export const galleryImageSchema = z.object({
  imageUrl: z.string().url("Must be a valid image URL"),
  caption: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
export type WishInput = z.infer<typeof wishSchema>;
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
