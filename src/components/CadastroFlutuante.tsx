import { router } from 'expo-router';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cores } from '@/constants/cores';

export function CadastroFlutuante() {
  const insets = useSafeAreaInsets();
  const [aberto, setAberto] = useState(false);
  const [animacao] = useState(() => new Animated.Value(0));

  function alternar() {
    setAberto(!aberto);
    Animated.timing(animacao, {
      toValue: aberto ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  function abrirCadastro(rota: '/nova' | '/nova-empresa') {
    setAberto(false);
    animacao.setValue(0);
    router.push(rota);
  }

  const deslocamento = animacao.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <View style={[styles.container, { bottom: 24 + insets.bottom }]}>
      <Animated.View
        style={[styles.opcoes, { opacity: animacao, transform: [{ translateY: deslocamento }] }]}
        pointerEvents={aberto ? 'auto' : 'none'}>
        <Pressable style={styles.opcao} onPress={() => abrirCadastro('/nova')}>
          <Text style={styles.textoOpcao}>Pessoa</Text>
        </Pressable>
        <Pressable style={styles.opcao} onPress={() => abrirCadastro('/nova-empresa')}>
          <Text style={styles.textoOpcao}>Empresa</Text>
        </Pressable>
      </Animated.View>

      <Pressable style={styles.botao} onPress={alternar} accessibilityLabel="Novo cadastro">
        <Text style={styles.textoBotao}>{aberto ? '×' : '+'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 24,
    alignItems: 'flex-end',
    gap: 12,
  },
  opcoes: {
    alignItems: 'flex-end',
    gap: 10,
  },
  opcao: {
    backgroundColor: cores.superficie,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 24,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  textoOpcao: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  botao: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: cores.primaria,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  textoBotao: {
    color: cores.superficie,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '400',
  },
});
