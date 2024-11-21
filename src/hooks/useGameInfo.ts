import { useState, useEffect } from 'react';
import { GameInfo } from '../types';
import { gameDataService } from '../services/gameData';
import { logger } from '../utils/logger';

export function useGameInfo(titleId: string | null) {
  const [data, setData] = useState<GameInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!titleId) {
      setData(null);
      setError(null);
      return;
    }

    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const gameInfo = await gameDataService.getGameData(titleId);
        
        if (mounted) {
          setData(gameInfo);
          setLoading(false);
        }
      } catch (err) {
        logger.error('Error in useGameInfo hook', {
          titleId,
          error: err instanceof Error ? err.message : 'Unknown error'
        });

        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch game data'));
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [titleId]);

  return { data, loading, error };
}