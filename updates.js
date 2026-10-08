'use strict';

// No offline cache: release checks and campaign reads always go to the network.
(() => {
  const version = document.querySelector('meta[name="app-release"]')?.content;
  if (!/^[a-f0-9]{24}$/.test(version || '')) return;
  const prefix = 'db-stories:' + new URL('./', location.href).pathname;
  const notice = document.getElementById('update-notice');
  let pending = null;
  let busy = false;
  let replacing = false;
  let lastCheck = 0;
  let lastInteraction = 0;
  let applyTimer;
  let noticeTimer;

  function read(key) {
    try { return JSON.parse(sessionStorage.getItem(prefix + key)); } catch { return null; }
  }
  function write(key, value) {
    try { sessionStorage.setItem(prefix + key, JSON.stringify(value)); } catch { /* Private browsing may deny storage. */ }
  }
  function show(text, transient = false) {
    clearTimeout(noticeTimer);
    notice.textContent = text;
    notice.hidden = !text;
    if (transient) noticeTimer = setTimeout(() => { notice.hidden = true; }, 5000);
  }
  async function fresh(path) {
    const url = new URL(path, location.href);
    url.searchParams.set('_check', String(Date.now()));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, {cache:'no-store', signal:controller.signal});
      if (!response.ok) throw new Error('Not available');
      return await response.text();
    } finally { clearTimeout(timeout); }
  }
  function savePlace(nextVersion) {
    write('resume', {
      version:nextVersion, hash:location.hash, y:window.scrollY, savedAt:Date.now(),
      details:[...document.querySelectorAll('main details[open]')].map(d=>d.getAttribute('data-detail-key') || d.querySelector('summary')?.textContent),
      sound:document.getElementById('sound-toggle')?.getAttribute('aria-pressed') === 'true'
    });
  }
  function applyPending() {
    clearTimeout(applyTimer);
    if (!pending || replacing || document.hidden || navigator.onLine === false) return;
    if (document.querySelector('dialog[open]:not(#launch-dialog)') || document.querySelector('#launch-dialog.granting')) {
      show('An update is ready. It will apply after you close this panel.');
      return;
    }
    if (Date.now() - lastInteraction < 5000 || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) {
      applyTimer = setTimeout(applyPending, 5500);
      return;
    }
    // Prevent a stale intermediary from bouncing the page through a reload loop.
    const attempt = read('attempt');
    if (attempt?.version === pending && Date.now() - attempt.at < 120000) return;
    replacing = true;
    show('Updating your adventure…');
    savePlace(pending);
    write('attempt', {version:pending,at:Date.now()});
    const next = new URL(location.href);
    next.searchParams.set('v', pending);
    next.searchParams.set('_updated', String(Date.now()));
    location.replace(next.href);
  }
  async function check(force = false) {
    if (busy || replacing || document.hidden || navigator.onLine === false) return;
    if (!force && Date.now() - lastCheck < 15000) return;
    busy = true;
    lastCheck = Date.now();
    try {
      const release = JSON.parse(await fresh('./release.json'));
      if (release.schemaVersion !== 1 || !/^[a-f0-9]{24}$/.test(release.version || '')) return;
      if (release.version === version) { pending = null; return; }
      // Only switch once the new document is available as well as its release marker.
      const html = await fresh('./index.html?v=' + release.version);
      if (!html.includes('<meta name="app-release" content="' + release.version + '">')) return;
      pending = release.version;
      applyPending();
    } catch { /* A temporary network failure must not replace a working screen. */ }
    finally { busy = false; }
  }
  function restorePlace() {
    const saved = read('resume');
    if (!saved || saved.version !== version || saved.hash !== location.hash || Date.now()-saved.savedAt > 300000) return;
    write('resume', null);
    document.querySelectorAll('main details').forEach(d=>{
      if (saved.details?.includes(d.getAttribute('data-detail-key') || d.querySelector('summary')?.textContent)) d.open = true;
    });
    if (saved.sound) document.dispatchEvent(new CustomEvent('restore-menu-sound'));
    const restoreScroll = () => requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({top:saved.y || 0,behavior:'instant'})));
    if (document.fonts?.ready) document.fonts.ready.then(restoreScroll); else restoreScroll();
    show('Your adventure is up to date.', true);
    const clean = new URL(location.href);
    clean.searchParams.delete('_updated');
    history.replaceState(null, '', clean.href);
  }
  document.addEventListener('adventure-ready', () => {
    restorePlace();
    check(true);
    setInterval(() => check(), 60000);
    setInterval(applyPending, 6000);
  }, {once:true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { check(true); applyPending(); } });
  window.addEventListener('pageshow', () => check(true));
  window.addEventListener('focus', () => check(true));
  window.addEventListener('online', () => { show('Back online. Checking for updates…', true); check(true); });
  window.addEventListener('offline', () => show('You’re offline. Your current screen stays open.'));
  for (const event of ['pointerdown','keydown','scroll']) {
    document.addEventListener(event, () => { lastInteraction=Date.now(); }, {passive:true});
  }
  document.addEventListener('close', applyPending, true);
  document.getElementById('reload-latest')?.addEventListener('click', () => {
    const freshURL = new URL(location.href);
    freshURL.searchParams.delete('v');
    freshURL.searchParams.delete('_updated');
    freshURL.searchParams.set('_refresh', String(Date.now()));
    location.replace(freshURL.href);
  });
})();
