import type { Character, AttackType } from "../types"

export const calculatePotentialDamage = (attacker: Character, attackType: AttackType): number => {
  const damagePercent = attackType.damagePercent || 0
  const damage =
    attackType.staticDamage !== undefined
      ? attackType.staticDamage
      : Math.max(1, Math.floor(attacker.powerLevel * damagePercent))

  // Apply critical hit chance
  const isCriticalHit = attackType.criticalHitEligible && Math.random() < (attackType.criticalHitDamageChance || 0)
  const criticalHitDamage = isCriticalHit ? Math.floor(damage * (attackType.criticalHitDamageIncrease || 0)) : 0

  return damage + criticalHitDamage
}

export const applyArmorReduction = (damage: number, armorDamageReduction: number, isPiercing: boolean): number => {
  if (isPiercing) {
    return damage
  }
  return Math.max(0, Math.floor(damage * (1 - armorDamageReduction)))
}

