import type { GameState, AttackType } from "../types"

interface ReflectResult {
  reflectSuccess: boolean
  finalDamage: number
  defenseResult: "reflected" | "fail"
  chargeNote: string
}

export const handleReflect = (
  state: GameState,
  attacker: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
  defender: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
  attackType: AttackType,
  defenseType: AttackType,
  damage: number,
): ReflectResult => {
  const reflectSuccess = Math.random() < (defenseType.reflectSuccessChance || 0)
  let finalDamage = damage
  let defenseResult: "reflected" | "fail" = "fail"
  let chargeNote = ""

  if (reflectSuccess) {
    finalDamage = 0
    defenseResult = "reflected"

    // Apply the damage to the attacker
    state[attacker].powerLevel = Math.max(0, state[attacker].powerLevel - damage)

    chargeNote = `${state[defender].name} successfully reflected ${damage} damage back to ${state[attacker].name}!`
  }

  return { reflectSuccess, finalDamage, defenseResult, chargeNote }
}

