import type { Character, AttackType, LogEntry, KiChannelingState } from "./index"

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
  gameOver: boolean
  winner: Character | null
  log: LogEntry[]
  turn: number
  lastDamage: number
  extraMoves: number
  lastUsedMove: AttackType | null
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
    extraMoveCount: number
    isCriticalHit: boolean
    selfDamage?: number
    extraMoveGranted: boolean
    newAttackerPowerLevel: number
  } | null
  fighter1KiChanneling: KiChannelingState | null
  fighter2KiChanneling: KiChannelingState | null
  fighter3KiChanneling: KiChannelingState | null
  fighter4KiChanneling: KiChannelingState | null
  fighter5KiChanneling: KiChannelingState | null
  fighter6KiChanneling: KiChannelingState | null
  fighter7KiChanneling: KiChannelingState | null
  fighter8KiChanneling: KiChannelingState | null
  stunStatus: {
    [key: string]: {
      isStunned: boolean
      turnsRemaining: number
    }
  }
  damageAdjustment: number
  turnHistory: GameState[]
}
