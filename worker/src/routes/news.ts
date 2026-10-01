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
  const category = c.req.query("category");

  const supabase = c.get("supabase");
  let query = supabase.from("news").select("*", { count: "exact" });

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query
    .eq("status", "PUBLISHED")
    .order("published_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError(c, error.message);
  }
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.get("/:slug", async (c) => {
  const supabase = c.get("supabase");
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", c.req.param("slug"))
    .eq("status", "PUBLISHED")
    .single();

  if (error || !data) {
    return badRequest(c, "News article not found");
  }
  return ok(c, data);
});

export default app;
