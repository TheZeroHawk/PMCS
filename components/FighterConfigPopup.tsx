"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { FIGHTERS } from "../config/fighters"
import { ATTACK_TYPES } from "../config/moves"
import {
  allMovesMoveset,
  defaultMoveset,
  commonMoveset,
  commonMoveset_Android,
  commonMoveset_Duugo,
  spaceWarriorMoveset,
  defaultMoveset_Android,
  defaultMoveset_Duugo,
  SeiferBladesMoveset,
  spaceWarriorMoveset_Strong,
} from "../config/movesets"
import { updateFighterConfig } from "../store/gameSlice"
import type { Race } from "../types"

interface FighterConfigPopupProps {
  isOpen: boolean
  onClose: () => void
}

const movesetOptions = [
  { label: "All Moves & Items", value: "allMovesMoveset" },
  { label: "Default moves", value: "defaultMoveset" },
  { label: "Common Moveset", value: "commonMoveset" },
  { label: "Common Moveset Android", value: "commonMoveset_Android" },
  { label: "Common Moveset Duugo", value: "commonMoveset_Duugo" },
  { label: "Space Warrior Moveset", value: "spaceWarriorMoveset" },
  { label: "Space Warrior Moveset (Strong)", value: "spaceWarriorMoveset_Strong" },
  { label: "Default Moveset for Andriods", value: "defaultMoveset_Android" },
  { label: "Default Moveset for Duugos", value: "defaultMoveset_Duugo" },
  { label: "Seifer Blades Moveset", value: "SeiferBladesMoveset" },
]

const raceOptions: Race[] = ["Human", "Saiyan", "Infinite Ki Android", "Duugo"]

const getMovesetByName = (name: string) => {
  switch (name) {
    case "allMovesMoveset":
      return allMovesMoveset
    case "defaultMoveset":
      return defaultMoveset
    case "commonMoveset":
      return commonMoveset
    case "commonMoveset_Android":
      return commonMoveset_Android
    case "commonMoveset_Duugo":
      return commonMoveset_Duugo
    case "spaceWarriorMoveset":
      return spaceWarriorMoveset
    case "spaceWarriorMoveset_Strong":
      return spaceWarriorMoveset_Strong
    case "defaultMoveset_Android":
      return defaultMoveset_Android
    case "defaultMoveset_Duugo":
      return defaultMoveset_Duugo
    case "SeiferBladesMoveset":
      return SeiferBladesMoveset
    default:
      return []
  }
}

