import { Hono } from "hono";
import { ok, badRequest, serverError, paginatedResponse, extractPaginationParams } from "../utils/response";
import { logAudit } from "../middleware/auth";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

app.get("/", async (c) => {
  const user = c.get("user");
  if (!user) {
    return badRequest(c, "Authentication required");
  }

  const supabase = c.get("supabase");
  const today = new Date().toISOString().split("T")[0];

  const [registrationsRes, profileRes] = await Promise.all([
    supabase
      .from("event_registrations")
      .select(
        `
        *,
        event:events!inner(id, title, slug, event_date, venue, start_time, status, featured_image)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ]);

  const registrations = registrationsRes.data || [];

  const upcoming = registrations.filter(
    (r: any) => new Date(r.event.event_date) > new Date() && r.status !== "CANCELLED"
  );
  const past = registrations.filter(
    (r: any) => new Date(r.event.event_date) < new Date() || r.status === "CHECKED_IN" || r.status === "DID_NOT_ATTEND"
  );

  const stats = {
    upcoming_events: upcoming.length,
    total_registrations: registrations.length,
    attended: registrations.filter((r: any) => r.status === "CHECKED_IN").length,
  };

  return ok(c, {
    profile: profileRes.data ? {
      id: profileRes.data.id,
      full_name: profileRes.data.full_name,
      email: profileRes.data.email,
      phone: profileRes.data.phone,
      organization: profileRes.data.organization,
      avatar_url: profileRes.data.avatar_url,
      created_at: profileRes.data.created_at,
      updated_at: profileRes.data.updated_at,
    } : null,
    upcoming_registrations: upcoming,
    past_registrations: past,
    stats,
  });
});

app.get("/registrations", async (c) => {
  const user = c.get("user");
  if (!user) {
    return badRequest(c, "Authentication required");
  }

  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");

  const supabase = c.get("supabase");
  let query = supabase
    .from("event_registrations")
    .select(
      `
      *,
      event:events!inner(id, title, slug, event_date, venue, start_time, status, featured_image)
      `,
      { count: "exact" }
    )
    .eq("user_id", user.id);

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,registration_reference.ilike.%${search}%,event.title.ilike.%${search}%`
    );
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
