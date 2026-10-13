import http from "http";

const HOST = "127.0.0.1";
const PORT = 8787;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({ host: HOST, port: PORT, path, method, headers: data ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } : {} }, (res) => {
      let b = "";
      res.on("data", (c) => (b += c));
      res.on("end", () => {
        let parsed;
        try { parsed = b ? JSON.parse(b) : null; } catch { parsed = b; }
        resolve({ status: res.statusCode, json: parsed });
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function show(label, r) {
  const s = typeof r.json === "object" && r.json ? JSON.stringify(r.json)?.slice(0, 200) : String(r.json).slice(0, 200);
  console.log(`${label}: HTTP ${r.status} | ${s}`);
}

(async () => {
  // 1. Create a test support request (public)
  const created = await request("POST", "/api/support", {
    full_name: "CMS Verify Test", id_number: "11111111", phone_number: "0722000001",
    email: "verify@test.com", country: "Kenya", county: "Nakuru", sub_county: "Rongai",
    ward: "Rongai", location: "Rongai", current_location: "Nakuru",
    support_type: "Education support", support_description: "Verification test for CMS",
    urgency: "Normal", people_needing_support: "1",
    preferred_contact_method: "SMS",
  });
  await show("POST /api/support (create)", created);
  const ref = created.json?.data?.reference;
  const fullRef = created.json?.data?.reference;

  // 2. Search + list to find the id
  const list = await request("GET", `/api/admin/support?search=${encodeURIComponent(String(fullRef))}`);
  await show("GET /api/admin/support?search=... (find)", list);
  const item = list.json?.data?.find?.((r) => r.reference_number === fullRef) || list.json?.data?.[0];
  const id = item?.id;
  console.log("Resolved support id:", id, "ref:", item?.reference_number);

  if (id) {
    // 3. Detail
    await show("GET /api/admin/support/:id", await request("GET", `/api/admin/support/${id}`));
    // 4. Field edit (PATCH /:id)
    await show("PATCH /api/admin/support/:id (edit name)", await request("PATCH", `/api/admin/support/${id}`, { full_name: "CMS Verified Name" }));
    // 5. Accept (PATCH /status -> Approved) -- "accept"
    await show("PATCH /api/admin/support/:id/status (accept)", await request("PATCH", `/api/admin/support/${id}/status`, { status: "Approved" }));
    // 6. Delete
    await show("DELETE /api/admin/support/:id", await request("DELETE", `/api/admin/support/${id}`));
  }

  // 7. Volunteers list + create + delete
  await show("GET /api/admin/volunteers", await request("GET", "/api/admin/volunteers?limit=3"));
  const v = await request("POST", "/api/admin/volunteers", { full_name: "CMS Verify Volunteer", email: "vol@test.com", phone: "0722000002", area_of_interest: "Teaching", availability: "Weekends" });
  await show("POST /admin/volunteers (create)", v);
  const vid = v.json?.data?.id;
  if (vid) await show("DELETE /admin/volunteers/:id", await request("DELETE", `/admin/volunteers/${vid}`));

  // 8. Read-only lists for other sections
  await show("GET /api/admin/donations", await request("GET", "/api/admin/donations?limit=3"));
  await show("GET /api/admin/events", await request("GET", "/api/admin/events?limit=3"));
  await show("GET /api/admin/contact", await request("GET", "/api/admin/contact?limit=3"));
  await show("GET /api/admin/users", await request("GET", "/api/admin/users?limit=3"));
  await show("GET /api/admin/projects", await request("GET", "/api/admin/projects?limit=3"));
  await show("GET /api/admin/news", await request("GET", "/api/admin/news?limit=3"));
  await show("GET /api/admin/gallery", await request("GET", "/api/admin/gallery?limit=3"));

  process.exit(0);
})().catch((e) => { console.error("SCRIPT ERROR:", e.message); process.exit(1); });
