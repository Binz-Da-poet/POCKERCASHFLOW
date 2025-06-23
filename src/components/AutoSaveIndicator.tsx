/**
 * Component hiển thị trạng thái auto-save
 */

import React, { useState, useEffect } from 'react'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'

interface AutoSaveIndicatorProps {
  isVisible?: boolean
  status?: 'saving' | 'saved' | 'error'
  message?: string
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  isVisible = true,
  status = 'saved',
  message
}) => {
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    if (status === 'saving') {
      setShowIndicator(true)
    } else if (status === 'saved') {
      setShowIndicator(true)
      // Ẩn indicator sau 2 giây
      const timer = setTimeout(() => setShowIndicator(false), 2000)
      return () => clearTimeout(timer)
    } else if (status === 'error') {
      setShowIndicator(true)
      // Ẩn indicator sau 5 giây cho error
      const timer = setTimeout(() => setShowIndicator(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

  if (!isVisible || !showIndicator) return null

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Save,
          color: 'bg-blue-500',
          text: message || 'Đang lưu...',
          animate: 'animate-pulse'
        }
      case 'saved':
        return {
          icon: CheckCircle,
          color: 'bg-green-500',
          text: message || 'Đã lưu tự động',
          animate: 'animate-fade-in'
        }
      case 'error':
        return {
          icon: AlertCircle,
          color: 'bg-red-500',
          text: message || 'Lỗi khi lưu',
          animate: 'animate-shake'
        }
      default:
        return {
          icon: Save,
          color: 'bg-gray-500',
          text: message || 'Trạng thái không xác định',
          animate: ''
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${config.animate}`}>
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-white text-sm
          ${config.color} backdrop-blur-sm border border-white/20
          transition-all duration-300 ease-in-out
        `}
      >
        <Icon className='w-4 h-4' />
        <span className='font-medium'>{config.text}</span>
      </div>
    </div>
  )
}

/**
 * Hook để quản lý auto-save indicator
 */
export const useAutoSaveIndicator = () => {
  const [status, setStatus] = useState<'saving' | 'saved' | 'error'>('saved')
  const [message, setMessage] = useState<string>('')

  const showSaving = (msg?: string) => {
    setStatus('saving')
    setMessage(msg || 'Đang lưu...')
  }

  const showSaved = (msg?: string) => {
    setStatus('saved')
    setMessage(msg || 'Đã lưu tự động')
  }

  const showError = (msg?: string) => {
    setStatus('error')
    setMessage(msg || 'Lỗi khi lưu')
  }

  return {
    status,
    message,
    showSaving,
    showSaved,
    showError
  }
}
