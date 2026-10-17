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
  const counts = {};

  ['up', 'down'].forEach(side => {
    const boxes = [...plot.querySelectorAll(`.tl__event--${side} .tl__label`)].map(label => {
      label.classList.remove('tl__label--flip');
      const x = label.offsetLeft;
      const w = label.offsetWidth;
      const flip = x + w > width - 2;
      label.classList.toggle('tl__label--flip', flip);
      return { label, left: flip ? x - w : x, right: flip ? x : x + w };
    }).sort((a, b) => a.left - b.left);

    const levels = [];
    boxes.forEach(box => {
      let lvl = levels.findIndex(end => end < box.left - 10);
      if (lvl === -1) {
        lvl = levels.length;
        levels.push(0);
      }
      levels[lvl] = box.right;
      box.label.style.setProperty('--lvl', lvl);
    });
    counts[side] = Math.max(1, levels.length);
  });

  plot.style.setProperty('--nu', counts.up);
  plot.style.setProperty('--nd', counts.down);
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
