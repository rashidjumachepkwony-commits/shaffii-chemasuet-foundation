import { Hono } from "hono";
import { ok, serverError, paginatedResponse, extractPaginationParams } from "../utils/response";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

app.get("/", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const action = c.req.query("action");
  const actorId = c.req.query("actor_id");

  const supabase = c.get("supabase");
  let query = supabase.from("audit_logs").select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `action.ilike.%${search}%,table_name.ilike.%${search}%`
    );
  }
  if (action) {
    query = query.eq("action", action);
  }
  if (actorId) {
    query = query.eq("actor_id", actorId);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError(c, error.message);
  }
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

export default app;
