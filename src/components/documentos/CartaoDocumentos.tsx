import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { CartaoResumo } from '@/components/CartaoResumo';
import { ItemDocumento } from '@/components/documentos/ItemDocumento';
import { ModalImagem } from '@/components/documentos/ModalImagem';
import { cores } from '@/constants/cores';
import type { Documento } from '@/database/documentos';
import { compartilharDocumento, ehImagem } from '@/services/abrirDocumento';
import { rotuloDoTipo, type TipoDocumento } from '@/utils/tiposDocumento';

type Props = {
  documentos: Documento[];
  tipos: TipoDocumento[];
  onEditar: () => void;
};

export function CartaoDocumentos({ documentos, tipos, onEditar }: Props) {
  const [imagemAberta, setImagemAberta] = useState<Documento | null>(null);

  function abrir(documento: Documento) {
    if (ehImagem(documento)) {
      setImagemAberta(documento);
      return;
    }

    compartilharDocumento(documento);
  }

  return (
    <>
      <CartaoResumo titulo={`Documentos (${documentos.length})`} onEditar={onEditar}>
        {documentos.length === 0 ? (
          <Text style={styles.vazio}>Nenhum documento anexado.</Text>
        ) : (
          documentos.map((documento) => (
            <ItemDocumento
              key={documento.caminho}
              documento={documento}
              rotuloTipo={rotuloDoTipo(tipos, documento.tipo)}
              onAbrir={() => abrir(documento)}
            />
          ))
        )}
      </CartaoResumo>

      <ModalImagem documento={imagemAberta} onFechar={() => setImagemAberta(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  vazio: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
});
