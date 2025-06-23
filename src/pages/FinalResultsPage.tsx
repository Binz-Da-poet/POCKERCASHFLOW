/**
 * Bước 6: Màn hình tổng kết kết quả
 * Hiển thị thông tin từng người chơi và số tiền phải trả/nhận
 */

import React, { useMemo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStateContext } from '../hooks/useGameState'

import { formatMoney } from '../utils/formatters'
import { Trophy, Medal, Award, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react'

export const FinalResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const { gameState, getSettlementResults, resetGame } = useGameStateContext()
  const [showDetails, setShowDetails] = useState(false)

  const results = useMemo(() => getSettlementResults(), [getSettlementResults])
  const sortedResults = useMemo(() => [...results].sort((a, b) => b.profit - a.profit), [results])

  const handleNewGame = useCallback(() => {
    resetGame()
    navigate('/buyin-setup')
  }, [resetGame, navigate])

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
    <div className='min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 p-3 sm:p-4'>
      <div className='max-w-sm sm:max-w-4xl mx-auto'>
        <div className='text-center mb-6 sm:mb-8'>
          <div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full mb-3 sm:mb-4'>
            <Trophy className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>Kết quả cuối cùng</h1>
          <p className='text-sm sm:text-base text-red-100 px-2'>Bảng xếp hạng và thống kê game</p>
        </div>

        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6'>
          <h2 className='text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4'>Tổng quan</h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center'>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{gameState.players.length}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Người chơi</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>
                {formatMoney(gameState.buyinAmount * gameState.players.length)}
              </div>
              <div className='text-red-200 text-xs sm:text-sm'>Tổng buy-in</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>{gameState.transactions.length}</div>
              <div className='text-red-200 text-xs sm:text-sm'>Giao dịch</div>
            </div>
            <div>
              <div className='text-lg sm:text-2xl font-bold text-white'>
                {formatMoney(
                  useMemo(() => {
                    const advances = gameState.transactions
                      .filter((t) => t.type === 'advance')
                      .reduce((sum, t) => sum + t.amount, 0)
                    const repays = gameState.transactions
                      .filter((t) => t.type === 'repay')
                      .reduce((sum, t) => sum + t.amount, 0)
                    return advances - repays
                  }, [gameState.transactions])
                )}
              </div>
              <div className='text-red-200 text-xs sm:text-sm'>Tổng mua từ bank (net)</div>
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

              <div className='grid grid-cols-2 gap-3 sm:gap-4 text-center bg-white/10 rounded-xl p-3 sm:p-4'>
                <div>
                  <div className='text-sm sm:text-base font-semibold text-white'>{formatMoney(result.finalValue)}</div>
                  <div className='text-white/70 text-xs sm:text-sm'>Chip còn lại cuối game</div>
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
                  <div className='text-white/70 text-xs sm:text-sm'>(số tiền được nhận OR phải trả)</div>
                </div>
              </div>

              {showDetails && (
                <div className='mt-3 sm:mt-4 bg-white/5 rounded-xl p-3 sm:p-4'>
                  <div className='space-y-2 text-sm sm:text-base font-mono'>
                    {/* Buy-in */}
                    <div className='flex justify-between items-center'>
                      <span className='text-white'>Buy-in</span>
                      <span className='text-red-300 font-medium'>-{formatMoney(result.buyinAmount)}</span>
                    </div>

                    {/* Mua thêm từ bank */}
                    {result.totalAdvances > 0 && (
                      <div className='flex justify-between items-center'>
                        <span className='text-white'>Mua thêm từ bank</span>
                        <span className='text-red-300 font-medium'>-{formatMoney(result.totalAdvances)}</span>
                      </div>
                    )}

                    {/* Trả bank */}
                    {result.totalRepays > 0 && (
                      <div className='flex justify-between items-center'>
                        <span className='text-white'>Trả bank</span>
                        <span className='text-green-300 font-medium'>+{formatMoney(result.totalRepays)}</span>
                      </div>
                    )}

                    {/* Mua chip từ */}
                    {result.transfersIn.map((transfer, index) => (
                      <div key={`in-${index}`} className='flex justify-between items-center'>
                        <span className='text-white'>Mua chip từ {transfer.fromPlayer}</span>
                        <span className='text-red-300 font-medium'>-{formatMoney(transfer.amount)}</span>
                      </div>
                    ))}

                    {/* Bán chip cho */}
                    {result.transfersOut.map((transfer, index) => (
                      <div key={`out-${index}`} className='flex justify-between items-center'>
                        <span className='text-white'>Bán chip cho {transfer.toPlayer}</span>
                        <span className='text-green-300 font-medium'>+{formatMoney(transfer.amount)}</span>
                      </div>
                    ))}

                    {/* Chip còn lại cuối game */}
                    <div className='flex justify-between items-center'>
                      <span className='text-white'>Chip còn lại cuối game</span>
                      <span className='text-green-300 font-medium'>+{formatMoney(result.finalValue)}</span>
                    </div>

                    {/* Đường phân cách */}
                    <div className='border-t border-white/30 my-3'></div>

                    {/* Tổng kết */}
                    <div className='flex justify-between items-center pt-1'>
                      <span className='text-yellow-200 font-bold'>Tổng kết</span>
                      <span className={`font-bold text-lg ${result.profit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        {result.profit >= 0 ? '+' : ''}
                        {formatMoney(result.profit)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='flex flex-col gap-3 sm:gap-4'>
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className='w-full px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-sm sm:text-base'
          >
            {showDetails ? 'Ẩn chi tiết giao dịch' : 'Hiện chi tiết giao dịch'}
          </button>

          <button
            onClick={handleNewGame}
            className='w-full px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
          >
            <RotateCcw className='w-4 h-4 sm:w-5 sm:h-5' />
            Game mới
          </button>
        </div>
      </div>
    </div>
  )
}
