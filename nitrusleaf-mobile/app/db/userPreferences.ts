import { openDatabase } from "./db";

export type UserPreferences = {
  id?: number;
  theme: "light" | "dark";
  notifications: boolean;
};

/**
 * Cria tabela de preferências
 */
export const createPreferencesTable = async () => {
  const db = await openDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      theme TEXT NOT NULL,
      notifications INTEGER NOT NULL
    );
  `);
};

/**
 * Salva preferências
 */
export const savePreferences = async (prefs: UserPreferences) => {
  const db = await openDatabase();

  await db.runAsync(
    `INSERT INTO preferences (theme, notifications) VALUES (?, ?)`,
    prefs.theme,
    prefs.notifications ? 1 : 0
  );
};

/**
 * Busca preferências
 */
export const getPreferences = async (): Promise<UserPreferences | null> => {
  const db = await openDatabase();

  const result = await db.getFirstAsync<UserPreferences>(
    "SELECT * FROM preferences LIMIT 1"
  );

  if (!result) return null;

  return {
    ...result,
    notifications: result.notifications === 1,
  };
};
