import type { GameState } from "../types"

export function getNextFighter(
  currentFighter: string,
  state: GameState,
): "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8" {
  const fighters = ["fighter1", "fighter2", "fighter3", "fighter4", "fighter5", "fighter6", "fighter7", "fighter8"]
  let currentIndex = fighters.indexOf(currentFighter)
  let nextFighter: string
  let loopCount = 0

  do {
    currentIndex = (currentIndex + 1) % 8
    nextFighter = fighters[currentIndex]
    loopCount++

    // If we've looped through all fighters, break to avoid infinite loop
    if (loopCount > 8) {
      console.error(
        "All fighters are either auto-skipping, stunned, or defeated. Returning the next available fighter.",
      )
      return nextFighter as
        | "fighter1"
        | "fighter2"
        | "fighter3"
        | "fighter4"
        | "fighter5"
        | "fighter6"
        | "fighter7"
        | "fighter8"
    }
  } while (
    state[nextFighter as keyof typeof state].autoSkip ||
    state[nextFighter as keyof typeof state].powerLevel === 0
  )

  return nextFighter as
    | "fighter1"
    | "fighter2"
    | "fighter3"
    | "fighter4"
    | "fighter5"
    | "fighter6"
    | "fighter7"
    | "fighter8"
}

