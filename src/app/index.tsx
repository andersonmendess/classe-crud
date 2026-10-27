import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CadastroFlutuante } from '@/components/CadastroFlutuante';
import { cores } from '@/constants/cores';
import { listarEmpresas, type Empresa } from '@/database/empresas';
import { listarPessoas, type Pessoa } from '@/database/pessoas';
import { mostrarAviso } from '@/services/avisos';
import { formatarCnpj } from '@/utils/documentos';

type Aba = 'pessoas' | 'empresas';

const ABAS: Aba[] = ['pessoas', 'empresas'];
const LIMITE_PARA_BUSCA = 10;

export default function TelaListaCadastros() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const [aba, setAba] = useState<Aba>('pessoas');
  const [busca, setBusca] = useState('');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useFocusEffect(
    useCallback(() => {
      Promise.all([listarPessoas(db), listarEmpresas(db)])
        .then(([listaPessoas, listaEmpresas]) => {
          setPessoas(listaPessoas);
          setEmpresas(listaEmpresas);
        })
        .catch(() => mostrarAviso('Não foi possível carregar os cadastros.'));
    }, [db])
  );

  const termo = busca.trim().toLowerCase();
  const quantidade = aba === 'pessoas' ? pessoas.length : empresas.length;
  const mensagemVazia = termo
    ? 'Nenhum resultado para a busca.'
    : aba === 'pessoas'
      ? 'Nenhuma pessoa cadastrada ainda.'
      : 'Nenhuma empresa cadastrada ainda.';

  const conteudoLista = { paddingHorizontal: 16, paddingBottom: 96 + insets.bottom, gap: 10 };

  return (
    <View style={styles.container}>
      <View style={styles.abas}>
        {ABAS.map((valor) => {
          const selecionada = aba === valor;

          return (
            <Pressable
              key={valor}
              style={[styles.aba, selecionada && styles.abaSelecionada]}
              onPress={() => {
                setAba(valor);
                setBusca('');
              }}>
              <Text style={[styles.textoAba, selecionada && styles.textoAbaSelecionada]}>
                {valor === 'pessoas' ? 'Pessoas' : 'Empresas'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {quantidade > LIMITE_PARA_BUSCA ? (
        <TextInput
          placeholder="Buscar"
          placeholderTextColor={cores.textoSecundario}
          value={busca}
          onChangeText={setBusca}
          style={styles.busca}
        />
      ) : null}

      {aba === 'pessoas' ? (
        <FlatList
          data={pessoas.filter((pessoa) =>
            `${pessoa.nome} ${pessoa.email}`.toLowerCase().includes(termo)
          )}
          keyExtractor={(pessoa) => String(pessoa.id)}
          contentContainerStyle={conteudoLista}
          ListEmptyComponent={<Text style={styles.vazio}>{mensagemVazia}</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.item, pressed && styles.itemPressionado]}
              onPress={() => router.push({ pathname: '/pessoa/[id]', params: { id: String(item.id) } })}>
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
      ) : (
        <FlatList
          data={empresas.filter((empresa) =>
            `${empresa.razaoSocial} ${empresa.nomeFantasia ?? ''} ${empresa.cnpj}`
              .toLowerCase()
              .includes(termo)
          )}
          keyExtractor={(empresa) => String(empresa.id)}
          contentContainerStyle={conteudoLista}
          ListEmptyComponent={<Text style={styles.vazio}>{mensagemVazia}</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.item, pressed && styles.itemPressionado]}
              onPress={() =>
                router.push({ pathname: '/empresa/[id]', params: { id: String(item.id) } })
              }>
              <View style={styles.avatar}>
                <Text style={styles.avatarTexto}>{iniciais(item.razaoSocial)}</Text>
              </View>
              <View style={styles.textos}>
                <Text style={styles.nome}>{item.razaoSocial}</Text>
                <Text style={styles.detalhe}>{formatarCnpj(item.cnpj)}</Text>
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
  abas: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  abaSelecionada: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  textoAba: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.textoSecundario,
  },
  textoAbaSelecionada: {
    color: cores.superficie,
  },
  busca: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: cores.texto,
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
