/**
 * Định nghĩa các types liên quan đến chip
 */

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
