import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CampoTexto } from '@/components/CampoTexto';
import { CamposEndereco } from '@/components/CamposEndereco';
import { cores } from '@/constants/cores';
import type { DadosPessoa } from '@/database/pessoas';
import { dataBrParaIso, formatarDataBr, isoParaDataBr } from '@/utils/data';
import { formatarCep, formatarCpf } from '@/utils/documentos';
import { validarPessoa, type ErrosPessoa } from '@/utils/validacao';

type DadosFormulario = {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

type Props = {
  pessoa?: DadosPessoa;
  onSalvar: (pessoa: DadosPessoa) => void;
};

export function FormularioPessoa({ pessoa, onSalvar }: Props) {
  const insets = useSafeAreaInsets();
  const [dados, setDados] = useState<DadosFormulario>(() => paraDadosFormulario(pessoa));
  const [erros, setErros] = useState<ErrosPessoa>({});

  function atualizar(campo: keyof DadosFormulario, texto: string) {
    setDados((anterior) => ({ ...anterior, [campo]: texto }));
  }

  function handleSalvar() {
    const dataIso = dataBrParaIso(dados.dataNascimento);

    const pessoaNova: DadosPessoa = {
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      telefone: dados.telefone.trim(),
      dataNascimento: dataIso ?? '',
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

    const novosErros = validarPessoa(pessoaNova);
    if (dados.dataNascimento && !dataIso) {
      novosErros.dataNascimento = 'Data inválida. Use DD/MM/AAAA.';
    }
    setErros(novosErros);

    if (Object.keys(novosErros).length === 0) {
      onSalvar(pessoaNova);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.teclado} behavior="padding">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.conteudo, { paddingBottom: 16 + insets.bottom }]}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Dados pessoais</Text>

        <CampoTexto
          label="Nome"
          value={dados.nome}
          onChangeText={(texto) => atualizar('nome', texto)}
          erro={erros.nome}
          autoCapitalize="words"
        />
        <CampoTexto
          label="E-mail"
          value={dados.email}
          onChangeText={(texto) => atualizar('email', texto)}
          erro={erros.email}
          keyboardType="email-address"
        />
        <CampoTexto
          label="Telefone"
          value={dados.telefone}
          onChangeText={(texto) => atualizar('telefone', texto)}
          erro={erros.telefone}
          keyboardType="phone-pad"
        />
        <CampoTexto
          label="Data de nascimento (DD/MM/AAAA)"
          value={dados.dataNascimento}
          onChangeText={(texto) => atualizar('dataNascimento', formatarDataBr(texto))}
          erro={erros.dataNascimento}
          keyboardType="number-pad"
        />
        <CampoTexto
          label="CPF"
          value={dados.cpf}
          onChangeText={(texto) => atualizar('cpf', formatarCpf(texto))}
          erro={erros.cpf}
          keyboardType="number-pad"
        />
        <CampoTexto
          label="RG (opcional)"
          value={dados.rg}
          onChangeText={(texto) => atualizar('rg', texto)}
        />

        <Text style={styles.titulo}>Endereço</Text>

        <CamposEndereco dados={dados} erros={erros} onAlterar={atualizar} />

        <Pressable style={styles.botaoSalvar} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Salvar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function paraDadosFormulario(pessoa?: DadosPessoa): DadosFormulario {
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
  titulo: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
  },
  botaoSalvar: {
    backgroundColor: cores.primaria,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  textoBotao: {
    color: cores.superficie,
    fontSize: 16,
    fontWeight: '600',
  },
});
