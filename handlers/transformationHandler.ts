import type { GameState, AttackType, Character } from "../types"
import { getNextFighter } from "../utils/turnUtils"

export const handleTransformation = (
  state: GameState,
  attacker: Character,
  defender: Character,
  attackType: AttackType,
  fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
): { updatedState: GameState; shouldReturn: boolean; nextTurn: string } => {
  const deathPenaltyChance = attackType.deathPenaltyChance || 0.1
  const updatedState = { ...state }

  if (Math.random() < deathPenaltyChance) {
    // 10% chance of reducing power level to 0
    attacker.powerLevel = 0
    updatedState.gameOver = true
    updatedState.winner = defender
    updatedState.log.push({
      turn: updatedState.turn,
      attacker: attacker.name,
      attackType: attackType.name,
      remainingPowerLevel: 0,
      extraNote: `${attacker.name}'s ${attackType.name} failed, reducing their power level to 0.`,
    })
  } else {
    // Successful: multiply current power level by 8 (or use a property from attackType if available)
    const powerlevelMultiplier = attackType.powerlevelMultiplier || 8
    const oldPowerLevel = attacker.powerLevel
    attacker.powerLevel *= powerlevelMultiplier
    updatedState.log.push({
      turn: updatedState.turn,
      attacker: attacker.name,
      attackType: attackType.name,
      remainingPowerLevel: attacker.powerLevel,
      extraNote: `${attacker.name}'s ${attackType.name} succeeded, increasing their power level from ${oldPowerLevel} to ${attacker.powerLevel}, exceeding their max power level of ${attacker.maxPowerLevel}.`,
    })
  }

  updatedState.turn += 1
  const nextTurn = getNextFighter(fighter, updatedState)

  return { updatedState, shouldReturn: true, nextTurn }
}

