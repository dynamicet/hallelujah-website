import ts from 'typescript'

// Exact destinations with repository provenance. This is permission to render a
// link, not permission to fetch from the origin or load remote media/scripts.
const approvedLinks = new Map([
  ['src/website/hospital-contact.ts', new Map([
    ['mapHref', 'https://maps.app.goo.gl/VQMCJFfeZX1MtXUN7'],
    ['directionsHref', 'https://www.google.com/maps/dir/?api=1&destination=8.9861882%2C38.7590401'],
  ])], // docs/brand/contact-directions.md
  ['src/website/site-footer.ts', new Map([
    ['facebook', 'https://www.facebook.com/hallelujah.hospital'],
    ['instagram', 'https://www.instagram.com/official_hallelujahospital/'],
    ['linkedin', 'https://www.linkedin.com/company/hallelujah-general-hospital/'],
  ])], // docs/brand/footer-social-links.md
])
const namespaces = new Map([
  ['schemaContext', 'https://schema.org'],
  ['sitemapNamespace', 'http://www.sitemaps.org/schemas/sitemap/0.9'],
  ['alternateNamespace', 'http://www.w3.org/1999/xhtml'],
])
const returnRoutes = new Set([
  'src/app/(public)/doctors/[slug]/page.tsx',
  'src/app/(public)/services/[slug]/page.tsx',
  'src/website/service-detail-page.tsx',
])

export function findUrlFailures(relativeFile, contents) {
  relativeFile = relativeFile.replaceAll('\\', '/')
  if (relativeFile.endsWith('.css')) {
    return /https?:\/\//u.test(contents) ? [`${relativeFile}: external URL in stylesheet`] : []
  }
  const source = ts.createSourceFile(relativeFile, contents, ts.ScriptTarget.Latest, true, relativeFile.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const failures = source.parseDiagnostics.length ? [`${relativeFile}: URL policy could not parse source`] : []
  function visit(node) {
    if ((ts.isStringLiteralLike(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) && /https?:\/\//u.test(node.text)) {
      if (!permitted(node)) {
        const { line } = source.getLineAndCharacterOfPosition(node.getStart(source))
        failures.push(`${relativeFile}:${line + 1}: unapproved external URL or URL use`)
      }
    }
    ts.forEachChild(node, visit)
  }
  function permitted(node) {
    const parent = node.parent
    // URL-shaped compile-time contact types do not initiate a connection.
    if (relativeFile === 'src/design-system/components/header-contacts.tsx'
      && ts.isTemplateHead(node) && ts.isTemplateLiteralTypeNode(parent)
      && ['`https://wa.me/${string}`', '`https://t.me/${string}`'].includes(parent.getText(source))) return true
    if (!ts.isStringLiteralLike(node)) return false
    if (relativeFile === 'src/content/governed-discovery.ts' && ts.isVariableDeclaration(parent)
      && namespaces.get(parent.name.getText(source)) === node.text) return true
    // Reserved parsing origin is allowed only as the URL base or origin guard.
    if (returnRoutes.has(relativeFile) && node.text === 'https://local.invalid') {
      if (ts.isNewExpression(parent) && parent.expression.getText(source) === 'URL'
        && parent.arguments?.[1] === node) return true
      if (ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken
        && parent.right === node && ts.isPropertyAccessExpression(parent.left)
        && parent.left.name.text === 'origin') return true
    }
    if (['src/website/contact-directions.tsx', 'src/website/hospital-location-map.tsx'].includes(relativeFile)
      && node.text === 'https://www.openstreetmap.org/copyright'
      && ts.isJsxAttribute(parent) && parent.name.getText(source) === 'href') return true
    const links = approvedLinks.get(relativeFile)
    if (!links || !ts.isPropertyAssignment(parent)) return false
    const name = parent.name.getText(source)
    if (relativeFile === 'src/website/hospital-contact.ts') return links.get(name) === node.text
    if (name !== 'href' || !ts.isObjectLiteralExpression(parent.parent)) return false
    const platform = parent.parent.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(source) === 'platform')
    return platform && ts.isStringLiteral(platform.initializer) && links.get(platform.initializer.text) === node.text
  }
  visit(source)
  return failures
}
