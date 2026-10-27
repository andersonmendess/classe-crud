import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartaoResumo, LinhaResumo } from '@/components/CartaoResumo';
import { CartaoDocumentos } from '@/components/documentos/CartaoDocumentos';
import { cores } from '@/constants/cores';
import { listarDocumentos, type Documento } from '@/database/documentos';
import { buscarPessoa, excluirPessoa, type Pessoa } from '@/database/pessoas';
import { mostrarAviso } from '@/services/avisos';
import { isoParaDataBr } from '@/utils/data';
import { formatarCep, formatarCpf, formatarTelefone } from '@/utils/documentos';
import { tiposDocumentoPessoa } from '@/utils/tiposDocumento';

export default function TelaPessoa() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pessoaId = Number(id);

  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      Promise.all([buscarPessoa(db, pessoaId), listarDocumentos(db, { tipo: 'pessoa', id: pessoaId })])
        .then(([encontrada, docs]) => {
          setPessoa(encontrada);
          setDocumentos(docs);
        })
        .catch(() => mostrarAviso('Não foi possível carregar a pessoa.'))
        .finally(() => setCarregando(false));
    }, [db, pessoaId])
  );

  function editar(etapa: number) {
    router.push({
      pathname: '/pessoa/[id]/editar',
      params: { id: String(pessoaId), etapa: String(etapa) },
    });
  }

  function handleExcluir() {
    Alert.alert('Excluir pessoa', `Deseja excluir ${pessoa?.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirPessoa(db, pessoaId);
            mostrarAviso('Pessoa excluída.');
            router.back();
          } catch {
            mostrarAviso('Não foi possível excluir a pessoa.');
          }
        },
      },
    ]);
  }

  if (carregando) {
    return <Text style={styles.mensagem}>Carregando...</Text>;
  }

  if (!pessoa) {
    return <Text style={styles.mensagem}>Pessoa não encontrada.</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: pessoa.nome,
          headerRight: () => (
            <Pressable onPress={() => editar(1)} hitSlop={12}>
              <Text style={styles.textoCabecalho}>Editar</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.conteudo, { paddingBottom: 16 + insets.bottom }]}>
        <CartaoResumo titulo="Dados pessoais" onEditar={() => editar(1)}>
          <LinhaResumo rotulo="Nome" valor={pessoa.nome} />
          <LinhaResumo rotulo="E-mail" valor={pessoa.email} />
          <LinhaResumo rotulo="Telefone" valor={formatarTelefone(pessoa.telefone)} />
          <LinhaResumo rotulo="Nascimento" valor={isoParaDataBr(pessoa.dataNascimento)} />
          <LinhaResumo rotulo="CPF" valor={formatarCpf(pessoa.cpf)} />
          <LinhaResumo rotulo="RG" valor={pessoa.rg ?? ''} />
        </CartaoResumo>

        <CartaoResumo titulo="Endereço" onEditar={() => editar(2)}>
          <LinhaResumo rotulo="CEP" valor={formatarCep(pessoa.cep)} />
          <LinhaResumo rotulo="Logradouro" valor={pessoa.logradouro} />
          <LinhaResumo rotulo="Número" valor={pessoa.numero} />
          <LinhaResumo rotulo="Complemento" valor={pessoa.complemento} />
          <LinhaResumo rotulo="Bairro" valor={pessoa.bairro} />
          <LinhaResumo rotulo="Cidade" valor={pessoa.cidade} />
          <LinhaResumo rotulo="UF" valor={pessoa.uf} />
        </CartaoResumo>

        <CartaoDocumentos
          documentos={documentos}
          tipos={tiposDocumentoPessoa}
          onEditar={() => editar(3)}
        />

        <Pressable style={styles.botaoExcluir} onPress={handleExcluir}>
          <Text style={styles.textoExcluir}>Excluir pessoa</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mensagem: {
    padding: 16,
    color: cores.texto,
  },
  scroll: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 16,
    gap: 14,
  },
  textoCabecalho: {
    color: cores.superficie,
    fontSize: 16,
    fontWeight: '600',
  },
  botaoExcluir: {
    marginTop: 8,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.erro,
    backgroundColor: cores.superficie,
    alignItems: 'center',
  },
  textoExcluir: {
    color: cores.erro,
    fontSize: 16,
    fontWeight: '600',
  },
});
