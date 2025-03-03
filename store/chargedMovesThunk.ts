import type { AppThunk } from "./store"
import { performAttack, updateChargedMove } from "./gameSlice"
import type { AttackType } from "../types"

export const handleChargedMove =
  (attackType: AttackType, action: "use" | "charge", fighter: "fighter1" | "fighter2"): AppThunk =>
  (dispatch, getState) => {
    const state = getState().game
    const chargedMove = state[`${fighter}ChargedMove`]
    const currentCharge = chargedMove && chargedMove.moveName === attackType.name ? chargedMove.chargeLevel : 0

    if (action === "charge") {
      if (currentCharge < attackType.maximumTurnsCanBeCharged!) {
        dispatch(
          performAttack({
            attackType,
            action: "charge",
            fighter,
          }),
        )
      }
    } else if (action === "use") {
      // Perform the charged attack
      dispatch(
        performAttack({
          attackType: {
            ...attackType,
            damagePercent: attackType.damagePercent * (1 + currentCharge),
            description: `${attackType.name} (Charge Level: ${currentCharge})`,
          },
          action: "use",
          fighter,
        }),
      )

      // Reset the charge
      dispatch(
        updateChargedMove({
          moveName: "",
          chargeLevel: 0,
          fighter,
        }),
      )
    }
  }

