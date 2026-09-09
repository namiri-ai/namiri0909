const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
toggle?.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('menu-open'); toggle?.setAttribute('aria-expanded', 'false');
}));
document.querySelectorAll('.capability-list article').forEach(card => card.addEventListener('click', () => {
  card.classList.toggle('active');
}));
