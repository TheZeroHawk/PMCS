import { ATTACK_TYPES } from "../config/moves"
import type { GameState, AttackType } from "../types"

export const calculateDodgeChance = (
  gameState: GameState,
  attacker: keyof GameState,
  defender: keyof GameState,
  attackType: AttackType,
): number => {
  const attackerPowerLevel = gameState[attacker].powerLevel
  const defenderPowerLevel = gameState[defender].powerLevel

  // Calculate power level difference
  const powerLevelRatio = defenderPowerLevel / attackerPowerLevel

  let dodgeChance = 0
  if (attackType.undodgeableMove) {
    // If the move is undodgeable, set dodgeChance to 0
    dodgeChance = 0
  } else {
    // Calculate dodge chance
    if (Math.abs(1 - powerLevelRatio) <= 0.05) {
      // Within 5% power level difference
      dodgeChance = 0.15
    } else if (powerLevelRatio > 1) {
      // Defender is stronger
      const multiplier = Math.floor(powerLevelRatio / 2)
      dodgeChance = Math.min(0.15 + multiplier * 0.35, 0.9) // Cap at 90%
    }

    // Add 15% dodge chance if the attack uses Ki
    if (attackType.usesKi) {
      dodgeChance = Math.min(dodgeChance + 0.15, 0.9) // Cap at 90% after adding Ki bonus
    }

    // Apply dodge chance modifiers from active toggles
    const defenderActiveToggles = gameState[`${defender}ActiveToggles`]
    const attackerActiveToggles = gameState[`${attacker}ActiveToggles`]

    defenderActiveToggles.forEach((toggleName) => {
      const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
      if (toggleAttack && toggleAttack.affectSelfDodgeChance) {
        dodgeChance = Math.min(dodgeChance + toggleAttack.affectSelfDodgeChance, 0.9) // Cap at 90%
      }
    })

    attackerActiveToggles.forEach((toggleName) => {
      const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
      if (toggleAttack && toggleAttack.affectOpponentDodgeChance) {
        dodgeChance = Math.min(dodgeChance + toggleAttack.affectOpponentDodgeChance, 0.9) // Cap at 90%
      }
    })

    // Apply minimum dodge chance if applicable
    const minimumDodgeChance = defenderActiveToggles.reduce((min, toggleName) => {
      const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
      return toggleAttack && toggleAttack.minimumDodgeChance ? Math.max(min, toggleAttack.minimumDodgeChance) : min
    }, 0)

    dodgeChance = Math.max(dodgeChance, minimumDodgeChance)
  }

  // Ensure dodge chance doesn't exceed 90% or go below 0%
  return Math.max(0, Math.min(dodgeChance, 0.9))
}

