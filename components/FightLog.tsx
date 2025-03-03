"use client"

import React from "react"
import { useEffect } from "react"
import type { LogEntry } from "@/types"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { exportLog } from "@/utils/exportLog"
import { Copy } from "lucide-react"

interface FightLogProps {
  log: LogEntry[]
}

const formatLogEntry = (entry: LogEntry): string => {
  let entryText = `Turn ${entry.turn}: `
  if (entry.attackType.category === "Transformations") {
    entryText += `${entry.attacker} used ${entry.attackType}. ${entry.extraNote}`
  } else if (entry.toggleState) {
    entryText += `${entry.attacker} ${entry.toggleState === "Activated" ? "activated" : "deactivated"} ${entry.attackType}.`
  } else if (entry.isCharging) {
    entryText += `${entry.attacker} charged ${entry.attackType}. Charge level: ${entry.chargeLevel}/${entry.maxChargeLevel}`
  } else if (entry.attackType === "Surrender") {
    entryText += `${entry.attacker} attempted to surrender. ${entry.defender} ${entry.surrenderResult.toLowerCase()} the surrender.`
  } else if (entry.healedAmount !== undefined) {
    entryText += `${entry.attacker} used ${entry.attackType} and restored ${entry.healedAmount} Power Level.`
  } else if (entry.healAttemptFailed) {
    entryText += `${entry.attacker} attempted to use ${entry.attackType}, but it failed.`
  } else {
    entryText += `${entry.attacker} used ${entry.attackType} on ${entry.defender}.`
    if (entry.defenseType) {
      entryText += ` ${entry.defender} defended with ${entry.defenseType}.`
      if (entry.blockResult) {
        entryText += ` ${entry.blockResult === "full" ? "Full Defense!" : entry.blockResult === "partial" ? "Partial Defense!" : entry.blockResult === "absorbed" ? "Ki Absorb Successful!" : "Defense failed!"}`
      }
    }
    if (entry.damage !== undefined) {
      entryText += ` Damage: ${entry.damage}.`
    }
    if (entry.selfDamage) {
      entryText += ` Self-damage: ${entry.selfDamage}.`
    }
    if (entry.isPiercing) {
      entryText += ` This attack pierced through armor!`
    }
    if (entry.isCriticalHit) {
      entryText += ` Critical Hit!`
    }
    if (entry.extraMoveGranted) {
      entryText += ` ${entry.attacker} gained ${entry.extraMoveCount} extra move${entry.extraMoveCount !== 1 ? "s" : ""}!`
    }
  }
  if (entry.extraNote && entry.extraNote.includes("stunned")) {
    entryText += ` ${entry.extraNote}`
  }
  if (entry.extraNote) {
    entryText += ` Note: ${entry.extraNote}`
  }
  if (entry.armorDamageReduction) {
    entryText += ` Armor absorbed ${(entry.armorDamageReduction * 100).toFixed(1)}% of the damage.`
  }
  return entryText.trim()
}

