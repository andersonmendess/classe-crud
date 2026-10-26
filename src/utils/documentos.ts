export function formatarCpf(texto: string): string {
  const numeros = texto.replace(/\D/g, '').slice(0, 11);

  return numeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatarCep(texto: string): string {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);

  return numeros.replace(/(\d{5})(\d)/, '$1-$2');
}
