// Header shadow on scroll
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Burger menu
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav__links');
const navClose = document.querySelector('.nav__close');

function openMenu() {
  navLinks.classList.add('open');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  navLinks.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Accordions
document.querySelectorAll('.accordion__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    const content = trigger.closest('.card').querySelector('.accordion__content');
    if (content) {
      content.classList.toggle('open', !expanded);
    }
  });
});

// Frise chronologique
const frisePanel = document.querySelector('.frise-panel');
if (frisePanel) {
  const scroller = frisePanel.querySelector('.frise-scroll');

  // Sur petit écran, démarrer vers les années récentes
  const year2018 = frisePanel.querySelector('.frise-year[style*="2018"]');
  if (scroller.scrollWidth > scroller.clientWidth && window.innerWidth < 768 && year2018) {
    scroller.scrollLeft = year2018.offsetLeft - 24;
  }

  // Filtres
  const filters = document.querySelectorAll('.frise-filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const active = btn.getAttribute('aria-pressed') === 'true' && btn.dataset.filter !== 'all';
      const filter = active ? 'all' : btn.dataset.filter;
      frisePanel.dataset.filter = filter;
      filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    });
  });

  // Bulle de détail (survol, focus clavier, toucher)
  const tip = document.createElement('div');
  tip.className = 'frise-tip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);

  function showTip(el) {
    tip.textContent = el.dataset.tip;
    tip.classList.add('visible');
    const r = el.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    const left = Math.min(Math.max(8, r.left + r.width / 2 - t.width / 2), window.innerWidth - t.width - 8);
    const top = r.top - t.height - 10 > 8 ? r.top - t.height - 10 : r.bottom + 10;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function hideTip() {
    tip.classList.remove('visible');
  }

  frisePanel.querySelectorAll('[data-tip]').forEach(el => {
    el.addEventListener('mouseenter', () => showTip(el));
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('focus', () => showTip(el));
    el.addEventListener('blur', hideTip);
  });
  scroller.addEventListener('scroll', hideTip, { passive: true });
  window.addEventListener('scroll', hideTip, { passive: true });
}
