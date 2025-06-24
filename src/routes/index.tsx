import { Routes, Route, Navigate } from 'react-router-dom'
import GamePhaseRedirect from '../middleware/GamePhaseRedirect';
import { BuyinSetupPage } from '../pages/BuyinSetupPage'
import { ChipValuesSetupPage } from '../pages/ChipValuesSetupPage'
import { PlayersSetupPage } from '../pages/PlayersSetupPage'
import { GamePlayingPage } from '../pages/GamePlayingPage'
import { FinalChipsInputPage } from '../pages/FinalChipsInputPage'
import { FinalResultsPage } from '../pages/FinalResultsPage'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root to buyin setup */}
      <Route path='/' element={<Navigate to='/buyin-setup' replace />} />

      {/* Game flow routes */}
      <Route element={<GamePhaseRedirect />}>
        <Route path='/buyin-setup' element={<BuyinSetupPage />} />
        <Route path='/chip-values-setup' element={<ChipValuesSetupPage />} />
        <Route path='/players-setup' element={<PlayersSetupPage />} />
        <Route path='/game-playing' element={<GamePlayingPage />} />
        <Route path='/final-chips-input' element={<FinalChipsInputPage />} />
        <Route path='/final-results' element={<FinalResultsPage />} />
      </Route>

      {/* Fallback for unknown routes */}
      <Route path='*' element={<Navigate to='/buyin-setup' replace />} />
    </Routes>
  )
}

export default AppRoutes
