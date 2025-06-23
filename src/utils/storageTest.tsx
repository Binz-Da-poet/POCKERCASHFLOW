/**
 * Utility functions để test localStorage functionality
 * Dùng để debug và kiểm tra data persistence
 */

import { isStorageAvailable } from '../hooks/useLocalStorage'

/**
 * Test localStorage availability và functionality
 */
export const testLocalStorage = () => {
  console.group('🔍 LocalStorage Test')

  // Test 1: Availability
  const isAvailable = isStorageAvailable('localStorage')
  console.log('✅ localStorage available:', isAvailable)

  if (!isAvailable) {
    console.error('❌ localStorage not available!')
    console.groupEnd()
    return false
  }

  // Test 2: Write/Read test
  try {
    const testKey = 'poker_test_key'
    const testData = {
      timestamp: Date.now(),
      message: 'Test data for poker app',
      nested: { value: 123 }
    }

    localStorage.setItem(testKey, JSON.stringify(testData))
    const retrieved = JSON.parse(localStorage.getItem(testKey) || '{}')

    const isDataMatch = JSON.stringify(testData) === JSON.stringify(retrieved)
    console.log('✅ Write/Read test:', isDataMatch ? 'PASSED' : 'FAILED')

    // Cleanup
    localStorage.removeItem(testKey)

    if (!isDataMatch) {
      console.error('❌ Data mismatch:', { sent: testData, received: retrieved })
      console.groupEnd()
      return false
    }
  } catch (error) {
    console.error('❌ Write/Read test failed:', error)
    console.groupEnd()
    return false
  }

  // Test 3: Check current poker data
  const pokerData = localStorage.getItem('pokerGameState')
  if (pokerData) {
    try {
      const parsed = JSON.parse(pokerData)
      console.log('📊 Current poker data:', {
        gamePhase: parsed.gamePhase,
        buyinAmount: parsed.buyinAmount,
        playersCount: parsed.players?.length || 0,
        transactionsCount: parsed.transactions?.length || 0
      })
    } catch (error) {
      console.error('❌ Invalid poker data in localStorage:', error)
    }
  } else {
    console.log('📊 No poker data found in localStorage')
  }

  console.groupEnd()
  return true
}

/**
 * Debug function để xem tất cả localStorage keys
 */
export const debugLocalStorage = () => {
  console.group('🔍 LocalStorage Debug')

  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) keys.push(key)
  }

  console.log('📋 All localStorage keys:', keys)

  // Show poker-related keys
  const pokerKeys = keys.filter((key) => key.includes('poker') || key.includes('game'))
  if (pokerKeys.length > 0) {
    console.log('🎮 Poker-related keys:')
    pokerKeys.forEach((key) => {
      const value = localStorage.getItem(key)
      const size = new Blob([value || '']).size
      console.log(`  - ${key}: ${size} bytes`)
    })
  }

  console.groupEnd()
}

/**
 * Utility để export/import game data
 */
export const exportGameData = () => {
  const data = localStorage.getItem('pokerGameState')
  if (!data) {
    console.warn('⚠️ No game data to export')
    return null
  }

  try {
    const parsed = JSON.parse(data)
    const exportData = {
      version: '1.1.0',
      timestamp: Date.now(),
      data: parsed
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `poker-game-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log('📁 Game data exported successfully')
    return exportData
  } catch (error) {
    console.error('❌ Export failed:', error)
    return null
  }
}

/**
 * Utility để import game data
 */
export const importGameData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importData = JSON.parse(content)

        if (!importData.data || !importData.version) {
          throw new Error('Invalid file format')
        }

        localStorage.setItem('pokerGameState', JSON.stringify(importData.data))
        console.log('📁 Game data imported successfully')
        resolve(true)
      } catch (error) {
        console.error('❌ Import failed:', error)
        resolve(false)
      }
    }

    reader.onerror = () => {
      console.error('❌ File read failed')
      resolve(false)
    }

    reader.readAsText(file)
  })
}

// Auto-run test in development
if (process.env.NODE_ENV === 'development') {
  // Delay để đảm bảo DOM loaded
  setTimeout(() => {
    console.log('🚀 Running localStorage tests...')
    testLocalStorage()
  }, 1000)
}
