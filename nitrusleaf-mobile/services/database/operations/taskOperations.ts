// import database from '../index';
// import { Task } from '../../../types/database';

// export const TaskOperations = {
//   createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<number> {
//     return new Promise((resolve, reject) => {
//       database.transaction(
//         tx => {
//           tx.executeSql(
//             'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
//             [task.title, task.description, task.user_id],
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

//   // Buscar tarefas com usuário
//   getTasksWithUsers(): Promise<any[]> {
//     return new Promise((resolve, reject) => {
//       database.transaction(
//         tx => {
//           tx.executeSql(
//             `SELECT tasks.*, users.name as user_name 
//              FROM tasks 
//              LEFT JOIN users ON tasks.user_id = users.id 
//              ORDER BY tasks.created_at DESC`,
//             [],
//             (_: any, result: { rows: { _array: any[] | PromiseLike<any[]>; }; }) => resolve(result.rows._array),
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

//   updateTaskStatus(id: number, completed: boolean): Promise<void> {
//     return new Promise((resolve, reject) => {
//       database.transaction(
//         tx => {
//           tx.executeSql(
//             'UPDATE tasks SET completed = ? WHERE id = ?',
//             [completed ? 1 : 0, id],
//             () => resolve(),
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