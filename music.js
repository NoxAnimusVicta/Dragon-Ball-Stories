'use strict';
(() => {
  const button = document.getElementById('music-toggle');
  const slider = document.getElementById('music-volume');
  const output = document.getElementById('music-volume-value');
  const status = document.getElementById('music-status');
  const key = 'db-stories:music:' + new URL('./', location.href).pathname;
  const version = document.querySelector('meta[name="app-release"]')?.content || '';
  let enabled = true, volume = .25, context, gain, source, buffer, loading;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    enabled = saved?.enabled !== false;
    if (Number.isFinite(saved?.volume)) volume = Math.min(1, Math.max(0, saved.volume));
  } catch { /* Storage is optional. */ }
  function save() {
    try { localStorage.setItem(key, JSON.stringify({enabled, volume})); } catch { /* Optional. */ }
  }
  function sync() {
    button.textContent = enabled ? 'Music on' : 'Music off';
    button.title = enabled ? 'Turn background music off' : 'Turn background music on';
    button.setAttribute('aria-pressed', String(enabled));
    slider.value = String(Math.round(volume * 100));
    output.value = slider.value + '%';
  }
  function playbackSession() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* Older browsers use their default session. */ }
  }
  async function start() {
    if (!enabled || document.hidden || document.body.classList.contains('launch-pending')) return;
    try {
      playbackSession();
      if (!context) {
        context = new (window.AudioContext || window.webkitAudioContext)();
        gain = context.createGain(); gain.gain.value = enabled ? volume : 0; gain.connect(context.destination);
        context.addEventListener('statechange', sync);
      }
      // Resume inside the user gesture, before any network await (required on phones).
      await context.resume();
      if (!buffer) {
        if (!loading) loading = (async () => {
          const response = await fetch('./background-music.mp3?v=' + encodeURIComponent(version));
          if (!response.ok) throw new Error('Music unavailable');
          return context.decodeAudioData(await response.arrayBuffer());
        })().finally(() => { loading = null; });
        buffer = await loading;
      }
      if (!enabled || document.hidden) { sync(); return; }
      gain.gain.setValueAtTime(volume, context.currentTime);
      if (!source) {
        source = context.createBufferSource(); source.buffer = buffer;
        source.loop = true;
        source.loopStart = 0;
        source.loopEnd = buffer.duration;
        source.connect(gain); source.start();
      }
      status.textContent = ''; sync();
    } catch {
      sync();
      status.textContent = 'Music could not start. Check your connection and tap Music to try again.';
    }
  }
  button.addEventListener('click', () => {
    enabled = !enabled; save(); sync();
    if (gain) { gain.gain.cancelScheduledValues(context.currentTime); gain.gain.setValueAtTime(enabled ? volume : 0, context.currentTime); }
    if (enabled) start();
  });
  slider.addEventListener('input', () => {
    volume = Number(slider.value) / 100;
    if (gain) gain.gain.setTargetAtTime(enabled ? volume : 0, context.currentTime, .025);
    save(); sync();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('#music-toggle') && enabled && (!source || context?.state !== 'running')) start();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.target.closest('#music-toggle') && enabled && (!source || context?.state !== 'running')) start();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) context?.suspend().catch(() => {});
    else if (enabled && source) start();
    sync();
  });
  sync();
  document.addEventListener('launch-adventure', start);
})();
