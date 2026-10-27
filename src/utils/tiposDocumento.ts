export type TipoDocumento = {
  valor: string;
  rotulo: string;
};

export const tiposDocumentoPessoa: TipoDocumento[] = [
  { valor: 'rg', rotulo: 'RG' },
  { valor: 'cnh', rotulo: 'CNH' },
  { valor: 'comprovante_residencia', rotulo: 'Comprovante de residência' },
  { valor: 'outro', rotulo: 'Outro' },
];

export const tiposDocumentoEmpresa: TipoDocumento[] = [
  { valor: 'cartao_cnpj', rotulo: 'Cartão CNPJ' },
  { valor: 'contrato_social', rotulo: 'Contrato social' },
  { valor: 'comprovante_endereco', rotulo: 'Comprovante de endereço' },
  { valor: 'outro', rotulo: 'Outro' },
];

export function rotuloDoTipo(tipos: TipoDocumento[], valor: string): string {
  return tipos.find((tipo) => tipo.valor === valor)?.rotulo ?? valor;
}
