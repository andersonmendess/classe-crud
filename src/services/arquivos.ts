import { Directory, File, Paths } from 'expo-file-system';

export async function copiarParaDocumentos(uriOrigem: string, nomeOriginal: string) {
  const pasta = new Directory(Paths.document, 'documentos');
  pasta.create({ idempotent: true, intermediates: true });

  const nome = `${Date.now()}-${nomeOriginal.replace(/[^\w.-]/g, '_')}`;
  const destino = new File(pasta, nome);

  await new File(uriOrigem).copy(destino);

  return { caminho: destino.uri, tamanho: destino.size };
}

export function apagarArquivo(caminho: string) {
  const arquivo = new File(caminho);

  if (arquivo.exists) {
    arquivo.delete();
  }
}
