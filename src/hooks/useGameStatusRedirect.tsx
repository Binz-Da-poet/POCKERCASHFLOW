/**
 * Hook để điều hướng user dựa trên game status
 */

import { useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGameStateContext } from './useGameState'
import { GAME_STATUS } from '../types'

/**
 * Mapping từ game status sang route path
 */
const STATUS_TO_ROUTE: Record<string, string> = {
  [GAME_STATUS.BUYIN_SETUP]: '/buyin-setup',
  [GAME_STATUS.CHIP_VALUES_SETUP]: '/chip-values-setup',
  [GAME_STATUS.PLAYERS_SETUP]: '/players-setup',
  [GAME_STATUS.PLAYING]: '/game-playing',
  [GAME_STATUS.FINAL_CHIPS_INPUT]: '/final-chips-input',
  [GAME_STATUS.FINAL_RESULTS]: '/final-results'
}

/**
 * Mapping từ route path sang game status (có thể dùng sau này)
 */
// const ROUTE_TO_STATUS: Record<string, string> = {
//   '/buyin-setup': GAME_STATUS.BUYIN_SETUP,
//   '/chip-values-setup': GAME_STATUS.CHIP_VALUES_SETUP,
//   '/players-setup': GAME_STATUS.PLAYERS_SETUP,
//   '/game-playing': GAME_STATUS.PLAYING,
//   '/final-chips-input': GAME_STATUS.FINAL_CHIPS_INPUT,
//   '/final-results': GAME_STATUS.FINAL_RESULTS
// }

/**
 * Hook để điều hướng dựa trên game status
 */
export const useGameStatusRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { gameState, setGameStatus } = useGameStateContext()

  useEffect(() => {
    const currentPath = location.pathname
    const currentStatus = gameState.status
    const expectedRoute = STATUS_TO_ROUTE[currentStatus]

    // Nếu user đang ở route không đúng với status hiện tại, redirect
    if (expectedRoute && currentPath !== expectedRoute) {
      console.log(`Redirecting from ${currentPath} to ${expectedRoute} based on status: ${currentStatus}`)
      navigate(expectedRoute, { replace: true })
    }
  }, [gameState.status, location.pathname, navigate])

  /**
   * Function để update status khi user submit page
   */
  const updateStatusAndNavigate = useCallback(
    (newStatus: string, targetRoute?: string) => {
      // Update status
      setGameStatus(newStatus as any)

      // Navigate to target route hoặc route tương ứng với status
      const routeToNavigate = targetRoute || STATUS_TO_ROUTE[newStatus]
      if (routeToNavigate) {
        navigate(routeToNavigate)
      }
    },
    [setGameStatus, navigate]
  )

  return {
    updateStatusAndNavigate,
    currentStatus: gameState.status,
    currentRoute: location.pathname,
    expectedRoute: STATUS_TO_ROUTE[gameState.status]
  }
}

/**
 * Component wrapper để tự động redirect dựa trên status
 */
export const GameStatusRedirectWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useGameStatusRedirect()
  return <>{children}</>
}
