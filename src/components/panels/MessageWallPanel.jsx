import React from 'react'

export default function MessageWallPanel({
  guestName,
  setGuestName,
  guestMessage,
  setGuestMessage,
  addCard,
  displayedCards,
  lastSubmittedId,
}) {
  const hasMessages = displayedCards.length > 0
  const submittedCard = displayedCards.find((card) => card.id === lastSubmittedId)

  return (
    <div className="space-y-4 max-w-3xl mx-auto text-left">
      <p className="italianno-regular text-4xl sm:text-5xl text-center">Drop a Little Love Note to our Little One! 💌</p>
      <div className={hasMessages ? 'grid gap-4 md:grid-cols-[1.4fr_1fr]' : 'flex justify-center'}>
        <div className={`space-y-4 rounded-3xl border border-white/50 bg-white/80 p-3 shadow-md ${hasMessages ? '' : 'w-full max-w-xl'}`}>
          <div>
            <label className="block yesteryear-regular text-2xl text-neutral-900">Name</label>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-pink-400 text-xl"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block yesteryear-regular text-2xl text-neutral-900">Message</label>
            <textarea
              value={guestMessage}
              onChange={(e) => setGuestMessage(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 text-xl"
              rows={4}
              placeholder="Write your blessing for baby"
            />
          </div>
          <button
            onClick={addCard}
            className="rounded-full bg-slate-900 px-6 py-3 italianno-regular text-2xl text-white shadow-lg hover:bg-slate-800"
          >
            Add your message
          </button>
        </div>
        {submittedCard && (
          <div className="sm:hidden">
            <div className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-lg">
              <p className="text-sm uppercase tracking-[0.22em] text-pink-600">{submittedCard.name}</p>
              <p className="mt-3 zeyada-regular text-xl sm:text-2xl text-neutral-900">{submittedCard.message}</p>
            </div>
          </div>
        )}
        {hasMessages && (
          <div className="hidden space-y-4 sm:block">
            {displayedCards.map((card) => (
              <div key={card.id} className="rounded-3xl border border-white/60 bg-white/90 p-3 shadow-lg">
                <p className="text-sm uppercase tracking-[0.22em] text-pink-600">{card.name}</p>
                <p className="mt-3 zeyada-regular text-xl sm:text-2xl text-neutral-900">{card.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}