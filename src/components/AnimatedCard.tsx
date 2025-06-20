/**
 * Animated Card Component - Poker Theme
 * Component card với animation bắt mắt cho poker theme
 */

import React, { memo } from 'react'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'chip' | 'money' | 'card' | 'glow'
  animation?:
    | 'fade-in'
    | 'slide-up'
    | 'bounce-in'
    | 'flip-in'
    | 'scale-in'
    | 'rotate-in'
    | 'chip-flip'
    | 'money-rain'
    | 'card-deal'
  delay?: number
  hover?: boolean
}

export const AnimatedCard = memo<AnimatedCardProps>(
  ({ children, className = '', variant = 'default', animation = 'fade-in', delay = 0, hover = true }) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'chip':
          return 'bg-gradient-to-br from-gold-400/10 to-gold-600/20 border border-gold-400/30 shadow-glow-gold'
        case 'money':
          return 'bg-gradient-to-br from-green-400/10 to-green-600/20 border border-green-400/30 shadow-lg'
        case 'card':
          return 'bg-gradient-to-br from-poker-100/10 to-poker-200/20 border border-poker-300/30'
        case 'glow':
          return 'bg-gradient-to-br from-gold-400/20 to-poker-primary/20 border border-gold-400/40 shadow-glow-gold animate-poker-glow'
        default:
          return 'glass-strong border border-white/20'
      }
    }

    const getAnimationClass = () => {
      return `animate-${animation}`
    }

    const getHoverClasses = () => {
      if (!hover) return ''
      return 'hover-lift hover-glow transition-all duration-300 cursor-pointer'
    }

    const animationStyle = delay > 0 ? { animationDelay: `${delay}s` } : undefined

    return (
      <div
        className={`
        ${getVariantClasses()}
        ${getAnimationClass()}
        ${getHoverClasses()}
        rounded-2xl p-6
        ${className}
      `}
        style={animationStyle}
      >
        {children}
      </div>
    )
  }
)

AnimatedCard.displayName = 'AnimatedCard'

// Specialized card components
export const ChipCard = memo<Omit<AnimatedCardProps, 'variant'>>((props) => <AnimatedCard {...props} variant='chip' />)
ChipCard.displayName = 'ChipCard'

export const MoneyCard = memo<Omit<AnimatedCardProps, 'variant'>>((props) => (
  <AnimatedCard {...props} variant='money' />
))
MoneyCard.displayName = 'MoneyCard'

export const PokerCard = memo<Omit<AnimatedCardProps, 'variant'>>((props) => <AnimatedCard {...props} variant='card' />)
PokerCard.displayName = 'PokerCard'

export const GlowCard = memo<Omit<AnimatedCardProps, 'variant'>>((props) => <AnimatedCard {...props} variant='glow' />)
GlowCard.displayName = 'GlowCard'

// Animated Button Component
interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'warning' | 'success' | 'danger' | 'chip'
  size?: 'sm' | 'md' | 'lg'
  animation?: 'bounce' | 'wiggle' | 'float' | 'pulse'
  className?: string
}

export const AnimatedButton = memo<AnimatedButtonProps>(
  ({ children, onClick, disabled = false, variant = 'primary', size = 'md', animation = 'bounce', className = '' }) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'warning':
          return 'btn-warning'
        case 'success':
          return 'btn-success'
        case 'danger':
          return 'btn-danger'
        case 'chip':
          return 'bg-gradient-to-br from-gold-400 to-gold-600 text-poker-900 border border-gold-300 shadow-glow-gold'
        default:
          return 'btn-primary'
      }
    }

    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'px-4 py-2 text-sm'
        case 'lg':
          return 'px-8 py-4 text-xl'
        default:
          return 'px-6 py-3 text-base'
      }
    }

    const getAnimationClasses = () => {
      switch (animation) {
        case 'wiggle':
          return 'hover:animate-wiggle'
        case 'float':
          return 'hover:animate-float'
        case 'pulse':
          return 'hover:animate-pulse-glow'
        default:
          return 'click-bounce'
      }
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getAnimationClasses()}
        hover-lift btn-press font-bold rounded-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      >
        {children}
      </button>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'

// Animated Icon Component
interface AnimatedIconProps {
  children: React.ReactNode
  animation?: 'spin' | 'bounce' | 'float' | 'wiggle' | 'suit-dance' | 'chip-flip'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'gold' | 'red' | 'green' | 'blue' | 'white'
  className?: string
}

export const AnimatedIcon = memo<AnimatedIconProps>(
  ({ children, animation = 'float', size = 'md', color = 'gold', className = '' }) => {
    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'text-lg'
        case 'lg':
          return 'text-3xl'
        case 'xl':
          return 'text-5xl'
        default:
          return 'text-2xl'
      }
    }

    const getColorClasses = () => {
      switch (color) {
        case 'red':
          return 'text-red-500'
        case 'green':
          return 'text-green-500'
        case 'blue':
          return 'text-blue-500'
        case 'white':
          return 'text-white'
        default:
          return 'text-gold'
      }
    }

    const getAnimationClasses = () => {
      switch (animation) {
        case 'spin':
          return 'animate-spin'
        case 'bounce':
          return 'animate-bounce-soft'
        case 'wiggle':
          return 'animate-wiggle'
        case 'suit-dance':
          return 'animate-suit-dance suit-icon'
        case 'chip-flip':
          return 'animate-chip-flip'
        default:
          return 'animate-float'
      }
    }

    return (
      <span
        className={`
        ${getSizeClasses()}
        ${getColorClasses()}
        ${getAnimationClasses()}
        inline-block
        ${className}
      `}
      >
        {children}
      </span>
    )
  }
)

AnimatedIcon.displayName = 'AnimatedIcon'
