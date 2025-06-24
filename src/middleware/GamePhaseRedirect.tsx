import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useGameStateContext } from '../hooks/useGameState'
import { GAME_PHASES } from '../types'

const GamePhaseRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { gameState } = useGameStateContext()

  useEffect(() => {
    switch (gameState.gamePhase) {
      case GAME_PHASES.BUYIN_SETUP:
        navigate('/buyin-setup', { replace: true });
        break;
      case GAME_PHASES.CHIP_VALUES_SETUP:
        navigate('/chip-values-setup', { replace: true });
        break;
      case GAME_PHASES.PLAYERS_SETUP:
        navigate('/players-setup', { replace: true });
        break;
      case GAME_PHASES.PLAYING:
        navigate('/game-playing', { replace: true }); 
        break;
      case GAME_PHASES.FINAL_CHIPS_INPUT:
        navigate('/final-chips-input', { replace: true }); 
        break;
      case GAME_PHASES.FINAL_RESULTS:
        navigate('/final-results', { replace: true }); 
        break;
      default:
        navigate('/buyin-setup', { replace: true });
    }
  }, [gameState, navigate]);

  return <Outlet />; 
};

export default GamePhaseRedirect;