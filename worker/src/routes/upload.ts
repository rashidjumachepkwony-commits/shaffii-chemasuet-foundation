import { Hono } from "hono";
import { ok, badRequest, serverError } from "../utils/response";
import { allowedFileTypes, allowedVideoTypes, allowedImageExtensions, allowedVideoExtensions } from "../validation";
import { requirePermission } from "../middleware/auth";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

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
    const requestedMediaType = (body.media_type as string) || "auto";

    const validBuckets = ["event-images", "project-images", "news-images", "gallery-images", "site-assets"];
    if (!validBuckets.includes(bucket)) {
      return badRequest(c, "Invalid storage bucket");
    }

    if (!file) {
      return badRequest(c, "No file provided");
    }

    const isVideo = allowedVideoTypes.includes(file.type as any);
    const isImage = allowedFileTypes.includes(file.type as any);

    if (!isImage && !isVideo) {
      return badRequest(c, "Invalid file type. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, MOV, AVI, WMV) are allowed");
    }

    let mediaType: "image" | "video";
    if (requestedMediaType === "video" || isVideo) {
      mediaType = "video";
    } else {
      mediaType = "image";
    }

    const maxSize = mediaType === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      return badRequest(c, `File size exceeds ${mediaType === "video" ? "50MB" : "5MB"} limit`);
    }

    const allowedExts = mediaType === "video" ? allowedVideoExtensions : allowedImageExtensions;
    const ext = allowedExts.find((e) => file.name.toLowerCase().endsWith(e));
    if (!ext) {
      return badRequest(c, `Invalid file extension for ${mediaType}`);
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
      media_type: mediaType,
    });
  } catch (err: any) {
    return serverError(c, err.message);
  }
});

export default app;
