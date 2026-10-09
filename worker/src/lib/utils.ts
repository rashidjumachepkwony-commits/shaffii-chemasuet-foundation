import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { Permission, RoleName } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { twMerge, clsx };

export function hasPermission(
  permissions: Permission[] | undefined,
  permission: Permission
): boolean {
  if (!permissions) return false;
  return permissions.includes(permission);
}

export function can(permissions: Permission[] | undefined, permission: Permission) {
  return hasPermission(permissions, permission);
}

export function formatDate(date: string | Date, locale = "en-GB"): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: string | Date, locale = "en-GB"): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDateRange(
  startDate: string,
  endDate: string,
  locale = "en-GB"
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    return `${formatDate(start, locale)} • ${formatTime(start)} - ${formatTime(end)}`;
  }
  return `${formatDate(start, locale)} - ${formatDate(end, locale)}`;
}

export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateRegistrationReference(date: Date): string {
  const year = date.getFullYear();
  const now = Date.now();
  const counter = now % 1000000;
  return `SCF-EVT-${year}-${String(counter).padStart(6, "0")}`;
}

export function getRoleBadgeColor(role: RoleName): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-purple-100 text-purple-800";
    case "ADMIN":
      return "bg-blue-100 text-blue-800";
    case "EVENT_MANAGER":
      return "bg-emerald-100 text-emerald-800";
    case "CONTENT_MANAGER":
      return "bg-amber-100 text-amber-800";
    case "USER":
      return "bg-neutral-100 text-neutral-800";
    default:
      return "bg-neutral-100 text-neutral-800";
  }
}

export function getEventStatusColor(
  status: string
): { bg: string; text: string } {
  switch (status.toUpperCase()) {
    case "PUBLISHED":
      return { bg: "bg-emerald-100", text: "text-emerald-800" };
    case "DRAFT":
      return { bg: "bg-neutral-100", text: "text-neutral-800" };
    case "CANCELLED":
      return { bg: "bg-red-100", text: "text-red-800" };
    case "COMPLETED":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    default:
      return { bg: "bg-neutral-100", text: "text-neutral-800" };
  }
}

export function getRegistrationStatusColor(
  status: string
): { bg: string; text: string } {
  switch (status.toUpperCase()) {
    case "CHECKED_IN":
      return { bg: "bg-emerald-100", text: "text-emerald-800" };
    case "REGISTERED":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "DID_NOT_ATTEND":
      return { bg: "bg-amber-100", text: "text-amber-800" };
    case "CANCELLED":
      return { bg: "bg-red-100", text: "text-red-800" };
    default:
      return { bg: "bg-neutral-100", text: "text-neutral-800" };
  }
}
