import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initGSAP(scroller) {
  gsap.registerPlugin(ScrollTrigger)

  // connect GSAP ScrollTrigger to locomotive-scroll
  ScrollTrigger.scrollerProxy(scroller.el, {
    scrollTop(value) {
      if (arguments.length) {
        scroller.scrollTo(value, { duration: 0, disableLerp: true })
      }
      return scroller.scroll.instance.scroll.y
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
    },
    pinType: scroller.el.style.transform ? 'transform' : 'fixed',
  })

  ScrollTrigger.defaults({ scroller: scroller.el })

  // simple scroll animations for elements with `data-animate`
  gsap.utils.toArray('[data-animate]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  })

  // update ScrollTrigger on locomotive scroll
  scroller.on('scroll', ScrollTrigger.update)
  ScrollTrigger.addEventListener('refresh', () => scroller.update())
  ScrollTrigger.refresh()
}

export function killGSAP(scroller) {
  try {
    ScrollTrigger.removeEventListener('refresh', () => scroller.update())
    scroller.off && scroller.off('scroll', ScrollTrigger.update)
  } catch (e) {
    // ignore
  }
}
