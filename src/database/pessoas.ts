import type { SQLiteDatabase } from 'expo-sqlite';

import { apagarDocumentosDoTitular } from '@/database/documentos';

export type Pessoa = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  rg: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type DadosPessoa = Omit<Pessoa, 'id'>;

export async function listarPessoas(db: SQLiteDatabase): Promise<Pessoa[]> {
  return db.getAllAsync<Pessoa>('SELECT * FROM pessoas ORDER BY nome');
}

export async function buscarPessoa(db: SQLiteDatabase, id: number): Promise<Pessoa | null> {
  return db.getFirstAsync<Pessoa>('SELECT * FROM pessoas WHERE id = ?', id);
}

export async function cpfJaCadastrado(db: SQLiteDatabase, cpf: string, ignorarId = 0) {
  const pessoa = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM pessoas WHERE cpf = ? AND id != ?',
    cpf,
    ignorarId
  );

  return pessoa !== null;
}

export async function criarPessoa(db: SQLiteDatabase, dados: DadosPessoa): Promise<number> {
  const resultado = await db.runAsync(
    `INSERT INTO pessoas (
      nome, email, telefone, dataNascimento, cpf, rg,
      cep, logradouro, numero, complemento, bairro, cidade, uf
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    dados.nome,
    dados.email,
    dados.telefone,
    dados.dataNascimento,
    dados.cpf,
    dados.rg,
    dados.cep,
    dados.logradouro,
    dados.numero,
    dados.complemento,
    dados.bairro,
    dados.cidade,
    dados.uf
  );

  return resultado.lastInsertRowId;
}

export async function atualizarPessoa(db: SQLiteDatabase, id: number, dados: DadosPessoa) {
  await db.runAsync(
    `UPDATE pessoas SET
      nome = ?, email = ?, telefone = ?, dataNascimento = ?, cpf = ?, rg = ?,
      cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ?
    WHERE id = ?`,
    dados.nome,
    dados.email,
    dados.telefone,
    dados.dataNascimento,
    dados.cpf,
    dados.rg,
    dados.cep,
    dados.logradouro,
    dados.numero,
    dados.complemento,
    dados.bairro,
    dados.cidade,
    dados.uf,
    id
  );
}

export async function excluirPessoa(db: SQLiteDatabase, id: number) {
  await apagarDocumentosDoTitular(db, { tipo: 'pessoa', id });
  await db.runAsync('DELETE FROM pessoas WHERE id = ?', id);
}
