import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

export default function LottiePlayer({ src, style = {}, loop = true }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(src)
        const json = await res.json()
        if (mounted) setData(json)
      } catch (e) {
        // ignore
      }
    }
    load()
    return () => (mounted = false)
  }, [src])

  if (!data) return null
  return <Lottie animationData={data} loop={loop} style={style} />
}
