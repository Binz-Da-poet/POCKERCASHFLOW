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
