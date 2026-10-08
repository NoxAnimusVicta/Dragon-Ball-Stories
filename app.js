'use strict';

(() => {
  const paths = {
    overview: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    character: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    abilities: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
    inventory: '<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 12h18M10 12v3h4v-3"/>',
    world: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/>',
    chronicle: '<path d="M5 3h13a1 1 0 0 1 1 1v17H6a3 3 0 0 1 0-6h13M5 3v12M9 7h6M9 10h4"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    art: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m4 18 5-5 4 3 4-7 4 9"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2M16 5a3 3 0 0 1 0 6M19 14a6 6 0 0 1 3 5"/>',
    project: '<path d="m14 3 7 7-11 11H3v-7zM11 6l7 7M3 15l6 6"/>'
  };
  const nav = [['overview','Main menu'],['character','Character'],['chronicle','Story'],['abilities','Abilities'],['inventory','Inventory'],['world','World']];
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.overview}</svg>`;
  const present = value => value !== null && value !== undefined && value !== '';
  const value = (v, fallback = 'Not yet recorded') => present(v) ? escape(v) : `<span class="unknown">${fallback}</span>`;
  const release = document.querySelector('meta[name="app-release"]')?.content || '';
  let data;
  let searchIndex = [];
  let portraitUrl = null;
  const groups = ['abilities','inventory','accounts','people','places','projects','events'];

  function validate(d) {
    if (d.schemaVersion !== 1 || !d.character || !d.story || typeof d.character.name !== 'string' || groups.some(k => !Array.isArray(d[k]))) throw new Error('Campaign record format is not supported.');
    const ids = new Set();
    for (const key of groups) for (const record of d[key]) {
      if (!record || typeof record.id !== 'string' || !/^[a-z0-9-]+$/.test(record.id) || ids.has(record.id) || typeof record.title !== 'string') throw new Error('A record is missing its unique ID or title.');
      ids.add(record.id);
    }
    return d;
  }
  function safePortrait(path) {
    if (!path) return null;
    try {
      const url = new URL(path, location.href);
      const base = new URL('./', location.href);
      if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname) || !/\.(png|jpe?g|webp|avif|svg)$/i.test(url.pathname)) return null;
      url.searchParams.set('v', release);
      return url.href;
    } catch { return null; }
  }

  function artCard() {
    return `<section class="character-stage${portraitUrl ? ' has-art' : ''}" aria-label="Character portrait"><span class="stage-label">PLAYER 01</span><div class="aura-ring" aria-hidden="true"></div><div class="portrait">${portraitUrl ? `<button class="art-button" data-art aria-label="View full character artwork"><img class="portrait-image" src="${escape(portraitUrl)}" alt="${escape(data.character.portraitAlt)}"></button>` : `<div class="portrait-placeholder"><div class="portrait-symbol">?</div><span>YOUR STORY AWAITS</span><p>Your portrait will appear<br>when your story begins.</p></div>`}</div><div class="stage-name">${escape(data.character.name)}</div><div class="stage-bottom"><span>${escape(data.character.race || 'RACE UNRECORDED')}</span><span>${portraitUrl ? 'SELECT ART TO ENLARGE' : 'PORTRAIT UNREVEALED'}</span></div></section>`;
  }
  function pageHeader(number, title, description) {
    return `<div class="page-heading"><div><span class="eyebrow">${number} / YOUR ADVENTURE</span><h1>${title}</h1></div><p>${description}</p></div>`;
  }
  const definition = (label, v, sub = '') => `<div><dt>${escape(label)}</dt><dd>${value(v)}${sub ? `<small>${escape(sub)}</small>` : ''}</dd></div>`;
  const detail = (title, text, fallback, key = title) => `<details data-detail-key="${escape(key)}"><summary>${escape(title)}</summary><p>${escape(text || fallback)}</p></details>`;
  function empty(symbol, title, body) {
    return `<div class="empty-state"><div class="empty-symbol">${icon(symbol)}</div><span class="eyebrow">MORE TO DISCOVER</span><h2>${title}</h2><p>${body}</p></div>`;
  }
  function records(items) {
    return items.map(r => `<article class="record" id="record-${escape(r.id)}" tabindex="-1">${r.status || r.date ? `<div class="record-meta">${escape([r.status,r.date].filter(Boolean).join(' / '))}</div>` : ''}<h3>${escape(r.title)}</h3><p>${escape(r.summary || '')}</p>${Array.isArray(r.facts) && r.facts.length ? `<dl class="definition-grid">${r.facts.map(f => definition(f.label,f.value,f.note)).join('')}</dl>` : ''}${r.details ? '<div class="detail-list">'+detail('Read more',r.details,'',r.id)+'</div>' : ''}</article>`).join('');
  }
  function overview() {
    const entries = [
      ['character','Character','The hero of your next life','01'],
      ['chronicle','Story','Your journey, chapter by chapter','02'],
      ['abilities','Abilities','Find your fighting spirit','03'],
      ['inventory','Inventory','Everything you take with you','04'],
      ['world','World','Your people, places and next steps','05']
    ];
    return `<section class="title-screen"><div class="menu-column"><div class="title-logo"><span class="logo-kicker">AN ISEKAI ADVENTURE</span><h1><span>DRAGON <em>BALL</em></span><strong>STORIES</strong></h1><span class="logo-rule">YOUR NEXT LIFE STARTS HERE</span></div><nav class="game-menu" aria-label="Adventure menu">${entries.map(([key,label,desc,n])=>`<a class="menu-choice" href="#${key}" data-menu><span class="menu-number">${n}</span>${icon(key)}<span class="menu-title">${label}</span><span class="menu-arrow">›</span><span class="menu-description">${desc}</span></a>`).join('')}</nav></div><div class="home-feature"><span class="chapter-tag">${data.started ? 'YOUR ADVENTURE' : 'BEFORE CHAPTER ONE'}</span><h2>${data.started ? 'What happens<br><em>next?</em>' : 'A new world.<br><em>A new you.</em>'}</h2><p>${escape(data.story.situation || `The next chapter belongs to you, ${data.character.name}.`)}</p><a class="primary launch-button" href="${data.started ? '#chronicle' : '#character'}">${data.started ? 'Return to your story' : 'Meet Zero'} ${icon('arrow')}</a></div><div class="scene-caption">${data.started ? 'DECORATIVE MENU SCENERY' : 'DECORATIVE MENU SCENERY'}</div></section>`;
  }
  function character() {
    const c=data.character;
    return pageHeader('01','Character','Your place in the story.')+`<div class="character-layout">${artCard()}<div class="character-info"><div class="player-banner"><span class="eyebrow">${data.started ? 'YOUR PROTAGONIST' : 'CHARACTER SETUP'}</span><h2>${escape(c.name)}<span class="status-stamp">${data.started ? 'PATROL TRAINEE' : 'IN THE MAKING'}</span></h2></div><div class="stat-ribbon"><div><small>AGE</small><strong>${escape(c.age ?? '—')}</strong><span>YEARS</span></div><div><small>HEIGHT</small><strong>${escape(c.height || '—')}</strong><span>${escape(c.heightMetric || 'UNDECIDED')}</span></div></div>${present(c.battlePower) ? `<section class="power-panel" aria-label="Current battle power"><div><span class="eyebrow">SCOUTER READING</span><strong>${escape(c.battlePower)}</strong><span>${escape(c.powerReading)}</span></div><div><span class="status-stamp">TRAINING / NO FIELD CLEARANCE</span><p>${escape(c.condition)}</p><a href="#abilities/power">View training progress →</a></div></section>` : ''}<section class="panel identity-panel"><h3>Identity & background</h3><div class="detail-list">${detail('Identity & appearance',[c.race,c.origin,c.appearance].filter(Boolean).join('\n'),'Your discovered identity and appearance will be recorded here.')}${detail('Personality & purpose',[c.personality,c.motivation].filter(Boolean).join('\n'),'Your character record will grow with the story.')}${detail('Backstory',c.backstory,'No backstory has been recorded here.')}${detail('Arrival & new identity',c.arrival,'No arrival has been recorded yet.')}${detail('Knowledge & limits',[c.knowledge,c.limitations].filter(Boolean).join('\n'),'Known information and discovered limits will appear here.')}</div></section><p class="subtle-note">Your choices shape Zero. This record grows through play.</p></div></div>`;
  }
  function abilities() {
    return pageHeader('03','Abilities','Find your fighting spirit.')+`<div class="loadout-screen"><section class="panel main-panel">${data.abilities.length ? records(data.abilities) : empty('abilities','Discover what you can do.','Known abilities and demonstrated skills will appear here as you discover them.')}</section><aside class="side-note"><span class="giant-kanji" aria-hidden="true">気</span><span class="eyebrow">POWER IS ONLY THE BEGINNING</span><h2>Strength.<br>Control.<br>Resolve.</h2><p>Every technique has a story. Learned abilities and training progress will appear here as your journey unfolds.</p><div class="slot-strip" aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span></div></aside></div>`;
  }
  function inventory() {
    return pageHeader('04','Inventory','Pack for a life beyond the ordinary.')+`<div class="loadout-screen"><section class="panel main-panel">${data.inventory.length ? records(data.inventory) : empty('inventory','What comes with you?','Your known possessions will appear here once they are established in the story.')}</section><aside class="panel funds-panel"><div class="capsule-object" aria-hidden="true"><span>CAPSULE</span><b>CC</b></div><h2>Resources</h2>${data.accounts.length ? records(data.accounts) : '<span class="balance">—</span><p>No known funds have been recorded yet.</p>'}<span class="eyebrow">CARRIED · STORED · OWNED</span></aside></div>`;
  }
  function world() {
    return pageHeader('05','World','Follow your curiosity.')+`<section class="world-stage"><div class="world-intro"><span class="eyebrow">${data.started ? 'YOUR CURRENT LOCATION' : 'NEXT STOP / ANOTHER LIFE'}</span><h2>${escape(data.story.location || 'Somewhere extraordinary.')}</h2><p>${data.story.location ? 'Your discoveries, connections and ongoing projects are gathered below.' : 'Your surroundings and discoveries will take shape here as the adventure unfolds.'}</p><dl class="definition-grid">${definition('Era / continuity',data.story.era)}${definition('Time since arrival',data.story.date)}</dl></div></section><nav class="record-jumps" aria-label="World categories"><a href="#world/people">People <span>${data.people.length}</span></a><a href="#world/places">Places <span>${data.places.length}</span></a><a href="#world/projects">Ongoing <span>${data.projects.length}</span></a></nav><div class="world-groups"><section class="panel" id="record-people" tabindex="-1"><h2>People</h2>${data.people.length ? records(data.people) : '<p>Friends, rivals, strangers.<br>Your first encounter is still ahead.</p>'}</section><section class="panel" id="record-places" tabindex="-1"><h2>Places</h2>${data.places.length ? records(data.places) : '<p>A world waiting to unfold.<br>No discoveries recorded yet.</p>'}</section><section class="panel" id="record-projects" tabindex="-1"><h2>Ongoing</h2>${data.projects.length ? records(data.projects) : '<p>Big ideas start somewhere.<br>No projects started yet.</p>'}</section></div>`;
  }
  function chronicle() {
    return pageHeader('02','Story','Your journey, from the latest moment to the first.')+`<div class="story-screen"><section class="chapter-cover"><span class="eyebrow">${data.started ? 'THE JOURNEY SO FAR' : 'YOUR FIRST SAGA'}</span><img src="./dragon-ball.svg?v=${release}" width="130" height="130" alt="One-star Dragon Ball"><h2>${data.started ? 'The story<br>continues.' : 'Beyond<br>the familiar.'}</h2><span class="chapter-tag">${data.started ? escape(data.phase) : 'CHAPTER ONE / NOT STARTED'}</span></section><section class="story-content">${data.started ? `<div class="pending-choice"><span class="eyebrow">CURRENT CHECKPOINT / ${escape(data.story.date)}</span><p>${escape(data.story.pendingChoice)}</p></div><nav class="record-jumps" aria-label="Journal navigation"><a href="#chronicle/${escape(data.events.at(-1)?.id || '')}">Latest entry</a><a href="#chronicle/${escape(data.events[0]?.id || '')}">The beginning</a><span>${data.events.length} entries · newest first</span></nav>` : ''}${data.events.length ? records([...data.events].reverse()) : `<span class="eyebrow">PROLOGUE / CHARACTER CREATION</span><h2>The first step<br>is yours.</h2><p>Your journey has yet to begin. This journal will follow what you experience and discover.</p><div class="story-progress"><span class="complete">Name, age & height</span><span>Character & artwork</span><span>Opening setting</span></div><a class="primary" href="#character">Meet Zero ${icon('arrow')}</a><p class="subtle-note">No opening scene has taken place yet.</p>`}</section></div>`;
  }
  const pages = {overview,character,abilities,inventory,world,chronicle};
  function hideSearch() { $('search-results').hidden = true; $('search').setAttribute('aria-expanded','false'); }
  function render(focus = false) {
    let [route, recordId] = location.hash.slice(1).split('/');
    if (!Object.hasOwn(pages, route)) route = 'overview';
    document.body.dataset.page = route;
    $('main').innerHTML = pages[route]();
    $('main').classList.remove('screen-enter');
    void $('main').offsetWidth;
    $('main').classList.add('screen-enter');
    document.querySelector('[data-menu]')?.classList.add('selected');
    $('breadcrumb').textContent = nav.find(n => n[0] === route)[1];
    document.title = `${$('breadcrumb').textContent} · Dragon Ball Stories`;
    document.querySelectorAll('.nav-link').forEach(a => {
      if (a.hash === '#'+route) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    $('campaign-status').textContent = data.started ? (data.story.date || 'Story in progress') : 'Before the first chapter';
    hideSearch();
    const img = document.querySelector('.portrait-image');
    if (img) img.addEventListener('error', () => { img.closest('.portrait').innerHTML = '<div class="portrait-error"><p>Character art is temporarily unavailable.</p></div>'; }, {once:true});
    if (focus) { $('main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
    if (recordId && /^[a-z0-9-]+$/.test(recordId)) {
      const record = $('record-'+recordId);
      if (record) { record.scrollIntoView({block:'center'}); record.focus({preventScroll:true}); }
    }
  }
  function buildSearch() {
    searchIndex = nav.map(([route,title]) => ({route,title,summary:route === 'overview' ? 'Return to the adventure menu' : `Explore ${title.toLowerCase()}`,text:title}));
    const c = data.character;
    searchIndex.push({route:'character',title:c.name,summary:`Age ${c.age}; ${c.height} (${c.heightMetric})`,text:Object.values(c).filter(v => typeof v === 'string' || typeof v === 'number').join(' ')});
    const mapping = {abilities:'abilities',inventory:'inventory',accounts:'inventory',people:'world',places:'world',projects:'world',events:'chronicle'};
    for (const key of groups) for (const r of data[key]) searchIndex.push({route:mapping[key]+'/'+r.id,title:r.title,summary:r.summary || key,text:JSON.stringify(r)});
  }
  function search() {
    const q = $('search').value.trim().toLocaleLowerCase();
    const matches = q ? searchIndex.filter(r => (r.title+' '+r.text).toLocaleLowerCase().includes(q)) : searchIndex.filter(r=>!r.route.includes('/'));
    const results = matches.slice(0,12);
    $('search-count').textContent = q ? (matches.length ? `${matches.length} result${matches.length === 1 ? '' : 's'}${matches.length > 12 ? ' · showing the first 12' : ''}` : 'No matches') : 'Jump to a screen or search your adventure';
    $('search-results').innerHTML = results.length ? results.map(r => `<a class="search-result" href="#${escape(r.route)}"><strong>${escape(r.title)}</strong><span>${escape(r.summary.length > 150 ? r.summary.slice(0,147)+'…' : r.summary)}</span></a>`).join('') : '<p class="search-empty" role="status">Nothing found yet. Try a name, place or menu section.</p>';
    $('search-results').hidden = false;
    $('search').setAttribute('aria-expanded','true');
  }
  document.addEventListener('click', event => {
    if (event.target instanceof HTMLDialogElement) { const box=event.target.getBoundingClientRect(); if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) event.target.close(); }
    if (event.target.closest('.skip-link')) { event.preventDefault(); $('main').focus(); }
    if (event.target.closest('[data-search]')) { $('search-dialog').showModal(); $('search').focus(); search(); }
    if (event.target.closest('#about-button,[data-about]')) $('about-dialog').showModal();
    if (event.target.closest('.close-dialog')) event.target.closest('dialog').close();
    const result = event.target.closest('.search-result');
    if (result) { $('search-dialog').close(); hideSearch(); $('search').value=''; if (result.hash === location.hash) render(true); }
    if (event.target.closest('[data-art]') && portraitUrl) {
      let dialog = $('art-dialog');
      if (!dialog) { dialog = document.createElement('dialog'); dialog.id='art-dialog'; dialog.className='art-dialog'; dialog.setAttribute('aria-label','Character artwork'); document.body.append(dialog); }
      dialog.innerHTML=`<div class="dialog-top"><span class="eyebrow">${escape(data.character.name)} / CHARACTER ART</span><button class="icon-button close-dialog" aria-label="Close artwork">×</button></div><img src="${escape(portraitUrl)}" alt="${escape(data.character.portraitAlt)}">`;
      dialog.showModal();
    }
  });
  $('search').addEventListener('input',search);
  $('search').addEventListener('focus',search);
  document.querySelector('.search-wrap').addEventListener('keydown', e => {
    if (e.key === 'Escape') { hideSearch(); $('search').focus(); }
    if (!['ArrowDown','ArrowUp'].includes(e.key) || $('search-results').hidden) return;
    const links = [...document.querySelectorAll('.search-result')];
    if (!links.length) return;
    e.preventDefault();
    const i = links.indexOf(document.activeElement);
    links[(i + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length].focus();
  });

  const soundKey = 'db-stories:sound:' + new URL('./',location.href).pathname;
  let soundOn = true;
  try { soundOn = localStorage.getItem(soundKey) !== 'off'; } catch { /* Optional preference. */ }
  $('sound-toggle').setAttribute('aria-pressed',String(soundOn));
  $('sound-toggle').textContent = soundOn ? 'Sound on' : 'Sound off';
  let audioContext;
  function playTone(confirm = false) {
    if (!soundOn) return;
    try {
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* Optional on older browsers. */ }
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state !== 'running') audioContext.resume().catch(() => {});
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const t = audioContext.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(confirm ? 660 : 440,t);
      oscillator.frequency.exponentialRampToValueAtTime(confirm ? 990 : 550,t+.07);
      gain.gain.setValueAtTime(.045,t);
      gain.gain.exponentialRampToValueAtTime(.001,t+.1);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(t); oscillator.stop(t+.11);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    } catch { soundOn=false; $('sound-toggle').setAttribute('aria-pressed','false'); $('sound-toggle').textContent='Sound off'; }
  }
  $('sound-toggle').addEventListener('click',()=>{
    soundOn=!soundOn;
    try { localStorage.setItem(soundKey,soundOn ? 'on' : 'off'); } catch { /* Optional preference. */ }
    $('sound-toggle').setAttribute('aria-pressed',String(soundOn));
    $('sound-toggle').textContent=soundOn ? 'Sound on' : 'Sound off';
    playTone(true);
  });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionKey = 'db-stories:motion:' + new URL('./',location.href).pathname;
  let motionPreference = null;
  try { motionPreference = localStorage.getItem(motionKey); } catch { /* Optional preference only. */ }
  function syncMotion() {
    const paused = reducedMotion.matches || motionPreference === 'off';
    document.body.classList.toggle('motion-paused',paused);
    $('motion-toggle').setAttribute('aria-pressed',String(paused));
    $('motion-toggle').textContent = paused ? 'Motion off' : 'Motion on';
    $('motion-toggle').title = reducedMotion.matches ? 'Reduced motion is enabled in your device settings' : 'Pause or resume background animation';
    $('motion-toggle').disabled = reducedMotion.matches;
  }
  $('motion-toggle').addEventListener('click',()=>{
    motionPreference = document.body.classList.contains('motion-paused') ? 'on' : 'off';
    try { localStorage.setItem(motionKey,motionPreference); } catch { /* No storage required to use the app. */ }
    syncMotion();
  });
  reducedMotion.addEventListener('change',syncMotion);
  syncMotion();
  document.addEventListener('restore-menu-sound',()=>{
    try { if (localStorage.getItem(soundKey) === 'off') return; } catch { /* Optional preference. */ }
    soundOn=true;
    $('sound-toggle').setAttribute('aria-pressed','true');
    $('sound-toggle').textContent='Sound on';
  });
  document.addEventListener('click',e=> { if(e.target.closest('a,button,summary') && !e.target.closest('#sound-toggle')) playTone(true); });
  function selectMenu(target) { const chosen=target.closest('[data-menu]'); if(chosen) document.querySelectorAll('[data-menu]').forEach(item=>item.classList.toggle('selected',item===chosen)); }
  document.addEventListener('pointerover',e=>selectMenu(e.target));
  document.addEventListener('focusin',e=> { selectMenu(e.target); if(e.target.closest('[data-menu],.nav-link')) playTone(); });
  document.addEventListener('keydown',e=>{
    if(document.querySelector('dialog[open]') || e.target.closest('input,textarea,select,summary') || e.ctrlKey || e.metaKey || e.altKey) return;
    if(e.key === 'Escape' && document.body.dataset.page !== 'overview') { location.hash='overview'; return; }
    const menu=[...document.querySelectorAll(document.body.dataset.page === 'overview' ? '[data-menu]' : '.nav-link')];
    if(!menu.length || !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) return;
    // Arrow shortcuts belong to the menu or the screen heading, not content controls.
    if(e.target.closest('a,button,details') && !e.target.closest('[data-menu],.nav-link')) return;
    e.preventDefault();
    const index=menu.indexOf(document.activeElement);
    const backwards=e.key==='ArrowUp'||e.key==='ArrowLeft';
    menu[index < 0 ? (backwards ? menu.length-1 : 0) : (index+(backwards?-1:1)+menu.length)%menu.length].focus();
  });

  async function load() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),12000);
    try {
      const response = await fetch('./campaign.json?v='+release, {cache:'no-store',signal:controller.signal});
      if (!response.ok) throw new Error('Campaign records are unavailable.');
      data = validate(await response.json());
      portraitUrl = safePortrait(data.character.portrait);
      $('navigation').innerHTML=nav.map(([route,label]) => `<a class="nav-link" href="#${route}" aria-label="${label}">${icon(route)}<span>${label}</span></a>`).join('');
      document.querySelector('.user-chip').textContent=data.character.name;
      document.querySelector('.user-chip').setAttribute('aria-label',data.character.name);
      buildSearch(); render();
      window.addEventListener('hashchange', () => render(true));
    } catch (error) {
      $('main').innerHTML='<section class="panel error-card"><h1>Unable to load your adventure.</h1><p>Your adventure could not be loaded. Check your connection and try again.</p><button class="primary" id="retry">Try again</button><p style="margin-top:25px"><a href="./CURRENT-CONTINUITY.md">Read the continuity record</a></p></section>';
      $('retry').addEventListener('click',() => location.reload());
      $('search').disabled=true;
      console.error('Campaign load failed:',error.message);
    } finally { clearTimeout(timeout); document.dispatchEvent(new CustomEvent('adventure-ready')); }
  }
  document.addEventListener('visibilitychange',()=>document.body.classList.toggle('app-backgrounded',document.hidden));
  load();
})();
