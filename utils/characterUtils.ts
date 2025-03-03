import type { Character, FighterConfig } from "../types"
import { ATTACK_TYPES } from "../config/moves"

export const createCharacter = (config: FighterConfig): Character => {
  const itemUses: Record<string, number> = {}
  const moveset = config.moveset || []

  moveset.forEach((move) => {
    const attackType = ATTACK_TYPES.find((attack) => attack.name === move)
    if (attackType && attackType.isHealingMove && !attackType.usesKi) {
      itemUses[move] = config.itemUses?.[move] || 1
    }
  })

  return {
    name: config.name,
    race: config.race, // Add race property
    powerLevel: config.currentPowerLevel,
    basePowerLevel: config.basePowerLevel,
    maxPowerLevel: config.basePowerLevel,
    cooldowns: {},
    lastBlockTurn: 0,
    lastDamageTaken: 0,
    moves: moveset,
    remainingAmmo: {},
    itemUses: itemUses,
    autoSkip: config.autoSkip,
  }
}

