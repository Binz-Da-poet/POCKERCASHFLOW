/**
 * Hook quản lý state chính của game Poker Money Calculator
 */

import React, { createContext, useContext, useCallback } from 'react'
import { DEFAULT_CHIP_VALUES, GAME_PHASES } from '../types'
import type { GameState, GamePhase, ChipValues, ChipCounts, Player, Transaction } from '../types'
import { useLocalStorage } from './useLocalStorage'

/**
 * Interface cho bank operation
 */
interface BankOperation {
  type: 'advance' | 'repay'
  amount: number
}

/**
 * Interface cho chip transfer
 */
interface ChipTransfer {
  fromPlayerId: number
  toPlayerId: number
  chips: ChipCounts
  amount?: number // Số tiền chuyển trực tiếp (tùy chọn)
}

/**
 * Initial state của game
 */
const initialGameState: GameState = {
  gamePhase: GAME_PHASES.BUYIN_SETUP,
  buyinAmount: 500,
  chipValues: DEFAULT_CHIP_VALUES,
  chipCounts: {
    white: 5,
    red: 5,
    green: 5,
    blue: 2,
    black: 1
  },
  players: [],
  transactions: []
}

/**
 * Context type
 */
interface GameStateContextType {
  gameState: GameState
  setGamePhase: (phase: GamePhase) => void
  setBuyinAmount: (amount: number) => void
  setChipValues: (values: ChipValues) => void
  setChipCounts: (counts: ChipCounts) => void
  addPlayer: (name: string) => void
  removePlayer: (playerId: number) => void
  updatePlayerName: (playerId: number, name: string) => void
  handleBankOperation: (playerId: number, operation: BankOperation, amount: number) => void
  transferChips: (transfer: ChipTransfer) => void
  updatePlayerFinalChips: (playerId: number, finalChips: ChipCounts) => void
  resetGame: () => void
  getSettlementResults: () => Array<{
    player: Player
    buyinAmount: number
    additionalBuyin: number
    totalAdvances: number
    totalRepays: number
    transfersOut: Array<{ toPlayer: string; amount: number }>
    totalTransferred: number
    transfersIn: Array<{ fromPlayer: string; amount: number }>
    totalReceived: number
    totalInvested: number
    finalValue: number
    profit: number
  }>
}

/**
 * Game State Context
 */
const GameStateContext = createContext<GameStateContextType | undefined>(undefined)

/**
 * Game State Provider
 */
export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gameStateHook = useGameState()

  return React.createElement(GameStateContext.Provider, { value: gameStateHook }, children)
}

/**
 * Hook để sử dụng Game State Context
 */
export const useGameStateContext = () => {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error('useGameStateContext must be used within a GameStateProvider')
  }
  return context
}

/**
 * Hook useGameState với localStorage persistence
 */
