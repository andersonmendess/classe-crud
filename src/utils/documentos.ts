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

export function formatarCnpj(texto: string): string {
  const caracteres = texto.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 14);

  let formatado = caracteres.slice(0, 2);
  if (caracteres.length > 2) formatado += `.${caracteres.slice(2, 5)}`;
  if (caracteres.length > 5) formatado += `.${caracteres.slice(5, 8)}`;
  if (caracteres.length > 8) formatado += `/${caracteres.slice(8, 12)}`;
  if (caracteres.length > 12) formatado += `-${caracteres.slice(12, 14)}`;

  return formatado;
}
