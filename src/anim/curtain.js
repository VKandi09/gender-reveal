import { gsap } from 'gsap'

export function playCurtain({ selector = '.curtain', panels = 8, duration = 1.1, stagger = 0.08, onComplete } = {}) {
  const root = document.querySelector(selector)
  if (!root) {
    onComplete && onComplete()
    return
  }

  const items = Array.from(root.querySelectorAll('.curtain__panel'))
  if (items.length === 0) {
    onComplete && onComplete()
    return
  }


  // tint panels alternating pink/blue for reveal theme with a richer gradient
  items.forEach((el, i) => {
    const pink = 'linear-gradient(180deg, #ff9dc1 0%, #ffd6e6 45%, #ffeaf4 100%)'
    const blue = 'linear-gradient(180deg, #8fb7ff 0%, #c7d8ff 45%, #e8efff 100%)'
    el.style.background = i % 2 === 0 ? pink : blue
    el.style.border = '1px solid rgba(255,255,255,0.24)'
    el.style.boxShadow = 'inset 0 0 120px rgba(255,255,255,0.18), 0 30px 80px rgba(15,23,42,0.12)'
    el.style.transformOrigin = i % 2 === 0 ? 'bottom center' : 'top center'
    el.style.transform = 'perspective(1200px) scaleY(1) rotateX(0deg)'
    el.style.backfaceVisibility = 'hidden'
  })

  const message = root.querySelector('.curtain__message')

  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })

  // Animate message with a subtle pop before the reveal
  if (message) {
    tl.fromTo(
      message,
      { autoAlpha: 0, y: 24, scale: 0.92 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }
    )
  }

  tl.to(
    items,
    {
      rotationX: (i) => (i % 2 === 0 ? -90 : 90),
      scaleY: 0,
      opacity: 0,
      duration: duration + 0.5,
      stagger: { each: stagger, from: 'center' },
    },
    '+=0.35'
  )

  // fade out container after panels animated
  tl.to(root, { autoAlpha: 0, duration: 0.5, ease: 'power1.out' }, '>-0.2')

  tl.call(() => {
    // remove from DOM so it doesn't block interactions
    root.remove()
    onComplete && onComplete()
  })

  return tl
}
