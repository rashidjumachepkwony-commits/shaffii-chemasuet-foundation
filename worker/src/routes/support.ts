import { Hono } from "hono";
import { z } from "zod";
import { ok, badRequest, serverError, notFound, paginatedResponse, extractPaginationParams, forbidden, created } from "../utils/response";
import { supportRequestSchema } from "../validation/support";
import { requirePermission } from "../middleware/auth";
import { log } from "../utils/logger";

const supportRouter = new Hono<{
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  };
  Variables: {
    user: any;
    supabase: any;
    role: string | null;
    permissions: string[];
  };
}>();

const statusSchema = z.enum(["New", "Under Review", "Approved", "In Progress", "Completed", "Rejected", "Closed"]);

// Public endpoint - submit a support request
const publicRouter = new Hono();

publicRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = supportRequestSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(c, parsed.error.errors.map((e) => e.message).join("; "));
    }

    const data = parsed.data;
    const supabase = c.get("supabase");

    const { data: result, error } = await supabase
      .from("support_requests")
      .insert({
        ...data,
        country: data.country || "Kenya",
      })
      .select("reference_number, id")
      .single();

    if (error) {
      log("error", { error: error.message });
      return serverError(c, "Failed to submit support request. Please check your connection and try again.");
    }

    return created(c, {
      message: "Support request submitted successfully",
      reference: result?.reference_number || result?.id,
    });
  } catch (e: any) {
    log("error", { error: e.message });
    return serverError(c, "Something went wrong. Please try again later.");
  }
});

// Admin endpoints - require appropriate permissions
supportRouter.use("/admin/*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return badRequest(c, "Not authenticated");
  }
  const permissions: string[] = c.get("permissions") || [];
  const hasPermission = permissions.includes("support.manage");
  if (!hasPermission) {
    return forbidden(c, "You do not have permission to manage support requests");
  }
  await next();
});

supportRouter.get("/admin", async (c) => {
  try {
    const { page, limit, search, status, supportType, county } = extractRequest(c);
    const supabase = c.get("supabase");
    const { offset } = extractPaginationParams(page, limit);

    let query = supabase.from("support_requests").select("*", { count: "exact" });
    query = query.order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (supportType) {
      query = query.eq("support_type", supportType);
    }
    if (county) {
      query = query.eq("county", county);
    }
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,phone_number.ilike.%${search}%,reference_number.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      log("error", { error: error.message });
      return serverError(c, "Failed to fetch support requests");
    }

    return paginatedResponse(c, data || [], page, limit, count || 0);
  } catch (e: any) {
    log("error", { error: e.message });
    return serverError(c, "Something went wrong.");
  }
});

supportRouter.get("/admin/:id", async (c) => {
  try {
    const supabase = c.get("supabase");
    const { id } = c.req.param();

    const { data, error } = await supabase
      .from("support_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return notFound(c, "Support request not found");
    }

    return ok(c, data);
  } catch (e: any) {
    return serverError(c, "Something went wrong.");
  }
});

supportRouter.patch("/admin/:id/status", async (c) => {
  try {
    const supabase = c.get("supabase");
    const { id } = c.req.param();
    const body = await c.req.json();

    const parsed = statusSchema.safeParse(body.status);
    if (!parsed.success) {
      return badRequest(c, "Invalid status");
    }

    const { data, error } = await supabase
      .from("support_requests")
      .update({
        status: body.status,
        ...(body.internal_notes ? { internal_notes: body.internal_notes } : {}),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return serverError(c, "Failed to update status");
    }

    return ok(c, data);
  } catch (e: any) {
    return serverError(c, "Something went wrong.");
  }
});

function extractRequest(c: any) {
  const url = new URL(c.req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);
  const search = url.searchParams.get("search") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const supportType = url.searchParams.get("support_type") || undefined;
  const county = url.searchParams.get("county") || undefined;
  return { page, limit, search, status, supportType, county, supabase: c.get("supabase") };
}

export default supportRouter;
