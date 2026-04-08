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
