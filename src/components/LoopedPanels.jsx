import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)
import {
  subscribeToVotes,
  castVote,
  submitPrediction,
  subscribeToMessages,
  addMessage,
} from '../lib/firestoreApi'
import JourneyPanel from './panels/JourneyPanel'
import PredictionPanel from './panels/PredictionPanel'
import VotePanel from './panels/VotePanel'
import MessageWallPanel from './panels/MessageWallPanel'
import FinalRevealPanel from './panels/FinalRevealPanel'

const questions = [
  {
    key: 'firstWord',
    prompt: "What do you think Baby's first word will be?",
    options: ['Mama', 'Dada', 'Food 😂', 'Doggy'],
  },
  {
    key: 'lookLike',
    prompt: 'Who will Baby look like?',
    options: ['Mom', 'Dad', 'Perfect Mix'],
  },
  {
    key: 'spoil',
    prompt: 'Which parent will spoil Baby more?',
    options: ['Mom', 'Dad', 'Grandparents 😂'],
  },
  {
    key: 'owl',
    prompt: 'Night Owl or Early Bird?',
    options: ['Sleeps all day', 'Awake all night', 'Tiny Boss 😆'],
  },
  {
    key: 'closest',
    prompt: 'Who will Baby be closest to?',
    options: ['Mom', 'Dad', 'Grandparents', 'Everyone ❤️'],
  },
]

export default function LoopedPanels({ onReveal, revealed, result }) {
  const [selectedVote, setSelectedVote] = useState(() =>
    typeof window === 'undefined' ? null : window.localStorage.getItem('gr-voted-team')
  )
  const [voteCounts, setVoteCounts] = useState({ boy: 0, girl: 0 })
  const [voteToast, setVoteToast] = useState(false)
  const [answers, setAnswers] = useState({
    firstWord: '',
    lookLike: '',
    spoil: '',
    owl: '',
    closest: '',
  })
  const [cards, setCards] = useState([])
  const [guestName, setGuestName] = useState('')
  const [guestMessage, setGuestMessage] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isCounting, setIsCounting] = useState(false)
  const [lastSubmittedId, setLastSubmittedId] = useState(null)
  const lastSubmittedTimeoutRef = useRef(null)
  const [displayedCards, setDisplayedCards] = useState([])

  const journeyRef = useRef(null)
  const panelsRef = useRef(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [predictionSubmitted, setPredictionSubmitted] = useState(false)

  const allAnswered = Object.values(answers).every(Boolean)
  const isLastQuestion = currentQuestion === questions.length - 1

  useEffect(() => {
    const unsubscribeVotes = subscribeToVotes(setVoteCounts)
    const unsubscribeMessages = subscribeToMessages(setCards)
    return () => {
      unsubscribeVotes()
      unsubscribeMessages()
    }
  }, [])

  const showPrevious = () => {
    setCurrentQuestion((value) => Math.max(0, value - 1))
  }

  const showNext = () => {
    setCurrentQuestion((value) => Math.min(questions.length - 1, value + 1))
  }

  const submitPredictions = () => {
    if (predictionSubmitted || !isLastQuestion || !allAnswered) return
    setPredictionSubmitted(true)
    submitPrediction(answers).catch((err) => console.error('Failed to submit prediction', err))
  }

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
    const badge = journey.querySelector('.journey-badge')
    const glow = journey.querySelector('.journey-glow')

    const split = new SplitText(lineEls, { type: 'lines', mask: 'lines' })

    gsap.set(journey, { opacity: 0, y: 14 })
    gsap.set(lineEls, { opacity: 1, y: 0 })
    gsap.set(split.lines, { yPercent: 100, opacity: 0 })
    gsap.set(badge, { scale: 0.8, opacity: 0 })

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
        .to(badge, { scale: 1, opacity: 1, duration: 0.8 }, 0.28)
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

  const handleVote = (team) => {
    if (selectedVote) return
    setSelectedVote(team)
    castVote(team)
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

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
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

  const startReveal = () => {
    if (revealed || isCounting) return
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
  const lavenderGradient = 'linear-gradient(135deg, #EDE5FF 0%, #FFFFFF 100%)'
  const blueGradient = 'linear-gradient(135deg, #cee4f7 0%, #FFFFFF 100%)'
  const themeGradient = 'linear-gradient(180deg, var(--bg-start), var(--bg-mid))'

  const panels = [
    {
      title: 'Our Journey ❤️',
      content: <JourneyPanel journeyRef={journeyRef} />,
    },
    {
      title: 'Fun Prediction Game',
      content: (
        <PredictionPanel
          questions={questions}
          currentQuestion={currentQuestion}
          showPrevious={showPrevious}
          showNext={showNext}
          handleAnswer={handleAnswer}
          answers={answers}
          submitPredictions={submitPredictions}
          isLastQuestion={isLastQuestion}
          allAnswered={allAnswered}
          predictionSubmitted={predictionSubmitted}
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
        />
      ),
    },
    {
      title: 'Message Wall ❤️',
      content: (
        <MessageWallPanel
          guestName={guestName}
          setGuestName={setGuestName}
          guestMessage={guestMessage}
          setGuestMessage={setGuestMessage}
          addCard={addCard}
          displayedCards={displayedCards}
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
        />
      ),
    },
  ]

  return (
    <section ref={panelsRef} className="loop-section w-full relative bg-transparent text-neutral-900">
      {panels.map((panel, i) => {
        const isThemePanel = i % 2 === 1
        const background = panel.background || (isThemePanel ? themeGradient : lavenderGradient)

        return (
          <div key={i} className="panel" style={{ background }}>
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
