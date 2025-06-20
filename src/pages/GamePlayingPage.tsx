/**
 * Bước 4: Màn hình trò chơi
 * Các chức năng: trao đổi chip giữa người chơi, tạm ứng tiền từ bank
 */

import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStateContext } from '../hooks/useGameState'
import { ChipDisplayList } from '../components/ChipDisplay'
import { ChipTransferModal } from '../components/ChipTransferModal'
import { formatMoney } from '../utils/formatters'
import type { ChipCounts } from '../types'
import { Banknote, RotateCcw, ArrowLeftRight } from 'lucide-react'

export const GamePlayingPage: React.FC = () => {
  const navigate = useNavigate()
  const { gameState, handleBankOperation, resetGame } = useGameStateContext()
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedFromPlayerId, setSelectedFromPlayerId] = useState<number | null>(null)
  const [modalKey, setModalKey] = useState(0)

  // 最適化: dùng useCallback để tránh tạo lại hàm không cần thiết
  const handleNext = useCallback(() => {
    navigate('/final-chips-input')
  }, [navigate])

  const handleBack = useCallback(() => {
    navigate('/players-setup')
  }, [navigate])

  const handleAdvance = useCallback(
    (playerId: number, amount: number) => {
      handleBankOperation(playerId, { type: 'advance', amount }, amount)
    },
    [handleBankOperation]
  )

  const handleOpenTransferModal = useCallback((fromPlayerId: number) => {
    console.log('Opening transfer modal for player ID:', fromPlayerId)

    // Đóng modal hiện tại nếu có và reset state
    setIsTransferModalOpen(false)
    setSelectedFromPlayerId(null)

    // Tăng modalKey để force re-mount modal hoàn toàn
    setModalKey((prev) => prev + 1)

    // Delay nhỏ để đảm bảo modal cũ đóng hoàn toàn trước khi mở modal mới
    setTimeout(() => {
      console.log('Setting new fromPlayerId:', fromPlayerId)
      setSelectedFromPlayerId(fromPlayerId)
      setIsTransferModalOpen(true)
    }, 50)
  }, [])

  const handleCloseTransferModal = useCallback(() => {
    setIsTransferModalOpen(false)
    setSelectedFromPlayerId(null)
  }, [])

  // 最適化: dùng useMemo để tính toán lại chỉ khi cần thiết
  const totalBuyin = useMemo(
    () => gameState.buyinAmount * gameState.players.length,
    [gameState.buyinAmount, gameState.players.length]
  )
  const totalAdvance = useMemo(
    () => gameState.transactions.filter((t) => t.type === 'advance').reduce((sum, t) => sum + t.amount, 0),
    [gameState.transactions]
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-3 sm:p-4'>
      <div className='max-w-sm sm:max-w-6xl mx-auto'>
        <div className='text-center mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>Game đang diễn ra</h1>
          <p className='text-sm sm:text-base text-green-100 px-2'>Quản lý chip và giao dịch trong game</p>
        </div>

        {/* Game Status */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <div className='grid grid-cols-2 gap-3 sm:gap-4 text-center'>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{gameState.players.length}</div>
              <div className='text-green-200 text-xs sm:text-sm'>Người chơi</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{formatMoney(totalBuyin)}</div>
              <div className='text-green-200 text-xs sm:text-sm'>Tổng buy-in</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{gameState.transactions.length}</div>
              <div className='text-green-200 text-xs sm:text-sm'>Giao dịch</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{formatMoney(totalAdvance)}</div>
              <div className='text-green-200 text-xs sm:text-sm'>Tổng tạm ứng</div>
            </div>
          </div>
        </div>

        {/* Players */}
        <div className='space-y-3 sm:space-y-4 mb-4 sm:mb-6'>
          {gameState.players.map((player) => {
            // Tính tổng giá trị chip trực tiếp thay vì dùng useMemo trong callback
            const totalValue = Object.keys(player.currentChips).reduce((total, color) => {
              const chipColor = color as keyof ChipCounts
              return total + player.currentChips[chipColor] * gameState.chipValues[chipColor]
            }, 0)

            return (
              <div key={player.id} className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3'>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-lg sm:text-xl font-bold text-white truncate'>{player.name}</h3>
                    <div className='text-green-200 text-xs sm:text-sm'>
                      Buy-in: {formatMoney(player.buyinAmount)} | Tạm ứng: {formatMoney(player.additionalBuyin)} | Tổng:{' '}
                      {formatMoney(player.buyinAmount + player.additionalBuyin)}
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleAdvance(player.id, gameState.buyinAmount)}
                      className='px-3 sm:px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap'
                    >
                      <Banknote className='w-3 h-3 sm:w-4 sm:h-4' />
                      Tạm ứng
                    </button>
                    {gameState.players.length >= 2 && (
                      <button
                        onClick={() => handleOpenTransferModal(player.id)}
                        className='px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap'
                      >
                        <ArrowLeftRight className='w-3 h-3 sm:w-4 sm:h-4' />
                        Chuyển
                      </button>
                    )}
                  </div>
                </div>

                <div className='bg-white/5 rounded-lg p-3 sm:p-4'>
                  <div className='text-white/80 text-xs sm:text-sm mb-2'>Chip hiện tại:</div>
                  <div className='mb-2'>
                    <ChipDisplayList
                      chips={player.currentChips}
                      chipValues={gameState.chipValues}
                      size='medium'
                      showValues={true}
                      showCounts={true}
                    />
                  </div>
                  <div className='text-right text-green-200 font-medium text-xs sm:text-sm'>
                    Tổng giá trị: {formatMoney(totalValue)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Transfer Modal - Đưa ra ngoài vòng lặp để tránh duplicate */}
        {isTransferModalOpen && selectedFromPlayerId && (
          <ChipTransferModal
            key={`modal-${selectedFromPlayerId}-${modalKey}`}
            isOpen={isTransferModalOpen}
            onClose={handleCloseTransferModal}
            fromPlayerId={selectedFromPlayerId}
          />
        )}

        {/* Transactions */}
        {gameState.transactions.length > 0 && (
          <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
            <h3 className='text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4'>Lịch sử giao dịch</h3>
            <div className='space-y-2 max-h-48 sm:max-h-60 overflow-y-auto'>
              {gameState.transactions
                .slice()
                .reverse()
                .map((transaction) => {
                  const getTransactionIcon = () => {
                    switch (transaction.type) {
                      case 'buyin':
                        return '💰'
                      case 'advance':
                        return '🏦'
                      case 'transfer':
                        return '🔄'
                      default:
                        return '💸'
                    }
                  }

                  const getTransactionColor = () => {
                    switch (transaction.type) {
                      case 'buyin':
                        return 'text-green-300'
                      case 'advance':
                        return 'text-yellow-300'
                      case 'transfer':
                        return 'text-blue-300'
                      default:
                        return 'text-white'
                    }
                  }

                  return (
                    <div key={transaction.id} className='bg-white/5 rounded-lg p-3 flex justify-between items-center'>
                      <div className='flex items-start gap-3 flex-1 min-w-0'>
                        <span className='text-lg flex-shrink-0'>{getTransactionIcon()}</span>
                        <div className='flex-1 min-w-0'>
                          <div className={`font-medium text-sm sm:text-base truncate ${getTransactionColor()}`}>
                            {transaction.description}
                          </div>
                          <div className='text-green-200 text-xs sm:text-sm'>
                            {new Date(transaction.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold text-sm sm:text-base flex-shrink-0 ${getTransactionColor()}`}>
                        {formatMoney(transaction.amount)}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
          <button
            onClick={handleBack}
            className='order-3 sm:order-1 px-4 sm:px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
          >
            Quay lại
          </button>

          <button
            onClick={resetGame}
            className='order-2 sm:order-2 px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
          >
            <RotateCcw className='w-4 h-4 sm:w-5 sm:h-5' />
            Reset Game
          </button>

          <button
            onClick={handleNext}
            className='order-1 sm:order-3 px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
          >
            Kết thúc Game
          </button>
        </div>
      </div>
    </div>
  )
}
