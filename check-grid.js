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
            if (js.includes('grid grid-cols-1') && js.includes('aspect-video')) {
              console.log('SUCCESS: New grid layout in ' + chunk);
            } else if (js.includes('columns-1')) {
              console.log('OLD: columns layout in ' + chunk);
            } else {
              console.log('UNKNOWN: ' + chunk);
            }
          });
      });
    } else {
      console.log('No gallery chunks in HTML');
    }
  })
  .catch(console.error);