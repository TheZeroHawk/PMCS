import type { GameState } from "../types"
import { ATTACK_TYPES } from "../config/moves"

export const getGrantedMoves = (fighter: "fighter1" | "fighter2", state: GameState): string[] => {
  const activeToggles = state[`${fighter}ActiveToggles`]
  const grantedMoves: string[] = []

  activeToggles.forEach((toggleName) => {
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

export const useGrantedMove = (state: GameState, fighter: "fighter1" | "fighter2", moveName: string) => {
  const activeToggles = state[`${fighter}ActiveToggles`]
  activeToggles.forEach((toggleName) => {
    const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
    if (toggleAttack && toggleAttack.grantedMoves) {
      const grantedMove = toggleAttack.grantedMoves.find((move) => move.moveName === moveName)
      if (grantedMove && grantedMove.uses > 0) {
        grantedMove.uses--
      }
    }
  })
}

