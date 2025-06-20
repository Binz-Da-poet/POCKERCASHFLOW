/**
 * Hook quản lý state chính của game Poker Money Calculator
 */

import React, { createContext, useContext, useState, useCallback } from 'react'
import { DEFAULT_CHIP_VALUES, GAME_PHASES } from '../types'
import type { GameState, GamePhase, ChipValues, ChipCounts, Player, Transaction } from '../types'

/**
 * Interface cho bank operation
 */
interface BankOperation {
  type: 'advance'
  amount: number
}

/**
 * Interface cho chip transfer
 */
interface ChipTransfer {
  fromPlayerId: number
  toPlayerId: number
  chips: ChipCounts
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
 * Hook useGameState
 */
export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState)

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
        description: `${name} mua chip ban đầu`
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
   * Handle bank operation (advance)
   */
  const handleBankOperation = useCallback((playerId: number, _operation: BankOperation, amount: number) => {
    const transaction: Transaction = {
      id: Date.now(),
      timestamp: Date.now(),
      type: 'advance',
      toPlayerId: playerId,
      amount,
      description: `Tạm ứng thêm ${amount.toLocaleString()}円`
    }

    setGameState((prev) => ({
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
    }))
  }, [])

  /**
   * Transfer chips between players
   */
  const transferChips = useCallback(
    (transfer: ChipTransfer) => {
      const { fromPlayerId, toPlayerId, chips } = transfer

      // Validate: Kiểm tra người gửi có đủ chip không
      const fromPlayer = gameState.players.find((p) => p.id === fromPlayerId)
      if (!fromPlayer) {
        console.error('Player không tồn tại:', fromPlayerId)
        return
      }

      // Kiểm tra đủ chip để chuyển
      const hasEnoughChips = Object.keys(chips).every((color) => {
        const chipColor = color as keyof ChipCounts
        return fromPlayer.currentChips[chipColor] >= chips[chipColor]
      })

      if (!hasEnoughChips) {
        console.error('Không đủ chip để chuyển')
        return
      }

      // Tính tổng giá trị transfer
      const transferValue = Object.keys(chips).reduce((total, color) => {
        const chipColor = color as keyof ChipCounts
        return total + chips[chipColor] * gameState.chipValues[chipColor]
      }, 0)

      const fromPlayerName = fromPlayer.name
      const toPlayerName = gameState.players.find((p) => p.id === toPlayerId)?.name || 'Unknown'

      const transaction: Transaction = {
        id: Date.now(),
        timestamp: Date.now(),
        type: 'transfer',
        fromPlayerId,
        toPlayerId,
        amount: transferValue,
        chips,
        description: `${fromPlayerName} → ${toPlayerName}: ${transferValue.toLocaleString()}円`
      }

      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((p) => {
          if (p.id === fromPlayerId) {
            return {
              ...p,
              currentChips: {
                white: Math.max(0, p.currentChips.white - chips.white),
                red: Math.max(0, p.currentChips.red - chips.red),
                green: Math.max(0, p.currentChips.green - chips.green),
                blue: Math.max(0, p.currentChips.blue - chips.blue),
                black: Math.max(0, p.currentChips.black - chips.black)
              }
            }
          }
          if (p.id === toPlayerId) {
            return {
              ...p,
              currentChips: {
                white: p.currentChips.white + chips.white,
                red: p.currentChips.red + chips.red,
                green: p.currentChips.green + chips.green,
                blue: p.currentChips.blue + chips.blue,
                black: p.currentChips.black + chips.black
              }
            }
          }
          return p
        }),
        transactions: [...prev.transactions, transaction]
      }))
    },
    [gameState.players, gameState.chipValues]
  )

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
   * Reset game
   */
  const resetGame = useCallback(() => {
    setGameState(initialGameState)
  }, [])

  /**
   * Get settlement results
   */
  const getSettlementResults = useCallback(() => {
    return gameState.players.map((player) => {
      const totalInvested = player.buyinAmount + player.additionalBuyin
      const finalValue = player.finalChips
        ? Object.keys(player.finalChips).reduce((total, color) => {
            const chipColor = color as keyof ChipCounts
            return total + player.finalChips![chipColor] * gameState.chipValues[chipColor]
          }, 0)
        : 0

      return {
        player,
        totalInvested,
        finalValue,
        profit: finalValue - totalInvested
      }
    })
  }, [gameState.players, gameState.chipValues])

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
