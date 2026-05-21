// import { db } from "../database/database";

// export type Usuario = {
//   nome: string;
//   sobrenome: string;
//   telefone?: string;
//   email: string;
//   senha: string;
//   celular?: string;
//   tipo_pessoa?: "fisica" | "juridica";
//   cpf?: string;
//   cep?: string;
//   cnpj?: string;
//   nome_fantasia?: string;
//   logradouro?: string;
//   numero?: string;
//   bairro?: string;
//   cidade?: string;
// };

// export const userRepository = {
//   async create(user: Usuario): Promise<number> {
//     try {
//       // SOLUÇÃO: Usar execAsync em vez de runAsync
//       const result = await db.execAsync(
//         [
//           {
//             sql: `
//               INSERT INTO usuarios 
//               (nome, sobrenome, telefone, email, senha, tipo_pessoa, celular, cpf, cep, cnpj, nome_fantasia, logradouro, numero, bairro, cidade)
//               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//             `,
//             args: [
//               user.nome,
//               user.sobrenome,
//               user.telefone || null,
//               user.email,
//               user.senha,
//               user.tipo_pessoa || "fisica",
//               user.celular || null,
//               user.cpf || null,
//               user.cep || null,
//               user.cnpj || null,
//               user.nome_fantasia || null,
//               user.logradouro || null,
//               user.numero || null,
//               user.bairro || null,
//               user.cidade || null
//             ]
//           }
//         ],
//         false // readOnly = false para operações de escrita
//       );

//       // Para pegar o último ID inserido, precisamos fazer uma query separada
//       const idResult = await db.getFirstAsync<{ lastId: number }>(
//         "SELECT last_insert_rowid() as lastId"
//       );
      
//       return idResult?.lastId || 0;
//     } catch (error) {
//       console.error("Erro ao criar usuário:", error);
//       throw error;
//     }
//   },

//   async findByEmail(email: string): Promise<Usuario | null> {
//     try {
//       const result = await db.getFirstAsync<Usuario>(
//         `SELECT * FROM usuarios WHERE email = ?`,
//         [email]
//       );
//       return result || null;
//     } catch (error) {
//       console.error("Erro ao buscar usuário por email:", error);
//       return null;
//     }
//   },

//   async findById(id: number): Promise<Usuario | null> {
//     try {
//       const result = await db.getFirstAsync<Usuario>(
//         `SELECT * FROM usuarios WHERE id_usuario = ?`,
//         [id]
//       );
//       return result || null;
//     } catch (error) {
//       console.error("Erro ao buscar usuário por ID:", error);
//       return null;
//     }
//   },

//   async verifyCredentials(email: string, senha: string): Promise<Usuario | null> {
//     try {
//       const result = await db.getFirstAsync<Usuario>(
//         `SELECT * FROM usuarios WHERE email = ? AND senha = ?`,
//         [email, senha]
//       );
//       return result || null;
//     } catch (error) {
//       console.error("Erro ao verificar credenciais:", error);
//       return null;
//     }
//   }
// };