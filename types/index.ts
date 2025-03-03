// Add Race type
export type Race = "Saiyan" | "Human" | "Infinite Ki Android" | "Duugo"

export type { GameState } from './gameState'

export interface Character {
  name: string
  race: Race
  powerLevel: number
  basePowerLevel: number
  maxPowerLevel: number
  cooldowns: Record<string, number>
  lastBlockTurn: number
  lastDamageTaken: number
  moves: string[]
  remainingAmmo: Record<string, number>
  itemUses: Record<string, number>
  autoSkip: boolean
}

export interface KiChannelingState {
  initialPowerLevel: number
  boostedPowerLevel: number
  afterEffectPowerLevel: number
  attacksRemaining: number
}

export interface AttackType {
  name: string
  description: string
  category: string
  damagePercent?: number
  staticDamage?: number
  selfDamagePercent?: number
  criticalHitEligible?: boolean
  extraMoveChance?: number
  extraMoveCount?: number
  canBeCharged?: boolean
  maximumTurnsCanBeCharged?: number
  usesKi?: boolean
  isHealingMove?: boolean
  healAmountMin?: number
  healAmountMax?: number
  healChance?: number
  isToggle?: boolean
  movesAffected?: string[]
  damageBoostMin?: number
  damageBoostMax?: number
  selfDamageReduction?: number
  magazineCapacity?: number
  remainingAmmo?: number
  cooldown?: number
  longPressDuration?: number
  isCombatMove?: boolean
  preventAction?: boolean
  showInDefensePopup?: boolean
  isDodge?: boolean
  isBlock?: boolean
  blockSuccessChance?: number
  affectSelfDodgeChance?: number
  affectOpponentDodgeChance?: number
  minimumDodgeChance?: number
  affectSelfBlockChance?: number
  totalDamageAdjust?: number
  oneArmBlockChance?: number
  twoArmBlockChance?: number
  oneArmDamageReduction?: number
  twoArmDamageReduction?: number
  isKiAbsorb?: boolean
  baseAbsorptionChance?: number
  maxAbsorptionChance?: number
  absorptionPercent?: number
  unblockableMove?: boolean
  undodgeableMove?: boolean
  isKiChanneling?: boolean
  currentArmorHealth?: number
  maximumArmorHealth?: number
  isArmor?: boolean
  kiChannelingDuration?: number
  kiChannelingEffect?: (
    currentPowerLevel: number,
    maxPowerLevel: number,
  ) => {
    initialPowerLevel: number
    boostedPowerLevel: number
    afterEffectPowerLevel: number
  }
  stunChance?: number
  stunDuration?: number
  piercing?: boolean
}

export interface LogEntry {
  turn: number
  attacker: string
  defender: string
  attackType: string
  defenseType?: string
  damage: number
  remainingPowerLevel: number
  blockResult?: "partial" | "full" | "fail" | "absorbed" | "reflected"
  dodgeChance?: number
  extraMoveGranted?: boolean
  extraMoveCount?: number
  isCriticalHit?: boolean
  selfDamage?: number
  attackerRemainingPowerLevel?: number
  damagePreventedNote?: string
  chargeCleared?: boolean
  extraNote?: string
  healedAmount?: number
  healAttemptFailed?: boolean
  toggleState?: "Activated" | "Deactivated"
  isCharging?: boolean
  chargeLevel?: number
  maxChargeLevel?: number
  surrenderResult?: "Accepted" | "Declined"
  kiChannelingActivated?: boolean
  kiChannelingDeactivated?: boolean
  armorDamageReduction?: number
  isPiercing?: boolean
}

export interface FighterConfig {
  name: string
  race: Race
  basePowerLevel: number
  currentPowerLevel: number
  moveset: string[]
  itemUses?: Record<string, number>
  aiSet?: FighterAISet
  autoSkip: boolean
}

export type FighterAISet = {}
