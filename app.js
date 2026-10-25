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
  // Catalogue labels change; saved record IDs and exact journal entries do not.
  const timelineLabels = Object.freeze({"001":"TL-0001-001-A0001","218":"TL-0002-018-A0218","398":"TL-0003-032-B0398","503":"TL-0042-045-A0503","619":"TL-0001-002-A0619","657":"TL-0004-012-A0657","782":"TL-0005-024-C0782","846":"TL-0006-017-C0846","864":"TL-0007-031-B0864"});
  const previousTimelineLabels = Object.freeze({"TL-PR001-A0001":"TL-0001-001-A0001","TL-SI018-A0218":"TL-0002-018-A0218","TL-FE032-B0398":"TL-0003-032-B0398","TL-NG045-A0503":"TL-0042-045-A0503","TL-PR002-A0619":"TL-0001-002-A0619","TL-TP012-A0657":"TL-0004-012-A0657","TL-GT024-C0782":"TL-0005-024-C0782","TL-UX017-C0846":"TL-0006-017-C0846","TL-FM031-B0864":"TL-0007-031-B0864"});
  function catalogueText(text) {
    return text.replace(/\bTL-[A-Z]{2}\d{3}-[A-Z]\d{4}(?![\dA-Za-z-])/g, old => previousTimelineLabels[old] || old).replace(/\bTL-?(\d{3})(?![\dA-Za-z-])/g, (old, id) => timelineLabels[id] || old);
  }
  function catalogueRecord(record, key='') {
    if (key==='events' || ['id','parentId','worldGroup','history','formIds','portrait','artwork','url','href'].includes(key)) return record;
    if (typeof record==='string') return catalogueText(record);
    if (Array.isArray(record)) return record.map(item=>catalogueRecord(item));
    if (record && typeof record==='object') return Object.fromEntries(Object.entries(record).map(([k,v])=>[k,catalogueRecord(v,k)]));
    return record;
  }
  const labels = Object.freeze({powerReference:'Campaign Power Reference', appearanceHistory:'Appearance History'});
  const nav = [['overview','Main Menu'],['character','Character'],['chronicle','Story'],['abilities','Techniques'],['inventory','Inventory'],['world','World']];
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const titleCase = text => String(text ?? '').replace(/(^|[\s/–—-])([a-z])/g, (_, gap, letter) => gap + letter.toUpperCase()).replace(/\bX(?=\d)/g,'x');
  const heading = text => escape(titleCase(text));
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.overview}</svg>`;
  const present = value => value !== null && value !== undefined && value !== '';
  const ageLabel = c => Number.isInteger(c.age) ? `${c.age} years${Number.isInteger(c.ageMonths) ? `, ${c.ageMonths} months` : ''}` : 'Not yet recorded';
  const value = (v, fallback = 'Not yet recorded') => present(v) ? escape(v) : `<span class="unknown">${fallback}</span>`;
  const release = document.querySelector('meta[name="app-release"]')?.content || '';
  let data;
  let scale;
  let combatReference;
  let techniqueProgress;
  const worldExpansion = new Map();
  const worldOpen = key => worldExpansion.get(key) ? 'open' : '';
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
    const places = new Map(d.places.map(p => [p.id,p]));
    for (const place of d.places) {
      const seen = new Set([place.id]);
      for (let id=place.parentId; id; id=places.get(id).parentId) {
        if (!places.has(id) || seen.has(id)) throw new Error('Invalid location hierarchy.');
        seen.add(id);
      }
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
    const units = [[33,'Decillion'],[30,'Nonillion'],[27,'Octillion'],[24,'Septillion'],[21,'Sextillion'],[18,'Quintillion'],[15,'Quadrillion'],[12,'Trillion'],[9,'Billion'],[6,'Million']];
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
  // Presentation order is independent of the chronological acquisition records.
  // Assign formGroup to future families; groups retain their first-listed order.
  function orderedForms(forms, acrossFamilies = false) {
    const families = new Map();
    for (const form of forms) {
      const family = acrossFamilies ? 'all' : form.formGroup || 'default';
      if (!families.has(family)) families.set(family, []);
      families.get(family).push(form);
    }
    return [...families.values()].flatMap(items => items.slice().sort((a,b) => {
      const x = decimal(a.multiplier), y = decimal(b.multiplier);
      if (!x || !y) return x ? -1 : y ? 1 : 0;
      const left = x.digits * 10n ** BigInt(y.scale);
      const right = y.digits * 10n ** BigInt(x.scale);
      return left < right ? -1 : left > right ? 1 : 0;
    }));
  }
  function unlockedForms() {
    const base = data.character.battlePower;
    return orderedForms((Array.isArray(data.character.forms) ? data.character.forms : []).filter(f =>
      f && f.unlocked === true && typeof f.id === 'string' && typeof f.name === 'string' &&
      decimal(f.multiplier)?.digits > 0n && decimal(base) && multiplyPower(base,f.multiplier) !== null
    ));
  }
  function portraitForms() {
    return [{id:'base', name:'Base', portrait:portraitUrl, alt:data.character.portraitAlt, multiplier:'1', date:data.character.portraitDate},
      ...orderedForms(unlockedForms(),true).filter(f => safePortrait(f.portrait)).map(f => ({...f, name:formArtName(f), portrait:safePortrait(f.portrait), alt:f.portraitAlt || f.name}))];
  }
  function formArtName(form) {
    return /^kaioken$/i.test(form.name.trim()) ? `Kaioken ×${form.multiplier}` : form.name;
  }
  function portraitHistory() {
    return (Array.isArray(data.character.appearanceHistory) ? data.character.appearanceHistory : [])
      .filter(a => a && typeof a.name === 'string' && safePortrait(a.portrait))
      .map(a => ({...a, portrait:safePortrait(a.portrait), alt:a.portraitAlt || a.name}));
  }
  function portraitPanel() {
    const history = portraitHistory().length > 0;
    return `<div class="portrait-panel">${history ? `<div class="portrait-modes" role="group" aria-label="Portrait collection"><button data-portrait-mode="forms" aria-pressed="${portraitMode==='forms'}">Forms</button><button data-portrait-mode="history" aria-pressed="${portraitMode==='history'}">Appearance History</button></div>` : ''}${artCard()}</div>`;
  }
  function artCard() {
    const history = portraitMode === 'history', items = history ? portraitHistory() : portraitForms();
    if (!items.length) { portraitMode='forms'; return artCard(); }
    if (selectedForm >= portraitForms().length) selectedForm = 0;
    if (history && selectedAppearance >= items.length) selectedAppearance = 0;
    const index = history ? selectedAppearance : selectedForm;
    const form = items[index], cycling = items.length > 1;
    const image = `<img class="portrait-image" width="853" height="1280" style="aspect-ratio:853/1280" src="${escape(form.portrait)}" alt="${escape(form.alt)}">`;
    const control = history ? 'data-history-cycle' : 'data-form-cycle';
    return `<section class="character-stage${form.portrait ? ' has-art' : ''}${cycling ? ' is-cycling' : ''}" aria-label="${history ? 'Appearance History' : 'Character portrait'}"><div class="aura-ring" aria-hidden="true"></div><div class="portrait">${form.portrait ? (cycling ? `<button class="art-button" ${control} aria-label="${escape(form.name)}. Left side: previous; right side: next ${history ? 'appearance' : 'unlocked form'}. Keyboard: left/right arrows">${image}</button>` : image) : `<div class="portrait-placeholder"><div class="portrait-symbol">?</div><span>YOUR STORY AWAITS</span><p>Your portrait will appear<br>when your story begins.</p></div>`}</div><div class="stage-name">${escape(data.character.name)}</div><div class="stage-bottom"><span>${escape(history ? 'ART ARCHIVE' : data.character.race || 'RACE UNRECORDED')}</span><span class="portrait-form" aria-live="polite"><strong>${heading(form.name)}</strong>${history ? `<span>${escape(form.caption || '')}</span>` : ''}${cycling ? `<small aria-label="Image ${index+1} of ${items.length}">‹ &nbsp; ${index+1} / ${items.length} &nbsp; ›</small>` : ''}</span></div></section>`;
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
    dialog.innerHTML = `<div class="dialog-top"><span class="eyebrow">${escape(data.character.name)} / POWER LEVEL</span><button class="icon-button close-dialog" aria-label="Close power details" autofocus>×</button></div><h2 id="power-dialog-title">Power Level</h2><p>Calculated ceilings from your recorded base; availability and control are listed separately.</p><dl class="power-level-list">${rows.map(f=>`<div><dt>${escape(f.name)} <span>×${escape(f.multiplier)}</span>${f.status ? `<small class="form-status">${escape(f.status)}</small>` : ''}</dt><dd>${escape(exactPower(multiplyPower(data.character.battlePower,f.multiplier)))}</dd></div>`).join('')}</dl>${rows.length===1 ? '<p>No transformations unlocked yet.</p>' : ''}<p class="power-reading-note">${escape(data.character.powerReading || '')}</p>${data.character.powerHistory ? `<details class="record-history"><summary>Power Development</summary><p>First reading: ${escape(exactPower(data.character.initialPower))}.</p><p>${escape(data.character.powerHistory)}</p></details>` : ''}`;
    dialog.showModal();
  }
  function pageHeader(number, title, description) {
    return `<div class="page-heading"><div><span class="eyebrow">${number} / YOUR ADVENTURE</span><h1>${title}</h1></div>${description ? `<p>${description}</p>` : ''}</div>`;
  }
  const definition = (label, v, sub = '') => `<div><dt>${heading(label)}</dt><dd>${value(v)}${sub ? `<small>${escape(sub)}</small>` : ''}</dd></div>`;
  const detail = (title, text, fallback, key = title) => `<details data-detail-key="${escape(key)}"><summary>${heading(title)}</summary><p>${escape(text || fallback)}</p></details>`;
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
    const forms = record.canTransform === true ? orderedForms(artItems(art.forms).filter(a => a.unlocked === true),true).map(f=>({...f,name:formArtName(f)})) : [];
    return {appearance, ...(record.canTransform === true && (appearance.length || forms.length) ?
      {forms:appearance.length ? [{...appearance.at(-1),name:'Base',multiplier:1}, ...forms] : forms} : {})};
  }
  function recordGallery(record, kind) {
    const collections = galleryCollections(record,kind);
    const modes = Object.keys(collections).filter(k => collections[k].length);
    if (!modes.length) return '';
    const state = artSelections.get(record.id) || {mode:modes.includes('forms')?'forms':modes[0],index:0};
    if (!modes.includes(state.mode)) { state.mode=modes[0]; state.index=0; }
    const items = collections[state.mode]; state.index %= items.length;
    artSelections.set(record.id,state);
    const item = items[state.index], multiple=items.length>1;
    const power = kind==='people' && state.mode==='forms' && present(record.battlePower) && present(item.multiplier) ? multiplyPower(record.battlePower,item.multiplier) : null;
    const powerCaption = power !== null ? `<div class="gallery-power" aria-live="polite"><span>Power Level ${escape(exactPower(power))}</span></div>` : '';
    const image = `<img class="record-art-image" src="${escape(item.portrait)}" alt="${escape(item.portraitAlt || item.name)}" loading="lazy" width="${kind==='places'?1200:853}" height="${kind==='places'?750:1280}"><span class="record-art-error" hidden>Artwork temporarily unavailable</span>`;
    return `<section class="record-gallery ${kind==='places'?'place-gallery':'person-gallery'}" data-gallery="${escape(record.id)}" data-gallery-kind="${kind}" aria-label="${escape(record.title)} artwork"><div class="gallery-heading"><span class="eyebrow">${kind==='places'?'ART ARCHIVE':'APPEARANCE ARCHIVE'}</span>${modes.length>1 ? `<div class="gallery-modes" role="group" aria-label="Art collection">${['forms','appearance'].filter(k=>modes.includes(k)).map(k=>`<button data-gallery-mode="${k}" aria-pressed="${state.mode===k}">${k==='forms'?'Forms':labels.appearanceHistory}</button>`).join('')}</div>` : ''}</div>${multiple ? `<button class="record-art-frame" data-gallery-cycle="0" aria-label="${escape(item.name)}. Left: previous image; right: next image. Arrow keys also navigate.">${image}</button>` : `<div class="record-art-frame">${image}</div>`}<div class="gallery-caption"><div aria-live="polite"><strong>${heading(item.name)}</strong>${kind==='places' ? `<span class="art-date">${escape(item.date)}</span>` : ''}</div>${kind==='people' ? powerCaption : multiple ? `<div class="gallery-navigation"><button data-gallery-cycle="-1" aria-label="Previous artwork">‹</button><span aria-label="Image ${state.index+1} of ${items.length}">${state.index+1} / ${items.length}</span><button data-gallery-cycle="1" aria-label="Next artwork">›</button></div>` : ''}</div></section>`;
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
    if (['people','projects','inventory','accounts'].includes(kind)) return items.map(r => worldRecord(r,kind)).join('');
    return items.map(r => {
      const gallery = ['people','places'].includes(kind) ? recordGallery(r,kind) : '';
      return `<article class="record" id="record-${escape(r.id)}" tabindex="-1">${r.status || r.date ? `<div class="record-meta">${escape([r.status,r.date].filter(Boolean).join(' / '))}</div>` : ''}<h3>${escape(r.title)}</h3><p>${escape(r.summary || '')}</p>${Array.isArray(r.facts) && r.facts.length ? `<dl class="definition-grid">${r.facts.map(f => definition(f.label,f.value,f.note)).join('')}</dl>` : ''}${r.details || gallery ? `<div class="detail-list record-details"><details data-detail-key="${escape(r.id)}"><summary>Read More</summary>${r.details ? `<p>${escape(r.details)}</p>` : ''}${gallery}</details></div>` : ''}</article>`;
    }).join('');
  }
  function recordSections(record, kind) {
    if (kind==='inventory' || kind==='accounts') return `<section class="content-section">${record.facts?.length ? `<dl class="definition-grid">${record.facts.map(f=>definition(f.label,f.value,f.note)).join('')}</dl>` : ''}${record.details ? `<p>${escape(record.details)}</p>` : ''}</section>`;
    const placeOrder=['Description','Location & access','Current circumstances'];
    const ordered=kind==='places' ? (record.sections || []).slice().sort((a,b)=>placeOrder.indexOf(a.title)-placeOrder.indexOf(b.title)) : (record.sections || []);
    const sections = ordered.map(s => {
      const gallery = (kind==='people' && s.title==='Identity & appearance') || (kind==='places' && s.title.startsWith('Description')) ? recordGallery(record,kind) : '';
      return `<section class="content-section"><h4>${heading(s.title)}</h4>${s.text ? `<p>${escape(s.text)}</p>` : ''}${s.facts?.length ? `<dl class="definition-grid">${s.facts.map(f=>definition(f.label,f.value,f.note)).join('')}</dl>` : ''}${gallery}</section>`;
    }).join('');
    return sections + (record.visitRecord ? `<details class="record-history"><summary>Visits</summary><p>${escape(record.visitRecord)}</p></details>` : '') + historyLinks(record.history,kind==='people'?'Encounters':kind==='places'?'Visits':'Milestones');
  }
  function historyLinks(ids, title='Training history') {
    const events=(ids || []).map(id=>data.events.find(e=>e.id===id)).filter(Boolean);
    return events.length ? `<details class="record-history"><summary>${heading(title)}</summary><ol>${events.map(e=>`<li><a href="#chronicle/${escape(e.id)}">${escape(e.title)}</a><small>${escape(e.date || '')}</small></li>`).join('')}</ol></details>` : '';
  }
  function worldRecord(r,kind) {
    return `<details class="world-record" id="record-${escape(r.id)}" data-detail-key="${escape(r.id)}" ${kind==='people' ? worldOpen(r.id) : ''}><summary class="world-record-heading"><span class="record-meta">${escape(r.status || '')}</span><h3>${heading(r.title)}</h3>${r.context ? `<span class="record-context">${escape(r.context)}</span>`:''}<span class="record-preview">${escape(kind==='projects' ? r.nextStep : r.summary)}</span></summary><div class="world-record-body">${recordSections(r,kind)}</div></details>`;
  }
  function overview() {
    const entries = [
      ['character','Character','The hero of your next life','01'],
      ['chronicle','Story','Your journey, chapter by chapter','02'],
      ['abilities','Techniques','Find your fighting spirit','03'],
      ['inventory','Inventory','Everything you take with you','04'],
      ['world','World','Your people, places and next steps','05']
    ];
    return `<section class="title-screen"><div class="menu-column"><div class="title-logo"><span class="logo-kicker">AN ISEKAI ADVENTURE</span><h1><span>DRAGON <em>BALL</em></span><strong>STORIES</strong></h1><span class="logo-rule">YOUR NEXT LIFE STARTS HERE</span></div><nav class="game-menu" aria-label="Adventure menu">${entries.map(([key,label,desc,n])=>`<a class="menu-choice" href="#${key}" data-menu><span class="menu-number">${n}</span>${icon(key)}<span class="menu-title">${label}</span><span class="menu-arrow">›</span><span class="menu-description">${desc}</span></a>`).join('')}</nav></div><div class="home-feature"><span class="chapter-tag">${data.started ? 'YOUR ADVENTURE' : 'BEFORE CHAPTER ONE'}</span><h2>${data.started ? 'What happens<br><em>next?</em>' : 'A new world.<br><em>A new you.</em>'}</h2><p>${escape(data.story.situation || `The next chapter belongs to you, ${data.character.name}.`)}</p><a class="primary launch-button" href="${data.started ? '#chronicle' : '#character'}">${data.started ? 'Return to your story' : 'Meet Zero'} ${icon('arrow')}</a></div><div class="scene-caption">${data.started ? 'DECORATIVE MENU SCENERY' : 'DECORATIVE MENU SCENERY'}</div></section>`;
  }
  function character() {
    const c=data.character;
    return pageHeader('01','Character','Your place in the story.')+`<div class="character-layout">${portraitPanel()}<div class="character-info"><div class="player-banner"><span class="eyebrow">${data.started ? 'YOUR PROTAGONIST' : 'CHARACTER SETUP'}</span><h2>${escape(c.name)}<span class="status-stamp">${data.started ? 'PATROL TRAINEE' : 'IN THE MAKING'}</span></h2></div><div class="stat-ribbon"><div><small>AGE</small><strong>${escape(c.age ?? '—')}</strong><span>YEARS${Number.isInteger(c.ageMonths) ? ` · ${escape(c.ageMonths)} MONTHS` : ''}</span></div><div><small>HEIGHT</small><strong>${escape(c.height || '—')}</strong><span>${escape(c.heightMetric || 'UNDECIDED')}</span></div></div>${present(c.battlePower) ? `<section class="power-panel" aria-label="Current Power Level"><div><button class="power-readout" data-power-details aria-haspopup="dialog" aria-label="Power level ${escape(exactPower(c.battlePower))}. View exact base and unlocked forms"><span class="eyebrow">POWER LEVEL</span><strong>${escape(compactPower(c.battlePower))}</strong></button><span>${escape(c.powerReading)}</span></div><div><span class="status-stamp">${escape(c.fieldStatus || 'SUPERVISED TRAINING')}</span><p>${escape(c.condition)}</p></div></section>` : ''}<a class="power-reference-link" href="#scale">${labels.powerReference} <span aria-hidden="true">→</span></a><section class="panel identity-panel"><h3>Identity & Background</h3><div class="detail-list">${detail('Identity & appearance',[c.race,c.origin,c.appearance].filter(Boolean).join('\n'),'Your discovered identity and appearance will be recorded here.')}${detail('Personality & purpose',[c.personality,c.motivation].filter(Boolean).join('\n'),'Your character record will grow with the story.')}${detail('Backstory',c.backstory,'No backstory has been recorded here.')}${detail('Arrival & new identity',c.arrival,'No arrival has been recorded yet.')}${detail('Knowledge & limits',[c.knowledge,c.limitations].filter(Boolean).join('\n'),'Known information and discovered limits will appear here.')}</div></section></div></div>`;
  }
  // Presentation categories are independent of energy source and mastery.
  // Empty groups, including future magic, are omitted by the list renderer.
  const abilityGroups = [
    {id:'forms',title:'Transformation & Amplification'},
    {id:'ki',title:'Ki Techniques'},
    {id:'physical',title:'Physical Techniques'},
    {id:'spirit-control',title:'Spirit Control Techniques'},
    {id:'discipline',title:'Discipline'},
    {id:'magic',title:'Magical Techniques'}
  ];
  function abilityGroup(ability) {
    return abilityGroups.find(group=>group.id===(techniqueProgress?.records?.[ability.id]?.category || ability.category)) || {id:'other',title:'Other Techniques'};
  }
  function progressState(ability) {
    return tierProgress(techniqueProgress?.records?.[ability.id]);
  }
  function tierProgress(record) {
    if(record?.mode==='involuntary') return {record, label:'Involuntary', note:record.note};
    const tiers=combatReference?.tiers;
    const credits=record?.credits;
    if(!Array.isArray(tiers) || tiers.length<2 || !Number.isFinite(credits) || credits<0)
      return {record, label:'Not Yet Assessed', note:'Progress Not Yet Assessed'};
    const index=tiers.findLastIndex(t=>credits>=t.credits);
    const current=tiers[index], next=tiers[index+1];
    if(!current) return {record, label:'Not Yet Assessed', note:'Progress Unavailable'};
    const percent=next ? 100*(credits-current.credits)/(next.credits-current.credits) : 100;
    return {record,credits,label:current.name,next,percent,remaining:next?next.credits-credits:0};
  }
  const creditText=n=>n.toLocaleString('en',{maximumFractionDigits:1});
  function techniqueArt(ability) {
    return safePortrait(techniqueProgress?.records?.[ability.id]?.artwork) || safePortrait(ability.artwork);
  }
  const techniqueTitle=ability=>techniqueProgress?.records?.[ability.id]?.title || ability.title;
  function learningMeter(ability) {
    return progressMeter(techniqueTitle(ability),progressState(ability));
  }
  function progressMeter(title,p) {
    const assessed=Number.isFinite(p.credits);
    const showNumbers=assessed && p.label!=='Mastered';
    const target=assessed ? (p.next?.name ? `Next · ${p.next.name}` : '') : '';
    const numbers=showNumbers ? `${creditText(p.credits)}${p.next?' / '+creditText(p.next.credits):''}` : '';
    const accessible=showNumbers ? `${p.label}; ${numbers}${p.next?.name?`; next ${p.next.name}`:''}` : p.label;
    const fill=assessed?`<span class="technique-progress-interior"><span class="technique-progress-fill" style="width:${p.percent}%"></span></span>`:'';
    return `<span class="technique-progress${assessed?'':' is-unassessed'}"><span class="technique-progress-label"><span class="technique-rank">${escape(p.label)}</span>${showNumbers?`<span class="technique-progress-total">${numbers}</span>`:''}</span>${assessed?`<span class="technique-progress-track" role="progressbar" aria-label="${escape(title)} learning progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p.percent)}" aria-valuetext="${escape(accessible)}">${fill}</span>${target?`<span class="technique-progress-next">${escape(target)}</span>`:''}`:''}</span>`;
  }
  function learningDetails(ability) {
    const p=progressState(ability), record=p.record;
    const milestones=p.label==='Learning' && ability.id!=='spirit-bomb'?[]:record?.milestones || [], tierIndex=combatReference?.tiers?.findIndex(t=>t.name===p.label) ?? -1;
    return `<section class="content-section technique-learning"><h3>Mastery</h3>${learningMeter(ability)}${milestones.length?`<details class="record-history"><summary>Path to Mastery</summary><ol class="technique-milestones">${milestones.map(m=>{const i=combatReference?.tiers?.findIndex(t=>t.name===m.tier) ?? -1;return `<li${p.label===m.tier?' class="is-current"':i>=0 && i<tierIndex?' class="is-reached"':''}><strong>${escape(m.tier)}${p.label===m.tier?'<small>Current</small>':''}</strong><p>${escape(m.benefit)}</p>${techniqueCapabilities(ability,m.tier)}</li>`;}).join('')}</ol></details>`:''}</section>`;
  }
  function techniqueCapabilities(ability, previewTier=null) {
    const p=progressState(ability), profile=p.record?.capability;
    if(!profile) return '';
    const names=['Learned','Proficient','Advanced','Mastered'];
    const index=Math.max(0,names.indexOf(previewTier || p.label));
    const m=profile.mechanics || {}, rows=[];
    const add=(label,value)=>rows.push([label,value]);
    if(['form','kaioken','involuntary'].includes(profile.kind) && !previewTier) add('Power Multiplier','×'+m.factor);
    if(['contact','supplied'].includes(profile.kind)) {
      if(!previewTier) add('Regular Release','×'+m.regular);
      add(previewTier?'Charge Limit':'Current Charge Limit','×'+m.ceiling[index]);
    }
    if(profile.kind==='kiai') add('Maximum Boost','+'+(m.bonus[index]*100)+'% Form Power');
    if(profile.kind==='duplication') add('Additional Bodies',String(m.copies[index]));
    if(profile.kind==='growth') add('Maximum Height','×'+m.heightFactor[index]);
    if(profile.kind==='teleport' && !previewTier) add('Destination','Senseable Living Ki');
    if(profile.kind==='healing') add('Tissue Repair',index<2?'Superficial Wounds':'Serious Wounds With Viable Tissue');
    if(!previewTier && m.rangeBands?.length) add('Reach',m.rangeBands[0]==='Engaged'?'Contact':m.rangeBands[0]==='Short'?'Nearby':'Distant');
    if(ability.id==='flight' && !previewTier && m.travelReferencePower>0) {
      const speed=m.travelAnchorMetresPerSecond*Math.sqrt(Number(data.character.battlePower)/m.travelReferencePower)*m.travelCoefficient/1000;
      add('Max Speed · Base',(Math.floor(speed*10)/10).toLocaleString('en',{minimumFractionDigits:1,maximumFractionDigits:1})+' km/s');
    }
    if(!rows.length) return '';
    const list=`<dl>${rows.map(([label,value])=>`<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>`;
    return previewTier ? `<div class="technique-output">${list}</div>` : `<section class="content-section technique-output"><h3>${p.label==='Learning'?'Learning Capability':'Current Capability'}</h3>${list}</section>`;
  }
  function abilities() {
    const groups=[...abilityGroups,{id:'other',title:'Other Techniques'}];
    return pageHeader('03','Techniques','')+
      `<div class="ability-collection">${groups.map(group=>{
        const items=data.abilities.filter(r=>abilityGroup(r).id===group.id);
        return items.length ? `<section class="ability-group" aria-labelledby="ability-group-${group.id}"><h2 id="ability-group-${group.id}">${group.title}</h2><div class="ability-grid">${items.map(r=>`<button class="ability-card" id="record-${escape(r.id)}" data-ability="${escape(r.id)}" aria-haspopup="dialog"><span class="ability-card-art">${techniqueArt(r)?`<img class="ability-image" src="${escape(techniqueArt(r))}" alt="" loading="lazy">`:''}</span><span class="ability-card-copy"><strong>${heading(techniqueTitle(r))}</strong><span class="ability-card-description">${escape(r.summary)}</span>${learningMeter(r)}</span></button>`).join('')}</div></section>` : '';
      }).join('')}</div>`;
  }
  function showAbility(id) {
    const ability=data.abilities.find(r=>r.id===id);
    if(!ability) return;
    let dialog=$('ability-dialog');
    if(!dialog) {
      dialog=document.createElement('dialog');dialog.id='ability-dialog';dialog.className='ability-dialog';
      dialog.setAttribute('aria-labelledby','ability-dialog-title');document.body.append(dialog);
      dialog.addEventListener('close',()=>document.querySelector(`[data-ability="${dialog.dataset.ability}"]`)?.focus({preventScroll:true}));
      dialog.addEventListener('click',e=>{if(e.target.closest('a[href^="#"]')) dialog.close();});
    }
    dialog.dataset.ability=id;
    const forms=unlockedForms().filter(f=>(ability.formIds || []).includes(f.id));
    const block=(title,text)=>text?`<section class="content-section"><h3>${heading(title)}</h3><p>${escape(text)}</p></section>`:'';
    const history=ability.trainingRecord;
    dialog.innerHTML=`<header class="ability-detail-header"><div class="ability-detail-heading">${techniqueArt(ability)?`<img src="${escape(techniqueArt(ability))}" alt="">`:''}<div><span class="ability-category">${escape(abilityGroup(ability).title)}</span><h2 id="ability-dialog-title">${heading(techniqueTitle(ability))}</h2></div></div><button class="icon-button close-dialog" aria-label="Close technique details" autofocus>×</button></header><div class="ability-detail-body" tabindex="0" role="region" aria-label="Technique information">${learningDetails(ability)}${techniqueCapabilities(ability)}${block('Effect',ability.effect)}${forms.length?`<section class="content-section"><h3>Stages & Power</h3><dl class="power-level-list">${forms.map(f=>`<div><dt>${escape(f.name)}${/[×x]\s*\d/i.test(f.name)?'':`<span>×${escape(f.multiplier)}</span>`}</dt><dd>${escape(exactPower(multiplyPower(data.character.battlePower,f.multiplier)))}</dd></div>`).join('')}</dl></section>`:''}${block('Appearance',ability.appearance)}${block('Control & compatibility',ability.control)}<section class="content-section"><h3>Development</h3><p>${escape(ability.development)}</p>${historyLinks(ability.history)}${history?`<details class="record-history"><summary>Detailed Training Record · ${escape(history.asOf)}</summary><p>${escape(history.text)}</p>${history.facts?.length?`<dl class="definition-grid">${history.facts.map(f=>definition(f.label,f.value,f.note)).join('')}</dl>`:''}</details>`:''}</section></div>`;
    dialog.showModal();
  }
  function scalePage() {
    if (!scale) return pageHeader('01',labels.powerReference,'Approved campaign calculations.')+'<section class="panel"><p>The reference could not be loaded.</p><a class="quick-link" href="./POWER-SCALE.md">Read the full reference</a></section>';
    const number = v => decimal(v) ? compactPower(v) : String(v);
    return pageHeader('01',labels.powerReference,'Reader reference · Not acquired techniques.')+`<nav class="record-jumps"><a href="#abilities">Your Techniques</a><a href="./POWER-SCALE.md">Full Rulings & Sources</a></nav><section class="panel scale-reference"><h2>Fusion</h2><p>Base = 2 × (A × eligible factor A + B × eligible factor B). Then apply the fusion’s form. Kaioken and actual external supply multiply separately. Fusion-only unlocks do not enter the participants retroactively.</p><p>Approved campaign estimates and explicit story adaptations; original anime, manga and alternate counterparts remain separate. This reference grants Zero no new form.</p><details><summary>Shared Form Multipliers</summary><dl class="definition-grid">${Object.entries(scale.forms).map(([name,factor])=>definition(name,'×'+number(factor))).join('')}</dl></details><h2>24 Encounter Cases</h2>${scale.cases.map(c=>`<details id="record-scale-${c.id}" data-detail-key="scale-${c.id}"><summary>${c.id}. ${escape(c.name)} · ${escape(c.medium)}</summary><dl class="definition-grid">${definition('Ordinary participant A',number(c.a))}${definition('Ordinary participant B',number(c.b))}${definition('Eligible A',c.input_a+' · ×'+number(c.factor_a))}${definition('Eligible B',c.input_b+' · ×'+number(c.factor_b))}${definition('Fusion base',number(c.base))}${Object.entries(c.states).map(([form,power])=>definition(form,number(power),decimal(power)?exactPower(power):'Exact rational value')).join('')}</dl><p>${escape(c.note)}</p><p><strong>Wiki comparison:</strong> ${escape(c.wiki_comparison)}</p></details>`).join('')}<p>All 24 cases and 175 declared checks passed. Full connected encounter tables and campaign adaptations are in the linked reference.</p></section>`;
  }
  function rewardOrb(stars, held) {
    const layouts = [[],[[50,50]],[[38,50],[62,50]],[[50,37],[36,61],[64,61]],[[37,37],[63,37],[37,63],[63,63]],[[34,34],[66,34],[50,50],[34,66],[66,66]],[[35,31],[65,31],[35,50],[65,50],[35,69],[65,69]],[[50,50],[50,25],[72,38],[72,63],[50,76],[28,63],[28,38]]];
    const shape='0,-7 2,-2 7,-2 3,1 4,6 0,3 -4,6 -3,1 -7,-2 -2,-2';
    return `<li class="collection-ball ${held?'is-held':'is-missing'}" aria-label="${stars}-Star Ball: ${held?'collected':'not collected'}"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="reward-orb-${stars}" cx="32%" cy="25%" r="80%"><stop stop-color="#fff1a0"/><stop offset=".4" stop-color="#ffbb35"/><stop offset=".8" stop-color="#ed7c0c"/><stop offset="1" stop-color="#ad3b05"/></radialGradient></defs><circle class="orb-body" cx="50" cy="50" r="44" ${held?`fill="url(#reward-orb-${stars})"`:''}/><g class="orb-stars">${layouts[stars].map(([x,y])=>`<polygon points="${shape}" transform="translate(${x} ${y})"/>`).join('')}</g>${held?'<ellipse class="orb-shine" cx="32" cy="24" rx="14" ry="6" transform="rotate(-35 32 24)"/>':''}</svg><span>${stars}-Star</span><small>${held?'Collected':'Missing'}</small></li>`;
  }
  function rewardsPanel() {
    const r=data.rewards, record=data.inventory.find(x=>x.id==='patrol-dragon-balls');
    if(!r || !record) return '';
    return `<section class="panel collection-panel" id="record-patrol-dragon-balls" tabindex="-1" aria-labelledby="collection-title"><div class="collection-heading"><div><span class="eyebrow">REWARD COLLECTION · ${escape(r.set)}</span><h2 id="collection-title">${heading(record.title)}</h2></div><span class="collection-count"><strong>${r.heldStars.length}</strong><span>/ 7 collected</span></span></div><ul class="collection-balls">${Array.from({length:7},(_,i)=>rewardOrb(i+1,r.heldStars.includes(i+1))).join('')}</ul><div class="collection-foot"><p><strong>${r.wishMade?'Wish recorded':`${7-r.heldStars.length} more to complete the set`}</strong><span>${escape(r.storage)}</span></p><div class="commendation-count"><span class="eyebrow">UNSPENT COMMENDATIONS</span><strong>${escape(r.unspentCommendations)}</strong></div></div><div class="detail-list">${detail('Collection details',record.details,'',record.id)}</div></section>`;
  }

  function inventory() {
    return pageHeader('04','Inventory','Pack for a life beyond the ordinary.')+rewardsPanel()+`<div class="loadout-screen"><section class="panel main-panel"><h2>Possessions</h2>${data.inventory.length ? records(data.inventory.filter(r=>r.id!=='patrol-dragon-balls'),'inventory') : empty('inventory','What comes with you?','Your known possessions will appear here once they are established in the story.')}</section><aside class="panel funds-panel"><div class="capsule-object" aria-hidden="true"><span>CAPSULE</span><b>CC</b></div><h2>Resources</h2>${data.accounts.length ? records(data.accounts,'accounts') : '<span class="balance">—</span><p>No known funds have been recorded yet.</p>'}<span class="eyebrow">CARRIED · STORED · OWNED</span></aside></div>`;
  }

  function recordTitle(record, kind) {
    if (kind === 'events') return record.title;
    if (kind === 'abilities') return titleCase(techniqueTitle(record));
    return titleCase(kind === 'places' && !record.parentId ? timelineTitle(record) : record.title);
  }
  function timelineTitle(place) {
    return place.id === 'timeline-503' ? timelineLabels['503']+' · Yamcha’s Home' : place.title;
  }
  function timelineHeading(title,count,noun) {
    return `<summary class="timeline-heading"><span class="timeline-name">${heading(title)}</span><span class="timeline-count">${count} ${noun}</span><span class="timeline-chevron" aria-hidden="true"></span></summary>`;
  }
  function peopleGroups() {
    const roots=data.places.filter(p=>!p.parentId);
    const groups=[...roots.map(p=>({id:p.id,title:timelineTitle(p)})),{id:'unknown-timelines',title:'Unknown Timelines'}];
    const known=new Set(groups.map(g=>g.id));
    return groups.map(group=>{
      const people=data.people.filter(p=>(known.has(p.worldGroup)?p.worldGroup:'unknown-timelines')===group.id);
      const key='people-'+group.id;
      return people.length ? `<details class="world-timeline" data-detail-key="${escape(key)}" ${worldOpen(key)}>${timelineHeading(group.title,people.length,people.length===1?'Person':'People')}<div class="timeline-content">${records(people,'people')}</div></details>` : '';
    }).join('');
  }
  function placeCount(id) {
    return data.places.filter(p=>p.parentId===id).reduce((total,p)=>total+1+placeCount(p.id),0);
  }
  function placeTree(parentId = null) {
    return data.places.filter(p => (p.parentId || null) === parentId).map(p => {
      const children=placeTree(p.id);
      const detail=`${p.status || p.date ? `<div class="record-meta">${escape([p.status,p.date].filter(Boolean).join(' / '))}</div>` : ''}${recordSections(p,'places')}`;
      if(!parentId) {
        const count=placeCount(p.id),aboutKey='about-'+p.id;
        return `<details class="world-timeline" id="record-${escape(p.id)}" data-place-id="${escape(p.id)}" data-detail-key="${escape(p.id)}" ${worldOpen(p.id)}>${timelineHeading(timelineTitle(p),count,count===1?'Place':'Places')}<div class="timeline-content">${children}<details class="timeline-about" data-detail-key="${escape(aboutKey)}" ${worldOpen(aboutKey)}><summary>${heading(p.id==='toki-toki-city'?'About Conton City':'About This Timeline')}</summary><div class="world-record-body"><p>${escape(p.summary || '')}</p>${detail}</div></details></div></details>`;
      }
      return `<details class="place-node" id="record-${escape(p.id)}" data-place-id="${escape(p.id)}" data-detail-key="${escape(p.id)}" tabindex="-1" ${worldOpen(p.id)}><summary><span><strong>${heading(p.title)}</strong><small>${escape(p.context || '')}</small><span class="place-purpose">${escape(p.summary || '')}</span></span></summary><div class="place-content">${detail}${children ? `<div class="place-children">${children}</div>` : ''}</div></details>`;
    }).join('');
  }
  function projects() {
    const active=data.projects.filter(r=>!r.completed),completed=data.projects.filter(r=>r.completed);
    return records(active,'projects')+(completed.length?`<details class="completed-projects" data-detail-key="completed-projects"><summary>Completed · ${completed.length}</summary>${records(completed,'projects')}</details>`:'');
  }

  function world() {
    return pageHeader('05','World','Follow your curiosity.')+`<section class="world-stage"><div class="world-intro"><span class="eyebrow">${data.started ? 'YOUR CURRENT LOCATION' : 'NEXT STOP / ANOTHER LIFE'}</span><h2>${escape(data.story.location || 'Somewhere extraordinary.')}</h2><p>${data.story.location ? 'Your discoveries, connections and ongoing projects are gathered below.' : 'Your surroundings and discoveries will take shape here as the adventure unfolds.'}</p><dl class="definition-grid">${definition('Era / continuity',data.story.era)}${definition('Current date',data.story.date)}</dl></div></section><nav class="record-jumps" aria-label="World categories"><a href="#world">All</a><a href="#world/people">People <span>${data.people.length}</span></a><a href="#world/places">Places <span>${data.places.length}</span></a><a href="#world/projects">Ongoing <span>${data.projects.length}</span></a></nav><div class="world-groups"><section class="panel" id="record-people" tabindex="-1"><h2>People</h2>${data.people.length ? peopleGroups() : '<p>Friends, rivals, strangers.<br>Your first encounter is still ahead.</p>'}</section><section class="panel" id="record-places" tabindex="-1"><h2>Places</h2>${data.places.length ? placeTree() : '<p>A world waiting to unfold.<br>No discoveries recorded yet.</p>'}</section><section class="panel" id="record-projects" tabindex="-1"><h2>Ongoing</h2>${data.projects.length ? projects() : '<p>Big ideas start somewhere.<br>No projects started yet.</p>'}</section></div>`;
  }
  function chronicle() {
    return pageHeader('02','Story','Your journey, from the latest moment to the first.')+`<div class="story-screen"><section class="chapter-cover"><span class="eyebrow">${data.started ? 'THE JOURNEY SO FAR' : 'YOUR FIRST SAGA'}</span><img src="./dragon-ball.svg?v=${release}" width="130" height="130" alt="One-star Dragon Ball"><h2>${data.started ? 'The story<br>continues.' : 'Beyond<br>the familiar.'}</h2><span class="chapter-tag">${data.started ? escape(data.phase) : 'CHAPTER ONE / NOT STARTED'}</span></section><section class="story-content">${data.started ? `<div class="pending-choice"><span class="eyebrow">CURRENT CHECKPOINT / ${escape(data.story.date)}</span><p>${escape(data.story.pendingChoice)}</p></div><nav class="record-jumps" aria-label="Journal navigation"><a href="#chronicle/${escape(data.events.at(-1)?.id || '')}">Latest Entry</a><a href="#chronicle/${escape(data.events[0]?.id || '')}">The Beginning</a><span>${data.events.length} entries · newest first</span></nav>` : ''}${data.events.length ? records([...data.events].reverse()) : `<span class="eyebrow">PROLOGUE / CHARACTER CREATION</span><h2>The first step<br>is yours.</h2><p>Your journey has yet to begin. This journal will follow what you experience and discover.</p><div class="story-progress"><span class="complete">Name, age & height</span><span>Character & artwork</span><span>Opening setting</span></div><a class="primary" href="#character">Meet Zero ${icon('arrow')}</a><p class="subtle-note">No opening scene has taken place yet.</p>`}</section></div>`;
  }
  const pages = {overview,character,abilities,inventory,world,chronicle,scale:scalePage};
  function hideSearch() { $('search-results').hidden = true; $('search').setAttribute('aria-expanded','false'); }
  function render(focus = false, preserveView = false) {
    const scroll={x:window.scrollX,y:window.scrollY};
    document.querySelectorAll('.world-groups details[data-detail-key]').forEach(node=>{
      worldExpansion.set(node.dataset.detailKey,node.open);
    });
    // Keep enough document height for the existing viewport while switching filters.
    $('main').style.minHeight=preserveView ? Math.max(0,scroll.y+innerHeight-$('main').offsetTop)+'px' : '';
    let [route, recordId] = location.hash.slice(1).split('/');
    if (!Object.hasOwn(pages, route)) route = 'overview';
    if (route === 'world' && recordId === 'channel-test-hall') recordId = 'practice-hall';
    if (route === 'inventory' && ['two-star-dragon-ball','four-star-dragon-ball'].includes(recordId)) recordId = 'patrol-dragon-balls';
    if (route === 'inventory' && recordId === 'cape') recordId = 'outfit';
    document.body.dataset.page = route;
    $('main').innerHTML = pages[route]();
    $('main').classList.remove('screen-enter');
    if (!preserveView) { void $('main').offsetWidth; $('main').classList.add('screen-enter'); }
    $('breadcrumb').textContent = (nav.find(n => n[0] === route)?.[1] || labels.powerReference);
    document.title = `${$('breadcrumb').textContent} · Dragon Ball Stories`;
    document.querySelectorAll('.nav-link').forEach(a => {
      if (a.hash === '#'+route) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    $('campaign-status').textContent = data.started ? (data.story.date || 'Story in progress') : 'Before the first chapter';
    hideSearch();
    bindPortraitError();
    bindGalleryErrors();
    document.querySelectorAll('.ability-image').forEach(img => img.addEventListener('error', () => img.remove(), {once:true}));
    if (focus && !preserveView) { $('main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
    const worldCategory = route === 'world' && ['people','places','projects'].includes(recordId);
    if (route === 'world') {
      document.querySelectorAll('.world-groups > section').forEach(section => {
        if (worldCategory && section.id !== 'record-'+recordId) section.remove();
      });
      document.querySelectorAll('[aria-label="World categories"] a').forEach(link => {
        if (link.hash === (worldCategory ? '#world/'+recordId : '#world')) link.setAttribute('aria-current','page');
      });
    }

    if (recordId && !worldCategory && /^[a-z0-9-]+$/.test(recordId)) {
      const record = $('record-'+recordId);
      if (record) { for(let ancestor=record.parentElement;ancestor;ancestor=ancestor.parentElement) if(ancestor.matches('details')) { ancestor.open=true; } if(record.matches('details')) record.open=true; record.scrollIntoView({block:'start'}); (record.querySelector(':scope > summary') || record).focus({preventScroll:true}); }
    }
    if(route==='abilities' && data.abilities.some(a=>a.id===recordId)) showAbility(recordId);
    if(preserveView) window.scrollTo({left:scroll.x,top:scroll.y,behavior:'instant'});
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
    searchIndex.push({route:'scale',title:labels.powerReference,summary:'Shared multipliers, fusion and 24 Encounter Cases',text:'fusion scale multipliers Super Saiyan God Blue Cumber Baby Crimson'});
    const c = data.character;
    searchIndex.push({route:'character',title:c.name,summary:`Age ${ageLabel(c)}; ${c.height} (${c.heightMetric})`,text:Object.values(c).filter(v => typeof v === 'string' || typeof v === 'number').join(' ')});
    const mapping = {abilities:'abilities',inventory:'inventory',accounts:'inventory',people:'world',places:'world',projects:'world',events:'chronicle'};
    for (const key of groups) for (const r of data[key]) searchIndex.push({route:mapping[key]+'/'+r.id,title:recordTitle(r,key),summary:r.summary || key,text:JSON.stringify(r)});
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
    const filter=event.target.closest('[aria-label="World categories"] a');
    if(filter && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      history.pushState(null,'',filter.hash);
      render(false,true);
      document.querySelector('[aria-label="World categories"] a[aria-current]')?.focus({preventScroll:true});
      return;
    }
    if (event.target instanceof HTMLDialogElement) { const box=event.target.getBoundingClientRect(); if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) event.target.close(); }
    if (event.target.closest('.skip-link')) { event.preventDefault(); $('main').focus(); }
    if (event.target.closest('[data-search]')) { $('search-dialog').showModal(); $('search').focus(); search(); }
    if (event.target.closest('#about-button,[data-about]')) $('about-dialog').showModal();
    if (event.target.closest('.close-dialog')) event.target.closest('dialog').close();
    const result = event.target.closest('.search-result');
    if (result) { $('search-dialog').close(); hideSearch(); $('search').value=''; if (result.hash === location.hash) render(true); }
    const abilityButton = event.target.closest('button[data-ability]');
    if (abilityButton) showAbility(abilityButton.dataset.ability);
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
      data = catalogueRecord(validate(await response.json()));
      // Display current catalogue aliases without rewriting the historical source.
      data.events = data.events.map(event => ({...event, ...Object.fromEntries(['date','summary','details'].filter(key => typeof event[key] === 'string').map(key => [key,catalogueText(event[key])]))}));
      try { const reference=await fetch('./power-scale.json?v='+release,{cache:'no-store',signal:controller.signal}); if(reference.ok) scale=await reference.json(); } catch { /* Main story remains available if reference fails. */ }
      try { const response=await fetch('./combat-reference.json?v='+release,{cache:'no-store',signal:controller.signal}); if(response.ok) {const reference=await response.json();if(reference.schemaVersion===1 && Array.isArray(reference.tiers)) combatReference=reference;} } catch { /* Optional technique details remain absent if their data is unavailable. */ }
      try { const response=await fetch('./technique-progress.json?v='+release,{cache:'no-store',signal:controller.signal}); if(response.ok) {const progress=await response.json();if(progress.schemaVersion===1 && progress.records) techniqueProgress=progress;} } catch { /* Unknown progress is never displayed as zero. */ }
      const retired=new Set(['second-wind','rotation-evasive','rotation-bulwark','rotation-deflection','rotation-riposte']);
      if(techniqueProgress?.mode==='narrative') {
        data.character.condition=techniqueProgress.characterCondition;
        data.abilities=Object.values(techniqueProgress.records).map(r=>r.entry).filter(Boolean);
      } else {
        data.abilities=data.abilities.filter(a=>!retired.has(a.id));
      }
      validate(data);
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
