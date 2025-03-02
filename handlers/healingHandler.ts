import type { GameState, AttackType, Character } from "../types"
import { getNextFighter } from "../utils/turnUtils"

export const handleHealing = (
  state: GameState,
  attacker: Character,
  attackType: AttackType,
  fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
): { updatedState: GameState; shouldReturn: boolean; nextTurn: string } => {
  const updatedState = { ...state }
  const remainingHealingItems = attackType.usesKi ? 1 : attacker.itemUses[attackType.name] || 0
  let shouldReturn = false
  let nextTurn = updatedState.currentTurn

  if (remainingHealingItems > 0) {
    if (Math.random() <= (attackType.healChance || 1)) {
      const healPercent =
        attackType.healAmountMin !== undefined && attackType.healAmountMax !== undefined
          ? Math.random() * (attackType.healAmountMax - attackType.healAmountMin) + attackType.healAmountMin
          : 0
      const maxHealAmount = attacker.maxPowerLevel - attacker.powerLevel
      const healAmount = Math.min(Math.floor(attacker.maxPowerLevel * healPercent), maxHealAmount)

      attacker.powerLevel += healAmount

      if (!attackType.usesKi) {
        attacker.itemUses[attackType.name] = remainingHealingItems - 1
      }

      updatedState.log.push({
        turn: updatedState.turn,
        attacker: attacker.name,
        defender: attacker.name,
        attackType: attackType.name,
        damage: -healAmount,
        remainingPowerLevel: attacker.powerLevel,
        healedAmount: healAmount,
      })

      // Update game state
      updatedState.turn += 1
      nextTurn = getNextFighter(fighter, updatedState)

      // Switch turns if no extra moves
      if (updatedState.extraMoves === 0) {
        updatedState.currentTurn = nextTurn
      } else {
        updatedState.extraMoves -= 1
      }
    } else {
      updatedState.log.push({
        turn: updatedState.turn,
        attacker: attacker.name,
        attackType: attackType.name,
        damage: 0,
        remainingPowerLevel: attacker.powerLevel,
        healAttemptFailed: true,
      })

      // Pass the turn to the next fighter
      updatedState.turn += 1
      nextTurn = getNextFighter(fighter, updatedState)
      updatedState.currentTurn = nextTurn
    }
    shouldReturn = true
  }

  return { updatedState, shouldReturn, nextTurn }
}

