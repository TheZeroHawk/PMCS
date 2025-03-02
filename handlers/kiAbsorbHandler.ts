import type { GameState, AttackType } from "../types"

interface KiAbsorbResult {
  absorptionSuccess: boolean
  finalDamage: number
  defenseResult: "absorbed" | "fail"
  chargeNote: string
  absorbedEnergy: number
}

export const handleKiAbsorb = (
  state: GameState,
  attacker: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
  defender: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
  attackType: AttackType,
  defenseType: AttackType,
  damage: number,
): KiAbsorbResult => {
  let absorptionSuccess = false
  let finalDamage = damage
  let defenseResult: "absorbed" | "fail" = "fail"
  let chargeNote = ""
  let absorbedEnergy = 0

  if (defenseType.isKiAbsorb && attackType.usesKi) {
    const attackerPowerLevel = state[attacker].powerLevel
    const defenderPowerLevel = state[defender].powerLevel
    const powerLevelRatio = defenderPowerLevel / attackerPowerLevel

    let absorptionChance = defenseType.baseAbsorptionChance || 0.15
    if (powerLevelRatio > 1) {
      const multiplier = Math.floor(powerLevelRatio / 2)
      absorptionChance = Math.min(absorptionChance + multiplier * 0.1, defenseType.maxAbsorptionChance || 0.9)
    }

    // Check if the defender is stunned
    if (state.stunStatus[defender].isStunned) {
      absorptionChance = 0 // Set absorption chance to 0% if stunned
    }

    absorptionSuccess = Math.random() < absorptionChance

    if (absorptionSuccess) {
      absorbedEnergy = Math.floor(finalDamage * (defenseType.absorptionPercent || 0.5))
      finalDamage = 0
      defenseResult = "absorbed"
      state[defender].powerLevel += absorbedEnergy
      state[defender].basePowerLevel += absorbedEnergy
      state[defender].maxPowerLevel += absorbedEnergy
      chargeNote = `${state[defender].name} successfully absorbed ${absorbedEnergy} energy from the attack, increasing both current and base Power Level!`
    }
  }

  return { absorptionSuccess, finalDamage, defenseResult, chargeNote, absorbedEnergy }
}

