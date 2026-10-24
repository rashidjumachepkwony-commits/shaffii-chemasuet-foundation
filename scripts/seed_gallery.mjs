const WORKER_URL = "https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev";

const unusedImages = [
  { filename: "shaffi77.jpg", caption: "Shafie Chemasuet Foundation - Community gathering", category: "Community" },
  { filename: "shaffi4.jpg", caption: "Shafie Chemasuet Foundation - Community event", category: "Community" },
  { filename: "shaffi3.jpg", caption: "Shafie Chemasuet Foundation - Community meeting", category: "Community" },
  { filename: "shaffi000.jpg", caption: "Shafie Chemasuet Foundation - Official event", category: "Community" },
  { filename: "sahffi 1.jpg", caption: "Shafie Chemasuet Foundation - Community outreach program", category: "Community" },
  { filename: "shaffi and president.jpg", caption: "Shafie Chemasuet with the President", category: "Events" },
  { filename: "shaffi 2.jpg", caption: "Shafie Chemasuet Foundation - Community program", category: "Community" },
  { filename: "shaffivb.jpg", caption: "Shafie Chemasuet Foundation - Event gathering", category: "Community" },
  { filename: "shaffillllkk.jpg", caption: "Shafie Chemasuet Foundation - Community event", category: "Community" },
  { filename: "shaffillll.jpg", caption: "Shafie Chemasuet Foundation - Community gathering", category: "Community" },
  { filename: "shaffill.jpg", caption: "Shafie Chemasuet Foundation - Community event", category: "Community" },
  { filename: "shaffiklop.jpg", caption: "Shafie Chemasuet Foundation - Community program", category: "Community" },
  { filename: "shaffikkkkk.jpg", caption: "Shafie Chemasuet Foundation - Community outreach", category: "Community" },
  { filename: "shaffikkk.jpg", caption: "Shafie Chemasuet Foundation - Community gathering", category: "Community" },
  { filename: "shaffiiii.jpg", caption: "Shafie Chemasuet Foundation - Event", category: "Community" },
  { filename: "shaffifffff.jpg", caption: "Shafie Chemasuet Foundation - Community program", category: "Community" },
  { filename: "shaffie.jpg", caption: "Shafie Chemasuet Foundation - Event", category: "Community" },
  { filename: "shaffi999.jpg", caption: "Shafie Chemasuet Foundation - Community event", category: "Community" },
  { filename: "shaffivvv.jpg", caption: "Shafie Chemasuet Foundation - Community gathering", category: "Community" },
];

async function main() {
  console.log(`Inserting ${unusedImages.length} gallery items...`);
  let success = 0;
  let failed = 0;

  for (let i = 0; i < unusedImages.length; i++) {
    const img = unusedImages[i];
    const imageUrl = `/images/${encodeURIComponent(img.filename)}`;
    const body = {
      image_url: imageUrl,
      thumbnail_url: null,
      caption: img.caption,
      category: img.category,
      alt_text: img.caption,
      sort_order: 100 + i,
    };

    try {
      const res = await fetch(`${WORKER_URL}/api/admin/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`[${i + 1}/${unusedImages.length}] OK: ${img.filename} -> ${data?.data?.id || "created"}`);
        success++;
      } else {
        const data = await res.json().catch(() => ({}));
        console.log(`[${i + 1}/${unusedImages.length}] FAIL: ${img.filename} - ${res.status} ${JSON.stringify(data)}`);
        failed++;
      }
    } catch (err) {
      console.log(`[${i + 1}/${unusedImages.length}] ERROR: ${img.filename} - ${err.message}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDone. Success: ${success}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
