const header = document.querySelector<HTMLElement>('[data-site-header]')
const menu = document.querySelector<HTMLElement>('[data-mobile-menu]')
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]')
const closeButton =
  document.querySelector<HTMLButtonElement>('[data-menu-close]')
const smoothAnchorLinks = document.querySelectorAll<HTMLAnchorElement>(
  '[data-smooth-anchor][href^="#"]',
)
const root = document.documentElement
let smoothScrollFrame = 0
let previousRootScrollBehavior: string | null = null
const headerSectionLinks = Array.from(
  document.querySelectorAll<HTMLAnchorElement>(
    '[data-site-header] [data-smooth-anchor], [data-mobile-menu] [data-smooth-anchor]',
  ),
)
const sectionTargets = Array.from(
  new Set(headerSectionLinks.map((link) => link.hash.slice(1))),
)
  .map((id) => document.getElementById(id))
  .filter((target): target is HTMLElement => target instanceof HTMLElement)
let activeSectionFrame = 0
let activeSectionId = ''
let previousScrollY = window.scrollY

const updateActiveSection = () => {
  activeSectionFrame = 0
  const currentScrollY = window.scrollY
  const headerHeight = header?.getBoundingClientRect().height ?? 0
  const marker = headerHeight + Math.min(window.innerHeight * 0.25, 180)
  let nextActiveSectionId = ''

  sectionTargets.forEach((target) => {
    if (target.getBoundingClientRect().top <= marker) {
      nextActiveSectionId = target.id
    }
  })

  const aboutTarget = sectionTargets.find((target) => target.id === 'about')
  const isAtPageBottom =
    currentScrollY + window.innerHeight >= root.scrollHeight - 2
  const aboutRetentionMarker =
    headerHeight + Math.min(window.innerHeight * 0.45, 360)

  if (isAtPageBottom && aboutTarget) {
    nextActiveSectionId = 'about'
  }

  if (
    currentScrollY < previousScrollY &&
    activeSectionId === 'about' &&
    aboutTarget &&
    aboutTarget.getBoundingClientRect().top <= aboutRetentionMarker
  ) {
    nextActiveSectionId = 'about'
  }

  previousScrollY = currentScrollY
  activeSectionId = nextActiveSectionId

  headerSectionLinks.forEach((link) => {
    if (activeSectionId && link.hash === `#${activeSectionId}`) {
      link.setAttribute('aria-current', 'location')
    } else if (link.getAttribute('aria-current') === 'location') {
      link.removeAttribute('aria-current')
    }
  })
}

const scheduleActiveSectionUpdate = () => {
  if (activeSectionFrame) return
  activeSectionFrame = window.requestAnimationFrame(updateActiveSection)
}

if (headerSectionLinks.length > 0) {
  window.addEventListener('scroll', scheduleActiveSectionUpdate, {
    passive: true,
  })
  window.addEventListener('resize', scheduleActiveSectionUpdate)
  scheduleActiveSectionUpdate()
}

const stopSmoothScroll = () => {
  if (smoothScrollFrame) window.cancelAnimationFrame(smoothScrollFrame)
  smoothScrollFrame = 0

  if (previousRootScrollBehavior !== null) {
    root.style.scrollBehavior = previousRootScrollBehavior
    previousRootScrollBehavior = null
  }
}

const scrollToAnchor = (target: HTMLElement, hash: string) => {
  stopSmoothScroll()

  const startY = window.scrollY
  const scrollMarginTop = Number.parseFloat(
    window.getComputedStyle(target).scrollMarginTop,
  )
  const maxY = Math.max(0, root.scrollHeight - window.innerHeight)
  const targetY = Math.min(
    maxY,
    Math.max(0, startY + target.getBoundingClientRect().top - scrollMarginTop),
  )
  const distance = targetY - startY
  const duration = Math.min(800, Math.max(500, Math.abs(distance) * 0.45))
  const startedAt = window.performance.now()

  previousRootScrollBehavior = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'

  const finish = () => {
    root.style.scrollBehavior = previousRootScrollBehavior ?? ''
    previousRootScrollBehavior = null
    smoothScrollFrame = 0

    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash)
    }
  }

  if (Math.abs(distance) < 1) {
    finish()
    return
  }

  const step = (currentTime: number) => {
    const progress = Math.min((currentTime - startedAt) / duration, 1)
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

    window.scrollTo(0, startY + distance * eased)

    if (progress < 1) {
      smoothScrollFrame = window.requestAnimationFrame(step)
    } else {
      finish()
    }
  }

  smoothScrollFrame = window.requestAnimationFrame(step)
}

smoothAnchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector<HTMLElement>(link.hash)

    if (!target) return

    event.preventDefault()
    scrollToAnchor(target, link.hash)
  })
})

if (header && menu && toggle && closeButton) {
  const mobileMenu = menu
  const menuToggle = toggle
  const menuCloseButton = closeButton
  const pageRegions = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-site-main], [data-site-footer]',
    ),
  )
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const desktop = window.matchMedia('(min-width: 48rem)')
  let isOpen = false
  let previousBodyOverflow = ''
  let hideTimer = 0

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  const getFocusable = () =>
    Array.from(
      mobileMenu.querySelectorAll<HTMLElement>(focusableSelector),
    ).filter(
      (element) =>
        !element.hasAttribute('hidden') &&
        element.getAttribute('aria-hidden') !== 'true',
    )

  const onKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) return

    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu(true)
      return
    }

    if (event.key !== 'Tab') return

    const focusable = getFocusable()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const openMenu = () => {
    if (isOpen) return
    isOpen = true
    window.clearTimeout(hideTimer)
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.dataset.menuOpen = 'true'
    pageRegions.forEach((region) => {
      region.inert = true
    })
    mobileMenu.hidden = false
    mobileMenu.setAttribute('aria-hidden', 'false')
    menuToggle.setAttribute('aria-expanded', 'true')
    menuToggle.setAttribute('aria-label', '메뉴 닫기')
    document.addEventListener('keydown', onKeyDown)

    requestAnimationFrame(() => {
      mobileMenu.classList.add('is-open')
      getFocusable()[0]?.focus()
    })
  }

  function closeMenu(restoreFocus: boolean) {
    if (!isOpen) return
    isOpen = false
    mobileMenu.classList.remove('is-open')
    mobileMenu.setAttribute('aria-hidden', 'true')
    menuToggle.setAttribute('aria-expanded', 'false')
    menuToggle.setAttribute('aria-label', '메뉴 열기')
    document.body.style.overflow = previousBodyOverflow
    delete document.body.dataset.menuOpen
    pageRegions.forEach((region) => {
      region.inert = false
    })
    document.removeEventListener('keydown', onKeyDown)

    const finishClose = () => {
      if (!isOpen) mobileMenu.hidden = true
    }

    if (reducedMotion.matches) {
      finishClose()
    } else {
      hideTimer = window.setTimeout(finishClose, 300)
    }

    if (restoreFocus) menuToggle.focus()
  }

  menuToggle.addEventListener('click', openMenu)
  menuCloseButton.addEventListener('click', () => closeMenu(true))
  mobileMenu
    .querySelectorAll<HTMLAnchorElement>('[data-menu-link]')
    .forEach((link) => {
      link.addEventListener('click', () => closeMenu(false))
    })
  desktop.addEventListener('change', (event) => {
    if (event.matches) closeMenu(false)
  })
}
