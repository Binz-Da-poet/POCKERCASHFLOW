/**
 * Component gốc của ứng dụng Poker Money Calculator
 * Đây là entry point chính, chỉ đơn giản render PokerPage
 * Được thiết kế theo kiến trúc đơn giản với single page application
 */

import { BrowserRouter } from 'react-router-dom'
import { GameStateProvider } from './hooks/useGameState'
import { AutoSaveIndicator } from './components/AutoSaveIndicator'
import AppRoutes from './routes'
import './App.css'

// Import localStorage test trong development
if (process.env.NODE_ENV === 'development') {
  import('./utils/storageTest')
}

/**
 * Component App chính của ứng dụng
 * Hiện tại chỉ render PokerPage, nhưng có thể mở rộng để:
 * - Thêm routing cho nhiều trang
 * - Thêm global providers (theme, auth, etc.)
 * - Thêm error boundaries
 * - Thêm loading states
 *
 * @returns JSX.Element - Component App
 *
 * @example
 * // Trong main.tsx hoặc index.tsx
 * import { App } from './App'
 *
 * ReactDOM.render(<App />, document.getElementById('root'))
 */
function App() {
  return (
    <BrowserRouter>
      <GameStateProvider>
        <AppRoutes />
        <AutoSaveIndicator status='saved' />
      </GameStateProvider>
    </BrowserRouter>
  )
}

export default App
