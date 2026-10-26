import type { SQLiteDatabase } from 'expo-sqlite';

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

const colunas = [
  'nome',
  'email',
  'telefone',
  'dataNascimento',
  'cpf',
  'rg',
  'cep',
  'logradouro',
  'numero',
  'complemento',
  'bairro',
  'cidade',
  'uf',
] as const;

function paraParametros(dados: DadosPessoa) {
  return Object.fromEntries(colunas.map((coluna) => [`$${coluna}`, dados[coluna]]));
}

export async function listarPessoas(db: SQLiteDatabase): Promise<Pessoa[]> {
  return db.getAllAsync<Pessoa>('SELECT * FROM pessoas ORDER BY nome');
}

export async function buscarPessoa(db: SQLiteDatabase, id: number): Promise<Pessoa | null> {
  return db.getFirstAsync<Pessoa>('SELECT * FROM pessoas WHERE id = ?', id);
}

export async function criarPessoa(db: SQLiteDatabase, dados: DadosPessoa) {
  const valores = colunas.map((coluna) => `$${coluna}`).join(', ');

  await db.runAsync(
    `INSERT INTO pessoas (${colunas.join(', ')}) VALUES (${valores})`,
    paraParametros(dados)
  );
}

export async function atualizarPessoa(db: SQLiteDatabase, id: number, dados: DadosPessoa) {
  const atribuicoes = colunas.map((coluna) => `${coluna} = $${coluna}`).join(', ');

  await db.runAsync(`UPDATE pessoas SET ${atribuicoes} WHERE id = $id`, {
    ...paraParametros(dados),
    $id: id,
  });
}

export async function excluirPessoa(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM pessoas WHERE id = ?', id);
}
