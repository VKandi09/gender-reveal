import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import SmoothScroll from './components/SmoothScroll'
import ParticlesBg from './components/ParticlesBg'
import LottiePlayer from './components/LottiePlayer'
import { playCurtain } from './anim/curtain'
import LoopedPanels from './components/LoopedPanels'

function SplitText({ text, className }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="split-char inline-block"
          style={{ opacity: 0, display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

function Confetti({ color, count = 80 }) {
  const pieces = Array.from({ length: count })
  return (
    <div className="confetti fixed inset-0 pointer-events-none">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          className="confetti-piece"
          style={{ background: color }}
          initial={{ y: -20, opacity: 0, rotate: 0, x: 0 }}
          animate={{ y: 900, opacity: [1, 1, 0], rotate: Math.random() * 720 - 360, x: (Math.random() - 0.5) * 1200 }}
          transition={{ duration: 1.6 + Math.random(), ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

const SECTIONS = [
  { title: "Uday & Varsha with Baby Gangarajula", subtitle: "" }
]

export default function App() {
  // Always start unrevealed on page load and do not persist result.
  const [revealed, setRevealed] = useState(false)
  const [result, setResult] = useState('boy') // always show "It's A Boy"
  const [curtainPlayed, setCurtainPlayed] = useState(false)
  const [curtainPanels, setCurtainPanels] = useState(() => {
    if (typeof window === 'undefined') return 6
    return window.matchMedia('(max-width: 768px)').matches ? 3 : 6
  })
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroTextRef = useRef(null)
  const promptRef = useRef(null)

  useLayoutEffect(() => {
    const titleChars = titleRef.current?.querySelectorAll('.split-char')
    const subtitleChars = subtitleRef.current?.querySelectorAll('.split-char')
    const heroTitleChars = heroTitleRef.current?.querySelectorAll('.split-char')
    const heroTextChars = heroTextRef.current?.querySelectorAll('.split-char')
    const promptEl = promptRef.current

    if (titleChars?.length) {
      gsap.set(titleChars, { opacity: 0, x: 150 })
    }
    if (subtitleChars?.length) {
      gsap.set(subtitleChars, { opacity: 0, y: -100 })
    }
    if (heroTitleChars?.length) {
      gsap.set(heroTitleChars, { opacity: 0, x: 150 })
    }
    if (heroTextChars?.length) {
      gsap.set(heroTextChars, { opacity: 0, y: -80 })
    }
    if (promptEl) {
      gsap.set(promptEl, { opacity: 0 })
    }
  }, [])

  useEffect(() => {
    if (!curtainPlayed) return
    const titleChars = titleRef.current?.querySelectorAll('.split-char')
    const subtitleChars = subtitleRef.current?.querySelectorAll('.split-char')
    const heroTitleChars = heroTitleRef.current?.querySelectorAll('.split-char')
    const heroTextChars = heroTextRef.current?.querySelectorAll('.split-char')

    if (titleChars?.length) {
      gsap.fromTo(
        titleChars,
        { x: 150, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power4.out',
          stagger: 0.04,
        }
      )
    }

    if (subtitleChars?.length) {
      gsap.fromTo(
        subtitleChars,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.7)',
          stagger: 0.05,
          delay: 0.12,
        }
      )
    }

    if (heroTitleChars?.length) {
      gsap.fromTo(
        heroTitleChars,
        { x: 150, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power4.out',
          stagger: 0.04,
          delay: 0.18,
        }
      )
    }

    if (heroTextChars?.length) {
      gsap.fromTo(
        heroTextChars,
        { y: -80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.7)',
          stagger: 0.03,
          delay: 0.26,
        }
      )
    }

    if (promptRef.current) {
      gsap.to(promptRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: 6.9,
      })
    }
  }, [curtainPlayed])

  function doReveal() {
    setResult('boy')
    setRevealed(true)
  }

  // No localStorage persistence: do nothing here.

  useEffect(() => {
    // play curtain once on initial load with responsive panel count
    playCurtain({ selector: '.curtain', panels: curtainPanels, duration: 4.2, stagger: 0.08, onComplete: () => setCurtainPlayed(true) })
  }, [curtainPanels])

  return (
    <>
      {/* curtain overlay — removed from DOM after animation */}
      <div className="curtain" aria-hidden>
        {Array.from({ length: curtainPanels }).map((_, i) => (
          <div key={i} className="curtain__panel" />
        ))}
        <div className="curtain__message">One Little Heart.<br /> One Big Surprise.<br /> One Unforgettable Journey.❤️</div>
      </div>
      {revealed && <Confetti color={result === 'girl' ? '#ff7ab6' : '#5abcee'} count={160} />}
      <SmoothScroll>
        <ParticlesBg />
        <div className="w-full">
          {/* Render only the first landing section */}
          <section className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-transparent text-neutral-800`}>
            <div className="relative z-10 max-w-5xl text-center px-4 sm:px-6" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.06))' }}>
              <div ref={titleRef} className="mt-10 titan-one-regular uppercase tracking-[0.35em] text-pink-600 mb-6">
                <SplitText text={SECTIONS[0].title} />
              </div>
              <div ref={subtitleRef} className="titan-one-regular uppercase tracking-[0.35em] text-pink-600 mb-6">
                <SplitText text={SECTIONS[0].subtitle} />
              </div>
              <h1 ref={heroTitleRef} className="text-5xl sm:text-6xl font-extrabold leading-snug sm:leading-tight">
                <SplitText className="titan-one-regular" text="A Tiny Secret..." />
                <br />
                <SplitText className="titan-one-regular" text="is finally ready to be shared." />
              </h1>
              <div ref={heroTextRef} className="mt-8 space-y-6 text-center text-base sm:text-lg leading-relaxed opacity-90 max-w-3xl mx-auto titan-one-regular">
                <p><SplitText className="titan-one-regular" text="Our family is growing..." /></p>
                <p><SplitText className="titan-one-regular" text="and we've been keeping one very exciting secret." /></p>
                <p>
                  <SplitText className="titan-one-regular" text="Before we reveal whether Baby Gangarajula is a" />
                  <br />
                  <SplitText className="titan-one-regular" text="Baby Boy or Baby Girl..." />
                </p>
                <p><SplitText className="titan-one-regular" text="we'd love for YOU to join the fun!" /></p>
              </div>
              <div ref={promptRef} className="mt-10 flex flex-col items-center gap-6 opacity-0">
                <span className="font-semibold uppercase tracking-[0.35em] text-sm text-neutral-900/90">Scroll to continue</span>
                <svg className="h-8 w-8 text-neutral-900/90 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </div>
              <div className="mt-12 mx-auto w-40 h-40 sm:w-52 sm:h-52">
                <LottiePlayer src="https://assets4.lottiefiles.com/packages/lf20_7p5s3gk8.json" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          </section>

          <LoopedPanels onReveal={doReveal} revealed={revealed} result={result} />
        </div>
      </SmoothScroll>
    </>
  )
}
