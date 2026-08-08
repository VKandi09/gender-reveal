import React, { useEffect, useState } from 'react'
import { signIn, signOutAdmin, subscribeToAuthState } from './lib/adminAuth'
import {
  subscribeToMessages,
  subscribeToPredictions,
  subscribeToVoteRecords,
  subscribeToVotes,
} from './lib/firestoreApi'

function formatTime(ts) {
  if (!ts?.toDate) return '—'
  return ts.toDate().toLocaleString()
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Login</h1>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

function Section({ title, count, children }) {
  return (
    <section className="rounded-2xl bg-white shadow-sm border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <span className="text-sm text-slate-500">{count}</span>
      </div>
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">{children}</div>
    </section>
  )
}

function Dashboard({ user }) {
  const [messages, setMessages] = useState([])
  const [predictions, setPredictions] = useState([])
  const [voteRecords, setVoteRecords] = useState([])
  const [voteCounts, setVoteCounts] = useState({ boy: 0, girl: 0 })

  useEffect(() => {
    const unsub1 = subscribeToMessages(setMessages)
    const unsub2 = subscribeToPredictions(setPredictions)
    const unsub3 = subscribeToVoteRecords(setVoteRecords)
    const unsub4 = subscribeToVotes(setVoteCounts)
    return () => {
      unsub1()
      unsub2()
      unsub3()
      unsub4()
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Signed in as {user.email}</p>
          </div>
          <button
            onClick={signOutAdmin}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>

        <section className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 flex gap-8">
          <div>
            <p className="text-sm text-slate-500">Live Vote Tally</p>
            <p className="text-2xl font-bold text-sky-600">Boy: {voteCounts.boy}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 opacity-0">.</p>
            <p className="text-2xl font-bold text-pink-600">Girl: {voteCounts.girl}</p>
          </div>
        </section>

        <Section title="Guest Messages" count={`${messages.length} total`}>
          {messages.length === 0 && <p className="p-5 text-sm text-slate-400">No messages yet.</p>}
          {messages.map((m) => (
            <div key={m.id} className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">{m.name}</p>
                <p className="text-xs text-slate-400">{formatTime(m.createdAt)}</p>
              </div>
              <p className="text-sm text-slate-600 mt-1">{m.message}</p>
            </div>
          ))}
        </Section>

        <Section title="Predictions" count={`${predictions.length} total`}>
          {predictions.length === 0 && <p className="p-5 text-sm text-slate-400">No predictions yet.</p>}
          {predictions.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-400">{formatTime(p.submittedAt)}</p>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600 sm:grid-cols-3">
                <div><dt className="text-slate-400">First word</dt><dd>{p.firstWord}</dd></div>
                <div><dt className="text-slate-400">Looks like</dt><dd>{p.lookLike}</dd></div>
                <div><dt className="text-slate-400">Will spoil</dt><dd>{p.spoil}</dd></div>
                <div><dt className="text-slate-400">Sleeper</dt><dd>{p.owl}</dd></div>
                <div><dt className="text-slate-400">Closest to</dt><dd>{p.closest}</dd></div>
              </dl>
            </div>
          ))}
        </Section>

        <Section title="Individual Votes" count={`${voteRecords.length} total`}>
          {voteRecords.length === 0 && <p className="p-5 text-sm text-slate-400">No votes yet.</p>}
          {voteRecords.map((v) => (
            <div key={v.id} className="p-4 flex items-center justify-between">
              <p className="font-medium text-slate-900">{v.name}</p>
              <span className={`text-sm font-semibold ${v.team === 'boy' ? 'text-sky-600' : 'text-pink-600'}`}>
                Team {v.team === 'boy' ? 'Boy' : 'Girl'}
              </span>
              <p className="text-xs text-slate-400">{formatTime(v.votedAt)}</p>
            </div>
          ))}
        </Section>
      </div>
    </div>
  )
}

export default function AdminApp() {
  const [user, setUser] = useState(undefined) // undefined = loading, null = signed out

  useEffect(() => subscribeToAuthState(setUser), [])

  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>
  }

  return user ? <Dashboard user={user} /> : <LoginForm />
}
