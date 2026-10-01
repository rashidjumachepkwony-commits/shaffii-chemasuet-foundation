export type RoleName =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EVENT_MANAGER"
  | "CONTENT_MANAGER"
  | "USER";

export type Permission =
  | "events.view"
  | "events.create"
  | "events.update"
  | "events.delete"
  | "events.publish"
  | "registrations.view"
  | "registrations.manage"
  | "attendance.view"
  | "attendance.manage"
  | "users.view"
  | "users.manage"
  | "projects.create"
  | "projects.update"
  | "projects.delete"
  | "news.create"
  | "news.update"
  | "news.delete"
  | "news.publish"
  | "gallery.manage"
  | "volunteers.manage"
  | "donations.manage"
  | "settings.manage"
  | "audit_logs.view"
  | "messages.manage"
  | "contact.manage";

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  SUPER_ADMIN: [
    "events.view",
    "events.create",
    "events.update",
    "events.delete",
    "events.publish",
    "registrations.view",
    "registrations.manage",
    "attendance.view",
    "attendance.manage",
    "users.view",
    "users.manage",
    "projects.create",
    "projects.update",
    "projects.delete",
    "news.create",
    "news.update",
    "news.delete",
    "news.publish",
    "gallery.manage",
    "volunteers.manage",
    "donations.manage",
    "settings.manage",
    "audit_logs.view",
    "messages.manage",
    "contact.manage",
  ],
  ADMIN: [
    "events.view",
    "events.create",
    "events.update",
    "events.delete",
    "events.publish",
    "registrations.view",
    "registrations.manage",
    "attendance.view",
    "attendance.manage",
    "users.view",
    "users.manage",
    "projects.create",
    "projects.update",
    "projects.delete",
    "news.create",
    "news.update",
    "news.delete",
    "news.publish",
    "gallery.manage",
    "volunteers.manage",
    "donations.manage",
    "settings.manage",
    "audit_logs.view",
    "messages.manage",
    "contact.manage",
  ],
  EVENT_MANAGER: [
    "events.view",
    "events.create",
    "events.update",
    "events.publish",
    "registrations.view",
    "registrations.manage",
    "attendance.view",
    "attendance.manage",
  ],
  CONTENT_MANAGER: [
    "events.view",
    "events.publish",
    "projects.create",
    "projects.update",
    "projects.delete",
    "news.create",
    "news.update",
    "news.delete",
    "news.publish",
    "gallery.manage",
    "messages.manage",
  ],
  USER: [],
};

export type UserRole = RoleName;

export interface JwtPayload {
  sub: string;
  email?: string;
  role: string;
  aud: string | string[];
  exp: number;
  iat: number;
  jti: string;
}

export type UUID = string;

export interface BaseEntity {
  id: UUID;
  created_at: string;
  updated_at: string;
}

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

export interface EventCategory {
  id: UUID;
  name: string;
  slug: string;
  color: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: UUID;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  featured_image: string | null;
  category_id: UUID | null;
  category: EventCategory | null;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string | null;
  location: string | null;
  organizer: string | null;
  contact_information: string | null;
  registration_deadline: string | null;
  capacity: number | null;
  registration_enabled: boolean;
  published: boolean;
  status: EventStatus;
  created_by: UUID | null;
  updated_by: UUID | null;
  created_at: string;
  updated_at: string;
}

export type RegistrationStatus =
  | "REGISTERED"
  | "CHECKED_IN"
  | "DID_NOT_ATTEND"
  | "CANCELLED";

export interface EventRegistration {
  id: UUID;
  event_id: UUID;
  user_id: UUID | null;
  registration_reference: string;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  attendee_count: number;
  notes: string | null;
  status: RegistrationStatus;
  created_at: string;
  updated_at: string;
  event?: Event;
}

export interface Profile {
  id: UUID;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  organization: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: UUID;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  featured_image: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  created_by: UUID | null;
  updated_by: UUID | null;
  created_at: string;
  updated_at: string;
}

export type NewsStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface News {
  id: UUID;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category: string | null;
  author: string | null;
  published_date: string | null;
  status: NewsStatus;
  created_by: UUID | null;
  updated_by: UUID | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: UUID;
  image_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  category: string | null;
  alt_text: string | null;
  sort_order: number;
  uploaded_by: UUID | null;
  created_at: string;
}

export type VolunteerStatus = "NEW" | "REVIEWING" | "APPROVED" | "DECLINED" | "CONTACTED";

export interface Volunteer {
  id: UUID;
  full_name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  area_of_interest: string | null;
  availability: string | null;
  experience: string | null;
  message: string | null;
  status: VolunteerStatus;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: UUID;
  donor_name: string | null;
  donor_email: string | null;
  amount: number;
  currency: string;
  payment_method: string | null;
  status: string;
  reference: string | null;
  created_at: string;
}

export type ContactStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export interface ContactMessage {
  id: UUID;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: UUID;
  key: string;
  value: string;
  type: string;
  group: string;
  label: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type AuditAction = string;

export interface AuditLog {
  id: UUID;
  actor_id: UUID | null;
  action: AuditAction;
  table_name: string | null;
  record_id: UUID | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Notification {
  id: UUID;
  user_id: UUID | null;
  title: string;
  message: string;
  type: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
