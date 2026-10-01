import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const eventRegistrationSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name is required")
    .max(100),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Valid phone number required")
    .max(20),
  organization: z.string().max(100).optional(),
  attendee_count: z
    .coerce.number()
    .min(1, "At least 1 attendee required")
    .max(20, "Maximum 20 attendees"),
  notes: z.string().max(500).optional(),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
});

export const volunteerSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  area_of_interest: z.string().optional(),
  availability: z.string().optional(),
  experience: z.string().max(1000).optional(),
  message: z.string().max(1000).optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  short_description: z.string().max(500).optional(),
  full_description: z.string().optional(),
  featured_image: z.string().url().optional(),
  category_id: uuidSchema.optional(),
  event_date: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  venue: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  organizer: z.string().max(200).optional(),
  contact_information: z.string().max(200).optional(),
  registration_deadline: z.string().optional(),
  capacity: z.coerce.number().min(1).max(100000).optional(),
  registration_enabled: z.boolean().default(true),
  published: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]),
});

export const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1),
  summary: z.string().max(500).optional(),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"]),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  location: z.string().max(200).optional(),
});

export const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export const fileUploadSchema = z.object({
  bucket: z.enum(["event-images", "project-images", "news-images", "gallery-images", "site-assets"]),
  file: z.any(),
  caption: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  alt_text: z.string().max(200).optional(),
});
