"use client"

import React from "react"
import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { adjustPowerLevels, adjustDamage, toggleAutoSkip, adjustArmorHealth } from "@/store/gameSlice"
import { ATTACK_TYPES } from "@/config/moves"
import type { RootState } from "@/store/store"

interface RefCheatsPopupProps {
  isOpen: boolean
  onClose: () => void
}

interface PowerLevelState {
  current: number
  max: number
}

export const RefCheatsPopup: React.FC<RefCheatsPopupProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const gameState = useSelector((state: RootState) => state.game)
  const currentTurn = useSelector((state: RootState) => state.game.currentTurn)

  const activeFighters = useMemo(() => {
    return Object.entries(gameState).filter(
      ([key, fighter]) => key.startsWith("fighter") && fighter && typeof fighter === "object" && "autoSkip" in fighter,
    )
  }, [gameState])

  const [powerLevels, setPowerLevels] = useState<Record<string, PowerLevelState>>(() =>
    Object.fromEntries(
      activeFighters.map(([key, fighter]) => [
        key,
        {
          current: fighter.powerLevel || 0,
          max: fighter.maxPowerLevel || 0,
        },
      ]),
    ),
  )

  const [damageAdjustment, setDamageAdjustment] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [selectedFighter, setSelectedFighter] = useState<string>("")
  const [selectedArmor, setSelectedArmor] = useState<string>("")
  const [armorHealth, setArmorHealth] = useState(0)

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  const armorTypes = useMemo(() => ATTACK_TYPES.filter((attack) => attack.isArmor), [])

  if (!isOpen) return null

  const handlePowerLevelChange = (fighter: string, type: "current" | "max", value: string) => {
    setPowerLevels((prev) => ({
      ...prev,
      [fighter]: {
        ...prev[fighter],
        [type]: Number.parseInt(value) || 0,
      },
    }))
  }

  const handleApplyPowerLevelChange = (fighter: string, type: "current" | "max") => {
    dispatch(adjustPowerLevels({ [fighter]: { [type]: powerLevels[fighter][type] } }))
    setShowNotification(true)
  }

  const handleDamageAdjustmentChange = (value: string) => {
    setDamageAdjustment(Number.parseFloat(value) || 0)
  }

  const handleApplyDamageAdjustment = () => {
    dispatch(adjustDamage(damageAdjustment))
    setShowNotification(true)
  }

  const handleAutoSkipToggle = (fighter: string) => {
    dispatch(toggleAutoSkip(fighter))
  }

  const handleApplyArmorHealthChange = () => {
    if (selectedFighter && selectedArmor) {
      dispatch(adjustArmorHealth({ fighter: selectedFighter, armorName: selectedArmor, newHealth: armorHealth }))
      setShowNotification(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-gray-800 border-2 border-purple-500 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Ref Cheats</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl text-white mb-4">Power Level Adjust</h3>
          <div className="grid grid-cols-3 gap-4">
            {activeFighters.map(([fighter, fighterData]) => (
              <div key={fighter} className="flex flex-col">
                <Label htmlFor={`${fighter}-current`} className="text-white mb-2">
                  {fighterData.name} (Current)
                </Label>
                <div className="flex items-center">
                  <Input
                    id={`${fighter}-current`}
                    type="number"
                    value={powerLevels[fighter]?.current ?? 0}
                    onChange={(e) => handlePowerLevelChange(fighter, "current", e.target.value)}
                    className="bg-gray-700 text-white mb-2 flex-grow"
                  />
                  <Button onClick={() => handleApplyPowerLevelChange(fighter, "current")} className="ml-2 mb-2">
                    Apply
                  </Button>
                </div>
                <Label htmlFor={`${fighter}-max`} className="text-white mb-2">
                  {fighterData.name} (Max)
                </Label>
                <div className="flex items-center">
                  <Input
                    id={`${fighter}-max`}
                    type="number"
                    value={powerLevels[fighter]?.max ?? 0}
                    onChange={(e) => handlePowerLevelChange(fighter, "max", e.target.value)}
                    className="bg-gray-700 text-white flex-grow"
                  />
                  <Button onClick={() => handleApplyPowerLevelChange(fighter, "max")} className="ml-2">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl text-white mb-4 mt-8">Damage Adjust</h3>
          <div className="flex flex-col">
            <Label htmlFor="damage-adjustment" className="text-white mb-2">
              Damage Adjustment for {gameState[currentTurn]?.name ?? "Current Fighter"} (%)
            </Label>
            <p className="text-sm text-gray-400 mt-2">
              Note that the damage adjust feature is intended to be made before an attack is performed. It will increase
              the damage output. For example, if the attack is expected to be 100PL in total damage, a 50% damage
              increase will result in the damage to be 150PL. 50% damage increase is typical for critical hits.
            </p>
            <Input
              id="damage-adjustment"
              type="number"
              value={damageAdjustment}
              onChange={(e) => handleDamageAdjustmentChange(e.target.value)}
              className="bg-gray-700 text-white mb-2"
            />
            <Button onClick={handleApplyDamageAdjustment} className="mt-2">
              Apply Damage Adjustment
            </Button>
          </div>

          <h3 className="text-xl text-white mb-4 mt-8">Armor Health Adjust</h3>
          <div className="flex flex-col">
            <Label htmlFor="fighter-select" className="text-white mb-2">
              Select Fighter
            </Label>
            <Select onValueChange={setSelectedFighter} value={selectedFighter}>
              <SelectTrigger className="bg-gray-700 text-white">
                <SelectValue placeholder="Select fighter" />
              </SelectTrigger>
              <SelectContent>
                {activeFighters.map(([fighter, fighterData]) => (
                  <SelectItem key={fighter} value={fighter}>
                    {fighterData.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="armor-select" className="text-white mb-2 mt-4">
              Select Armor
            </Label>
            <Select onValueChange={setSelectedArmor} value={selectedArmor}>
              <SelectTrigger className="bg-gray-700 text-white">
                <SelectValue placeholder="Select armor" />
              </SelectTrigger>
              <SelectContent>
                {armorTypes.map((armor) => (
                  <SelectItem key={armor.name} value={armor.name}>
                    {armor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="armor-health" className="text-white mb-2 mt-4">
              New Armor Health
            </Label>
            <Input
              id="armor-health"
              type="number"
              value={armorHealth}
              onChange={(e) => setArmorHealth(Number(e.target.value))}
              className="bg-gray-700 text-white mb-2"
            />
            <Button onClick={handleApplyArmorHealthChange} className="mt-2">
              Apply Armor Health Change
            </Button>
          </div>

          <h3 className="text-xl text-white mb-4 mt-8">Auto Skip Toggle</h3>
          <p className="text-sm text-gray-400 mb-4">
            The game assumes there will be 8 fighters. However, when there are not 8 fighters (such as 2 or 4 fighters),
            we enable autoskip, and hide their involvement in the fight. Several fighters have auto skip enabled, as
            having this many fighters involved is non-typical. This ref cheat exists if you need to add a fighter to the
            fight, and that fighter was configured prior to beginning the fight.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {activeFighters.map(([fighter, fighterData]) => (
              <div key={fighter} className="flex items-center justify-between">
                <Label htmlFor={`${fighter}-autoskip`} className="text-white">
                  {fighterData.name}
                </Label>
                <Switch
                  id={`${fighter}-autoskip`}
                  checked={!fighterData.autoSkip}
                  onCheckedChange={() => handleAutoSkipToggle(fighter)}
                />
              </div>
            ))}
          </div>

          {showNotification && (
            <div className="mt-4 p-2 bg-green-500 text-white rounded-md text-center">Action applied successfully!</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
