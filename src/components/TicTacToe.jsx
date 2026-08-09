import React, { useEffect, useState } from 'react'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function calculateWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  return null
}

// Mostly-random computer move, with a chance to block an obvious player win —
// keeps the game genuinely beatable (a perfect-play AI would make winning,
// and therefore ever seeing the reveal button, impossible).
function pickComputerMove(board) {
  const empty = board.reduce((acc, v, i) => (v ? acc : [...acc, i]), [])
  if (empty.length === 0) return null

  if (Math.random() < 0.35) {
    for (const idx of empty) {
      const copy = [...board]
      copy[idx] = 'X'
      if (calculateWinner(copy) === 'X') return idx
    }
  }
  return empty[Math.floor(Math.random() * empty.length)]
}

export default function TicTacToe({ onWin }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [status, setStatus] = useState('playing') // 'playing' | 'won' | 'lost' | 'draw'

  useEffect(() => {
    const winner = calculateWinner(board)
    if (winner === 'X') {
      setStatus('won')
      onWin()
    } else if (winner === 'O') {
      setStatus('lost')
    } else if (board.every(Boolean)) {
      setStatus('draw')
    }
  }, [board])

  useEffect(() => {
    if (isPlayerTurn || status !== 'playing') return
    const t = window.setTimeout(() => {
      const move = pickComputerMove(board)
      if (move !== null) {
        setBoard((prev) => {
          const next = [...prev]
          next[move] = 'O'
          return next
        })
      }
      setIsPlayerTurn(true)
    }, 500)
    return () => window.clearTimeout(t)
  }, [isPlayerTurn, status, board])

  const handleCellClick = (i) => {
    if (board[i] || !isPlayerTurn || status !== 'playing') return
    const next = [...board]
    next[i] = 'X'
    setBoard(next)
    setIsPlayerTurn(false)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setStatus('playing')
  }

  return (
    <div className="space-y-4">
      <p className="italianno-regular text-2xl text-neutral-700">
        Beat me to find the secret!
      </p>
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleCellClick(i)}
            disabled={!!cell || !isPlayerTurn || status !== 'playing'}
            className="aspect-square rounded-2xl border border-slate-200 bg-white text-4xl font-bold shadow-sm transition hover:border-slate-400 disabled:cursor-not-allowed"
          >
            <span className={cell === 'X' ? 'text-sky-600' : 'text-pink-600'}>{cell}</span>
          </button>
        ))}
      </div>
      {status === 'playing' && !isPlayerTurn && (
        <p className="text-sm text-slate-500">Computer's turn…</p>
      )}
      {status === 'lost' && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Oops, the computer won this round! Try again?</p>
          <button
            type="button"
            onClick={resetGame}
            className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Try Again
          </button>
        </div>
      )}
      {status === 'draw' && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">It's a draw — one more try!</p>
          <button
            type="button"
            onClick={resetGame}
            className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}
