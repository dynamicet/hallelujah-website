(() => {
  const params = new URLSearchParams(window.location.search);
  const fixture = params.get('fixture') || 'en';
  const auditEnabled = params.get('audit') === '1';
  const supportedFixtures = new Set(['en', 'am', 'mixed', 'long', 'unavailable']);
  const activeFixture = supportedFixtures.has(fixture) ? fixture : 'en';

  const fixtureCopy = {
    am: {
      heading: 'ለሚፈልጉት የሕክምና እንክብካቤ ትክክለኛውን ቀጣይ እርምጃ በግልጽ ሁኔታ ያግኙ',
      subheading: 'አስፈላጊ መረጃና የእንክብካቤ አማራጮች',
      body: 'ይህ የአቀማመጥ ሙከራ የአማርኛ ፊደላትን፣ ረጅም የጽሑፍ መስመሮችን እና በትንሽ ማያ ላይ ያለውን ንባብ ለመፈተሽ ብቻ የተዘጋጀ ነው።',
      action: 'ተጨማሪ መረጃ ይመልከቱ',
      label: 'የመረጃ መስክ መለያ',
      short: 'የአቀማመጥ ሙከራ'
    },
    mixed: {
      heading: ' — የአማርኛና English የተቀላቀለ የአቀማመጥ ሙከራ',
      body: ' — Mixed script fixture፦ ረጅም labels, names, IDs እና ቁጥሮች 12345 አብረው ይታያሉ።',
      action: ' — መረጃ'
    },
    long: {
      heading: ' — extended content fixture for wrapping, hierarchy, and narrow reflow without truncation',
      body: ' This deliberately expanded sentence tests whether substantially longer approved content can wrap without covering controls, clipping important information, or creating horizontal page scrolling.',
      action: ' — continue to the complete information and next-step guidance'
    }
  };

  const isVisibleTextNode = (node) => {
    const parent = node.parentElement;
    if (!parent || !node.nodeValue.trim()) return false;
    if (parent.closest('script, style, svg, code, .visually-hidden, .prototype-banner, .order-9-fixture-notice')) return false;
    return true;
  };

  const applyAmharicFixture = () => {
    document.documentElement.lang = 'am';
    const copy = fixtureCopy.am;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (isVisibleTextNode(walker.currentNode)) nodes.push(walker.currentNode);

    nodes.forEach((node, index) => {
      const parent = node.parentElement;
      if (parent.matches('h1')) node.nodeValue = copy.heading;
      else if (parent.matches('h2, h3, legend')) node.nodeValue = copy.subheading;
      else if (parent.matches('button, a, summary, option')) node.nodeValue = index % 3 === 0 ? copy.action : copy.short;
      else if (parent.matches('label, .eyebrow, .section-id, .record-card__type, .journey-card__step, dt, strong')) node.nodeValue = copy.label;
      else node.nodeValue = copy.body;
    });
  };

  const appendFixture = (mode) => {
    const copy = fixtureCopy[mode];
    document.querySelectorAll('h1, h2, h3, p, label, legend, summary, .button, .nav-link').forEach((element, index) => {
      if (element.closest('.prototype-banner, .order-9-fixture-notice') || !element.textContent.trim()) return;
      if (element.matches('h1, h2, h3, legend')) element.append(copy.heading);
      else if (element.matches('.button, .nav-link, summary')) element.append(copy.action);
      else if (mode === 'long' || index % 2 === 0) element.append(copy.body);
    });
  };

  const addFixtureNotice = () => {
    if (activeFixture === 'en') return;
    const notice = document.createElement('aside');
    notice.className = 'order-9-fixture-notice';
    notice.setAttribute('aria-label', 'Order 9 test fixture status');
    if (activeFixture === 'am') {
      notice.innerHTML = '<span lang="am">የአቀማመጥ ሙከራ ብቻ — ይህ የተፈቀደ ትርጉም ወይም የሆስፒታል መረጃ አይደለም።</span> Layout test only — not approved translation or hospital content.';
    } else if (activeFixture === 'unavailable') {
      notice.textContent = 'Requested translation unavailable — this fixture keeps the approved source-language layout visible and does not fabricate translated safety or operational content.';
    } else {
      notice.textContent = `Order 9 ${activeFixture}-content stress fixture — not approved translation or hospital content.`;
    }
    const prototypeBanner = document.querySelector('.prototype-banner');
    (prototypeBanner || document.body).insertAdjacentElement(prototypeBanner ? 'afterend' : 'afterbegin', notice);
  };

  const auditLayout = () => {
    const root = document.documentElement;
    const viewportWidth = root.clientWidth;
    const horizontalOverflow = root.scrollWidth > viewportWidth + 1;
    const overflowElements = [];

    document.querySelectorAll('body *').forEach((element) => {
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || element.closest('svg')) return;
      const rect = element.getBoundingClientRect();
      if (rect.right > viewportWidth + 1 || rect.left < -1) {
        overflowElements.push({
          element: element.tagName.toLowerCase(),
          className: String(element.className || '').slice(0, 100),
          left: Math.round(rect.left),
          right: Math.round(rect.right)
        });
      }
    });

    const targetViolations = [];
    document.querySelectorAll('button, input:not([type="checkbox"]):not([type="radio"]), select, textarea, summary, .choice, .button, .menu-trigger, .pagination a, nav a').forEach((element) => {
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || element.disabled) return;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || element.getClientRects().length === 0) return;
      if (rect.width < 44 || rect.height < 44) {
        targetViolations.push({
          element: element.tagName.toLowerCase(),
          text: element.textContent.trim().slice(0, 80),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
    });

    const result = {
      page: location.pathname.split('/').pop(),
      fixture: activeFixture,
      viewport: { width: viewportWidth, height: root.clientHeight },
      documentWidth: root.scrollWidth,
      horizontalOverflow,
      overflowElements: overflowElements.slice(0, 20),
      targetViolations: targetViolations.slice(0, 20),
      passed: !horizontalOverflow && overflowElements.length === 0 && targetViolations.length === 0
    };

    root.dataset.order9Audit = result.passed ? 'pass' : 'fail';
    const output = document.createElement('script');
    output.id = 'order-9-audit-result';
    output.type = 'application/json';
    output.textContent = JSON.stringify(result);
    document.body.append(output);
    document.title = `[ORDER9:${result.passed ? 'PASS' : 'FAIL'}] ${document.title}`;
  };

  document.documentElement.dataset.order9Fixture = activeFixture;
  if (activeFixture === 'long') document.documentElement.dataset.navMode = 'compact';
  if (activeFixture === 'am') applyAmharicFixture();
  if (activeFixture === 'mixed' || activeFixture === 'long') appendFixture(activeFixture);
  addFixtureNotice();

  if (auditEnabled) {
    const run = () => requestAnimationFrame(() => requestAnimationFrame(auditLayout));
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });
  }
})();
