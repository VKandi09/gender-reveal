import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import TicTacToe from '../TicTacToe'
import { playRevealSound } from '../../anim/sound'
import babyBoyImage from '../../assets/baby-boy.png'

function BoyBalloons({ count = 12 }) {
  const balloons = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        size: 40 + Math.random() * 30,
        delay: Math.random() * 2,
        duration: 6 + Math.random() * 3,
        sway: 20 + Math.random() * 30,
        repeatDelay: Math.random() * 2,
      })),
    [count]
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {balloons.map((b, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 flex flex-col items-center"
          style={{ left: `${b.left}%` }}
          initial={{ y: '10vh', opacity: 0 }}
          animate={{
            y: ['10vh', '-120vh'],
            x: [0, b.sway, -b.sway, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            repeatDelay: b.repeatDelay,
            ease: 'easeInOut',
          }}
        >
          <div
            className="rounded-full shadow-lg"
            style={{
              width: b.size,
              height: b.size * 1.2,
              background: 'radial-gradient(circle at 30% 30%, #7dd3fc, #0284c7)',
            }}
          />
          <div className="h-10 w-px bg-neutral-400/60" />
        </motion.div>
      ))}
    </div>
  )
}

export default function FinalRevealPanel({ revealed, isCounting, countdown, startReveal, result, confirmedName }) {
  const [hasWonGame, setHasWonGame] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const hasPlayedSound = useRef(false)
  const readyName = confirmedName || nameInput.trim()

  useEffect(() => {
    if (revealed && !hasPlayedSound.current) {
      hasPlayedSound.current = true
      playRevealSound()
    }
  }, [revealed])

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-center">
      <p className="italianno-regular text-4xl sm:text-5xl">Ready?</p>
      {!revealed && !isCounting && (
        hasWonGame ? (
          <div className="flex flex-col items-center gap-4">
            {!confirmedName && (
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name, for the reveal moment"
                className="w-full max-w-xs rounded-full border border-neutral-300 px-5 py-3 text-center text-lg focus:border-neutral-900 focus:outline-none"
              />
            )}
            <button
              onClick={() => startReveal(readyName)}
              disabled={!readyName}
              className="rounded-full bg-neutral-900 px-8 py-4 text-white italianno-regular text-3xl shadow-2xl transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reveal Our Secret
            </button>
          </div>
        ) : (
          <TicTacToe onWin={() => setHasWonGame(true)} />
        )
      )}
      {isCounting && (
        <motion.div
          key={countdown}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14 }}
          className="rounded-3xl bg-white/90 p-10 text-6xl font-black text-neutral-900 shadow-xl"
        >
          {countdown}
        </motion.div>
      )}
      {revealed && result === 'boy' && <BoyBalloons />}
      {revealed && (
        <div className="relative flex items-center justify-center py-6">
          <motion.div
            className={`absolute h-64 w-64 rounded-full pointer-events-none ${result === 'boy' ? 'bg-sky-400' : 'bg-pink-400'}`}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: [0, 2.2, 2.6], opacity: [0.6, 0.25, 0] }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
            className={`relative w-full max-w-2xl rounded-[2.5rem] px-8 py-16 sm:py-20 shadow-2xl ${result === 'boy' ? 'bg-sky-500' : 'bg-pink-500'}`}
          >
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="italianno-regular text-white text-7xl sm:text-8xl md:text-9xl leading-none"
            >
              {result === 'boy' ? "It's a Boy!" : "It's a Girl!"}
            </motion.p>
            {result === 'boy' && (
              <motion.img
                src={babyBoyImage}
                alt="It's a boy"
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mx-auto mt-8 w-48 sm:w-64 rounded-3xl shadow-xl"
              />
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
