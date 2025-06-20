/**
 * Modern Layout System - Poker Cash Flow
 * Thiết kế hiện đại, tối ưu mobile, glassmorphism design
 */

import React, { memo, useMemo } from 'react'

/**
 * Props cho MainLayout component
 */
interface MainLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showHeader?: boolean
  headerActions?: React.ReactNode
  className?: string
  variant?: 'default' | 'game' | 'setup'
}

/**
 * Component Section - Modern Card Design
 */
export const Section = memo<{
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'glass'
}>(({ title, description, actions, children, className = '', variant = 'default' }) => {
  const hasHeader = !!(title || description || actions)

  const cardVariant = useMemo(() => {
    switch (variant) {
      case 'elevated':
        return 'card-elevated shadow-strong'
      case 'glass':
        return 'glass-strong'
      default:
        return 'card'
    }
  }, [variant])

  return (
    <section className={`${cardVariant} p-6 sm:p-8 animate-scale-in hover-lift ${className}`}>
      {hasHeader && (
        <div className='mb-6 animate-fade-in'>
          <div className='flex items-start justify-between mb-3'>
            {title && (
              <h2 className='text-xl sm:text-2xl font-semibold text-secondary-900 animate-slide-right'>{title}</h2>
            )}
            {actions && <div className='flex items-center gap-3 ml-4 animate-slide-left'>{actions}</div>}
          </div>
          {description && (
            <p className='text-secondary-600 leading-relaxed animate-slide-up' style={{ animationDelay: '0.1s' }}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className='animate-fade-in' style={{ animationDelay: hasHeader ? '0.2s' : '0s' }}>
        {children}
      </div>
    </section>
  )
})
Section.displayName = 'Section'

/**
 * Component ResponsiveGrid cho layout responsive
 * Đã tối ưu: dùng useMemo cho className
 */
export const ResponsiveGrid = memo<{
  children: React.ReactNode
  cols?: number
  className?: string
}>(({ children, cols = 2, className = '' }) => {
  const gridCols = useMemo(() => {
    switch (cols) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-1 sm:grid-cols-2'
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 sm:grid-cols-2'
    }
  }, [cols])
  return <div className={`grid ${gridCols} gap-4 ${className}`}>{children}</div>
})
ResponsiveGrid.displayName = 'ResponsiveGrid'

/**
 * Component MainLayout chính - Modern Design
 */
export const MainLayout: React.FC<MainLayoutProps> = memo(
  ({ children, title, subtitle, showHeader = false, headerActions, className = '', variant = 'default' }) => {
    const backgroundVariant = useMemo(() => {
      switch (variant) {
        case 'setup':
          return 'bg-gradient-to-br from-poker-900 via-felt-900 to-poker-800'
        case 'game':
          return 'bg-gradient-to-br from-felt-900 via-felt-800 to-poker-900'
        default:
          return 'bg-gradient-to-br from-poker-900 via-secondary-900 to-poker-800'
      }
    }, [variant])

    return (
      <div className={`min-h-screen ${backgroundVariant} ${className}`}>
        {/* Animated Poker Background */}
        <div className='fixed inset-0 pointer-events-none overflow-hidden'>
          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-gold-500/8 via-transparent to-gold-600/12 animate-pulse-glow' />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,0.1)_21%,_rgba(0,0,0,0.1)_40%,_transparent_41%)] opacity-30' />

          {/* Floating suit symbols */}
          <div className='absolute top-10 left-10 text-6xl text-gold/20 animate-suit-dance suit-icon'>♠</div>
          <div
            className='absolute top-20 right-20 text-5xl text-red-500/20 animate-suit-dance suit-icon'
            style={{ animationDelay: '0.5s' }}
          >
            ♥
          </div>
          <div
            className='absolute bottom-20 left-20 text-5xl text-poker-primary/20 animate-suit-dance suit-icon'
            style={{ animationDelay: '1s' }}
          >
            ♣
          </div>
          <div
            className='absolute bottom-10 right-10 text-6xl text-red-500/20 animate-suit-dance suit-icon'
            style={{ animationDelay: '1.5s' }}
          >
            ♦
          </div>

          {/* Additional floating elements */}
          <div
            className='absolute top-1/3 left-1/4 text-4xl text-gold/15 animate-float'
            style={{ animationDelay: '0.3s' }}
          >
            ♠
          </div>
          <div
            className='absolute top-2/3 right-1/3 text-3xl text-red-400/15 animate-float'
            style={{ animationDelay: '0.8s' }}
          >
            ♥
          </div>
          <div
            className='absolute bottom-1/3 left-1/2 text-3xl text-poker-primary/15 animate-float'
            style={{ animationDelay: '1.2s' }}
          >
            ♣
          </div>
          <div
            className='absolute top-1/2 right-1/4 text-4xl text-red-300/15 animate-float'
            style={{ animationDelay: '1.8s' }}
          >
            ♦
          </div>

          {/* Floating poker chips */}
          <div
            className='absolute top-1/4 right-1/6 w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full animate-float shadow-glow-gold opacity-30'
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className='absolute bottom-1/4 left-1/6 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-float shadow-lg opacity-30'
            style={{ animationDelay: '2.5s' }}
          ></div>
          <div
            className='absolute top-3/4 right-1/2 w-6 h-6 bg-gradient-to-br from-poker-primary to-poker-600 rounded-full animate-float shadow-lg opacity-30'
            style={{ animationDelay: '3s' }}
          ></div>
          <div
            className='absolute top-1/6 left-2/3 w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full animate-chip-flip shadow-glow-gold opacity-25'
            style={{ animationDelay: '1.5s' }}
          ></div>
        </div>

        {/* Header */}
        {showHeader && (
          <header className='relative z-10 glass-strong border-b border-white/20 sticky top-0 animate-slide-down'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex justify-between items-center h-16 sm:h-20'>
                <div className='flex items-center'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center hover-glow hover-lift transition-all duration-300'>
                      <span className='text-poker-900 font-bold text-lg animate-suit-dance'>♠</span>
                    </div>
                    <h1 className='text-xl sm:text-2xl font-bold text-secondary-100 truncate casino-title'>
                      {title || 'Poker Cash Flow'}
                    </h1>
                  </div>
                </div>
                {headerActions && <div className='flex items-center space-x-3 animate-slide-left'>{headerActions}</div>}
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
          <div className='space-y-8'>
            {/* Page Header */}
            {(title || subtitle) && !showHeader && (
              <div className='text-center animate-fade-in'>
                {title && (
                  <div className='mb-6 animate-bounce-in'>
                    <div className='flex items-center justify-center gap-4 mb-4'>
                      <div className='w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-glow-gold hover-glow hover-lift animate-chip-flip'>
                        <span className='text-poker-900 font-bold text-2xl'>♠</span>
                      </div>
                      <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-100 casino-title animate-scale-in'>
                        {title}
                      </h1>
                      <div
                        className='w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-glow-gold hover-glow hover-lift animate-chip-flip'
                        style={{ animationDelay: '0.3s' }}
                      >
                        <span className='text-poker-900 font-bold text-2xl'>♣</span>
                      </div>
                    </div>
                  </div>
                )}
                {subtitle && (
                  <p
                    className='text-lg sm:text-xl text-secondary-300 max-w-3xl mx-auto leading-relaxed animate-slide-up'
                    style={{ animationDelay: '0.2s' }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className='animate-slide-up'>{children}</div>
          </div>
        </main>
      </div>
    )
  }
)
MainLayout.displayName = 'MainLayout'

/**
 * Component container cho nội dung với padding và styling chuẩn
 * Tối ưu cho mobile
 * Đã tối ưu: dùng memo
 */
interface ContentContainerProps {
  children: React.ReactNode
  className?: string
}

export const ContentContainer = memo<ContentContainerProps>(({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}>{children}</div>
))
ContentContainer.displayName = 'ContentContainer'

/**
 * Component loading spinner
 * Hiển thị khi đang tải dữ liệu
 * Đã tối ưu: dùng useMemo cho class spinner, memo hóa component
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(({ size = 'md', message }) => {
  const sizeClass = useMemo(() => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6'
      case 'lg':
        return 'w-12 h-12'
      case 'md':
      default:
        return 'w-8 h-8'
    }
  }, [size])

  return (
    <div className='flex flex-col items-center justify-center py-8'>
      {/* Spinner */}
      <div
        className={`
          ${sizeClass}
          border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin
        `}
      />
      {/* Message */}
      {message && <p className='mt-4 text-sm text-gray-600 text-center'>{message}</p>}
    </div>
  )
})
LoadingSpinner.displayName = 'LoadingSpinner'

/**
 * Component empty state
 * Hiển thị khi không có dữ liệu
 * Đã tối ưu: dùng memo
 */
interface EmptyStateProps {
  title: string
  description?: string
  icon?: string
  action?: React.ReactNode
}

export const EmptyState = memo<EmptyStateProps>(({ title, description, icon = '📭', action }) => (
  <div className='flex flex-col items-center justify-center py-12 text-center'>
    {/* Icon */}
    <div className='text-6xl mb-4'>{icon}</div>
    {/* Title */}
    <h3 className='text-lg font-medium text-gray-800 mb-2'>{title}</h3>
    {/* Description */}
    {description && <p className='text-sm text-gray-600 mb-6 max-w-md'>{description}</p>}
    {/* Action */}
    {action && <div>{action}</div>}
  </div>
))
EmptyState.displayName = 'EmptyState'
