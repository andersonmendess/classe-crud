import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartaoResumo, LinhaResumo } from '@/components/CartaoResumo';
import { CartaoDocumentos } from '@/components/documentos/CartaoDocumentos';
import { cores } from '@/constants/cores';
import { listarDocumentos, type Documento } from '@/database/documentos';
import { buscarEmpresa, excluirEmpresa, type Empresa } from '@/database/empresas';
import { mostrarAviso } from '@/services/avisos';
import { formatarCep, formatarCnpj, formatarTelefone } from '@/utils/documentos';
import { tiposDocumentoEmpresa } from '@/utils/tiposDocumento';

export default function TelaEmpresa() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const empresaId = Number(id);

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      Promise.all([buscarEmpresa(db, empresaId), listarDocumentos(db, { tipo: 'empresa', id: empresaId })])
        .then(([encontrada, docs]) => {
          setEmpresa(encontrada);
          setDocumentos(docs);
        })
        .catch(() => mostrarAviso('Não foi possível carregar a empresa.'))
        .finally(() => setCarregando(false));
    }, [db, empresaId])
  );

  function editar(etapa: number) {
    router.push({
      pathname: '/empresa/[id]/editar',
      params: { id: String(empresaId), etapa: String(etapa) },
    });
  }

  function handleExcluir() {
    Alert.alert('Excluir empresa', `Deseja excluir ${empresa?.razaoSocial}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirEmpresa(db, empresaId);
            mostrarAviso('Empresa excluída.');
            router.back();
          } catch {
            mostrarAviso('Não foi possível excluir a empresa.');
          }
        },
      },
    ]);
  }

  if (carregando) {
    return <Text style={styles.mensagem}>Carregando...</Text>;
  }

  if (!empresa) {
    return <Text style={styles.mensagem}>Empresa não encontrada.</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: empresa.razaoSocial,
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
        <CartaoResumo titulo="Dados da empresa" onEditar={() => editar(1)}>
          <LinhaResumo rotulo="Razão social" valor={empresa.razaoSocial} />
          <LinhaResumo rotulo="Nome fantasia" valor={empresa.nomeFantasia ?? ''} />
          <LinhaResumo rotulo="CNPJ" valor={formatarCnpj(empresa.cnpj)} />
          <LinhaResumo rotulo="E-mail" valor={empresa.email} />
          <LinhaResumo rotulo="Telefone" valor={formatarTelefone(empresa.telefone)} />
        </CartaoResumo>

        <CartaoResumo titulo="Endereço" onEditar={() => editar(2)}>
          <LinhaResumo rotulo="CEP" valor={formatarCep(empresa.cep)} />
          <LinhaResumo rotulo="Logradouro" valor={empresa.logradouro} />
          <LinhaResumo rotulo="Número" valor={empresa.numero} />
          <LinhaResumo rotulo="Complemento" valor={empresa.complemento} />
          <LinhaResumo rotulo="Bairro" valor={empresa.bairro} />
          <LinhaResumo rotulo="Cidade" valor={empresa.cidade} />
          <LinhaResumo rotulo="UF" valor={empresa.uf} />
        </CartaoResumo>

        <CartaoDocumentos
          documentos={documentos}
          tipos={tiposDocumentoEmpresa}
          onEditar={() => editar(3)}
        />

        <Pressable style={styles.botaoExcluir} onPress={handleExcluir}>
          <Text style={styles.textoExcluir}>Excluir empresa</Text>
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
