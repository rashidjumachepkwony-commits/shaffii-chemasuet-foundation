const WORKER_URL = "https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev";
const migrationSql = `ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')); ALTER TABLE events ADD COLUMN IF NOT EXISTS featured_video TEXT; ALTER TABLE news ADD COLUMN IF NOT EXISTS video_url TEXT; CREATE INDEX IF NOT EXISTS idx_gallery_media_type ON gallery_items(media_type);`;

fetch(`${WORKER_URL}/_migrate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: migrationSql }),
})
  .then((res) => res.json().catch(() => ({ raw: res.statusText })))
  .then((data) => {
    console.log("Status:", 200);
    console.log("Response:", JSON.stringify(data, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
