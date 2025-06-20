/**
 * Các hàm tiện ích cho format dữ liệu và validation
 */

/**
 * Format số tiền theo định dạng Nhật Bản (Yen)
 */
export const formatMoney = (amount: number): string => {
  return amount.toLocaleString('ja-JP') + '円'
}

/**
 * Kiểm tra số có phải là số dương hợp lệ không
 */
export const isValidPositiveNumber = (value: string): boolean => {
  const num = parseFloat(value)
  return !isNaN(num) && num > 0 && isFinite(num)
}

/**
 * Format số với dấu phẩy ngăn cách hàng nghìn
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ja-JP')
}

/**
 * Parse string thành số an toàn
 */
export const safeParseNumber = (value: string, defaultValue: number = 0): number => {
  const num = parseFloat(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * Format phần trăm
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals) + '%'
}

/**
 * Kiểm tra email hợp lệ
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Truncate text với ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Validate player name
 */
export const isValidPlayerName = (name: string): boolean => {
  return name.trim().length >= 1 && name.trim().length <= 50
}

/**
 * Validate chip count
 */
export const isValidChipCount = (count: number): boolean => {
  return Number.isInteger(count) && count >= 0 && count <= 1000
}

/**
 * Validate chip value
 */
export const isValidChipValue = (value: number): boolean => {
  return Number.isInteger(value) && value > 0 && value <= 100000
}

/**
 * Clean input text
 */
export const cleanInput = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ')
}
