import { StyleSheet, Text } from 'react-native';

import { CampoTexto } from '@/components/CampoTexto';
import type { DadosFormularioEmpresa } from '@/components/empresa/tipos';
import { cores } from '@/constants/cores';
import type { FocoEncadeado } from '@/hooks/useFocoEncadeado';
import { formatarCnpj, formatarCpf, formatarTelefone } from '@/utils/documentos';
import type { Erros } from '@/utils/validacao';

type Props = {
  dados: DadosFormularioEmpresa;
  erros: Erros;
  onAlterar: (campo: keyof DadosFormularioEmpresa, texto: string) => void;
  foco: FocoEncadeado;
};

export function EtapaDadosEmpresa({ dados, erros, onAlterar, foco }: Props) {
  return (
    <>
      <CampoTexto
        label="Razão social"
        value={dados.razaoSocial}
        onChangeText={(texto) => onAlterar('razaoSocial', texto)}
        erro={erros.razaoSocial}
        autoCapitalize="words"
        foco={foco}
        campo="razaoSocial"
      />
      <CampoTexto
        label="Nome fantasia (opcional)"
        value={dados.nomeFantasia}
        onChangeText={(texto) => onAlterar('nomeFantasia', texto)}
        autoCapitalize="words"
        foco={foco}
        campo="nomeFantasia"
      />
      <CampoTexto
        label="CNPJ"
        value={dados.cnpj}
        onChangeText={(texto) => onAlterar('cnpj', formatarCnpj(texto))}
        erro={erros.cnpj}
        foco={foco}
        campo="cnpj"
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

      <Text style={styles.secao}>Representante legal</Text>

      <CampoTexto
        label="Nome do representante"
        value={dados.representanteNome}
        onChangeText={(texto) => onAlterar('representanteNome', texto)}
        erro={erros.representanteNome}
        autoCapitalize="words"
        foco={foco}
        campo="representanteNome"
      />
      <CampoTexto
        label="CPF do representante"
        value={dados.representanteCpf}
        onChangeText={(texto) => onAlterar('representanteCpf', formatarCpf(texto))}
        erro={erros.representanteCpf}
        keyboardType="number-pad"
        foco={foco}
        campo="representanteCpf"
      />
      <CampoTexto
        label="Cargo (opcional)"
        value={dados.representanteCargo}
        onChangeText={(texto) => onAlterar('representanteCargo', texto)}
        autoCapitalize="words"
        foco={foco}
        campo="representanteCargo"
      />
    </>
  );
}

const styles = StyleSheet.create({
  secao: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
  },
});
