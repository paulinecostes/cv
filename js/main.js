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

// Frise chronologique : étage des libellés pour qu'ils ne se chevauchent pas
const timeline = document.querySelector('.tl');

function layoutTimeline() {
  timeline.querySelectorAll('.tl__plot').forEach(layoutPlot);
}

function layoutPlot(plot) {
  const width = plot.clientWidth;
  const gutter = parseFloat(getComputedStyle(plot).marginRight) || 0;
  const counts = {};

  ['up', 'down'].forEach(side => {
    const boxes = [...plot.querySelectorAll(`.tl__event--${side} .tl__label`)].map(label => {
      label.classList.remove('tl__label--flip');
      const w = label.offsetWidth;
      // offsetLeft ignore le translateX(-50%) des libellés centrés
      const x = label.offsetLeft - (label.classList.contains('tl__label--fan') ? w / 2 : 0);
      // data-flip : libellé à gauche de son repère ; sinon seulement s'il déborde à droite
      const flip = !label.classList.contains('tl__label--fan') && (label.dataset.flip !== undefined || x + w > width + gutter - 2);
      label.classList.toggle('tl__label--flip', flip);
      const fan = label.classList.contains('tl__label--fan');
      // stem : position du trait vertical (aucun pour un éventail)
      return { label, left: flip ? x - w : x, right: flip ? x : x + w, stem: fan ? null : (flip ? x - 1 : x + 1) };
    });

    // Un libellé peut imposer son étage avec data-lvl ; il est placé en premier.
    // Les autres sont placés de droite à gauche, sans chevauchement, et sans recouvrir
    // le trait vertical d'un voisin : si c'était le cas, ils passent au-dessus de lui.
    const levels = [];
    const placed = [];
    const fits = (lvl, box) => (levels[lvl] || []).every(o => box.right < o.left - 10 || box.left > o.right + 10);
    const covers = (box, stem) => stem !== null && stem > box.left + 2 && stem < box.right + 4;
    const pinned = box => box.label.dataset.lvl !== undefined;
    const free = boxes.filter(box => !pinned(box)).sort((a, b) => (b.stem ?? b.left) - (a.stem ?? a.left));
    [...boxes.filter(pinned), ...free].forEach(box => {
      let lvl;
      if (pinned(box)) {
        lvl = Number(box.label.dataset.lvl);
      } else {
        // au-dessus des voisins dont il recouvrirait le trait…
        const lo = Math.max(0, ...placed.filter(o => !pinned(o) && covers(box, o.stem)).map(o => o.lvl + 1));
        // …et si possible en dessous de ceux qui recouvriraient le sien
        const hi = Math.min(Infinity, ...placed.filter(o => covers(o, box.stem)).map(o => o.lvl - 1));
        lvl = lo;
        while (lvl <= hi && !fits(lvl, box)) lvl++;
        if (lvl > hi) {
          lvl = lo;
          while (!fits(lvl, box)) lvl++;
        }
      }
      box.lvl = lvl;
      placed.push(box);
      (levels[lvl] = levels[lvl] || []).push(box);
      box.label.style.setProperty('--lvl', lvl);
    });
    counts[side] = Math.max(1, levels.length);
  });

  plot.style.setProperty('--nu', counts.up);
  plot.style.setProperty('--nd', counts.down);
  drawFans(plot);
}

// Éventail : un trait de chaque repère vers le haut du libellé centré
function drawFans(plot) {
  plot.querySelectorAll('.tl__label--fan').forEach(label => {
    const event = label.closest('.tl__event');
    let svg = event.querySelector('.tl__fan');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('tl__fan');
      svg.setAttribute('aria-hidden', 'true');
      event.appendChild(svg);
    }
    const p = plot.getBoundingClientRect();
    const l = label.getBoundingClientRect();
    const tx = l.left + l.width / 2 - p.left;
    const ty = l.top - p.top;
    svg.replaceChildren(...[...event.querySelectorAll('.tl__mark')].map(mark => {
      const m = mark.getBoundingClientRect();
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', m.left + m.width / 2 - p.left);
      line.setAttribute('y1', m.bottom - p.top);
      line.setAttribute('x2', tx);
      line.setAttribute('y2', ty);
      return line;
    }));
  });
}

if (timeline) {
  layoutTimeline();
  if (document.fonts) {
    document.fonts.ready.then(layoutTimeline);
  }
  let resizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(layoutTimeline);
  });

  // Sur petit écran, démarrer vers les années récentes
  const year2018 = timeline.querySelector('.tl__year[style*="2018"]');
  if (year2018 && timeline.scrollWidth > timeline.clientWidth) {
    timeline.scrollLeft = year2018.offsetLeft - 16;
  }
}

// Légende cliquable : n'afficher qu'une catégorie de la frise
const legendButtons = document.querySelectorAll('.tl-legend__btn');
legendButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const active = btn.getAttribute('aria-pressed') === 'true';
    legendButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
    if (active) {
      delete timeline.dataset.filter;
    } else {
      btn.setAttribute('aria-pressed', 'true');
      timeline.dataset.filter = btn.dataset.filter;
    }
  });
});

// Bulles de détail au survol, au clavier et au toucher
if (timeline) {
  const tip = document.createElement('div');
  tip.className = 'tl-tip';
  tip.setAttribute('role', 'tooltip');
  tip.id = 'tl-tip';
  document.body.appendChild(tip);

  // Contenu : type, intitulé, lieu et dates (attributs data-* de l'élément)
  function fillTip(data) {
    tip.replaceChildren();
    [['tl-tip__kicker', data.kind], ['tl-tip__title', data.title], ['tl-tip__place', data.place], ['tl-tip__date', data.date]].forEach(([cls, value]) => {
      if (!value) return;
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = value;
      tip.appendChild(span);
    });
  }

  function showTip(event, target) {
    fillTip(event.dataset);
    tip.style.setProperty('--c', getComputedStyle(target).getPropertyValue('--c'));
    tip.classList.remove('tl-tip--below');
    tip.classList.add('visible');
    const r = target.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    const center = r.left + Math.min(r.width, 60) / 2;
    const left = Math.min(Math.max(8, center - t.width / 2), window.innerWidth - t.width - 8);
    let top = r.top - t.height - 12;
    if (top < 8) {
      top = r.bottom + 12;
      tip.classList.add('tl-tip--below');
    }
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    tip.style.setProperty('--arrow-x', Math.min(Math.max(14, center - left), t.width - 14) + 'px');
  }

  function hideTip() {
    tip.classList.remove('visible');
  }

  timeline.querySelectorAll('.tl__event[data-title]').forEach(event => {
    event.querySelectorAll('.tl__label, .tl__mark').forEach(target => {
      target.addEventListener('mouseenter', () => showTip(event, target));
      target.addEventListener('mouseleave', hideTip);
      target.addEventListener('click', () => showTip(event, target));
    });
    const label = event.querySelector('.tl__label');
    if (label) {
      label.tabIndex = 0;
      label.setAttribute('aria-describedby', 'tl-tip');
      label.addEventListener('focus', () => showTip(event, label));
      label.addEventListener('blur', hideTip);
    }
  });

  timeline.addEventListener('scroll', hideTip, { passive: true });
  window.addEventListener('scroll', hideTip, { passive: true });
  document.addEventListener('click', e => {
    if (!e.target.closest('.tl__label, .tl__mark')) hideTip();
  });
}
