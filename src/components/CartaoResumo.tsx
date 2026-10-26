import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/constants/cores';

type CartaoProps = {
  titulo: string;
  onEditar: () => void;
  children: ReactNode;
};

export function CartaoResumo({ titulo, onEditar, children }: CartaoProps) {
  return (
    <View style={styles.cartao}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Pressable onPress={onEditar} hitSlop={8}>
          <Text style={styles.editar}>Editar</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

type LinhaProps = {
  rotulo: string;
  valor: string;
};

export function LinhaResumo({ rotulo, valor }: LinhaProps) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
  },
  editar: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.primaria,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rotulo: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  valor: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 14,
    color: cores.texto,
  },
});
