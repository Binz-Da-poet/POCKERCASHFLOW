/**
 * Định nghĩa các types liên quan đến giao dịch
 */

import type { ChipCounts } from './chipTypes'

/**
 * Loại giao dịch
 */
export type TransactionType = 'buyin' | 'transfer' | 'advance' | 'repay'

/**
 * Thông tin giao dịch
 */
export interface Transaction {
  id: number
  timestamp: number
  type: TransactionType
  fromPlayerId?: number
  toPlayerId?: number
  amount: number
  chips?: ChipCounts
  description: string
}
