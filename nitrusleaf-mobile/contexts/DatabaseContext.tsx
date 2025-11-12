import React, { createContext, useContext, ReactNode } from 'react';
import { useDatabase } from '../hooks/useDatabase';

interface DatabaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  createUser: (user: any) => Promise<number>;
  getUsers: () => Promise<any[]>;
  createTask: (task: any) => Promise<number>;
  getTasksWithUsers: () => Promise<any[]>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const database = useDatabase();

  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
};