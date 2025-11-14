import { openDatabase } from "./db";

export type Contact = {
  id?: number;
  name: string;
  email: string;
  phone: string;
};

/**
 * Cria a tabela de contatos
 */
export const createContactsTable = async () => {
  const db = await openDatabase();

  const sql = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT
    );
  `;

  await db.execAsync(sql);
};

/**
 * Adiciona um novo contato
 */
export const addContact = async (contact: Contact): Promise<void> => {
  const db = await openDatabase();

  try {
    await db.runAsync(
      "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)",
      contact.name,
      contact.email,
      contact.phone
    );
  } catch (error) {
    console.error("Erro ao inserir contato:", error);
    throw new Error("Falha ao adicionar contato");
  }
};

/**
 * Retorna todos os contatos
 */
export const getContacts = async (): Promise<Contact[]> => {
  const db = await openDatabase();

  try {
    const results = await db.getAllAsync<Contact>("SELECT * FROM contacts");
    return results;
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    throw new Error("Falha ao carregar contatos");
  }
};

/**
 * Atualiza um contato
 */
export const updateContact = async (contact: Contact): Promise<void> => {
  if (!contact.id) throw new Error("ID ausente ao atualizar contato");

  const db = await openDatabase();

  try {
    await db.runAsync(
      "UPDATE contacts SET name=?, email=?, phone=? WHERE id=?",
      contact.name,
      contact.email,
      contact.phone,
      contact.id
    );
  } catch (error) {
    console.error("Erro ao atualizar contato:", error);
    throw new Error("Falha ao atualizar contato");
  }
};

/**
 * Exclui um contato
 */
export const deleteContact = async (id: number): Promise<void> => {
  const db = await openDatabase();

  try {
    await db.runAsync("DELETE FROM contacts WHERE id=?", id);
  } catch (error) {
    console.error("Erro ao excluir contato:", error);
    throw new Error("Falha ao excluir contato");
  }
};
