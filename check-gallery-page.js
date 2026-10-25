fetch('https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev/gallery')
  .then(r => r.text())
  .then(html => {
    const scripts = html.match(/<script[^>]*src=[^>]*>/g);
    console.log('Scripts in gallery page:', scripts);
    
    const links = html.match(/<link[^>]*rel=.modulepreload[^>]*>/g);
    console.log('Module preloads:', links);
  })
  .catch(console.error);