import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)
import {
  subscribeToVotes,
  castVote,
  subscribeToMessages,
  addMessage,
  recordRevealTrigger,
} from '../lib/firestoreApi'
import JourneyPanel from './panels/JourneyPanel'
import VotePanel from './panels/VotePanel'
import MessageWallPanel from './panels/MessageWallPanel'
import FinalRevealPanel from './panels/FinalRevealPanel'

export default function LoopedPanels({ onReveal, revealed, result }) {
  const [selectedVote, setSelectedVote] = useState(() =>
    typeof window === 'undefined' ? null : window.localStorage.getItem('gr-voted-team')
  )
  const [voteCounts, setVoteCounts] = useState({ boy: 0, girl: 0 })
  const [voteToast, setVoteToast] = useState(false)
  const [cards, setCards] = useState([])
  const [guestName, setGuestName] = useState('')
  const [confirmedName, setConfirmedName] = useState('')
  const [guestMessage, setGuestMessage] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isCounting, setIsCounting] = useState(false)
  const [lastSubmittedId, setLastSubmittedId] = useState(null)
  const lastSubmittedTimeoutRef = useRef(null)
  const [displayedCards, setDisplayedCards] = useState([])

  const journeyRef = useRef(null)
  const panelsRef = useRef(null)

  useEffect(() => {
    const unsubscribeVotes = subscribeToVotes(setVoteCounts)
    const unsubscribeMessages = subscribeToMessages(setCards)
    return () => {
      unsubscribeVotes()
      unsubscribeMessages()
    }
  }, [])

  useEffect(() => {
    if (!isCounting) return

    if (countdown <= 0) {
      setIsCounting(false)
      onReveal()
      return
    }

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [countdown, isCounting, onReveal])

  useLayoutEffect(() => {
    const journey = journeyRef.current
    if (!journey) return

    const lineEls = journey.querySelectorAll('.journey-line')
    const glow = journey.querySelector('.journey-glow')

    const split = new SplitText(lineEls, { type: 'lines', mask: 'lines' })

    gsap.set(journey, { opacity: 0, y: 14 })
    gsap.set(lineEls, { opacity: 1, y: 0 })
    gsap.set(split.lines, { yPercent: 100, opacity: 0 })

    // Defer until after SmoothScroll registers its ScrollTrigger/locomotive-scroll
    // proxy (in a parent effect), so `scroller` below resolves correctly.
    let tl
    const setupTimeout = window.setTimeout(() => {
      const scroller = document.querySelector('[data-scroll-container]')
      tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: journey,
          scroller,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      tl.to(journey, { opacity: 1, y: 0, duration: 0.9 })
        .to(split.lines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06 }, 0.15)
    }, 0)

    if (glow) {
      gsap.to(glow, {
        x: -18,
        y: 16,
        duration: 7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }

    return () => {
      window.clearTimeout(setupTimeout)
      tl?.scrollTrigger?.kill()
      tl?.kill()
      split.revert()
    }
  }, [])

  useEffect(() => {
    let pageScrollTrigger
    const triggers = []
    let setupTimeout = null

    const setupLoop = () => {
      const container = panelsRef.current
      const scroller = document.querySelector('[data-scroll-container]')
      if (!container || !scroller) return

      ScrollTrigger.defaults({ scroller })

      const panels = Array.from(container.querySelectorAll('.panel'))
      if (!panels.length) return

      panels.forEach((panel) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: panel,
            start: 'top top',
            pin: true,
            pinSpacing: false,
          })
        )
      })

      ScrollTrigger.refresh()

      pageScrollTrigger = ScrollTrigger.create({
        snap: 1 / panels.length,
      })
    }

    setupTimeout = window.setTimeout(setupLoop, 0)

    return () => {
      window.clearTimeout(setupTimeout)
      triggers.forEach((trigger) => trigger.kill())
      pageScrollTrigger?.kill()
    }
  }, [])

  // Center panel content when it fits; top-align it when it's taller than
  // the panel, so overflow only ever spills downward (into the next,
  // higher-stacked panel) instead of bleeding onto the previous one.
  useEffect(() => {
    const measureOverflow = () => {
      const container = panelsRef.current
      if (!container) return
      container.querySelectorAll('.panel-inner').forEach((inner) => {
        const content = inner.firstElementChild
        if (!content) return
        inner.classList.toggle('content-overflow', content.scrollHeight > window.innerHeight)
      })
    }

    measureOverflow()
    const raf = requestAnimationFrame(measureOverflow)
    window.addEventListener('resize', measureOverflow)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measureOverflow)
    }
  }, [displayedCards])

  const handleVote = (team) => {
    if (selectedVote) return
    setSelectedVote(team)
    castVote(confirmedName, team)
      .then(() => {
        window.localStorage.setItem('gr-voted-team', team)
        setVoteToast(true)
        window.setTimeout(() => setVoteToast(false), 1800)
      })
      .catch((err) => {
        console.error('Failed to cast vote', err)
        setSelectedVote(null)
      })
  }

  const switchGuestVote = () => {
    window.localStorage.removeItem('gr-voted-team')
    setSelectedVote(null)
    setConfirmedName('')
    setGuestName('')
  }

  const updateGuestName = (value) => {
    setGuestName(value)
    if (value.trim()) setConfirmedName(value.trim())
  }

  const addCard = async () => {
    if (!guestName.trim() || !guestMessage.trim()) return
    const name = guestName.trim()
    const message = guestMessage.trim()
    setGuestName('')
    setGuestMessage('')
    try {
      const ref = await addMessage(name, message)
      setLastSubmittedId(ref.id)
      if (lastSubmittedTimeoutRef.current) window.clearTimeout(lastSubmittedTimeoutRef.current)
      lastSubmittedTimeoutRef.current = window.setTimeout(() => {
        setLastSubmittedId(null)
        lastSubmittedTimeoutRef.current = null
      }, 5000)
    } catch (err) {
      console.error('Failed to submit message', err)
    }
  }

  const startReveal = (name) => {
    if (revealed || isCounting) return
    const revealerName = (name || confirmedName || '').trim() || 'Anonymous'
    if (!confirmedName && name?.trim()) setConfirmedName(name.trim())
    recordRevealTrigger(revealerName).catch((err) => console.error('Failed to record reveal trigger', err))
    setCountdown(3)
    setIsCounting(true)
  }

  useEffect(() => {
    const getCountForWidth = () => {
      const w = window.innerWidth
      if (w < 768) return 2
      if (w < 1024) return 3
      return 4
    }

    const pickDisplayed = () => {
      const count = getCountForWidth()
      if (!cards || cards.length === 0) {
        setDisplayedCards([])
        return
      }

      const submitted = lastSubmittedId ? cards.find((c) => c.id === lastSubmittedId) : null
      const pool = cards.filter((c) => !submitted || c.id !== submitted.id)

      // shuffle pool
      const shuffled = [...pool].sort(() => Math.random() - 0.5)

      const selection = submitted ? [submitted, ...shuffled.slice(0, Math.max(0, count - 1))] : shuffled.slice(0, count)
      setDisplayedCards(selection)
    }

    pickDisplayed()
    let resizeTimer = null
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(pickDisplayed, 120)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimer)
    }
  }, [cards, lastSubmittedId])

  const totalVotes = voteCounts.boy + voteCounts.girl
  const boyPct = totalVotes ? Math.round((voteCounts.boy / totalVotes) * 100) : 50
  const girlPct = 100 - boyPct
  const creamGradient = 'linear-gradient(135deg, #F0E9DC 0%, #FFFFFF 100%)'
  const themeGradient = 'linear-gradient(180deg, var(--bg-start), var(--bg-mid))'

  const panels = [
    {
      title: 'Our Journey ❤️',
      content: <JourneyPanel journeyRef={journeyRef} />,
    },
    {
      title: 'Message Wall ❤️',
      content: (
        <MessageWallPanel
          guestName={guestName}
          setGuestName={updateGuestName}
          guestMessage={guestMessage}
          setGuestMessage={setGuestMessage}
          addCard={addCard}
          displayedCards={displayedCards}
        />
      ),
    },
    {
      title: 'Guess the Baby!',
      content: (
        <VotePanel
          selectedVote={selectedVote}
          handleVote={handleVote}
          voteToast={voteToast}
          totalVotes={totalVotes}
          voteCounts={voteCounts}
          boyPct={boyPct}
          girlPct={girlPct}
          onSwitchGuest={switchGuestVote}
        />
      ),
    },
    {
      title: 'Final Reveal',
      content: (
        <FinalRevealPanel
          revealed={revealed}
          isCounting={isCounting}
          countdown={countdown}
          startReveal={startReveal}
          result={result}
          confirmedName={confirmedName}
        />
      ),
    },
  ]

  return (
    <section ref={panelsRef} className="loop-section w-full relative bg-transparent text-neutral-900">
      {panels.map((panel, i) => {
        const isThemePanel = i % 2 === 1
        const background = panel.background || (isThemePanel ? themeGradient : creamGradient)

        return (
          <div key={i} className="panel" style={{ background, zIndex: i + 1 }}>
            <div className="panel-inner nunito-700 text-center px-0 flex flex-col items-center justify-center h-full">
              <div className="w-full">
                <h3 className={`yesteryear-regular text-gray-700 text-4xl sm:text-5xl font-extrabold mb-4 leading-tight`}>{panel.title}</h3>
                <div className="mb-6 text-xl sm:text-2xl opacity-90">{panel.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
