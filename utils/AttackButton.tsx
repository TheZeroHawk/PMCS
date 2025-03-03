"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AttackType } from "../types"
import { Zap } from "lucide-react"
import { ATTACK_TYPES } from "../config/moves"

interface AttackButtonProps {
  attackType: AttackType
  disabled: boolean
  onAttack: (action: "use" | "charge", targets?: { [key: string]: number }) => void
  cooldown: number
  remainingAmmo?: number
  remainingItemUses?: number
  isActive?: boolean
  lastUsedMove: AttackType | null
  chargeLevel: number
  category: string
  width: string
  isCurrentTurn: boolean
  attackerPowerLevel: number
  defenderPowerLevel: number
  activeToggles: string[]
  armorHealth?: { current: number; max: number }
  grantedMoveUses?: number
}

export const AttackButton: React.FC<AttackButtonProps> = ({
  attackType,
  disabled,
  onAttack,
  cooldown,
  remainingAmmo,
  remainingItemUses,
  isActive,
  lastUsedMove,
  chargeLevel,
  category,
  width,
  isCurrentTurn,
  attackerPowerLevel,
  defenderPowerLevel,
  activeToggles,
  armorHealth,
  grantedMoveUses,
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [progress, setProgress] = useState(0)
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let animationFrameId: number | null = null
    if (isPressed && attackType.longPressDuration > 0) {
      const startTime = Date.now()
      const animate = () => {
        const elapsedTime = Date.now() - startTime
        const progress = Math.min(elapsedTime / attackType.longPressDuration, 1)
        setProgress(progress)
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate)
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isPressed, attackType.longPressDuration])

  const onMouseDown = () => {
    setIsPressed(true)
    if (attackType.longPressDuration > 0) {
      longPressTimeout.current = setTimeout(() => {
        onAttack("use")
      }, attackType.longPressDuration)
    }
  }

  const onMouseUp = () => {
    setIsPressed(false)
    setProgress(0)
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }
  }

  const onMouseLeave = () => {
    onMouseUp()
  }

  const onTouchStart = () => {
    onMouseDown()
  }

  const onTouchEnd = () => {
    onMouseUp()
  }

  const buttonClass = `w-full ${
    attackType.name === "Surrender"
      ? "bg-red-500 hover:bg-red-600"
      : attackType.isToggle && isActive
        ? "bg-green-500 hover:bg-green-600"
        : "button-gradient"
  } overflow-hidden`

  const isDisabled =
    !isCurrentTurn ||
    disabled ||
    (attackType.name === "Ki Absorb" && (!lastUsedMove || !lastUsedMove.usesKi)) ||
    (attackType.isHealingMove && !attackType.usesKi && (remainingItemUses === undefined || remainingItemUses <= 0)) ||
    attackType.preventAction

  const calculateDodgeChance = () => {
    if (!attackType.isDodge) return null

    const powerLevelRatio = defenderPowerLevel / attackerPowerLevel

    let baseDodgeChance = 0
    if (Math.abs(1 - powerLevelRatio) <= 0.05) {
      baseDodgeChance = 0.15
    } else if (powerLevelRatio > 1) {
      const multiplier = Math.floor(powerLevelRatio / 2)
      baseDodgeChance = Math.min(0.15 + multiplier * 0.35, 0.9)
    }

    // Add 15% dodge chance if the attack uses Ki
    if (attackType.usesKi) {
      baseDodgeChance += 0.15
    }

    // Apply dodge chance modifiers from active toggles
    activeToggles.forEach((toggleName) => {
      const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
      if (toggleAttack && toggleAttack.affectSelfDodgeChance) {
        baseDodgeChance += toggleAttack.affectSelfDodgeChance
      }
    })

    // Ensure dodge chance doesn't exceed 100% or go below 0%
    return Math.max(0, Math.min(baseDodgeChance, 1))
  }

  const dodgeChance = calculateDodgeChance()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative ${width}`}>
            <Button
              disabled={isDisabled}
              className={`${buttonClass} ${!isCurrentTurn || attackType.preventAction ? "opacity-50 cursor-not-allowed" : ""} ${chargeLevel > 0 ? "border-2 border-yellow-500" : ""} ${category === "Special" ? "justify-between" : ""}`}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onClick={() => {
                if (!attackType.longPressDuration && !attackType.preventAction) {
                  onAttack("use")
                }
              }}
            >
              <span className="relative z-10 flex items-center justify-between w-full">
                <span className="truncate mr-1">
                  {attackType.name}
                  {chargeLevel > 0 && <span className="ml-1 text-yellow-500">({chargeLevel})</span>}
                  {dodgeChance !== null && (
                    <span className="ml-1 text-blue-300">({(dodgeChance * 100).toFixed(1)}%)</span>
                  )}
                  {grantedMoveUses !== undefined && (
                    <span className="ml-1 text-green-300">
                      ({grantedMoveUses} use{grantedMoveUses !== 1 ? "s" : ""} left)
                    </span>
                  )}
                  {attackType.isHealingMove && !attackType.usesKi && remainingItemUses !== undefined && (
                    <span className="ml-1 text-orange-300">({remainingItemUses} left)</span>
                  )}
                </span>
                <span className="flex items-center">
                  {attackType.canBeCharged && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            if (chargeLevel < attackType.maximumTurnsCanBeCharged!) {
                              onAttack("charge")
                            }
                          }}
                          className={`mr-1 p-1 rounded-full transition-colors cursor-pointer ${
                            chargeLevel > 0 ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-500 hover:bg-gray-600"
                          } ${chargeLevel >= attackType.maximumTurnsCanBeCharged! ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <Zap size={12} className={chargeLevel > 0 ? "text-white" : "text-gray-300"} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {chargeLevel >= attackType.maximumTurnsCanBeCharged!
                          ? `${attackType.name} fully charged`
                          : `Charge ${attackType.name} (Current: ${chargeLevel}/${attackType.maximumTurnsCanBeCharged})`}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {attackType.magazineCapacity !== undefined && remainingAmmo !== undefined && (
                    <span className="text-xs whitespace-nowrap">
                      ({remainingAmmo}/{attackType.magazineCapacity})
                    </span>
                  )}
                </span>
              </span>
              {cooldown > 0 && attackType.name !== "Surrender" && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl z-20">
                  {cooldown}
                </span>
              )}
              {isPressed && attackType.longPressDuration > 0 && (
                <div
                  className="absolute bottom-0 left-0 h-full bg-yellow-400 opacity-50"
                  style={{
                    width: `${progress * 100}%`,
                    transition: "none",
                  }}
                />
              )}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm break-words">{attackType.description}</p>
          {attackType.staticDamage !== undefined ? (
            <p className="text-xs text-gray-400 mt-1">Damage: {attackType.staticDamage}</p>
          ) : attackType.damagePercent ? (
            <p className="text-xs text-gray-400 mt-1">
              Damage: {(attackType.damagePercent * 100).toFixed(1)}% of Power Level
            </p>
          ) : null}
          {attackType.magazineCapacity !== undefined && (
            <p className="text-xs text-gray-400 mt-1">Magazine Capacity: {attackType.magazineCapacity}</p>
          )}
          {attackType.isHealingMove && remainingItemUses !== undefined && (
            <p className="text-xs text-gray-400 mt-1">Remaining: {remainingItemUses}</p>
          )}
          {attackType.cooldown > 0 && attackType.name !== "Surrender" && (
            <p className="text-xs text-gray-400 mt-1">Cooldown: {attackType.cooldown} turn(s)</p>
          )}
          {attackType.longPressDuration > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Hold for {attackType.longPressDuration / 1000} second(s) to use
            </p>
          )}
          {attackType.isToggle && (
            <p className="text-xs text-gray-400 mt-1">Toggle ability: {isActive ? "Active" : "Inactive"}</p>
          )}
          {attackType.name === "Ki Absorb" && (
            <>
              <p className="text-xs text-blue-400 mt-1">
                Base absorption chance: {(attackType.baseAbsorptionChance * 100).toFixed(1)}%
                <br />
                Max absorption chance: {(attackType.maxAbsorptionChance * 100).toFixed(1)}%
                <br />
                Absorption amount: {(attackType.absorptionPercent * 100).toFixed(1)}% of attack energy
              </p>
              {!lastUsedMove?.usesKi && (
                <p className="text-xs text-red-400 mt-1">Can only be used against Ki-based attacks</p>
              )}
            </>
          )}
          {attackType.preventAction && (
            <p className="text-xs text-yellow-400 mt-1">This move can only be used when defending against an attack</p>
          )}
          {attackType.isArmor && armorHealth && (
            <p className="text-xs text-green-400 mt-1">
              Armor Health: {armorHealth.current} / {armorHealth.max}
            </p>
          )}
          {grantedMoveUses !== undefined && (
            <p className="text-xs text-green-400 mt-1">
              Granted move: {grantedMoveUses} use{grantedMoveUses !== 1 ? "s" : ""} remaining
            </p>
          )}
          {attackType.affectSelfDodgeChance && (
            <p className="text-xs text-blue-400 mt-1">
              Increases dodge chance by {(attackType.affectSelfDodgeChance * 100).toFixed(1)}%
            </p>
          )}
          {attackType.minimumDodgeChance && (
            <p className="text-xs text-blue-400 mt-1">
              Minimum dodge chance: {(attackType.minimumDodgeChance * 100).toFixed(1)}%
            </p>
          )}
          {attackType.affectSelfBlockChance && (
            <p className="text-xs text-blue-400 mt-1">
              Increases block chance by {(attackType.affectSelfBlockChance * 100).toFixed(1)}%
            </p>
          )}
          {attackType.totalDamageAdjust && (
            <p className="text-xs text-red-400 mt-1">
              Reduces total damage output by {Math.abs(attackType.totalDamageAdjust * 100).toFixed(1)}%
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

