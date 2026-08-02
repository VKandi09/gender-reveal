import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  const [selectedVote, setSelectedVote] = useState(null)
  const [voteCounts, setVoteCounts] = useState({ boy: 53, girl: 47 })
  const [voteToast, setVoteToast] = useState(false)
  const [answers, setAnswers] = useState({
    firstWord: '',
    lookLike: '',
    spoil: '',
    owl: '',
    closest: '',
  })
  const [cards, setCards] = useState([
    { name: 'Amma', message: "Can't wait to meet you little one!" },
    { name: 'Papa', message: 'You are already so loved.' },
  ])
  const [guestName, setGuestName] = useState('')
  const [guestMessage, setGuestMessage] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isCounting, setIsCounting] = useState(false)

  const journeyRef = useRef(null)
  const panelsRef = useRef(null)
  const wrapperRef = useRef(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [predictionSubmitted, setPredictionSubmitted] = useState(false)
  const [wrapperWidth, setWrapperWidth] = useState(0)
  const trackRef = useRef(null)

  const allAnswered = Object.values(answers).every(Boolean)
  const isLastQuestion = currentQuestion === questions.length - 1

  const showPrevious = () => {
    setCurrentQuestion((value) => Math.max(0, value - 1))
  }

  const showNext = () => {
    setCurrentQuestion((value) => Math.min(questions.length - 1, value + 1))
  }

  const submitPredictions = () => {
    if (predictionSubmitted || !isLastQuestion || !allAnswered) return
    setPredictionSubmitted(true)
  }

  useEffect(() => {
    const update = () => {
      const w = wrapperRef.current?.clientWidth || 0
      setWrapperWidth(w)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!wrapperRef.current) return
    try {
      wrapperRef.current.scrollTo({ left: wrapperWidth * currentQuestion, behavior: 'smooth' })
    } catch (e) {
      wrapperRef.current.scrollLeft = wrapperWidth * currentQuestion
    }
  }, [currentQuestion, wrapperWidth])


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

    const lines = journey.querySelectorAll('.journey-line')
    const badge = journey.querySelector('.journey-badge')
    const glow = journey.querySelector('.journey-glow')

    gsap.set(journey, { opacity: 0, y: 14 })
    gsap.set(lines, { opacity: 0, y: 40 })
    gsap.set(badge, { scale: 0.8, opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.to(journey, { opacity: 1, y: 0, duration: 0.9 })
      .to(lines, { opacity: 1, y: 0, duration: 0.9, stagger: 0.18 }, 0.15)
      .to(badge, { scale: 1, opacity: 1, duration: 0.8 }, 0.28)

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
      tl.kill()
    }
  }, [])

  useEffect(() => {
    let pageScrollTrigger
    const triggers = []
    let setupTimeout = null

    const setupLoop = () => {
      gsap.registerPlugin(ScrollTrigger)

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
    setVoteCounts((prev) => ({ ...prev, [team]: prev[team] + 1 }))
    setVoteToast(true)
    window.setTimeout(() => setVoteToast(false), 1800)
  }

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const addCard = () => {
    if (!guestName.trim() || !guestMessage.trim()) return
    setCards((prev) => [{ name: guestName.trim(), message: guestMessage.trim() }, ...prev])
    setGuestName('')
    setGuestMessage('')
  }

  const startReveal = () => {
    if (revealed || isCounting) return
    setCountdown(3)
    setIsCounting(true)
  }

  const totalVotes = voteCounts.boy + voteCounts.girl
  const boyPct = totalVotes ? Math.round((voteCounts.boy / totalVotes) * 100) : 50
  const girlPct = 100 - boyPct
  const lavenderGradient = 'linear-gradient(135deg, #EDE5FF 0%, #FFFFFF 100%)'
  const blueGradient = 'linear-gradient(135deg, #cee4f7 0%, #FFFFFF 100%)'
  const themeGradient = 'linear-gradient(180deg, var(--bg-start), var(--bg-mid))'

  const panels = [
    {
      title: 'Our Journey ❤️',
      content: (
        <div className="w-full text-left">
          <div ref={journeyRef} className="journey-panel relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/10 p-6 shadow-[0_30px_90px_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <div className="journey-glow" />
            <div className="space-y-6">
              <p className="journey-line text-3xl sm:text-4xl font-semibold leading-tight text-gray-600">From the moment we saw those two little lines... our lives changed forever.</p>
              <p className="journey-line text-3xl sm:text-4xl font-semibold leading-tight text-gray-600">Every doctor's appointment... every tiny heartbeat... every little kick... brought us one step closer to meeting the greatest blessing of our lives.</p>
              <p className="journey-line text-3xl sm:text-4xl font-semibold leading-tight text-gray-600">And today... we're finally ready to share our biggest surprise.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Fun Prediction Game',
      content: (
        <div className="space-y-8 max-w-5xl mx-auto text-left">
          <div className="space-y-3">
            <p className="text-xl sm:text-2xl font-semibold">How Well Can You Predict Baby?</p>
            <p className="max-w-2xl text-sm text-neutral-700 opacity-90">
              Slide through the prediction cards and tap your favorite answer for each question.
            </p>
          </div>
          <div className="prediction-slider rounded-[2rem] border border-white/60 bg-white/90 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Navigate prediction cards</p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                <span>{currentQuestion + 1} / {questions.length}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-center">
              <button
                type="button"
                onClick={showPrevious}                disabled={currentQuestion === 0}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 md:self-center"
              >
                Prev
              </button>
              <div className="prediction-card-wrapper w-full max-w-[28rem] rounded-[2rem] border border-slate-200/20 bg-white p-4 shadow-sm">
                <div className="prediction-card rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-[#fff5fb] via-[#f6faff] to-[#ffffff] p-5 shadow-[0_18px_60px_rgba(46,63,84,0.08)] transition-transform duration-300">
                  <div className="mb-4 flex items-center justify-between gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-700">Predict</span>
                    <span className="text-slate-400">Card {currentQuestion + 1}</span>
                  </div>
                  <p className="mb-5 text-lg font-semibold text-slate-900">{questions[currentQuestion].prompt}</p>
                  <div className="grid gap-3">
                    {questions[currentQuestion].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(questions[currentQuestion].key, option)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${answers[questions[currentQuestion].key] === option ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={showNext}
                disabled={currentQuestion === questions.length - 1}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 md:self-center"
              >
                Next
              </button>
            </div>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={submitPredictions}
                disabled={!isLastQuestion || !allAnswered || predictionSubmitted}
                className="rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {predictionSubmitted ? 'Submitted' : 'Submit Predictions'}
              </button>
              <p className="text-xs text-slate-500">
                {predictionSubmitted
                  ? 'Your predictions are submitted.'
                  : isLastQuestion
                  ? allAnswered
                    ? 'Ready to submit your predictions.'
                    : 'Answer all questions to enable submit.'
                  : 'Complete the last card to submit.'}
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-white/90 p-5 text-sm text-neutral-700 shadow-inner">
            Thanks for sharing your predictions — this will be a fun memory to look back on.
          </div>
        </div>
      ),
    },
    {
      title: 'Guess the Baby!',
      content: (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] w-full text-left items-start">
          <div className="space-y-6 rounded-[2.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="space-y-3">
              <p className="text-xl sm:text-2xl font-semibold">Before We Reveal...</p>
              <p className="text-base sm:text-lg text-slate-600 opacity-90">Tap your prediction and help us see which team is the loudest one.</p>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-sky-100 via-white to-pink-100 p-6 shadow-inner">
              <div className="mb-5 rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Vote now</p>
                <h4 className="mt-4 text-3xl font-extrabold text-slate-900">Who will Baby be?</h4>
                <p className="mt-3 text-sm text-slate-600">Your vote is added instantly and visible in the live count panel.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVote('boy')}
                  aria-pressed={selectedVote === 'boy'}
                  className={`rounded-[2rem] border px-6 py-5 text-left text-base font-semibold transition ${selectedVote === 'boy' ? 'border-sky-500 bg-sky-500 text-white shadow-xl' : 'border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50'}`}
                >
                  <span className="block text-3xl">🩵</span>
                  <span className="mt-3 block text-lg font-bold">Team Boy</span>
                  <span className="mt-2 block text-sm text-slate-500">Blue hearts, strong vibes, and a baby prince.</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVote('girl')}
                  aria-pressed={selectedVote === 'girl'}
                  className={`rounded-[2rem] border px-6 py-5 text-left text-base font-semibold transition ${selectedVote === 'girl' ? 'border-pink-500 bg-pink-500 text-white shadow-xl' : 'border-slate-200 bg-white text-slate-900 hover:border-pink-300 hover:bg-pink-50'}`}
                >
                  <span className="block text-3xl">🩷</span>
                  <span className="mt-3 block text-lg font-bold">Team Girl</span>
                  <span className="mt-2 block text-sm text-slate-500">Pink dreams, sweet cheers, and a baby princess.</span>
                </motion.button>
              </div>
            </div>
            {voteToast && (
              <div className="rounded-3xl border border-slate-200 bg-white/90 px-5 py-4 text-sm font-semibold text-neutral-900 shadow-lg">
                Your vote is live — thank you for joining the fun!
              </div>
            )}
          </div>

          <div className="space-y-6 rounded-[2.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-900 px-5 py-4 text-white shadow-lg">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-300 flex items-center gap-2">
                  <span className="inline-flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_0_rgba(16,185,129,0.65)]" />
                  Live Vote Count
                </p>
                <p className="mt-2 text-3xl font-bold">{totalVotes}</p>
              </div>
              <div className="rounded-3xl bg-white/10 px-4 py-2 text-sm font-semibold">Live</div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Team Boy</p>
                    <p className="text-3xl font-extrabold text-sky-600">{voteCounts.boy}</p>
                  </div>
                  <div className="text-right text-sm text-slate-500">{boyPct}%</div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${boyPct}%` }} />
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Team Girl</p>
                    <p className="text-3xl font-extrabold text-pink-600">{voteCounts.girl}</p>
                  </div>
                  <div className="text-right text-sm text-slate-500">{girlPct}%</div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-pink-500 transition-all duration-500" style={{ width: `${girlPct}%` }} />
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
              <p className="font-semibold">How many people have voted?</p>
              <p className="mt-2 text-sm text-slate-500">Everyone’s prediction is counted instantly on this panel.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Message Wall ❤️',
      content: (
        <div className="space-y-6 max-w-3xl mx-auto text-left">
          <p className="text-xl sm:text-2xl font-semibold">Leave Baby Your First Blessing</p>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4 rounded-3xl border border-white/50 bg-white/80 p-6 shadow-md">
              <div>
                <label className="block text-sm font-semibold text-neutral-900">Name</label>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-pink-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900">Message</label>
                <textarea
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
                  rows={4}
                  placeholder="Write your blessing for baby"
                />
              </div>
              <button
                onClick={addCard}
                className="rounded-full bg-slate-900 px-6 py-3 text-white shadow-lg hover:bg-slate-800"
              >
                Add your message
              </button>
            </div>
            <div className="space-y-4">
              {cards.map((card, index) => (
                <div key={`${card.name}-${index}`} className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-lg">
                  <p className="text-sm uppercase tracking-[0.22em] text-pink-600">{card.name}</p>
                  <p className="mt-3 text-base text-neutral-900">{card.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Final Reveal',
      content: (
        <div className="space-y-8 max-w-3xl mx-auto text-center">
          <p className="text-xl sm:text-2xl font-semibold">Ready?</p>
          {!revealed && !isCounting && (
            <button
              onClick={startReveal}
              className="rounded-full bg-neutral-900 px-8 py-4 text-white text-lg font-bold shadow-2xl transition hover:bg-neutral-800"
            >
              Reveal Our Secret
            </button>
          )}
          {isCounting && (
            <div className="rounded-3xl bg-white/90 p-10 text-6xl font-black text-neutral-900 shadow-xl">
              {countdown}
            </div>
          )}
          {revealed && (
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center rounded-full bg-white/90 px-6 py-3 text-lg font-bold text-neutral-900 shadow-lg">
                {result === 'boy' ? '🩵 IT’S A BOY!' : '🩷 IT’S A GIRL!'}
              </div>
              <div className="space-y-4 rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl text-left">
                <p className="text-2xl font-semibold">Welcome to the world</p>
                <p className="text-xl font-bold">Baby {result === 'girl' ? 'Girl' : 'Boy'} Gangarajula</p>
                <p className="text-base opacity-90">We can't wait for you all to meet our little miracle.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left">
                    <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Ultrasound photo</p>
                    <div className="mt-4 h-36 rounded-3xl bg-white/90 flex items-center justify-center text-sm text-slate-400">Ultrasound photo</div>
                  </div>
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left">
                    <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Parents' photo</p>
                    <div className="mt-4 h-36 rounded-3xl bg-white/90 flex items-center justify-center text-sm text-slate-400">Parents' photo</div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/60 bg-white p-4 text-sm text-neutral-700">
                  <p className="font-semibold">Due Date:</p>
                  <p>Fall 2026</p>
                </div>
              </div>
            </div>
          )}
        </div>
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
                <h3 className={`nunito-800 text-gray-700 text-4xl sm:text-5xl font-extrabold mb-4 leading-tight `}>{panel.title}</h3>
                <div className="mb-6 text-xl sm:text-2xl opacity-90">{panel.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
