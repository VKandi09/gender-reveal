import React from 'react'

export default function PredictionPanel({
  questions,
  currentQuestion,
  showPrevious,
  showNext,
  handleAnswer,
  answers,
  submitPredictions,
  isLastQuestion,
  allAnswered,
  predictionSubmitted,
}) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      <div className="space-y-3">
        <p className="italianno-regular text-3xl sm:text-4xl">How Well Can You Predict Baby?</p>
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
  )
}
