import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .min(7, "Please enter a valid phone number")
      .max(20, "Phone number is too long"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const eventRegistrationSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(7, "Please enter a valid phone number")
    .max(20),
  organization: z.string().max(100, "Organization name is too long").optional(),
  attendee_count: z
    .number()
    .min(1, "You must register at least 1 attendee")
    .max(20, "Maximum 20 attendees per registration"),
  notes: z.string().max(500, "Notes are too long (max 500 characters)").optional(),
});

export const contactMessageSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .optional(),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long (max 2000 characters)"),
});

export const volunteerSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  area_of_interest: z.string().optional(),
  availability: z.string().optional(),
  experience: z.string().optional(),
  message: z.string().max(1000, "Message is too long").optional(),
});

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  short_description: z.string().max(500, "Short description is too long").optional(),
  full_description: z.string().optional(),
  category_id: z.string().uuid("Invalid category ID").optional(),
  event_date: z.string().min(1, "Event date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  venue: z.string().max(200, "Venue is too long").optional(),
  location: z.string().max(200, "Location is too long").optional(),
  organizer: z.string().max(200, "Organizer is too long").optional(),
  contact_information: z.string().max(200, "Contact information is too long").optional(),
  registration_deadline: z.string().optional(),
  capacity: z
    .number()
    .min(1, "Capacity must be at least 1")
    .max(100000, "Capacity is too large")
    .optional(),
  registration_enabled: z.boolean(),
  published: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]),
});

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  summary: z.string().max(500).optional(),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"]),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  location: z.string().max(200).optional(),
});
