import type { GameState } from "../types/gameState"
import { FIGHTERS } from "../config/fighters"
import { ATTACK_TYPES } from "../config/moves"
import { createCharacter } from "../utils/characterUtils"

export const initialState: GameState = {
  fighter1: createCharacter(FIGHTERS.fighter1),
  fighter2: createCharacter(FIGHTERS.fighter2),
  fighter3: createCharacter(FIGHTERS.fighter3),
  fighter4: createCharacter(FIGHTERS.fighter4),
  fighter5: createCharacter(FIGHTERS.fighter5),
  fighter6: createCharacter(FIGHTERS.fighter6),
  fighter7: createCharacter(FIGHTERS.fighter7),
  fighter8: createCharacter(FIGHTERS.fighter8),
  currentTurn: "fighter1",
  gameOver: false,
  winner: null,
  log: [],
  turn: 1,
  lastDamage: 0,
  extraMoves: 0,
  lastUsedMove: null,
  fighter1ActiveToggles: [],
  fighter2ActiveToggles: [],
  fighter3ActiveToggles: [],
  fighter4ActiveToggles: [],
  fighter5ActiveToggles: [],
  fighter6ActiveToggles: [],
  fighter7ActiveToggles: [],
  fighter8ActiveToggles: [],
  fighter1ChargedMove: null,
  fighter2ChargedMove: null,
  fighter3ChargedMove: null,
  fighter4ChargedMove: null,
  fighter5ChargedMove: null,
  fighter6ChargedMove: null,
  fighter7ChargedMove: null,
  fighter8ChargedMove: null,
  showSurrenderPrompt: false,
  pendingSurrender: null,
  pendingDefense: null,
  fighter1KiChanneling: null,
  fighter2KiChanneling: null,
  fighter3KiChanneling: null,
  fighter4KiChanneling: null,
  fighter5KiChanneling: null,
  fighter6KiChanneling: null,
  fighter7KiChanneling: null,
  fighter8KiChanneling: null,
  stunStatus: {
    fighter1: { isStunned: false, turnsRemaining: 0 },
    fighter2: { isStunned: false, turnsRemaining: 0 },
    fighter3: { isStunned: false, turnsRemaining: 0 },
    fighter4: { isStunned: false, turnsRemaining: 0 },
    fighter5: { isStunned: false, turnsRemaining: 0 },
    fighter6: { isStunned: false, turnsRemaining: 0 },
    fighter7: { isStunned: false, turnsRemaining: 0 },
    fighter8: { isStunned: false, turnsRemaining: 0 },
  },
  damageAdjustment: 0,
  turnHistory: [],
}

// Initialize ammo for attacks with magazineCapacity
ATTACK_TYPES.forEach((attack) => {
  if (attack.magazineCapacity !== undefined) {
    initialState.fighter1.remainingAmmo[attack.name] = attack.magazineCapacity
    initialState.fighter2.remainingAmmo[attack.name] = attack.magazineCapacity
    initialState.fighter3.remainingAmmo[attack.name] = attack.magazineCapacity
    initialState.fighter4.remainingAmmo[attack.name] = attack.magazineCapacity
    initialState.fighter5.remainingAmmo[attack.name] = attack.magazineCapacity
    initialState.fighter6.remainingAmmo[attack.name] = attack.magazineCapacity
    initialState.fighter7.remainingAmmo[attack.name] = attack.magazineCapacity
    initialState.fighter8.remainingAmmo[attack.name] = attack.magazineCapacity
  }
})

