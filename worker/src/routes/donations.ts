import { Hono } from "hono";
import {
  ok,
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

  const supabase = c.get("supabase");
  const { data, error, count } = await supabase
    .from("donations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError(c, error.message);
  }
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const supabase = c.get("supabase");

  const { data, error } = await supabase.from("donations").insert({
    donor_name: body.donor_name || null,
    donor_email: body.donor_email || null,
    amount: body.amount,
    currency: body.currency || "KES",
    payment_method: body.payment_method || "pending",
    status: "pending",
    reference: body.reference || null,
  }).select().single();

  if (error) {
    return serverError(c, error.message);
  }
  return ok(c, data);
});

export default app;
