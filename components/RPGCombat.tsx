"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FightLog } from "@/components/FightLog"
import type { AttackType, Character } from "@/types"
import type { GameState } from "@/types/gameState"
import { MOVE_CATEGORIES, ATTACK_TYPES } from "@/config/moves"
import { AttackButton } from "@/utils/AttackButton"
import type { RootState, AppDispatch } from "@/store/store"
import {
  performAttack,
  resetGame,
  attemptSurrender,
  respondToSurrender,
  autoSkipTurn,
  rollbackTurn,
} from "@/store/gameSlice"
import { DefensePopup } from "@/components/DefensePopup"
import { FighterConfigPopup } from "@/components/FighterConfigPopup"
import { RefCheatsPopup } from "@/components/RefCheatsPopup"
import TitleComponent from "@/components/TitleComponent"

type FighterKey = "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"

const getGrantedMoves = (fighter: FighterKey, gameState: GameState): string[] => {
  const activeToggles = getActiveToggles(gameState, fighter)
  const grantedMoves: string[] = []

  activeToggles.forEach((toggleName: string) => {
    const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
    if (toggleAttack && toggleAttack.grantedMoves) {
      toggleAttack.grantedMoves.forEach((grantedMove) => {
        if (grantedMove.uses > 0) {
          grantedMoves.push(grantedMove.moveName)
        }
      })
    }
  })

  return grantedMoves
}

const getGrantedMoveUses = (
  gameState: GameState,
  fighter: FighterKey,
  moveName: string,
): number | undefined => {
  const activeToggles = getActiveToggles(gameState, fighter)
  for (const toggleName of activeToggles) {
    const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
    if (toggleAttack && toggleAttack.grantedMoves) {
      const grantedMove = toggleAttack.grantedMoves.find((move) => move.moveName === moveName)
      if (grantedMove) {
        return grantedMove.uses
      }
    }
  }
  return undefined
}

const getActiveToggles = (state: GameState, fighter: FighterKey): string[] => {
  const key = `${fighter}ActiveToggles` as const
  return state[key]
}

const getChargedMove = (state: GameState, fighter: FighterKey) => {
  const key = `${fighter}ChargedMove` as const
  return state[key]
}

const getKiChanneling = (state: GameState, fighter: FighterKey) => {
  const key = `${fighter}KiChanneling` as const
  return state[key]
}

const getFighter = (state: GameState, fighter: FighterKey): Character => {
  return state[fighter]
}