export const FightLog: React.FC<FightLogProps> = ({ log }) => {
  const [processedLog, setProcessedLog] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simply reverse the log for display without generating descriptions
    setProcessedLog([...log].reverse())
    setIsLoading(false)
  }, [log])

  const handleExport = () => {
    exportLog(log)
  }

  const handleCopyToClipboard = () => {
    const logText = log.map(formatLogEntry).join("\n")
    navigator.clipboard.writeText(logText).then(
      () => {
        console.log("Fight log copied to clipboard")
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  const handleCopyEntry = (entry: LogEntry) => {
    const entryText = formatLogEntry(entry)
    navigator.clipboard.writeText(entryText).then(
      () => {
        console.log("Log entry copied to clipboard")
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold gradient-text">Fight Log</h2>
        <div className="space-x-2">
          <Button onClick={handleExport} className="bg-blue-500 hover:bg-blue-600">
            Export Log
          </Button>
          <Button onClick={handleCopyToClipboard} className="bg-green-500 hover:bg-green-600">
            Copy All
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[400px] w-full border-2 border-purple-500 rounded-md p-4 bg-gradient-to-b from-gray-800 to-gray-900">
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}
        {processedLog.map((entry, index) => (
          <div key={index} className="mb-6">
            <div
              className={`p-3 bg-gray-800 rounded-md ${index === 0 ? "animate-fade-slide-in" : ""} ${entry.blockResult ? "animate-block" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div className="text-sm flex-grow">
                  <span className="font-semibold text-blue-400">Turn {entry.turn}:</span>{" "}
                  <span className="text-green-400">{entry.attacker}</span>{" "}
                  {entry.attackType.category === "Transformations" ? (
                    <>
                      used <span className="text-yellow-400">{entry.attackType}</span>.
                      <span className="text-purple-400"> {entry.extraNote}</span>
                    </>
                  ) : entry.toggleState ? (
                    <>
                      <span className="text-yellow-400">
                        {entry.toggleState === "Activated" ? "activated" : "deactivated"}
                      </span>{" "}
                      <span className="text-purple-400">{entry.attackType}</span>.
                    </>
                  ) : entry.isCharging ? (
                    <>
                      charged <span className="text-yellow-400">{entry.attackType}</span>.
                      <span className="text-blue-400">
                        {" "}
                        Charge level: {entry.chargeLevel}/{entry.maxChargeLevel}
                      </span>
                    </>
                  ) : entry.attackType === "Surrender" ? (
                    <>
                      attempted to surrender. {entry.defender} {entry.surrenderResult.toLowerCase()} the surrender.
                    </>
                  ) : entry.healedAmount !== undefined ? (
                    <>
                      used <span className="text-green-400">{entry.attackType}</span> and restored{" "}
                      <span className="text-green-400 font-bold">{entry.healedAmount}</span> Power Level.
                    </>
                  ) : entry.healAttemptFailed ? (
                    <>
                      attempted to use <span className="text-yellow-400">{entry.attackType}</span>, but it failed.
                    </>
                  ) : (
                    <>
                      used <span className="text-yellow-400">{entry.attackType}</span> on{" "}
                      <span className="text-red-400">{entry.defender}</span>.
                      {entry.defenseType && (
                        <>
                          {" "}
                          <span className="text-purple-400">{entry.defender}</span> defended with{" "}
                          <span className="text-cyan-300">{entry.defenseType}</span>.
                        </>
                      )}
                    </>
                  )}
                </div>
                <Button onClick={() => handleCopyEntry(entry)} className="bg-gray-700 hover:bg-gray-600 p-1" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {!entry.toggleState &&
                !entry.isCharging &&
                entry.attackType !== "Surrender" &&
                !entry.healAttemptFailed &&
                entry.attackType.category !== "Transformations" && (
                  <div className="text-sm ml-4 mt-1">
                    {entry.healedAmount !== undefined ? (
                      <span className="text-green-400 font-bold">Healed: {entry.healedAmount}</span>
                    ) : (
                      <>
                        <span
                          className={`font-bold ${
                            entry.blockResult === "full" || entry.blockResult === "absorbed"
                              ? "text-green-400"
                              : entry.blockResult === "partial"
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {entry.blockResult === "full"
                            ? "Full Defense!"
                            : entry.blockResult === "partial"
                              ? "Partial Defense!"
                              : entry.blockResult === "absorbed"
                                ? "Ki Absorb Successful!"
                                : "Defense failed!"}
                        </span>
                        {entry.damagePreventedNote && (
                          <span className="text-green-400 ml-2">({entry.damagePreventedNote})</span>
                        )}
                        <span className="text-white ml-2">Damage: {entry.damage}</span>
                        {entry.selfDamage && <span className="text-red-400 ml-2">Self-damage: {entry.selfDamage}</span>}
                        {entry.isCriticalHit && <span className="text-yellow-400 font-bold ml-2">Critical Hit!</span>}
                        {entry.isPiercing && <span className="text-yellow-400 ml-2">Piercing Attack!</span>}
                        {entry.extraMoveGranted && (
                          <span className="text-purple-400 font-bold ml-2">
                            {entry.attacker} gained {entry.extraMoveCount} extra move
                            {entry.extraMoveCount !== 1 ? "s" : ""}!
                          </span>
                        )}
                        {entry.extraNote && entry.extraNote.includes("stunned") && (
                          <span className="text-red-400 font-bold ml-2">{entry.extraNote}</span>
                        )}
                        {entry.armorDamageReduction && (
                          <span className="text-blue-300 ml-2">
                            Armor absorbed {(entry.armorDamageReduction * 100).toFixed(1)}% of the damage
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
              {entry.healAttemptFailed && (
                <div className="text-sm ml-4 mt-1">
                  <span className="text-red-400 font-bold">Heal Failed!</span>
                </div>
              )}
              {entry.extraNote && (
                <div className="text-sm ml-4 mt-1 text-yellow-300 italic">Note: {entry.extraNote}</div>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
