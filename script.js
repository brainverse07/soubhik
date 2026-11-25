document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !isOpen);
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
      });
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const message = document.querySelector('#visitor-message');
  const count = document.querySelector('#message-count');
  if (message && count) {
    message.addEventListener('input', () => { count.textContent = String(message.value.length); });
  }

  const form = document.querySelector('#message-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = document.querySelector('#form-status');
      const honeypot = form.elements.namedItem('website');
      if (honeypot && honeypot.value.trim()) {
        status.textContent = 'We could not prepare that message. Please try again.';
        return;
      }
      if (!form.reportValidity()) return;
      const name = form.elements.namedItem('name').value.trim();
      const email = form.elements.namedItem('email').value.trim();
      const note = form.elements.namedItem('message').value.trim();
      if (!note) {
        message.focus();
        status.textContent = 'Please add a message before continuing.';
        return;
      }
      const subject = name ? `A note from ${name}` : 'A note from your website';
      const body = [name ? `Name: ${name}` : '', email ? `Reply email: ${email}` : '', '', note].filter((line, index, list) => line || (index > 0 && list[index - 1])).join('\n');
      const mailto = `mailto:soubhik198107@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Opening your email app with the message ready to review and send. Nothing is stored on this website.';
      window.location.href = mailto;
    });
  }
});


// Gentle original ambient pad synthesized locally (no external audio or copyrighted recording).
(() => {
  const button = document.getElementById('ambient-toggle');
  if (!button) return;
  let context, master, oscillators = [], active = false;
  const stop = () => {
    if (!context || !active) return;
    active = false;
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setTargetAtTime(0, context.currentTime, 0.35);
    const old = oscillators.slice(); oscillators = [];
    window.setTimeout(() => old.forEach(o => { try { o.stop(); } catch(e) {} }), 1200);
  };
  const start = async () => {
    if (!context) {
      context = new (window.AudioContext || window.webkitAudioContext)();
      master = context.createGain(); master.gain.value = 0;
      const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 850;
      filter.connect(master); master.connect(context.destination);
      [174.61, 220, 261.63, 329.63].forEach((freq, i) => {
        const osc = context.createOscillator(), gain = context.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle'; osc.frequency.value = freq;
        gain.gain.value = [0.18,0.10,0.08,0.035][i]; osc.connect(gain); gain.connect(filter); osc.start(); oscillators.push(osc);
      });
    }
    await context.resume(); active = true;
    master.gain.cancelScheduledValues(context.currentTime); master.gain.setTargetAtTime(0.16, context.currentTime, 0.8);
  };
  button.addEventListener('click', async () => {
    if (active) stop(); else await start();
    button.setAttribute('aria-pressed', String(active));
    button.querySelector('.ambient-state').textContent = active ? 'ON' : 'OFF';
    button.setAttribute('aria-label', active ? 'Pause ambient music' : 'Play ambient music');
  });
})();
