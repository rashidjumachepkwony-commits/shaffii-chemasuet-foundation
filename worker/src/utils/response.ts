import { type Context } from "hono";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

export function ok<T>(c: Context, data: T, meta?: Record<string, unknown>): Response {
  return c.json({ success: true, data, ...(meta ? { meta } : {}) }, 200);
}

export function created<T>(c: Context, data: T, meta?: Record<string, unknown>): Response {
  return c.json({ success: true, data, ...(meta ? { meta } : {}) }, 201);
}

export function badRequest(c: Context, error: string): Response {
  return c.json({ success: false, error }, 400);
}

export function unauthorized(c: Context, error = "Unauthorized"): Response {
  return c.json({ success: false, error }, 401);
}

export function forbidden(c: Context, error = "Forbidden"): Response {
  return c.json({ success: false, error }, 403);
}

export function notFound(c: Context, error = "Not found"): Response {
  return c.json({ success: false, error }, 404);
}

export function conflict(c: Context, error: string): Response {
  return c.json({ success: false, error }, 409);
}

export function serverError(c: Context, error = "Internal server error"): Response {
  return c.json({ success: false, error }, 500);
}

export function paginatedResponse<T>(
  c: Context,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response {
  const totalPages = Math.ceil(total / limit);
  return c.json({
    success: true,
    data,
    meta: { page, limit, total, totalPages },
  }, 200);
}

export function extractPaginationParams(c: Context) {
  const page = Math.max(1, parseInt(c.req.query("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query("limit") || "20")));
  return { page, limit, offset: (page - 1) * limit };
}

export function tooManyRequests(c: Context, error = 'Too many requests'): Response {
  return c.json({ success: false, error }, 429);
}
