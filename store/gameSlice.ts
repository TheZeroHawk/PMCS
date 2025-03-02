import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Character, AttackType, FighterConfig } from "../types"
import type { GameState } from "../types/gameState"
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

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    performAttack: (
      state,
      action: PayloadAction<{
        attackType: AttackType
        action: "use" | "charge" | "toggle"
        fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"
        target: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"
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
    resetGame: (state) => {
      const newState = { ...initialState }
      Object.keys(state).forEach((key) => {
        if (key.startsWith("fighter") && key.length === 8 && state[key]) {
          newState[key] = createCharacter({
            name: state[key].name,
            basePowerLevel: state[key].basePowerLevel,
            currentPowerLevel: state[key].basePowerLevel,
            moveset: state[key].moves,
            itemUses: state[key].itemUses,
            autoSkip: state[key].autoSkip,
          })
        }
      })
      return newState
    },
    setShowSurrenderPrompt: (state, action: PayloadAction<boolean>) => {
      state.showSurrenderPrompt = action.payload
    },
    respondToSurrender: (state, action: PayloadAction<boolean>) => {
      const { updatedState } = handleRespondToSurrender(state, action.payload)
      Object.assign(state, updatedState)
    },
    updateChargedMove: (
      state,
      action: PayloadAction<{
        moveName: string
        chargeLevel: number
        fighter: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"
      }>,
    ) => {
      const { moveName, chargeLevel, fighter } = action.payload
      state[`${fighter}ChargedMove`] = { moveName, chargeLevel }
    },
    attemptSurrender: (
      state,
      action: PayloadAction<
        "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"
      >,
    ) => {
      const { updatedState } = handleSurrender(
        state,
        state[action.payload],
        state[
          action.payload === "fighter1"
            ? "fighter2"
            : action.payload === "fighter2"
              ? "fighter3"
              : action.payload === "fighter3"
                ? "fighter4"
                : action.payload === "fighter4"
                  ? "fighter5"
                  : action.payload === "fighter5"
                    ? "fighter6"
                    : action.payload === "fighter6"
                      ? "fighter7"
                      : action.payload === "fighter7"
                        ? "fighter8"
                        : "fighter1"
        ],
        { name: "Surrender" } as AttackType,
        action.payload,
      )
      Object.assign(state, updatedState)
    },
    setDefensePrompt: (state, action: PayloadAction<GameState["pendingDefense"]>) => {
      state.pendingDefense = action.payload
    },
    resolveDefense: (
      state,
      action: PayloadAction<{
        defenseType: AttackType
        defender: "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"
      }>,
    ) => {
      const { defenseType, defender } = action.payload
      let attackerKey: string
      let attackType: AttackType

      if (state.pendingDefense) {
        attackerKey = state.pendingDefense.attacker
        attackType = state.pendingDefense.attackType
        const { damage, extraMoveCount, isCriticalHit, selfDamage, extraMoveGranted, newAttackerPowerLevel } =
          state.pendingDefense

        const attacker = state[attackerKey]

        // Ensure attacker and defender are valid fighter keys
        const validFighters = [
          "fighter1",
          "fighter2",
          "fighter3",
          "fighter4",
          "fighter5",
          "fighter6",
          "fighter7",
          "fighter8",
        ]
        if (!validFighters.includes(attackerKey) || !validFighters.includes(defender)) {
          console.error("Invalid attacker or defender:", { attacker: attackerKey, defender })
          useGrantedMove(state, attackerKey, attackType.name)
          return
        }

        // Add null checks for attacker and defender
        if (!state[attackerKey] || !state[defender]) {
          console.error("Attacker or defender is null:", { attacker: attackerKey, defender })
          useGrantedMove(state, attackerKey, attackType.name)
          return
        }

        let finalDamage = damage
        let defenseResult = "fail"
        const chargeCleared = false
        let chargeNote = ""

        let dodgeChance = 0
        let dodgeSuccessful = false // Initialize dodgeSuccessful flag
        // Dodge mechanics
        if (defenseType.isDodge) {
          const dodgeResult = handleDodge(state, attackerKey, defender, attackType)
          dodgeChance = dodgeResult.dodgeChance

          if (dodgeResult.dodgeSuccess) {
            finalDamage = 0
            defenseResult = "full"
            // If dodge is successful, set a flag to prevent stun application
            dodgeSuccessful = true
          }
        }

        // Block mechanics
        if (defenseType.isBlock) {
          const blockResult = handleBlock(state, attackerKey, defender, attackType, defenseType, damage)
          defenseResult = blockResult.defenseResult
          finalDamage = blockResult.finalDamage
        }

        // Reflect mechanics
        if (defenseType.isReflect) {
          const reflectResult = handleReflect(state, attackerKey, defender, attackType, defenseType, damage)
          finalDamage = reflectResult.finalDamage
          defenseResult = reflectResult.defenseResult
          chargeNote = reflectResult.chargeNote
        }

        let kiAbsorbSuccessful = false // New flag to track Ki Absorb success

        // Ki Absorb mechanics
        if (defenseType.isKiAbsorb && attackType.usesKi) {
          const kiAbsorbResult = handleKiAbsorb(state, attackerKey, defender, attackType, defenseType, finalDamage)
          finalDamage = kiAbsorbResult.finalDamage
          defenseResult = kiAbsorbResult.defenseResult
          chargeNote = kiAbsorbResult.chargeNote

          if (kiAbsorbResult.absorptionSuccess) {
            state[defender].powerLevel += kiAbsorbResult.absorbedEnergy
            state[defender].maxPowerLevel += kiAbsorbResult.absorbedEnergy
            kiAbsorbSuccessful = true // Set the flag when Ki Absorb is successful
          }
        }

        // Apply armor damage reduction
        const armorDamageReduction = calculateArmorDamageReduction(defender, state)
        finalDamage = applyArmorReduction(finalDamage, armorDamageReduction, attackType.piercing || false)

        // Update defender's power level
        state[defender].powerLevel = Math.max(0, state[defender].powerLevel - finalDamage)

        // Apply damage to the defender's armor
        updateArmorHealth(defender, state, finalDamage)

        // Apply stun effect after defense resolution, with exception for Ki Absorb
        if (
          !dodgeSuccessful && // Only check if dodge was unsuccessful
          attackType.stunChance &&
          Math.random() < attackType.stunChance &&
          (finalDamage > 0 || kiAbsorbSuccessful) // Allow stun chance if damage > 0 OR Ki Absorb was successful
        ) {
          state.stunStatus[defender] = {
            isStunned: true,
            turnsRemaining: attackType.stunDuration || 1,
          }
          chargeNote += ` ${state[defender].name} is stunned for ${attackType.stunDuration || 1} turn(s)!`
        }

        // Clear the charge if the defense is not "Nothing"
        if (defenseType.name !== "Nothing") {
          state[`${defender}ChargedMove`] = null
        }

        // Log the attack and defense as a single event
        state.log.push({
          turn: state.turn,
          attacker: limitString(state[attackerKey].name),
          defender: limitString(state[defender].name),
          attackType: limitString(attackType.name),
          defenseType: limitString(defenseType.name),
          damage: finalDamage,
          remainingPowerLevel: state[defender].powerLevel,
          blockResult: defenseResult as "partial" | "full" | "fail" | "absorbed" | "reflected",
          dodgeChance: defenseType.isDodge ? dodgeChance : undefined,
          extraMoveGranted: extraMoveGranted,
          extraMoveCount: extraMoveCount,
          isCriticalHit: isCriticalHit,
          selfDamage: selfDamage,
          attackerRemainingPowerLevel: newAttackerPowerLevel,
          damagePreventedNote:
            defenseResult === "full" && defenseType.isDodge
              ? "Dodge successful! All damage prevented."
              : defenseResult === "partial"
                ? "1/4 of the damage was prevented"
                : defenseResult === "full"
                  ? "1/2 of the damage was prevented"
                  : defenseResult === "absorbed"
                    ? `Ki Absorb successful! All damage prevented.`
                    : defenseResult === "reflected"
                      ? `Reflect successful! All damage reflected.`
                      : undefined,
          chargeCleared: chargeCleared,
          extraNote:
            defenseResult === "absorbed" || defenseResult === "reflected"
              ? chargeNote
              : chargeCleared
                ? chargeNote
                : state.stunStatus[defender].isStunned
                  ? chargeNote
                  : undefined,
          isPiercing: attackType.piercing || false,
        })

        // Update game state
        state.lastDamage = finalDamage
        state.lastUsedMove = attackType

        // Handle extra moves
        if (extraMoveGranted) {
          state.extraMoves = 1 // Ensure only 1 extra move is granted
          /*state.log.push({
            turn: state.turn,
            attacker: limitString(state[attacker].name),
            defender: limitString(state[defender].name),
            attackType: "Extra Move Granted",
            damage: 0,
            remainingPowerLevel: state[attacker].powerLevel,
            extraNote: `${state[attacker].name} gained an extra move.`,
          })*/
          console.log(`Extra move confirmed for ${attackerKey}. extraMoves set to: ${state.extraMoves}`)
        }

        // Clear the pending defense
        state.pendingDefense = null

        // Advance turn if no extra moves
        if (state.extraMoves > 0) {
          state.extraMoves -= 1
          console.log(`Extra move used. extraMoves now: ${state.extraMoves}`)
          // Do not change the current turn, allowing the same fighter to go again
        } else {
          state.turn += 1
          state.currentTurn = getNextFighter(attackerKey, state)
          console.log(`Turn advanced. New current turn: ${state.currentTurn}`)
        }
      }
      useGrantedMove(state, attackerKey, attackType.name)
    },
    autoSkipTurn: (state) => {
      return autoSkipTurnHandler(state)
    },
    updateFighterConfig: (state, action: PayloadAction<{ fighter: string; config: FighterConfig }>) => {
      const { fighter, config } = action.payload
      state[fighter as keyof typeof state] = createCharacter(config)
    },
    adjustPowerLevels: (state, action: PayloadAction<Record<string, { current: number; max: number }>>) => {
      Object.entries(action.payload).forEach(([fighter, levels]) => {
        if (state[fighter as keyof typeof state]) {
          const fighterState = state[fighter as keyof typeof state] as Character
          fighterState.powerLevel = levels.current
          fighterState.maxPowerLevel = levels.max
          // Ensure current power level doesn't exceed max power level
          if (fighterState.powerLevel > fighterState.maxPowerLevel) {
            fighterState.powerLevel = fighterState.maxPowerLevel
          }
        }
      })
    },
    adjustDamage: (state, action: PayloadAction<number>) => {
      state.damageAdjustment = action.payload
    },
    rollbackTurn: (state, action: PayloadAction<number>) => {
      return handleRollback(state, action.payload)
    },
    toggleAutoSkip: (state, action: PayloadAction<string>) => {
      const fighter = action.payload
      if (state[fighter as keyof typeof state] && typeof state[fighter as keyof typeof state] === "object") {
        const fighterState = state[fighter as keyof typeof state] as Character
        fighterState.autoSkip = !fighterState.autoSkip
      }
    },
    adjustArmorHealth: (state, action: PayloadAction<{ fighter: string; armorName: string; newHealth: number }>) => {
      const { fighter, armorName, newHealth } = action.payload
      const fighterActiveToggles = state[`${fighter}ActiveToggles` as keyof GameState] as string[]
      const armorIndex = fighterActiveToggles.findIndex((toggle) => toggle === armorName)

      if (armorIndex !== -1) {
        const armorAttack = ATTACK_TYPES.find((attack) => attack.name === armorName)
        if (armorAttack && armorAttack.isArmor) {
          armorAttack.currentArmorHealth = Math.max(0, Math.min(newHealth, armorAttack.maximumArmorHealth || 0))
        }
      }
    },
  },
})

export const {
  performAttack,
  resetGame,
  setShowSurrenderPrompt,
  updateChargedMove,
  attemptSurrender,
  respondToSurrender,
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

export function applyArmorReduction(damage: number, armorDamageReduction: number, piercing: boolean): number {
  if (piercing) return damage
  return Math.max(0, Math.floor(damage * (1 - armorDamageReduction)))
}

function limitString(str: string, maxLength = 1000): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str
}

