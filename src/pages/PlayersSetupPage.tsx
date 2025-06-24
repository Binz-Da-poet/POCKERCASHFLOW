/**
 * Bước 3: Màn hình thêm người chơi
 * Người dùng nhập tên của từng người chơi
 */

import React, { useState, useCallback, useMemo } from 'react'
import { useGameStateContext } from '../hooks/useGameState'
import { useGameStatusRedirect } from '../hooks/useGameStatusRedirect'
import { ChipDisplayList } from '../components/ChipDisplay'
import { formatMoney } from '../utils/formatters'
import { GAME_STATUS } from '../types'
import type { ChipValues, ChipCounts } from '../types'
import { Trash2, Plus, Users, AlertCircle } from 'lucide-react'

export const PlayersSetupPage: React.FC = () => {
  const { gameState, addPlayer, removePlayer, updatePlayerName } = useGameStateContext()
  const { updateStatusAndNavigate } = useGameStatusRedirect()
  const [newPlayerName, setNewPlayerName] = useState('')
  const [nameError, setNameError] = useState('')

  // Kiểm tra tên trùng lặp
  const isNameDuplicate = useCallback(
    (name: string, excludeId?: number) => {
      const trimmedName = name.trim().toLowerCase()
      if (!trimmedName) return false

      return gameState.players.some((player) => player.id !== excludeId && player.name.toLowerCase() === trimmedName)
    },
    [gameState.players]
  )

  // Xử lý thay đổi tên người chơi mới
  const handleNewPlayerNameChange = useCallback(
    (value: string) => {
      setNewPlayerName(value)

      const trimmedName = value.trim()
      if (!trimmedName) {
        setNameError('')
      } else if (isNameDuplicate(trimmedName)) {
        setNameError('Tên này đã được sử dụng')
      } else {
        setNameError('')
      }
    },
    [isNameDuplicate]
  )

  const handleNext = useCallback(() => {
    if (gameState.players.length >= 2) {
      updateStatusAndNavigate(GAME_STATUS.PLAYING)
    }
  }, [gameState.players.length, updateStatusAndNavigate])

  const handleBack = useCallback(() => {
    updateStatusAndNavigate(GAME_STATUS.CHIP_VALUES_SETUP)
  }, [updateStatusAndNavigate])

  const handleAddPlayer = useCallback(() => {
    const name = newPlayerName.trim()
    if (name && !isNameDuplicate(name)) {
      addPlayer(name)
      setNewPlayerName('')
      setNameError('')
    }
  }, [addPlayer, newPlayerName, isNameDuplicate])

  const handleRemovePlayer = useCallback(
    (playerId: number) => {
      removePlayer(playerId)
    },
    [removePlayer]
  )

  const handleUpdatePlayerName = useCallback(
    (playerId: number, name: string) => {
      // Kiểm tra tên trùng lặp trước khi cập nhật
      if (!isNameDuplicate(name, playerId)) {
        updatePlayerName(playerId, name)
      }
    },
    [updatePlayerName, isNameDuplicate]
  )

  const canProceed = useMemo(() => gameState.players.length >= 2, [gameState.players.length])

  const canAddPlayer = useMemo(() => {
    const trimmedName = newPlayerName.trim()
    return trimmedName && !isNameDuplicate(trimmedName)
  }, [newPlayerName, isNameDuplicate])

  //  dùng useMemo để tránh render lại không cần thiết
  const playersList = useMemo(
    () =>
      gameState.players.length === 0 ? (
        <div className='text-center py-8 sm:py-12'>
          <Users className='w-12 h-12 sm:w-16 sm:h-16 text-white/40 mx-auto mb-3 sm:mb-4' />
          <p className='text-white/60 text-sm sm:text-base'>Chưa có người chơi nào</p>
          <p className='text-white/40 text-xs sm:text-sm mt-2'>Thêm tối thiểu 2 người chơi để bắt đầu game</p>
        </div>
      ) : (
        <div className='space-y-3 sm:space-y-4'>
          {gameState.players.map((player) => {
            const isDuplicateName =
              gameState.players.filter((p) => p.name.toLowerCase() === player.name.toLowerCase()).length > 1

            return (
              <div key={player.id} className='bg-white/5 rounded-xl p-3 sm:p-4'>
                <div className='flex items-center justify-between mb-3 sm:mb-4'>
                  <div className='flex-1 min-w-0 mr-3'>
                    <div className='relative'>
                      <input
                        type='text'
                        value={player.name}
                        onChange={(e) => handleUpdatePlayerName(player.id, e.target.value)}
                        className={`bg-transparent text-white text-base sm:text-lg font-medium border-none outline-none focus:bg-white/10 px-2 py-1 rounded w-full ${
                          isDuplicateName ? 'text-red-300' : ''
                        }`}
                      />
                      {isDuplicateName && (
                        <div className='flex items-center gap-1 mt-1'>
                          <AlertCircle className='w-3 h-3 text-red-400' />
                          <span className='text-red-400 text-xs'>Tên bị trùng lặp</span>
                        </div>
                      )}
                    </div>
                    <div className='text-red-200 text-xs sm:text-sm mt-1'>
                      Buy-in: {formatMoney(player.buyinAmount)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className='p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0'
                  >
                    <Trash2 className='w-4 h-4 sm:w-5 sm:h-5' />
                  </button>
                </div>

                <div className='bg-white/5 rounded-lg p-3'>
                  <div className='text-white/80 text-xs sm:text-sm mb-2'>Chip ban đầu:</div>
                  <div className='mb-2'>
                    <ChipDisplayList
                      chips={player.currentChips}
                      chipValues={gameState.chipValues}
                      size='small'
                      showValues={true}
                      showCounts={true}
                    />
                  </div>
                  <div className='text-right text-red-200 font-medium text-xs sm:text-sm'>
                    Tổng:{' '}
                    {formatMoney(
                      Object.keys(player.currentChips).reduce((total, color) => {
                        const chipColor = color as keyof ChipCounts
                        return total + player.currentChips[chipColor] * gameState.chipValues[chipColor]
                      }, 0)
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ),
    [gameState.players, handleRemovePlayer, handleUpdatePlayerName, gameState.chipValues]
  )

  //  dùng useMemo cho phần tổng kết
  const summary = useMemo(
    () =>
      gameState.players.length > 0 && (
        <div className='bg-red-600/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <h3 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4'>Tổng kết</h3>
          <div className='grid grid-cols-2 gap-3 sm:gap-4 text-center'>
            <div>
              <div className='text-xl sm:text-2xl font-bold text-white'>{gameState.players.length}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Người chơi</div>
            </div>
            <div>
              <div className='text-xl sm:text-2xl font-bold text-white'>
                {formatMoney(gameState.buyinAmount * gameState.players.length)}
              </div>
              <div className='text-red-200 text-xs sm:text-sm'>Tổng tiền</div>
            </div>
            <div>
              <div className='text-xl sm:text-2xl font-bold text-white'>
                {Object.values(gameState.chipCounts).reduce((sum, count) => sum + count, 0) * gameState.players.length}
              </div>
              <div className='text-red-200 text-xs sm:text-sm'>Tổng chip</div>
            </div>
            <div>
              <div className='text-xl sm:text-2xl font-bold text-white'>
                {formatMoney(
                  Object.keys(gameState.chipValues).reduce((total, color) => {
                    const chipColor = color as keyof ChipValues
                    return total + gameState.chipValues[chipColor] * gameState.chipCounts[chipColor]
                  }, 0) * gameState.players.length
                )}
              </div>
              <div className='text-red-200 text-xs sm:text-sm'>Giá trị chip</div>
            </div>
          </div>
        </div>
      ),
    [gameState.players.length, gameState.buyinAmount, gameState.chipCounts, gameState.chipValues]
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 p-3 sm:p-4'>
      <div className='max-w-sm sm:max-w-4xl mx-auto'>
        <div className='text-center mb-6 sm:mb-8'>
          <div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full mb-3 sm:mb-4'>
            <Users className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>Thiết lập người chơi</h1>
          <p className='text-sm sm:text-base text-red-100 px-2'>Thêm người chơi vào game (tối thiểu 2 người)</p>
        </div>

        {/* Add Player Section */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <h2 className='text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4'>Thêm người chơi mới</h2>
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
            <div className='flex-1'>
              <input
                type='text'
                value={newPlayerName}
                onChange={(e) => handleNewPlayerNameChange(e.target.value)}
                placeholder='Nhập tên người chơi...'
                className={`w-full px-3 sm:px-4 py-3 bg-white/20 border rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm sm:text-base ${
                  nameError ? 'border-red-400' : 'border-white/30'
                }`}
                onKeyDown={(e) => e.key === 'Enter' && canAddPlayer && handleAddPlayer()}
              />
              {nameError && (
                <div className='flex items-center gap-1 mt-2'>
                  <AlertCircle className='w-4 h-4 text-red-400' />
                  <span className='text-red-400 text-xs sm:text-sm'>{nameError}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleAddPlayer}
              disabled={!canAddPlayer}
              className='px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap'
            >
              <Plus className='w-4 h-4 sm:w-5 sm:h-5' />
              Thêm
            </button>
          </div>
        </div>

        {/* Players List */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2'>
            <h2 className='text-lg sm:text-xl font-semibold text-white'>
              Danh sách người chơi ({gameState.players.length})
            </h2>
            <div className='text-red-200 text-xs sm:text-sm'>
              Buy-in: {formatMoney(gameState.buyinAmount)} mỗi người
            </div>
          </div>
          {playersList}
        </div>

        {/* Summary */}
        {summary}

        {/* Navigation */}
        <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
          <button
            onClick={handleBack}
            className='order-2 sm:order-1 px-4 sm:px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
          >
            Quay lại
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className='order-1 sm:order-2 px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
          >
            {canProceed ? 'Bắt đầu Game' : `Cần thêm ${2 - gameState.players.length} người`}
          </button>
        </div>
      </div>
    </div>
  )
}
