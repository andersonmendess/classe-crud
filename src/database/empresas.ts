import type { SQLiteDatabase } from 'expo-sqlite';

export type DadosEmpresa = {
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export async function criarEmpresa(db: SQLiteDatabase, dados: DadosEmpresa) {
  await db.runAsync(
    `INSERT INTO empresas (
      razaoSocial, nomeFantasia, cnpj, email, telefone,
      cep, logradouro, numero, complemento, bairro, cidade, uf
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    dados.razaoSocial,
    dados.nomeFantasia,
    dados.cnpj,
    dados.email,
    dados.telefone,
    dados.cep,
    dados.logradouro,
    dados.numero,
    dados.complemento,
    dados.bairro,
    dados.cidade,
    dados.uf
  );
}
