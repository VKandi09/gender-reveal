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
const predictionsRef = collection(db, 'predictions')
const messagesRef = collection(db, 'messages')

export function subscribeToVotes(onChange) {
  return onSnapshot(votesRef, (snap) => {
    const data = snap.data()
    onChange({ boy: data?.boy ?? 0, girl: data?.girl ?? 0 })
  })
}

export function castVote(team) {
  return setDoc(
    votesRef,
    { boy: increment(team === 'boy' ? 1 : 0), girl: increment(team === 'girl' ? 1 : 0) },
    { merge: true }
  )
}

export function submitPrediction(answers) {
  return addDoc(predictionsRef, { ...answers, submittedAt: serverTimestamp() })
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
