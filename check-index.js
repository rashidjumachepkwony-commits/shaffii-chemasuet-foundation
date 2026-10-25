fetch('https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev/')
  .then(r => r.text())
  .then(html => {
    const matches = html.match(/Gallery-[^"']+\.js/g);
    console.log('Gallery chunks in index.html:', matches);
    
    const scripts = html.match(/<script[^>]*src=[^>]*Gallery[^>]*>/g);
    console.log('Gallery script tags:', scripts);
    
    const links = html.match(/<link[^>]*href=[^>]*Gallery[^>]*>/g);
    console.log('Gallery link tags:', links);
  })
  .catch(console.error);