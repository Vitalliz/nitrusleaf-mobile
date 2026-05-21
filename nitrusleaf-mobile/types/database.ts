export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number;
  created_at: string;
}

export type DatabaseResult = [SQLResultSet] | [SQLResultSet, Error];