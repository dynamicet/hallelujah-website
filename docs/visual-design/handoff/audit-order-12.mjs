#!/usr/bin/env node

import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const visualRoot = path.resolve(here, '..');
const docsRoot = path.resolve(visualRoot, '..');
const evidenceRoot = path.join(here, 'evidence');

const handoffFiles = [
  'README.md',
  'developer-handoff.md',
  'page-handoff-matrix.md',
  'remaining-assumptions-and-gates.md',
  'accessibility-and-validation-checklist.md',
  'asset-and-content-guidance.md'
];

const canonicalFiles = [
  path.join(docsRoot, 'requirements/requirements-matrix.md'),
  path.join(docsRoot, 'ux/sitemap.md'),
  path.join(docsRoot, 'ux/page-specifications.md'),
  path.join(docsRoot, 'ux/utility-page-specifications.md'),
  path.join(docsRoot, 'architecture/epic-0-technical-foundation.md'),
  path.join(docsRoot, 'wireframes/utility-pages.md'),
  path.join(docsRoot, 'design-system/README.md'),
  path.join(docsRoot, 'validation/stakeholder-low-fidelity-validation.md'),
  path.join(visualRoot, 'foundations/tokens.css'),
  path.join(visualRoot, 'foundations/tokens.json'),
  path.join(visualRoot, 'components/component-tokens.css'),
  path.join(visualRoot, 'components/component-tokens.json'),
  path.join(visualRoot, 'motion/motion-and-storytelling.md'),
  path.join(visualRoot, 'prototype/prototype-specification.md'),
  path.join(visualRoot, 'qa/evidence/order-11-audit-results.json')
];

const decisions = [
  'GOV-01', 'GOV-02', 'GOV-03',
  'SAFE-01', 'SAFE-02', 'SAFE-03', 'SAFE-04',
  'APPT-01', 'APPT-02', 'APPT-03', 'APPT-04',
  'CARE-01', 'CARE-02', 'CARE-03', 'CARE-04', 'CARE-05', 'CARE-06',
  'ACCESS-01', 'SEARCH-01', 'SEARCH-02', 'LANG-01', 'LANG-02',
  'INST-01', 'INST-02', 'INST-03', 'BRAND-01',
  'HR-01', 'HR-02', 'HR-03', 'SEC-01', 'SEC-02', 'DEL-01'
];

const pageContracts = [
  ['Home', 'H0', 'H9', 'critical-journeys/home.html'],
  ['Emergency', 'E0', 'E8', 'critical-journeys/emergency.html'],
  ['Doctor Directory', 'D0', 'D6', 'care-discovery/doctor-directory.html'],
  ['Doctor Profile', 'P0', 'P7', 'care-discovery/doctor-profile.html'],
  ['Services Directory', 'S0', 'S7', 'care-discovery/services-directory.html'],
  ['Service Detail', 'V0', 'V9', 'care-discovery/service-detail.html'],
  ['Request an Appointment', 'A0', 'A8', 'critical-journeys/appointment.html'],
  ['Patient & Visitor Information', 'PI0', 'PI7', 'practical-institutional/patient-information.html'],
  ['Locations & Contact', 'LC0', 'LC7', 'practical-institutional/locations-contact.html'],
  ['Search Results', 'SR0', 'SR7', 'practical-institutional/search-results.html'],
  ['About the Hospital', 'AB0', 'AB9', 'practical-institutional/about.html'],
  ['Careers', 'CR0', 'CR8', 'practical-institutional/careers.html']
];

const exists = async (target) => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};

const markdownFiles = async (root) => {
  const found = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) found.push(...await markdownFiles(target));
    if (entry.isFile() && entry.name.endsWith('.md')) found.push(target);
  }
  return found;
};

const results = [];
const record = (id, category, passed, detail) => results.push({
  id,
  category,
  passed: Boolean(passed),
  detail
});

