import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/constants/cores';
import type { Documento } from '@/database/documentos';

type Props = {
  documento: Documento | null;
  onFechar: () => void;
};

export function ModalImagem({ documento, onFechar }: Props) {
  return (
    <Modal visible={documento !== null} transparent animationType="fade" onRequestClose={onFechar}>
      <View style={styles.fundo}>
        {documento ? (
          <Image source={{ uri: documento.caminho }} style={styles.imagem} contentFit="contain" />
        ) : null}
        <Pressable style={styles.fechar} onPress={onFechar}>
          <Text style={styles.textoFechar}>Fechar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  imagem: {
    flex: 1,
  },
  fechar: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: cores.superficie,
  },
  textoFechar: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
  },
});
