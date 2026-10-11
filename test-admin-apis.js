const https = require("https");

const paths = [
  "/api/admin/dashboard",
  "/api/admin/users",
  "/api/admin/volunteers",
  "/api/admin/contact",
  "/api/admin/settings",
  "/api/admin/audit-logs",
  "/api/admin/support",
  "/api/admin/content",
  "/api/admin/projects",
  "/api/admin/news",
  "/api/admin/gallery",
  "/api/admin/donations",
  "/api/admin/content-sections",
];

let i = 0;
function next() {
  if (i >= paths.length) return;
  const p = paths[i++];
  https
    .get(
      {
        hostname: "shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev",
        path: p,
        headers: { Authorization: "Bearer dev-token" },
      },
      (res) => {
        let b = "";
        res.on("data", (d) => (b += d));
        res.on("end", () => {
          console.log(res.statusCode, p, b.slice(0, 130));
          next();
        });
      }
    )
    .on("error", (e) => {
      console.log("ERR", p, e.message);
      next();
    });
}
next();
