let audioCtx

export function playRevealSound() {
  if (typeof window === 'undefined') return
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return

  audioCtx = audioCtx || new Ctx()
  if (audioCtx.state === 'suspended') audioCtx.resume()

  const now = audioCtx.currentTime

  // ascending "ta-da" run
  const run = [
    { freq: 523.25, start: 0, dur: 0.16 }, // C5
    { freq: 659.25, start: 0.13, dur: 0.16 }, // E5
    { freq: 783.99, start: 0.26, dur: 0.16 }, // G5
    { freq: 1046.5, start: 0.39, dur: 0.7 }, // C6 held
  ]

  run.forEach(({ freq, start, dur }) => {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    const t = now + start
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.3, t + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur)

    osc.start(t)
    osc.stop(t + dur + 0.05)
  })

  // bright sparkle chord on the landing note
  const chord = [1046.5, 1318.5, 1568]
  chord.forEach((freq) => {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    const t = now + 0.39
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.15, t + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3)

    osc.start(t)
    osc.stop(t + 1.4)
  })
}
