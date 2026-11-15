
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

// Mobile navigation
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

// Close menu after selecting a section
nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

// Automatic footer year
document.querySelector('#year').textContent = new Date().getFullYear();

// Scroll reveal animations
const revealItems = document.querySelectorAll(
  '.section, .program-card, .review-panel, .video-callout'
);

revealItems.forEach(element => {
  element.classList.add('reveal');
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealItems.forEach(element => observer.observe(element));
} else {
  revealItems.forEach(element => element.classList.add('visible'));
}
