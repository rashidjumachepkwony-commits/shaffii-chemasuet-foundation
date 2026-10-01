import { Hono } from "hono";
import {
  ok,
  badRequest,
  serverError,
  paginatedResponse,
  extractPaginationParams,
} from "../utils/response";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

app.get("/", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const status = c.req.query("status");

  const supabase = c.get("supabase");
  let query = supabase.from("projects").select("*", { count: "exact" });

  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError(c, error.message);
  }
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.get("/:slug", async (c) => {
  const supabase = c.get("supabase");
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", c.req.param("slug"))
    .single();

  if (error || !data) {
    return badRequest(c, "Project not found");
  }
  return ok(c, data);
});

export default app;
