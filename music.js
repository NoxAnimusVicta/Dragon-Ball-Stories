'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const prefix = 'db-stories:', path = new URL('./', location.href).pathname;
  const musicKey = prefix + 'music:' + path, soundKey = prefix + 'sound:' + path;
  const soundVolumeKey = prefix + 'sound-volume:' + path;
  const version = document.querySelector('meta[name="app-release"]')?.content || '';
  let enabled = true, soundOn = true, volume = .20, soundVolume = .75;
  try {
    const saved = JSON.parse(localStorage.getItem(musicKey));
    enabled = saved?.enabled !== false;
    if (Number.isFinite(saved?.volume)) volume = Math.min(1, Math.max(0, saved.volume));
    soundOn = localStorage.getItem(soundKey) !== 'off';
    const savedSound = localStorage.getItem(soundVolumeKey);
    if (savedSound !== null && Number.isFinite(Number(savedSound))) soundVolume = Math.min(1, Math.max(0, Number(savedSound)));
  } catch { /* Device storage is optional. */ }
  let context, musicGain, effectsGain, source, buffer, loading;
  let offset = 0, startedAt = 0, launched = false, pageAway = false;
  let resumeRequest = null, resumeTimer, needsReset = false, loadFailed = false;
  let lastTone = -Infinity, toneTicket = 0;
  const status = $('music-status');
  const retry = document.createElement('button');
  retry.type = 'button'; retry.className = 'primary'; retry.textContent = 'Resume audio'; retry.hidden = true;
  status.after(retry);
  const foreground = () => !document.hidden && !pageAway;
  const wanted = () => launched && foreground() && (enabled || soundOn);
  function message(text = '', recoverable = false) {
    status.textContent = text; retry.hidden = !recoverable;
  }
  function sync() {
    for (const [id,on,label] of [['music-toggle',enabled,'Music'],['sound-toggle',soundOn,'Sound']]) {
      $(id).textContent = label + (on ? ' on' : ' off');
      $(id).setAttribute('aria-pressed',String(on));
      $(id).title = 'Turn ' + label.toLowerCase() + (on ? ' off' : ' on');
    }
    $('music-volume').value = String(Math.round(volume * 100));
    $('music-volume-value').value = $('music-volume').value + '%';
    $('sound-volume').value = String(Math.round(soundVolume * 100));
    $('sound-volume-value').value = $('sound-volume').value + '%';
  }
  function save() {
    try {
      localStorage.setItem(musicKey,JSON.stringify({enabled,volume}));
      localStorage.setItem(soundKey,soundOn ? 'on' : 'off');
      localStorage.setItem(soundVolumeKey,String(soundVolume));
    } catch { /* No storage is required to play. */ }
  }
  function levels() {
    if (!context || context.state === 'closed') return;
    // Leave headroom for short menu cues, including existing saved music levels.
    musicGain.gain.setTargetAtTime(enabled ? volume * .45 : 0,context.currentTime,.025);
    effectsGain.gain.setTargetAtTime(soundOn ? soundVolume : 0,context.currentTime,.015);
  }
  function stopMusic() {
    if (!source) return;
    offset = (offset + Math.max(0,context.currentTime - startedAt)) % buffer.duration;
    const old = source; source = null;
    old.onended = null;
    try { old.stop(); } catch { /* Already stopped. */ }
    old.disconnect();
  }
  function resetContext() {
    stopMusic(); clearTimeout(resumeTimer); resumeRequest = null;
    if (context) {
      const old = context; old.onstatechange = null;
      old.close().catch(() => {});
    }
    context = musicGain = effectsGain = null; needsReset = false; toneTicket++;
  }
  function getContext() {
    if (context?.state === 'closed') resetContext();
    if (!context) {
      // In-app audio: no HTML media player and no exclusive playback session.
      try { if (navigator.audioSession) navigator.audioSession.type = 'ambient'; } catch { /* Optional API. */ }
      const Audio = window.AudioContext || window.webkitAudioContext;
      context = new Audio({latencyHint:'interactive'});
      musicGain = context.createGain(); musicGain.gain.value = enabled ? volume * .45 : 0; musicGain.connect(context.destination);
      effectsGain = context.createGain(); effectsGain.gain.value = soundOn ? soundVolume : 0; effectsGain.connect(context.destination);
      const ctx = context;
      ctx.onstatechange = () => {
        if (ctx !== context) return;
        if (ctx.state === 'running') {
          clearTimeout(resumeTimer); resumeRequest = null; needsReset = false;
          if (wanted()) { ensureMusic(); if (!loadFailed) message(); }
          else { stopMusic(); ctx.suspend().catch(() => {}); }
        } else if (wanted() && ctx.state !== 'closed') {
          message('Audio paused. Tap any control to resume.',true);
        }
      };
    }
    return context;
  }
  function ensureMusic() {
    if (!enabled || !launched || !foreground() || !buffer || source || context?.state !== 'running') return;
    source = context.createBufferSource(); source.buffer = buffer; source.loop = true;
    source.connect(musicGain); startedAt = context.currentTime;
    source.start(0,offset % buffer.duration);
  }
  async function loadMusic() {
    if (buffer) { ensureMusic(); return; }
    if (loading || !enabled) return loading;
    loadFailed = false;
    loading = (async () => {
      const abort = new AbortController(), timeout = setTimeout(() => abort.abort(),30000);
      try {
        if (launched) message('Loading music…');
        const response = await fetch('./background-music.mp3?v='+encodeURIComponent(version),{signal:abort.signal});
        if (!response.ok) throw new Error('Music unavailable');
        const bytes = await response.arrayBuffer();
        // Decode away from the live output device; readiness must not gate gesture unlock.
        const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        const decoder = new Offline(2,1,44100);
        buffer = await decoder.decodeAudioData(bytes);
        ensureMusic();
        if (wanted() && context?.state !== 'running') message('Music is ready. Tap any control to resume audio.',true);
        else message();
      } catch {
        loadFailed = true;
        if (enabled && launched) message('Music could not load. Check your connection and retry.',true);
      } finally { clearTimeout(timeout); loading = null; }
    })();
    return loading;
  }
  function activate(gesture = false) {
    if (!wanted()) return Promise.resolve(false);
    try {
      if (gesture && needsReset) resetContext();
      const ctx = getContext();
      if (ctx.state === 'running') { ensureMusic(); return Promise.resolve(true); }
      // A new trusted gesture retries resume synchronously, even if an earlier
      // background resume promise is still pending in Safari.
      if (resumeRequest && !gesture) return resumeRequest;
      const request = ctx.resume();
      const pending = Promise.resolve(request).then(() => {
        if (ctx !== context) return false;
        if (!wanted()) { stopMusic(); ctx.suspend().catch(() => {}); return false; }
        if (ctx.state !== 'running') return false;
        needsReset = false; ensureMusic(); if (!loadFailed) message(); return true;
      }).catch(() => {
        if (ctx === context && wanted()) { needsReset = true; message('Audio paused. Tap any control to resume.',true); }
        return false;
      });
      resumeRequest = pending;
      pending.finally(() => { if (resumeRequest === pending) resumeRequest = null; });
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        if (ctx === context && wanted() && ctx.state !== 'running') {
          needsReset = true; resumeRequest = null;
          message('Audio paused. Tap any control to resume.',true);
        }
      },1200);
      return pending;
    } catch { message('Audio could not start. Tap Resume audio to try again.',true); return Promise.resolve(false); }
  }
  function pause() {
    toneTicket++; clearTimeout(resumeTimer); stopMusic();
    context?.suspend().catch(() => {});
  }
  function playTone(confirm = false) {
    if (!soundOn || soundVolume === 0 || !launched || !foreground()) return;
    const now = performance.now();
    if (now - lastTone < 60) return;
    lastTone = now;
    const ticket = ++toneTicket;
    const ready = activate(false);
    const emit = () => {
      if (ticket !== toneTicket || !soundOn || !foreground() || context?.state !== 'running' || performance.now()-now > 300) return;
      try {
        const oscillator = context.createOscillator(), envelope = context.createGain(), t = context.currentTime;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(confirm ? 740 : 520,t);
        oscillator.frequency.exponentialRampToValueAtTime(confirm ? 1110 : 660,t+.065);
        envelope.gain.setValueAtTime(0,t);
        envelope.gain.linearRampToValueAtTime(confirm ? .15 : .10,t+.005);
        envelope.gain.exponentialRampToValueAtTime(.001,t+.13);
        oscillator.connect(envelope); envelope.connect(effectsGain);
        oscillator.start(t); oscillator.stop(t+.14);
        oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
      } catch { /* An interrupted cue must never change the user's sound preference. */ }
    };
    if (context?.state === 'running') emit(); else ready.then(emit);
  }
  window.adventureAudio = Object.freeze({playTone});
  $('music-toggle').addEventListener('click',() => {
    enabled = !enabled; save(); sync(); levels();
    if (enabled) { activate(true); loadMusic(); } else { stopMusic(); message(); if (!soundOn) pause(); }
  });
  $('sound-toggle').addEventListener('click',() => {
    soundOn = !soundOn; save(); sync(); levels(); toneTicket++;
    if (soundOn) { activate(true); playTone(true); } else if (!enabled) { pause(); message(); }
  });
  $('music-volume').addEventListener('input',() => { volume=Number($('music-volume').value)/100; save(); sync(); levels(); });
  $('sound-volume').addEventListener('input',() => { soundVolume=Number($('sound-volume').value)/100; save(); sync(); levels(); });
  $('sound-volume').addEventListener('change',() => playTone(true));
  document.addEventListener('launch-adventure',() => {
    launched=true; activate(true); loadMusic(); playTone(true);
  });
  // Release events are genuine user activations on iOS, even if a later click is consumed.
  const gesture = event => { if (event.isTrusted && wanted()) { activate(true); if (loadFailed && navigator.onLine !== false) loadMusic(); } };
  document.addEventListener('touchend',gesture,{passive:true,capture:true});
  document.addEventListener('pointerup',event => { if (event.pointerType !== 'touch') gesture(event); },{passive:true,capture:true});
  document.addEventListener('keydown',event => { if (event.key === 'Enter' || event.key === ' ') gesture(event); },true);
  document.addEventListener('click',gesture,true);
  document.addEventListener('visibilitychange',() => { if (document.hidden) pause(); else { pageAway=false; activate(); } });
  window.addEventListener('pagehide',() => { pageAway=true; pause(); });
  window.addEventListener('pageshow',() => { pageAway=false; activate(); });
  window.addEventListener('focus',() => activate());
  window.addEventListener('online',() => { if (enabled) loadMusic(); activate(); });
  retry.addEventListener('click',() => { resetContext(); activate(true); loadMusic(); playTone(true); });
  sync();
  // Download and decode during the title screen without playing or opening an output session.
  if (enabled) loadMusic();
})();
