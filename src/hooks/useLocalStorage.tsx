/**
 * Custom hook để quản lý localStorage an toàn
 */

import { useState, useCallback } from 'react'

/**
 * Hook useLocalStorage - Tự động sync với localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State để lưu giá trị hiện tại
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Lấy giá trị từ localStorage
      const item = window.localStorage.getItem(key)
      // Parse stored json hoặc trả về initialValue nếu không có
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Nếu có lỗi, trả về initialValue
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Hàm để set giá trị mới
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Sử dụng functional update để tránh stale closure
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value

          // Lưu vào localStorage
          window.localStorage.setItem(key, JSON.stringify(valueToStore))

          return valueToStore
        })
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  // Hàm để xóa giá trị
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}

/**
 * Utility function để clear tất cả localStorage của app
 */
export const clearAppStorage = () => {
  try {
    // Clear các keys của app (có thể mở rộng thêm)
    const appKeys = ['pokerGameState', 'pokerSettings', 'pokerHistory']
    appKeys.forEach((key) => {
      window.localStorage.removeItem(key)
      window.sessionStorage.removeItem(key)
    })
  } catch (error) {
    console.error('Error clearing app storage:', error)
  }
}

/**
 * Utility function để check localStorage availability
 */
export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage' = 'localStorage') => {
  try {
    const storage = window[type]
    const testKey = '__storage_test__'
    storage.setItem(testKey, 'test')
    storage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
