/**
 * Bước 4: Màn hình trò chơi
 * Các chức năng: mua bán chip giữa người chơi, tạm ứng tiền từ bank
 */

import React, { useCallback, useMemo, useState } from 'react'
import { useGameStateContext } from '../hooks/useGameState'
import { useGameStatusRedirect } from '../hooks/useGameStatusRedirect'
import { ChipDisplayList } from '../components/ChipDisplay'
import { ChipTransferModal } from '../components/ChipTransferModal'
import { formatMoney } from '../utils/formatters'
import { GAME_STATUS } from '../types'
import type { ChipCounts } from '../types'
import { Banknote, RotateCcw, ArrowLeftRight, Receipt, ArrowDownLeft } from 'lucide-react'

export const GamePlayingPage: React.FC = () => {
  const { gameState, handleBankOperation, resetGame } = useGameStateContext()
  const { updateStatusAndNavigate } = useGameStatusRedirect()
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedFromPlayerId, setSelectedFromPlayerId] = useState<number | null>(null)
  const [modalKey, setModalKey] = useState(0)

  //  dùng useCallback để tránh tạo lại hàm không cần thiết
  const handleNext = useCallback(() => {
    updateStatusAndNavigate(GAME_STATUS.FINAL_CHIPS_INPUT)
  }, [updateStatusAndNavigate])

  const handleBack = useCallback(() => {
    updateStatusAndNavigate(GAME_STATUS.PLAYERS_SETUP)
  }, [updateStatusAndNavigate])

  const handleAdvance = useCallback(
    (playerId: number, amount: number) => {
      handleBankOperation(playerId, { type: 'advance', amount }, amount)
    },
    [handleBankOperation]
  )

  const handleRepay = useCallback(
    (playerId: number, amount: number) => {
      handleBankOperation(playerId, { type: 'repay', amount }, amount)
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

  //  dùng useMemo để tính toán lại chỉ khi cần thiết
  const totalBuyin = useMemo(
    () => gameState.buyinAmount * gameState.players.length,
    [gameState.buyinAmount, gameState.players.length]
  )
  const totalAdvance = useMemo(() => {
    const advances = gameState.transactions.filter((t) => t.type === 'advance').reduce((sum, t) => sum + t.amount, 0)
    const repays = gameState.transactions.filter((t) => t.type === 'repay').reduce((sum, t) => sum + t.amount, 0)
    return advances - repays
  }, [gameState.transactions])

  // Tính tổng số tiền đã bán của tất cả người chơi
  const totalSales = useMemo(
    () => gameState.transactions.filter((t) => t.type === 'transfer').reduce((sum, t) => sum + t.amount, 0),
    [gameState.transactions]
  )

  // Tính tổng đầu tư và giới hạn bán
  const totalInvestment = useMemo(() => totalBuyin + totalAdvance, [totalBuyin, totalAdvance])

  // const remainingSellLimit = useMemo(() => totalInvestment - totalSales, [totalInvestment, totalSales])

  // Tính toán số tiền ai đang nợ ai bao nhiêu tiền + nợ BANK
  const debtCalculations = useMemo(() => {
    const debts: Array<{ debtor: string; creditor: string; amount: number; isBank: boolean }> = []

    // 1. Lọc các giao dịch chuyển tiền giữa người chơi
    const transferTransactions = gameState.transactions.filter((t) => t.type === 'transfer')

    transferTransactions.forEach((transaction) => {
      if (transaction.fromPlayerId && transaction.toPlayerId) {
        const fromPlayer = gameState.players.find((p) => p.id === transaction.fromPlayerId)
        const toPlayer = gameState.players.find((p) => p.id === transaction.toPlayerId)

        if (fromPlayer && toPlayer) {
          // Người bán chip (fromPlayer) là người cho vay
          // Người mua chip (toPlayer) là người nợ
          debts.push({
            debtor: toPlayer.name, // Người nợ
            creditor: fromPlayer.name, // Người cho vay
            amount: transaction.amount,
            isBank: false
          })
        }
      }
    })

    // 2. Thêm nợ BANK cho những người mua BANK thêm
    gameState.players.forEach((player) => {
      if (player.additionalBuyin > 0) {
        debts.push({
          debtor: player.name,
          creditor: 'BANK',
          amount: player.additionalBuyin,
          isBank: true
        })
      }
    })

    // 3. Gộp các khoản nợ cùng một cặp người (không gộp nợ BANK)
    const consolidatedDebts = new Map<string, { amount: number; isBank: boolean }>()

    debts.forEach(({ debtor, creditor, amount, isBank }) => {
      const key = `${debtor}-${creditor}`
      const reverseKey = `${creditor}-${debtor}`

      // Không gộp nợ BANK với nợ người chơi
      if (isBank) {
        const existing = consolidatedDebts.get(key)
        consolidatedDebts.set(key, {
          amount: (existing?.amount || 0) + amount,
          isBank: true
        })
        return
      }

      if (consolidatedDebts.has(reverseKey) && !consolidatedDebts.get(reverseKey)!.isBank) {
        // Nếu có nợ ngược chiều (và không phải nợ BANK), trừ bớt
        const existing = consolidatedDebts.get(reverseKey)!
        if (existing.amount > amount) {
          consolidatedDebts.set(reverseKey, {
            amount: existing.amount - amount,
            isBank: false
          })
        } else if (existing.amount < amount) {
          consolidatedDebts.delete(reverseKey)
          consolidatedDebts.set(key, {
            amount: amount - existing.amount,
            isBank: false
          })
        } else {
          // Bằng nhau thì xóa cả hai
          consolidatedDebts.delete(reverseKey)
        }
      } else {
        // Cộng dồn nếu có cùng chiều
        const existing = consolidatedDebts.get(key)
        consolidatedDebts.set(key, {
          amount: (existing?.amount || 0) + amount,
          isBank: false
        })
      }
    })

    // 4. Nhóm nợ theo từng người nợ
    const debtsByDebtor = new Map<string, Array<{ creditor: string; amount: number; isBank: boolean }>>()

    consolidatedDebts.forEach(({ amount, isBank }, key) => {
      const [debtor, creditor] = key.split('-')

      if (!debtsByDebtor.has(debtor)) {
        debtsByDebtor.set(debtor, [])
      }

      debtsByDebtor.get(debtor)!.push({ creditor, amount, isBank })
    })

    // 5. Chuyển đổi thành format hiển thị
    const finalDebts: Array<{
      debtor: string
      debts: Array<{ creditor: string; amount: number; isBank: boolean }>
      totalAmount: number
    }> = []

    debtsByDebtor.forEach((debts, debtor) => {
      // Sắp xếp: BANK trước, sau đó theo số tiền giảm dần
      const sortedDebts = debts.sort((a, b) => {
        if (a.isBank && !b.isBank) return -1
        if (!a.isBank && b.isBank) return 1
        return b.amount - a.amount
      })

      const totalAmount = debts.reduce((sum, debt) => sum + debt.amount, 0)

      finalDebts.push({
        debtor,
        debts: sortedDebts,
        totalAmount
      })
    })

    // 6. Sắp xếp theo tổng số nợ giảm dần
    return finalDebts.sort((a, b) => b.totalAmount - a.totalAmount)
  }, [gameState.transactions, gameState.players])

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 p-3 sm:p-4'>
      <div className='max-w-sm sm:max-w-6xl mx-auto'>
        <div className='text-center mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>Game đang diễn ra</h1>
          <p className='text-sm sm:text-base text-red-100 px-2'>Quản lý chip và giao dịch trong game</p>
        </div>

        {/* Game Status */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-center'>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{gameState.players.length}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Người chơi</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{formatMoney(totalBuyin)}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Tổng buy-in</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{formatMoney(totalAdvance)}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Tổng mua BANK</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{formatMoney(totalInvestment)}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Tổng đầu tư</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{formatMoney(totalSales)}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Đã bán chip</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-green-300'>{formatMoney(totalInvestment)}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Giới hạn mỗi lần bán</div>
            </div>
          </div>
        </div>

        {/* Debt Overview - Thêm section hiển thị nợ */}
        {debtCalculations.length > 0 && (
          <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
            <h3 className='text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2'>
              <Receipt className='w-5 h-5' />
              Tình hình các con nợ
            </h3>
            <div className='space-y-3 sm:space-y-4'>
              {debtCalculations.map((debtGroup, index) => (
                <div key={index} className='bg-white/5 rounded-lg p-3 sm:p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-red-300 font-bold text-sm sm:text-base'>{debtGroup.debtor}</span>
                    <span className='text-white/80 text-sm'>đang nợ:</span>
                  </div>

                  <div className='space-y-1 mb-3'>
                    {debtGroup.debts.map((debt, debtIndex) => (
                      <div key={debtIndex} className='flex items-center gap-2 text-sm sm:text-base'>
                        <span className='text-lg'>{debt.isBank ? '🏦' : '🔄'}</span>
                        <span className='text-white/80'>
                          {debt.isBank ? 'mua thêm BANK' : `mua từ ${debt.creditor}`}
                        </span>
                        <span className='text-white/60'>-</span>
                        <span className={`font-medium ${debt.isBank ? 'text-orange-300' : 'text-yellow-300'}`}>
                          {formatMoney(debt.amount)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className='border-t border-white/20 pt-2 flex justify-between items-center'>
                    <span className='text-white/80 font-medium text-sm sm:text-base'>Tổng nợ:</span>
                    <span className='text-red-300 font-bold text-base sm:text-lg'>
                      {formatMoney(debtGroup.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {debtCalculations.length === 0 && (
              <div className='text-center text-white/60 py-4'>Chưa có giao dịch chuyển tiền nào</div>
            )}
          </div>
        )}

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
                    <div className='text-red-200 text-xs sm:text-sm'>
                      Buy-in: {formatMoney(player.buyinAmount)} | Mua BANK: {formatMoney(player.additionalBuyin)} |
                      Tổng: {formatMoney(player.buyinAmount + player.additionalBuyin)}
                    </div>
                  </div>
                  <div className='flex gap-2 flex-wrap'>
                    <button
                      onClick={() => handleAdvance(player.id, gameState.buyinAmount)}
                      className='px-3 sm:px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap'
                    >
                      <Banknote className='w-3 h-3 sm:w-4 sm:h-4' />
                      Mua BANK
                    </button>

                    {player.additionalBuyin > 0 && (
                      <button
                        onClick={() => handleRepay(player.id, Math.min(gameState.buyinAmount, player.additionalBuyin))}
                        className='px-3 sm:px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap'
                      >
                        <ArrowDownLeft className='w-3 h-3 sm:w-4 sm:h-4' />
                        Trả BANK
                      </button>
                    )}

                    {gameState.players.length >= 2 && (
                      <button
                        onClick={() => handleOpenTransferModal(player.id)}
                        className='px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap'
                      >
                        <ArrowLeftRight className='w-3 h-3 sm:w-4 sm:h-4' />
                        Bán chip
                      </button>
                    )}
                  </div>
                </div>

                <div className='bg-white/5 rounded-lg p-3 sm:p-4'>
                  <div className='text-white/80 text-xs sm:text-sm mb-2'>Chip ban đầu (tham khảo):</div>
                  <div className='mb-2'>
                    <ChipDisplayList
                      chips={player.currentChips}
                      chipValues={gameState.chipValues}
                      size='medium'
                      showValues={true}
                      showCounts={true}
                    />
                  </div>
                  <div className='text-right text-red-200 font-medium text-xs sm:text-sm'>
                    Giá trị chip ban đầu: {formatMoney(totalValue)}
                  </div>
                  <div className='text-right text-yellow-200 font-medium text-xs sm:text-sm mt-1'>
                    Tổng đầu tư: {formatMoney(player.buyinAmount + player.additionalBuyin)}
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
                      case 'repay':
                        return '💸'
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
                      case 'repay':
                        return 'text-orange-300'
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
                          <div className='text-red-200 text-xs sm:text-sm'>
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
            className='order-1 sm:order-3 px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
          >
            Kết thúc Game
          </button>
        </div>
      </div>
    </div>
  )
}
