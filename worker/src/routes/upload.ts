import { Hono } from "hono";
import { ok, badRequest, serverError } from "../utils/response";
import { allowedFileTypes } from "../validation";
import { requirePermission } from "../middleware/auth";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

app.post("/", async (c) => {
  const supabase = c.get("supabase");
  const user = c.get("user");

  if (!user) {
    return badRequest(c, "Authentication required");
  }

  try {
    const body = await c.req.parseBody();
    const file = body.file as File;
    const bucket = (body.bucket as string) || "event-images";

    const validBuckets = ["event-images", "project-images", "news-images", "gallery-images", "site-assets"];
    if (!validBuckets.includes(bucket)) {
      return badRequest(c, "Invalid storage bucket");
    }

    if (!file) {
      return badRequest(c, "No file provided");
    }

    if (file.size > MAX_FILE_SIZE) {
      return badRequest(c, "File size exceeds 5MB limit");
    }

    if (!allowedFileTypes.includes(file.type as any)) {
      return badRequest(c, "Invalid file type. Only images (JPG, PNG, GIF, WebP) are allowed");
    }

    const ext = ALLOWED_EXTENSIONS.find((e) =>
      file.name.toLowerCase().endsWith(e)
    );
    if (!ext) {
      return badRequest(c, "Invalid file extension");
    }

    const fileName = `${crypto.randomUUID()}${ext}`;
    const filePath = `${user.id}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return serverError(c, uploadError.message);
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return ok(c, {
      url: publicData?.publicUrl || uploadData?.path,
      path: uploadData?.path,
      bucket,
    });
  } catch (err: any) {
    return serverError(c, err.message);
  }
});

export default app;
