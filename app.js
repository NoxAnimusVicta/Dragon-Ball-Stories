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
  const nav = [['overview','Overview'],['character','Character'],['abilities','Abilities'],['inventory','Inventory'],['world','World'],['chronicle','Chronicle']];
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.overview}</svg>`;
  const present = value => value !== null && value !== undefined && value !== '';
  const value = (v, fallback = 'Not yet established') => present(v) ? escape(v) : `<span class="unknown">${fallback}</span>`;
  let data;
  let searchIndex = [];
  let portraitUrl = null;
  const groups = ['abilities','inventory','accounts','people','places','projects','events'];

  function validate(d) {
    if (d.schemaVersion !== 1 || !d.character || !d.story || typeof d.character.name !== 'string' || !Array.isArray(d.briefing) || groups.some(k => !Array.isArray(d[k]))) throw new Error('Campaign record format is not supported.');
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
      return url.origin === base.origin && url.pathname.startsWith(base.pathname) && /\.(png|jpe?g|webp|avif|svg)$/i.test(url.pathname) ? url.href : null;
    } catch { return null; }
  }
  const radar = () => '<div class="radar" role="img" aria-label="Decorative Dragon Radar, no story coordinates recorded"><span class="radar-center"></span><span class="radar-label">AWAITING COORDINATES</span></div>';
  function artCard(link = true) {
    const art = portraitUrl ? `<button class="art-button" data-art aria-label="View full character artwork"><img class="portrait-image" src="${escape(portraitUrl)}" alt="${escape(data.character.portraitAlt)}"></button>` : `<div class="portrait-placeholder"><div class="portrait-symbol">${icon('art')}</div><p>YOUR CHARACTER ART</p><small>A place reserved for your portrait.</small></div>`;
    return `<section class="character-card" aria-label="Character portrait"><div class="card-strip"><span>CHARACTER FILE</span><span>${data.started ? 'ACTIVE' : 'IN PREPARATION'}</span></div><div class="portrait">${art}</div><div class="character-caption"><span class="micro">${escape(data.premise)}</span><h2>${escape(data.character.name)}</h2><p>${escape(data.character.race || 'A new life. A world of possibilities.')}</p>${link ? '<a class="text-link" href="#character">Open character file '+icon('arrow')+'</a>' : '<span class="micro">'+(portraitUrl ? 'SELECT ART TO ENLARGE' : 'ARTWORK TO COME')+'</span>'}</div></section>`;
  }
  function pageHeader(number, title, description) {
    return `<div class="section-top"><span class="eyebrow">${number} / FIELD RECORDS</span><span class="phase">${escape(data.phase)}</span></div><div class="page-header"><h1>${title}</h1><p>${description}</p></div>`;
  }
  const definition = (label, v, sub = '') => `<div><dt>${escape(label)}</dt><dd>${value(v)}${sub ? `<small>${escape(sub)}</small>` : ''}</dd></div>`;
  const detail = (title, text, fallback) => `<details><summary>${escape(title)}</summary><p>${escape(text || fallback)}</p></details>`;
  function empty(symbol, title, body, action = false) {
    return `<div class="empty-state"><div class="empty-symbol">${icon(symbol)}</div><h2>${title}</h2><p>${body}</p>${action ? '<button class="text-link" data-brief>Open character brief '+icon('arrow')+'</button>' : '<span class="micro">READY WHEN THE STORY IS</span>'}</div>`;
  }
  function records(items) {
    return items.map(r => `<article class="record" id="record-${escape(r.id)}" tabindex="-1">${r.status || r.date ? `<div class="record-meta">${escape([r.status,r.date].filter(Boolean).join(' / '))}</div>` : ''}<h3>${escape(r.title)}</h3><p>${escape(r.summary || '')}</p>${Array.isArray(r.facts) && r.facts.length ? `<dl class="definition-grid">${r.facts.map(f => definition(f.label,f.value,f.note)).join('')}</dl>` : ''}${r.details ? '<div class="detail-list">'+detail('Read more',r.details,'')+'</div>' : ''}</article>`).join('');
  }
  function overview() {
    const c = data.character;
    const route = (key, title, description) => `<a class="route-card" href="#${key}"><span class="route-icon">${icon(key)}</span><span class="route-copy"><strong>${title}</strong><span>${description}</span></span>${icon('arrow')}</a>`;
    return `<div class="section-top"><span class="eyebrow">YOUR ADVENTURE, AT A GLANCE</span><span class="phase">${escape(data.phase)}</span></div>
    <div class="dashboard"><div><section class="hero"><h1>${data.started ? 'The journey<br><em>continues.</em>' : 'A new world.<br><em>Your story.</em>'}</h1><p>${data.started ? escape(data.story.situation || 'Your character, discoveries and story, all in one place.') : "Welcome, "+escape(c.name)+". Your next life is still unwritten.<br>Let's get to know the person stepping into it."}</p>${data.started ? '<a class="primary" href="#chronicle">Read the chronicle '+icon('arrow')+'</a>' : '<button class="primary" data-brief>Prepare your character '+icon('arrow')+'</button>'}</section>
    <section class="summary-panel" aria-label="Confirmed character details"><div class="summary-cell"><span>NAME</span><strong>${escape(c.name)}</strong><small>Your protagonist</small></div><div class="summary-cell"><span>AGE</span><strong>${escape(c.age ?? '—')}</strong><small>${present(c.age) ? 'Years old' : 'Not established'}</small></div><div class="summary-cell"><span>HEIGHT</span><strong>${escape(c.height || '—')}</strong><small>${escape(c.heightMetric || 'Not established')}</small></div></section>
    <section class="panel" aria-label="Explore your records">${route('abilities','Abilities & techniques',data.abilities.length ? `${data.abilities.length} recorded` : 'Potential, practice and progress')}${route('inventory','Equipment & possessions',data.inventory.length ? `${data.inventory.length} recorded` : 'What you carry into the world')}${route('world','People & places','The world you come to know')}</section>
    <div class="bottom-grid"><section class="panel chapter-card"><div class="chapter-top"><span class="eyebrow">${data.started ? 'STORY RECORD' : 'BEFORE CHAPTER ONE'}</span><img src="./dragon-ball.svg" alt="" width="36" height="36"></div><h2>${data.started ? 'Every moment<br>leaves a mark.' : 'Every great story<br>starts somewhere.'}</h2><p>${data.started ? `${data.events.length} story entries recorded so far.` : 'Your first chapter will appear here once your character and starting world are established.'}</p><a class="text-link" href="#chronicle">View chronicle ${icon('arrow')}</a></section>
    <section class="panel panel-pad"><div class="panel-heading"><h2>${data.started ? 'Current situation' : 'Before we begin'}</h2><span class="eyebrow">${data.started ? 'NOW' : 'SETUP'}</span></div>${data.started ? '<dl class="definition-grid">'+definition('Date',data.story.date)+definition('Location',data.story.location)+'</dl><p class="note">'+escape(data.story.pendingChoice || 'No outstanding choice recorded.')+'</p>' : '<ul class="checklist"><li><span class="check">✓</span><div>Personal basics<small>Name, age and approximate height</small></div></li><li><span class="check pending"></span><div>Character details<small>Identity, abilities and backstory</small></div></li><li><span class="check pending"></span><div>Character art<small>Your portrait, when ready</small></div></li><li><span class="check pending"></span><div>Starting world<small>Era, location and arrival</small></div></li></ul>'}</section></div></div>
    <div class="side-stack">${artCard()}<section class="panel radar-panel">${radar()}<div class="radar-copy"><span class="eyebrow">WORLD REFERENCE</span><h2>${escape(data.story.location || 'Somewhere out there.')}</h2><p>${data.story.location ? 'Open the world record for established locations.' : 'Your starting coordinates are still to be decided.'}</p><a class="text-link" href="#world">Open world ↗</a></div></section></div></div>`;
  }
  function character() {
    const c = data.character;
    return pageHeader('01','Character file',"The person at the heart of the story. Confirmed details, with room for everything still to come.")+`<div class="page-grid"><div class="stack"><section class="panel panel-pad"><div class="panel-heading"><h2>At a glance</h2><span class="eyebrow">${escape(c.name.toUpperCase())}</span></div><dl class="definition-grid">${definition('First name',c.name)}${definition('Age',c.age,'Years old')}${definition('Height',c.height,c.heightMetric)}${definition('Race / species',c.race)}${definition('Origin',c.origin)}${definition('Starting location',data.story.location)}</dl><p class="note">Only your first name, age and approximate height carry over from your personal details. Everything else belongs to the character we create.</p></section>
    <section class="panel panel-pad"><div class="panel-heading"><h2>Identity & background</h2></div><div class="detail-list">${detail('Appearance',c.appearance,'Your character art and description will define this. No further real-world appearance details are assumed.')}${detail('Personality & motivations',[c.personality,c.motivation].filter(Boolean).join('\n'),'Tell me how Jake thinks, what matters to him, and what he wants from this new life.')}${detail('Before the arrival',c.backstory,'Your fictional backstory is not established yet.')}${detail('The isekai',c.arrival,'The method of arrival, new circumstances and what carries over are still open.')}${detail('Knowledge & limitations', [c.knowledge,c.limitations].filter(Boolean).join('\n'),'What Jake knows about Dragon Ball, and the limits he starts with, are not yet established.')}</div></section>
    <section class="panel help-card"><h2>Ready to fill in the rest?</h2><p>Use the character brief as a guide when you send your details and art in our chat. Nothing here starts the story or decides your abilities for you.</p><button class="text-link" data-brief>Open character brief ${icon('arrow')}</button></section></div>${artCard(false)}</div>`;
  }
  function abilities() {
    return pageHeader('02','Abilities & techniques','What you can do, what you are learning, and the limits that give each ability its shape.')+`<div class="page-grid"><section class="panel">${data.abilities.length ? records(data.abilities) : empty('abilities','Potential, still unwritten.','No abilities or power levels have been established. Your starting strengths and limitations will be added with your character details.',true)}</section><section class="panel help-card"><span class="eyebrow">A CLEAR PICTURE</span><h2>More than a number.</h2><p>Established abilities, demonstrated feats and future potential are kept distinct.</p><div class="detail-list">${detail('Strength & control',null,'Output, precision and experience will be recorded separately when they matter.')}${detail('Range & endurance',null,'Reach, duration, recovery and attention are recorded from established facts, not guessed from appearances.')}${detail('Training & progression',null,'Techniques in development remain separate from abilities already mastered.')}</div></section></div>`;
  }
  function inventory() {
    return pageHeader('03','Equipment & possessions','The things you carry, the things you keep, and the resources available to you.')+`<div class="page-grid"><div class="stack"><section class="panel"><div class="panel-pad"><div class="section-label"><span>POSSESSIONS</span><span>${data.inventory.length ? data.inventory.length+' RECORDS' : 'NOT ESTABLISHED'}</span></div></div>${data.inventory.length ? records(data.inventory) : empty('inventory','Pack light. Dream big.','Your starting clothing, equipment and stored belongings have not been decided. Nothing is automatically added to your inventory.',true)}</section><section class="panel"><div class="panel-pad"><h2>Funds & accounts</h2><p class="small muted">Cash carried, stored funds and commitments stay separate.</p></div>${data.accounts.length ? records(data.accounts) : '<div class="record"><p>Opening funds and currency are not yet established.</p><small>No balance is assumed, including zero.</small></div>'}</section></div><section class="panel help-card"><span class="eyebrow">EVERYTHING IN ITS PLACE</span><h2>Carried. Stored. Owned.</h2><p>Each item will have a clear location and status. The interface's Capsule Corp theme does not grant Jake capsules or other equipment.</p><div class="detail-list">${detail('Equipment & condition',null,'Important gear will show where it is, its condition and whether it is equipped.')}${detail('Money & commitments',null,'Actual balances and payments will be recorded separately from forecasts and intended purchases.')}</div></section></div>`;
  }
  function world() {
    return pageHeader('04','A world to discover.','Places, people and possibilities. The world grows here as it becomes part of your story.')+`<section class="panel wide-radar">${radar()}<div><span class="eyebrow">WORLD REFERENCE / ${data.started ? 'ACTIVE STORY' : 'AWAITING ARRIVAL'}</span><h2 style="margin-top:15px">${escape(data.story.location || 'Your destination is still open.')}</h2><p class="muted small">${data.story.location ? 'This display is a visual motif, not a live location tracker.' : 'No starting location or Dragon Ball positions have been established. The radar is a visual motif, not a live location tracker.'}</p><dl class="definition-grid">${definition('Era / continuity',data.story.era)}${definition('Story date',data.story.date)}</dl></div></section><div class="world-groups"><section class="panel"><div class="panel-pad"><h2>People & relationships</h2></div>${data.people.length ? records(data.people) : empty('people','Unfamiliar faces. Future stories.','No encounters or relationships have been recorded yet.')}</section><section class="panel"><div class="panel-pad"><h2>Places & discoveries</h2></div>${data.places.length ? records(data.places) : empty('world','A map waiting to unfold.','Established locations and discoveries will appear as you explore.')}</section></div><section class="panel" style="margin-top:24px"><div class="panel-pad"><h2>Projects & ongoing work</h2></div>${data.projects.length ? records(data.projects) : '<div class="record"><p>No active projects or delegated work recorded.</p><small>When work begins, its progress, owner and next milestone will live here.</small></div>'}</section>`;
  }
  function chronicle() {
    return pageHeader('05','Your story, remembered.','The moments that happened. The choices that mattered. A growing record of your journey.')+`<div class="page-grid"><section class="panel">${data.events.length ? records(data.events) : '<div class="timeline-empty"><div class="timeline-point"><span class="eyebrow">PREPARATION · OUTSIDE THE STORY</span><h2 style="margin-top:13px">A character takes shape.</h2><p>'+escape(data.character.name)+', age '+escape(data.character.age)+', approximate height '+escape(data.character.height)+'. Your remaining character details and portrait are still to come.</p></div><div class="timeline-point future"><span class="eyebrow">CHAPTER ONE · NOT STARTED</span><h2 style="margin-top:13px">The first step is yours.</h2><p>No arrival, scene or story event has taken place in these records. Your opening chapter will appear after the starting details are established.</p></div></div>'}</section><section class="panel help-card"><span class="eyebrow">CONTINUITY MATTERS</span><h2>One consistent journey.</h2><p>Story time moves with events, not with the real-world clock. Plans remain plans until you act on them.</p><p>This is the published chronicle. Full conversation archives and private narrator material are kept separately.</p><a class="text-link" href="https://github.com/NoxAnimusVicta/Dragon-Ball-Stories/blob/main/RETCONS.md">Correction record ↗</a></section></div>`;
  }
  const pages = {overview,character,abilities,inventory,world,chronicle};
  function hideSearch() { $('search-results').hidden = true; $('search').setAttribute('aria-expanded','false'); }
  function render(focus = false) {
    let [route, recordId] = location.hash.slice(1).split('/');
    if (!Object.hasOwn(pages, route)) route = 'overview';
    $('main').innerHTML = pages[route]();
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
    searchIndex = nav.map(([route,title]) => ({route,title,summary:`Open ${title.toLowerCase()} records`,text:title}));
    const c = data.character;
    searchIndex.push({route:'character',title:c.name,summary:`Age ${c.age}; ${c.height} (${c.heightMetric})`,text:Object.values(c).filter(v => typeof v === 'string' || typeof v === 'number').join(' ')});
    const mapping = {abilities:'abilities',inventory:'inventory',accounts:'inventory',people:'world',places:'world',projects:'world',events:'chronicle'};
    for (const key of groups) for (const r of data[key]) searchIndex.push({route:mapping[key]+'/'+r.id,title:r.title,summary:r.summary || key,text:JSON.stringify(r)});
  }
  function search() {
    const q = $('search').value.trim().toLocaleLowerCase();
    if (!q) return hideSearch();
    const results = searchIndex.filter(r => (r.title+' '+r.text).toLocaleLowerCase().includes(q)).slice(0,12);
    $('search-results').innerHTML = results.length ? results.map(r => `<a class="search-result" href="#${escape(r.route)}"><strong>${escape(r.title)}</strong><span>${escape(r.summary)}</span></a>`).join('') : '<p class="search-empty" role="status">No records found. Try a name or section.</p>';
    $('search-results').hidden = false;
    $('search').setAttribute('aria-expanded','true');
  }
  function briefing() {
    const c = data.character;
    $('brief-content').innerHTML = `<div class="brief-confirmed"><strong>Already confirmed:</strong> ${escape(c.name)} · ${escape(c.age)} years old · ${escape(c.height)} (${escape(c.heightMetric)}).<br>Premise: ${escape(data.premise)}. No other real-life details carry over.</div>`+data.briefing.map((b,i) => `<div class="brief-item"><span class="number">0${i+1}</span><div><h3>${escape(b.title)}</h3><p>${escape(b.body)}</p></div></div>`).join('')+'<div class="brief-item"><span class="number">05</span><div><h3>Your character art</h3><p>Send your image in our chat. It will go into the portrait space without cropping away your character.</p></div></div>';
  }
  document.addEventListener('click', event => {
    if (event.target.closest('.skip-link')) { event.preventDefault(); $('main').focus(); }
    if (event.target.closest('[data-brief]')) { $('copy-status').textContent = ''; $('brief-dialog').showModal(); }
    if (event.target.closest('#about-button,[data-about]')) $('about-dialog').showModal();
    if (event.target.closest('.close-dialog')) event.target.closest('dialog').close();
    if (!event.target.closest('.search-wrap')) hideSearch();
    const result = event.target.closest('.search-result');
    if (result) { hideSearch(); $('search').value=''; if (result.hash === location.hash) render(true); }
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
  $('copy-brief').addEventListener('click',async () => {
    const c = data.character;
    const text = `My Dragon Ball Isekai character\n\nConfirmed: ${c.name}, ${c.age} years old, approximately ${c.height} (${c.heightMetric}). Only these personal details carry over.\n\n`+data.briefing.map(b => `${b.title}\n${b.body}\nMy details: \n`).join('\n')+'\nCharacter art: I will attach it in our chat.\n';
    try { await navigator.clipboard.writeText(text); $('copy-status').textContent='Copied. Ready for our chat.'; }
    catch { $('copy-status').textContent='Select and copy the brief below.'; let field=$('brief-fallback'); if(!field){field=document.createElement('textarea');field.id='brief-fallback';field.readOnly=true;field.setAttribute('aria-label','Character brief to copy');field.style.cssText='width:100%;height:180px;margin-top:12px';$('brief-content').append(field);} field.value=text;field.focus();field.select(); }
  });
  async function load() {
    try {
      const response = await fetch('./campaign.json', {cache:'no-store'});
      if (!response.ok) throw new Error('Campaign records are unavailable.');
      data = validate(await response.json());
      portraitUrl = safePortrait(data.character.portrait);
      $('navigation').innerHTML=nav.map(([route,label]) => `<a class="nav-link" href="#${route}">${icon(route)}<span>${label}</span></a>`).join('');
      document.querySelector('.user-chip').textContent=data.character.name.charAt(0);
      document.querySelector('.user-chip').setAttribute('aria-label',data.character.name);
      buildSearch(); briefing(); render();
      window.addEventListener('hashchange', () => render(true));
    } catch (error) {
      $('main').innerHTML='<section class="panel error-card"><h1>Records unavailable.</h1><p>The companion could not load its campaign records. Check your connection and try again.</p><button class="primary" id="retry">Try again</button><p style="margin-top:25px"><a href="./CURRENT-CONTINUITY.md">Read the continuity record</a></p></section>';
      $('retry').addEventListener('click',() => location.reload());
      $('search').disabled=true;
      console.error('Campaign load failed:',error.message);
    }
  }
  load();
})();
