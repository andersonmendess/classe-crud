import { validateCNPJ, validateCPF } from 'validador-cnpj-cpf';

import type { DadosEmpresa } from '@/database/empresas';
import type { DadosPessoa } from '@/database/pessoas';

export type Erros = Record<string, string | undefined>;

type Endereco = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

const camposDadosPessoais = [
  ['nome', 'Informe o nome.'],
  ['email', 'Informe o e-mail.'],
  ['telefone', 'Informe o telefone.'],
  ['dataNascimento', 'Informe a data de nascimento.'],
  ['cpf', 'Informe o CPF.'],
];

const camposDadosEmpresa = [
  ['razaoSocial', 'Informe a razão social.'],
  ['cnpj', 'Informe o CNPJ.'],
  ['email', 'Informe o e-mail.'],
  ['telefone', 'Informe o telefone.'],
];

const camposEndereco = [
  ['cep', 'Informe o CEP.'],
  ['logradouro', 'Informe o logradouro.'],
  ['numero', 'Informe o número.'],
  ['bairro', 'Informe o bairro.'],
  ['cidade', 'Informe a cidade.'],
  ['uf', 'Informe a UF.'],
];

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function verificarObrigatorios(dados: Record<string, unknown>, campos: string[][]): Erros {
  const erros: Erros = {};

  for (const [campo, mensagem] of campos) {
    if (!dados[campo]) {
      erros[campo] = mensagem;
    }
  }

  return erros;
}

function telefoneValido(telefone: string) {
  return telefone.length === 10 || telefone.length === 11;
}

function dataDeAnosAtras(anos: number) {
  const data = new Date();
  data.setFullYear(data.getFullYear() - anos);
  return data.toISOString().slice(0, 10);
}

export function validarDadosPessoais(dados: DadosPessoa): Erros {
  const erros = verificarObrigatorios(dados, camposDadosPessoais);

  if (!erros.email && !regexEmail.test(dados.email)) {
    erros.email = 'E-mail inválido.';
  }

  if (!erros.telefone && !telefoneValido(dados.telefone)) {
    erros.telefone = 'Telefone inválido.';
  }

  if (!erros.dataNascimento && dados.dataNascimento > dataDeAnosAtras(0)) {
    erros.dataNascimento = 'A data de nascimento não pode ser no futuro.';
  }

  if (!erros.dataNascimento && dados.dataNascimento < dataDeAnosAtras(100)) {
    erros.dataNascimento = 'A data de nascimento deve ser dos últimos 100 anos.';
  }

  if (!erros.cpf && !validateCPF(dados.cpf).isValid) {
    erros.cpf = 'CPF inválido.';
  }

  return erros;
}

export function validarDadosEmpresa(dados: DadosEmpresa): Erros {
  const erros = verificarObrigatorios(dados, camposDadosEmpresa);

  if (!erros.email && !regexEmail.test(dados.email)) {
    erros.email = 'E-mail inválido.';
  }

  if (!erros.telefone && !telefoneValido(dados.telefone)) {
    erros.telefone = 'Telefone inválido.';
  }

  if (!erros.cnpj && !validateCNPJ(dados.cnpj).isValid) {
    erros.cnpj = 'CNPJ inválido.';
  }

  return erros;
}

export function validarEndereco(dados: Endereco): Erros {
  const erros = verificarObrigatorios(dados, camposEndereco);

  if (!erros.cep && dados.cep.length !== 8) {
    erros.cep = 'O CEP precisa ter 8 números.';
  }

  return erros;
}
