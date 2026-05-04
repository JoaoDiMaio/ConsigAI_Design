import { useEffect, useState } from 'react'

const KEY = 'consigai_font_scale'
const SCALES = [1, 1.25]

function applyScale(scale) {
  const el = document.documentElement
  if (scale === 1) {
    el.style.zoom = ''
    el.style.fontSize = ''
  } else {
    el.style.zoom = scale
  }
}

export function useFontSize() {
  const [scaleIdx, setScaleIdx] = useState(() => {
    try { return Number(localStorage.getItem(KEY)) || 0 } catch { return 0 }
  })

  useEffect(() => {
    applyScale(SCALES[scaleIdx])
    try { localStorage.setItem(KEY, scaleIdx) } catch {}
  }, [scaleIdx])

  // apply on mount (persisted preference)
  useEffect(() => {
    applyScale(SCALES[scaleIdx])
  }, [])

  function toggle() {
    setScaleIdx(i => (i + 1) % SCALES.length)
  }

  return { enlarged: scaleIdx === 1, toggle }
}
