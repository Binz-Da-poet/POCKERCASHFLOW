/**
 * Modal transfer chip giữa các người chơi 
 */

import React, { useState, useCallback, useEffect } from 'react'
import { useGameStateContext } from '../hooks/useGameState'
import { formatMoney, isValidPositiveNumber } from '../utils/formatters'
import type { ChipCounts, Player } from '../types'
import { ArrowLeftRight, X } from 'lucide-react'

interface ChipTransferModalProps {
  isOpen: boolean
  onClose: () => void
  fromPlayerId?: number | null
}

export const ChipTransferModal: React.FC<ChipTransferModalProps> = ({
  isOpen,
  onClose,
  fromPlayerId: propFromPlayerId
}) => {
  const { gameState, transferChips } = useGameStateContext()
  const [toPlayerId, setToPlayerId] = useState<number | ''>('')
  const [transferAmount, setTransferAmount] = useState('')

  const fromPlayerId = propFromPlayerId || null
  const fromPlayer = gameState.players.find((p) => p.id === fromPlayerId) as Player | undefined
  const toPlayer = gameState.players.find((p) => p.id === toPlayerId) as Player | undefined

  // Tính tổng đầu tư của TẤT CẢ người chơi
  const totalAllInvestment = gameState.players.reduce((sum, player) => {
    return sum + player.buyinAmount + player.additionalBuyin
  }, 0)

  // Giới hạn bán cho mỗi giao dịch = tổng đầu tư
  const sellLimitPerTransaction = totalAllInvestment

  // Reset form khi modal mở hoặc fromPlayerId thay đổi
  useEffect(() => {
    if (isOpen && fromPlayerId) {
      setToPlayerId('')
      setTransferAmount('')
    }
  }, [isOpen, fromPlayerId])

  // Reset form khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setToPlayerId('')
      setTransferAmount('')
    }
  }, [isOpen])

  // Kiểm tra validation
  const isValidTransfer = useCallback(() => {
    if (!fromPlayer || !toPlayer || fromPlayerId === toPlayerId) return false
    if (!isValidPositiveNumber(transferAmount)) return false

    const amount = parseInt(transferAmount)
    return amount > 0 && amount <= sellLimitPerTransaction
  }, [fromPlayer, toPlayer, fromPlayerId, toPlayerId, transferAmount, sellLimitPerTransaction])

  // Tạo chip giả cho giao dịch (chỉ để ghi nhận, không ảnh hưởng thực tế)
  const createDummyChips = (): ChipCounts => {
    // Trả về chip rỗng vì chúng ta sẽ sử dụng amount trực tiếp
    return {
      white: 0,
      red: 0,
      green: 0,
      blue: 0,
      black: 0
    }
  }

  const handleTransfer = () => {
    if (!isValidTransfer() || !fromPlayerId || !toPlayerId) return

    const amount = parseInt(transferAmount)
    const chips = createDummyChips()

    transferChips({
      fromPlayerId: fromPlayerId as number,
      toPlayerId: toPlayerId as number,
      chips,
      amount // Truyền trực tiếp số tiền để tránh tính toán sai
    })

    onClose()
  }

  if (!isOpen || !fromPlayerId) return null

  // Debug log để đảm bảo modal render đúng player
  console.log('ChipTransferModal render for player:', fromPlayer?.name, 'ID:', fromPlayerId)

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <ArrowLeftRight className='w-5 h-5' />
              BÁN CHIP
            </h2>
            <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='p-4 space-y-4'>
          {/* From Player Info */}
          {fromPlayer && (
            <div className='bg-gray-50 rounded-lg p-4'>
              <h3 className='text-sm font-medium text-gray-700 mb-2'>Từ người chơi:</h3>
              <div className='font-semibold text-gray-800'>{fromPlayer.name}</div>
              <div className='mt-2 pt-2 border-t border-gray-200'>
                <div className='text-xs text-gray-600'>Giới hạn bán (toàn game):</div>
                <div className='font-semibold text-blue-600'>{formatMoney(sellLimitPerTransaction)}</div>
              </div>
            </div>
          )}

          {/* To Player Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Bán cho:</label>
            <select
              value={toPlayerId}
              onChange={(e) => setToPlayerId(e.target.value ? Number(e.target.value) : '')}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value=''>Chọn người nhận</option>
              {gameState.players
                .filter((player) => player.id !== fromPlayerId)
                .map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Số tiền chuyển (円):</label>
            <input
              type='number'
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder='Nhập số tiền...'
              min='1'
              max={sellLimitPerTransaction}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-center'
            />
            {isValidPositiveNumber(transferAmount) && (
              <div className='mt-2 text-center text-sm text-gray-600'>{formatMoney(parseInt(transferAmount))}</div>
            )}
            {isValidPositiveNumber(transferAmount) && parseInt(transferAmount) > sellLimitPerTransaction && (
              <div className='mt-2 text-center text-sm text-red-600'>
                Vượt quá giới hạn! Chỉ có thể bán tối đa {formatMoney(sellLimitPerTransaction)}
              </div>
            )}
          </div>

          {/* Transfer Preview */}
          {isValidTransfer() && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
              <div className='text-sm text-blue-800'>
                <strong>
                  {fromPlayer?.name} bán cho {toPlayer?.name}: {formatMoney(parseInt(transferAmount))}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className='sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-b-2xl'>
          <div className='flex gap-3'>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Hủy
            </button>
            <button
              onClick={handleTransfer}
              disabled={!isValidTransfer()}
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
            >
              Bán
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
