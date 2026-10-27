import { CampoTexto } from '@/components/CampoTexto';
import type { DadosFormularioPessoa } from '@/components/pessoa/tipos';
import type { FocoEncadeado } from '@/hooks/useFocoEncadeado';
import { formatarDataBr } from '@/utils/data';
import { formatarCpf, formatarTelefone } from '@/utils/documentos';
import type { Erros } from '@/utils/validacao';

type Props = {
  dados: DadosFormularioPessoa;
  erros: Erros;
  onAlterar: (campo: keyof DadosFormularioPessoa, texto: string) => void;
  foco: FocoEncadeado;
};

export function EtapaDadosPessoais({ dados, erros, onAlterar, foco }: Props) {
  return (
    <>
      <CampoTexto
        label="Nome"
        value={dados.nome}
        onChangeText={(texto) => onAlterar('nome', texto)}
        erro={erros.nome}
        autoCapitalize="words"
        foco={foco}
        campo="nome"
      />
      <CampoTexto
        label="E-mail"
        value={dados.email}
        onChangeText={(texto) => onAlterar('email', texto)}
        erro={erros.email}
        keyboardType="email-address"
        foco={foco}
        campo="email"
      />
      <CampoTexto
        label="Telefone"
        value={dados.telefone}
        onChangeText={(texto) => onAlterar('telefone', formatarTelefone(texto))}
        erro={erros.telefone}
        keyboardType="phone-pad"
        foco={foco}
        campo="telefone"
      />
      <CampoTexto
        label="Data de nascimento (DD/MM/AAAA)"
        value={dados.dataNascimento}
        onChangeText={(texto) => onAlterar('dataNascimento', formatarDataBr(texto))}
        erro={erros.dataNascimento}
        keyboardType="number-pad"
        foco={foco}
        campo="dataNascimento"
      />
      <CampoTexto
        label="CPF"
        value={dados.cpf}
        onChangeText={(texto) => onAlterar('cpf', formatarCpf(texto))}
        erro={erros.cpf}
        keyboardType="number-pad"
        foco={foco}
        campo="cpf"
      />
      <CampoTexto
        label="RG (opcional)"
        value={dados.rg}
        onChangeText={(texto) => onAlterar('rg', texto)}
        foco={foco}
        campo="rg"
      />
    </>
  );
}
