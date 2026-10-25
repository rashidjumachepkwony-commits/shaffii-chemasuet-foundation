fetch("https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev/_migrate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "SELECT 1" }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
