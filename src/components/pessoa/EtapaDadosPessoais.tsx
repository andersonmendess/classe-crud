import { CampoTexto } from '@/components/CampoTexto';
import type { DadosFormularioPessoa } from '@/components/pessoa/tipos';
import { formatarDataBr } from '@/utils/data';
import { formatarCpf } from '@/utils/documentos';
import type { ErrosPessoa } from '@/utils/validacao';

type Props = {
  dados: DadosFormularioPessoa;
  erros: ErrosPessoa;
  onAlterar: (campo: keyof DadosFormularioPessoa, texto: string) => void;
};

export function EtapaDadosPessoais({ dados, erros, onAlterar }: Props) {
  return (
    <>
      <CampoTexto
        label="Nome"
        value={dados.nome}
        onChangeText={(texto) => onAlterar('nome', texto)}
        erro={erros.nome}
        autoCapitalize="words"
      />
      <CampoTexto
        label="E-mail"
        value={dados.email}
        onChangeText={(texto) => onAlterar('email', texto)}
        erro={erros.email}
        keyboardType="email-address"
      />
      <CampoTexto
        label="Telefone"
        value={dados.telefone}
        onChangeText={(texto) => onAlterar('telefone', texto)}
        erro={erros.telefone}
        keyboardType="phone-pad"
      />
      <CampoTexto
        label="Data de nascimento (DD/MM/AAAA)"
        value={dados.dataNascimento}
        onChangeText={(texto) => onAlterar('dataNascimento', formatarDataBr(texto))}
        erro={erros.dataNascimento}
        keyboardType="number-pad"
      />
      <CampoTexto
        label="CPF"
        value={dados.cpf}
        onChangeText={(texto) => onAlterar('cpf', formatarCpf(texto))}
        erro={erros.cpf}
        keyboardType="number-pad"
      />
      <CampoTexto
        label="RG (opcional)"
        value={dados.rg}
        onChangeText={(texto) => onAlterar('rg', texto)}
      />
    </>
  );
}
