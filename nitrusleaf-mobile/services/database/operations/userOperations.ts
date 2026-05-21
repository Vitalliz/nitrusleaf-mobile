// import database from '../index';
// import { User } from '../../../types/database';

// export const UserOperations = {
//   createUser(user: Omit<User, 'id' | 'created_at'>): Promise<number> {
//     return new Promise((resolve, reject) => {
//       database.transaction(
//         tx => {
//           tx.executeSql(
//             'INSERT INTO users (name, email) VALUES (?, ?)',
//             [user.name, user.email],
//             (_: any, result: { insertId: number | PromiseLike<number>; }) => resolve(result.insertId),
//             (_: any, error: any) => {
//               reject(error);
//               return false;
//             }
//           );
//         },
//         ( error: any) => reject(error)
//       );
//     });
//   },

//   getUsers(): Promise<User[]> {
//     return new Promise((resolve, reject) => {
//       database.transaction(
//         tx => {
//           tx.executeSql(
//             'SELECT * FROM users ORDER BY created_at DESC',
//             [],
//             (_: any, result: { rows: { _array: User[] | PromiseLike<User[]>; }; }) => resolve(result.rows._array),
//             (_: any, error: any) => {
//               reject(error);
//               return false;
//             }
//           );
//         },
//         error => reject(error)
//       );
//     });
//   },

//   // Buscar usuário por ID
//   getUserById(id: number): Promise<User | null> {
//     return new Promise((resolve, reject) => {
//       database.transaction(
//         tx => {
//           tx.executeSql(
//             'SELECT * FROM users WHERE id = ?',
//             [id],
//             (_, result) => resolve(result.rows._array[0] || null),
//             (_, error) => {
//               reject(error);
//               return false;
//             }
//           );
//         },
//         error => reject(error)
//       );
//     });
//   }
// };