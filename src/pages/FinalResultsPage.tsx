/**
 * Bước 6: Màn hình tổng kết kết quả
 * Hiển thị thông tin từng người chơi và số tiền phải trả/nhận
 */

import React, { useMemo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStateContext } from '../hooks/useGameState'
import { ChipDisplayList } from '../components/ChipDisplay'
import { formatMoney } from '../utils/formatters'
import { Trophy, Medal, Award, Download, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react'

export const FinalResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const { gameState, getSettlementResults, resetGame } = useGameStateContext()
  const [showDetails, setShowDetails] = useState(false)

  const results = useMemo(() => getSettlementResults(), [getSettlementResults])
  const sortedResults = useMemo(
    () => [...results].sort((a, b) => b.profit - a.profit),
    [results]
  )

  const handleNewGame = useCallback(() => {
    resetGame()
    navigate('/buyin-setup')
  }, [resetGame, navigate])

  const handleExport = useCallback(() => {
    const gameData = {
      timestamp: new Date().toISOString(),
      buyinAmount: gameState.buyinAmount,
      chipValues: gameState.chipValues,
      results: sortedResults.map((result, index) => ({
        rank: index + 1,
        playerName: result.player.name,
        totalInvested: result.totalInvested,
        finalValue: result.finalValue,
        profit: result.profit,
        finalChips: result.player.finalChips
      })),
      transactions: gameState.transactions
    }

    const dataStr = JSON.stringify(gameData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `poker-game-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [gameState.buyinAmount, gameState.chipValues, gameState.transactions, sortedResults])

  const getRankIcon = useCallback((index: number) => {
    switch (index) {
      case 0:
        return <Trophy className='w-5 h-5 sm:w-6 sm:h-6 text-yellow-500' />
      case 1:
        return <Medal className='w-5 h-5 sm:w-6 sm:h-6 text-gray-400' />
      case 2:
        return <Award className='w-5 h-5 sm:w-6 sm:h-6 text-orange-600' />
      default:
        return (
          <div className='w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
            {index + 1}
          </div>
        )
    }
  }, [])

  const getRankColor = useCallback((index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-600 to-yellow-700'
      case 1:
        return 'from-gray-500 to-gray-600'
      case 2:
        return 'from-orange-600 to-orange-700'
      default:
        return 'from-gray-600 to-gray-700'
    }
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-3 sm:p-4'>
      <div className='max-w-sm sm:max-w-4xl mx-auto'>
        <div className='text-center mb-6 sm:mb-8'>
          <div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 rounded-full mb-3 sm:mb-4'>
            <Trophy className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>Kết quả cuối cùng</h1>
          <p className='text-sm sm:text-base text-indigo-100 px-2'>Bảng xếp hạng và thống kê game</p>
        </div>

        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <h2 className='text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4'>Tổng quan</h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center'>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{gameState.players.length}</div>
              <div className='text-indigo-200 text-xs sm:text-sm'>Người chơi</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>
                {formatMoney(gameState.buyinAmount * gameState.players.length)}
              </div>
              <div className='text-indigo-200 text-xs sm:text-sm'>Tổng buy-in</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{gameState.transactions.length}</div>
              <div className='text-indigo-200 text-xs sm:text-sm'>Giao dịch</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>
                {formatMoney(
                  useMemo(
                    () =>
                      gameState.transactions
                        .filter((t) => t.type === 'advance')
                        .reduce((sum, t) => sum + t.amount, 0),
                    [gameState.transactions]
                  )
                )}
              </div>
              <div className='text-indigo-200 text-xs sm:text-sm'>Tạm ứng</div>
            </div>
          </div>
        </div>

        <div className='space-y-3 sm:space-y-4 mb-4 sm:mb-6'>
          {sortedResults.map((result, index) => (
            <div key={result.player.id} className={`bg-gradient-to-r ${getRankColor(index)} rounded-2xl p-4 sm:p-6`}>
              <div className='flex items-center justify-between mb-3 sm:mb-4'>
                <div className='flex items-center gap-3 sm:gap-4 flex-1 min-w-0'>
                  {getRankIcon(index)}
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-lg sm:text-xl font-bold text-white truncate'>{result.player.name}</h3>
                    <div className='text-white/80 text-xs sm:text-sm'>
                      Hạng {index + 1} • {result.profit >= 0 ? 'Thắng' : 'Thua'}
                    </div>
                  </div>
                </div>
                <div className='text-right flex-shrink-0'>
                  <div
                    className={`text-lg sm:text-xl font-bold flex items-center gap-1 ${
                      result.profit >= 0 ? 'text-green-200' : 'text-red-200'
                    }`}
                  >
                    {result.profit >= 0 ? (
                      <TrendingUp className='w-4 h-4 sm:w-5 sm:h-5' />
                    ) : (
                      <TrendingDown className='w-4 h-4 sm:w-5 sm:h-5' />
                    )}
                    {formatMoney(Math.abs(result.profit))}
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-3 sm:gap-4 text-center bg-white/10 rounded-xl p-3 sm:p-4'>
                <div>
                  <div className='text-sm sm:text-base font-semibold text-white'>
                    {formatMoney(result.totalInvested)}
                  </div>
                  <div className='text-white/70 text-xs sm:text-sm'>Đầu tư</div>
                </div>
                <div>
                  <div className='text-sm sm:text-base font-semibold text-white'>{formatMoney(result.finalValue)}</div>
                  <div className='text-white/70 text-xs sm:text-sm'>Cuối game</div>
                </div>
                <div>
                  <div
                    className={`text-sm sm:text-base font-semibold ${
                      result.profit >= 0 ? 'text-green-300' : 'text-red-300'
                    }`}
                  >
                    {result.profit >= 0 ? '+' : ''}
                    {formatMoney(result.profit)}
                  </div>
                  <div className='text-white/70 text-xs sm:text-sm'>Lãi/Lỗ</div>
                </div>
              </div>

              {showDetails && result.player.finalChips && (
                <div className='mt-3 sm:mt-4 bg-white/5 rounded-xl p-3 sm:p-4'>
                  <div className='text-white/80 text-xs sm:text-sm mb-2'>Chip cuối:</div>
                  <ChipDisplayList
                    chips={result.player.finalChips}
                    chipValues={gameState.chipValues}
                    size='small'
                    showValues={true}
                    showCounts={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='flex flex-col gap-3 sm:gap-4'>
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className='w-full px-4 sm:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
          >
            {showDetails ? 'Ẩn chi tiết chip' : 'Hiện chi tiết chip'}
          </button>

          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
            <button
              onClick={handleExport}
              className='flex-1 px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
            >
              <Download className='w-4 h-4 sm:w-5 sm:h-5' />
              Xuất dữ liệu
            </button>

            <button
              onClick={handleNewGame}
              className='flex-1 px-4 sm:px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
            >
              <RotateCcw className='w-4 h-4 sm:w-5 sm:h-5' />
              Game mới
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
