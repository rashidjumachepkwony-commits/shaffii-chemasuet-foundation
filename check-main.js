fetch('https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev/assets/index-aqRA7tZw.js')
  .then(r => r.text())
  .then(js => {
    const matches = js.match(/Gallery-[^"']+/g);
    console.log('Gallery chunks in main bundle:', matches);
  })
  .catch(console.error);