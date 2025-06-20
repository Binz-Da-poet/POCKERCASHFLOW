/**
 * Central export file for all chip assets
 * Tập trung export tất cả các file ảnh chip
 */

// Import tất cả các hình ảnh chip từ thư mục chipImages
import whiteChip from './chip/whiteChip.png'
import redChip from './chip/redChip.png'
import greenChip from './chip/greenChip.png'
import blueChip from './chip/blueChip.png'
import blackChip from './chip/blackChip.png'

/**
 * Object chứa đường dẫn hình ảnh cho từng loại chip
 * Sử dụng cho việc hiển thị hình ảnh chip trong các component
 */
export const CHIP_IMAGES = {
  white: whiteChip,
  red: redChip,
  green: greenChip,
  blue: blueChip,
  black: blackChip
} as const

/**
 * Type for chip image keys
 * Type cho các key của hình ảnh chip
 */
export type ChipImageKey = keyof typeof CHIP_IMAGES
