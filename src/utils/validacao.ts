import { validateCNPJ, validateCPF } from 'validador-cnpj-cpf';

import type { DadosEmpresa } from '@/database/empresas';
import type { DadosPessoa } from '@/database/pessoas';

type Endereco = Pick<
  DadosPessoa,
  'cep' | 'logradouro' | 'numero' | 'complemento' | 'bairro' | 'cidade' | 'uf'
>;

export type ErrosPessoa = Partial<Record<keyof DadosPessoa, string>>;
export type ErrosEmpresa = Partial<Record<keyof DadosEmpresa, string>>;
export type ErrosEndereco = Partial<Record<keyof Endereco, string>>;

const camposDadosPessoais: [keyof DadosPessoa, string][] = [
  ['nome', 'Informe o nome.'],
  ['email', 'Informe o e-mail.'],
  ['telefone', 'Informe o telefone.'],
  ['dataNascimento', 'Informe a data de nascimento.'],
  ['cpf', 'Informe o CPF.'],
];

const camposDadosEmpresa: [keyof DadosEmpresa, string][] = [
  ['razaoSocial', 'Informe a razão social.'],
  ['cnpj', 'Informe o CNPJ.'],
  ['email', 'Informe o e-mail.'],
  ['telefone', 'Informe o telefone.'],
];

const camposEndereco: [keyof Endereco, string][] = [
  ['cep', 'Informe o CEP.'],
  ['logradouro', 'Informe o logradouro.'],
  ['numero', 'Informe o número.'],
  ['complemento', 'Informe o complemento.'],
  ['bairro', 'Informe o bairro.'],
  ['cidade', 'Informe a cidade.'],
  ['uf', 'Informe a UF.'],
];

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function obrigatorios<T extends object>(
  dados: T,
  campos: [keyof T, string][]
): Partial<Record<keyof T, string>> {
  const erros: Partial<Record<keyof T, string>> = {};

  for (const [campo, mensagem] of campos) {
    if (!dados[campo]) {
      erros[campo] = mensagem;
    }
  }

  return erros;
}

export function validarDadosPessoais(dados: DadosPessoa): ErrosPessoa {
  const erros: ErrosPessoa = obrigatorios(dados, camposDadosPessoais);

  if (!erros.email && !regexEmail.test(dados.email)) {
    erros.email = 'E-mail inválido.';
  }

  if (!erros.cpf && !validateCPF(dados.cpf).isValid) {
    erros.cpf = 'CPF inválido.';
  }

  return erros;
}

export function validarDadosEmpresa(dados: DadosEmpresa): ErrosEmpresa {
  const erros: ErrosEmpresa = obrigatorios(dados, camposDadosEmpresa);

  if (!erros.email && !regexEmail.test(dados.email)) {
    erros.email = 'E-mail inválido.';
  }

  if (!erros.cnpj && !validateCNPJ(dados.cnpj).isValid) {
    erros.cnpj = 'CNPJ inválido.';
  }

  return erros;
}

export function validarEndereco(dados: Endereco): ErrosEndereco {
  const erros: ErrosEndereco = obrigatorios(dados, camposEndereco);

  if (!erros.cep && dados.cep.length !== 8) {
    erros.cep = 'O CEP precisa ter 8 números.';
  }

  return erros;
}
