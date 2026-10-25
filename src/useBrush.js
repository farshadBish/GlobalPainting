import { useEffect, useState } from 'react'
import { DEFAULT_LINE_WIDTH } from './painter'

const STORAGE_KEY = 'brush'
const DEFAULT_BRUSH = { color: '#000000', lineWidth: DEFAULT_LINE_WIDTH }

function loadBrush() {
  try {
    return { ...DEFAULT_BRUSH, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }
  } catch {
    return DEFAULT_BRUSH
  }
}

// The brush color and width, remembered between visits
export function useBrush() {
  const [brush, setBrush] = useState(loadBrush)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brush))
    } catch {
      // Storage can be blocked (private mode); the brush just isn't remembered
    }
  }, [brush])

  return [brush, setBrush]
}
