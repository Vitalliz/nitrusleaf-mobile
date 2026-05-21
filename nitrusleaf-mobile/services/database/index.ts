// import * as SQLite from 'expo-sqlite';

// const database = SQLite.openDatabaseSync('Nitrusleaf_PI');

// export const initDatabase = (): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     database.transaction(
//       tx => {
//         tx.executeSql(
//           `CREATE TABLE IF NOT EXISTS users (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             email TEXT UNIQUE NOT NULL,
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//           )`
//         );

//         tx.executeSql(
//           `CREATE TABLE IF NOT EXISTS tasks (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             title TEXT NOT NULL,
//             description TEXT,
//             completed BOOLEAN DEFAULT 0,
//             user_id INTEGER,
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (user_id) REFERENCES users (id)
//           )`
//         );
//       },
//       (      error: any) => {
//         console.error('Erro ao criar tabelas:', error);
//         reject(error);
//       },
//       () => {
//         console.log('Banco de dados inicializado com sucesso!');
//         resolve();
//       }
//     );
//   });
// };

// export default database;