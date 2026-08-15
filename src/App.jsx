import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import SmoothScroll from './components/SmoothScroll'
import ParticlesBg from './components/ParticlesBg'
import { playCurtain } from './anim/curtain'
import LoopedPanels from './components/LoopedPanels'

function SplitText({ text, className }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wordIndex) => (
        <React.Fragment key={wordIndex}>
          <span style={{ display: 'inline-block' }}>
            {Array.from(word).map((char, charIndex) => (
              <span
                key={charIndex}
                className="split-char inline-block"
                style={{ opacity: 0, display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </React.Fragment>
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
          duration: 0.55,
          ease: 'power4.out',
          stagger: 0.025,
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
          duration: 0.55,
          ease: 'back.out(1.7)',
          stagger: 0.03,
          delay: 0.08,
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
          duration: 0.55,
          ease: 'power4.out',
          stagger: 0.025,
          delay: 0.11,
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
          duration: 0.55,
          ease: 'back.out(1.7)',
          stagger: 0.018,
          delay: 0.16,
        }
      )
    }

    if (promptRef.current) {
      gsap.to(promptRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: 3.6,
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
    playCurtain({ selector: '.curtain', panels: curtainPanels, duration: 2.4, stagger: 0.05, onComplete: () => setCurtainPlayed(true) })
  }, [curtainPanels])

  return (
    <>
      {/* curtain overlay — removed from DOM after animation */}
      <div className="curtain" aria-hidden>
        {Array.from({ length: curtainPanels }).map((_, i) => (
          <div key={i} className="curtain__panel" />
        ))}
        <div className="curtain__message great-vibes-regular">One Little Heart.<br /> One Big Surprise.<br /> One Unforgettable Journey.❤️</div>
      </div>
      {revealed && <Confetti color={result === 'girl' ? '#ff7ab6' : '#5abcee'} count={160} />}
      <ParticlesBg />
      <SmoothScroll>
        <div className="w-full">
          {/* Render only the first landing section */}
          <section className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-transparent text-neutral-800`}>
            <div className="relative z-10 max-w-5xl text-center px-4 sm:px-6" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.06))' }}>
              <div ref={titleRef} className="mt-10 great-vibes-regular text-red-600 mb-4 text-2xl sm:text-3xl">
                <SplitText text={SECTIONS[0].title} />
              </div>
              {/* <div ref={subtitleRef} className="yesteryear-regular uppercase tracking-[0.35em] text-pink-600 mb-6">
                <SplitText text={SECTIONS[0].subtitle} />
              </div> */}
              <h1 ref={heroTitleRef} className="text-5xl sm:text-6xl font-extrabold leading-snug sm:leading-tight">
                <SplitText className="italianno-regular" text="A Tiny Secret..." />
                <br />
                <SplitText className="italianno-regular" text="is finally ready to be shared." />
              </h1>
              <div ref={heroTextRef} className="mt-8 space-y-6 text-center text-2xl sm:text-2xl leading-relaxed opacity-90 max-w-3xl mx-auto yesteryear-regular">
                <p><SplitText className="italianno-regular text-4xl sm:text-3xl leading-tight text-gray-700" text="Our family is growing..." /></p>
                <p><SplitText className="italianno-regular text-4xl sm:text-3xl leading-tight text-gray-700" text="and we've been keeping one very exciting secret." /></p>
                <p>
                  <SplitText className="italianno-regular text-4xl sm:text-3xl leading-tight text-gray-700" text="Before we reveal whether Baby Gangarajula is a" />
                  <br />
                  <SplitText className="italianno-regular text-4xl sm:text-3xl leading-tight text-gray-700" text="Baby Boy or Baby Girl..." />
                </p>
                <p>
                  <SplitText className="italianno-regular text-4xl sm:text-3xl leading-tight text-gray-700" text="we'd love for" />{' '}
                  <SplitText className="italianno-regular text-4xl sm:text-3xl leading-tight text-gray-700" text="YOU" />{' '}
                  <SplitText className="italianno-regular text-4xl sm:text-3xl leading-tight text-gray-700" text="to join the fun!" />
                </p>
              </div>
              <div ref={promptRef} className="mt-10 flex flex-col items-center gap-6 opacity-0">
                <span className="font-bold italianno-regular uppercase tracking-[0.35em] text-3xl text-red-600">Scroll to continue</span>
                <svg className="h-8 w-8 text-red-600 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </section>

          <LoopedPanels onReveal={doReveal} revealed={revealed} result={result} />
        </div>
      </SmoothScroll>
    </>
  )
}
