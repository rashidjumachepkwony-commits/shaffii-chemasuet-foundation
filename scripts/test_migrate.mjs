const resp = await fetch('https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev/_migrate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'select current_database(), current_user' })
});
const data = await resp.json();
console.log(JSON.stringify(data, null, 2));