"use client"

import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Race } from "@/types"
import { FIGHTERS } from "@/config/fighters"
import { ATTACK_TYPES } from "@/config/moves"
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
} from "@/config/movesets"
import { updateFighterConfig } from "@/store/gameSlice"

interface FighterConfigPopupProps {
  isOpen: boolean
  onClose: () => void
}

interface FighterConfig {
  name: string
  race: Race
  basePowerLevel: number
  currentPowerLevel: number
  moveset: string[]
  itemUses?: Record<string, number>
  autoSkip: boolean
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
  const [fighterConfigs, setFighterConfigs] = useState<FighterConfig[]>(FIGHTERS)

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
    const newItemUses: Record<string, number> = {}
    Array.from(newMoveset).forEach((move) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-gray-800 border-2 border-purple-500 shadow-lg">
        <CardHeader className="bg-gray-700">
          <CardTitle className="text-2xl text-white text-center">Configure Fighter</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {Object.entries(fighterConfigs).map(([fighter, config]) => (
            <div key={fighter} className="space-y-4">
              <div>
                <Label className="text-white">Name</Label>
                <Input
                  value={config.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleConfigChange(fighter, "name", e.target.value)
                  }
                  className="bg-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Race</Label>
                <Select
                  value={config.race}
                  onValueChange={(value: Race) => handleConfigChange(fighter, "race", value)}
                >
                  <SelectTrigger className="bg-gray-700 text-white">
                    <SelectValue>{config.race}</SelectValue>
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
                <Label className="text-white">Base Power Level</Label>
                <Input
                  type="number"
                  value={config.basePowerLevel}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleConfigChange(fighter, "basePowerLevel", parseInt(e.target.value))
                  }
                  className="bg-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Current Power Level</Label>
                <Input
                  type="number"
                  value={config.currentPowerLevel}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleConfigChange(fighter, "currentPowerLevel", parseInt(e.target.value))
                  }
                  className="bg-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Moveset Preset</Label>
                <Select
                  value={config.moveset}
                  onValueChange={(value: string) => handleMovesetChange(fighter, value)}
                >
                  <SelectTrigger className="bg-gray-700 text-white">
                    <SelectValue>
                      {value === "allMovesMoveset"
                        ? "All Moves & Items"
                        : value === "defaultMoveset"
                        ? "Default moves"
                        : value === "commonMoveset"
                        ? "Common Moveset"
                        : value === "commonMoveset_Android"
                        ? "Common Moveset Android"
                        : value === "commonMoveset_Duugo"
                        ? "Common Moveset Duugo"
                        : value === "spaceWarriorMoveset"
                        ? "Space Warrior Moveset"
                        : value === "spaceWarriorMoveset_Strong"
                        ? "Space Warrior Moveset (Strong)"
                        : value === "defaultMoveset_Android"
                        ? "Default Moveset for Andriods"
                        : value === "defaultMoveset_Duugo"
                        ? "Default Moveset for Duugos"
                        : "Seifer Blades Moveset"}
                    </SelectValue>
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

              <div>
                <Label className="text-white flex items-center space-x-2">
                  <span>Auto Skip Turn</span>
                  <Switch
                    checked={config.autoSkip}
                    onCheckedChange={(checked: boolean) => handleConfigChange(fighter, "autoSkip", checked)}
                  />
                </Label>
              </div>

              <div>
                <Label className="text-white">Custom Moves</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {ATTACK_TYPES.map((move) => (
                    <Button
                      key={move.name}
                      onClick={() => handleAddMove(fighter, move.name)}
                      variant="secondary"
                      className="w-full"
                    >
                      {move.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="bg-gray-700 justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