const requiredTargets = [
  ...handoffFiles.map((file) => path.join(here, file)),
  ...canonicalFiles
];
const missingRequired = [];
for (const target of requiredTargets) {
  if (!(await exists(target))) missingRequired.push(path.relative(here, target));
}
record('H12-01', 'required-artifacts', missingRequired.length === 0, {
  checked: requiredTargets.length,
  missing: missingRequired
});

const brokenLinks = [];
let linkCount = 0;
for (const file of handoffFiles) {
  const absolute = path.join(here, file);
  const source = await readFile(absolute, 'utf8');
  const links = source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g);
  for (const match of links) {
    const href = match[1].trim().replace(/^<|>$/g, '');
    if (/^(?:https?:|mailto:|tel:|#)/.test(href)) continue;
    linkCount += 1;
    const filePart = decodeURIComponent(href.split('#')[0].split('?')[0]);
    if (!filePart) continue;
    const target = path.resolve(path.dirname(absolute), filePart);
    const generatedResult = file === 'README.md' && href === 'evidence/order-12-audit-results.json';
    if (!generatedResult && !(await exists(target))) brokenLinks.push({ file, href });
  }
}
record('H12-02', 'local-links', brokenLinks.length === 0, {
  checked: linkCount,
  broken: brokenLinks
});

const gates = await readFile(path.join(here, 'remaining-assumptions-and-gates.md'), 'utf8');
const missingDecisions = decisions.filter((id) => !gates.includes(`\`${id}\``));
const unexpectedDecisionCount = decisions.length !== 32;
record('H12-03', 'formal-decision-coverage', missingDecisions.length === 0 && !unexpectedDecisionCount, {
  expected: decisions.length,
  covered: decisions.length - missingDecisions.length,
  missing: missingDecisions
});

const pageMatrix = await readFile(path.join(here, 'page-handoff-matrix.md'), 'utf8');
const pageFailures = [];
for (const [name, start, end, study] of pageContracts) {
  const studyPath = path.join(visualRoot, 'pages', study);
  if (!pageMatrix.includes(name) || !pageMatrix.includes(`\`${start}\`–\`${end}\``) || !(await exists(studyPath))) {
    pageFailures.push({ name, start, end, study });
  }
}
record('H12-04', 'page-contract-coverage', pageFailures.length === 0, {
  expected: pageContracts.length,
  covered: pageContracts.length - pageFailures.length,
  failures: pageFailures
});

const tokenManifests = [
  path.join(visualRoot, 'foundations/tokens.json'),
  path.join(visualRoot, 'components/component-tokens.json')
];
const tokenFailures = [];
for (const manifest of tokenManifests) {
  try {
    JSON.parse(await readFile(manifest, 'utf8'));
  } catch (error) {
    tokenFailures.push({ file: path.relative(visualRoot, manifest), error: error.message });
  }
}
const componentCss = await readFile(path.join(visualRoot, 'components/component-tokens.css'), 'utf8');
const foundationImport = componentCss.includes('@import url("../foundations/tokens.css")');
record('H12-05', 'token-integrity', tokenFailures.length === 0 && foundationImport, {
  manifestsParsed: tokenManifests.length - tokenFailures.length,
  foundationImport,
  failures: tokenFailures
});

const priorResultFiles = [
  ['order-9', path.join(visualRoot, 'pages/responsive/evidence/order-9-audit-results.json')],
  ['order-10', path.join(visualRoot, 'prototype/evidence/order-10-audit-results.json')],
  ['order-11', path.join(visualRoot, 'qa/evidence/order-11-audit-results.json')]
];
const prior = {};
const priorFailures = [];
for (const [name, resultPath] of priorResultFiles) {
  try {
    const data = JSON.parse(await readFile(resultPath, 'utf8'));
    prior[name] = name === 'order-9'
      ? { cases: data.cases, passed: data.passed, failed: data.failed }
      : name === 'order-10'
        ? { assertions: data.interactionAssertions, passed: data.passed, failed: data.failed, geometryCases: data.geometryCases, geometryFailures: data.geometryFailures }
        : { assertions: data.assertions, passed: data.passed, failed: data.failed, artifacts: data.artifacts };
    if (data.failed !== 0 || (name === 'order-10' && data.geometryFailures !== 0)) priorFailures.push(name);
  } catch (error) {
    priorFailures.push(name);
    prior[name] = { error: error.message };
  }
}
record('H12-06', 'prior-evidence-summary', priorFailures.length === 0, {
  summaries: prior,
  failures: priorFailures
});

const boundaryFiles = ['README.md', 'developer-handoff.md', 'remaining-assumptions-and-gates.md'];
const boundaryFailures = [];
for (const file of boundaryFiles) {
  const source = await readFile(path.join(here, file), 'utf8');
  if (!/not (?:approved|authorization)|must not|does not/i.test(source) || !/production|publication/i.test(source)) {
    boundaryFailures.push(file);
  }
}
record('H12-07', 'release-boundary', boundaryFailures.length === 0, {
  checked: boundaryFiles.length,
  failures: boundaryFailures
});

const sitemap = await readFile(path.join(docsRoot, 'ux/sitemap.md'), 'utf8');
const routeContracts = [
  ['/appointments/', 'Request an Appointment'],
  ['/patient-information/', 'Patient & Visitor Information'],
  ['/contact/', 'Locations & Contact']
];
const forbiddenRouteAliases = ['/appointments/request/', '/patients-visitors/', '/locations-contact/'];
const routeFailures = routeContracts.filter(([route, page]) =>
  !sitemap.includes(`\`${route}\``) ||
  !pageMatrix.includes(`${page} \`${route}\``)
);
const routeAliasFailures = [];
for (const file of await markdownFiles(docsRoot)) {
  const source = await readFile(file, 'utf8');
  for (const route of forbiddenRouteAliases) {
    if (source.includes(route)) routeAliasFailures.push({
      route,
      file: path.relative(docsRoot, file)
    });
  }
}
record('H12-08', 'canonical-route-consistency', routeFailures.length === 0 && routeAliasFailures.length === 0, {
  checked: routeContracts.length,
  failures: routeFailures.map(([route, page]) => ({ route, page })),
  forbiddenAliasesFound: routeAliasFailures
});

const utilitySpecs = await readFile(path.join(docsRoot, 'ux/utility-page-specifications.md'), 'utf8');
const utilityWireframes = await readFile(path.join(docsRoot, 'wireframes/utility-pages.md'), 'utf8');
const utilityContracts = [
  ['/privacy/', 'PV0', 'PV5'],
  ['/accessibility/', 'AX0', 'AX5'],
  ['404', 'NF0', 'NF4']
];
const utilityFailures = utilityContracts.filter(([identity, start, end]) =>
  !utilitySpecs.includes(identity) ||
  !utilitySpecs.includes(`\`${start}\``) ||
  !utilitySpecs.includes(`\`${end}\``) ||
  !utilityWireframes.includes(identity) ||
  !utilityWireframes.includes(`\`${start}\``) ||
  !utilityWireframes.includes(`\`${end}\``) ||
  !pageMatrix.includes(identity) ||
  !pageMatrix.includes(`\`${start}\`–\`${end}\``)
);
record('H12-09', 'utility-contract-coverage', utilityFailures.length === 0, {
  expected: utilityContracts.length,
  covered: utilityContracts.length - utilityFailures.length,
  failures: utilityFailures.map(([identity, start, end]) => ({ identity, start, end }))
});

const report = {
  generatedAt: new Date().toISOString(),
  method: 'Local Node documentation-integrity audit; no browser, network, stakeholder, language, device, security, or production validation',
  assertions: results.length,
  passed: results.filter((result) => result.passed).length,
  failed: results.filter((result) => !result.passed).length,
  results
};

await mkdir(evidenceRoot, { recursive: true });
await writeFile(path.join(evidenceRoot, 'order-12-audit-results.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ assertions: report.assertions, passed: report.passed, failed: report.failed }, null, 2));

if (report.failed) process.exitCode = 1;
