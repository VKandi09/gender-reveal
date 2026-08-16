import React from 'react'

export default function JourneyPanel({ journeyRef }) {
  return (
    <div className="w-full text-center">
      <div ref={journeyRef} className="journey-panel relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/10 p-6 shadow-[0_30px_90px_rgba(255,255,255,0.08)] backdrop-blur-xl">
        <div className="journey-glow" />
        <div className="space-y-3">
          <p className="journey-line italianno-regular text-4xl sm:text-3xl leading-tight text-gray-600">From the moment we saw those two little lines... our lives changed forever.</p>
          <p className="journey-line italianno-regular text-4xl sm:text-3xl leading-tight text-gray-600">Every doctor's appointment... every tiny heartbeat... every little kick... brought us one step closer to meeting the greatest blessing of our lives.</p>
          <p className="journey-line italianno-regular text-4xl sm:text-3xl leading-tight text-gray-600">And today... we're finally ready to share our biggest surprise.</p>
          <p className="journey-line italianno-regular text-4xl sm:text-3xl leading-tight text-gray-600">But before the reveal.... </p>
        </div>
      </div>
    </div>
  )
}
