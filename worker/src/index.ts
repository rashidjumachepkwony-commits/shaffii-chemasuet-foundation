import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import { secureHeaders } from "hono/secure-headers";
import { rateLimit } from "./middleware/rateLimit";
import { authenticate } from "./middleware/auth";
import { createSupabaseServerClient } from "./services/supabase";
import eventsRouter from "./routes/events";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import projectsRouter from "./routes/projects";
import newsRouter from "./routes/news";
import galleryRouter from "./routes/gallery";
import volunteersRouter from "./routes/volunteers";
import donationsRouter from "./routes/donations";
import contactRouter from "./routes/contact";
import uploadRouter from "./routes/upload";
import dashboardRouter from "./routes/dashboard";
import { log } from "./utils/logger";
import { ok, serverError } from "./utils/response";

const app = new Hono<{
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    WORKER_AUTH_SECRET: string;
    ENVIRONMENT: string;
  };
  Variables: {
    user: any;
    supabase: any;
    role: string | null;
    permissions: string[];
  };
}>();

app.use("*", cors({
  origin: [
    "https://shaffii-chemasuet-foundation.pages.dev",
    "https://*.shaffii-chemasuet-foundation.pages.dev",
    "https://shaffiichemasuetfoundation.co.ke",
    "https://www.shaffiichemasuetfoundation.co.ke",
    "http://localhost:3000",
    "https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev"
  ],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use("*", secureHeaders({
  xFrameOptions: "DENY",
  xContentTypeOptions: true,
  referrerPolicy: "no-referrer-when-downgrade",
  xXssProtection: true,
  strictTransportSecurity: "max-age=31536000; includeSubDomains; preload",
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:", "blob:"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    connectSrc: ["'self'", "https:", "wss:"],
    frameAncestors: ["'none'"],
  },
}));

app.use("*", logger());
app.use("*", timing());
app.use("*", rateLimit);

app.use("*", async (c, next) => {
  c.set("supabase", createSupabaseServerClient(c));
  await next();
});

app.use("/api/*", async (c, next) => {
  await authenticate(c, next);
});

const publicSettingsRouter = new Hono<{
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  };
  Variables: {
    supabase: ReturnType<typeof createSupabaseServerClient>;
  };
}>();
publicSettingsRouter.get("/", async (c) => {
  const supabase = c.get("supabase") || createSupabaseServerClient(c);
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("is_public", true);
  if (error) {
    return serverError(c, error.message);
  }
  return ok(c, data || []);
});

app.route("/api/events", eventsRouter);
app.route("/api/auth", authRouter);
app.route("/api/dashboard", dashboardRouter);
app.route("/api/admin", adminRouter);
app.route("/api/projects", projectsRouter);
app.route("/api/news", newsRouter);
app.route("/api/gallery", galleryRouter);
app.route("/api/volunteers", volunteersRouter);
app.route("/api/donations", donationsRouter);
app.route("/api/contact", contactRouter);
app.route("/api/upload", uploadRouter);
app.route("/api/support", publicRouter);
app.route("/api/admin/support", supportAdminRouter);
app.route("/api/public/settings", publicSettingsRouter);

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Shafie Chemasuet Foundation API",
    version: "1.0.0",
  });
});

app.notFound((c) => c.json({ success: false, error: "Not found" }, 404));
app.onError((e, c) => {
  log("error", { msg: "Internal server error", error: e.message, stack: e.stack });
  return c.json({ success: false, error: "Internal server error" }, 500);
});

export default app;

import { publicRouter } from './routes/support';
import { adminRouter as supportAdminRouter } from './routes/support';