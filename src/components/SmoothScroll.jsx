import React, { useEffect, useRef } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'
import { initGSAP, killGSAP } from '../anim/gsapSetup'

export default function SmoothScroll({ children }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const scroller = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      // slightly faster, more natural scroll speed
      multiplier: 0.88,
      // enable smooth on mobile/tablet for consistent feel
      smartphone: { smooth: true, multiplier: 0.75 },
      tablet: { smooth: true, multiplier: 0.8 },
      class: 'is-reveal',
    })

    // no decorative icon scroll handling (icons removed)
    // initialize GSAP ScrollTrigger integration
    initGSAP(scroller)

    return () => {
      killGSAP(scroller)
      scroller.destroy()
    }
  }, [])

  return (
    <div data-scroll-container ref={containerRef}>
      {children}
    </div>
  )
}
