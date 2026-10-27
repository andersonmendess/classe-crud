import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/constants/cores';
import type { Documento } from '@/database/documentos';
import { ehImagem } from '@/services/abrirDocumento';
import { extensaoDoArquivo, formatarTamanho } from '@/utils/arquivo';

type Props = {
  documento: Documento;
  rotuloTipo: string;
  onAbrir: () => void;
  onRemover?: () => void;
};

export function ItemDocumento({ documento, rotuloTipo, onAbrir, onRemover }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.item, pressed && styles.pressionado]} onPress={onAbrir}>
      {ehImagem(documento) ? (
        <Image source={{ uri: documento.caminho }} style={styles.miniatura} contentFit="cover" />
      ) : (
        <View style={[styles.miniatura, styles.miniaturaArquivo]}>
          <Text style={styles.extensao}>{extensaoDoArquivo(documento.nomeArquivo)}</Text>
        </View>
      )}

      <View style={styles.textos}>
        <Text style={styles.tipo}>{rotuloTipo}</Text>
        <Text style={styles.nome} numberOfLines={1} ellipsizeMode="middle">
          {documento.nomeArquivo}
        </Text>
        <Text style={styles.tamanho}>{formatarTamanho(documento.tamanho)}</Text>
      </View>

      {onRemover ? (
        <Pressable onPress={onRemover} hitSlop={12} style={styles.botaoRemover}>
          <Text style={styles.textoRemover}>Remover</Text>
        </Pressable>
      ) : (
        <Text style={styles.seta}>›</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  pressionado: {
    opacity: 0.7,
  },
  miniatura: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: cores.primariaClara,
  },
  miniaturaArquivo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  extensao: {
    fontSize: 13,
    fontWeight: '700',
    color: cores.primaria,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  tipo: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.texto,
  },
  nome: {
    fontSize: 13,
    color: cores.textoSecundario,
  },
  tamanho: {
    fontSize: 12,
    color: cores.textoSecundario,
  },
  botaoRemover: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FDECEA',
  },
  textoRemover: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.erro,
  },
  seta: {
    fontSize: 26,
    color: cores.textoSecundario,
  },
});
