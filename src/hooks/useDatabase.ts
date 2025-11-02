import { useState, useEffect } from 'react';
import { db } from '../db/database';
import { initDatabase } from '../db/database';

export const useDatabase = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setIsReady(true); // Still set ready to allow app to work
      }
    };
    init();
  }, []);

  return { isReady, db };
};

