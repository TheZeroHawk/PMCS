"use client"

import type React from "react"
import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { closeBeamClashPopup } from "../store/gameSlice"
import type { RootState } from "../store/store"

export const BeamClashPopup: React.FC = () => {
  const dispatch = useDispatch()
  const beamClashInfo = useSelector((state: RootState) => state.game.beamClashInfo)

  const handleClose = useCallback(() => {
    console.log("Close button clicked")
    dispatch(closeBeamClashPopup())
    console.log("closeBeamClashPopup action dispatched")
  }, [dispatch])

  if (!beamClashInfo) return null

  console.log("Rendering BeamClashPopup", { beamClashInfo })

  const {
    attacker1,
    attacker2,
    attack1,
    attack2,
    damage1,
    damage2,
    winningAttack,
    winningAttacker,
    losingDefender,
    actualDamage,
    healedDamage,
  } = beamClashInfo

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-gray-800 border-2 border-purple-500 shadow-lg">
        <CardHeader className="bg-gray-700">
          <CardTitle className="text-3xl text-white text-center">Epic Beam Clash!</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-blue-400 mb-6 text-center text-lg">
            The previous attack's damage of {healedDamage} was undone due to the Beam Clash!
          </p>
          <p className="text-white mb-4 text-center text-lg leading-relaxed">
            The battlefield erupts in a blinding flash as two powerful ki attacks collide mid-air!
          </p>
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <p className="text-yellow-300 text-xl font-bold">
                {attacker1}'s {attack1}
              </p>
              <p className="text-white text-lg">Potential Damage: {damage1}</p>
            </div>
            <div className="text-red-500 text-2xl font-bold">VS</div>
            <div className="text-center">
              <p className="text-yellow-300 text-xl font-bold">
                {attacker2}'s {attack2}
              </p>
              <p className="text-white text-lg">Potential Damage: {damage2}</p>
            </div>
          </div>
          <p className="text-white mb-6 text-center text-lg leading-relaxed">
            Energy crackles and sparks fly as the two techniques struggle for dominance. The very air seems to vibrate
            with the intensity of the clash!
          </p>
          <p className="text-green-400 mb-4 text-center text-xl font-bold">
            {winningAttacker}'s {winningAttack} overpowers the opponent!
          </p>
          <p className="text-red-400 mb-4 text-center text-lg">
            {losingDefender} takes {actualDamage} damage from the clash!
          </p>

          <div className="flex justify-center relative z-50">
            <Button
              onClick={handleClose}
              className="bg-blue-500 hover:bg-blue-600 text-lg px-6 py-3 cursor-pointer"
              variant="default"
              disabled={false}
            >
              Continue Battle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

