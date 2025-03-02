export interface FighterAISet {
  basicMoveWeight: number
  defenseMoveWeight: number
  specialMoveWeight: number
  itemMoveWeight: number
  otherMoveWeight: number
  surrenderPowerLevelThreshold: number
  surrenderChance: number
  acceptSurrenderChance: number
  toggleActivationChance: number
}

export const FIGHTER_AI_SETS: Record<string, FighterAISet> = {
  // The default AI, balanced.  Duplicate this incase you need something more custom.
  balanced: {
    basicMoveWeight: 0.35,
    defenseMoveWeight: 0.1,
    specialMoveWeight: 0.35,
    itemMoveWeight: 0.1,
    otherMoveWeight: 0.1,
    surrenderPowerLevelThreshold: 0.3,
    surrenderChance: 0.45,
    acceptSurrenderChance: 0.87,
    toggleActivationChance: 0.2,
  },
  // Example of a custom enemy AI.
  custom: {
    basicMoveWeight: 0.35,
    defenseMoveWeight: 0.2,
    specialMoveWeight: 0.4,
    itemMoveWeight: 0.05,
    otherMoveWeight: 0.0,
    surrenderPowerLevelThreshold: 0.3,
    surrenderChance: 0.45,
    acceptSurrenderChance: 0.87,
    toggleActivationChance: 0.2,
  },
}

