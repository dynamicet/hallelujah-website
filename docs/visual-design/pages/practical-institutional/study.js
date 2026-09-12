(() => {
  document.documentElement.classList.add('js');
  document.querySelectorAll('.demo-form[inert]').forEach((form) => form.removeAttribute('inert'));
  const trigger = document.querySelector('.menu-trigger');
  const menu = document.getElementById('mobile-menu');
  const announcement = document.getElementById('demo-announcement');
  let announcementTimer;

  const announce = (message) => {
    if (!announcement) return;
    announcement.textContent = message || 'Prototype only. No live hospital action was activated and no data was sent.';
    announcement.hidden = false;
    clearTimeout(announcementTimer);
    announcementTimer = setTimeout(() => { announcement.hidden = true; }, 4500);
  };

  const closeMenu = (returnFocus = true) => {
    if (!trigger || !menu || menu.hidden) return;
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  };

  if (trigger && menu) {
    trigger.addEventListener('click', () => {
      const willOpen = menu.hidden;
      menu.hidden = !willOpen;
      trigger.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) menu.querySelector('a, button')?.focus();
    });
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  document.querySelectorAll('.demo-action').forEach((control) => {
    control.addEventListener('click', (event) => {
      if (control.tagName === 'A') event.preventDefault();
      announce(control.dataset.demoMessage);
    });
  });

  document.querySelectorAll('.demo-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      announce(form.dataset.demoMessage || 'Prototype only. Search state was not sent, stored, or logged.');
    });
  });

  document.querySelectorAll('.filter-toggle').forEach((control) => {
    const panel = document.getElementById(control.getAttribute('aria-controls'));
    if (!panel) return;
    control.addEventListener('click', () => {
      const willOpen = !panel.classList.contains('is-demo-visible');
      panel.classList.toggle('is-demo-visible', willOpen);
      control.setAttribute('aria-expanded', String(willOpen));
    });
  });

})();
