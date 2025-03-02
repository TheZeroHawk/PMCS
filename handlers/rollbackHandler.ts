import type { GameState } from "../types"

export const handleRollback = (state: GameState, turnToRollbackTo: number): GameState => {
  const currentTurn = state.turn
  const turnsToGoBack = currentTurn - turnToRollbackTo

  console.log(`Attempting to rollback from turn ${currentTurn} to turn ${turnToRollbackTo}`)
  console.log(`Current turn history length: ${state.turnHistory.length}`)

  if (turnsToGoBack > 0 && turnsToGoBack <= state.turnHistory.length) {
    const historicalStateIndex = state.turnHistory.length - turnsToGoBack
    const historicalState = state.turnHistory[historicalStateIndex]

    // Preserve the current turnHistory
    const currentTurnHistory = state.turnHistory.slice(0, historicalStateIndex + 1)

    // Create a new state object
    const newState: GameState = {
      ...historicalState,
      turnHistory: currentTurnHistory,
      log: [
        ...historicalState.log,
        {
          turn: historicalState.turn,
          attacker: limitString("Referee"),
          defender: limitString("Referee"),
          attackType: limitString("Turn Rollback"),
          damage: 0,
          remainingPowerLevel: 0,
          extraNote: limitString(`Rolled back from turn ${currentTurn} to turn ${turnToRollbackTo}`),
        },
      ],
    }

    console.log(`Successfully rolled back to turn ${turnToRollbackTo}`)

    return newState
  } else {
    console.error(
      `Invalid rollback request. Cannot rollback ${turnsToGoBack} turns. Available history: ${state.turnHistory.length} turns.`,
    )
    return { ...state }
  }
}

function limitString(str: string, maxLength = 1000): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str
}

