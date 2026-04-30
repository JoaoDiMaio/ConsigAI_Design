import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState(getMatches)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined

    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)

    onChange()

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange)
    } else {
      mq.addListener(onChange)
    }

    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', onChange)
      } else {
        mq.removeListener(onChange)
      }
    }
  }, [query])

  return matches
}
