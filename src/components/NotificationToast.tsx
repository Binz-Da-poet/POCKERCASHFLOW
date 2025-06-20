/**
 * Component NotificationToast để hiển thị thông báo
 */

import React, { useEffect } from 'react'

/**
 * Props cho NotificationToast
 */
interface NotificationToastProps {
  isVisible: boolean
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  onClose: () => void
  duration?: number
}

/**
 * Component NotificationToast
 */
export const NotificationToast: React.FC<NotificationToastProps> = ({
  isVisible,
  message,
  type,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'info':
      default:
        return 'bg-blue-500 text-white'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className='fixed top-4 right-4 z-50 animate-fade-in'>
      <div
        className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm
        ${getTypeStyles()}
      `}
      >
        <span className='text-lg'>{getIcon()}</span>
        <span className='flex-1 text-sm font-medium'>{message}</span>
        <button onClick={onClose} className='text-white hover:text-gray-200 transition-colors'>
          ✕
        </button>
      </div>
    </div>
  )
}
