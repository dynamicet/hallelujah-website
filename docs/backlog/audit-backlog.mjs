#!/usr/bin/env node

import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backlogRoot = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(backlogRoot, '..');

const epicFiles = (await readdir(backlogRoot))
  .filter((name) => /^epic-\d{2}-.+\.md$/.test(name))
  .sort();
const backlogMarkdownFiles = (await readdir(backlogRoot))
  .filter((name) => name.endsWith('.md'))
  .sort();

const expectedInventory = {
  total: 137,
  lanes: { DELIVERY: 71, DECISION: 36, CONTENT: 5, EVIDENCE: 25 },
  priorities: { P0: 82, P1: 41, P2: 12, P3: 2 }
};

const expectedRoutes = [
  '/',
  '/emergency/',
  '/doctors/',
  '/doctors/{doctor-slug}/',
  '/services/',
  '/services/{service-slug}/',
  '/appointments/',
  '/patient-information/',
  '/contact/',
  '/search/',
  '/about/',
  '/privacy/',
  '/accessibility/',
  '404/410/unavailable',
  '/careers/'
];

const results = [];
const record = (id, passed, detail) => results.push({ id, passed: Boolean(passed), detail });

const sources = new Map();
for (const file of backlogMarkdownFiles) {
  sources.set(file, await readFile(path.join(backlogRoot, file), 'utf8'));
}

const ticketRows = [];
for (const file of epicFiles) {
  const source = sources.get(file);
  for (const match of source.matchAll(/^\| `(B\d{2}-\d{3})` \| (DELIVERY|DECISION|CONTENT|EVIDENCE) \| (P[0-3]) \|/gm)) {
    ticketRows.push({ id: match[1], lane: match[2], priority: match[3], file });
  }
}

const ticketIds = ticketRows.map(({ id }) => id);
const defined = new Set(ticketIds);
const duplicates = [...new Set(ticketIds.filter((id, index) => ticketIds.indexOf(id) !== index))].sort();
record('BKL-001-ticket-identity', ticketRows.length === expectedInventory.total && duplicates.length === 0, {
  expected: expectedInventory.total,
  actual: ticketRows.length,
  duplicates
});

const actualLanes = Object.fromEntries(Object.keys(expectedInventory.lanes).map((lane) => [
  lane,
  ticketRows.filter((ticket) => ticket.lane === lane).length
]));
const actualPriorities = Object.fromEntries(Object.keys(expectedInventory.priorities).map((priority) => [
  priority,
  ticketRows.filter((ticket) => ticket.priority === priority).length
]));
record('BKL-002-inventory-counts',
  JSON.stringify(actualLanes) === JSON.stringify(expectedInventory.lanes)
    && JSON.stringify(actualPriorities) === JSON.stringify(expectedInventory.priorities),
  { expected: expectedInventory, actual: { total: ticketRows.length, lanes: actualLanes, priorities: actualPriorities } }
);

const allBacklogText = [...sources.values()].join('\n');
const referencedTicketIds = [...allBacklogText.matchAll(/`(B\d{2}-\d{3})`/g)].map((match) => match[1]);
const undefinedReferences = [...new Set(referencedTicketIds.filter((id) => !defined.has(id)))].sort();
const wildcardReferences = [...new Set([...allBacklogText.matchAll(/`(B\d{2}-\*)`/g)].map((match) => match[1]))].sort();
record('BKL-003-ticket-references', undefinedReferences.length === 0 && wildcardReferences.length === 0, {
  undefined: undefinedReferences,
  wildcard: wildcardReferences
});

const requirementSource = await readFile(path.join(docsRoot, 'requirements/requirements-matrix.md'), 'utf8');
const requirementMatrix = sources.get('traceability-matrix.md');
const sourceRequirements = [...requirementSource.matchAll(/^\| ([GSEHDVAPCI]-\d{3}) \|/gm)].map((match) => match[1]).sort();
const mappedRequirements = [...requirementMatrix.matchAll(/^\| `([GSEHDVAPCI]-\d{3})` \|/gm)].map((match) => match[1]).sort();
const missingRequirements = sourceRequirements.filter((id) => !mappedRequirements.includes(id));
const extraRequirements = mappedRequirements.filter((id) => !sourceRequirements.includes(id));
const duplicateRequirementRows = [...new Set(mappedRequirements.filter((id, index) => mappedRequirements.indexOf(id) !== index))];
record('BKL-004-requirement-coverage',
  sourceRequirements.length === mappedRequirements.length
    && missingRequirements.length === 0
    && extraRequirements.length === 0
    && duplicateRequirementRows.length === 0,
  {
    source: sourceRequirements.length,
    mapped: mappedRequirements.length,
    missing: missingRequirements,
    extra: extraRequirements,
    duplicates: duplicateRequirementRows
  }
);

