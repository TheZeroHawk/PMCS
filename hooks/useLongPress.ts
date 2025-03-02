"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"

interface LongPressOptions {
  onLongPress?: () => void
  onClick?: () => void
  duration?: number
}

export function useLongPress({ onLongPress, onClick, duration = 1000 }: LongPressOptions) {
  const [isPressed, setIsPressed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const startTimeRef = useRef<number>(0)

  const start = useCallback(() => {
    setIsPressed(true)
    startTimeRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      if (onLongPress) {
        onLongPress()
      }
      setIsPressed(false)
    }, duration)
  }, [onLongPress, duration])

  const stop = useCallback(
    (event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      setIsPressed(false)
      if (shouldTriggerClick && onClick && Date.now() - startTimeRef.current < duration) {
        onClick()
      }
    },
    [onClick, duration],
  )

  const getProgress = useCallback(() => {
    if (!isPressed) return 0
    const elapsedTime = Date.now() - startTimeRef.current
    return Math.min(elapsedTime / duration, 1)
  }, [isPressed, duration])

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: (e: React.MouseEvent) => stop(e, false),
    onTouchStart: start,
    onTouchEnd: stop,
    isPressed,
    getProgress,
  }
}

