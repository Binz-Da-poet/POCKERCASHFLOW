/**
 * Định nghĩa types cho game state
 */

import type { GamePhase } from './gamePhases'
import type { ChipValues, ChipCounts } from './chipTypes'
import type { Player } from './playerTypes'
import type { Transaction } from './transactionTypes'

/**
 * State của game
 */
export interface GameState {
  gamePhase: GamePhase
  buyinAmount: number
  chipValues: ChipValues
  chipCounts: ChipCounts
  players: Player[]
  transactions: Transaction[]
}
