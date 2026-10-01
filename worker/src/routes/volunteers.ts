import { Hono } from "hono";
import { ok, badRequest, serverError } from "../utils/response";
import { volunteerSchema } from "../validation";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

app.post("/", async (c) => {
  const body = await c.req.json();
  const valid = volunteerSchema.safeParse(body);
  if (!valid.success) {
    return badRequest(c, valid.error.errors[0]?.message || "Validation failed");
  }

  const supabase = c.get("supabase");
  const { data, error } = await supabase
    .from("volunteers")
    .insert({ ...valid.data, status: "NEW" })
    .select()
    .single();

  if (error) {
    return serverError(c, error.message);
  }
  return ok(c, data);
});

export default app;
