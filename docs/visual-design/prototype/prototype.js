(() => {
  'use strict';

  const currentUrl = new URL(window.location.href);
  const pagesMarker = '/visual-design/pages/';
  const pagesIndex = currentUrl.href.indexOf(pagesMarker);
  if (pagesIndex === -1) return;

  const pagesRoot = currentUrl.href.slice(0, pagesIndex + pagesMarker.length);
  const prototypeRoot = `${currentUrl.href.slice(0, pagesIndex)}/visual-design/prototype/`;
  const pageName = currentUrl.pathname.split('/').pop();
  const fixture = currentUrl.searchParams.get('fixture') || 'en';
  const forcedMotion = currentUrl.searchParams.get('motion') || 'system';
  const supportedFixtures = new Set(['en', 'am', 'mixed', 'long', 'unavailable']);
  const supportedMotion = new Set(['system', 'reduce']);
  const directoryPages = new Set(['doctor-directory.html', 'services-directory.html', 'search-results.html']);
  const html = document.documentElement;
  const announcement = document.getElementById('demo-announcement');
  let appointmentDirty = false;
  let announcementTimer;

  const conserveMotion = (forced = false) => {
    const saveData = Boolean(navigator.connection?.saveData);
    html.dataset.prototypeConserve = String(forced || saveData || document.visibilityState === 'hidden');
  };

  conserveMotion();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') conserveMotion(true);
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) conserveMotion(true);
  });

  const routes = {
    home: `${pagesRoot}critical-journeys/home.html`,
    emergency: `${pagesRoot}critical-journeys/emergency.html`,
    appointment: `${pagesRoot}critical-journeys/appointment.html`,
    appointmentStates: `${pagesRoot}critical-journeys/appointment-states.html`,
    doctors: `${pagesRoot}care-discovery/doctor-directory.html`,
    doctor: `${pagesRoot}care-discovery/doctor-profile.html`,
    services: `${pagesRoot}care-discovery/services-directory.html`,
    service: `${pagesRoot}care-discovery/service-detail.html`,
    careStates: `${pagesRoot}care-discovery/care-discovery-states.html`,
    patientInfo: `${pagesRoot}practical-institutional/patient-information.html`,
    locations: `${pagesRoot}practical-institutional/locations-contact.html`,
    search: `${pagesRoot}practical-institutional/search-results.html`,
    about: `${pagesRoot}practical-institutional/about.html`,
    careers: `${pagesRoot}practical-institutional/careers.html`,
    practicalStates: `${pagesRoot}practical-institutional/practical-institutional-states.html`,
    prototypeMap: `${prototypeRoot}index.html`
  };

  const pageKeys = {
    'home.html': 'home',
    'emergency.html': 'emergency',
    'appointment.html': 'appointment',
    'appointment-states.html': 'appointment-states',
    'doctor-directory.html': 'doctor-directory',
    'doctor-profile.html': 'doctor-profile',
    'services-directory.html': 'services-directory',
    'service-detail.html': 'service-detail',
    'care-discovery-states.html': 'care-discovery-states',
    'patient-information.html': 'patient-information',
    'locations-contact.html': 'locations-contact',
    'search-results.html': 'search-results',
    'about.html': 'about',
    'careers.html': 'careers',
    'practical-institutional-states.html': 'practical-institutional-states'
  };

  html.dataset.prototypePage = pageKeys[pageName] || 'study';
  html.dataset.prototypeMotion = supportedMotion.has(forcedMotion) ? forcedMotion : 'system';
  html.classList.add('order-10-prototype');

  const announce = (message) => {
    if (!announcement) return;
    clearTimeout(announcementTimer);
    announcement.textContent = message;
    announcement.hidden = false;
    announcementTimer = window.setTimeout(() => {
      announcement.hidden = true;
    }, 6000);
  };

  const withReviewContext = (href) => {
    const url = new URL(href, window.location.href);
    if (url.protocol !== 'file:' || !url.pathname.endsWith('.html')) return url.href;
    if (supportedFixtures.has(fixture) && fixture !== 'en') url.searchParams.set('fixture', fixture);
    if (forcedMotion === 'reduce') url.searchParams.set('motion', 'reduce');
    return url.href;
  };

  const markConnectedRoute = (element, href) => {
    element.setAttribute('href', withReviewContext(href));
    element.dataset.prototypeRoute = 'true';
  };

  const rewriteHomeRoutes = () => {
    const routeByHash = {
      '#doctors': routes.doctors,
      '#services': routes.services,
      '#visit': routes.patientInfo,
      '#contact': routes.locations
    };

    document.querySelectorAll('a[href]').forEach((link) => {
      const target = new URL(link.href, window.location.href);
      const isHomeTarget = target.pathname.endsWith('/critical-journeys/home.html') || pageName === 'home.html';
      if (isHomeTarget && routeByHash[target.hash] && !link.classList.contains('demo-action')) {
        markConnectedRoute(link, routeByHash[target.hash]);
      }
    });

    if (pageName !== 'home.html') return;

    document.querySelectorAll('.record-card a.demo-action[href="#doctors"]').forEach((link) => {
      markConnectedRoute(link, routes.doctor);
    });
    document.querySelectorAll('.record-card a.demo-action[href="#services"]').forEach((link) => {
      markConnectedRoute(link, routes.service);
    });
    document.querySelectorAll('.guide-card a.demo-action[href="#visit"]').forEach((link) => {
      markConnectedRoute(link, routes.patientInfo);
    });

    const aboutButton = Array.from(document.querySelectorAll('button.demo-action')).find((button) =>
      button.dataset.demoMessage?.includes('About route')
    );
    if (aboutButton) {
      const link = document.createElement('a');
      link.className = aboutButton.className.replace('demo-action', '').trim();
      link.textContent = aboutButton.textContent;
      markConnectedRoute(link, routes.about);
      aboutButton.replaceWith(link);
    }
  };

  const decorateLocalLinks = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      const target = new URL(link.href, window.location.href);
      if (target.protocol !== 'file:' || !target.pathname.endsWith('.html')) return;
      link.href = withReviewContext(target.href);
    });
  };

  const navigateToFixture = (nextFixture) => {
    const target = new URL(window.location.href);
    target.searchParams.delete('audit');
    target.searchParams.set('fixture', nextFixture);
    if (nextFixture === 'en') target.searchParams.delete('fixture');

    if (pageName === 'appointment.html' && appointmentDirty && nextFixture !== fixture) {
      const proceed = window.confirm('Changing the language fixture resets locally entered prototype values. Stay on this page to keep editing, or continue to reset them.');
      if (!proceed) return;
    }
    window.location.assign(target.href);
  };

  const setPrototypeState = (state) => {
    const target = new URL(window.location.href);
    target.searchParams.delete('audit');
    if (state === 'default') target.searchParams.delete('state');
    else target.searchParams.set('state', state);
    window.location.assign(target.href);
  };

  const buildToolbar = () => {
    const toolbar = document.createElement('aside');
    toolbar.className = 'prototype-tools';
    toolbar.setAttribute('aria-label', 'Order 10 prototype review controls');

    const identity = document.createElement('div');
    identity.className = 'prototype-tools__identity';
    identity.innerHTML = '<strong>Order 10 connected prototype</strong><span>Review controls—not part of the proposed hospital interface.</span>';

    const controls = document.createElement('div');
    controls.className = 'prototype-tools__controls';

    const fixtureLabel = document.createElement('label');
    fixtureLabel.className = 'prototype-tools__field';
    fixtureLabel.innerHTML = '<span>Content fixture</span>';
    const fixtureSelect = document.createElement('select');
    fixtureSelect.className = 'select';
    fixtureSelect.setAttribute('aria-label', 'Content and language fixture');
    [
      ['en', 'English source fixture'],
      ['am', 'Amharic geometry fixture'],
      ['mixed', 'Mixed-script fixture'],
      ['long', 'Long-content fixture'],
      ['unavailable', 'Translation unavailable']
    ].forEach(([value, label]) => fixtureSelect.add(new Option(label, value, false, value === fixture)));
    fixtureSelect.addEventListener('change', () => navigateToFixture(fixtureSelect.value));
    fixtureLabel.append(fixtureSelect);
    controls.append(fixtureLabel);

    const motionLabel = document.createElement('label');
    motionLabel.className = 'prototype-tools__field';
    motionLabel.innerHTML = '<span>Motion review</span>';
    const motionSelect = document.createElement('select');
    motionSelect.className = 'select';
    motionSelect.setAttribute('aria-label', 'Motion review mode');
    [['system', 'Use system preference'], ['reduce', 'Force reduced motion']].forEach(([value, label]) =>
      motionSelect.add(new Option(label, value, false, value === forcedMotion))
    );
    motionSelect.addEventListener('change', () => {
      const target = new URL(window.location.href);
      target.searchParams.delete('audit');
      if (motionSelect.value === 'reduce') target.searchParams.set('motion', 'reduce');
      else target.searchParams.delete('motion');
      window.location.assign(target.href);
    });
    motionLabel.append(motionSelect);
    controls.append(motionLabel);

    if (directoryPages.has(pageName)) {
      const stateLabel = document.createElement('label');
      stateLabel.className = 'prototype-tools__field';
      stateLabel.innerHTML = '<span>Results state</span>';
      const stateSelect = document.createElement('select');
      stateSelect.className = 'select';
      stateSelect.setAttribute('aria-label', 'Directory or search result state');
      const activeState = currentUrl.searchParams.get('state') || 'default';
      [
        ['default', 'Controlled results'],
        ['loading', 'Loading'],
        ['no-match', 'No matches'],
        ['failure', 'Known failure'],
        ['offline', 'Offline'],
        ['unavailable', 'Index unavailable']
      ].forEach(([value, label]) => stateSelect.add(new Option(label, value, false, value === activeState)));
      stateSelect.addEventListener('change', () => setPrototypeState(stateSelect.value));
      stateLabel.append(stateSelect);
      controls.append(stateLabel);
    }

    const mapLink = document.createElement('a');
    mapLink.className = 'button button--secondary';
    mapLink.href = routes.prototypeMap;
    mapLink.textContent = 'Journey map';
    controls.append(mapLink);

    toolbar.append(identity, controls);
    const fixtureNotice = document.querySelector('.order-9-fixture-notice');
    const prototypeBanner = document.querySelector('.prototype-banner');
    (fixtureNotice || prototypeBanner || document.body).insertAdjacentElement(
      fixtureNotice || prototypeBanner ? 'afterend' : 'afterbegin',
      toolbar
    );
  };

  const connectLanguageSwitches = () => {
    document.querySelectorAll('button[lang="am"]').forEach((button) => {
      const targetFixture = fixture === 'am' ? 'en' : 'am';
      button.dataset.prototypeLanguage = targetFixture;
      button.removeAttribute('data-demo-message');
      button.classList.remove('demo-action');
      button.lang = targetFixture === 'en' ? 'en' : 'am';
      button.textContent = targetFixture === 'en' ? 'English' : 'አማርኛ — layout fixture';
    });
  };

  const controlledQueries = new Map([
    ['prototype', 'prototype'],
    ['prototype care', 'prototype care'],
    ['prototype service', 'prototype service']
  ]);

  const validateControlledQuery = (input) => {
    const normalized = input.value.trim().toLowerCase();
    const controlled = controlledQueries.get(normalized);
    if (controlled) {
      input.removeAttribute('aria-invalid');
      return controlled;
    }
    input.setAttribute('aria-invalid', 'true');
    announce('For privacy, this local prototype accepts only the controlled terms “prototype”, “prototype care”, or “prototype service”. Nothing was sent or added to the URL.');
    input.focus();
    return null;
  };

  const addControlledTermButton = (form, input) => {
    if (form.querySelector('[data-prototype-fill-query]')) return;
    const fill = document.createElement('button');
    fill.type = 'button';
    fill.className = 'button button--secondary';
    fill.dataset.prototypeFillQuery = 'true';
    fill.textContent = 'Use controlled term';
    fill.addEventListener('click', () => {
      input.value = pageName === 'doctor-directory.html' ? 'prototype' : 'prototype care';
      input.removeAttribute('aria-invalid');
      input.focus();
      announce('A non-personal controlled search term was inserted. Submit Search to demonstrate safe URL continuity.');
    });
    form.append(fill);
  };

  const applyUrlStateToForms = () => {
    const q = currentUrl.searchParams.get('q');
    if (q && controlledQueries.has(q.toLowerCase())) {
      document.querySelectorAll('input[type="search"][name="q"]').forEach((input) => { input.value = q; });
    }
    ['specialty', 'group', 'type'].forEach((name) => {
      const value = currentUrl.searchParams.get(name);
      if (!value) return;
      const control = document.querySelector(`input[name="${name}"][value="${CSS.escape(value)}"]`);
      if (control) control.checked = true;
    });
  };

  const safeGetTarget = (form) => {
    if (pageName === 'home.html') return new URL(routes.search);
    return new URL(window.location.href);
  };

  const connectSafeGetForms = () => {
    const isSafePage = new Set(['home.html', ...directoryPages]);
    if (!isSafePage.has(pageName)) return;

    document.querySelectorAll('form').forEach((form) => {
      const queryInput = form.querySelector('input[type="search"][name="q"]');
      const supportedFilter = form.querySelector('input[name="specialty"], input[name="group"], input[name="type"]');
      if (!queryInput && !supportedFilter) return;
      if (queryInput) addControlledTermButton(form, queryInput);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const target = safeGetTarget(form);
        const next = new URLSearchParams();
        if (fixture !== 'en') next.set('fixture', fixture);
        if (forcedMotion === 'reduce') next.set('motion', 'reduce');

        const currentQuery = queryInput || document.querySelector('input[type="search"][name="q"]');
        if (currentQuery?.value.trim()) {
          const value = validateControlledQuery(currentQuery);
          if (value === null) return;
          next.set('q', value);
        } else if (queryInput) {
          queryInput.setAttribute('aria-invalid', 'true');
          announce('Enter one of the offered controlled terms to demonstrate search. Nothing was sent or added to the URL.');
          queryInput.focus();
          return;
        }

        ['specialty', 'group', 'type'].forEach((name) => {
          const selected = form.querySelector(`input[name="${name}"]:checked`) || document.querySelector(`input[name="${name}"]:checked`);
          if (selected && selected.value !== 'all') next.set(name, selected.value);
        });
        target.search = next.toString();
        window.location.assign(target.href);
      }, true);
    });
  };

  const updateControlledResults = () => {
    if (!directoryPages.has(pageName)) return;
    const count = document.querySelector('.result-count');
    if (!count) return;

    if (pageName === 'doctor-directory.html') {
      const specialty = currentUrl.searchParams.get('specialty') || 'prototype-a';
      const cards = Array.from(document.querySelectorAll('[data-section="D4"] .record-card'));
      cards.forEach((card, index) => { card.hidden = specialty === 'prototype-b' ? index !== cards.length - 1 : false; });
      count.textContent = specialty === 'prototype-b' ? '1 controlled doctor record' : `${cards.length} controlled doctor records`;
    }

    if (pageName === 'services-directory.html') {
      const group = currentUrl.searchParams.get('group') || 'prototype-a';
      const groups = Array.from(document.querySelectorAll('.result-group'));
      groups.forEach((section, index) => {
        section.hidden = group === 'all' ? false : (group === 'prototype-a' ? index !== 0 : index !== 1);
      });
      count.textContent = group === 'all' ? '4 controlled service records' : '2 controlled service records';
    }

    if (pageName === 'search-results.html') {
      const type = currentUrl.searchParams.get('type') || 'all';
      const records = Array.from(document.querySelectorAll('[data-section="SR5"] .record-card'));
      records.forEach((record) => {
        const recordType = record.querySelector('.record-card__type')?.textContent.toLowerCase() || '';
        record.hidden = type !== 'all' && !recordType.includes(type);
      });
      const visible = records.filter((record) => !record.hidden).length;
      const q = currentUrl.searchParams.get('q') || 'prototype care';
      count.textContent = `${visible} controlled ${visible === 1 ? 'result' : 'results'} for “${q}”`;
    }
  };

  const stateCopy = {
    loading: {
      kind: 'info',
      title: 'Loading controlled results',
      body: 'This stable prototype state demonstrates progress after a committed action. No search, roster, index, or network request is running.'
    },
    'no-match': {
      kind: 'info',
      title: 'No controlled matches',
      body: 'The safe query and filters remain available above. Change the controlled term, reset the filter, or use a nearby task route; the prototype does not guess care.'
    },
    failure: {
      kind: 'error',
      title: 'The controlled request could not be completed',
      body: 'This is a known-failure simulation. Context is retained and recovery repeats only the same safe local prototype action.'
    },
    offline: {
      kind: 'warning',
      title: 'You appear to be offline — simulated state',
      body: 'No connectivity test was made. The prototype keeps the current safe state and exposes text-first routes that do not depend on a result service.'
    },
    unavailable: {
      kind: 'warning',
      title: 'Controlled public index unavailable',
      body: 'This fail-closed state does not show stale roster, service, or search records as current. Approval and freshness checks remain production gates.'
    }
  };

  const renderDirectoryState = () => {
    if (!directoryPages.has(pageName)) return;
    const state = currentUrl.searchParams.get('state') || 'default';
    const spec = stateCopy[state];
    if (!spec) return;
    const results = document.querySelector('.results-region');
    if (!results) return;
    results.hidden = true;

    const panel = document.createElement('section');
    panel.className = `status status--${spec.kind} prototype-result-state`;
    panel.setAttribute('role', state === 'loading' ? 'status' : 'alert');
    panel.setAttribute('aria-labelledby', 'prototype-result-state-title');
    panel.innerHTML = `<div class="status__body"><span class="controlled-badge">Order 10 state simulation · no request made</span><h2 class="status__title" id="prototype-result-state-title" tabindex="-1">${spec.title}</h2><p>${spec.body}</p><div class="button-row"><button class="button" type="button" data-prototype-recover>Restore controlled results</button><a class="button button--secondary" href="${withReviewContext(pageName === 'search-results.html' ? routes.practicalStates : routes.careStates)}">Open complete state board</a></div></div>`;
    results.insertAdjacentElement('beforebegin', panel);
    panel.querySelector('[data-prototype-recover]').addEventListener('click', () => setPrototypeState('default'));
  };

  const clearAppointmentErrors = (form) => {
    form.querySelectorAll('.prototype-field-error').forEach((error) => error.remove());
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
  };

  const addFieldError = (field, message) => {
    const error = document.createElement('span');
    error.className = 'field-error prototype-field-error';
    error.id = `${field.id}-prototype-error`;
    error.textContent = message;
    field.setAttribute('aria-invalid', 'true');
    const describedBy = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    describedBy.add(error.id);
    field.setAttribute('aria-describedby', Array.from(describedBy).join(' '));
    field.insertAdjacentElement('afterend', error);
  };

  const renderAppointmentPanel = (section, kind, title, body, actions = '') => {
    section.hidden = false;
    section.removeAttribute('aria-label');
    section.innerHTML = `<div class="status status--${kind} prototype-appointment-state"><div class="status__body"><span class="controlled-badge">Order 10 local simulation · no request made</span><h2 class="status__title" tabindex="-1">${title}</h2>${body}${actions ? `<div class="button-row">${actions}</div>` : ''}</div></div>`;
    return section.querySelector('h2');
  };

  const initializeAppointmentHandoff = (form) => {
    const doctorId = currentUrl.searchParams.get('doctor');
    const serviceId = currentUrl.searchParams.get('service');
    const care = currentUrl.searchParams.get('care');
    let message = '';

    if (doctorId === 'prototype-clinician-a') {
      form.querySelector('[data-care-route][value="doctor"]').checked = true;
      form.querySelector('#doctor').value = 'prototype-a';
      form.querySelector('[data-care-route][value="doctor"]').dispatchEvent(new Event('change', { bubbles: true }));
      message = 'Controlled handoff retained: Prototype clinician A. This public fixture ID carries no visitor data, schedule, or availability promise.';
    } else if (serviceId === 'prototype-service-a') {
      form.querySelector('[data-care-route][value="service"]').checked = true;
      form.querySelector('#service').value = 'prototype-service-a';
      form.querySelector('[data-care-route][value="service"]').dispatchEvent(new Event('change', { bubbles: true }));
      message = 'Controlled handoff retained: Prototype service A. This public fixture ID carries no symptoms, notes, or capability promise.';
    } else if (care === 'not-sure') {
      form.querySelector('[data-care-route][value="unsure"]').checked = true;
      form.querySelector('[data-care-route][value="unsure"]').dispatchEvent(new Event('change', { bubbles: true }));
      message = 'Controlled handoff retained: Not sure. No doctor or service is required or inferred.';
    }

    if (!message) return;
    const notice = document.createElement('div');
    notice.className = 'status status--info prototype-handoff-status';
    notice.setAttribute('role', 'status');
    notice.innerHTML = `<div class="status__body"><strong class="status__title">Care context carried safely</strong><p>${message}</p></div>`;
    document.querySelector('[data-section="A1"]')?.append(notice);
    document.querySelector('[data-section="A4"]')?.classList.add('prototype-handoff-target');
  };

  const connectAppointment = () => {
    if (pageName !== 'appointment.html') return;
    const form = document.querySelector('form.form-card');
    const stateSection = document.querySelector('[data-section="A3"]');
    const submit = form?.querySelector('button[type="submit"]');
    const sendSection = form?.querySelector('[data-section="A6"]');
    if (!form || !stateSection || !submit || !sendSection) return;

    initializeAppointmentHandoff(form);
    form.addEventListener('input', () => { appointmentDirty = true; });
    form.addEventListener('change', () => { appointmentDirty = true; });

    const simulator = document.createElement('div');
    simulator.className = 'prototype-simulator';
    simulator.innerHTML = '<label class="field-label" for="prototype-appointment-outcome">Prototype response to demonstrate</label><span class="field-hint" id="prototype-outcome-hint">Local state only. Timing is simulated and is not a hospital response-time promise.</span><select class="select" id="prototype-appointment-outcome" aria-describedby="prototype-outcome-hint"><option value="receipt">Authoritative receipt</option><option value="failure">Known recoverable failure</option><option value="unknown">Unknown outcome / reconciliation</option><option value="delivery">Receipt with delivery warning</option></select>';
    submit.insertAdjacentElement('beforebegin', simulator);
    const outcome = simulator.querySelector('select');

    const restoreEditing = () => {
      form.hidden = false;
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      submit.textContent = 'Send appointment request';
      stateSection.hidden = true;
      submit.focus();
    };

    const renderOutcome = (selectedOutcome) => {
      submit.removeAttribute('aria-busy');
      if (selectedOutcome === 'receipt') {
        form.querySelectorAll('#full-name, #phone, #preferred-date').forEach((field) => { field.value = ''; });
        form.hidden = true;
        const heading = renderAppointmentPanel(
          stateSection,
          'success',
          'Appointment request received — simulated receipt',
          '<p><strong>Prototype reference:</strong> PROTO-ONLY-001</p><p>This demonstrates an authoritative acknowledgement pattern. It is not a real request and not a confirmed appointment.</p>',
          `<a class="button" href="${withReviewContext(routes.home)}">Return home</a><a class="button button--secondary" href="${withReviewContext(routes.appointmentStates)}">Review all request states</a>`
        );
        heading.focus();
      } else if (selectedOutcome === 'failure') {
        submit.disabled = false;
        submit.textContent = 'Retry same simulated intent';
        const heading = renderAppointmentPanel(
          stateSection,
          'error',
          'The simulated request was not accepted',
          '<p>This known failure retains the local fields. A retry would reuse the same prototype intent; no duplicate request can be created.</p>',
          '<button class="button button--secondary" type="button" data-prototype-edit>Return to editing</button>'
        );
        stateSection.querySelector('[data-prototype-edit]').addEventListener('click', restoreEditing);
        heading.focus();
      } else if (selectedOutcome === 'unknown') {
        submit.disabled = true;
        submit.textContent = 'Waiting for reconciliation';
        const heading = renderAppointmentPanel(
          stateSection,
          'warning',
          'Request outcome unknown — simulated reconciliation',
          '<p>No success is claimed and a fresh request is blocked until the original intent is reconciled.</p>',
          '<button class="button" type="button" data-prototype-found>Simulate existing receipt found</button><button class="button button--secondary" type="button" data-prototype-not-created>Simulate not created</button>'
        );
        stateSection.querySelector('[data-prototype-found]').addEventListener('click', () => renderOutcome('receipt'));
        stateSection.querySelector('[data-prototype-not-created]').addEventListener('click', restoreEditing);
        heading.focus();
      } else {
        form.querySelectorAll('#full-name, #phone, #preferred-date').forEach((field) => { field.value = ''; });
        form.hidden = true;
        const heading = renderAppointmentPanel(
          stateSection,
          'warning',
          'Request received; confirmation message not delivered — simulated',
          '<p><strong>Prototype reference:</strong> PROTO-ONLY-001</p><p>The same receipt remains authoritative. This warning does not invite resubmission and does not imply the request failed.</p>',
          `<a class="button button--secondary" href="${withReviewContext(routes.appointmentStates)}">Review delivery-warning design</a>`
        );
        heading.focus();
      }
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      clearAppointmentErrors(form);
      const route = form.querySelector('[data-care-route]:checked')?.value;
      const conditionalField = route === 'doctor' ? form.querySelector('#doctor') : route === 'service' ? form.querySelector('#service') : null;

      if (conditionalField && !conditionalField.value) {
        addFieldError(conditionalField, `Choose a controlled ${route} record or select “I am not sure”.`);
        const heading = renderAppointmentPanel(
          stateSection,
          'error',
          'There is one problem to fix',
          `<p><a class="text-link" href="#${conditionalField.id}">Choose a controlled ${route} record</a>. Other locally entered values were retained. No request was made.</p>`
        );
        heading.focus();
        return;
      }

      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = 'Simulating protected request…';
      renderAppointmentPanel(
        stateSection,
        'info',
        'Checking one simulated request intent',
        '<p>Duplicate activation is blocked. No personal data, hospital system, network, storage, or appointment operation is involved.</p>'
      );
      window.setTimeout(() => renderOutcome(outcome.value), 450);
    }, true);
  };

  const enhanceFilterFocus = () => {
    document.querySelectorAll('.filter-toggle').forEach((trigger) => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;
      panel.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        panel.classList.remove('is-demo-visible');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      });
    });
  };

  const connectCapturedActions = () => {
    document.addEventListener('click', (event) => {
      const language = event.target.closest('[data-prototype-language]');
      if (language) {
        event.preventDefault();
        event.stopImmediatePropagation();
        navigateToFixture(language.dataset.prototypeLanguage);
        return;
      }

      const route = event.target.closest('a[data-prototype-route]');
      if (route) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(route.href);
        return;
      }

      const pagination = event.target.closest('.pagination a');
      if (pagination) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(withReviewContext(pagination.href));
      }
    }, true);
  };

  rewriteHomeRoutes();
  decorateLocalLinks();
  buildToolbar();
  connectLanguageSwitches();
  applyUrlStateToForms();
  connectSafeGetForms();
  updateControlledResults();
  renderDirectoryState();
  connectAppointment();
  enhanceFilterFocus();
  connectCapturedActions();

  requestAnimationFrame(() => html.classList.add('prototype-ready'));
})();
