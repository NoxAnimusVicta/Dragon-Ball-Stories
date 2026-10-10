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
  const ageLabel = c => Number.isInteger(c.age) ? `${c.age} years${Number.isInteger(c.ageMonths) ? `, ${c.ageMonths} months` : ''}` : 'Not yet recorded';
  const value = (v, fallback = 'Not yet recorded') => present(v) ? escape(v) : `<span class="unknown">${fallback}</span>`;
  const release = document.querySelector('meta[name="app-release"]')?.content || '';
  let data;
  let searchIndex = [];
  let portraitUrl = null;
  let selectedForm = 0;
  let portraitMode = 'forms';
  let selectedAppearance = 0;
  const artSelections = new Map();
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

  // Decimal strings keep future large power levels exact beyond Number's safe range.
  function decimal(value) {
    if (typeof value === 'number' && (!Number.isFinite(value) || value < 0 || (Number.isInteger(value) && !Number.isSafeInteger(value)))) return null;
    const text = String(value ?? '');
    if (!/^\d+(?:\.\d+)?$/.test(text)) return null;
    const [whole, fraction = ''] = text.split('.');
    return {digits: BigInt(whole + fraction), scale: fraction.length};
  }
  function multiplyPower(base, multiplier) {
    const a = decimal(base), b = decimal(multiplier);
    if (!a || !b) return null;
    const scale = a.scale + b.scale;
    const digits = (a.digits * b.digits).toString().padStart(scale + 1, '0');
    return scale ? (digits.slice(0,-scale) + '.' + digits.slice(-scale)).replace(/\.?0+$/, '') : digits;
  }
  function exactPower(power) {
    const [whole, fraction] = String(power).split('.');
    return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (fraction ? '.' + fraction : '');
  }
  function compactPower(power) {
    const n = decimal(power);
    if (!n) return '—';
    const units = [[24,'Septillion'],[21,'Sextillion'],[18,'Quintillion'],[15,'Quadrillion'],[12,'Trillion'],[9,'Billion'],[6,'Million']];
    for (const [exponent,name] of units) {
      const divisor = 10n ** BigInt(exponent + n.scale);
      if (n.digits >= divisor) {
        // Truncate the short label; the detail panel always retains the exact value.
        const hundredths = n.digits * 100n / divisor;
        const fraction = (hundredths % 100n).toString().padStart(2,'0').replace(/0+$/, '');
        return `${exactPower((hundredths / 100n).toString())}${fraction ? '.' + fraction : ''} ${name}`;
      }
    }
    return exactPower(power);
  }
  function unlockedForms() {
    const base = data.character.battlePower;
    return (Array.isArray(data.character.forms) ? data.character.forms : []).filter(f =>
      f && f.unlocked === true && typeof f.id === 'string' && typeof f.name === 'string' &&
      decimal(f.multiplier)?.digits > 0n && decimal(base) && multiplyPower(base,f.multiplier) !== null
    );
  }
  function portraitForms() {
    return [{id:'base', name:'Base', portrait:portraitUrl, alt:data.character.portraitAlt, multiplier:'1', date:data.character.portraitDate},
      ...unlockedForms().filter(f => safePortrait(f.portrait)).map(f => ({...f, portrait:safePortrait(f.portrait), alt:f.portraitAlt || f.name}))];
  }
  function portraitHistory() {
    return (Array.isArray(data.character.appearanceHistory) ? data.character.appearanceHistory : [])
      .filter(a => a && typeof a.name === 'string' && safePortrait(a.portrait))
      .map(a => ({...a, portrait:safePortrait(a.portrait), alt:a.portraitAlt || a.name}));
  }
  function portraitPanel() {
    const history = portraitHistory().length > 0;
    const current = portraitMode === 'history' ? portraitHistory()[selectedAppearance] : portraitForms()[selectedForm];
    return `<div class="portrait-panel">${history ? `<div class="portrait-modes" role="group" aria-label="Portrait collection"><button data-portrait-mode="forms" aria-pressed="${portraitMode==='forms'}">Forms</button><button data-portrait-mode="history" aria-pressed="${portraitMode==='history'}">Appearance history</button></div>` : ''}${artCard()}${current?.date ? `<div class="portrait-date art-date" aria-live="polite">${escape(current.date)}</div>` : ''}</div>`;
  }
  function artCard() {
    const history = portraitMode === 'history', items = history ? portraitHistory() : portraitForms();
    if (!items.length) { portraitMode='forms'; return artCard(); }
    if (selectedForm >= portraitForms().length) selectedForm = 0;
    if (history && selectedAppearance >= items.length) selectedAppearance = 0;
    const index = history ? selectedAppearance : selectedForm;
    const form = items[index], cycling = items.length > 1;
    const image = `<img class="portrait-image" width="853" height="1280" src="${escape(form.portrait)}" alt="${escape(form.alt)}">`;
    const control = history ? 'data-history-cycle' : 'data-form-cycle';
    return `<section class="character-stage${form.portrait ? ' has-art' : ''}${cycling ? ' is-cycling' : ''}" aria-label="${history ? 'Appearance history' : 'Character portrait'}"><div class="aura-ring" aria-hidden="true"></div><div class="portrait">${form.portrait ? (cycling ? `<button class="art-button" ${control} aria-label="${escape(form.name)}. Left side: previous; right side: next ${history ? 'appearance' : 'unlocked form'}. Keyboard: left/right arrows">${image}</button>` : image) : `<div class="portrait-placeholder"><div class="portrait-symbol">?</div><span>YOUR STORY AWAITS</span><p>Your portrait will appear<br>when your story begins.</p></div>`}</div><div class="stage-name">${escape(data.character.name)}</div><div class="stage-bottom"><span>${escape(history ? 'ART ARCHIVE' : data.character.race || 'RACE UNRECORDED')}</span><span class="portrait-form" aria-live="polite"><strong>${escape(form.name)}</strong>${history ? `<span>${escape(form.caption || '')}</span>` : index ? `<span>PL ${escape(compactPower(multiplyPower(data.character.battlePower,form.multiplier)))}</span>` : ''}${cycling ? `<small aria-label="Image ${index+1} of ${items.length}">‹ &nbsp; ${index+1} / ${items.length} &nbsp; ›</small>` : ''}</span></div></section>`;
  }
  function cyclePortrait(direction) {
    const count = portraitMode === 'history' ? portraitHistory().length : portraitForms().length;
    if (portraitMode === 'history') selectedAppearance = (selectedAppearance + direction + count) % count;
    else selectedForm = (selectedForm + direction + count) % count;
    document.querySelector('.portrait-panel').outerHTML = portraitPanel();
    document.querySelector('[data-form-cycle],[data-history-cycle]')?.focus({preventScroll:true});
    bindPortraitError();
  }
  document.addEventListener('keydown', event => {
    if (!event.target.closest('[data-form-cycle],[data-history-cycle]') || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    cyclePortrait(event.key === 'ArrowLeft' ? -1 : 1);
  });
  function showPowerDetails() {
    let dialog = $('power-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.id='power-dialog'; dialog.className='power-dialog';
      dialog.setAttribute('aria-labelledby','power-dialog-title'); document.body.append(dialog);
      dialog.addEventListener('close', () => document.querySelector('[data-power-details]')?.focus({preventScroll:true}));
    }
    const rows = [{name:'Base',multiplier:'1'},...unlockedForms()];
    dialog.innerHTML = `<div class="dialog-top"><span class="eyebrow">${escape(data.character.name)} / POWER</span><button class="icon-button close-dialog" aria-label="Close power details" autofocus>×</button></div><h2 id="power-dialog-title">Power levels</h2><p>Full output from your current recorded base.</p><dl class="power-level-list">${rows.map(f=>`<div><dt>${escape(f.name)} <span>×${escape(f.multiplier)}</span></dt><dd>${escape(exactPower(multiplyPower(data.character.battlePower,f.multiplier)))}</dd></div>`).join('')}</dl>${rows.length===1 ? '<p>No transformations unlocked yet.</p>' : ''}<p class="power-reading-note">${escape(data.character.powerReading || '')}</p>`;
    dialog.showModal();
  }
  function pageHeader(number, title, description) {
    return `<div class="page-heading"><div><span class="eyebrow">${number} / YOUR ADVENTURE</span><h1>${title}</h1></div><p>${description}</p></div>`;
  }
  const definition = (label, v, sub = '') => `<div><dt>${escape(label)}</dt><dd>${value(v)}${sub ? `<small>${escape(sub)}</small>` : ''}</dd></div>`;
  const detail = (title, text, fallback, key = title) => `<details data-detail-key="${escape(key)}"><summary>${escape(title)}</summary><p>${escape(text || fallback)}</p></details>`;
  function empty(symbol, title, body) {
    return `<div class="empty-state"><div class="empty-symbol">${icon(symbol)}</div><span class="eyebrow">MORE TO DISCOVER</span><h2>${title}</h2><p>${body}</p></div>`;
  }
  // Galleries contain only approved, dated public artwork. No empty shells or hidden forms.
  function artItems(items) {
    return (Array.isArray(items) ? items : []).filter(a => a && typeof a.name === 'string' &&
      typeof a.date === 'string' && a.date.trim() && safePortrait(a.portrait))
      .map(a => ({...a, portrait:safePortrait(a.portrait)}));
  }
  function galleryCollections(record, kind) {
    const art = record.art || {};
    if (kind === 'places') return {images:artItems(art.images)};
    const appearance = artItems(art.appearance);
    const forms = record.canTransform === true ? artItems(art.forms).filter(a => a.unlocked === true) : [];
    return {appearance, ...(record.canTransform === true && (appearance.length || forms.length) ?
      {forms:appearance.length ? [{...appearance.at(-1),name:'Base'}, ...forms] : forms} : {})};
  }
  function recordGallery(record, kind) {
    const collections = galleryCollections(record,kind);
    const modes = Object.keys(collections).filter(k => collections[k].length);
    if (!modes.length) return '';
    const state = artSelections.get(record.id) || {mode:modes[0],index:0};
    if (!modes.includes(state.mode)) { state.mode=modes[0]; state.index=0; }
    const items = collections[state.mode]; state.index %= items.length;
    artSelections.set(record.id,state);
    const item = items[state.index], multiple=items.length>1;
    const image = `<img class="record-art-image" src="${escape(item.portrait)}" alt="${escape(item.portraitAlt || item.name)}" loading="lazy" width="${kind==='places'?1200:853}" height="${kind==='places'?750:1280}"><span class="record-art-error" hidden>Artwork temporarily unavailable</span>`;
    return `<section class="record-gallery ${kind==='places'?'place-gallery':'person-gallery'}" data-gallery="${escape(record.id)}" data-gallery-kind="${kind}" aria-label="${escape(record.title)} artwork"><div class="gallery-heading"><span class="eyebrow">${kind==='places'?'ART ARCHIVE':'APPEARANCE ARCHIVE'}</span>${modes.length>1 ? `<div class="gallery-modes" role="group" aria-label="Art collection">${['forms','appearance'].filter(k=>modes.includes(k)).map(k=>`<button data-gallery-mode="${k}" aria-pressed="${state.mode===k}">${k==='forms'?'Forms':'Appearance'}</button>`).join('')}</div>` : ''}</div>${multiple ? `<button class="record-art-frame" data-gallery-cycle="0" aria-label="${escape(item.name)}. Left: previous image; right: next image. Arrow keys also navigate.">${image}</button>` : `<div class="record-art-frame">${image}</div>`}<div class="gallery-caption"><div aria-live="polite"><strong>${escape(item.name)}</strong><span class="art-date">${escape(item.date)}</span></div>${multiple ? `<div class="gallery-navigation"><button data-gallery-cycle="-1" aria-label="Previous artwork">‹</button><span aria-label="Image ${state.index+1} of ${items.length}">${state.index+1} / ${items.length}</span><button data-gallery-cycle="1" aria-label="Next artwork">›</button></div>` : ''}</div></section>`;
  }
  function changeGallery(element, direction, mode) {
    const gallery = element.closest('[data-gallery]');
    if (!gallery) return;
    const kind = gallery.dataset.galleryKind;
    const record = data[kind]?.find(r=>r.id===gallery.dataset.gallery);
    if (!record) return;
    const state = artSelections.get(record.id);
    if (mode) { state.mode=mode; state.index=0; }
    else { const count=galleryCollections(record,kind)[state.mode].length; state.index=(state.index+direction+count)%count; }
    const focusSelector = mode ? `[data-gallery-mode="${mode}"]` : `[data-gallery-cycle="${element.dataset.galleryCycle || '0'}"]`;
    const holder = document.createElement('div'); holder.innerHTML=recordGallery(record,kind);
    const replacement=holder.firstElementChild; gallery.replaceWith(replacement);
    replacement.querySelector(focusSelector)?.focus({preventScroll:true});
    bindGalleryErrors(replacement);
  }
  function bindGalleryErrors(root=document) {
    root.querySelectorAll('.record-art-image').forEach(img=>{
      const failed=()=>{img.hidden=true; img.nextElementSibling.hidden=false;};
      img.addEventListener('error',failed,{once:true});
      if(img.complete && !img.naturalWidth) failed();
    });
  }
  document.addEventListener('keydown',event=>{
    const control=event.target.closest('[data-gallery-cycle]');
    if(!control || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); changeGallery(control,event.key==='ArrowLeft'?-1:1);
  });
  function records(items, kind='') {
    return items.map(r => {
      const gallery = ['people','places'].includes(kind) ? recordGallery(r,kind) : '';
      return `<article class="record" id="record-${escape(r.id)}" tabindex="-1">${r.status || r.date ? `<div class="record-meta">${escape([r.status,r.date].filter(Boolean).join(' / '))}</div>` : ''}<h3>${escape(r.title)}</h3><p>${escape(r.summary || '')}</p>${Array.isArray(r.facts) && r.facts.length ? `<dl class="definition-grid">${r.facts.map(f => definition(f.label,f.value,f.note)).join('')}</dl>` : ''}${r.details || gallery ? `<div class="detail-list record-details"><details data-detail-key="${escape(r.id)}"><summary>Details</summary>${r.details ? `<p>${escape(r.details)}</p>` : ''}${gallery}</details></div>` : ''}</article>`;
    }).join('');
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
    return pageHeader('01','Character','Your place in the story.')+`<div class="character-layout">${portraitPanel()}<div class="character-info"><div class="player-banner"><span class="eyebrow">${data.started ? 'YOUR PROTAGONIST' : 'CHARACTER SETUP'}</span><h2>${escape(c.name)}<span class="status-stamp">${data.started ? 'PATROL TRAINEE' : 'IN THE MAKING'}</span></h2></div><div class="stat-ribbon"><div><small>AGE</small><strong>${escape(c.age ?? '—')}</strong><span>YEARS${Number.isInteger(c.ageMonths) ? ` · ${escape(c.ageMonths)} MONTHS` : ''}</span></div><div><small>HEIGHT</small><strong>${escape(c.height || '—')}</strong><span>${escape(c.heightMetric || 'UNDECIDED')}</span></div></div>${present(c.battlePower) ? `<section class="power-panel" aria-label="Current battle power"><div><button class="power-readout" data-power-details aria-haspopup="dialog" aria-label="Power level ${escape(exactPower(c.battlePower))}. View exact base and unlocked forms"><span class="eyebrow">POWER LEVEL</span><strong>${escape(compactPower(c.battlePower))}</strong><span class="power-details-icon" aria-hidden="true">↗</span></button><span>${escape(c.powerReading)}</span></div><div><span class="status-stamp">TRAINING / NO FIELD CLEARANCE</span><p>${escape(c.condition)}</p><a class="quick-link" href="#abilities/power">Training progress ${icon('arrow')}</a></div></section>` : ''}<section class="panel identity-panel"><h3>Identity & background</h3><div class="detail-list">${detail('Identity & appearance',[c.race,c.origin,c.appearance].filter(Boolean).join('\n'),'Your discovered identity and appearance will be recorded here.')}${detail('Personality & purpose',[c.personality,c.motivation].filter(Boolean).join('\n'),'Your character record will grow with the story.')}${detail('Backstory',c.backstory,'No backstory has been recorded here.')}${detail('Arrival & new identity',c.arrival,'No arrival has been recorded yet.')}${detail('Knowledge & limits',[c.knowledge,c.limitations].filter(Boolean).join('\n'),'Known information and discovered limits will appear here.')}</div></section></div></div>`;
  }
  function abilities() {
    // Illustrated slots are opt-in for signature moves and transformations, not fundamentals.
    const techniques = data.abilities.filter(r => ['signature-technique','transformation'].includes(r.abilityType) && safePortrait(r.artwork));
    const slots = Array.from({length:Math.max(3,techniques.length)}, (_,i) => {
      const r = techniques[i];
      if (!r) return '<div class="ability-slot is-empty" role="img" aria-label="Empty ability slot"><span class="ability-slot-art" aria-hidden="true">✦</span></div>';
      const art = safePortrait(r.artwork);
      return `<button class="ability-slot" data-ability="${escape(r.id)}" aria-haspopup="dialog" aria-label="About ${escape(r.title)}"><span class="ability-slot-art"><span aria-hidden="true">✦</span>${art ? `<img class="ability-image" src="${escape(art)}" alt="${escape(r.artworkAlt || r.title)}" loading="lazy">` : ''}</span><span class="ability-slot-name">${escape(r.title)}</span></button>`;
    }).join('');
    return pageHeader('03','Abilities','Find your fighting spirit.')+`<div class="loadout-screen"><section class="panel main-panel">${data.abilities.length ? records(data.abilities) : empty('abilities','Discover what you can do.','Known abilities and demonstrated skills will appear here as you discover them.')}</section><aside class="side-note"><span class="giant-kanji" aria-hidden="true">気</span><span class="eyebrow">POWER IS ONLY THE BEGINNING</span><h2 class="ability-motto"><span>Strength</span> <span>Control</span> <span>Resolve</span></h2><p>${techniques.length ? 'Signature techniques & transformations.' : 'Signature techniques and transformations will appear here as you unlock them.'}</p><div class="ability-slots" role="group" aria-label="Signature techniques and transformations">${slots}</div></aside></div>`;
  }
  function inventory() {
    return pageHeader('04','Inventory','Pack for a life beyond the ordinary.')+`<div class="loadout-screen"><section class="panel main-panel">${data.inventory.length ? records(data.inventory) : empty('inventory','What comes with you?','Your known possessions will appear here once they are established in the story.')}</section><aside class="panel funds-panel"><div class="capsule-object" aria-hidden="true"><span>CAPSULE</span><b>CC</b></div><h2>Resources</h2>${data.accounts.length ? records(data.accounts) : '<span class="balance">—</span><p>No known funds have been recorded yet.</p>'}<span class="eyebrow">CARRIED · STORED · OWNED</span></aside></div>`;
  }
  function world() {
    return pageHeader('05','World','Follow your curiosity.')+`<section class="world-stage"><div class="world-intro"><span class="eyebrow">${data.started ? 'YOUR CURRENT LOCATION' : 'NEXT STOP / ANOTHER LIFE'}</span><h2>${escape(data.story.location || 'Somewhere extraordinary.')}</h2><p>${data.story.location ? 'Your discoveries, connections and ongoing projects are gathered below.' : 'Your surroundings and discoveries will take shape here as the adventure unfolds.'}</p><dl class="definition-grid">${definition('Era / continuity',data.story.era)}${definition('Time since arrival',data.story.date)}</dl></div></section><nav class="record-jumps" aria-label="World categories"><a href="#world/people">People <span>${data.people.length}</span></a><a href="#world/places">Places <span>${data.places.length}</span></a><a href="#world/projects">Ongoing <span>${data.projects.length}</span></a></nav><div class="world-groups"><section class="panel" id="record-people" tabindex="-1"><h2>People</h2>${data.people.length ? records(data.people,'people') : '<p>Friends, rivals, strangers.<br>Your first encounter is still ahead.</p>'}</section><section class="panel" id="record-places" tabindex="-1"><h2>Places</h2>${data.places.length ? records(data.places,'places') : '<p>A world waiting to unfold.<br>No discoveries recorded yet.</p>'}</section><section class="panel" id="record-projects" tabindex="-1"><h2>Ongoing</h2>${data.projects.length ? records(data.projects) : '<p>Big ideas start somewhere.<br>No projects started yet.</p>'}</section></div>`;
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
    $('breadcrumb').textContent = nav.find(n => n[0] === route)[1];
    document.title = `${$('breadcrumb').textContent} · Dragon Ball Stories`;
    document.querySelectorAll('.nav-link').forEach(a => {
      if (a.hash === '#'+route) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    $('campaign-status').textContent = data.started ? (data.story.date || 'Story in progress') : 'Before the first chapter';
    hideSearch();
    bindPortraitError();
    bindGalleryErrors();
    document.querySelectorAll('.ability-image').forEach(img => img.addEventListener('error', () => img.remove(), {once:true}));
    if (focus) { $('main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
    if (recordId && /^[a-z0-9-]+$/.test(recordId)) {
      const record = $('record-'+recordId);
      if (record) { record.scrollIntoView({block:'center'}); record.focus({preventScroll:true}); }
    }
  }
  function bindPortraitError() {
    const img = document.querySelector('.portrait-image');
    if (img) img.addEventListener('error', () => {
      const message = document.createElement('span'); message.className='portrait-error';
      message.textContent='Artwork temporarily unavailable';
      img.style.visibility='hidden'; img.closest('.portrait').classList.add('is-unavailable'); img.parentElement.append(message);
      // Retain the cycle control so a failed form image never traps the portrait.
    }, {once:true});
  }
  function buildSearch() {
    searchIndex = nav.map(([route,title]) => ({route,title,summary:route === 'overview' ? 'Return to the adventure menu' : `Explore ${title.toLowerCase()}`,text:title}));
    const c = data.character;
    searchIndex.push({route:'character',title:c.name,summary:`Age ${ageLabel(c)}; ${c.height} (${c.heightMetric})`,text:Object.values(c).filter(v => typeof v === 'string' || typeof v === 'number').join(' ')});
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
    const abilityButton = event.target.closest('[data-ability]');
    if (abilityButton) {
      const ability = data.abilities.find(r => r.id === abilityButton.dataset.ability);
      if (!ability) return;
      let dialog = $('ability-dialog');
      if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.id = 'ability-dialog';
        dialog.className = 'ability-dialog';
        dialog.setAttribute('aria-labelledby','ability-dialog-title');
        document.body.append(dialog);
      }
      dialog.innerHTML = `<div class="dialog-top"><span class="eyebrow">ABILITY / ${escape(ability.status || 'KNOWN')}</span><button class="icon-button close-dialog" aria-label="Close ability details" autofocus>×</button></div><h2 id="ability-dialog-title">${escape(ability.title)}</h2><p class="ability-summary">${escape(ability.summary || '')}</p>${ability.details ? `<div class="ability-explanation"><h3>How it works</h3><p>${escape(ability.details)}</p></div>` : ''}${Array.isArray(ability.facts) && ability.facts.length ? `<dl class="definition-grid">${ability.facts.map(f => definition(f.label,f.value,f.note)).join('')}</dl>` : ''}`;
      dialog.showModal();
    }
    const galleryMode = event.target.closest('[data-gallery-mode]');
    if (galleryMode) changeGallery(galleryMode,0,galleryMode.dataset.galleryMode);
    const galleryCycle = event.target.closest('[data-gallery-cycle]');
    if (galleryCycle) {
      const rect=galleryCycle.getBoundingClientRect();
      const direction=Number(galleryCycle.dataset.galleryCycle) || (event.detail>0 && event.clientX<rect.left+rect.width/2 ? -1 : 1);
      changeGallery(galleryCycle,direction);
    }
    if (event.target.closest('[data-power-details]')) showPowerDetails();
    const modeButton = event.target.closest('[data-portrait-mode]');
    if (modeButton) {
      portraitMode = modeButton.dataset.portraitMode === 'history' ? 'history' : 'forms';
      selectedForm = 0;
      document.querySelector('.portrait-panel').outerHTML = portraitPanel();
      document.querySelector(`[data-portrait-mode="${portraitMode}"]`)?.focus({preventScroll:true});
      bindPortraitError();
    }
    const portraitButton = event.target.closest('[data-form-cycle],[data-history-cycle]');
    if (portraitButton) {
      const bounds = portraitButton.getBoundingClientRect();
      // Keyboard activation has no pointer position; Enter/Space advance.
      const direction = event.detail > 0 && event.clientX < bounds.left + bounds.width / 2 ? -1 : 1;
      cyclePortrait(direction);
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

  const playTone = (confirm = false) => window.adventureAudio?.playTone(confirm);
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
  document.addEventListener('click',e=> { if(e.target.closest('a,button,summary') && !e.target.closest('#sound-toggle')) playTone(true); });
  document.addEventListener('focusin',e=> { if(e.target.closest('[data-menu],.nav-link')) playTone(); });
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
