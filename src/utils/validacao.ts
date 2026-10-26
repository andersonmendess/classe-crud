import { validateCPF } from 'validador-cnpj-cpf';

import type { DadosPessoa } from '@/database/pessoas';

export type ErrosPessoa = Partial<Record<keyof DadosPessoa, string>>;

const camposObrigatorios: [keyof DadosPessoa, string][] = [
  ['nome', 'Informe o nome.'],
  ['email', 'Informe o e-mail.'],
  ['telefone', 'Informe o telefone.'],
  ['dataNascimento', 'Informe a data de nascimento.'],
  ['cpf', 'Informe o CPF.'],
  ['cep', 'Informe o CEP.'],
  ['logradouro', 'Informe o logradouro.'],
  ['numero', 'Informe o número.'],
  ['complemento', 'Informe o complemento.'],
  ['bairro', 'Informe o bairro.'],
  ['cidade', 'Informe a cidade.'],
  ['uf', 'Informe a UF.'],
];

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarPessoa(dados: DadosPessoa): ErrosPessoa {
  const erros: ErrosPessoa = {};

  for (const [campo, mensagem] of camposObrigatorios) {
    if (!dados[campo]) {
      erros[campo] = mensagem;
    }
  }

  if (!erros.email && !regexEmail.test(dados.email)) {
    erros.email = 'E-mail inválido.';
  }

  if (!erros.cpf && !validateCPF(dados.cpf).isValid) {
    erros.cpf = 'CPF inválido.';
  }

  if (!erros.cep && dados.cep.length !== 8) {
    erros.cep = 'O CEP precisa ter 8 números.';
  }

  return erros;
}
