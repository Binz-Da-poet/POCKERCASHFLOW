/**
 * Định nghĩa các types liên quan đến người chơi
 */

import type { ChipCounts } from './chipTypes'

/**
 * Thông tin người chơi
 */
export interface Player {
  id: number
  name: string
  buyinAmount: number
  additionalBuyin: number
  currentChips: ChipCounts
  finalChips?: ChipCounts
}
