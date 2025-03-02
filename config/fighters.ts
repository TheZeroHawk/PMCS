import { commonMoveset } from "./movesets"
import type { FighterAISet } from "./fightersaisets"
import type { Race } from "../types"

export interface FighterConfig {
  name: string
  race: Race
  basePowerLevel: number
  currentPowerLevel: number
  moveset: string[]
  itemUses?: Record<string, number>
  aiSet?: FighterAISet
  autoSkip: boolean
}

export const FIGHTERS: Record<string, FighterConfig> = {
  fighter1: {
    name: "Fighter One",
    race: "Human",
    basePowerLevel: 1000,
    currentPowerLevel: 1000,
    moveset: [...commonMoveset, "Light Saiyan Armor", "Medium Dragon Armor", "Bakuha", "Ki Absorb", "Space Ki Gun"],
    autoSkip: false,
  },
  fighter2: {
    name: "Fighter Two",
    race: "Saiyan",
    basePowerLevel: 1000,
    currentPowerLevel: 1000,
    moveset: commonMoveset,
    autoSkip: false,
  },
  fighter3: {
    name: "Fighter Three",
    race: "Infinite Ki Android",
    basePowerLevel: 1000,
    currentPowerLevel: 1000,
    moveset: [...commonMoveset],
    autoSkip: false,
  },
  fighter4: {
    name: "Fighter Four",
    race: "Duugo",
    basePowerLevel: 1000,
    currentPowerLevel: 1000,
    moveset: [...commonMoveset, "Heavy Dragon Armor"],
    autoSkip: true,
  },
  fighter5: {
    name: "Fighter Five",
    race: "Human",
    basePowerLevel: 1000,
    currentPowerLevel: 1000,
    moveset: [...commonMoveset, "Heavy Saiyan Armor"],
    autoSkip: true,
  },
  fighter6: {
    name: "Fighter Six",
    race: "Human",
    basePowerLevel: 1000,
    currentPowerLevel: 1000,
    moveset: commonMoveset,
    autoSkip: true,
  },
  fighter7: {
    name: "Fighter Seven",
    race: "Human",
    basePowerLevel: 1000,
    currentPowerLevel: 1000,
    moveset: commonMoveset,
    autoSkip: true,
  },
  fighter8: {
    name: "Fighter Eight",
    race: "Human",
    basePowerLevel: 1000,
    currentPowerLevel: 1000,
    moveset: commonMoveset,
    autoSkip: true,
  },
}

