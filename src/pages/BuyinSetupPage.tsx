/**
 * Bước 1: Màn hình thiết lập số tiền buy-in
 * Người dùng nhập số tiền buy-in cho mỗi người chơi
 */

import React, { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStateContext } from '../hooks/useGameState'
import { formatMoney, isValidPositiveNumber } from '../utils/formatters'
import { DollarSign, ArrowRight, Plus } from 'lucide-react'
import BuyInBg from '../assets/background/BuyIn.png'

export const BuyinSetupPage: React.FC = () => {
  const navigate = useNavigate()
  const { gameState, setBuyinAmount } = useGameStateContext()
  const [inputValue, setInputValue] = React.useState(() =>
    gameState.buyinAmount > 0 ? gameState.buyinAmount.toString() : '500'
  )

  const handleNext = useCallback(() => {
    const amount = parseInt(inputValue)
    if (isValidPositiveNumber(inputValue) && amount > 0) {
      setBuyinAmount(amount)
      navigate('/chip-values-setup')
    }
  }, [inputValue, setBuyinAmount, navigate])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ cho phép số nguyên dương, loại bỏ ký tự không hợp lệ
    const val = e.target.value.replace(/[^0-9]/g, '')
    setInputValue(val)
  }, [])

  const handleAdd500 = useCallback(() => {
    const currentAmount = parseInt(inputValue) || 0
    setInputValue((currentAmount + 100).toString())
  }, [inputValue])

  const isValid = useMemo(() => isValidPositiveNumber(inputValue) && parseInt(inputValue) > 0, [inputValue])

  return (
    <div
      className='min-h-screen relative overflow-hidden bg-no-repeat'
      style={{
        backgroundImage: `url(${BuyInBg})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        backgroundColor: '#8B4513' // Màu nâu casino để fill khoảng trống
      }}
    >
      {/* Overlay nhẹ để text dễ đọc nhưng vẫn thấy rõ background */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-40% to-black/30'></div>

      <div className='relative z-10 min-h-screen flex flex-col'>
        {/* Header - Responsive sizing */}
        <div className='text-center py-4 md:py-6 px-4'>
          {/* Main Title - Responsive sizing */}
          <h1
            className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase mb-2 md:mb-3 transform hover:scale-105 transition-transform duration-300'
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              color: '#FFD700',
              textShadow:
                '4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 6px 6px 20px rgba(0,0,0,0.9)',
              letterSpacing: '2px'
            }}
          >
            <span className='inline-block drop-shadow-2xl'>♠</span> HÔM NAY{' '}
            <span className='inline-block text-red-500 drop-shadow-2xl'>♥</span>
            <br />
            BUY-IN NHIÊU?
          </h1>

          {/* Subtitle - Responsive */}
          <div className='inline-block bg-black/80 backdrop-blur-sm rounded-xl md:rounded-2xl px-4 md:px-6 py-2 md:py-3 border border-yellow-500/30 mx-4'>
            <p className='text-sm md:text-base lg:text-lg text-yellow-200 font-bold'>
              hôm nay mình định chơi bao nhiêu thế bồ tèo nhập tiền đê :))
            </p>
          </div>
        </div>

        {/* Main Content Modal - Responsive positioning */}
        <div className='flex-1 flex items-center justify-center px-4 py-4'>
          <div className='w-full max-w-sm md:max-w-md'>
            <div className='bg-black/75 md:bg-black/65 backdrop-blur-sm border-3 md:border-4 border-yellow-500 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transform hover:scale-105 transition-all duration-300'>
              {/* Animated gold border glow */}
              <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/25 via-transparent to-yellow-400/25 rounded-2xl md:rounded-3xl animate-pulse'></div>

              <div className='relative z-10'>
                {/* Gold Coin Icon - Responsive size */}
                <div className='text-center mb-4 md:mb-6'>
                  <div className='inline-flex items-center justify-center w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-2xl border-3 md:border-4 border-yellow-300 animate-bounce'>
                    <DollarSign className='w-8 md:w-10 h-8 md:h-10 text-gray-900 font-black' />
                  </div>
                </div>

                {/* Label - Responsive */}
                <div className='text-center mb-4 md:mb-6'>
                  <label className='text-yellow-400 text-lg md:text-xl font-bold uppercase tracking-widest drop-shadow-lg'>
                    💰 SỐ TIỀN BUY-IN
                  </label>
                </div>

                {/* Input Container - Responsive */}
                <div className='mb-4 md:mb-6'>
                  <div className='relative'>
                    <input
                      type='number'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      value={inputValue}
                      onChange={handleInputChange}
                      className='w-full bg-gray-900/85 border-2 md:border-3 border-yellow-500 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-2xl md:text-3xl font-black text-yellow-400 text-center focus:outline-none focus:border-yellow-300 focus:ring-4 focus:ring-yellow-500/70 transition-all duration-300 hover:shadow-yellow-500/50 hover:shadow-xl backdrop-blur-sm'
                      placeholder='500'
                      min='1'
                      autoFocus
                    />
                  </div>
                </div>

                {/* +100円 Button - Responsive */}
                <div className='text-center mb-4 md:mb-6'>
                  <button
                    onClick={handleAdd500}
                    className='bg-gradient-to-r from-red-600/95 to-red-700/95 hover:from-red-500 hover:to-red-600 text-yellow-300 font-bold py-2 md:py-3 px-6 md:px-8 rounded-full border-2 border-red-400 shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 hover:shadow-red-500/50 backdrop-blur-sm'
                  >
                    <Plus className='w-4 md:w-5 h-4 md:h-5 inline mr-2' />
                    100円
                  </button>
                </div>

                {/* Next Button - Responsive */}
                <button
                  type='button'
                  onClick={handleNext}
                  disabled={!isValid}
                  className={`w-full py-3 md:py-4 text-lg md:text-2xl font-black uppercase rounded-xl md:rounded-2xl border-3 md:border-4 shadow-2xl transform transition-all duration-300 backdrop-blur-sm ${
                    isValid
                      ? 'bg-gradient-to-r from-red-600/95 to-red-700/95 hover:from-red-500 hover:to-red-600 border-red-400 text-yellow-300 hover:scale-105 active:scale-95 cursor-pointer shadow-red-500/60 hover:shadow-red-500/80'
                      : 'bg-gray-700/85 border-gray-500 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{
                    textShadow: isValid ? '2px 2px 0px #000' : 'none',
                    letterSpacing: '1px'
                  }}
                >
                  <span className='inline-flex items-center justify-center gap-2 md:gap-3'>
                    🎯 TIẾP THEO
                    <ArrowRight className='w-5 md:w-6 h-5 md:h-6' />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating poker symbols - Hide on mobile for cleaner look */}
        <div className='hidden md:block absolute top-1/4 left-8 animate-pulse'>
          <span className='text-6xl text-yellow-400/40 drop-shadow-2xl'>♠</span>
        </div>
        <div className='hidden md:block absolute top-1/3 right-8 animate-bounce'>
          <span className='text-5xl text-red-500/40 drop-shadow-2xl'>♥</span>
        </div>
        <div className='hidden md:block absolute bottom-1/4 left-12 animate-pulse'>
          <span className='text-5xl text-yellow-400/40 drop-shadow-2xl'>♣</span>
        </div>
        <div className='hidden md:block absolute bottom-1/3 right-12 animate-bounce'>
          <span className='text-4xl text-red-500/40 drop-shadow-2xl'>♦</span>
        </div>
      </div>
    </div>
  )
}
