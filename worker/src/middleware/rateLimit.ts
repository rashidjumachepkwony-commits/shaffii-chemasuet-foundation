import type { Context } from "hono";
import { log } from "../utils/logger";

interface RateLimitState {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitState>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_REQUESTS = 20;

export async function rateLimit(context: Context, next: () => Promise<void>) {
  const ip = context.req.header("cf-connecting-ip") ||
             context.req.header("x-forwarded-for") ||
             context.req.header("x-real-ip") ||
             "unknown";

  const isAuthEndpoint =
    context.req.path.includes("/login") ||
    context.req.path.includes("/register") ||
    context.req.path.includes("/register") ||
    context.req.path.includes("/reset-password");

  const maxRequests = isAuthEndpoint ? AUTH_MAX_REQUESTS : MAX_REQUESTS;
  const windowMs = isAuthEndpoint ? AUTH_WINDOW_MS : WINDOW_MS;

  const key = `${ip}:${context.req.path}`;
  const now = Date.now();
  const state = rateLimitStore.get(key);

  if (state) {
    if (now < state.resetTime) {
      if (state.count >= maxRequests) {
        log("warn", { msg: "Rate limit exceeded", ip, path: context.req.path });
        return context.json(
          { success: false, error: "Too many requests. Please try again later." },
          429
        );
      }
      state.count++;
    } else {
      state.count = 1;
      state.resetTime = now + windowMs;
    }
  } else {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
  }

  await next();
}
