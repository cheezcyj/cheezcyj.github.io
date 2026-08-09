const spotlight = document.querySelector<HTMLElement>('[data-cursor-spotlight]')
const finePointer = window.matchMedia('(pointer: fine)')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

if (spotlight && finePointer.matches && !reducedMotion.matches) {
  let frame = 0
  let x = window.innerWidth / 2
  let y = 0

  const paint = () => {
    spotlight.style.setProperty('--spotlight-x', `${x}px`)
    spotlight.style.setProperty('--spotlight-y', `${y}px`)
    spotlight.dataset.enabled = 'true'
    frame = 0
  }

  window.addEventListener(
    'pointermove',
    (event) => {
      x = event.clientX
      y = event.clientY
      if (frame === 0) frame = window.requestAnimationFrame(paint)
    },
    { passive: true },
  )

  document.addEventListener('pointerover', (event) => {
    const target = event.target
    spotlight.dataset.interactive =
      target instanceof Element && target.closest('a, button')
        ? 'true'
        : 'false'
  })

  document.addEventListener('pointerout', (event) => {
    const nextTarget = event.relatedTarget
    if (!(nextTarget instanceof Element) || !nextTarget.closest('a, button')) {
      spotlight.dataset.interactive = 'false'
    }
  })
}
