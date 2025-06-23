/**
 * Export central cho tất cả types của ứng dụng Poker Money Calculator
 */

// Game phases
export * from './gamePhases'

// Chip types
export * from './chipTypes'

// Player types
export * from './playerTypes'

// Transaction types
export * from './transactionTypes'

// Game state
export * from './gameState'

/**
 * Định nghĩa các types chung cho ứng dụng Poker Money Calculator
 */

/**
 * Các giai đoạn của game
 */
export const GAME_PHASES = {
  BUYIN_SETUP: 'BUYIN_SETUP',
  CHIP_VALUES_SETUP: 'CHIP_VALUES_SETUP',
  PLAYERS_SETUP: 'PLAYERS_SETUP',
  PLAYING: 'PLAYING',
  FINAL_CHIPS_INPUT: 'FINAL_CHIPS_INPUT',
  FINAL_RESULTS: 'FINAL_RESULTS'
} as const

export type GamePhase = (typeof GAME_PHASES)[keyof typeof GAME_PHASES]

/**
 * Các màu chip
 */
export type ChipColor = 'white' | 'red' | 'green' | 'blue' | 'black'

/**
 * Object chứa số lượng chip theo màu
 */
export interface ChipCounts {
  white: number
  red: number
  green: number
  blue: number
  black: number
}

/**
 * Object chứa giá trị chip theo màu
 */
export interface ChipValues {
  white: number
  red: number
  green: number
  blue: number
  black: number
}

/**
 * Tên hiển thị của từng màu chip
 */
export const CHIP_NAMES: Record<ChipColor, string> = {
  white: 'Trắng',
  red: 'Đỏ',
  green: 'Xanh lá',
  blue: 'Xanh dương',
  black: 'Đen'
}

/**
 * Giá trị mặc định cho các chip
 */
export const DEFAULT_CHIP_VALUES: ChipValues = {
  white: 10,
  red: 50,
  green: 5,
  blue: 25,
  black: 100
}

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
