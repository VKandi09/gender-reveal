import React from 'react'

export default function FinalRevealPanel({ revealed, isCounting, countdown, startReveal, result }) {
  return (
    <div className="space-y-8 max-w-3xl mx-auto text-center">
      <p className="italianno-regular text-4xl sm:text-5xl">Ready?</p>
      {!revealed && !isCounting && (
        <button
          onClick={startReveal}
          className="rounded-full bg-neutral-900 px-8 py-4 text-white italianno-regular text-3xl shadow-2xl transition hover:bg-neutral-800"
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
        <div className="flex items-center justify-center py-6">
          <div className={`w-full max-w-2xl rounded-[2.5rem] px-8 py-16 sm:py-20 shadow-2xl ${result === 'boy' ? 'bg-sky-500' : 'bg-pink-500'}`}>
            <p className="italianno-regular text-white text-7xl sm:text-8xl md:text-9xl leading-none">
              {result === 'boy' ? "It's a Boy!" : "It's a Girl!"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
