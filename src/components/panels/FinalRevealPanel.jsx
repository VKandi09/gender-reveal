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
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center rounded-full bg-white/90 px-6 py-3 italianno-regular text-3xl text-neutral-900 shadow-lg">
            {result === 'boy' ? '🩵 IT’S A BOY!' : '🩷 IT’S A GIRL!'}
          </div>
          <div className="space-y-4 rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl text-left">
            <p className="italianno-regular text-4xl">Welcome to the world</p>
            <p className="italianno-regular text-3xl">Baby {result === 'girl' ? 'Girl' : 'Boy'} Gangarajula</p>
            <p className="italianno-regular text-2xl opacity-90">We can't wait for you all to meet our little miracle.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left">
                <p className="italianno-regular text-2xl text-slate-500">Ultrasound photo</p>
                <div className="mt-4 h-36 rounded-3xl bg-white/90 flex items-center justify-center italianno-regular text-2xl text-slate-400">Ultrasound photo</div>
              </div>
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left">
                <p className="italianno-regular text-2xl text-slate-500">Parents' photo</p>
                <div className="mt-4 h-36 rounded-3xl bg-white/90 flex items-center justify-center italianno-regular text-2xl text-slate-400">Parents' photo</div>
              </div>
            </div>
            {/* <div className="rounded-3xl border border-white/60 bg-white p-4 text-sm text-neutral-700">
              <p className="font-semibold">Due Date:</p>
              <p>Fall 2026</p>
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}
