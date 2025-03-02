import type { GameState, AttackType, Character } from "../types"
import { getNextFighter } from "../utils/turnUtils"
import { decreaseKiChannelingCounter } from "./kiChannelingHandler"

export const handleSkipTurn = (
  state: GameState,
  attacker: Character,
  attackType: AttackType,
  fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
): { updatedState: GameState; shouldReturn: boolean; nextTurn: string } => {
  const updatedState = { ...state }

  // Decrease Ki Channeling count
  const { updatedState: kiChannelingUpdatedState, logEntry: kiChannelingLogEntry } = decreaseKiChannelingCounter(
    updatedState,
    fighter,
  )
  Object.assign(updatedState, kiChannelingUpdatedState)

  updatedState.log.push({
    turn: updatedState.turn,
    attacker: attacker.name,
    defender: attacker.name,
    attackType: attackType.name,
    damage: 0,
    remainingPowerLevel: attacker.powerLevel,
  })

  // Add Ki Channeling log entry if it exists
  if (kiChannelingLogEntry) {
    updatedState.log.push(kiChannelingLogEntry)
  }

  updatedState.turn += 1
  const nextTurn = getNextFighter(fighter, updatedState)

  return { updatedState, shouldReturn: true, nextTurn }
}

