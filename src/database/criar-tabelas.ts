import type { SQLiteDatabase } from 'expo-sqlite';

export async function criarTabelas(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS pessoas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      dataNascimento TEXT NOT NULL,
      cpf TEXT NOT NULL,
      rg TEXT,
      cep TEXT NOT NULL,
      logradouro TEXT NOT NULL,
      numero TEXT NOT NULL,
      complemento TEXT NOT NULL,
      bairro TEXT NOT NULL,
      cidade TEXT NOT NULL,
      uf TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS empresas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      razaoSocial TEXT NOT NULL,
      nomeFantasia TEXT,
      cnpj TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      cep TEXT NOT NULL,
      logradouro TEXT NOT NULL,
      numero TEXT NOT NULL,
      complemento TEXT NOT NULL,
      bairro TEXT NOT NULL,
      cidade TEXT NOT NULL,
      uf TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS documentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pessoaId INTEGER REFERENCES pessoas(id) ON DELETE CASCADE,
      empresaId INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
      tipo TEXT NOT NULL,
      nomeArquivo TEXT NOT NULL,
      caminho TEXT NOT NULL,
      mimeType TEXT,
      tamanho INTEGER NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS pessoas_cpf_unico ON pessoas (cpf);
    CREATE UNIQUE INDEX IF NOT EXISTS empresas_cnpj_unico ON empresas (cnpj);
  `);
}
