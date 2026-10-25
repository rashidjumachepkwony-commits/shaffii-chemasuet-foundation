fetch("https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev/api/gallery?limit=1")
  .then(function(r) { return r.json(); })
  .then(function(d) { console.log(JSON.stringify(d, null, 2)); })
  .catch(function(e) { console.error(e); });
