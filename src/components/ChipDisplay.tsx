/**
 * Component hiển thị chip
 */

import React from 'react'
import { CHIP_NAMES } from '../types'
import type { ChipValues, ChipCounts, ChipColor } from '../types'
import { CHIP_IMAGES } from '../assets/index'
import { formatMoney } from '../utils/formatters'

/**
 * Props cho ChipDisplayList
 */
interface ChipDisplayListProps {
  chipValues: ChipValues
  chipCounts?: ChipCounts
  chips?: ChipCounts // Alternative prop name for backward compatibility
  showCounts?: boolean
  showValues?: boolean
  showValue?: boolean // Alternative prop name for backward compatibility
  size?: string
  className?: string
}

/**
 * Props cho ChipDisplayItem
 */
interface ChipDisplayItemProps {
  color: ChipColor
  value: number
  count?: number
  showCount?: boolean
  showValue?: boolean
  size?: string
  className?: string
}

/**
 * Component hiển thị một chip
 */
export const ChipDisplayItem: React.FC<ChipDisplayItemProps> = ({
  color,
  value,
  count,
  showCount = true,
  showValue = true,
  size = 'medium',
  className = ''
}) => {
  if (value === 0 && (!count || count === 0)) return null

  const sizeClasses = {
    small: 'w-6 h-6 sm:w-8 sm:h-8',
    medium: 'w-8 h-8 sm:w-10 sm:h-10',
    large: 'w-10 h-10 sm:w-12 sm:h-12'
  }

  const textSizeClasses = {
    small: 'text-xs sm:text-sm',
    medium: 'text-sm sm:text-base',
    large: 'text-base sm:text-lg'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Chip image */}
      <div className={`relative ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium}`}>
        <img src={CHIP_IMAGES[color]} alt={CHIP_NAMES[color]} className='w-full h-full object-contain drop-shadow-sm' />
      </div>

      {/* Chip info */}
      <div className='flex flex-col min-w-0 flex-1'>
        {showValue && (
          <span
            className={`font-medium text-gray-800 truncate ${textSizeClasses[size as keyof typeof textSizeClasses] || textSizeClasses.medium}`}
          >
            {formatMoney(value)}
          </span>
        )}
        {showCount && count !== undefined && (
          <span className={`text-gray-600 truncate ${size === 'small' ? 'text-xs' : 'text-xs sm:text-sm'}`}>
            {count} chip{count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Component hiển thị danh sách chip
 */
export const ChipDisplayList: React.FC<ChipDisplayListProps> = ({
  chipValues,
  chipCounts,
  chips,
  showCounts = true,
  showValues = true,
  showValue,
  size = 'medium',
  className = ''
}) => {
  // Use chips prop as fallback for chipCounts
  const finalChipCounts = chips || chipCounts
  const finalShowValues = showValue !== undefined ? showValue : showValues
  const chipColors: ChipColor[] = ['white', 'red', 'green', 'blue', 'black']

  const visibleChips = chipColors.filter((color) => {
    const hasValue = chipValues[color] > 0
    const hasCount = !finalChipCounts || finalChipCounts[color] > 0
    return hasValue && hasCount
  })

  if (visibleChips.length === 0) {
    return <div className='text-center py-3 sm:py-4 text-gray-500 text-sm sm:text-base'>Chưa có chip nào</div>
  }

  // Responsive grid classes based on screen size and number of items
  const getGridClasses = () => {
    const itemCount = visibleChips.length
    if (itemCount <= 2) return 'grid-cols-1 sm:grid-cols-2'
    if (itemCount <= 3) return 'grid-cols-2 sm:grid-cols-3'
    if (itemCount <= 4) return 'grid-cols-2 sm:grid-cols-4'
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
  }

  return (
    <div className={`grid gap-2 sm:gap-3 ${getGridClasses()} ${className}`}>
      {visibleChips.map((color) => (
        <ChipDisplayItem
          key={color}
          color={color}
          value={chipValues[color]}
          count={finalChipCounts?.[color]}
          showCount={showCounts}
          showValue={finalShowValues}
          size={size}
          className='bg-white/80 p-2 sm:p-3 rounded-lg border border-gray-200 shadow-sm'
        />
      ))}
    </div>
  )
}

/**
 * Component tính tổng giá trị chip
 */
interface ChipTotalProps {
  chipValues: ChipValues
  chipCounts: ChipCounts
  className?: string
}

export const ChipTotal: React.FC<ChipTotalProps> = ({ chipValues, chipCounts, className = '' }) => {
  const total = Object.keys(chipCounts).reduce((sum, color) => {
    const chipColor = color as ChipColor
    return sum + chipCounts[chipColor] * chipValues[chipColor]
  }, 0)

  return (
    <div className={`bg-gray-100 p-3 sm:p-4 rounded-lg ${className}`}>
      <div className='text-center'>
        <p className='text-xs sm:text-sm text-gray-600 mb-1'>Tổng giá trị</p>
        <p className='text-lg sm:text-xl font-bold text-gray-800'>{formatMoney(total)}</p>
      </div>
    </div>
  )
}
