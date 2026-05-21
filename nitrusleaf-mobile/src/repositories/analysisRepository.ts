// import db from "../database/database";
// import { Analysis } from "@/src/models/analysis";

// export const AnalysisRepository = {
//   getAll: (): Promise<Analysis[]> =>
//     new Promise((resolve) => {
//       db.transaction((tx) => {
//         tx.executeSql(
//           "SELECT * FROM analysis ORDER BY created_at DESC;",
//           [],
//           (_, { rows }) => resolve(rows._array)
//         );
//       });
//     }),

//   insert: (data: Analysis): Promise<void> =>
//     new Promise((resolve) => {
//       db.transaction((tx) => {
//         tx.executeSql(
//           `INSERT INTO analysis (field, nitrogen, potassium, calcium, created_at) 
//            VALUES (?, ?, ?, ?, ?);`,
//           [
//             data.field,
//             data.nitrogen,
//             data.potassium,
//             data.calcium,
//             data.created_at,
//           ],
//           () => resolve()
//         );
//       });
//     }),
// };
