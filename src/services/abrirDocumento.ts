import * as Sharing from 'expo-sharing';

import type { Documento } from '@/database/documentos';
import { mostrarAviso } from '@/services/avisos';

export function ehImagem(documento: Documento) {
  return (
    documento.mimeType?.startsWith('image/') === true ||
    /\.(jpe?g|png|webp|gif)$/i.test(documento.nomeArquivo)
  );
}

export async function compartilharDocumento(documento: Documento) {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      mostrarAviso('Não é possível abrir arquivos neste aparelho.');
      return;
    }

    await Sharing.shareAsync(documento.caminho, {
      mimeType: documento.mimeType ?? 'application/pdf',
      dialogTitle: documento.nomeArquivo,
    });
  } catch {
    mostrarAviso('Não foi possível abrir o documento.');
  }
}
