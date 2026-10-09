import { Hono } from "hono";
import { z } from "zod";
import { ok, badRequest, serverError, notFound, paginatedResponse, extractPaginationParams, forbidden, created } from "../utils/response";
import { supportRequestSchema } from "../validation/support";
import { requirePermission } from "../middleware/auth";
import { log } from "../utils/logger";

const statusSchema = z.enum(["New", "Under Review", "Approved", "In Progress", "Completed", "Rejected", "Closed"]);

// Public router - for submitting support requests (no auth required)
const publicRouter = new Hono<{
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    WORKER_AUTH_SECRET: string;
    ENVIRONMENT: string;
  };
  Variables: {
    supabase: any;
  };
}>();

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
      return serverError(c, "Failed to submit support request. Please check your connection and try again.");
    }

    return created(c, {
      message: "Support request submitted successfully",
      reference: result?.reference_number || result?.id,
    });
  } catch (e: any) {
    return serverError(c, "Something went wrong. Please try again later.");
  }
});

// Admin router - for managing support requests (requires "support.manage" permission)
const adminRouter = new Hono<{
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

adminRouter.get("/", async (c) => {
  return requirePermission("support.manage", c, async () => {
    try {
      const { page, limit, offset } = extractPaginationParams(c);
      const supabase = c.get("supabase");
      const search = c.req.query("search");
      const status = c.req.query("status");
      const supportType = c.req.query("support_type");
      const county = c.req.query("county");

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
        return serverError(c, "Failed to fetch support requests");
      }

      return paginatedResponse(c, data || [], page, limit, count || 0);
    } catch (e: any) {
      return serverError(c, "Something went wrong.");
    }
  });
});

adminRouter.get("/:id", async (c) => {
  return requirePermission("support.manage", c, async () => {
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
});

adminRouter.patch("/:id/status", async (c) => {
  return requirePermission("support.manage", c, async () => {
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
});

export { publicRouter, adminRouter };
export default publicRouter;
