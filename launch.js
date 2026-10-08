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
    const orbit = screen.querySelector('.wish-orbit');
    const distance = Math.hypot(innerWidth, innerHeight) * 520 / orbit.getBoundingClientRect().width;
    screen.querySelectorAll('.ball-flight').forEach((ball, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / 7;
      ball.style.setProperty('--flight-x', Math.cos(angle) * distance + 'px');
      ball.style.setProperty('--flight-y', Math.sin(angle) * distance + 'px');
      const trail = document.createElementNS('http://www.w3.org/2000/svg','path');
      trail.setAttribute('class','ball-trail');
      trail.setAttribute('d', `M 0 0 L ${-Math.cos(angle)*190} ${-Math.sin(angle)*190}`);
      ball.prepend(trail);
    });
    screen.classList.add('granting');
    trigger.setAttribute('aria-disabled','true');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused');
    setTimeout(() => {
      screen.close();
      screen.remove();
      document.body.classList.remove('launch-entering');
      document.getElementById('main').focus({preventScroll:true});
    }, reduced ? 80 : 2300);
  });
})();
