import type { LogEntry } from "../types"

export function exportLog(log: LogEntry[]): void {
  const logText = log
    .map((entry, index) => {
      let text = `Turn ${entry.turn}: `

      if (entry.kiChannelingActivated) {
        text += `${entry.attacker} activated Ki Channeling.\n`
      } else if (entry.kiChannelingDeactivated) {
        text += `${entry.attacker}'s Ki Channeling effect ended.\n`
      } else if (entry.isCharging) {
        text += `${entry.attacker} charged ${entry.attackType}. Charge level: ${entry.chargeLevel}/${entry.maxChargeLevel}\n`
      } else if (entry.attackType === "Surrender") {
        text += `${entry.attacker} attempted to surrender. ${entry.surrenderResult === "Accepted" ? "Surrender was accepted." : "Surrender was declined."}\n`
      } else if (entry.toggleState) {
        text += `${entry.attacker} ${entry.toggleState.toLowerCase()} ${entry.attackType}.\n`
      } else {
        text += `${entry.attacker} used ${entry.attackType} on ${entry.defender}.\n`
        if (entry.defenseType) {
          text += `  ${entry.defender} defended with ${entry.defenseType}.\n`
          if (entry.blockResult) {
            text += `  Defense result: ${entry.blockResult === "full" ? "Full block" : entry.blockResult === "partial" ? "Partial block" : entry.blockResult === "absorbed" ? "Ki absorbed" : "Defense failed"}.\n`
          }
          if (entry.dodgeChance) {
            text += `  Dodge chance: ${(entry.dodgeChance * 100).toFixed(1)}%\n`
          }
        }
        if (entry.damage > 0) {
          text += `  Damage dealt: ${entry.damage}\n`
        } else if (entry.damage < 0) {
          text += `  Healed amount: ${Math.abs(entry.damage)}\n`
        }
        if (entry.isCriticalHit) {
          text += `  Critical Hit!\n`
        }
        if (entry.selfDamage) {
          text += `  Self-damage: ${entry.selfDamage}\n`
        }
        text += `  ${entry.defender}'s remaining Power Level: ${entry.remainingPowerLevel}\n`
      }

      if (entry.extraMoveGranted) {
        text += `  ${entry.attacker} gained ${entry.extraMoveCount} extra move${entry.extraMoveCount !== 1 ? "s" : ""}!\n`
      }

      if (entry.chargeCleared) {
        text += `  ${entry.defender}'s charged move was cleared due to defending.\n`
      }

      if (entry.extraNote) {
        text += `  Note: ${entry.extraNote}\n`
      }

      return text
    })
    .join("\n")

  const blob = new Blob([logText], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "combat_log.txt"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

