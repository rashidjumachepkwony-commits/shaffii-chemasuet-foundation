import { Hono } from "hono";
import { eventRegistrationSchema } from "../validation";
import {
  ok,
  badRequest,
  serverError,
  paginatedResponse,
  extractPaginationParams,
} from "../utils/response";
import { logAudit } from "../middleware/auth";
import { generateRegistrationReference } from "../../src/lib/utils";

const app = new Hono<{
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    ENVIRONMENT: string;
  };
  Variables: {
    user: any;
    supabase: any;
    role: string | null;
    permissions: string[];
  };
}>();

function transformEvent(event: any) {
  if (!event) return null;
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    short_description: event.short_description,
    full_description: event.full_description,
    featured_image: event.featured_image,
    category_id: event.category_id,
    category: event.categories
      ? {
          id: event.categories.id,
          name: event.categories.name,
          slug: event.categories.slug,
          color: event.categories.color,
          description: event.categories.description,
          created_at: event.categories.created_at,
          updated_at: event.categories.updated_at,
        }
      : null,
    event_date: event.event_date,
    start_time: event.start_time,
    end_time: event.end_time,
    venue: event.venue,
    location: event.location,
    organizer: event.organizer,
    contact_information: event.contact_information,
    registration_deadline: event.registration_deadline,
    capacity: event.capacity,
    registration_enabled: event.registration_enabled,
    published: event.published,
    status: event.status,
    created_by: event.created_by,
    updated_by: event.updated_by,
    created_at: event.created_at,
    updated_at: event.updated_at,
  };
}

app.get("/", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const supabase = c.get("supabase");
  const search = c.req.query("search");
  const category = c.req.query("category");
  const status = c.req.query("status") || "PUBLISHED";
  const upcoming = c.req.query("upcoming") === "true";
  const past = c.req.query("past") === "true";
  const eventId = c.req.query("id");

  let query = supabase.from("events").select(
    "*, categories:category_id (id, name, slug, color, description, created_at, updated_at)",
    { count: "exact" }
  );

  query = query.eq("status", status);

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,short_description.ilike.%${search}%,full_description.ilike.%${search}%`
    );
  }

  if (category) {
    query = query.eq("category_id", category);
  }

  if (upcoming) {
    const today = new Date().toISOString().split("T")[0];
    query = query.gte("event_date", today);
  }

  if (past) {
    const today = new Date().toISOString().split("T")[0];
    query = query.lt("event_date", today);
  }

  query = query.order("event_date", { ascending: upcoming ? true : false });

  if (eventId) {
    query = query.eq("id", eventId);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    return serverError(c, error.message);
  }

  return paginatedResponse(
    c,
    (data || []).map(transformEvent),
    page,
    limit,
    count || 0
  );
});

app.get("/categories", async (c) => {
  const supabase = c.get("supabase");
  const { data, error } = await supabase
    .from("event_categories")
    .select("*")
    .order("name");

  if (error) {
    return serverError(c, error.message);
  }

  return ok(c, data || []);
});

app.get("/stats", async (c) => {
  const supabase = c.get("supabase");

  const [eventsRes, registrationsRes] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("event_registrations").select("*", { count: "exact", head: true }),
  ]);

  return ok(c, {
    total_events: eventsRes.count || 0,
    total_registrations: registrationsRes.count || 0,
  });
});

app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const supabase = c.get("supabase");

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "*, categories:category_id (id, name, slug, color, description, created_at, updated_at)"
    )
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .single();

  if (error || !event) {
    return badRequest(c, "Event not found");
  }

  return ok(c, transformEvent(event));
});

app.get("/id/:id", async (c) => {
  const id = c.req.param("id");
  const supabase = c.get("supabase");

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "*, categories:category_id (id, name, slug, color, description, created_at, updated_at)"
    )
    .eq("id", id)
    .single();

  if (error || !event) {
    return badRequest(c, "Event not found");
  }

  return ok(c, transformEvent(event));
});

app.post("/:id/register", async (c) => {
  const eventId = c.req.param("id");
  const supabase = c.get("supabase");
  const user = c.get("user");
  const userId = user?.id;

  const body = await c.req.json();
  const valid = eventRegistrationSchema.safeParse(body);

  if (!valid.success) {
    return badRequest(c, valid.error.errors[0]?.message || "Validation failed");
  }

  const values = valid.data;

  const { data: canRegisterData, error: canRegisterError } = await supabase.rpc(
    "can_register_for_event",
    {
      p_user_id: userId || null,
      p_event_id: eventId,
      p_email: values.email,
    }
  );

  if (canRegisterError) {
    return badRequest(c, canRegisterError.message);
  }

  if (!canRegisterData || !canRegisterData[0]?.can_register) {
    const reason = canRegisterData?.[0]?.reason || "Registration is not available";
    return badRequest(c, reason);
  }

  const registrationReference = generateRegistrationReference(new Date());

  const { data, error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: eventId,
      user_id: userId || null,
      registration_reference: registrationReference,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      organization: values.organization || null,
      attendee_count: values.attendee_count,
      notes: values.notes || null,
      status: "REGISTERED",
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return badRequest(c, "You have already registered for this event.");
    }
    return serverError(c, error.message);
  }

  await logAudit(
    c,
    "REGISTRATION_CREATED",
    "event_registrations",
    data.id,
    null,
    { registration_reference: registrationReference }
  );

  return ok(c, {
    id: data.id,
    registration_reference: data.registration_reference,
  });
});

export default app;
