/**
 * Bước 2: Màn hình thiết lập giá trị và số lượng chip
 * Người dùng nhập giá trị chip, hệ thống tự động phân bổ số lượng theo tỷ lệ
 * Người dùng có thể chỉnh sửa số lượng chip thủ công
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStateContext } from '../hooks/useGameState'
import { CHIP_IMAGES } from '../assets'
import { formatMoney, isValidPositiveNumber } from '../utils/formatters'
import { CHIP_NAMES, DEFAULT_CHIP_VALUES } from '../types'
import type { ChipValues, ChipCounts, ChipColor } from '../types'

export const ChipValuesSetupPage: React.FC = () => {
  const navigate = useNavigate()
  const { gameState,setGamePhase, setChipValues, setChipCounts } = useGameStateContext()
  const [chipValues, setLocalChipValues] = useState<ChipValues>(gameState.chipValues)
  const [chipCounts, setLocalChipCounts] = useState<ChipCounts>(gameState.chipCounts)

  // dùng useCallback để tránh tạo lại hàm không cần thiết
  const handleNext = useCallback(() => {
    setChipValues(chipValues)
    setChipCounts(chipCounts)
    setGamePhase('PLAYERS_SETUP') // Chuyển sang bước thiết lập người chơi
    navigate('/players-setup')
  }, [chipValues, chipCounts, setChipValues, setChipCounts, navigate])

  const handleBack = useCallback(() => {
    setGamePhase('BUYIN_SETUP') // Quay lại
    navigate('/buyin-setup')
  }, [navigate])

  // Hàm tự động điều chỉnh số lượng chip để tổng bằng buy-in
  const autoAdjustChipCounts = useCallback(
    (newChipValues: ChipValues) => {
      const buyinAmount = gameState.buyinAmount
      if (buyinAmount <= 0) return chipCounts

      // Sắp xếp chip theo thứ tự giá trị giảm dần
      const chipOrder: ChipColor[] = ['black', 'blue', 'green', 'red', 'white']
      const validChips = chipOrder.filter((color) => newChipValues[color] > 0)

      if (validChips.length === 0) return chipCounts

      const newCounts: ChipCounts = { white: 0, red: 0, green: 0, blue: 0, black: 0 }
      let remaining = buyinAmount

      // Phân bổ chip từ giá trị cao đến thấp
      for (const color of validChips) {
        const chipValue = newChipValues[color]
        if (chipValue > 0 && remaining >= chipValue) {
          const maxChips = Math.floor(remaining / chipValue)
          // Ưu tiên dùng ít chip nhất có thể, nhưng đảm bảo có đủ chip nhỏ để làm tròn
          const chipsToUse =
            color === validChips[validChips.length - 1]
              ? Math.floor(remaining / chipValue) // Chip nhỏ nhất: dùng hết số còn lại
              : Math.min(maxChips, Math.floor((buyinAmount * 0.3) / chipValue)) // Chip khác: giới hạn 30% tổng giá trị

          newCounts[color] = chipsToUse
          remaining -= chipsToUse * chipValue
        }
      }

      // Nếu còn dư, thêm vào chip nhỏ nhất
      if (remaining > 0) {
        const smallestChip = validChips[validChips.length - 1]
        const smallestValue = newChipValues[smallestChip]
        if (smallestValue > 0) {
          newCounts[smallestChip] += Math.ceil(remaining / smallestValue)
        }
      }

      return newCounts
    },
    [gameState.buyinAmount, chipCounts]
  )

  // Tự động điều chỉnh chip counts khi component load lần đầu
  useEffect(() => {
    if (gameState.buyinAmount > 0) {
      // Tạo function inline để tránh dependency loop
      const calculateInitialCounts = (values: ChipValues) => {
        const buyinAmount = gameState.buyinAmount
        if (buyinAmount <= 0) return chipCounts

        const chipOrder: ChipColor[] = ['black', 'blue', 'green', 'red', 'white']
        const validChips = chipOrder.filter((color) => values[color] > 0)

        if (validChips.length === 0) return chipCounts

        const newCounts: ChipCounts = { white: 0, red: 0, green: 0, blue: 0, black: 0 }
        let remaining = buyinAmount

        for (const color of validChips) {
          const chipValue = values[color]
          if (chipValue > 0 && remaining >= chipValue) {
            const maxChips = Math.floor(remaining / chipValue)
            const chipsToUse =
              color === validChips[validChips.length - 1]
                ? Math.floor(remaining / chipValue)
                : Math.min(maxChips, Math.floor((buyinAmount * 0.3) / chipValue))

            newCounts[color] = chipsToUse
            remaining -= chipsToUse * chipValue
          }
        }

        if (remaining > 0) {
          const smallestChip = validChips[validChips.length - 1]
          const smallestValue = values[smallestChip]
          if (smallestValue > 0) {
            newCounts[smallestChip] += Math.ceil(remaining / smallestValue)
          }
        }

        return newCounts
      }

      const adjustedCounts = calculateInitialCounts(chipValues)
      setLocalChipCounts(adjustedCounts)
    }
  }, []) // Chỉ chạy một lần khi component mount

  const handleChipValueChange = useCallback(
    (color: ChipColor, value: string) => {
      if (isValidPositiveNumber(value) || value === '') {
        const newChipValues = {
          ...chipValues,
          [color]: value === '' ? 0 : parseInt(value)
        }
        setLocalChipValues(newChipValues)

        // Tự động điều chỉnh số lượng chip
        const adjustedCounts = autoAdjustChipCounts(newChipValues)
        setLocalChipCounts(adjustedCounts)
      }
    },
    [chipValues, autoAdjustChipCounts]
  )

  const handleChipCountChange = useCallback((color: ChipColor, count: string) => {
    if (isValidPositiveNumber(count) || count === '') {
      setLocalChipCounts((prev) => ({
        ...prev,
        [color]: count === '' ? 0 : parseInt(count)
      }))
    }
  }, [])

  const resetToDefaults = useCallback(() => {
    setLocalChipValues(DEFAULT_CHIP_VALUES)
    // Tự động điều chỉnh số lượng chip theo buy-in amount
    const adjustedCounts = autoAdjustChipCounts(DEFAULT_CHIP_VALUES)
    setLocalChipCounts(adjustedCounts)
  }, [autoAdjustChipCounts])

  // dùng useMemo để tính toán lại chỉ khi cần thiết
  const getTotalValue = useMemo(() => {
    return Object.keys(chipValues).reduce((total, color) => {
      const chipColor = color as ChipColor
      return total + chipValues[chipColor] * chipCounts[chipColor]
    }, 0)
  }, [chipValues, chipCounts])

  // Kiểm tra xem tổng có bằng buy-in không
  const totalMatchesBuyin = useMemo(
    () => getTotalValue === gameState.buyinAmount,
    [getTotalValue, gameState.buyinAmount]
  )

  // kiểm tra hợp lệ chỉ khi giá trị thay đổi
  const isValid = useMemo(
    () =>
      Object.values(chipValues).every((value) => value > 0) &&
      Object.values(chipCounts).every((count) => count >= 0) &&
      totalMatchesBuyin,
    [chipValues, chipCounts, totalMatchesBuyin]
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 p-3 sm:p-4'>
      <div className='max-w-sm sm:max-w-4xl mx-auto'>
        <div className='text-center mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>Thiết lập giá trị Chip</h1>
          <p className='text-sm sm:text-base text-red-100 px-2'>Cấu hình giá trị và số lượng cho từng loại chip</p>
          <div className='mt-3 p-3 bg-red-600/20 rounded-lg'>
            <div className='text-white font-medium text-sm sm:text-base'>
              Mục tiêu: Tổng giá trị chip = {formatMoney(gameState.buyinAmount)}
            </div>
          </div>
        </div>

        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <div className='space-y-3 sm:space-y-4'>
            {(Object.keys(CHIP_NAMES) as ChipColor[]).map((color) => (
              <div key={color} className='bg-white/5 rounded-xl p-3 sm:p-4'>
                <div className='flex items-center gap-3 sm:gap-4 mb-3'>
                  <img
                    src={CHIP_IMAGES[color]}
                    alt={CHIP_NAMES[color]}
                    className='w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0'
                  />
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-white font-medium text-sm sm:text-base'>{CHIP_NAMES[color]}</h3>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                  <div>
                    <label className='block text-white/80 text-xs sm:text-sm mb-1'>Giá trị (円)</label>
                    <input
                      type='number'
                      value={chipValues[color]}
                      onChange={(e) => handleChipValueChange(color, e.target.value)}
                      className='w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/20 border border-white/30 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
                      min='1'
                      inputMode='numeric'
                      pattern='[0-9]*'
                    />
                  </div>
                  <div>
                    <label className='block text-white/80 text-xs sm:text-sm mb-1'>Số lượng</label>
                    <input
                      type='number'
                      value={chipCounts[color]}
                      onChange={(e) => handleChipCountChange(color, e.target.value)}
                      className='w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/20 border border-white/30 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
                      min='0'
                      inputMode='numeric'
                      pattern='[0-9]*'
                    />
                  </div>
                </div>

                <div className='mt-2 text-right'>
                  <span className='text-white font-medium text-sm sm:text-base'>
                    {formatMoney(chipValues[color] * chipCounts[color])}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl ${totalMatchesBuyin ? 'bg-green-600/20 border border-green-400/30' : 'bg-red-600/20 border border-red-400/30'}`}
          >
            <div className='flex justify-between items-center mb-2'>
              <span className='text-white font-medium text-sm sm:text-base'>Tổng giá trị mỗi set chip:</span>
              <span className='text-lg sm:text-xl font-bold text-white'>{formatMoney(getTotalValue)}</span>
            </div>
            <div className='flex justify-between items-center text-xs sm:text-sm'>
              <span className='text-white/80'>Mục tiêu (Buy-in):</span>
              <span className='text-white/80'>{formatMoney(gameState.buyinAmount)}</span>
            </div>
            <div className='mt-2 text-center'>
              {totalMatchesBuyin ? (
                <span className='text-green-300 font-medium text-xs sm:text-sm'>✓ Đạt mục tiêu!</span>
              ) : (
                <span className='text-red-300 font-medium text-xs sm:text-sm'>
                  ⚠ Chênh lệch: {formatMoney(Math.abs(getTotalValue - gameState.buyinAmount))}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
          <button
            onClick={handleBack}
            className='order-2 sm:order-1 px-4 sm:px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
            type='button'
          >
            Quay lại
          </button>

          <button
            onClick={resetToDefaults}
            className='order-3 sm:order-2 px-4 sm:px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
            type='button'
          >
            Đặt lại mặc định
          </button>

          {!totalMatchesBuyin && (
            <button
              onClick={() => {
                const adjustedCounts = autoAdjustChipCounts(chipValues)
                setLocalChipCounts(adjustedCounts)
              }}
              className='order-4 sm:order-3 px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
              type='button'
            >
              Tự động điều chỉnh
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!isValid}
            className={`${totalMatchesBuyin ? 'order-1 sm:order-3' : 'order-1 sm:order-4'} px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors text-sm sm:text-base`}
            type='button'
          >
            Tiếp theo
          </button>
        </div>
      </div>
    </div>
  )
}
