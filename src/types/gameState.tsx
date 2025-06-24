/**
 * Định nghĩa types cho game state
 */

import type { ChipValues, ChipCounts } from './chipTypes'
import type { Player } from './playerTypes'
import type { Transaction } from './transactionTypes'

/**
 * Game status để tracking trạng thái hiện tại
 */
export const GAME_STATUS = {
  BUYIN_SETUP: 'BUYIN_SETUP',
  CHIP_VALUES_SETUP: 'CHIP_VALUES_SETUP',
  PLAYERS_SETUP: 'PLAYERS_SETUP',
  PLAYING: 'PLAYING',
  FINAL_CHIPS_INPUT: 'FINAL_CHIPS_INPUT',
  FINAL_RESULTS: 'FINAL_RESULTS'
} as const

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

/**
 * State của game
 */
export interface GameState {
  status: GameStatus
  buyinAmount: number
  chipValues: ChipValues
  chipCounts: ChipCounts
  players: Player[]
  transactions: Transaction[]
}