const decisionPattern = '(?:GOV|SAFE|APPT|CARE|ACCESS|SEARCH|LANG|INST|BRAND|HR|SEC|DEL)-\\d{2}';
const decisionSource = await readFile(path.join(docsRoot, 'validation/stakeholder-low-fidelity-validation.md'), 'utf8');
const sourceDecisions = [...decisionSource.matchAll(new RegExp(`^\\| (${decisionPattern}) \\|`, 'gm'))].map((match) => match[1]).sort();
const mappedDecisions = [...requirementMatrix.matchAll(new RegExp('^\\| `(' + decisionPattern + ')` \\|', 'gm'))].map((match) => match[1]).sort();
const missingDecisions = sourceDecisions.filter((id) => !mappedDecisions.includes(id));
const decisionsWithoutTicket = mappedDecisions.filter((id) => {
  const row = requirementMatrix.split('\n').find((line) => line.startsWith(`| \`${id}\` |`));
  return !row || !/`B\d{2}-\d{3}`/.test(row);
});
record('BKL-005-decision-coverage',
  sourceDecisions.length === 32
    && mappedDecisions.length === 32
    && missingDecisions.length === 0
    && decisionsWithoutTicket.length === 0,
  {
    source: sourceDecisions.length,
    mapped: mappedDecisions.length,
    missing: missingDecisions,
    withoutTicket: decisionsWithoutTicket
  }
);

const architectureSource = await readFile(path.join(docsRoot, 'architecture/epic-0-technical-foundation.md'), 'utf8');
const sourceArchitecture = [...architectureSource.matchAll(/^\| `(ARCH-\d{2})` \|/gm)].map((match) => match[1]).sort();
const mappedArchitecture = [...requirementMatrix.matchAll(/^\| `(ARCH-\d{2})` [^\n]+$/gm)].map((match) => match[1]).sort();
record('BKL-006-architecture-coverage',
  sourceArchitecture.length === 7
    && mappedArchitecture.length === 7
    && sourceArchitecture.every((id) => mappedArchitecture.includes(id)),
  { source: sourceArchitecture, mapped: mappedArchitecture }
);

const routeRows = requirementMatrix
  .split('\n')
  .filter((line) => /^\| (?:`\/|404\/410\/unavailable)/.test(line));
const missingRoutes = expectedRoutes.filter((route) => !routeRows.some((row) => row.includes(route)));
const incompleteRouteRows = routeRows.filter((row) => {
  const ticketReferences = [...row.matchAll(/`(B\d{2}-\d{3})`/g)].map((match) => match[1]);
  return ticketReferences.length < 2 || ticketReferences.some((id) => !defined.has(id));
});
record('BKL-007-route-coverage', missingRoutes.length === 0 && incompleteRouteRows.length === 0, {
  expected: expectedRoutes.length,
  mappedRows: routeRows.length,
  missing: missingRoutes,
  incompleteRows: incompleteRouteRows
});

const exists = async (target) => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};

const githubAnchors = (markdown) => {
  const anchors = new Set();
  const seen = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*$/);
    if (!heading) continue;
    let slug = heading[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[`*_~]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/ /g, '-');
    const duplicateIndex = seen.get(slug) ?? 0;
    seen.set(slug, duplicateIndex + 1);
    if (duplicateIndex) slug = `${slug}-${duplicateIndex}`;
    anchors.add(slug);
  }
  for (const match of markdown.matchAll(/<(?:a\s+[^>]*name|[^>]+id)=["']([^"']+)["']/gi)) {
    anchors.add(match[1]);
  }
  return anchors;
};

const brokenLinks = [];
let checkedLinks = 0;
for (const [file, source] of sources) {
  const absolute = path.join(backlogRoot, file);
  for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const href = match[1].trim().replace(/^<|>$/g, '');
    if (/^(?:https?:|mailto:|tel:)/.test(href)) continue;
    checkedLinks += 1;
    const hashIndex = href.indexOf('#');
    const filePart = decodeURIComponent(hashIndex < 0 ? href : href.slice(0, hashIndex));
    const fragment = hashIndex < 0 ? '' : decodeURIComponent(href.slice(hashIndex + 1));
    const target = filePart ? path.resolve(path.dirname(absolute), filePart) : absolute;
    if (!(await exists(target))) {
      brokenLinks.push({ file, href, reason: 'missing file' });
      continue;
    }
    if (fragment && target.endsWith('.md')) {
      const targetSource = await readFile(target, 'utf8');
      if (!githubAnchors(targetSource).has(fragment.toLowerCase())) {
        brokenLinks.push({ file, href, reason: 'missing anchor' });
      }
    }
  }
}
record('BKL-008-local-links', brokenLinks.length === 0, { checked: checkedLinks, broken: brokenLinks });

const report = {
  method: 'Read-only local backlog integrity audit; no stakeholder, security, browser, language, device, production, or release validation',
  assertions: results.length,
  passed: results.filter(({ passed }) => passed).length,
  failed: results.filter(({ passed }) => !passed).length,
  inventory: { tickets: ticketRows.length, lanes: actualLanes, priorities: actualPriorities },
  coverage: {
    requirements: mappedRequirements.length,
    decisions: mappedDecisions.length,
    architecture: mappedArchitecture.length,
    routes: routeRows.length,
    localLinks: checkedLinks
  },
  results
};

console.log(JSON.stringify(report, null, 2));
if (report.failed) process.exitCode = 1;
