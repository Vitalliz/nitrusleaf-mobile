// hooks/useDatabase.ts
import { useState, useEffect } from 'react';
import { initDatabase, UserOperations, TaskOperations } from '../services/database/schema';

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        setIsLoading(true);
        await initDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error('Erro ao inicializar banco:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDB();
  }, []);

  return {
    isInitialized,
    isLoading,
    ...UserOperations,
    ...TaskOperations
  };
};