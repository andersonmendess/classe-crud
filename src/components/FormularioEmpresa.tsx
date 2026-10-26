import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CamposEndereco } from '@/components/CamposEndereco';
import { EtapaDadosEmpresa } from '@/components/empresa/EtapaDadosEmpresa';
import { EtapaRevisaoEmpresa } from '@/components/empresa/EtapaRevisaoEmpresa';
import type { DadosFormularioEmpresa } from '@/components/empresa/tipos';
import { cores } from '@/constants/cores';
import type { DadosEmpresa } from '@/database/empresas';
import { validarDadosEmpresa, validarEndereco, type ErrosEmpresa } from '@/utils/validacao';

const ETAPAS = ['Dados da empresa', 'Endereço', 'Revisar'];

const dadosIniciais: DadosFormularioEmpresa = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  email: '',
  telefone: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
};

type Props = {
  onSalvar: (empresa: DadosEmpresa) => void;
};

export function FormularioEmpresa({ onSalvar }: Props) {
  const insets = useSafeAreaInsets();
  const [etapa, setEtapa] = useState(1);
  const [dados, setDados] = useState<DadosFormularioEmpresa>(dadosIniciais);
  const [erros, setErros] = useState<ErrosEmpresa>({});

  function atualizar(campo: keyof DadosFormularioEmpresa, texto: string) {
    setDados((anterior) => ({ ...anterior, [campo]: texto }));
  }

  function irParaEtapa(numero: number) {
    setErros({});
    setEtapa(numero);
  }

  function avancar() {
    const novosErros = validarEtapa(etapa, dados);
    setErros(novosErros);

    if (Object.keys(novosErros).length === 0) {
      irParaEtapa(etapa + 1);
    }
  }

  function salvar() {
    for (const numero of [1, 2]) {
      const novosErros = validarEtapa(numero, dados);

      if (Object.keys(novosErros).length > 0) {
        setErros(novosErros);
        setEtapa(numero);
        return;
      }
    }

    onSalvar(montarEmpresa(dados));
  }

  return (
    <KeyboardAvoidingView style={styles.teclado} behavior="padding">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.conteudo, { paddingBottom: 16 + insets.bottom }]}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.progresso}>
          Passo {etapa} de {ETAPAS.length}
        </Text>
        <Text style={styles.tituloEtapa}>{ETAPAS[etapa - 1]}</Text>

        {etapa === 1 && <EtapaDadosEmpresa dados={dados} erros={erros} onAlterar={atualizar} />}
        {etapa === 2 && <CamposEndereco dados={dados} erros={erros} onAlterar={atualizar} />}
        {etapa === 3 && <EtapaRevisaoEmpresa dados={dados} onEditar={irParaEtapa} />}

        <View style={styles.navegacao}>
          {etapa > 1 && (
            <Pressable style={styles.botaoVoltar} onPress={() => irParaEtapa(etapa - 1)}>
              <Text style={styles.textoBotaoVoltar}>Voltar</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.botaoPrincipal}
            onPress={etapa < ETAPAS.length ? avancar : salvar}>
            <Text style={styles.textoBotao}>{etapa < ETAPAS.length ? 'Próximo' : 'Salvar'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function validarEtapa(numero: number, dados: DadosFormularioEmpresa): ErrosEmpresa {
  const empresa = montarEmpresa(dados);

  if (numero === 1) {
    return validarDadosEmpresa(empresa);
  }

  return validarEndereco(empresa);
}

function montarEmpresa(dados: DadosFormularioEmpresa): DadosEmpresa {
  return {
    razaoSocial: dados.razaoSocial.trim(),
    nomeFantasia: dados.nomeFantasia.trim() || null,
    cnpj: dados.cnpj.replace(/[^A-Z0-9]/g, ''),
    email: dados.email.trim(),
    telefone: dados.telefone.trim(),
    cep: dados.cep.replace(/\D/g, ''),
    logradouro: dados.logradouro.trim(),
    numero: dados.numero.trim(),
    complemento: dados.complemento.trim(),
    bairro: dados.bairro.trim(),
    cidade: dados.cidade.trim(),
    uf: dados.uf.trim().toUpperCase(),
  };
}

const styles = StyleSheet.create({
  teclado: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 16,
    gap: 14,
  },
  progresso: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.textoSecundario,
  },
  tituloEtapa: {
    fontSize: 22,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 4,
  },
  navegacao: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  botaoVoltar: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBotaoVoltar: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  botaoPrincipal: {
    flex: 1,
    backgroundColor: cores.primaria,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBotao: {
    color: cores.superficie,
    fontSize: 16,
    fontWeight: '600',
  },
});
