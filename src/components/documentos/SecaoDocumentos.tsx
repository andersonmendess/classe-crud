import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ItemDocumento } from '@/components/documentos/ItemDocumento';
import { ModalImagem } from '@/components/documentos/ModalImagem';
import { cores } from '@/constants/cores';
import type { Documento } from '@/database/documentos';
import { compartilharDocumento, ehImagem } from '@/services/abrirDocumento';
import { apagarArquivo, copiarParaDocumentos } from '@/services/arquivos';
import { escolherArquivo, tirarFoto, type ArquivoSelecionado } from '@/services/selecionarArquivo';
import { rotuloDoTipo, type TipoDocumento } from '@/utils/tiposDocumento';

const LIMITE_BYTES = 10 * 1024 * 1024;

type Props = {
  tipos: TipoDocumento[];
  documentos: Documento[];
  onAdicionar: (documento: Documento) => void;
  onRemover: (documento: Documento) => void;
};

export function SecaoDocumentos({ tipos, documentos, onAdicionar, onRemover }: Props) {
  const [tipoSelecionado, setTipoSelecionado] = useState(tipos[0].valor);
  const [erro, setErro] = useState<string>();
  const [imagemAberta, setImagemAberta] = useState<Documento | null>(null);

  async function anexar(selecionar: () => Promise<ArquivoSelecionado | null>) {
    try {
      const arquivo = await selecionar();
      if (!arquivo) return;

      const copia = await copiarParaDocumentos(arquivo.uri, arquivo.nome);

      if (copia.tamanho > LIMITE_BYTES) {
        apagarArquivo(copia.caminho);
        setErro('O arquivo passa de 10 MB.');
        return;
      }

      onAdicionar({
        tipo: tipoSelecionado,
        nomeArquivo: arquivo.nome,
        caminho: copia.caminho,
        mimeType: arquivo.mimeType,
        tamanho: copia.tamanho,
      });
      setErro(undefined);
    } catch (erroCapturado) {
      setErro(
        erroCapturado instanceof Error ? erroCapturado.message : 'Não foi possível anexar o arquivo.'
      );
    }
  }

  function confirmarRemocao(documento: Documento) {
    Alert.alert('Remover documento', `Deseja remover ${documento.nomeArquivo}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => onRemover(documento) },
    ]);
  }

  function abrir(documento: Documento) {
    if (ehImagem(documento)) {
      setImagemAberta(documento);
      return;
    }

    compartilharDocumento(documento);
  }

  return (
    <>
      <View style={styles.painel}>
        <Text style={styles.subtitulo}>Tipo do documento</Text>
        <View style={styles.chips}>
          {tipos.map((tipo) => {
            const selecionado = tipo.valor === tipoSelecionado;

            return (
              <Pressable
                key={tipo.valor}
                style={[styles.chip, selecionado && styles.chipSelecionado]}
                onPress={() => setTipoSelecionado(tipo.valor)}>
                <Text style={[styles.textoChip, selecionado && styles.textoChipSelecionado]}>
                  {tipo.rotulo}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.acoes}>
          <Pressable
            style={({ pressed }) => [styles.botaoAcao, pressed && styles.pressionado]}
            onPress={() => anexar(tirarFoto)}>
            <Text style={styles.textoAcao}>Tirar foto</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.botaoAcao, pressed && styles.pressionado]}
            onPress={() => anexar(escolherArquivo)}>
            <Text style={styles.textoAcao}>Escolher arquivo</Text>
          </Pressable>
        </View>

        <Text style={styles.ajuda}>PDF ou imagem, até 10 MB.</Text>
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      </View>

      {documentos.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTitulo}>Nenhum documento anexado</Text>
          <Text style={styles.vazioTexto}>
            Os documentos são opcionais. Escolha o tipo acima e anexe uma foto ou um arquivo.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.subtitulo}>Anexados ({documentos.length})</Text>
          {documentos.map((documento) => (
            <ItemDocumento
              key={documento.caminho}
              documento={documento}
              rotuloTipo={rotuloDoTipo(tipos, documento.tipo)}
              onAbrir={() => abrir(documento)}
              onRemover={() => confirmarRemocao(documento)}
            />
          ))}
        </>
      )}

      <ModalImagem documento={imagemAberta} onFechar={() => setImagemAberta(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  painel: {
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: cores.superficie,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.texto,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  chipSelecionado: {
    backgroundColor: cores.primariaClara,
    borderColor: cores.primaria,
  },
  textoChip: {
    fontSize: 14,
    color: cores.texto,
  },
  textoChipSelecionado: {
    color: cores.primaria,
    fontWeight: '600',
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoAcao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: cores.primariaClara,
  },
  pressionado: {
    opacity: 0.7,
  },
  textoAcao: {
    color: cores.primaria,
    fontSize: 15,
    fontWeight: '600',
  },
  ajuda: {
    fontSize: 12,
    color: cores.textoSecundario,
  },
  erro: {
    color: cores.erro,
    fontSize: 13,
  },
  vazio: {
    alignItems: 'center',
    gap: 4,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: cores.borda,
  },
  vazioTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.texto,
  },
  vazioTexto: {
    fontSize: 13,
    textAlign: 'center',
    color: cores.textoSecundario,
  },
});