export const useGameState = () => {
  // Sử dụng localStorage để persist game state
  const [gameState, setGameState, clearGameState] = useLocalStorage<GameState>('pokerGameState', initialGameState)

  /**
   * Set game phase
   */
  const setGamePhase = useCallback((phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, gamePhase: phase }))
  }, [])

  /**
   * Set buyin amount
   */
  const setBuyinAmount = useCallback((amount: number) => {
    setGameState((prev) => ({ ...prev, buyinAmount: amount }))
  }, [])

  /**
   * Set chip values
   */
  const setChipValues = useCallback((values: ChipValues) => {
    setGameState((prev) => ({ ...prev, chipValues: values }))
  }, [])

  /**
   * Set chip counts
   */
  const setChipCounts = useCallback((counts: ChipCounts) => {
    setGameState((prev) => ({ ...prev, chipCounts: counts }))
  }, [])

  /**
   * Add player
   */
  const addPlayer = useCallback(
    (name: string) => {
      const newPlayer: Player = {
        id: Date.now(),
        name,
        buyinAmount: gameState.buyinAmount,
        additionalBuyin: 0,
        currentChips: { ...gameState.chipCounts }
      }

      const transaction: Transaction = {
        id: Date.now() + 1,
        timestamp: Date.now(),
        type: 'buyin',
        toPlayerId: newPlayer.id,
        amount: gameState.buyinAmount,
        chips: { ...gameState.chipCounts },
        description: `${name} BUY-IN ban đầu`
      }

      setGameState((prev) => ({
        ...prev,
        players: [...prev.players, newPlayer],
        transactions: [...prev.transactions, transaction]
      }))
    },
    [gameState.buyinAmount, gameState.chipCounts]
  )

  /**
   * Remove player
   */
  const removePlayer = useCallback((playerId: number) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
      transactions: prev.transactions.filter((t) => t.fromPlayerId !== playerId && t.toPlayerId !== playerId)
    }))
  }, [])

  /**
   * Update player name
   */
  const updatePlayerName = useCallback((playerId: number, name: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === playerId ? { ...p, name } : p))
    }))
  }, [])

  /**
   * Handle bank operation (advance/repay)
   */
  const handleBankOperation = useCallback((playerId: number, operation: BankOperation, amount: number) => {
    setGameState((prev) => {
      // Tìm tên người chơi
      const player = prev.players.find((p) => p.id === playerId)
      const playerName = player?.name || 'Unknown'

      if (operation.type === 'repay') {
        // Validation: không thể trả nhiều hơn số đã mua
        if (!player || amount > player.additionalBuyin) {
          console.error('Không thể trả BANK nhiều hơn số đã mua')
          return prev
        }

        const transaction: Transaction = {
          id: Date.now(),
          timestamp: Date.now(),
          type: 'repay',
          fromPlayerId: playerId,
          amount,
          description: `${playerName} trả BANK ${amount.toLocaleString()}円`
        }

        return {
          ...prev,
          players: prev.players.map((p) =>
            p.id === playerId
              ? {
                  ...p,
                  additionalBuyin: p.additionalBuyin - amount,
                  // Trừ chip tương ứng khi trả BANK
                  currentChips: {
                    white: Math.max(0, p.currentChips.white - prev.chipCounts.white),
                    red: Math.max(0, p.currentChips.red - prev.chipCounts.red),
                    green: Math.max(0, p.currentChips.green - prev.chipCounts.green),
                    blue: Math.max(0, p.currentChips.blue - prev.chipCounts.blue),
                    black: Math.max(0, p.currentChips.black - prev.chipCounts.black)
                  }
                }
              : p
          ),
          transactions: [...prev.transactions, transaction]
        }
      } else {
        // Advance operation (existing logic)
        const transaction: Transaction = {
          id: Date.now(),
          timestamp: Date.now(),
          type: 'advance',
          toPlayerId: playerId,
          amount,
          description: `${playerName} mua BANK thêm ${amount.toLocaleString()}円`
        }

        return {
          ...prev,
          players: prev.players.map((p) =>
            p.id === playerId
              ? {
                  ...p,
                  additionalBuyin: p.additionalBuyin + amount,
                  // Chỉ cộng thêm chip tương ứng với buy-in amount, không cộng tất cả chipCounts
                  currentChips: {
                    white: p.currentChips.white + prev.chipCounts.white,
                    red: p.currentChips.red + prev.chipCounts.red,
                    green: p.currentChips.green + prev.chipCounts.green,
                    blue: p.currentChips.blue + prev.chipCounts.blue,
                    black: p.currentChips.black + prev.chipCounts.black
                  }
                }
              : p
          ),
          transactions: [...prev.transactions, transaction]
        }
      }
    })
  }, [])

  /**
   * Transfer chips between players
   */
  const transferChips = useCallback((transfer: ChipTransfer) => {
    const { fromPlayerId, toPlayerId, chips, amount } = transfer

    setGameState((prev) => {
      // Validate: Kiểm tra người gửi tồn tại
      const fromPlayer = prev.players.find((p) => p.id === fromPlayerId)
      if (!fromPlayer) {
        console.error('Player không tồn tại:', fromPlayerId)
        return prev
      }

      // Sử dụng amount trực tiếp nếu có, nếu không thì tính từ chips
      const transferValue =
        amount ||
        Object.keys(chips).reduce((total, color) => {
          const chipColor = color as keyof ChipCounts
          return total + chips[chipColor] * prev.chipValues[chipColor]
        }, 0)

      // Tính tổng đầu tư của TẤT CẢ người chơi
      const totalAllInvestment = prev.players.reduce((sum, player) => {
        return sum + player.buyinAmount + player.additionalBuyin
      }, 0)

      // Kiểm tra giới hạn: mỗi giao dịch không vượt quá tổng đầu tư
      if (transferValue > totalAllInvestment) {
        console.error('Vượt quá giới hạn bán chip. Giới hạn:', totalAllInvestment, 'Muốn bán:', transferValue)
        return prev
      }

      const fromPlayerName = fromPlayer.name
      const toPlayerName = prev.players.find((p) => p.id === toPlayerId)?.name || 'Unknown'

      const transaction: Transaction = {
        id: Date.now(),
        timestamp: Date.now(),
        type: 'transfer',
        fromPlayerId,
        toPlayerId,
        amount: transferValue,
        chips,
        description: `${fromPlayerName} bán cho ${toPlayerName}: ${transferValue.toLocaleString()}円`
      }

      // Chỉ ghi nhận giao dịch, không thay đổi chip hiện tại
      // Chip sẽ được cập nhật ở màn hình cuối game
      return {
        ...prev,
        transactions: [...prev.transactions, transaction]
      }
    })
  }, [])

  /**
   * Update player final chips
   */
  const updatePlayerFinalChips = useCallback((playerId: number, finalChips: ChipCounts) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === playerId ? { ...p, finalChips } : p))
    }))
  }, [])

  /**
   * Reset game - clear localStorage và reset về initial state
   */
  const resetGame = useCallback(() => {
    clearGameState()
    setGameState(initialGameState)
  }, [clearGameState, setGameState])

  /**
   * Get settlement results
   */
  const getSettlementResults = useCallback(() => {
    return gameState.players.map((player) => {
      // Tính tổng tiền đã chuyển cho người khác
      const transfersOut = gameState.transactions
        .filter((t) => t.type === 'transfer' && t.fromPlayerId === player.id)
        .map((t) => ({
          toPlayer: gameState.players.find((p) => p.id === t.toPlayerId)?.name || 'Unknown',
          amount: t.amount
        }))

      const totalTransferred = transfersOut.reduce((sum, t) => sum + t.amount, 0)

      // Tính tổng tiền đã nhận từ người khác
      const transfersIn = gameState.transactions
        .filter((t) => t.type === 'transfer' && t.toPlayerId === player.id)
        .map((t) => ({
          fromPlayer: gameState.players.find((p) => p.id === t.fromPlayerId)?.name || 'Unknown',
          amount: t.amount
        }))

      const totalReceived = transfersIn.reduce((sum, t) => sum + t.amount, 0)

      // Tính tổng advance và repay của player này
      const totalAdvances = gameState.transactions
        .filter((t) => t.type === 'advance' && t.toPlayerId === player.id)
        .reduce((sum, t) => sum + t.amount, 0)

      const totalRepays = gameState.transactions
        .filter((t) => t.type === 'repay' && t.fromPlayerId === player.id)
        .reduce((sum, t) => sum + t.amount, 0)

      const netAdditionalBuyin = totalAdvances - totalRepays

      // Tổng đầu tư thực tế = buy-in + net additional buyin - tiền bán chip + tiền mua chip
      // totalTransferred = tiền thu được từ bán chip (giảm đầu tư)
      // totalReceived = tiền đã trả để mua chip (tăng đầu tư)
      const totalInvested = player.buyinAmount + netAdditionalBuyin - totalTransferred + totalReceived

      const finalValue = player.finalChips
        ? Object.keys(player.finalChips).reduce((total, color) => {
            const chipColor = color as keyof ChipCounts
            return total + player.finalChips![chipColor] * gameState.chipValues[chipColor]
          }, 0)
        : 0

      return {
        player,
        buyinAmount: player.buyinAmount,
        additionalBuyin: netAdditionalBuyin,
        totalAdvances,
        totalRepays,
        transfersOut,
        totalTransferred,
        transfersIn,
        totalReceived,
        totalInvested,
        finalValue,
        profit: finalValue - totalInvested
      }
    })
  }, [gameState.players, gameState.chipValues, gameState.transactions])

  return {
    gameState,
    setGamePhase,
    setBuyinAmount,
    setChipValues,
    setChipCounts,
    addPlayer,
    removePlayer,
    updatePlayerName,
    handleBankOperation,
    transferChips,
    updatePlayerFinalChips,
    resetGame,
    getSettlementResults
  }
}
