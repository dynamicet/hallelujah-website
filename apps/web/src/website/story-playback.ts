type StoryCinema = {
  dialog: HTMLDialogElement
  body: HTMLDivElement
  details: HTMLDetailsElement
  summary: HTMLElement
  content: HTMLElement
  player: HTMLVideoElement
  shown: boolean
  unlock?: () => void
}

function lockStoryScroll() {
  const properties = [
    { element: document.documentElement, property: 'overflow' },
    { element: document.body, property: 'overflow' },
    { element: document.body, property: 'padding-right' },
  ].map(({ element, property }) => ({ element, property, value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) }))
  const gutter = window.innerWidth - document.documentElement.clientWidth
  if (gutter > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gutter}px`
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  return () => properties.forEach(({ element, property, value, priority }) => {
    if (value) element.style.setProperty(property, value, priority)
    else element.style.removeProperty(property)
  })
}

/** Native disclosures remain the fallback; enhanced films open in a cinema dialog. */
export function startStories(section: HTMLElement) {
  const controller = new AbortController()
  const { signal } = controller
  const players = [...section.querySelectorAll('video')]
  const cinemas: StoryCinema[] = []
  const restoreAttributes: Array<() => void> = []
  let active: StoryCinema | undefined
  const focusSummary = (details: HTMLDetailsElement, open: boolean) => {
    details.open = open
    const summary = details.querySelector('summary')
    summary?.focus({ preventScroll: true })
    summary?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }
  const readingAction = (event: Event) => {
    if (!(event.target instanceof Element)) return
    const button = event.target.closest<HTMLButtonElement>('button')
    if (!button) return
    if (button.matches('.story-film-continue')) {
      const target = document.getElementById(button.getAttribute('aria-controls') ?? '')
      if (target instanceof HTMLDetailsElement) {
        button.closest('.story-film-player')?.querySelector('video')?.pause()
        focusSummary(target, true)
      }
    } else if (button.matches('[data-story-return]')) {
      const details = button.closest('details')
      if (details) focusSummary(details, false)
    }
  }
  section.addEventListener('click', readingAction, { signal })

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    const player = entry.target as HTMLVideoElement
    if (!entry.isIntersecting && !player.closest('dialog[open]')) player.pause()
  }))
  players.forEach((player) => observer.observe(player))

  const restore = (cinema: StoryCinema, returnFocus: boolean) => {
    if (!cinema.shown) return
    cinema.shown = false
    cinema.player.pause()
    cinema.details.open = false
    cinema.details.append(cinema.content)
    cinema.unlock?.()
    cinema.unlock = undefined
    observer.observe(cinema.player)
    if (active === cinema) active = undefined
    if (returnFocus && cinema.summary.isConnected) cinema.summary.focus({ preventScroll: true })
  }

  section.querySelectorAll<HTMLDetailsElement>('.everyday-film').forEach((details) => {
    details.addEventListener('toggle', () => { if (!details.open) details.querySelector('video')?.pause() }, { signal })
    if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return
    const summary = details.querySelector<HTMLElement>('summary')
    const content = details.querySelector<HTMLElement>('.everyday-film-content')
    const player = content?.querySelector('video')
    const article = details.closest('article')
    if (!summary || !content || !player || !article) return

    const dialog = document.createElement('dialog')
    dialog.className = 'story-cinema'
    dialog.id = `cinema-${details.id}`
    const heading = document.createElement('header')
    heading.className = 'story-cinema-heading'
    const title = document.createElement('h2')
    title.className = 'story-cinema-title'
    title.id = `${dialog.id}-title`
    title.textContent = article.querySelector('h3')?.textContent ?? 'Everyday story'
    const person = document.createElement('p')
    person.className = 'story-cinema-person'
    person.textContent = article.querySelector('.everyday-feature-person')?.textContent ?? ''
    const close = document.createElement('button')
    close.className = 'story-cinema-close'
    close.type = 'button'
    close.textContent = 'Close '
    close.autofocus = true
    const cross = document.createElement('span')
    cross.setAttribute('aria-hidden', 'true')
    cross.textContent = '×'
    close.append(cross)
    const body = document.createElement('div')
    body.className = 'story-cinema-body'
    heading.append(title, person, close)
    dialog.append(heading, body)
    dialog.setAttribute('aria-labelledby', title.id)
    document.body.append(dialog)

    const cinema: StoryCinema = { dialog, body, details, summary, content, player, shown: false }
    cinemas.push(cinema)
    const attributes = ['aria-haspopup', 'aria-controls'].map((name) => ({ name, value: summary.getAttribute(name) }))
    summary.setAttribute('aria-haspopup', 'dialog')
    summary.setAttribute('aria-controls', dialog.id)
    restoreAttributes.push(() => attributes.forEach(({ name, value }) => {
      if (value === null) summary.removeAttribute(name)
      else summary.setAttribute(name, value)
    }))
    summary.addEventListener('click', (event) => {
      event.preventDefault()
      if (active) {
        const previous = active
        if (previous.dialog.open) previous.dialog.close()
        restore(previous, false)
      }
      details.open = false
      observer.unobserve(player)
      body.append(content)
      cinema.shown = true
      cinema.unlock = lockStoryScroll()
      active = cinema
      try {
        dialog.showModal()
        close.focus({ preventScroll: true })
      } catch {
        restore(cinema, false)
        details.open = true
      }
    }, { signal })
    close.addEventListener('click', () => dialog.close(), { signal })
    dialog.addEventListener('close', () => { if (!dialog.open) restore(cinema, true) }, { signal })
    dialog.addEventListener('click', readingAction, { signal })
    const outside = (event: MouseEvent) => {
      const rect = dialog.getBoundingClientRect()
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
    }
    let backdropPress = false
    dialog.addEventListener('pointerdown', (event) => { backdropPress = event.target === dialog && outside(event) }, { signal })
    dialog.addEventListener('click', (event) => {
      if (backdropPress && event.target === dialog && outside(event)) dialog.close()
      backdropPress = false
    }, { signal })
  })

  players.forEach((player) => {
    const frame = player.closest<HTMLElement>('.story-film-player')
    const status = frame?.querySelector<HTMLElement>('[role=status]')
    const next = frame?.querySelector<HTMLButtonElement>('.story-film-continue')
    if (!status || !next) return
    const state = (text: string) => { status.textContent = text }
    const label = (text: string) => {
      const value = next.querySelector<HTMLElement>('[data-story-continue-label]')
      if (value) value.textContent = text
    }
    player.addEventListener('play', () => {
      next.dataset.ended = 'false'
      label('Read in words')
      document.querySelectorAll('video').forEach((other) => { if (other !== player) other.pause() })
    }, { signal })
    player.addEventListener('playing', () => state('Now playing'), { signal })
    player.addEventListener('waiting', () => state('Loading your story…'), { signal })
    player.addEventListener('pause', () => { if (player.paused && !player.ended) state('Paused · Resume anytime') }, { signal })
    player.addEventListener('ended', () => {
      state('Story finished')
      next.dataset.ended = 'true'
      label('Continue in words')
    }, { signal })
    player.addEventListener('error', () => state('Video unavailable · Read the transcript below'), { signal })
  })
  const pause = () => players.forEach((player) => player.pause())
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause() }, { signal })
  window.addEventListener('pagehide', pause, { signal })
  section.dataset.storyControlsReady = 'true'
  return () => {
    controller.abort()
    cinemas.forEach((cinema) => {
      if (cinema.dialog.open) cinema.dialog.close()
      restore(cinema, false)
      cinema.dialog.remove()
    })
    restoreAttributes.forEach((restoreAttribute) => restoreAttribute())
    observer.disconnect()
    pause()
    delete section.dataset.storyControlsReady
  }
}
