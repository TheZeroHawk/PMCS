import type { GameState, AttackType, Character } from "../types"
import { getNextFighter } from "../utils/turnUtils"

export const handleSurrender = (
  state: GameState,
  attacker: Character,
  defender: Character,
  attackType: AttackType,
  fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
): { updatedState: GameState; shouldReturn: boolean } => {
  const updatedState = { ...state }

  updatedState.log.push({
    turn: updatedState.turn,
    attacker: attacker.name,
    defender: defender.name,
    attackType: "Surrender Attempt",
    damage: 0,
    remainingPowerLevel: attacker.powerLevel,
  })

  updatedState.pendingSurrender = fighter
  updatedState.currentTurn = getNextFighter(fighter, updatedState)

  return { updatedState, shouldReturn: true }
}

export const handleRespondToSurrender = (
  state: GameState,
  accept: boolean,
): { updatedState: GameState; shouldReturn: boolean } => {
  const updatedState = { ...state }

  if (updatedState.pendingSurrender) {
    const surrenderingFighter = updatedState.pendingSurrender
    const opposingFighter = getNextFighter(surrenderingFighter, updatedState)

    if (accept) {
      // Accept surrender
      updatedState[surrenderingFighter].autoSkip = true
      updatedState.log.push({
        turn: updatedState.turn,
        attacker: updatedState[surrenderingFighter].name,
        defender: updatedState[opposingFighter].name,
        attackType: "Surrender",
        damage: 0,
        remainingPowerLevel: updatedState[surrenderingFighter].powerLevel,
        surrenderResult: "Accepted",
      })
    } else {
      // Decline surrender
      updatedState.log.push({
        turn: updatedState.turn,
        attacker: updatedState[surrenderingFighter].name,
        defender: updatedState[opposingFighter].name,
        attackType: "Surrender",
        damage: 0,
        remainingPowerLevel: updatedState[surrenderingFighter].powerLevel,
        surrenderResult: "Declined",
      })
      updatedState.currentTurn = surrenderingFighter
    }

    updatedState.pendingSurrender = null
    updatedState.turn += 1
  }

  return { updatedState, shouldReturn: true }
}

