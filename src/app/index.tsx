import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
              style={styles.item}
              onPress={() => router.push({ pathname: '/[id]', params: { id: String(item.id) } })}>
              <Text style={styles.nome}>{item.nome}</Text>
              {item.email ? <Text style={styles.detalhe}>{item.email}</Text> : null}
            </Pressable>
          )}
        />
      )}

      <Pressable
        style={[styles.botaoNovo, { bottom: 24 + insets.bottom }]}
        onPress={() => router.push('/nova')}
        accessibilityLabel="Nova pessoa">
        <Text style={styles.textoBotao}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listaConteudo: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
  botaoNovo: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
  },
  vazio: {
    textAlign: 'center',
    marginTop: 32,
    color: '#60646C',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C7C7CC',
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  detalhe: {
    fontSize: 14,
    color: '#60646C',
  },
});
