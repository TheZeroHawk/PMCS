import type { GameState, AttackType, Character, LogEntry } from "../types"
import { getNextFighter } from "../utils/turnUtils"

export const handleKiChanneling = (
  state: GameState,
  attacker: Character,
  attackType: AttackType,
  fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
): { updatedState: GameState; shouldReturn: boolean; nextTurn: string } => {
  const updatedState = { ...state }

  const kiChannelingEffect = attackType.kiChannelingEffect!(attacker.powerLevel, attacker.maxPowerLevel)
  updatedState[`${fighter}KiChanneling`] = {
    ...kiChannelingEffect,
    attacksRemaining: attackType.kiChannelingDuration || 5,
  }
  attacker.powerLevel = kiChannelingEffect.boostedPowerLevel

  updatedState.log.push({
    turn: updatedState.turn,
    attacker: attacker.name,
    defender: attacker.name,
    attackType: attackType.name,
    damage: 0,
    remainingPowerLevel: attacker.powerLevel,
    kiChannelingActivated: true,
  })

  updatedState.turn += 1
  const nextTurn = getNextFighter(fighter, updatedState)

  return { updatedState, shouldReturn: true, nextTurn }
}

export const decreaseKiChannelingCounter = (
  state: GameState,
  fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
): { updatedState: GameState; logEntry: LogEntry | null } => {
  const updatedState = { ...state }
  let logEntry: LogEntry | null = null

  if (updatedState[`${fighter}KiChanneling`]) {
    updatedState[`${fighter}KiChanneling`].attacksRemaining -= 1

    // If Ki Channeling effect has ended
    if (updatedState[`${fighter}KiChanneling`].attacksRemaining === 0) {
      const attacker = updatedState[fighter]
      attacker.powerLevel = updatedState[`${fighter}KiChanneling`].afterEffectPowerLevel
      logEntry = {
        turn: updatedState.turn,
        attacker: attacker.name,
        defender: attacker.name,
        attackType: "Ki Channeling",
        damage: 0,
        remainingPowerLevel: attacker.powerLevel,
        kiChannelingDeactivated: true,
      }
      updatedState[`${fighter}KiChanneling`] = null
    }
  }

  return { updatedState, logEntry }
}