export const FighterConfigPopup: React.FC<FighterConfigPopupProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const [fighterConfigs, setFighterConfigs] = useState(FIGHTERS)

  useEffect(() => {
    setFighterConfigs(FIGHTERS)
  }, [])

  const handleConfigChange = (fighter: string, field: string, value: any) => {
    setFighterConfigs((prev) => ({
      ...prev,
      [fighter]: {
        ...prev[fighter],
        [field]: value,
      },
    }))
  }

  const handleMovesetChange = (fighter: string, movesetName: string) => {
    const newMoveset = getMovesetByName(movesetName)
    handleConfigChange(fighter, "moveset", newMoveset)

    // Initialize item uses for the new moveset
    const newItemUses = { ...fighterConfigs[fighter].itemUses }
    newMoveset.forEach((move) => {
      const attackType = ATTACK_TYPES.find((attack) => attack.name === move)
      if (attackType && attackType.isHealingMove && !attackType.usesKi) {
        newItemUses[move] = newItemUses[move] || 1
      }
    })
    handleConfigChange(fighter, "itemUses", newItemUses)
  }

  const handleAddMove = (fighter: string, move: string) => {
    setFighterConfigs((prev) => {
      const updatedConfig = { ...prev[fighter] }
      updatedConfig.moveset = [...new Set([...updatedConfig.moveset, move])]

      // Initialize item uses for the new move if it's a healing item
      const attackType = ATTACK_TYPES.find((attack) => attack.name === move)
      if (attackType && attackType.isHealingMove && !attackType.usesKi) {
        updatedConfig.itemUses = {
          ...updatedConfig.itemUses,
          [move]: updatedConfig.itemUses[move] || 1,
        }
      }

      return { ...prev, [fighter]: updatedConfig }
    })
  }

  const handleRemoveMove = (fighter: string, move: string) => {
    setFighterConfigs((prev) => {
      const updatedConfig = { ...prev[fighter] }
      updatedConfig.moveset = updatedConfig.moveset.filter((m) => m !== move)

      // Remove item uses for the removed move if it's a healing item
      const attackType = ATTACK_TYPES.find((attack) => attack.name === move)
      if (attackType && attackType.isHealingMove && !attackType.usesKi) {
        const { [move]: _, ...restItemUses } = updatedConfig.itemUses
        updatedConfig.itemUses = restItemUses
      }

      return { ...prev, [fighter]: updatedConfig }
    })
  }

  const handleSave = () => {
    Object.entries(fighterConfigs).forEach(([fighter, config]) => {
      dispatch(updateFighterConfig({ fighter, config }))
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-gray-800 border-2 border-purple-500 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Fighter Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(fighterConfigs).map(([fighter, config]) => (
            <div key={fighter} className="mb-6 p-4 border border-gray-700 rounded">
              <h3 className="text-xl text-white mb-2">{config.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${fighter}-name`} className="text-gray-200">
                    Name
                  </Label>
                  <Input
                    id={`${fighter}-name`}
                    value={config.name}
                    onChange={(e) => handleConfigChange(fighter, "name", e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor={`${fighter}-race`} className="text-gray-200">
                    Race
                  </Label>
                  <Select value={config.race} onValueChange={(value) => handleConfigChange(fighter, "race", value)}>
                    <SelectTrigger className="bg-gray-700 text-white">
                      <SelectValue placeholder="Select a race" />
                    </SelectTrigger>
                    <SelectContent>
                      {raceOptions.map((race) => (
                        <SelectItem key={race} value={race}>
                          {race}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`${fighter}-basePowerLevel`} className="text-gray-200">
                    Base Power Level
                  </Label>
                  <Input
                    id={`${fighter}-basePowerLevel`}
                    type="number"
                    value={config.basePowerLevel}
                    onChange={(e) => handleConfigChange(fighter, "basePowerLevel", Number.parseInt(e.target.value))}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor={`${fighter}-currentPowerLevel`} className="text-gray-200">
                    Current Power Level
                  </Label>
                  <Input
                    id={`${fighter}-currentPowerLevel`}
                    type="number"
                    value={config.currentPowerLevel}
                    onChange={(e) => handleConfigChange(fighter, "currentPowerLevel", Number.parseInt(e.target.value))}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor={`${fighter}-autoSkip`} className="text-gray-200">
                    Auto Skip
                  </Label>
                  <Switch
                    id={`${fighter}-autoSkip`}
                    checked={config.autoSkip}
                    onCheckedChange={(checked) => handleConfigChange(fighter, "autoSkip", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${fighter}-moveset`} className="text-gray-200">
                    Moveset
                  </Label>
                  <Select onValueChange={(value) => handleMovesetChange(fighter, value)}>
                    <SelectTrigger className="bg-gray-700 text-white">
                      <SelectValue placeholder="Select a moveset" />
                    </SelectTrigger>
                    <SelectContent>
                      {movesetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-gray-200">Current Moves</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {config.moveset.map((move) => (
                    <Button
                      key={move}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMove(fighter, move)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      {move} ✕
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-gray-200">Add Move</Label>
                <Select onValueChange={(value) => handleAddMove(fighter, value)}>
                  <SelectTrigger className="bg-gray-700 text-white">
                    <SelectValue placeholder="Select a move to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {ATTACK_TYPES.map((attack) => (
                      <SelectItem key={attack.name} value={attack.name}>
                        {attack.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

