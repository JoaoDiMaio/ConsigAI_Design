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

    // Sync imediato ao montar e ao mudar query
    onChange()

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange)
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(onChange)
    }

    // Fallback extra para ambientes que não propagam change corretamente
    window.addEventListener('resize', onChange)

    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', onChange)
      } else if (typeof mq.removeListener === 'function') {
        mq.removeListener(onChange)
      }
      window.removeEventListener('resize', onChange)
    }
  }, [query])

  return matches
}
