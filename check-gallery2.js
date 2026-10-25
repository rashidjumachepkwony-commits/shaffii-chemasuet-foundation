fetch('https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev/gallery')
  .then(r => r.text())
  .then(html => {
    const matches = html.match(/Gallery-[^"']+\.js/g);
    if (matches) {
      console.log('Gallery chunks:', matches);
      matches.forEach(chunk => {
        const url = 'https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev/assets/' + chunk;
        fetch(url)
          .then(r => r.text())
          .then(js => {
            if (js.includes('isVideo') || js.includes('aspect-video') || js.includes('inferMediaType')) {
              console.log('SUCCESS: Video logic in ' + chunk);
            } else {
              console.log('FAIL: Video logic NOT in ' + chunk);
            }
          });
      });
    } else {
      console.log('No gallery chunks in HTML');
    }
  })
  .catch(console.error);