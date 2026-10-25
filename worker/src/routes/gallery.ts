import { Hono } from "hono";
import {
  ok,
  badRequest,
  serverError,
  paginatedResponse,
  extractPaginationParams,
} from "../utils/response";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi", ".wmv", ".mkv", ".flv"];

function inferMediaType(url: string): "image" | "video" {
  const lower = url.toLowerCase();
  for (const ext of VIDEO_EXTENSIONS) {
    if (lower.endsWith(ext) || lower.includes(ext + "?")) {
      return "video";
    }
  }
  return "image";
}

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

  const itemsWithMediaType = (data || []).map((item) => ({
    ...item,
    media_type: item.media_type || inferMediaType(item.image_url),
  }));

  return paginatedResponse(c, itemsWithMediaType, page, limit, count || 0);
});

export default app;
