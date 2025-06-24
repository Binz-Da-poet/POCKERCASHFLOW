/**
 * Bước 5: Màn hình nhập lại số lượng chip còn lại
 * Mỗi người chơi nhập vào số lượng chip mà mình còn sở hữu tại thời điểm kết thúc trò chơi
 */

import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStateContext } from '../hooks/useGameState'
import { CHIP_IMAGES } from '../assets'
import { formatMoney } from '../utils/formatters'
import { CHIP_NAMES } from '../types'
import type { ChipCounts, ChipColor } from '../types'
import { Target, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react'

const INIT_CHIPS: ChipCounts = { white: 0, red: 0, green: 0, blue: 0, black: 0 }

export const FinalChipsInputPage: React.FC = () => {
  const navigate = useNavigate()
  const { gameState,setGamePhase, updatePlayerFinalChips } = useGameStateContext()
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentChips, setCurrentChips] = useState<ChipCounts>(() => {
    const player = gameState.players[0]
    return player?.finalChips ? { ...player.finalChips } : { ...INIT_CHIPS }
  })

  const currentPlayer = gameState.players[currentPlayerIndex]

  //  kiểm tra số dương hợp lệ khi nhập
  const handleChipChange = useCallback((color: ChipColor, value: string) => {
    if (/^\d*$/.test(value)) {
      setCurrentChips((prev) => ({
        ...prev,
        [color]: value === '' ? 0 : Math.max(0, parseInt(value))
      }))
    }
  }, [])

  const totalChips = useMemo(() => {
    let sum = 0
    for (const count of Object.values(currentChips)) {
      sum += count
    }
    return sum
  }, [currentChips])

  // Tính tổng số tiền đã đầu tư (buy-in + mua thêm từ bank)
  const totalInvestment = useMemo(() => {
    return gameState.players.reduce((total, player) => {
      return total + player.buyinAmount + player.additionalBuyin
    }, 0)
  }, [gameState.players])

  // Tính tổng giá trị chip của tất cả người chơi đã nhập + người chơi hiện tại đang nhập
  const totalGameValue = useMemo(() => {
    return gameState.players.reduce((total, player) => {
      if (player.id === currentPlayer.id) {
        // Sử dụng currentChips cho player hiện tại (đang nhập)
        const playerValue = Object.keys(currentChips).reduce((playerTotal, color) => {
          const chipColor = color as ChipColor
          return playerTotal + currentChips[chipColor] * gameState.chipValues[chipColor]
        }, 0)
        return total + playerValue
      } else if (player.finalChips) {
        // Sử dụng finalChips cho các player đã hoàn thành
        const playerValue = Object.keys(player.finalChips).reduce((playerTotal, color) => {
          const chipColor = color as ChipColor
          return playerTotal + player.finalChips![chipColor] * gameState.chipValues[chipColor]
        }, 0)
        return total + playerValue
      }
      return total
    }, 0)
  }, [gameState.players, gameState.chipValues, currentPlayer.id, currentChips])

  // Kiểm tra số người chơi đã nhập chip cuối + người hiện tại
  const completedPlayers = useMemo(() => {
    const completedCount = gameState.players.filter((player) => player.finalChips).length
    // Cộng thêm 1 nếu người hiện tại đang nhập (có ít nhất 1 chip > 0 hoặc tất cả = 0)
    const currentPlayerHasInput =
      Object.values(currentChips).some((count) => count > 0) ||
      Object.values(currentChips).every((count) => count === 0)
    return currentPlayerHasInput ? completedCount + 1 : completedCount
  }, [gameState.players, currentChips])

  // Tính chênh lệch
  const difference = totalGameValue - totalInvestment
  const isBalanced = difference === 0
  const allPlayersCompleted = completedPlayers === gameState.players.length

  // Kiểm tra xem có thể chuyển sang kết quả không (chỉ khi đang ở người cuối cùng)
  const canProceedToResults = currentPlayerIndex === gameState.players.length - 1
  const wouldBeBalanced = useMemo(() => {
    if (!canProceedToResults) return true

    // Tính tổng bao gồm cả currentChips của người chơi hiện tại
    const finalTotalValue = gameState.players.reduce((total, player) => {
      if (player.id === currentPlayer.id) {
        // Sử dụng currentChips cho player hiện tại
        const playerValue = Object.keys(currentChips).reduce((playerTotal, color) => {
          const chipColor = color as ChipColor
          return playerTotal + currentChips[chipColor] * gameState.chipValues[chipColor]
        }, 0)
        return total + playerValue
      } else if (player.finalChips) {
        const playerValue = Object.keys(player.finalChips).reduce((playerTotal, color) => {
          const chipColor = color as ChipColor
          return playerTotal + player.finalChips![chipColor] * gameState.chipValues[chipColor]
        }, 0)
        return total + playerValue
      }
      return total
    }, 0)

    return finalTotalValue === totalInvestment
  }, [canProceedToResults, gameState.players, currentPlayer, currentChips, gameState.chipValues, totalInvestment])

  //  chỉ update khi có thay đổi thực sự
  const handleNext = useCallback(() => {
    updatePlayerFinalChips(currentPlayer.id, currentChips)
    if (currentPlayerIndex < gameState.players.length - 1) {
      const nextPlayer = gameState.players[currentPlayerIndex + 1]
      setCurrentPlayerIndex((prev) => prev + 1)
      setCurrentChips(nextPlayer?.finalChips ? { ...nextPlayer.finalChips } : { ...INIT_CHIPS })
    } else {
      // Kiểm tra cân bằng trước khi chuyển sang kết quả
      const finalTotalGameValue = gameState.players.reduce((total, player) => {
        if (player.id === currentPlayer.id) {
          // Sử dụng currentChips cho player hiện tại
          const playerValue = Object.keys(currentChips).reduce((playerTotal, color) => {
            const chipColor = color as ChipColor
            return playerTotal + currentChips[chipColor] * gameState.chipValues[chipColor]
          }, 0)
          return total + playerValue
        } else if (player.finalChips) {
          const playerValue = Object.keys(player.finalChips).reduce((playerTotal, color) => {
            const chipColor = color as ChipColor
            return playerTotal + player.finalChips![chipColor] * gameState.chipValues[chipColor]
          }, 0)
          return total + playerValue
        }
        return total
      }, 0)

      const finalDifference = finalTotalGameValue - totalInvestment

      if (finalDifference !== 0) {
        // Hiển thị thông báo lỗi
        alert(
          `⚠️ CHƯA CÂN BẰNG!\n\nTổng giá trị chip: ${formatMoney(finalTotalGameValue)}\nTổng đầu tư: ${formatMoney(totalInvestment)}\nChênh lệch: ${finalDifference >= 0 ? '+' : ''}${formatMoney(finalDifference)}\n\nVui lòng kiểm tra và nhập lại số chip cho chính xác!`
        )
        return
      }
      setGamePhase('FINAL_RESULTS'); // Cập nhật giai đoạn game
      navigate('/final-results')
    }
  }, [
    currentPlayer,
    currentChips,
    currentPlayerIndex,
    gameState.players,
    gameState.chipValues,
    updatePlayerFinalChips,
    navigate,
    totalInvestment
  ])

  const handleBack = useCallback(() => {
    if (currentPlayerIndex > 0) {
      const prevPlayer = gameState.players[currentPlayerIndex - 1]
      setCurrentPlayerIndex((prev) => prev - 1)
      setCurrentChips(prevPlayer?.finalChips ? { ...prevPlayer.finalChips } : { ...INIT_CHIPS })
    } else {
      setGamePhase('PLAYING');  // Quay lại 
      navigate('/game-playing')
    }
  }, [currentPlayerIndex, gameState.players, navigate])

  //  dùng useMemo để tránh tính lại không cần thiết
  const totalValue = useMemo(() => {
    let total = 0
    for (const color of Object.keys(currentChips) as ChipColor[]) {
      total += currentChips[color] * gameState.chipValues[color]
    }
    return total
  }, [currentChips, gameState.chipValues])

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 p-3 sm:p-4'>
      <div className='max-w-sm sm:max-w-2xl mx-auto'>
        <div className='text-center mb-6 sm:mb-8'>
          <div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full mb-3 sm:mb-4'>
            <Target className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>Nhập chip cuối game</h1>
          <p className='text-sm sm:text-base text-red-100 px-2'>Nhập số chip còn lại của từng người chơi</p>
        </div>

        {/* Balance Check - Hiển thị kiểm tra cân bằng */}
        {(completedPlayers > 0 || Object.values(currentChips).some((count) => count > 0)) && (
          <div
            className={`backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 ${
              allPlayersCompleted
                ? isBalanced
                  ? 'bg-green-600/20 border border-green-500/30'
                  : 'bg-red-600/20 border border-red-500/30'
                : 'bg-blue-600/20 border border-blue-500/30'
            }`}
          >
            <h3 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2'>
              <DollarSign className='w-5 h-5' />
              Kiểm tra cân bằng
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center mb-4'>
              <div className='bg-white/10 rounded-lg p-3'>
                <div className='text-lg sm:text-xl font-bold text-white'>{formatMoney(totalInvestment)}</div>
                <div className='text-white/80 text-xs sm:text-sm'>Tổng giá trị chip </div>
                <div className='text-white/60 text-xs'>Buy-in + Mua BANK</div>
              </div>
              <div className='bg-white/10 rounded-lg p-3'>
                <div className='text-lg sm:text-xl font-bold text-white'>{formatMoney(totalGameValue)}</div>
                <div className='text-white/80 text-xs sm:text-sm'>Tổng giá trị chip sau khi nhập</div>
                <div className='text-white/60 text-xs'>
                  ({completedPlayers}/{gameState.players.length} người)
                  {currentPlayerIndex < gameState.players.length - 1 && (
                    <span className='text-yellow-300'> *đang nhập</span>
                  )}
                </div>
              </div>
              <div className='bg-white/10 rounded-lg p-3'>
                <div
                  className={`text-lg sm:text-xl font-bold ${
                    difference === 0 ? 'text-green-300' : difference > 0 ? 'text-yellow-300' : 'text-red-300'
                  }`}
                >
                  {difference >= 0 ? '+' : ''}
                  {formatMoney(difference)}
                </div>
                <div className='text-white/80 text-xs sm:text-sm'>Chênh lệch</div>
                <div className='text-white/60 text-xs'>
                  {difference === 0 ? 'Cân bằng' : difference > 0 ? 'Thừa' : 'Thiếu'}
                </div>
              </div>
            </div>

            {allPlayersCompleted && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  isBalanced ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                }`}
              >
                {isBalanced ? (
                  <>
                    <CheckCircle className='w-5 h-5 text-green-400' />
                    <span className='font-medium'>Cân bằng hoàn hảo! Tổng chip = Tổng đầu tư</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className='w-5 h-5 text-red-400' />
                    <span className='font-medium'>
                      {difference > 0
                        ? `Thừa ${formatMoney(Math.abs(difference))} - Đếm lại chip đi mấy ní`
                        : `Thiếu ${formatMoney(Math.abs(difference))} - Đếm lại chip đi mấy ní`}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Cảnh báo khi sắp xem kết quả nhưng chưa cân bằng */}
            {canProceedToResults && !wouldBeBalanced && (
              <div className='bg-red-500/30 border border-red-400/50 rounded-lg p-3 mt-3 flex items-center gap-2'>
                <AlertTriangle className='w-5 h-5 text-red-400 flex-shrink-0' />
                <span className='text-red-200 font-medium text-sm'>
                  ⚠️ Vẫn chưa đủ tiền các bồ tèo ơi ! đếm lại chip nhập lại cho đúng tiền đi.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <div className='flex justify-between items-center mb-3 sm:mb-4'>
            <h2 className='text-lg sm:text-xl font-semibold text-white'>
              Người chơi {currentPlayerIndex + 1}/{gameState.players.length}
            </h2>
            <div className='text-orange-200 text-xs sm:text-sm'>
              {Math.round(((currentPlayerIndex + 1) / gameState.players.length) * 100)}%
            </div>
          </div>

          <div className='w-full bg-white/20 rounded-full h-2 mb-3 sm:mb-4'>
            <div
              className='bg-red-500 h-2 rounded-full transition-all duration-300'
              style={{ width: `${((currentPlayerIndex + 1) / gameState.players.length) * 100}%` }}
            />
          </div>

          <div className='text-center'>
            <h3 className='text-xl sm:text-2xl font-bold text-white mb-1'>{currentPlayer.name}</h3>
            <div className='text-red-200 text-xs sm:text-sm'>
              Buy-in: {formatMoney(currentPlayer.buyinAmount)} | Mua BANK: {formatMoney(currentPlayer.additionalBuyin)}{' '}
              | Tổng đầu tư: {formatMoney(currentPlayer.buyinAmount + currentPlayer.additionalBuyin)}
            </div>
          </div>
        </div>

        {/* Chip Input */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <h3 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4'>Nhập số chip còn lại</h3>

          <div className='space-y-3 sm:space-y-4'>
            {(Object.keys(CHIP_NAMES) as ChipColor[]).map((color) => (
              <div key={color} className='bg-white/5 rounded-xl p-3 sm:p-4'>
                <div className='flex items-center gap-3 sm:gap-4'>
                  <img
                    src={CHIP_IMAGES[color]}
                    alt={CHIP_NAMES[color]}
                    className='w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0'
                  />
                  <div className='flex-1 min-w-0'>
                    <div className='text-white font-medium text-sm sm:text-base mb-1'>{CHIP_NAMES[color]}</div>
                    <div className='text-white/60 text-xs sm:text-sm'>
                      {formatMoney(gameState.chipValues[color])} mỗi chip
                    </div>
                  </div>
                  <div className='flex-shrink-0 w-16 sm:w-20'>
                    <input
                      type='number'
                      value={currentChips[color]}
                      onChange={(e) => handleChipChange(color, e.target.value)}
                      className='w-full px-2 sm:px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base'
                      min='0'
                      placeholder='0'
                      inputMode='numeric'
                      pattern='[0-9]*'
                    />
                  </div>
                  <div className='text-right text-white font-medium text-xs sm:text-sm w-16 sm:w-20 flex-shrink-0'>
                    {formatMoney(currentChips[color] * gameState.chipValues[color])}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className='bg-red-600/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <h3 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4'>Tổng kết</h3>
          <div className='grid grid-cols-2 gap-3 sm:gap-4 text-center'>
            <div>
              <div className='text-xl sm:text-2xl font-bold text-white'>{totalChips}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Tổng chip</div>
            </div>
            <div>
              <div className='text-xl sm:text-2xl font-bold text-white'>{formatMoney(totalValue)}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Tổng giá trị</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
          <button
            onClick={handleBack}
            className='order-2 sm:order-1 px-4 sm:px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
          >
            {currentPlayerIndex > 0 ? 'Người trước' : 'Quay lại'}
          </button>

          <button
            onClick={handleNext}
            disabled={canProceedToResults && !wouldBeBalanced}
            className={`order-1 sm:order-2 px-4 sm:px-6 py-3 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
              canProceedToResults && !wouldBeBalanced
                ? 'bg-red-600/50 text-red-200 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {currentPlayerIndex < gameState.players.length - 1 ? (
              <>
                Người tiếp theo
                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5' />
              </>
            ) : (
              <>
                {canProceedToResults && !wouldBeBalanced ? (
                  <>
                    Thiếu tiền
                    <AlertTriangle className='w-4 h-4 sm:w-5 sm:h-5' />
                  </>
                ) : (
                  <>
                    Xem kết quả
                    <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5' />
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
