import { Directory, File, Paths } from 'expo-file-system';

const pastaDocumentos = new Directory(Paths.document, 'documentos');

export async function copiarParaDocumentos(uriOrigem: string, nomeOriginal: string) {
  pastaDocumentos.create({ idempotent: true, intermediates: true });

  const nome = `${Date.now()}-${nomeOriginal.replace(/[^\w.-]/g, '_')}`;
  const destino = new File(pastaDocumentos, nome);

  await new File(uriOrigem).copy(destino);

  return { caminho: destino.uri, tamanho: destino.size };
}

export function apagarArquivo(caminho: string) {
  const arquivo = new File(caminho);

  if (arquivo.exists) {
    arquivo.delete();
  }
}
