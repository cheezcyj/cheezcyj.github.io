const header = document.querySelector<HTMLElement>('[data-site-header]')
const menu = document.querySelector<HTMLElement>('[data-mobile-menu]')
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]')
const closeButton =
  document.querySelector<HTMLButtonElement>('[data-menu-close]')

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
