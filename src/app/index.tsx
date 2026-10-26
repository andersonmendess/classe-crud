import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CadastroFlutuante } from '@/components/CadastroFlutuante';
import { cores } from '@/constants/cores';
import { listarPessoas, type Pessoa } from '@/database/pessoas';

export default function TelaListaPessoas() {
  const db = useSQLiteContext();
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      listarPessoas(db).then(setPessoas);
    }, [db])
  );

  return (
    <View style={styles.container}>
      {pessoas.length === 0 ? (
        <Text style={styles.vazio}>Nenhum cadastrado ainda.</Text>
      ) : (
        <FlatList
          data={pessoas}
          keyExtractor={(pessoa) => String(pessoa.id)}
          contentContainerStyle={[styles.listaConteudo, { paddingBottom: 96 + insets.bottom }]}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.item, pressed && styles.itemPressionado]}
              onPress={() => router.push({ pathname: '/[id]', params: { id: String(item.id) } })}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTexto}>{iniciais(item.nome)}</Text>
              </View>
              <View style={styles.textos}>
                <Text style={styles.nome}>{item.nome}</Text>
                {item.email ? <Text style={styles.detalhe}>{item.email}</Text> : null}
              </View>
            </Pressable>
          )}
        />
      )}

      <CadastroFlutuante />
    </View>
  );
}

function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  listaConteudo: {
    padding: 16,
    gap: 10,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 15,
    color: cores.textoSecundario,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: cores.superficie,
    padding: 14,
    borderRadius: 14,
  },
  itemPressionado: {
    opacity: 0.7,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: cores.primaria,
    fontSize: 16,
    fontWeight: '700',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
  },
  detalhe: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
});
