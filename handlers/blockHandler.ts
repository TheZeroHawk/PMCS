import type { AttackType, GameState } from "../types"
import { ATTACK_TYPES } from "../config/moves"

interface BlockResult {
  blockSuccess: boolean
  defenseResult: "partial" | "full" | "fail"
  finalDamage: number
}

export const handleBlock = (
  state: GameState,
  attacker: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
  defender: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8",
  attackType: AttackType,
  defenseType: AttackType,
  damage: number,
): BlockResult => {
  // console.log("handleBlock called:", { state, attacker, defender, attackType, defenseType, damage })

  let blockSuccess = false
  let defenseResult: "partial" | "full" | "fail" = "fail"
  let finalDamage = damage

  if (attackType.unblockableMove) {
    blockSuccess = false
  } else {
    const attackerPowerLevel = state[attacker].powerLevel
    const defenderPowerLevel = state[defender].powerLevel
    const powerLevelRatio = defenderPowerLevel / attackerPowerLevel

    // Apply block chance modifiers from active toggles
    let adjustedBlockChance = defenseType.blockSuccessChance || 0.55
    const activeToggles = state[`${defender}ActiveToggles`]
    activeToggles.forEach((toggleName) => {
      const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
      if (toggleAttack && toggleAttack.affectSelfBlockChance) {
        adjustedBlockChance += toggleAttack.affectSelfBlockChance
      }
    })

    // Check if the defender is stunned
    if (state.stunStatus[defender].isStunned) {
      adjustedBlockChance = 0 // Set block chance to 0% if stunned
    }

    // Then, update the blockSuccess check to use adjustedBlockChance
    blockSuccess = Math.random() < adjustedBlockChance
  }

  if (blockSuccess) {
    const blockOutcome = Math.random()
    let oneArmDamageReduction = defenseType.oneArmDamageReduction || 0.25
    let twoArmDamageReduction = defenseType.twoArmDamageReduction || 0.5

    // Check for active toggles that affect damage reduction
    const activeToggles = state[`${defender}ActiveToggles`]
    activeToggles.forEach((toggleName) => {
      const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
      if (toggleAttack) {
        if (toggleAttack.affectOneArmDamageReduction) {
          oneArmDamageReduction += toggleAttack.affectOneArmDamageReduction
        }
        if (toggleAttack.affectTwoArmDamageReduction) {
          twoArmDamageReduction += toggleAttack.affectTwoArmDamageReduction
        }
      }
    })

    // Ensure damage reduction is within 0-1 range
    oneArmDamageReduction = Math.max(0, Math.min(1, oneArmDamageReduction))
    twoArmDamageReduction = Math.max(0, Math.min(1, twoArmDamageReduction))

    if (blockOutcome < (defenseType.oneArmBlockChance || 0.55)) {
      defenseResult = "partial"
      finalDamage = Math.floor(damage * (1 - oneArmDamageReduction))
    } else if (blockOutcome < (defenseType.oneArmBlockChance || 0.55) + (defenseType.twoArmBlockChance || 0.11)) {
      defenseResult = "full"
      finalDamage = Math.floor(damage * (1 - twoArmDamageReduction))
    } else {
      defenseResult = "fail"
    }
  }

  // console.log("handleBlock result:", { blockSuccess, defenseResult, finalDamage })
  return { blockSuccess, defenseResult, finalDamage }
}

