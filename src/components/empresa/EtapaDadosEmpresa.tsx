import { CampoTexto } from '@/components/CampoTexto';
import type { DadosFormularioEmpresa } from '@/components/empresa/tipos';
import { formatarCnpj } from '@/utils/documentos';
import type { ErrosEmpresa } from '@/utils/validacao';

type Props = {
  dados: DadosFormularioEmpresa;
  erros: ErrosEmpresa;
  onAlterar: (campo: keyof DadosFormularioEmpresa, texto: string) => void;
};

export function EtapaDadosEmpresa({ dados, erros, onAlterar }: Props) {
  return (
    <>
      <CampoTexto
        label="Razão social"
        value={dados.razaoSocial}
        onChangeText={(texto) => onAlterar('razaoSocial', texto)}
        erro={erros.razaoSocial}
        autoCapitalize="words"
      />
      <CampoTexto
        label="Nome fantasia (opcional)"
        value={dados.nomeFantasia}
        onChangeText={(texto) => onAlterar('nomeFantasia', texto)}
        autoCapitalize="words"
      />
      <CampoTexto
        label="CNPJ"
        value={dados.cnpj}
        onChangeText={(texto) => onAlterar('cnpj', formatarCnpj(texto))}
        erro={erros.cnpj}
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
    </>
  );
}
