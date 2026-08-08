import React from 'react'

export default function LockedPanel({ message }) {
  return (
    <div className="max-w-md mx-auto space-y-4 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-lg text-center">
      <p className="text-4xl">🔒</p>
      <p className="italianno-regular text-3xl text-slate-700">{message}</p>
    </div>
  )
}
