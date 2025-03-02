import type { GameState } from "../types"
import { ATTACK_TYPES } from "../config/moves"

export const calculateArmorDamageReduction = (
  fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6",
  state: GameState,
): number => {
  const activeToggles = state[`${fighter}ActiveToggles`]
  let totalDamageReduction = 0

  activeToggles.forEach((toggleName) => {
    const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
    if (toggleAttack && toggleAttack.selfDamageReduction && toggleAttack.isArmor) {
      totalDamageReduction += toggleAttack.selfDamageReduction
    }
  })

  return totalDamageReduction
}

export const updateArmorHealth = (
  fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6",
  state: GameState,
  damageAbsorbed: number,
) => {
  const activeToggles = state[`${fighter}ActiveToggles`]

  activeToggles.forEach((toggleName) => {
    const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
    if (toggleAttack && toggleAttack.isArmor && toggleAttack.currentArmorHealth !== undefined) {
      toggleAttack.currentArmorHealth = Math.max(0, toggleAttack.currentArmorHealth - damageAbsorbed)

      // If armor health reaches 0, remove it from active toggles
      if (toggleAttack.currentArmorHealth === 0) {
        state[`${fighter}ActiveToggles`] = state[`${fighter}ActiveToggles`].filter((t) => t !== toggleName)
      }
    }
  })
}

