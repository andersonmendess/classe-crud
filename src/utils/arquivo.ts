export function formatarTamanho(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

export function extensaoDoArquivo(nome: string): string {
  const partes = nome.split('.');

  if (partes.length < 2) {
    return 'ARQ';
  }

  return partes[partes.length - 1].toUpperCase().slice(0, 4);
}
