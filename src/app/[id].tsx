import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormularioPessoa } from '@/components/FormularioPessoa';
import { cores } from '@/constants/cores';
import {
  atualizarPessoa,
  buscarPessoa,
  excluirPessoa,
  type DadosPessoa,
  type Pessoa,
} from '@/database/pessoas';

export default function TelaEditarPessoa() {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pessoaId = Number(id);
  const insets = useSafeAreaInsets();

  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarPessoa(db, pessoaId).then((encontrada) => {
      setPessoa(encontrada);
      setCarregando(false);
    });
  }, [db, pessoaId]);

  async function handleSalvar(dados: DadosPessoa) {
    await atualizarPessoa(db, pessoaId, dados);
    router.back();
  }

  function handleExcluir() {
    Alert.alert('Excluir pessoa', `Deseja excluir ${pessoa?.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirPessoa(db, pessoaId);
          router.back();
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
    <View style={styles.container}>
      <FormularioPessoa pessoa={pessoa} onSalvar={handleSalvar} />

      <Pressable
        style={[styles.botaoExcluir, { marginBottom: 16 + insets.bottom }]}
        onPress={handleExcluir}>
        <Text style={styles.textoBotao}>Excluir</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  mensagem: {
    padding: 16,
    color: cores.texto,
  },
  botaoExcluir: {
    backgroundColor: cores.erro,
    marginHorizontal: 16,
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
