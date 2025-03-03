import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Character, AttackType, FighterConfig, GameState } from "../types"
import { initialState } from "./initialState"
import { ATTACK_TYPES } from "../config/moves"
import { useGrantedMove } from "../hooks/useGrantedMoves"
import { handleTransformation } from "../handlers/transformationHandler"
import { handleKiChanneling, decreaseKiChannelingCounter } from "../handlers/kiChannelingHandler"
import { handleSkipTurn } from "../handlers/skipTurnHandler"
import { handleHealing } from "../handlers/healingHandler"
import { handleSurrender, handleRespondToSurrender } from "../handlers/surrenderHandler"
import { handleDodge } from "../handlers/dodgeHandler"
import { handleBlock } from "../handlers/blockHandler"
import { handleReflect } from "../handlers/reflectHandler"
import { handleKiAbsorb } from "../handlers/kiAbsorbHandler"
import { calculateArmorDamageReduction, updateArmorHealth } from "../hooks/useArmorFunctions"
import { getNextFighter } from "../utils/turnUtils"
import { handleAutoSkipTurn as autoSkipTurnHandler } from "../handlers/autoSkipHandler"
import { handleRollback } from "../handlers/rollbackHandler"
import { createCharacter } from "../utils/characterUtils"

type FighterKey = "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    performAttack: (
      state,
      action: PayloadAction<{
        attackType: AttackType
        action: "use" | "charge" | "toggle"
        fighter: FighterKey
        target: FighterKey
        targets?: { [key: string]: number }
      }>,
    ) => {
      console.log(`Start of performAttack. Current extraMoves: ${state.extraMoves}`)
      // Save the current state to turnHistory before making any changes
      const currentState = JSON.parse(
        JSON.stringify({
          ...state,
          turnHistory: [], // Exclude turnHistory from the saved state to avoid nested history
        }),
      )

      // Add the current state to the turn history
      state.turnHistory.push(currentState)

      // Keep only the 20 most recent turns
      if (state.turnHistory.length > 20) {
        state.turnHistory = state.turnHistory.slice(-20)
      }
      const { attackType, action: attackAction, fighter, target, targets } = action.payload
      const attacker = state[fighter]
      const defender = state[target]
      const chargedMove = state[`${fighter}ChargedMove`]

      // Add this at the beginning of the function
      if (state[action.payload.fighter].autoSkip) {
        autoSkipTurnHandler(state)
        useGrantedMove(state, fighter, attackType.name)
        return
      }

      // Clear the charge if a different attack is used
      if (state[`${fighter}ChargedMove`] && state[`${fighter}ChargedMove`].moveName !== attackType.name) {
        state[`${fighter}ChargedMove`] = null
      }

      // Handle Ki Channeling
      if (attackType.isKiChanneling) {
        const { updatedState, shouldReturn, nextTurn } = handleKiChanneling(state, attacker, attackType, fighter)
        Object.assign(state, updatedState)
        if (shouldReturn) {
          state.currentTurn = nextTurn
          useGrantedMove(state, fighter, attackType.name)
          return
        }
      }

      // Handle Transformations
      if (attackType.category === "Transformations") {
        const { updatedState, shouldReturn, nextTurn } = handleTransformation(
          state,
          attacker,
          defender,
          attackType,
          fighter,
        )
        Object.assign(state, updatedState)
        if (shouldReturn) {
          state.currentTurn = nextTurn
          useGrantedMove(state, fighter, attackType.name)
          return
        }
      }

      // Handle Skip My Turn
      if (attackType.name === "Skip My Turn") {
        const { updatedState, shouldReturn, nextTurn } = handleSkipTurn(state, attacker, attackType, fighter)
        Object.assign(state, updatedState)
        if (shouldReturn) {
          state.currentTurn = nextTurn
          useGrantedMove(state, fighter, attackType.name)
          return
        }
      }

      // Handle healing moves
      if (attackType.isHealingMove) {
        const { updatedState, shouldReturn, nextTurn } = handleHealing(state, attacker, attackType, fighter)
        Object.assign(state, updatedState)
        if (shouldReturn) {
          state.currentTurn = nextTurn
          useGrantedMove(state, fighter, attackType.name)
          return
        }
      }

      // Handle surrender
      if (attackType.name === "Surrender") {
        const { updatedState, shouldReturn } = handleSurrender(state, attacker, defender, attackType, fighter)
        Object.assign(state, updatedState)
        if (shouldReturn) {
          useGrantedMove(state, fighter, attackType.name)
          return
        }
      }

      // Handle toggle abilities
      if (attackType.isToggle) {
        const activeToggles = state[`${fighter}ActiveToggles`]
        const newActiveToggles = activeToggles.includes(attackType.name)
          ? activeToggles.filter((toggle) => toggle !== attackType.name)
          : [...activeToggles, attackType.name]

        state[`${fighter}ActiveToggles`] = newActiveToggles

        const toggleState = newActiveToggles.includes(attackType.name) ? "Activated" : "Deactivated"
        state.log.push({
          attacker: limitString(attacker.name),
          defender: limitString(attacker.name),
          attackType: limitString(attackType.name),
          damage: 0,
          remainingPowerLevel: attacker.powerLevel,
          toggleState: toggleState,
          extraNote: attackType.extraCombatLogNote
            ? `${toggleState}: ${limitString(attackType.extraCombatLogNote)}`
            : undefined,
        })

        // If it's armor, initialize or reset the armor health
        if (attackType.isArmor && toggleState === "Activated") {
          attackType.currentArmorHealth = attackType.maximumArmorHealth
        }
        useGrantedMove(state, fighter, attackType.name)
        return
      }

      // Initialize damagePercent
      let damagePercent = attackType.damagePercent || 0

      // Handle charged moves
      if (attackType.canBeCharged) {
        if (attackAction === "charge") {
          if (!chargedMove || chargedMove.moveName === attackType.name) {
            if (!chargedMove) {
              state[`${fighter}ChargedMove`] = { moveName: attackType.name, chargeLevel: 1 }
            } else if (chargedMove.chargeLevel < attackType.maximumTurnsCanBeCharged!) {
              state[`${fighter}ChargedMove`].chargeLevel += 1
            }

            // Apply self-damage immediately when charging
            const selfDamage = Math.floor(attacker.powerLevel * (attackType.selfDamagePercent || 0))
            attacker.powerLevel = Math.max(0, attacker.powerLevel - selfDamage)

            // Decrease Ki Channeling count when charging
            const { updatedState: kiChannelingUpdatedState, logEntry: kiChannelingLogEntry } =
              decreaseKiChannelingCounter(state, fighter)
            Object.assign(state, kiChannelingUpdatedState)

            // Log the charging action
            state.log.push({
              turn: state.turn,
              attacker: limitString(attacker.name),
              defender: limitString(attacker.name),
              attackType: limitString(attackType.name),
              damage: 0,
              selfDamage: selfDamage,
              remainingPowerLevel: attacker.powerLevel,
              isCharging: true,
              chargeLevel: state[`${fighter}ChargedMove`].chargeLevel,
              maxChargeLevel: attackType.maximumTurnsCanBeCharged,
            })

            // Add Ki Channeling log entry if it exists
            if (kiChannelingLogEntry) {
              state.log.push(kiChannelingLogEntry)
            }

            // End the turn after charging
            state.turn += 1
            state.currentTurn = getNextFighter(fighter, state)
            useGrantedMove(state, fighter, attackType.name)
            return
          } else {
            // If trying to charge a different move, clear the existing charge
            state[`${fighter}ChargedMove`] = null
          }
        } else if (attackAction === "use" && chargedMove && chargedMove.moveName === attackType.name) {
          // Apply the charge multiplier to the damage
          damagePercent *= 1 + chargedMove.chargeLevel
          // Clear the charge after using it
          state[`${fighter}ChargedMove`] = null
        }
      }

      // Apply damage boosts from active toggles
      const activeToggles = state[`${fighter}ActiveToggles`]
      activeToggles.forEach((toggleName) => {
        const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
        if (toggleAttack && toggleAttack.movesAffected && toggleAttack.movesAffected.includes(attackType.name)) {
          damagePercent += toggleAttack.damageBoostMin!
        }
      })

      // Apply totalDamageAdjust from active toggles
      const totalDamageAdjust = activeToggles.reduce((total, toggleName) => {
        const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
        return toggleAttack && toggleAttack.totalDamageAdjust ? total + toggleAttack.totalDamageAdjust : total
      }, 0)

      let damage =
        attackType.staticDamage !== undefined
          ? attackType.staticDamage
          : Math.max(
              1,
              Math.floor(
                // For Infinite Ki Android, always use maxPowerLevel for damage calculation
                (attacker.race === "Infinite Ki Android" ? attacker.maxPowerLevel : attacker.powerLevel) *
                  damagePercent,
              ),
            )

      // Apply totalDamageAdjust
      damage = Math.max(0, Math.floor(damage * (1 + totalDamageAdjust)))

      // Apply damage adjustment
      const damageMultiplier = 1 + state.damageAdjustment / 100
      damage = Math.floor(damage * damageMultiplier)

      const isCriticalHit = attackType.criticalHitEligible && Math.random() < attackType.criticalHitDamageChance
      const criticalHitDamage = isCriticalHit ? Math.floor(damage * attackType.criticalHitDamageIncrease) : 0
      const totalDamage = damage + criticalHitDamage

      const newDefenderPowerLevel = Math.max(0, defender.powerLevel - totalDamage)
      const selfDamage = Math.floor(attacker.powerLevel * (attackType.selfDamagePercent || 0))
      const newAttackerPowerLevel = Math.max(0, attacker.powerLevel - selfDamage)

      // Calculate extra moves
      const extraMoveGranted = Math.random() < (attackType.extraMoveChance || 0)
      const extraMoveCount = extraMoveGranted ? attackType.extraMoveCount || 1 : 0

      // Update attacker
      attacker.powerLevel = newAttackerPowerLevel
      attacker.lastDamageTaken = 0
      attacker.cooldowns[attackType.name] = attackType.cooldown || 0

      // Single target attack logic (unchanged)
      if (totalDamage > 0 || selfDamage > 0 || extraMoveGranted) {
        state.pendingDefense = {
          defender: target,
          attacker: fighter,
          attackType,
          damage: totalDamage,
          extraMoveCount: extraMoveCount,
          isCriticalHit,
          selfDamage: selfDamage > 0 ? selfDamage : undefined,
          extraMoveGranted,
          newAttackerPowerLevel,
        }
      } else {
        state.pendingDefense = null
      }

      // Update defender
      // Apply damage to the defender

      // Handle ammo usage for weapons with magazine capacity
      if (attackType.magazineCapacity !== undefined) {
        attacker.remainingAmmo[attackType.name] = (attacker.remainingAmmo[attackType.name] || 0) - 1
      }

      // Update game state
      state.lastDamage = damage
      state.lastUsedMove = attackType

      // Check for game over
      const activeFighters = [
        state.fighter1,
        state.fighter2,
        state.fighter3,
        state.fighter4,
        state.fighter5,
        state.fighter6,
        state.fighter7,
        state.fighter8,
      ].filter((f) => f.powerLevel > 0)

      if (activeFighters.length === 1) {
        state.gameOver = true
        state.winner = activeFighters[0]
      }
      // Reduce cooldowns
      ;[
        state.fighter1,
        state.fighter2,
        state.fighter3,
        state.fighter4,
        state.fighter5,
        state.fighter6,
        state.fighter7,
        state.fighter8,
      ].forEach((character) => {
        Object.keys(character.cooldowns).forEach((move) => {
          character.cooldowns[move] = Math.max(0, character.cooldowns[move] - 1)
        })
      })

      // After performing an attack
      // Always call useGrantedMove
      //useGrantedMove(state, fighter, attackType.name)

      // After performing an attack, decrease the Ki Channeling attacks remaining
      const { updatedState: kiChannelingUpdatedState, logEntry: kiChannelingLogEntry } = decreaseKiChannelingCounter(
        state,
        fighter,
      )
      Object.assign(state, kiChannelingUpdatedState)
      if (kiChannelingLogEntry) {
        state.log.push(kiChannelingLogEntry)
      }

      // Reset damage adjustment after the attack
      state.damageAdjustment = 0

      // Updated extraMoves handling
      if (extraMoveGranted) {
        state.extraMoves = 1 // Set to exactly 1, not adding to existing value
        console.log(`Extra move granted to ${fighter}. extraMoves set to: ${state.extraMoves}`)
      }
      console.log(`End of performAttack. Updated extraMoves: ${state.extraMoves}`)
      useGrantedMove(state, fighter, attackType.name)
    },
    resetGame: () => initialState,

    setShowSurrenderPrompt: (state, action: PayloadAction<boolean>) => {
      state.showSurrenderPrompt = action.payload
    },

    respondToSurrender: (state, action: PayloadAction<boolean>) => {
      handleRespondToSurrender(state, action.payload)
    },

    updateChargedMove: (
      state,
      action: PayloadAction<{
        moveName: string
        chargeLevel: number
        fighter: FighterKey
      }>,
    ) => {
      const { moveName, chargeLevel, fighter } = action.payload
      state[`${fighter}ChargedMove`] = { moveName, chargeLevel }
    },

    attemptSurrender: (state, action: PayloadAction<FighterKey>) => {
      handleSurrender(state, action.payload)
    },

    setDefensePrompt: (state, action: PayloadAction<GameState["pendingDefense"]>) => {
      state.pendingDefense = action.payload
    },

    resolveDefense: (
      state,
      action: PayloadAction<{
        defenseType: AttackType
        defender: FighterKey
      }>,
    ) => {
      const { defenseType, defender } = action.payload
      const pendingDefense = state.pendingDefense

      if (!pendingDefense) {
        console.error("Cannot resolve defense: no pending defense")
        return
      }

      const attacker = state[pendingDefense.attacker]
      const defenderChar = state[defender]

      // Handle different defense types
      if (defenseType.isDodge) {
        handleDodge(state, pendingDefense, defenderChar)
      } else if (defenseType.isBlock) {
        handleBlock(state, pendingDefense, defenderChar, defenseType)
      } else if (defenseType.isReflect) {
        handleReflect(state, pendingDefense, defenderChar, defenseType)
      } else if (defenseType.isKiAbsorb) {
        handleKiAbsorb(state, pendingDefense, defenderChar, defenseType)
      } else {
        // Handle "Nothing" or other defense types
        const damage = pendingDefense.damage

        // Apply armor damage reduction if applicable
        let finalDamage = damage
        const activeToggles = state[`${defender}ActiveToggles`] as string[]
        const armorAttacks = ATTACK_TYPES.filter(
          (attack) => attack.isArmor && activeToggles.includes(attack.name),
        )

        for (const armorAttack of armorAttacks) {
          const armorDamageReduction = calculateArmorDamageReduction(armorAttack)
          finalDamage = applyArmorReduction(
            finalDamage,
            armorDamageReduction,
            pendingDefense.attackType.piercing || false,
          )

          // Update armor health
          updateArmorHealth(state, defender, armorAttack, damage)
        }

        defenderChar.powerLevel = Math.max(0, defenderChar.powerLevel - finalDamage)

        state.log.push({
          turn: state.turn,
          attacker: limitString(attacker.name),
          defender: limitString(defenderChar.name),
          attackType: "No Defense",
          damage: finalDamage,
          remainingPowerLevel: defenderChar.powerLevel,
        })

        if (defenderChar.powerLevel <= 0) {
          state.gameOver = true
          state.winner = attacker
        }
      }

      state.pendingDefense = null
      state.currentTurn = pendingDefense.attacker
    },

    autoSkipTurn: (state) => {
      autoSkipTurnHandler(state)
    },

    updateFighterConfig: (state, action: PayloadAction<{ fighter: string; config: FighterConfig }>) => {
      const { fighter, config } = action.payload
      state[fighter as keyof typeof state] = createCharacter(config)
    },

    adjustPowerLevels: (state, action: PayloadAction<Record<string, { current: number; max: number }>>) => {
      Object.entries(action.payload).forEach(([fighter, { current, max }]) => {
        if (state[fighter as keyof typeof state]) {
          ;(state[fighter as keyof typeof state] as Character).powerLevel = current
          ;(state[fighter as keyof typeof state] as Character).maxPowerLevel = max
        }
      })
    },

    adjustDamage: (state, action: PayloadAction<number>) => {
      state.damageAdjustment = action.payload
    },

    rollbackTurn: (state, action: PayloadAction<number>) => {
      handleRollback(state, action.payload)
    },

    toggleAutoSkip: (state, action: PayloadAction<string>) => {
      const fighter = action.payload
      if (state[fighter as keyof typeof state]) {
        ;(state[fighter as keyof typeof state] as Character).autoSkip = !(
          state[fighter as keyof typeof state] as Character
        ).autoSkip
      }
    },

    adjustArmorHealth: (
      state,
      action: PayloadAction<{ fighter: string; armorName: string; newHealth: number }>,
    ) => {
      const { fighter, armorName, newHealth } = action.payload
      const armorAttack = ATTACK_TYPES.find((attack) => attack.name === armorName)
      if (armorAttack) {
        armorAttack.currentArmorHealth = newHealth
      }
    },
  },
})

export const {
  performAttack,
  resetGame,
  setShowSurrenderPrompt,
  respondToSurrender,
  updateChargedMove,
  attemptSurrender,
  setDefensePrompt,
  resolveDefense,
  autoSkipTurn,
  updateFighterConfig,
  adjustPowerLevels,
  adjustDamage,
  rollbackTurn,
  toggleAutoSkip,
  adjustArmorHealth,
} = gameSlice.actions

export default gameSlice.reducer

function applyArmorReduction(damage: number, armorDamageReduction: number, piercing: boolean): number {
  return piercing ? damage : Math.max(0, damage - armorDamageReduction)
}

function limitString(str: string, maxLength = 1000): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str
}
