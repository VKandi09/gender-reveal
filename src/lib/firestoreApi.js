import {
  doc,
  setDoc,
  increment,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const votesRef = doc(db, 'votes', 'tally')
const voteRecordsRef = collection(db, 'voteRecords')
const predictionsRef = collection(db, 'predictions')
const messagesRef = collection(db, 'messages')

export function subscribeToVotes(onChange) {
  return onSnapshot(votesRef, (snap) => {
    const data = snap.data()
    onChange({ boy: data?.boy ?? 0, girl: data?.girl ?? 0 })
  })
}

export function castVote(name, team) {
  const tallyWrite = setDoc(
    votesRef,
    { boy: increment(team === 'boy' ? 1 : 0), girl: increment(team === 'girl' ? 1 : 0) },
    { merge: true }
  )
  // Best-effort: the individual record is only for owner visibility, so it
  // shouldn't be able to fail the vote or unlock the UI if it errors.
  addDoc(voteRecordsRef, { name, team, votedAt: serverTimestamp() }).catch((err) =>
    console.error('Failed to record individual vote', err)
  )
  return tallyWrite
}

export function submitPrediction(name, answers) {
  return addDoc(predictionsRef, { name, ...answers, submittedAt: serverTimestamp() })
}

export function subscribeToMessages(onChange) {
  const q = query(messagesRef, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export function addMessage(name, message) {
  return addDoc(messagesRef, { name, message, createdAt: serverTimestamp() })
}

export function subscribeToPredictions(onChange) {
  const q = query(predictionsRef, orderBy('submittedAt', 'desc'))
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export function subscribeToVoteRecords(onChange) {
  const q = query(voteRecordsRef, orderBy('votedAt', 'desc'))
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}
