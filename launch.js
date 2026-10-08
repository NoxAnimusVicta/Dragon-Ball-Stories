'use strict';
(() => {
  const screen = document.getElementById('launch-dialog');
  const trigger = document.getElementById('launch-adventure');
  let entering = false;
  // Upgrade the visible fallback to a modal so background controls cannot receive focus.
  screen.close();
  screen.showModal();
  trigger.focus({preventScroll:true});
  screen.addEventListener('cancel', event => event.preventDefault());
  trigger.addEventListener('click', () => {
    if (entering) return;
    entering = true;
    document.body.classList.remove('launch-pending');
    document.body.classList.add('launch-entering');
    // Dispatch synchronously from the click: audio must unlock before animation/network awaits.
    document.dispatchEvent(new CustomEvent('launch-adventure'));
    screen.classList.add('granting');
    trigger.setAttribute('aria-disabled','true');
    document.getElementById('launch-prompt').textContent = 'Your journey begins.';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused');
    setTimeout(() => {
      screen.close();
      screen.remove();
      document.body.classList.remove('launch-entering');
      document.getElementById('main').focus({preventScroll:true});
    }, reduced ? 80 : 1900);
  });
})();
