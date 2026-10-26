import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CamposEndereco } from '@/components/CamposEndereco';
import { EtapaDadosPessoais } from '@/components/pessoa/EtapaDadosPessoais';
import { EtapaRevisao } from '@/components/pessoa/EtapaRevisao';
import type { DadosFormularioPessoa } from '@/components/pessoa/tipos';
import { cores } from '@/constants/cores';
import type { DadosPessoa } from '@/database/pessoas';
import { dataBrParaIso, isoParaDataBr } from '@/utils/data';
import { formatarCep, formatarCpf } from '@/utils/documentos';
import {
  validarDadosPessoais,
  validarEndereco,
  type ErrosPessoa,
} from '@/utils/validacao';

const ETAPAS = ['Dados pessoais', 'Endereço', 'Revisar'];

type Props = {
  pessoa?: DadosPessoa;
  onSalvar: (pessoa: DadosPessoa) => void;
};

export function FormularioPessoa({ pessoa, onSalvar }: Props) {
  const insets = useSafeAreaInsets();
  const [etapa, setEtapa] = useState(1);
  const [dados, setDados] = useState<DadosFormularioPessoa>(() => paraDadosFormulario(pessoa));
  const [erros, setErros] = useState<ErrosPessoa>({});

  function atualizar(campo: keyof DadosFormularioPessoa, texto: string) {
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

    onSalvar(montarPessoa(dados));
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

        {etapa === 1 && <EtapaDadosPessoais dados={dados} erros={erros} onAlterar={atualizar} />}
        {etapa === 2 && <CamposEndereco dados={dados} erros={erros} onAlterar={atualizar} />}
        {etapa === 3 && <EtapaRevisao dados={dados} onEditar={irParaEtapa} />}

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

function validarEtapa(numero: number, dados: DadosFormularioPessoa): ErrosPessoa {
  const pessoa = montarPessoa(dados);

  if (numero === 1) {
    const erros = validarDadosPessoais(pessoa);
    if (dados.dataNascimento && !pessoa.dataNascimento) {
      erros.dataNascimento = 'Data inválida. Use DD/MM/AAAA.';
    }
    return erros;
  }

  return validarEndereco(pessoa);
}

function montarPessoa(dados: DadosFormularioPessoa): DadosPessoa {
  return {
    nome: dados.nome.trim(),
    email: dados.email.trim(),
    telefone: dados.telefone.trim(),
    dataNascimento: dataBrParaIso(dados.dataNascimento) ?? '',
    cpf: dados.cpf.replace(/\D/g, ''),
    rg: dados.rg.trim() || null,
    cep: dados.cep.replace(/\D/g, ''),
    logradouro: dados.logradouro.trim(),
    numero: dados.numero.trim(),
    complemento: dados.complemento.trim(),
    bairro: dados.bairro.trim(),
    cidade: dados.cidade.trim(),
    uf: dados.uf.trim().toUpperCase(),
  };
}

function paraDadosFormulario(pessoa?: DadosPessoa): DadosFormularioPessoa {
  return {
    nome: pessoa?.nome ?? '',
    email: pessoa?.email ?? '',
    telefone: pessoa?.telefone ?? '',
    dataNascimento: pessoa ? isoParaDataBr(pessoa.dataNascimento) : '',
    cpf: pessoa ? formatarCpf(pessoa.cpf) : '',
    rg: pessoa?.rg ?? '',
    cep: pessoa ? formatarCep(pessoa.cep) : '',
    logradouro: pessoa?.logradouro ?? '',
    numero: pessoa?.numero ?? '',
    complemento: pessoa?.complemento ?? '',
    bairro: pessoa?.bairro ?? '',
    cidade: pessoa?.cidade ?? '',
    uf: pessoa?.uf ?? '',
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
