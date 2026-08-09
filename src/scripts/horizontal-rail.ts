const railSelector = '[data-horizontal-rail]'

function initializeRail(root: HTMLElement): void {
  if (root.dataset.railInitialized === 'true') return

  const viewport = root.querySelector<HTMLElement>('[data-rail-viewport]')
  const track = root.querySelector<HTMLElement>('[data-rail-track]')
  const controls = root.querySelector<HTMLElement>('[data-rail-controls]')
  const previousButton = root.querySelector<HTMLButtonElement>(
    '[data-rail-previous]',
  )
  const nextButton = root.querySelector<HTMLButtonElement>('[data-rail-next]')

  if (!viewport || !track) return

  root.dataset.railInitialized = 'true'
  const abortController = new AbortController()
  const { signal } = abortController
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let animationFrame = 0

  const updateControls = (): void => {
    const maximumScroll = Math.max(
      0,
      viewport.scrollWidth - viewport.clientWidth,
    )
    const hasOverflow = maximumScroll > 2
    root.dataset.overflow = String(hasOverflow)

    if (controls) controls.hidden = !hasOverflow
    if (previousButton) previousButton.disabled = viewport.scrollLeft <= 2
    if (nextButton) {
      nextButton.disabled = viewport.scrollLeft >= maximumScroll - 2
    }
  }

  const scheduleUpdate = (): void => {
    if (animationFrame) return
    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = 0
      updateControls()
    })
  }

  const getScrollStep = (): number => {
    const firstItem = track.firstElementChild
    if (!(firstItem instanceof HTMLElement)) return viewport.clientWidth * 0.8

    const trackStyles = window.getComputedStyle(track)
    const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap) || 0
    return firstItem.getBoundingClientRect().width + gap
  }

  const scrollByCard = (direction: -1 | 1): void => {
    viewport.scrollBy({
      left: getScrollStep() * direction,
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    })
  }

  previousButton?.addEventListener('click', () => scrollByCard(-1), { signal })
  nextButton?.addEventListener('click', () => scrollByCard(1), { signal })
  viewport.addEventListener('scroll', scheduleUpdate, {
    passive: true,
    signal,
  })

  const resizeObserver = new ResizeObserver(scheduleUpdate)
  resizeObserver.observe(viewport)
  resizeObserver.observe(track)

  document.addEventListener(
    'astro:before-swap',
    () => {
      abortController.abort()
      resizeObserver.disconnect()
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      delete root.dataset.railInitialized
    },
    { once: true, signal },
  )

  updateControls()
}

function initializeRails(): void {
  document.querySelectorAll<HTMLElement>(railSelector).forEach(initializeRail)
}

initializeRails()
document.addEventListener('astro:page-load', initializeRails)
