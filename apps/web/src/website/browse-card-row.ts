// Both rows use equal-width snap targets. Measure their live spacing so a
// partially visible card becomes the first card on the next page.
export function browseCardRow(viewport: HTMLElement, first: Element | null, direction: -1 | 1) {
  const second = first?.nextElementSibling
  if (!first || !second) return

  const card = first.getBoundingClientRect()
  const stride = second.getBoundingClientRect().left - card.left
  if (stride <= 0) return

  const gap = stride - card.width
  const pageSize = Math.max(1, Math.floor((viewport.clientWidth + gap + 1) / stride))
  const current = Math.round(viewport.scrollLeft / stride)
  const page = direction > 0 ? Math.floor(current / pageSize) + 1 : Math.ceil(current / pageSize) - 1
  viewport.scrollTo({
    left: page * pageSize * stride,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}
