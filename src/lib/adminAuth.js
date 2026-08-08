import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function signOutAdmin() {
  return signOut(auth)
}

export function subscribeToAuthState(onChange) {
  return onAuthStateChanged(auth, onChange)
}
