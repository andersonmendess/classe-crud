import type { SQLiteDatabase } from 'expo-sqlite';

import { apagarDocumentosDoTitular } from '@/database/documentos';

export type DadosEmpresa = {
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
  email: string;
  telefone: string;
  representanteNome: string;
  representanteCpf: string;
  representanteCargo: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type Empresa = DadosEmpresa & { id: number };

export async function listarEmpresas(db: SQLiteDatabase): Promise<Empresa[]> {
  return db.getAllAsync<Empresa>('SELECT * FROM empresas ORDER BY razaoSocial');
}

export async function buscarEmpresa(db: SQLiteDatabase, id: number): Promise<Empresa | null> {
  return db.getFirstAsync<Empresa>('SELECT * FROM empresas WHERE id = ?', id);
}

export async function cnpjJaCadastrado(db: SQLiteDatabase, cnpj: string, ignorarId = 0) {
  const empresa = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM empresas WHERE cnpj = ? AND id != ?',
    cnpj,
    ignorarId
  );

  return empresa !== null;
}

export async function criarEmpresa(db: SQLiteDatabase, dados: DadosEmpresa): Promise<number> {
  const resultado = await db.runAsync(
    `INSERT INTO empresas (
      razaoSocial, nomeFantasia, cnpj, email, telefone,
      representanteNome, representanteCpf, representanteCargo,
      cep, logradouro, numero, complemento, bairro, cidade, uf
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    dados.razaoSocial,
    dados.nomeFantasia,
    dados.cnpj,
    dados.email,
    dados.telefone,
    dados.representanteNome,
    dados.representanteCpf,
    dados.representanteCargo,
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

export async function atualizarEmpresa(db: SQLiteDatabase, id: number, dados: DadosEmpresa) {
  await db.runAsync(
    `UPDATE empresas SET
      razaoSocial = ?, nomeFantasia = ?, cnpj = ?, email = ?, telefone = ?,
      representanteNome = ?, representanteCpf = ?, representanteCargo = ?,
      cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ?
    WHERE id = ?`,
    dados.razaoSocial,
    dados.nomeFantasia,
    dados.cnpj,
    dados.email,
    dados.telefone,
    dados.representanteNome,
    dados.representanteCpf,
    dados.representanteCargo,
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

export async function excluirEmpresa(db: SQLiteDatabase, id: number) {
  await apagarDocumentosDoTitular(db, { tipo: 'empresa', id });
  await db.runAsync('DELETE FROM empresas WHERE id = ?', id);
}
