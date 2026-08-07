import React from 'react'
import { motion } from 'framer-motion'

export default function VotePanel({
  selectedVote,
  handleVote,
  voteToast,
  totalVotes,
  voteCounts,
  boyPct,
  girlPct,
}) {
  return (
    <div className="grid gap-6 w-full text-left items-start lg:grid-cols-[1.4fr_0.9fr]">
      <div className="space-y-6 rounded-[2.5rem] border border-white/80 bg-white/90 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:sticky lg:top-24 overflow-visible">
        <div className="space-y-3">
          <p className="italianno-regular text-3xl sm:text-4xl">Before We Reveal...</p>
          <p className="text-sm text-slate-600 opacity-90 sm:text-base">Tap your prediction and help us see which team is the loudest one.</p>
        </div>
        <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-5 shadow-inner sm:p-6">
          <div className="mb-5 rounded-[2rem] border border-white/900 bg-white/90 p-2 shadow-sm sm:p-3">
            <p className="italianno-regular text-2xl text-slate-500">Vote now</p>
            <h4 className="pl-3 mt-4 italianno-regular text-3xl text-slate-900 sm:text-4xl">Who will Baby be?</h4>
            <p className="pl-3 mt-3 text-xs text-slate-600 sm:text-sm hidden sm:block">Your vote is added instantly and visible in the live count panel.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote('boy')}
              aria-pressed={selectedVote === 'boy'}
              className={`flex flex-col gap-2 rounded-lg border px-3 py-2 sm:p-3 sm:text-sm font-semibold transition ${selectedVote === 'boy' ? 'border-sky-500 bg-sky-500 text-white shadow' : 'border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-3xl sm:text-xl">🩵</span>
                <span className="italianno-regular text-2xl sm:text-3xl">Team Boy</span>
              </span>
              <span className="text-left text-xs text-slate-500 sm:text-sm hidden sm:block">Blue hearts, strong vibes, and a baby prince.</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote('girl')}
              aria-pressed={selectedVote === 'girl'}
              className={`flex flex-col gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${selectedVote === 'girl' ? 'border-pink-500 bg-pink-500 text-white shadow' : 'border-slate-200 bg-white text-slate-900 hover:border-pink-300 hover:bg-pink-50'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-3xl sm:text-xl">🩷</span>
                <span className="italianno-regular text-2xl sm:text-3xl">Team Girl</span>
              </span>
              <span className="text-left text-xs text-slate-500 sm:text-sm hidden sm:block">Pink dreams, sweet cheers, and a baby princess.</span>
            </motion.button>
          </div>
        </div>
        {voteToast && (
          <div className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-neutral-900 shadow-lg sm:px-5 sm:py-4">
            Your vote is live — thank you for joining the fun!
          </div>
        )}
      </div>

      <div className="space-y-6 rounded-[2.5rem] border border-white/80 bg-white/90 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
        <div className="flex sm:flex-col items-center justify-between text-center rounded-3xl bg-slate-900 px-4 py-4 text-white shadow-lg sm:px-5 sm:py-4">
          <p className="italianno-regular text-xl text-slate-300 flex items-center justify-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_0_rgba(16,185,129,0.65)]" />
            Live Vote Count
          </p>
          <p className="mt-2 text-2xl font-bold sm:text-3xl">{totalVotes}</p>
        </div>
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div>
                <p className="italianno-regular text-xl text-slate-700">Team Boy</p>
                <p className="mt-1 text-lg font-extrabold text-sky-600 sm:text-2xl">{voteCounts.boy}</p>
              </div>
              <div className="text-left text-xs text-slate-500 sm:text-right sm:text-sm">{boyPct}%</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 sm:h-3">
              <div className="h-full rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${boyPct}%` }} />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div>
                <p className="italianno-regular text-xl text-slate-700">Team Girl</p>
                <p className="mt-1 text-lg font-extrabold text-pink-600 sm:text-2xl">{voteCounts.girl}</p>
              </div>
              <div className="text-left text-xs text-slate-500 sm:text-right sm:text-sm">{girlPct}%</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 sm:h-3">
              <div className="h-full rounded-full bg-pink-500 transition-all duration-500" style={{ width: `${girlPct}%` }} />
            </div>
          </div>
        </div>
        <div className="hidden rounded-3xl border border-dashed border-slate-200 bg-white/80 p-3 text-xs text-slate-600 sm:block sm:p-4">
          <p className="italianno-regular text-2xl">How many people have voted?</p>
          <p className="mt-2 text-sm text-slate-500">Everyone’s prediction is counted instantly on this panel.</p>
        </div>
      </div>
    </div>
  )
}
