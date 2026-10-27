import type { SQLiteDatabase } from 'expo-sqlite';

import { apagarArquivo } from '@/services/arquivos';

export type Titular = {
  tipo: 'pessoa' | 'empresa';
  id: number;
};

export type Documento = {
  id?: number;
  tipo: string;
  nomeArquivo: string;
  caminho: string;
  mimeType: string | null;
  tamanho: number;
};

function colunaDo(titular: Titular) {
  return titular.tipo === 'pessoa' ? 'pessoaId' : 'empresaId';
}

export async function listarDocumentos(db: SQLiteDatabase, titular: Titular): Promise<Documento[]> {
  return db.getAllAsync<Documento>(
    `SELECT id, tipo, nomeArquivo, caminho, mimeType, tamanho
     FROM documentos
     WHERE ${colunaDo(titular)} = ?
     ORDER BY id`,
    titular.id
  );
}

export async function salvarDocumentos(
  db: SQLiteDatabase,
  titular: Titular,
  originais: Documento[],
  finais: Documento[]
) {
  const idsFinais = finais.map((documento) => documento.id);

  for (const original of originais) {
    if (!idsFinais.includes(original.id)) {
      await excluirDocumento(db, original);
    }
  }

  for (const documento of finais) {
    if (documento.id === undefined) {
      await db.runAsync(
        `INSERT INTO documentos (${colunaDo(titular)}, tipo, nomeArquivo, caminho, mimeType, tamanho)
         VALUES (?, ?, ?, ?, ?, ?)`,
        titular.id,
        documento.tipo,
        documento.nomeArquivo,
        documento.caminho,
        documento.mimeType,
        documento.tamanho
      );
    }
  }
}

export async function excluirDocumento(db: SQLiteDatabase, documento: Documento) {
  await db.runAsync('DELETE FROM documentos WHERE id = ?', documento.id ?? null);
  apagarArquivo(documento.caminho);
}

export async function apagarDocumentosDoTitular(db: SQLiteDatabase, titular: Titular) {
  const documentos = await listarDocumentos(db, titular);

  for (const documento of documentos) {
    apagarArquivo(documento.caminho);
  }
}
