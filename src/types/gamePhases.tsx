/**
 * Định nghĩa các giai đoạn của game Poker Money Calculator
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
