'use client'

import { useEffect } from 'react'

export function PrintTrigger() {
  useEffect(() => {
    // Automatically trigger print on mount
    const timer = setTimeout(() => {
      window.print()
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return null
}