export const RPGCombat = () => {
  const dispatch = useDispatch<AppDispatch>()
  const gameState = useSelector((state: RootState) => state.game)
  const currentDamageAdjustment = useSelector((state: RootState) => state.game.damageAdjustment)
  const [animatedPowerLevels, setAnimatedPowerLevels] = React.useState<Record<FighterKey, number>>({
    fighter1: 0,
    fighter2: 0,
    fighter3: 0,
    fighter4: 0,
    fighter5: 0,
    fighter6: 0,
    fighter7: 0,
    fighter8: 0,
  })
  const [showSurrenderResult, setShowSurrenderResult] = React.useState<"accepted" | "rejected" | null>(null)
  const [currentTargets, setCurrentTargets] = React.useState<Record<FighterKey, FighterKey>>({
    fighter1: "fighter2",
    fighter2: "fighter1",
    fighter3: "fighter1",
    fighter4: "fighter1",
    fighter5: "fighter1",
    fighter6: "fighter1",
    fighter7: "fighter1",
    fighter8: "fighter1",
  })
  const [showConfigPopup, setShowConfigPopup] = React.useState(false)
  const [showRefCheatsPopup, setShowRefCheatsPopup] = React.useState(false)

  React.useEffect(() => {
    setAnimatedPowerLevels({
      fighter1: getFighter(gameState, "fighter1").powerLevel,
      fighter2: getFighter(gameState, "fighter2").powerLevel,
      fighter3: getFighter(gameState, "fighter3").powerLevel,
      fighter4: getFighter(gameState, "fighter4").powerLevel,
      fighter5: getFighter(gameState, "fighter5").powerLevel,
      fighter6: getFighter(gameState, "fighter6").powerLevel,
      fighter7: getFighter(gameState, "fighter7").powerLevel,
      fighter8: getFighter(gameState, "fighter8").powerLevel,
    })
  }, [
    getFighter(gameState, "fighter1").powerLevel,
    getFighter(gameState, "fighter2").powerLevel,
    getFighter(gameState, "fighter3").powerLevel,
    getFighter(gameState, "fighter4").powerLevel,
    getFighter(gameState, "fighter5").powerLevel,
    getFighter(gameState, "fighter6").powerLevel,
    getFighter(gameState, "fighter7").powerLevel,
    getFighter(gameState, "fighter8").powerLevel,
  ])

  React.useEffect(() => {
    if (gameState.log.length > 0) {
      const lastLogEntry = gameState.log[gameState.log.length - 1]
      if (lastLogEntry.attackType === "Surrender Accepted") {
        setShowSurrenderResult("accepted")
      } else if (lastLogEntry.attackType === "Surrender Declined") {
        setShowSurrenderResult("rejected")
      }
    }
  }, [gameState.log])

  React.useEffect(() => {
    if (gameState.gameOver) {
      setShowSurrenderResult(null)
    }
  }, [gameState.gameOver])

  React.useEffect(() => {
    const buttons = document.querySelectorAll("button")
    if (gameState.pendingDefense) {
      // Disable attack buttons when defense is pending
      buttons.forEach((button) => {
        const attackType = ATTACK_TYPES.find((attack) => attack.name === button.textContent)
        if (attackType && attackType.category !== "Defense" && !button.textContent?.includes("Continue Battle")) {
          button.setAttribute("disabled", "true")
        }
      })
    } else {
      // Re-enable all buttons when defense is resolved
      buttons.forEach((button) => button.removeAttribute("disabled"))
    }
  }, [gameState.pendingDefense])

  React.useEffect(() => {
    if (
      gameState.currentTurn &&
      getFighter(gameState, gameState.currentTurn as FighterKey) &&
      (getFighter(gameState, gameState.currentTurn as FighterKey).autoSkip || gameState.stunStatus[gameState.currentTurn]?.isStunned)
    ) {
      dispatch(autoSkipTurn())
    }
  }, [gameState.currentTurn, dispatch, gameState])

  const handleAttack = (
    attackType: AttackType,
    action: "use" | "charge" = "use",
    fighter: FighterKey,
    targets?: { [key: string]: number },
  ) => {
    if (attackType.name === "Surrender" && action === "use") {
      dispatch(attemptSurrender(fighter))
    } else if (attackType.canBeCharged) {
      dispatch(performAttack({ attackType, action, fighter, target: currentTargets[fighter], targets }))
    } else if (attackType.isToggle) {
      dispatch(performAttack({ attackType, action: "toggle", fighter, target: currentTargets[fighter], targets }))
    } else {
      dispatch(performAttack({ attackType, action, fighter, target: currentTargets[fighter], targets }))
    }
  }

  const getArmorHealth = (fighter: FighterKey, attackType: AttackType) => {
    const activeToggles = getActiveToggles(gameState, fighter)
    const armorToggle = ATTACK_TYPES.find(
      (attack) => attack.name === attackType.name && attack.isArmor && activeToggles.includes(attack.name),
    )

    if (armorToggle && armorToggle.currentArmorHealth !== undefined && armorToggle.maximumArmorHealth !== undefined) {
      return {
        current: armorToggle.currentArmorHealth,
        max: armorToggle.maximumArmorHealth,
      }
    }

    return undefined
  }

  const renderAttackButtons = (category: string, fighter: FighterKey) => {
    const currentFighter = getFighter(gameState, fighter)
    const chargedMove = getChargedMove(gameState, fighter)
    if (!currentFighter?.moves) return null

    const grantedMoves = getGrantedMoves(fighter, gameState)
    const attacksInCategory = ATTACK_TYPES.filter(
      (attack) =>
        attack.category === category &&
        (attack.isCombatMove || attack.name === "Surrender") &&
        (currentFighter.moves.includes(attack.name) || grantedMoves.includes(attack.name)),
    )

    // Only render the Transformations category if the fighter has transformation moves
    if (category === "Transformations" && attacksInCategory.length === 0) {
      return null
    }

    return (
      <div key={`${category}-${fighter}`} className="mb-6">
        <h3 className="text-lg font-semibold mb-2 gradient-text">{category}</h3>
        <div
          className={`flex flex-wrap gap-2 ${category === "Special" || category === "Transformations" ? "w-full grid grid-cols-2" : ""}`}
        >
          {attacksInCategory.length > 0 ? (
            attacksInCategory.map((attackType: AttackType) => (
              <AttackButton
                key={`${attackType.name}-${fighter}`}
                attackType={attackType}
                disabled={
                  gameState.gameOver ||
                  (currentFighter.cooldowns[attackType.name] > 0 && attackType.name !== "Surrender") ||
                  gameState.pendingSurrender !== null ||
                  gameState.pendingDefense !== null ||
                  gameState.currentTurn !== fighter
                }
                isCurrentTurn={gameState.currentTurn === fighter}
                onAttack={(action) => handleAttack(attackType, action, fighter)}
                cooldown={currentFighter.cooldowns[attackType.name]}
                remainingAmmo={
                  attackType.magazineCapacity !== undefined ? currentFighter.remainingAmmo[attackType.name] : undefined
                }
                remainingItemUses={
                  attackType.isHealingMove && !attackType.usesKi ? currentFighter.itemUses[attackType.name] : undefined
                }
                isActive={getActiveToggles(gameState, fighter).includes(attackType.name)}
                lastUsedMove={gameState.lastUsedMove}
                chargeLevel={
                  chargedMove?.moveName === attackType.name
                    ? chargedMove.chargeLevel ?? 0
                    : 0
                }
                category={category}
                width={category === "Special" || category === "Transformations" ? "w-full" : "w-40"}
                attackerPowerLevel={getFighter(gameState, fighter === "fighter1" ? "fighter2" : "fighter1").powerLevel}
                defenderPowerLevel={currentFighter.powerLevel}
                activeToggles={getActiveToggles(gameState, fighter)}
                armorHealth={getArmorHealth(fighter, attackType)}
                grantedMoveUses={getGrantedMoveUses(gameState, fighter, attackType.name)}
              />
            ))
          ) : (
            <p key={`${category}-${fighter}-no-options`} className="text-sm text-gray-400">
              No options available
            </p>
          )}
        </div>
      </div>
    )
  }

  const renderPowerLevel = (
    character: Character,
    animatedPowerLevel: number,
    fighter: FighterKey,
  ) => {
    if (character.autoSkip) return null
    const activeFighterCount = getActiveFilterCount()
    const gridClass =
      activeFighterCount === 1
        ? "col-span-full"
        : activeFighterCount === 2
          ? "col-span-6"
          : activeFighterCount === 3
            ? "col-span-4"
            : activeFighterCount === 4
              ? "col-span-3"
              : "col-span-2"

    return (
      <Card
        className={`bg-gradient-to-b from-gray-800 to-gray-900 border-2 ${
          gameState.currentTurn === fighter ? "border-yellow-500" : "border-purple-500"
        } ${gridClass}`}
      >
        <CardHeader>
          <CardTitle className="text-2xl text-white">
            {character.name}
            {gameState.currentTurn === fighter && <span className="ml-2 text-yellow-500">(Current Turn)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-2 text-white">
            Power Level: {character.powerLevel} / {character.basePowerLevel}
          </p>
          <div className="w-full h-6 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-700 transition-all duration-500 ease-in-out"
              style={{
                width: `${100 - (animatedPowerLevel / character.basePowerLevel) * 100}%`,
                float: "right",
              }}
            />
          </div>
          {getKiChanneling(gameState, fighter) && (
            <p className="text-sm text-yellow-400 mt-2">
              Ki Channeling Active: {getKiChanneling(gameState, fighter)?.attacksRemaining} attacks remaining
            </p>
          )}
          {gameState.stunStatus[fighter].isStunned && (
            <p className="text-sm text-red-400 mt-2">
              Stunned: {gameState.stunStatus[fighter].turnsRemaining} turn(s) remaining
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  const getActiveFilterCount = () => {
    return Object.values(gameState).filter(
      (fighter): fighter is Character =>
        typeof fighter === "object" && fighter !== null && "autoSkip" in fighter && !fighter.autoSkip,
    ).length
  }

  const handleRespondToSurrender = (accept: boolean) => {
    dispatch(respondToSurrender(accept))
  }

  const SurrenderResponsePrompt = () => {
    const surrenderingFighter = gameState.pendingSurrender ? getFighter(gameState, gameState.pendingSurrender) : null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-96 bg-gray-800 border-2 border-purple-500">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Surrender Attempt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">{surrenderingFighter?.name} is attempting to surrender. Do you accept?</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => handleRespondToSurrender(true)} className="bg-green-500 hover:bg-green-600">
              Accept Surrender
            </Button>
            <Button onClick={() => handleRespondToSurrender(false)} className="bg-red-500 hover:bg-red-600">
              Decline Surrender
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const SurrenderResultPrompt = ({ result }: { result: "accepted" | "rejected" }) => {
    const handleClick = () => {
      setShowSurrenderResult(null)
      if (result === "accepted") {
        dispatch(resetGame())
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-96 bg-gray-800 border-2 border-purple-500">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Surrender {result === "accepted" ? "Accepted" : "Rejected"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">
              {result === "accepted"
                ? "The surrender has been accepted. The battle is over."
                : "The surrender has been rejected. The battle continues!"}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleClick} className="w-full">
              {result === "accepted" ? "Start New Game" : "Continue Fighting"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const renderTargetSelector = (currentFighter: FighterKey) => {
    const fighters = [
      "fighter1",
      "fighter2",
      "fighter3",
      "fighter4",
      "fighter5",
      "fighter6",
      "fighter7",
      "fighter8"
    ] satisfies FighterKey[];
    const activeFighters = fighters.filter(fighter => fighter !== currentFighter && !getFighter(gameState, fighter).autoSkip)

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 gradient-text">Select Attack Target</h3>
        <Select
          onValueChange={(value) =>
            setCurrentTargets((prev) => ({ ...prev, [currentFighter]: value as FighterKey }))
          }
          value={currentTargets[currentFighter]}
        >
          <SelectTrigger className="w-full mb-4 bg-gray-700 border-2 border-purple-500 text-white hover:bg-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <SelectValue placeholder="Select target" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-2 border-purple-500">
            {activeFighters.map((fighter) => (
              <SelectItem key={fighter} value={fighter} className="text-white hover:bg-purple-700">
                {getFighter(gameState, fighter).name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  const handleRollbackTurn = () => {
    const previousTurn = Math.max(0, gameState.turn - 2)
    dispatch(rollbackTurn(previousTurn))
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <TitleComponent version="v1.0.6" />
      {gameState && (
        <div className="grid grid-cols-12 gap-4 mb-8">
          {renderPowerLevel(getFighter(gameState, "fighter1"), animatedPowerLevels.fighter1, "fighter1")}
          {renderPowerLevel(getFighter(gameState, "fighter2"), animatedPowerLevels.fighter2, "fighter2")}
          {renderPowerLevel(getFighter(gameState, "fighter3"), animatedPowerLevels.fighter3, "fighter3")}
          {renderPowerLevel(getFighter(gameState, "fighter4"), animatedPowerLevels.fighter4, "fighter4")}
          {renderPowerLevel(getFighter(gameState, "fighter5"), animatedPowerLevels.fighter5, "fighter5")}
          {renderPowerLevel(getFighter(gameState, "fighter6"), animatedPowerLevels.fighter6, "fighter6")}
          {renderPowerLevel(getFighter(gameState, "fighter7"), animatedPowerLevels.fighter7, "fighter7")}
          {renderPowerLevel(getFighter(gameState, "fighter8"), animatedPowerLevels.fighter8, "fighter8")}
        </div>
      )}
      {gameState && (
        <div className="mb-4 text-center">
          <Button onClick={handleRollbackTurn} className="button-gradient text-lg px-8 py-3">
            Rollback Turn
          </Button>
        </div>
      )}
      {gameState && gameState.currentTurn && (
        <div className="mb-8">
          <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-4">
            {renderTargetSelector(gameState.currentTurn as FighterKey)}
            {MOVE_CATEGORIES.map((category) => renderAttackButtons(category, gameState.currentTurn as FighterKey))}
          </div>
        </div>
      )}
      {currentDamageAdjustment !== 0 && (
        <div className="mb-4 p-2 bg-yellow-500 text-black rounded-md text-center">
          Current Damage Adjustment: {currentDamageAdjustment}%
        </div>
      )}
      <div className="mb-8">
        <FightLog log={gameState.log} />
      </div>
      {gameState && gameState.gameOver && (
        <div className="mb-8 text-center animate-float">
          <p className="text-3xl font-bold gradient-text mb-4">
            Game Over! {gameState.winner && typeof gameState.winner === 'string' ? getFighter(gameState, gameState.winner as FighterKey)?.name : 'Unknown'} wins!
          </p>
        </div>
      )}
      {gameState.pendingSurrender && <SurrenderResponsePrompt />}
      {showSurrenderResult && <SurrenderResultPrompt result={showSurrenderResult} />}
      <div className="mt-8 text-center">
        <Button onClick={() => setShowConfigPopup(true)} className="button-gradient text-lg px-8 py-3 mr-4">
          Configure Fighters
        </Button>
        <Button onClick={() => setShowRefCheatsPopup(true)} className="button-gradient text-lg px-8 py-3 mr-4">
          Ref Cheats
        </Button>
        <Button onClick={handleRollbackTurn} className="button-gradient text-lg px-8 py-3 mr-4">
          Rollback Turn
        </Button>
        <Button onClick={() => dispatch(resetGame())} className="button-gradient text-lg px-8 py-3">
          Restart Fight
        </Button>
      </div>
      {gameState.pendingDefense && (
        <DefensePopup
          pendingDefense={gameState.pendingDefense}
          attackerPowerLevel={getFighter(gameState, gameState.pendingDefense.attacker).powerLevel}
          defenderPowerLevel={getFighter(gameState, gameState.pendingDefense.defender).powerLevel}
          defenderMoveset={getFighter(gameState, gameState.pendingDefense.defender).moves}
          gameState={gameState}
        />
      )}
      <FighterConfigPopup isOpen={showConfigPopup} onClose={() => setShowConfigPopup(false)} />
      <RefCheatsPopup isOpen={showRefCheatsPopup} onClose={() => setShowRefCheatsPopup(false)} />
    </div>
  )
}

export default RPGCombat
