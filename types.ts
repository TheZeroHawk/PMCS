// Add Race type
export type Race = "Saiyan" | "Human" | "Infinite Ki Android" | "Duugo"

export interface GameState {
  fighter1: Character
  fighter2: Character
  fighter3: Character
  fighter4: Character
  fighter5: Character
  fighter6: Character
  fighter7: Character
  fighter8: Character
  currentTurn:
    | "fighter1"
    | "fighter2"
    | "fighter3"
    | "fighter4"
    | "fighter5"
    | "fighter6"
    | "fighter7"
    | "fighter8"
    | "beamClash"
  gameOver: boolean
  winner: Character | null
  log: LogEntry[]
  turn: number
  lastDamage: number
  extraMoves: number
  fighter1ActiveToggles: string[]
  fighter2ActiveToggles: string[]
  fighter3ActiveToggles: string[]
  fighter4ActiveToggles: string[]
  fighter5ActiveToggles: string[]
  fighter6ActiveToggles: string[]
  fighter7ActiveToggles: string[]
  fighter8ActiveToggles: string[]
  fighter1ChargedMove: { moveName: string; chargeLevel: number } | null
  fighter2ChargedMove: { moveName: string; chargeLevel: number } | null
  fighter3ChargedMove: { moveName: string; chargeLevel: number } | null
  fighter4ChargedMove: { moveName: string; chargeLevel: number } | null
  fighter5ChargedMove: { moveName: string; chargeLevel: number } | null
  fighter6ChargedMove: { moveName: string; chargeLevel: number } | null
  fighter7ChargedMove: { moveName: string; chargeLevel: number } | null
  fighter8ChargedMove: { moveName: string; chargeLevel: number } | null
  showSurrenderPrompt: boolean
  pendingSurrender:
    | "fighter1"
    | "fighter2"
    | "fighter3"
    | "fighter4"
    | "fighter5"
    | "fighter6"
    | "fighter7"
    | "fighter8"
    | null
  pendingDefense: {
    defender: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"
    attacker: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"
    attackType: AttackType
    damage: number
  } | null
  fighter1KiChanneling: KiChannelingState | null
  fighter2KiChanneling: KiChannelingState | null
  fighter3KiChanneling: KiChannelingState | null
  fighter4KiChanneling: KiChannelingState | null
  fighter5KiChanneling: KiChannelingState | null
  fighter6KiChanneling: KiChannelingState | null
  fighter7KiChanneling: KiChannelingState | null
  fighter8KiChanneling: KiChannelingState | null
  beamClashInfo: {
    attacker1: string
    attacker2: string
    attack1: string
    attack2: string
    damage1: number
    damage2: number
    winningAttack: string
    winningAttacker: string
    losingDefender: string
    actualDamage: number
    healedDamage: number
  } | null
  stunStatus: {
    [key: string]: {
      isStunned: boolean
      turnsRemaining: number
    }
  }
}

export interface KiChannelingState {
  initialPowerLevel: number
  boostedPowerLevel: number
  afterEffectPowerLevel: number
  attacksRemaining: number
}

export interface Character {
  name: string
  race: Race // Add race property
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
  race: Race // Add race property
  basePowerLevel: number
  currentPowerLevel: number
  moveset: string[]
  itemUses?: Record<string, number>
  aiSet?: FighterAISet
  autoSkip: boolean
}

export type FighterAISet = {}

