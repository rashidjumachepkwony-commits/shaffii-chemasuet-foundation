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
  const category = c.req.query("category");
  const search = c.req.query("search");

  const supabase = c.get("supabase");
  let query = supabase.from("gallery_items").select("*", { count: "exact" });

  if (category) {
    query = query.eq("category", category);
  }
  if (search) {
    query = query.or(`caption.ilike.%${search}%,alt_text.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order("sort_order", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError(c, error.message);
  }
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

export default app;
