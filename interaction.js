/* Preserve focus for dialogs and assistive tools; show rings for keyboard use. */
(() => {
  const root = document.documentElement;
  const pointer = event => {
    root.dataset.inputMode = event.pointerType === 'touch' || event.type === 'touchstart'
      ? 'touch' : 'pointer';
  };
  document.addEventListener('pointerdown', pointer, true);
  document.addEventListener('touchstart', pointer, {capture:true, passive:true});
  document.addEventListener('keydown', event => {
    if (!event.metaKey && !event.ctrlKey && !event.altKey &&
        ['Tab','Enter',' ','Escape','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) {
      root.dataset.inputMode = 'keyboard';
    }
  }, true);
})();
