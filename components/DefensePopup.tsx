import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ATTACK_TYPES } from "@/config/moves"
import { resolveDefense } from "@/store/gameSlice"
import type { RootState } from "@/store/store"
import type { AttackType, GameState } from "@/types"
import { calculateDodgeChance } from "@/utils/dodgeChanceCalculator"
import { getGrantedMoves } from "@/hooks/useGrantedMoves"

type FighterKey = "fighter1" | "fighter2" | "fighter3" | "fighter4" | "fighter5" | "fighter6" | "fighter7" | "fighter8"

interface DefensePopupProps {
  pendingDefense: {
    defender: FighterKey
    attacker: FighterKey
    attackType: AttackType
    damage: number
  }
  attackerPowerLevel: number
  defenderPowerLevel: number
  defenderMoveset: string[]
  gameState: GameState
}

export const DefensePopup: React.FC<DefensePopupProps> = ({
  pendingDefense,
  attackerPowerLevel,
  defenderPowerLevel,
  defenderMoveset,
  gameState,
}) => {
  const dispatch = useDispatch()
  const pendingDefenseState = useSelector((state: RootState) => state.game.pendingDefense)
  const isDefenderCharging = useSelector(
    (state: RootState) => state.game[`${pendingDefense.defender}ChargedMove` as keyof GameState] !== null,
  )

  if (!pendingDefense || !pendingDefenseState) {
    console.log("No valid pending defense, not rendering DefensePopup")
    return null
  }

  const defenseMoves = ATTACK_TYPES.filter((move) => {
    const isDefenseMove = move.category === "Defense" && move.showInDefensePopup
    const isInDefenderMoveset = defenderMoveset.includes(move.name)
    const isGrantedMove = getGrantedMoves(pendingDefense.defender, gameState).includes(move.name)
    return isDefenseMove && (isInDefenderMoveset || isGrantedMove)
  })

  const dodgeChance = calculateDodgeChance(
    gameState,
    pendingDefense.attacker,
    pendingDefense.defender,
    pendingDefense.attackType,
  )

  const handleDefense = (defenseType: AttackType) => {
    if (!pendingDefense) {
      console.error("Cannot handle defense: pendingDefense is null")
      return
    }
    console.log("Defense selected:", defenseType.name)
    dispatch(resolveDefense({ defenseType, defender: pendingDefense.defender }))
    console.log("Defense resolved, pendingDefense should now be null")
  }

  const availableDefenseMoves = defenseMoves.filter(
    (move) => move.isDodge || move.isBlock || move.isKiAbsorb || move.name === "Nothing" || move.isReflect,
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-800 border-2 border-purple-500 shadow-lg">
        <CardHeader className="bg-gray-700">
          <CardTitle className="text-2xl text-white text-center">
            {gameState[pendingDefense.defender].name}! Incoming Attack!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-white mb-4 text-center">
            <span className="font-bold text-yellow-400">{gameState[pendingDefense.attacker].name}</span> is attacking
            with <span className="font-bold text-red-400">{pendingDefense.attackType.name}</span> for{" "}
            <span className="font-bold text-green-400">{pendingDefense.damage}</span> damage.
          </p>
          <p className="text-white mb-6 text-center font-semibold">Choose your defense:</p>
          <div className="grid grid-cols-2 gap-4">
            {availableDefenseMoves.map((move) => (
              <Button
                key={move.name}
                onClick={() => handleDefense(move)}
                className="w-full py-3 text-lg font-semibold transition-colors duration-200"
                variant={move.name === "Nothing" ? "destructive" : "default"}
              >
                {move.name === "Dodge" ? `${move.name} (${(dodgeChance * 100).toFixed(1)}%)` : move.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
