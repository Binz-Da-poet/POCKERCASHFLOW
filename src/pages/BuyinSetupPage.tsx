/**
 * Bước 1: Màn hình thiết lập số tiền buy-in
 * Người dùng nhập số tiền buy-in cho mỗi người chơi
 */

import React, { useCallback, useMemo } from 'react'
import { useGameStateContext } from '../hooks/useGameState'
import { useGameStatusRedirect } from '../hooks/useGameStatusRedirect'
import { isValidPositiveNumber } from '../utils/formatters'
import { DollarSign, ArrowRight, Plus, Wallet, RotateCcw } from 'lucide-react'
import BuyInBg from '../assets/background/buyIn.png'
import { clearAppStorage } from '../hooks/useLocalStorage'
import { GAME_STATUS } from '../types'

export const BuyinSetupPage: React.FC = () => {
  const { gameState, setBuyinAmount } = useGameStateContext()
  const { updateStatusAndNavigate } = useGameStatusRedirect()
  const [inputValue, setInputValue] = React.useState(() =>
    gameState.buyinAmount > 0 ? gameState.buyinAmount.toString() : '500'
  )
  const [showModal, setShowModal] = React.useState(false)

  const handleNext = useCallback(() => {
    const amount = parseInt(inputValue)
    if (isValidPositiveNumber(inputValue) && amount > 0) {
      setBuyinAmount(amount)
      updateStatusAndNavigate(GAME_STATUS.CHIP_VALUES_SETUP)
    }
  }, [inputValue, setBuyinAmount, updateStatusAndNavigate])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ cho phép số nguyên dương, loại bỏ ký tự không hợp lệ
    const val = e.target.value.replace(/[^0-9]/g, '')
    setInputValue(val)
  }, [])

  const handleAdd500 = useCallback(() => {
    const currentAmount = parseInt(inputValue) || 0
    setInputValue((currentAmount + 100).toString())
  }, [inputValue])

  const handleShowModal = useCallback(() => {
    setShowModal(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const handleClearData = useCallback(() => {
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu đã lưu? Hành động này không thể hoàn tác.')) {
      clearAppStorage()
      window.location.reload()
    }
  }, [])

  const isValid = useMemo(() => isValidPositiveNumber(inputValue) && parseInt(inputValue) > 0, [inputValue])

  return (
    <div className='min-h-screen relative overflow-hidden bg-gray-900 md:bg-transparent'>
      {/* Background cho desktop - full màn hình */}
      <div
        className='hidden md:block absolute inset-0'
        style={{
          backgroundImage: `url(${BuyInBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Overlay nhẹ cho desktop */}
      <div className='hidden md:block absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-40% to-black/30'></div>

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
        </div>

        {/* Background cho mobile - nằm dưới title */}
        <div
          className='md:hidden h-64 relative'
          style={{
            backgroundImage: `url(${BuyInBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay nhẹ cho mobile */}
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-red-500/30'></div>
        </div>

        {/* Main Content cho mobile */}
        <div className='md:hidden flex items-center justify-center  py-8 bg-gray-900'>
          {!showModal ? (
            <div className='text-center'>
              <button
                onClick={handleShowModal}
                className='bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-black text-xl py-4 px-8 rounded-2xl border-4 border-yellow-300 shadow-2xl transform hover:scale-110 transition-all duration-300 active:scale-95 hover:shadow-yellow-500/80 uppercase tracking-wider'
                style={{
                  textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                  letterSpacing: '2px'
                }}
              >
                <span className='inline-flex items-center justify-center gap-3'>
                  <Wallet className='w-6 h-6' />
                  💰 NHẬP TIỀN BUY-IN
                  <Wallet className='w-6 h-6' />
                </span>
              </button>
              <div className='mt-4 animate-bounce'>
                <p className='text-yellow-300 text-sm font-bold opacity-80'>👆 Nhấn để bắt đầu nhập số tiền!</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Main Content cho desktop */}
        <div className='hidden md:flex flex-1 items-center justify-center px-0 py-0'>
          {!showModal ? (
            <div className='text-center'>
              <button
                onClick={handleShowModal}
                className='bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-black text-xl md:text-2xl py-4 md:py-6 px-8 md:px-12 rounded-2xl md:rounded-3xl border-4 border-yellow-300 shadow-2xl transform hover:scale-110 transition-all duration-300 active:scale-95 hover:shadow-yellow-500/80 uppercase tracking-wider'
                style={{
                  textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                  letterSpacing: '2px'
                }}
              >
                <span className='inline-flex items-center justify-center gap-3'>
                  <Wallet className='w-6 md:w-8 h-6 md:h-8' />
                  💰 NHẬP TIỀN BUY-IN
                  <Wallet className='w-6 md:w-8 h-6 md:h-8' />
                </span>
              </button>
              <div className='mt-4 animate-bounce'>
                <p className='text-yellow-300 text-sm md:text-base font-bold opacity-80'>
                  👆 Nhấn để bắt đầu nhập số tiền!
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal - hiển thị trên cả mobile và desktop */}
        {showModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={handleCloseModal}></div>
            <div className='relative w-full max-w-xs md:max-w-md'>
              <div className='bg-black/20 md:bg-black/30 backdrop-blur-sm border-2 md:border-4 border-yellow-500/70 md:border-yellow-500 rounded-xl md:rounded-3xl p-4 md:p-8 shadow-lg md:shadow-2xl relative overflow-hidden transform hover:scale-105 transition-all duration-300'>
                <button
                  onClick={handleCloseModal}
                  className='absolute top-2 md:top-4 right-2 md:right-4 text-yellow-400 hover:text-yellow-300 text-2xl md:text-3xl font-bold z-20 w-8 md:w-10 h-8 md:h-10 flex items-center justify-center rounded-full hover:bg-black/30 transition-all duration-200'
                >
                  ×
                </button>
                <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 rounded-2xl md:rounded-3xl animate-pulse'></div>
                <div className='relative z-10'>
                  <div className='text-center mb-4 md:mb-6'>
                    <div className='inline-flex items-center justify-center w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-2xl border-3 md:border-4 border-yellow-300 animate-bounce'>
                      <DollarSign className='w-8 md:w-10 h-8 md:h-10 text-gray-900 font-black' />
                    </div>
                  </div>
                  <div className='text-center mb-4 md:mb-6'>
                    <label className='text-yellow-400 text-lg md:text-xl font-bold uppercase tracking-widest drop-shadow-lg'>
                      💰 SỐ TIỀN BUY-IN
                    </label>
                  </div>
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
                  <div className='text-center mb-4 md:mb-6'>
                    <button
                      onClick={handleAdd500}
                      className='bg-gradient-to-r from-red-600/95 to-red-700/95 hover:from-red-500 hover:to-red-600 text-yellow-300 font-bold py-2 md:py-3 px-6 md:px-8 rounded-full border-2 border-red-400 shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 hover:shadow-red-500/50 backdrop-blur-sm'
                    >
                      <Plus className='w-4 md:w-5 h-4 md:h-5 inline mr-2' />
                      100円
                    </button>
                  </div>

                  <div className='text-center mb-4 md:mb-6'>
                    <button
                      onClick={handleClearData}
                      className='bg-gray-600/80 hover:bg-gray-500/80 text-gray-200 font-medium py-2 px-4 rounded-lg border border-gray-400 shadow-md transform hover:scale-105 transition-all duration-200 active:scale-95 backdrop-blur-sm text-sm'
                    >
                      <RotateCcw className='w-3 h-3 inline mr-1' />
                      Xóa dữ liệu đã lưu
                    </button>
                    <p className='text-yellow-200/60 text-xs mt-1'>Dùng khi muốn bắt đầu lại từ đầu</p>
                  </div>
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
        )}

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
