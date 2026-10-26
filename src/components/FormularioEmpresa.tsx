import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CampoTexto } from '@/components/CampoTexto';
import { CamposEndereco } from '@/components/CamposEndereco';
import { cores } from '@/constants/cores';
import type { DadosEmpresa } from '@/database/empresas';
import { formatarCnpj } from '@/utils/documentos';
import { validarEmpresa, type ErrosEmpresa } from '@/utils/validacao';

type DadosFormulario = {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

const dadosIniciais: DadosFormulario = {
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
  const [dados, setDados] = useState<DadosFormulario>(dadosIniciais);
  const [erros, setErros] = useState<ErrosEmpresa>({});

  function atualizar(campo: keyof DadosFormulario, texto: string) {
    setDados((anterior) => ({ ...anterior, [campo]: texto }));
  }

  function handleSalvar() {
    const empresa: DadosEmpresa = {
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

    const novosErros = validarEmpresa(empresa);
    setErros(novosErros);

    if (Object.keys(novosErros).length === 0) {
      onSalvar(empresa);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.teclado} behavior="padding">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.conteudo, { paddingBottom: 16 + insets.bottom }]}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Dados da empresa</Text>

        <CampoTexto
          label="Razão social"
          value={dados.razaoSocial}
          onChangeText={(texto) => atualizar('razaoSocial', texto)}
          erro={erros.razaoSocial}
          autoCapitalize="words"
        />
        <CampoTexto
          label="Nome fantasia (opcional)"
          value={dados.nomeFantasia}
          onChangeText={(texto) => atualizar('nomeFantasia', texto)}
          autoCapitalize="words"
        />
        <CampoTexto
          label="CNPJ"
          value={dados.cnpj}
          onChangeText={(texto) => atualizar('cnpj', formatarCnpj(texto))}
          erro={erros.cnpj}
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

        <Text style={styles.titulo}>Endereço</Text>

        <CamposEndereco dados={dados} erros={erros} onAlterar={atualizar} />

        <Pressable style={styles.botaoSalvar} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Salvar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
