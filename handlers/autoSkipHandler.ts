import type { GameState } from "../types"
import { getNextFighter } from "../utils/turnUtils"

export const handleAutoSkipTurn = (state: GameState) => {
  const currentFighter = state.currentTurn
  if (
    state[currentFighter].autoSkip ||
    state.stunStatus[currentFighter].isStunned ||
    state[currentFighter].powerLevel === 0
  ) {
    const reason =
      state[currentFighter].powerLevel === 0 ? "Defeated" : state[currentFighter].autoSkip ? "Auto Skip" : "Stunned"
    state.log.push({
      turn: state.turn,
      attacker: state[currentFighter].name,
      defender: state[currentFighter].name,
      attackType: reason,
      damage: 0,
      remainingPowerLevel: state[currentFighter].powerLevel,
    })

    // Only decrease stun duration for the current fighter if they're not defeated
    if (state.stunStatus[currentFighter].isStunned && state[currentFighter].powerLevel > 0) {
      state.stunStatus[currentFighter].turnsRemaining -= 1
      if (state.stunStatus[currentFighter].turnsRemaining <= 0) {
        state.stunStatus[currentFighter].isStunned = false
        state.log.push({
          turn: state.turn,
          attacker: state[currentFighter].name,
          defender: state[currentFighter].name,
          attackType: "Stun Recovered",
          damage: 0,
          remainingPowerLevel: state[currentFighter].powerLevel,
          extraNote: `${state[currentFighter].name} has recovered from being stunned.`,
        })
      }
    }

    state.turn += 1
    state.currentTurn = getNextFighter(currentFighter, state)
  }

  return state
}

