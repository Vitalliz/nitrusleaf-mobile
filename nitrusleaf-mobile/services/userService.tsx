import db from './database';

// Cria a tabela (só na primeira vez)
export const createTable = () => {
  db.transaction((tx: { executeSql: (arg0: string) => void; }) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
      );`
    );
  });
};

// Adicionar um novo usuário
export const addUser = (name: any, email: any) => {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO users (name, email) VALUES (?, ?);', [name, email]);
  });
};

// Buscar todos os usuários
export const getUsers = (callback) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM users;', [], (_, { rows }) => {
      callback(rows._array);
    });
  });
};

// Atualizar um usuário
export const updateUser = (id: any, name: any, email: any) => {
  db.transaction(tx => {
    tx.executeSql('UPDATE users SET name = ?, email = ? WHERE id = ?;', [name, email, id]);
  });
};

// Deletar um usuário
export const deleteUser = (id) => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM users WHERE id = ?;', [id]);
  });
};
