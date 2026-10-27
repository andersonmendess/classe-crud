import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/constants/cores';

type Props = {
  titulos: string[];
  atual: number;
  onIr: (etapa: number) => void;
};

export function ProgressoEtapas({ titulos, atual, onIr }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.progresso}>
        Passo {atual} de {titulos.length}
      </Text>

      <View style={styles.barras}>
        {titulos.map((titulo, indice) => {
          const etapa = indice + 1;
          const concluida = etapa < atual;

          return (
            <Pressable
              key={titulo}
              disabled={!concluida}
              onPress={() => onIr(etapa)}
              hitSlop={6}
              style={styles.barraArea}>
              <View style={[styles.barra, etapa <= atual && styles.barraAtiva]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  progresso: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.textoSecundario,
  },
  barras: {
    flexDirection: 'row',
    gap: 6,
  },
  barraArea: {
    flex: 1,
  },
  barra: {
    height: 6,
    borderRadius: 3,
    backgroundColor: cores.borda,
  },
  barraAtiva: {
    backgroundColor: cores.primaria,
  },
});
